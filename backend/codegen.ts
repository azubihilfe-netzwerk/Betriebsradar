import type { CodegenConfig } from '@graphql-codegen/cli';

const config: CodegenConfig = {
  schema: './schema.graphql',
  documents: ['tests/**/*.ts'],
  generates: {
    'tests/gql/': {
      preset: 'client',
    },
  },
};

export default config;
