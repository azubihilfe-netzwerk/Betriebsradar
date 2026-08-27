import { parse } from 'graphql';
import type { TypedDocumentNode } from '@graphql-typed-document-node/core';
import { context as publicContext, contextAs, createUser, execute, resetDb } from './setup';

type UserResult = { id: string; name: string | null; email: string | null; roles: string[] | null };

const LIST_USERS = parse(`
  query ListUsers {
    users {
      id
      name
    }
  }
`) as TypedDocumentNode<{ users: UserResult[] | null }, Record<string, never>>;

const GET_USER = parse(`
  query GetUser($id: ID!) {
    user(where: { id: $id }) {
      id
      name
      email
      roles
    }
  }
`) as TypedDocumentNode<{ user: UserResult | null }, { id: string }>;

const UPDATE_USER = parse(`
  mutation UpdateUser($id: ID!, $data: UserUpdateInput!) {
    updateUser(where: { id: $id }, data: $data) {
      id
      name
      email
      roles
    }
  }
`) as TypedDocumentNode<{ updateUser: UserResult | null }, { id: string; data: Record<string, unknown> }>;

const LOGIN = parse(`
  mutation Login($email: String!, $password: String!) {
    authenticateUserWithPassword(email: $email, password: $password) {
      ... on UserAuthenticationWithPasswordSuccess {
        item {
          id
        }
      }
      ... on UserAuthenticationWithPasswordFailure {
        message
      }
    }
  }
`) as TypedDocumentNode<
  { authenticateUserWithPassword: { item?: { id: string }; message?: string } | null },
  { email: string; password: string }
>;

const CREATE_USER = parse(`
  mutation CreateUser($data: UserCreateInput!) {
    createUser(data: $data) {
      id
    }
  }
`) as TypedDocumentNode<{ createUser: { id: string } | null }, { data: Record<string, unknown> }>;

const DELETE_USER = parse(`
  mutation DeleteUser($id: ID!) {
    deleteUser(where: { id: $id }) {
      id
    }
  }
`) as TypedDocumentNode<{ deleteUser: { id: string } | null }, { id: string }>;

var adminContext: Awaited<ReturnType<typeof contextAs>>;
var aliceContext: Awaited<ReturnType<typeof contextAs>>;
var bobContext: Awaited<ReturnType<typeof contextAs>>;
var aliceId: string;
var bobId: string;

beforeAll(async () => {
  await resetDb();
  await createUser({ email: 'admin@example.com', roles: ['admin'] });
  const alice = await createUser({ name: 'Alice', email: 'alice@example.com' });
  const bob = await createUser({ name: 'Bob', email: 'bob@example.com' });
  aliceId = alice.id;
  bobId = bob.id;

  adminContext = await contextAs('admin@example.com');
  aliceContext = await contextAs('alice@example.com');
  bobContext = await contextAs('bob@example.com');
});

describe('User login', () => {
  // statelessSessions() writes a Set-Cookie header via context.res, so authentication needs a
  // context that has a (mock) request/response attached, unlike the other tests in this file.
  async function requestContext() {
    return publicContext.withRequest({ headers: {} } as any, { setHeader: () => {} } as any);
  }

  it('a user can log in with the correct email and password', async () => {
    const { data, errors } = await execute(await requestContext(), LOGIN, {
      email: 'alice@example.com',
      password: 'test1234',
    });
    expect(errors).toBeUndefined();
    expect(data?.authenticateUserWithPassword?.item?.id).toBe(aliceId);
  });

  it('a user cannot log in with the wrong password', async () => {
    const { data, errors } = await execute(await requestContext(), LOGIN, {
      email: 'alice@example.com',
      password: 'wrong-password',
    });
    expect(errors).toBeUndefined();
    expect(data?.authenticateUserWithPassword?.message).toBeDefined();
  });
});

describe('User read access', () => {
  it('a visitor sees a name but not an email address', async () => {
    const { data, errors } = await execute(publicContext, GET_USER, { id: aliceId });
    expect(errors).toBeUndefined();
    expect(data?.user?.name).toBe('Alice');
    expect(data?.user?.email).toBeNull();
  });

  it('a user sees their own email address', async () => {
    const { data } = await execute(aliceContext, GET_USER, { id: aliceId });
    expect(data?.user?.email).toBe('alice@example.com');
  });

  it("a user does not see another user's email address", async () => {
    const { data } = await execute(bobContext, GET_USER, { id: aliceId });
    expect(data?.user?.email).toBeNull();
  });

  it("an admin sees another user's email address", async () => {
    const { data } = await execute(adminContext, GET_USER, { id: aliceId });
    expect(data?.user?.email).toBe('alice@example.com');
  });

  it('a visitor cannot see a user\'s roles', async () => {
    const { data, errors } = await execute(publicContext, GET_USER, { id: aliceId });
    expect(errors).toBeUndefined();
    expect(data?.user?.roles).toBeNull();
  });

  it('a user sees their own roles', async () => {
    const { data } = await execute(aliceContext, GET_USER, { id: aliceId });
    expect(data?.user?.roles).toEqual([]);
  });

  it("a user does not see another user's roles", async () => {
    const { data } = await execute(bobContext, GET_USER, { id: aliceId });
    expect(data?.user?.roles).toBeNull();
  });

  it("an admin sees another user's roles", async () => {
    const { data } = await execute(adminContext, GET_USER, { id: aliceId });
    expect(data?.user?.roles).toEqual([]);
  });

  it('a visitor cannot list users', async () => {
    const { data, errors } = await execute(publicContext, LIST_USERS);
    expect(errors).toBeUndefined();
    expect(data?.users).toEqual([]);
  });

  it('an admin can list users', async () => {
    const { data, errors } = await execute(adminContext, LIST_USERS);
    expect(errors).toBeUndefined();
    expect(data?.users?.length).toBeGreaterThanOrEqual(3);
  });
});

