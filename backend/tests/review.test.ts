import { KeystoneContext } from '@keystone-6/core/types';
import { SampleData } from '../seed_data';
import { graphql } from './gql';
import { ReviewDurationType, ReviewPositionType, ReviewStatusType } from './gql/graphql';
import { context as publicContext, contextAs, execute, resetAndSeed } from './setup';

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

var sampleData: SampleData;
var adminContext: KeystoneContext;
var editorContext: KeystoneContext;
// ---------------------------------------------------------------------------


beforeAll(async () => {
  sampleData = await resetAndSeed();
  adminContext = await contextAs('admin@example.com');
  editorContext = await contextAs(sampleData.editorAnna.email);
});

describe("Given a submitted Review", () => {

  let reviewId : string;
  beforeAll(async () => {
    reviewId = await submitReview();
  });

  it("when a public user requests reviews, the review is not visible", async () => {
    let { data } = await execute(publicContext, GET_ALL_REVIEWS);
    expect(data?.reviews).toHaveLength(1);
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
    expect(data?.review?.status).toBe(ReviewStatusType.AwaitingReview);
    expect(data?.review?.emailVerified).toBeFalsy();
  })




});

async function submitReview(): Promise<string> {
  const companyId = sampleData.theCompany.id;

  // Submit a review without any session — context has no session attached
  const { data, errors } = await execute(publicContext, CREATE_REVIEW, {
    data: {
      name: 'Test Review',
      email: 'new-test@example.com',
      hoursPerWeek: 40,
      ageAtEmployment: 20,
      duration: ReviewDurationType.OneToFourMonths,
      yearOfHiring: '2024',
      position: ReviewPositionType.Intern,
      company: { connect: { id: companyId } },
    },
  });

  expect(errors).toBeUndefined();
  let reviewId = data?.createReview?.id;
  expect(reviewId).toBeDefined();
  if (reviewId) {
    return reviewId;
  } else {
    fail();
  }
}
