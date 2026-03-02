## Setup

1. Make sure you have the latest nodejs version installed: [Download Nodejs](https://nodejs.org)
2. clone this git repo
3. cd Betriebsradar
4. rm -rf backend
5. run `npm create keystone-app@latest` to install dependencies - choose backend as folder
6. run `git pull` to update config

## Dev Environment

```
npm run dev
```
Server starts at localhost:3000

## Production Environment

Run `npm run build` to build the app and migrate schemas
Run `npm start` to start the app

Server starts at localhost:3000

## Keystone CLI
To use the keystone cli run `npx keystone --help`

```
  Usage
    $ keystone [command] [options]

  Commands
      dev             start the project in development mode (default)
      migrate create  build the project for development and create a migration from the Prisma diff
      migrate apply   build the project for development and apply any pending migrations
      postinstall     build the project for development
      build           build the project (required by `keystone start` and `keystone prisma`)
      telemetry       sets telemetry preference (enable/disable/status)

      start           start the project
      prisma          use prisma commands in a Keystone context

  Options
    --fix (postinstall) @deprecated
      do build the graphql or prisma schemas, don't validate them

    --frozen (build, migrate)
      don't build the graphql or prisma schemas, only validate them

    --no-db-push (dev)
      don't push any updates of your Prisma schema to your database

    --no-prisma (build, dev)
      don't build or validate the prisma schema

    --no-server (dev, start)
      don't start the express server

    --no-ui (build, dev, start)
      don't build and serve the AdminUI

    --with-migrations (start)
      trigger prisma to run migrations as part of startup
```

## Keystone Project Starter

Welcome to Keystone!

Run

```
npm run dev
```

To view the config for your new app, look at [./keystone.ts](./keystone.ts)

This project starter is designed to give you a sense of the power Keystone can offer you, and show off some of its main features. It's also a pretty simple setup if you want to build out from it.

We recommend you use this alongside our [getting started walkthrough](https://keystonejs.com/docs/walkthroughs/getting-started-with-create-keystone-app) which will walk you through what you get as part of this starter.

If you want an overview of all the features Keystone offers, check out our [features](https://keystonejs.com/why-keystone#features) page.

## Some Quick Notes On Getting Started

### Changing the database

We've set you up with an [SQLite database](https://keystonejs.com/docs/apis/config#sqlite) for ease-of-use. If you're wanting to use PostgreSQL, you can!

Just change the `db` property on line 16 of the Keystone file [./keystone.ts](./keystone.ts) to

```typescript
db: {
    provider: 'postgresql',
    url: process.env.DATABASE_URL || 'DATABASE_URL_TO_REPLACE',
}
```

And provide your database url from PostgreSQL.

For more on database configuration, check out or [DB API Docs](https://keystonejs.com/docs/apis/config#db)

### Auth

We've put auth into its own file to make this humble starter easier to navigate. To explore it without auth turned on, comment out the `isAccessAllowed` on line 21 of the Keystone file [./keystone.ts](./keystone.ts).

For more on auth, check out our [Authentication API Docs](https://keystonejs.com/docs/apis/auth#authentication-api)

### Adding a frontend

As a Headless CMS, Keystone can be used with any frontend that uses GraphQL. It provides a GraphQL endpoint you can write queries against at `/api/graphql` (by default [http://localhost:3000/api/graphql](http://localhost:3000/api/graphql)). At Thinkmill, we tend to use [Next.js](https://nextjs.org/) and [Apollo GraphQL](https://www.apollographql.com/docs/react/get-started/) as our frontend and way to write queries, but if you have your own favourite, feel free to use it.

A walkthrough on how to do this is forthcoming, but in the meantime our [todo example](https://github.com/keystonejs/keystone-react-todo-demo) shows a Keystone set up with a frontend. For a more full example, you can also look at an example app we built for [Prisma Day 2021](https://github.com/keystonejs/prisma-day-2021-workshop)

### Embedding Keystone in a Next.js frontend

While Keystone works as a standalone app, you can embed your Keystone app into a [Next.js](https://nextjs.org/) app. This is quite a different setup to the starter, and we recommend checking out our walkthrough for that [here](https://keystonejs.com/docs/walkthroughs/embedded-mode-with-sqlite-nextjs#how-to-embed-keystone-sq-lite-in-a-next-js-app).