describe('User update access', () => {
  it('a user can update their own name and email', async () => {
    const { data, errors } = await execute(aliceContext, UPDATE_USER, {
      id: aliceId,
      data: { name: 'Alice Updated', email: 'alice-updated@example.com' },
    });
    expect(errors).toBeUndefined();
    expect(data?.updateUser?.name).toBe('Alice Updated');
    expect(data?.updateUser?.email).toBe('alice-updated@example.com');
  });

  it("a user cannot update another user's name or email", async () => {
    const { errors } = await execute(bobContext, UPDATE_USER, {
      id: aliceId,
      data: { name: 'Gehackt' },
    });
    expect(errors).toBeDefined();
  });

  it('an admin can update information for any user', async () => {
    const { data, errors } = await execute(adminContext, UPDATE_USER, {
      id: bobId,
      data: { name: 'Bob Renamed by Admin' },
    });
    expect(errors).toBeUndefined();
    expect(data?.updateUser?.name).toBe('Bob Renamed by Admin');
  });

  it('a user can update their own password', async () => {
    const { errors } = await execute(bobContext, UPDATE_USER, {
      id: bobId,
      data: { password: 'new-password-123' },
    });
    expect(errors).toBeUndefined();
  });

  it("an admin can update another user's password", async () => {
    const { errors } = await execute(adminContext, UPDATE_USER, {
      id: bobId,
      data: { password: 'admin-set-password' },
    });
    expect(errors).toBeUndefined();
  });

  it("a visitor cannot update a user's name, email, or password", async () => {
    const { errors: nameErrors } = await execute(publicContext, UPDATE_USER, {
      id: bobId,
      data: { name: 'Gehackt' },
    });
    expect(nameErrors).toBeDefined();

    const { errors: emailErrors } = await execute(publicContext, UPDATE_USER, {
      id: bobId,
      data: { email: 'gehackt@example.com' },
    });
    expect(emailErrors).toBeDefined();

    const { errors: passwordErrors } = await execute(publicContext, UPDATE_USER, {
      id: bobId,
      data: { password: 'gehackt123' },
    });
    expect(passwordErrors).toBeDefined();
  });

  it('a user cannot change their own roles', async () => {
    const { errors } = await execute(bobContext, UPDATE_USER, {
      id: bobId,
      data: { roles: ['admin'] },
    });
    expect(errors).toBeDefined();
  });

  it("an admin can change another user's roles", async () => {
    const { data, errors } = await execute(adminContext, UPDATE_USER, {
      id: bobId,
      data: { roles: ['editor'] },
    });
    expect(errors).toBeUndefined();
    expect(data?.updateUser?.roles).toEqual(['editor']);
  });
});

describe('User create and delete access', () => {
  it('a visitor cannot create a user', async () => {
    const { errors } = await execute(publicContext, CREATE_USER, {
      data: { name: 'Neuer Nutzer', email: 'neu@example.com', password: 'test1234' },
    });
    expect(errors).toBeDefined();
  });

  it('a non-admin user cannot create a user', async () => {
    const { errors } = await execute(aliceContext, CREATE_USER, {
      data: { name: 'Neuer Nutzer', email: 'neu2@example.com', password: 'test1234' },
    });
    expect(errors).toBeDefined();
  });

  it('an admin can create a user', async () => {
    const { data, errors } = await execute(adminContext, CREATE_USER, {
      data: { name: 'Neuer Nutzer', email: 'neu3@example.com', password: 'test1234' },
    });
    expect(errors).toBeUndefined();
    expect(data?.createUser?.id).toBeDefined();
  });

  it('a non-admin user cannot delete a user', async () => {
    const { errors } = await execute(aliceContext, DELETE_USER, { id: bobId });
    expect(errors).toBeDefined();
  });

  it('an admin can delete a user', async () => {
    const { data, errors } = await execute(adminContext, DELETE_USER, { id: bobId });
    expect(errors).toBeUndefined();
    expect(data?.deleteUser?.id).toBe(bobId);
  });
});
