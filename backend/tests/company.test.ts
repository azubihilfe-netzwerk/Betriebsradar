import { vi } from 'vitest';

vi.mock('../geocoder', () => ({
  geocodeAddress: vi.fn().mockResolvedValue({ lat: 49.0069, lon: 8.4037 }),
}));

import { geocodeAddress } from '../geocoder';
import { parse } from 'graphql';
import type { TypedDocumentNode } from '@graphql-typed-document-node/core';
import { context as publicContext, contextAs, createCompany, createUser, execute, resetDb } from './setup';
import { setTransporter } from '../mailer';

const mockSendMail = vi.fn().mockResolvedValue({ messageId: 'test-message-id' });

const GET_COMPANIES = parse(`
  query GetCompanies {
    companies {
      id
      name
    }
  }
`) as TypedDocumentNode<{ companies: Array<{ id: string; name: string }> | null }, Record<string, never>>;

const GET_COMPANY_DETAIL = parse(`
  query GetCompanyDetail($id: ID!) {
    company(where: { id: $id }) {
      id
      name
      verified
      latitude
      longitude
    }
  }
`) as TypedDocumentNode<
  { company: { id: string; name: string; verified: boolean; latitude: number | null; longitude: number | null } | null },
  { id: string }
>;

const CREATE_COMPANY = parse(`
  mutation CreateCompany($data: CompanyCreateInput!) {
    createCompany(data: $data) {
      id
      name
      verified
      latitude
      longitude
    }
  }
`) as TypedDocumentNode<
  { createCompany: { id: string; name: string; verified: boolean; latitude: number | null; longitude: number | null } | null },
  { data: Record<string, unknown> }
>;

const UPDATE_COMPANY = parse(`
  mutation UpdateCompany($id: ID!, $data: CompanyUpdateInput!) {
    updateCompany(where: { id: $id }, data: $data) {
      id
      name
    }
  }
`) as TypedDocumentNode<
  { updateCompany: { id: string; name: string } | null },
  { id: string; data: Record<string, unknown> }
>;

const DELETE_COMPANY = parse(`
  mutation DeleteCompany($id: ID!) {
    deleteCompany(where: { id: $id }) {
      id
    }
  }
`) as TypedDocumentNode<
  { deleteCompany: { id: string } | null },
  { id: string }
>;

var editorContext: Awaited<ReturnType<typeof contextAs>>;
var verifiedCompanyId: string;
var verifiedCompanyName: string;

beforeAll(async () => {
  setTransporter({ sendMail: mockSendMail } as any);
  await resetDb();
  await createUser({ email: 'editor@example.com', roles: ['editor'] });
  editorContext = await contextAs('editor@example.com');

  const verifiedCompany = await createCompany({ verified: true });
  verifiedCompanyId = verifiedCompany.id;
  verifiedCompanyName = verifiedCompany.name;
});

describe('Company visibility', () => {
  it('public user sees a verified company', async () => {
    const { data } = await execute(publicContext, GET_COMPANIES);
    expect(data?.companies?.some(c => c.id === verifiedCompanyId && c.name === verifiedCompanyName)).toBe(true);
  });

  it('public user does see unverified companies', async () => {
    const { data } = await execute(editorContext, CREATE_COMPANY, {
      data: { name: 'Unverifiziert GmbH', trade: 'Tischlerei', address: 'Musterstraße 1, 10115 Berlin', contact: 'x@x.de', size: '_1to5' },
    });
    const unverifiedId = data?.createCompany?.id!;

    const { data: pub } = await execute(publicContext, GET_COMPANIES);
    const ids = pub?.companies?.map((c) => c.id) ?? [];
    expect(ids).toContain(unverifiedId);
  });

  it('editor sees both verified and unverified companies', async () => {
    const { data } = await execute(editorContext, GET_COMPANIES);
    expect((data?.companies?.length ?? 0)).toBeGreaterThanOrEqual(2);
  });
});

describe('Company creation', () => {
  it('anyone can create a company', async () => {
    const { data, errors } = await execute(publicContext, CREATE_COMPANY, {
      data: { name: 'Öffentlich erstellt', trade: 'Malerei', address: 'Testgasse 5, 80331 München', contact: 'pub@test.de', size: '_1to5' },
    });
    expect(errors).toBeUndefined();
    expect(data?.createCompany?.id).toBeDefined();
  });

  it('new company starts unverified', async () => {
    const { data } = await execute(publicContext, CREATE_COMPANY, {
      data: { name: 'Neue Firma', trade: 'Klempnerei', address: 'Neue Str. 1, 50667 Köln', contact: 'neu@test.de', size: '_30to50' },
    });
    expect(data?.createCompany?.verified).toBe(false);
  });

  it('geocodes the address on creation and stores coordinates', async () => {
    const { data } = await execute(publicContext, CREATE_COMPANY, {
      data: { name: 'Geo Firma', trade: 'Elektrik', address: 'Kaiserstraße 1, 76131 Karlsruhe', contact: 'geo@test.de', size: '_1to5' },
    });
    expect(geocodeAddress).toHaveBeenCalledWith('Kaiserstraße 1, 76131 Karlsruhe');
    expect(data?.createCompany?.latitude).toBeCloseTo(49.0069);
    expect(data?.createCompany?.longitude).toBeCloseTo(8.4037);
  });
});

describe('Company update and delete permissions', () => {
  let companyId: string;

  beforeAll(async () => {
    const { data } = await execute(publicContext, CREATE_COMPANY, {
      data: { name: 'Zu aktualisieren', trade: 'Sanitär', address: 'Updateweg 7, 20095 Hamburg', contact: 'up@test.de', size: '_50to250' },
    });
    companyId = data!.createCompany!.id;
  });

  it('editor can update a company', async () => {
    const { data, errors } = await execute(editorContext, UPDATE_COMPANY, {
      id: companyId,
      data: { name: 'Aktualisiert GmbH' },
    });
    expect(errors).toBeUndefined();
    expect(data?.updateCompany?.name).toBe('Aktualisiert GmbH');
  });

  it('public user cannot update a company', async () => {
    const { errors } = await execute(publicContext, UPDATE_COMPANY, {
      id: companyId,
      data: { name: 'Gehackt' },
    });
    expect(errors).toBeDefined();
  });

  it('public user cannot delete a company', async () => {
    const { errors } = await execute(publicContext, DELETE_COMPANY, { id: companyId });
    expect(errors).toBeDefined();
  });

  it('editor can delete a company', async () => {
    const { data, errors } = await execute(editorContext, DELETE_COMPANY, { id: companyId });
    expect(errors).toBeUndefined();
    expect(data?.deleteCompany?.id).toBe(companyId);
  });
});
