import { vi } from 'vitest';

vi.mock('../geocoder', () => ({
  geocodeAddress: vi.fn().mockResolvedValue({ lat: 49.0069, lon: 8.4037 }),
}));

import { KeystoneContext } from '@keystone-6/core/types';
import { graphql } from './gql';
import { context as publicContext, contextAs, createCompany, createUser, execute, resetDb } from './setup';
import { setTransporter } from '../mailer';
import { parse } from 'graphql';
import type { TypedDocumentNode } from '@graphql-typed-document-node/core';

// ---------------------------------------------------------------------------
// Typed document nodes — graphql-codegen infers request/response types from
// schema.graphql so wrong field names or variable types are compile-time errors.
// ---------------------------------------------------------------------------

const GET_COMPANIES = graphql(`
  query GetCompanies {
    companies {
      id
      name
    }
  }
`);

const CREATE_REVIEW = graphql(`
  mutation CreateReview($data: ReviewCreateInput!) {
    createReview(data: $data) {
      id
    }
  }
`);

const GET_REVIEW_BY_ID = graphql(`
  query GetReview($id: ID!) {
     review(where: { id: $id }) {
      id
      status
      email
      name
      emailVerified
    }
  }`);

const GET_REVIEW_ACCESS_KEY = parse(`
  query GetReviewAccessKey($id: ID!) {
    review(where: { id: $id }) {
      id
      accessKey
    }
  }
`) as TypedDocumentNode<{ review: { id: string; accessKey: string | null } | null }, { id: string }>;

const GET_ALL_REVIEWS = graphql(
  `query GetReviews {
      reviews {
        id
        status
      }
  }`
)

const GET_REVIEWS_BY_EMAIL = graphql(`
  query GetReviewsByEmail($email: String!) {
    reviews(where: { email: { equals: $email } }) {
      id
      status
    }
  }
`);

const UPDATE_REVIEW_STATUS = graphql(`
  mutation UpdateReviewStatus($id: ID!, $status: ReviewStatusType!) {
    updateReview(where: { id: $id }, data: { status: $status }) {
      id
      status
    }
  }
`);

var companyId: string;
var adminContext: KeystoneContext;
var editorContext: KeystoneContext;

const mockSendMail = vi.fn().mockResolvedValue({ messageId: 'test-message-id' });

// ---------------------------------------------------------------------------


beforeAll(async () => {
  setTransporter({ sendMail: mockSendMail } as any);
  await resetDb();

  const admin = await createUser({ email: 'admin@example.com', roles: ['admin'] });
  const editor = await createUser({ email: 'editor@example.com', roles: ['editor'] });
  const company = await createCompany();
  companyId = company.id;

  adminContext = await contextAs(admin.email);
  editorContext = await contextAs(editor.email);
});

describe("Given a submitted Review", () => {

  let reviewId : string;
  beforeAll(async () => {
    reviewId = await submitReview();
  });

  it("when a public user requests reviews, the review is not visible", async () => {
    let { data } = await execute(publicContext, GET_ALL_REVIEWS);
    expect(data?.reviews?.map(r => r.id)).not.toContain(reviewId);
  });

  it("when a public user requests the review by id, it is not returned", async () => {
    let { data } = await execute(publicContext, GET_REVIEW_BY_ID, { id: reviewId });
    expect(data?.review).toBeNull();
  });

  it("when an editor requests all reviews, then they can see it", async () => {
    let { data } = await execute(editorContext, GET_ALL_REVIEWS);
    expect(data?.reviews?.map(r => r.id)).toContain(reviewId);
  })

  it("state is AwaitingReview and email verficiation is pending", async () => {
    let {data} = await execute(adminContext, GET_REVIEW_BY_ID, {id : reviewId});
    expect(data?.review?.status).toBe('awaitingReview');
    expect(data?.review?.emailVerified).toBeFalsy();
  })

  it("a reviewer can approve the review", async () => {
    let { data, errors } = await execute(editorContext, UPDATE_REVIEW_STATUS, { id: reviewId, status: 'published' });
    expect(errors).toBeUndefined();
    expect(data?.updateReview?.status).toBe('published');
  });

});

describe("Email Verification", () => {
  let reviewId: string;
  let accessKey: string;

  beforeAll(async () => {
    mockSendMail.mockClear();
    reviewId = await submitReview('verify-test@example.com');
    const { data } = await execute(adminContext, GET_REVIEW_ACCESS_KEY, { id: reviewId });
    accessKey = data!.review!.accessKey!;
  });

  it("sends a verification email to the review's email address on creation", () => {
    expect(mockSendMail).toHaveBeenCalledWith(
      expect.objectContaining({ to: 'verify-test@example.com' })
    );
  });

  it("the verification email contains the access token in a URL", () => {
    const mailArgs = mockSendMail.mock.calls[0][0];
    expect(mailArgs.html).toContain(accessKey);
  });

  it("verifying with the correct token sets emailVerified to true", async () => {
    const result = await (publicContext as any).graphql.raw({
      query: `mutation VerifyReviewEmail($accessKey: String!) {
        verifyReviewEmail(accessKey: $accessKey)
      }`,
      variables: { accessKey },
    }) as { data: { verifyReviewEmail: boolean | null } };

    expect(result.data?.verifyReviewEmail).toBe(true);

    const { data } = await execute(adminContext, GET_REVIEW_BY_ID, { id: reviewId });
    expect(data?.review?.emailVerified).toBe(true);
  });

  it("verifying with an invalid token returns false", async () => {
    const result = await (publicContext as any).graphql.raw({
      query: `mutation VerifyReviewEmail($accessKey: String!) {
        verifyReviewEmail(accessKey: $accessKey)
      }`,
      variables: { accessKey: 'invalid-token-xyz-000' },
    }) as { data: { verifyReviewEmail: boolean | null } };

    expect(result.data?.verifyReviewEmail).toBe(false);
  });
});

async function submitReview(email = 'new-test@example.com'): Promise<string> {
  // Submit a review without any session — context has no session attached
  const { data, errors } = await execute(publicContext, CREATE_REVIEW, {
    data: {
      name: 'Test Review',
      email,
      hoursPerWeek: 40,
      ageAtEmployment: 20,
      yearOfHiring: '2024',
      position: 'intern',
      company: { connect: { id: companyId } },
    },
  });

  expect(errors).toBeUndefined();
  let reviewId = data?.createReview?.id;
  expect(reviewId).toBeDefined();
  if (reviewId) {
    return reviewId;
  } else {
    throw new Error('createReview did not return an id');
  }
}
