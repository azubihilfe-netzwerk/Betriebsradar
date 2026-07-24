
import { getContext } from '@keystone-6/core/context';
import config from './keystone';import * as PrismaModule from '.prisma/client';
import sampleCompanies from './sample_companies.json';

// Generic function to get or create an entity by name
async function getOrCreateEntityByName(context: any, entity: string, data: any, queryField: string = 'name') {
  const existing = await context.query[entity].findMany({
    where: { [queryField]: { equals: data[queryField] } },
  });
  if (existing.length === 0) {
    let created = await context.query[entity].createOne({ data });
    console.log(`Created ${entity}: ${data[queryField]} with ID ${created.id}`);
    return created;
  } else {
    console.log(`${entity} already exists: ${data[queryField]} with ID ${existing[0].id}`);
    return existing[0];
  }
}


export interface SampleData {
  theCompany: { id: string };
  editorAnna: {email: string};
  aReview: { id: string };
  anotherReview: { id: string };
}

// --- Sample company data --------------------------------------------------
// sample_companies.json holds 100 companies with real, geocoded German
// addresses (generated once via scripts/generate_sample_companies.mjs), so
// seeding neither invents nonexistent addresses nor calls the geocoding API.

export async function createSampleCompanies(context: any, count: number = 100) {
  const companies = sampleCompanies.slice(0, count);
  const created = [];
  for (const company of companies) {
    created.push(await getOrCreateEntityByName(context, 'Company', company));
  }
  return created;
}

export async function createSampleData(ctx?: any): Promise<SampleData> {
  const context = ctx ?? getContext(config, PrismaModule).sudo();

  console.log(`🌱 Inserting sample seed data`);

  const adminUser = {
    name: 'Admin User',
    email: 'admin@example.com',
    password: 'test1234',
    roles: ['admin'],
  };
  // Use getOrCreateByName for User (by name)
  await getOrCreateEntityByName(context, 'User', adminUser);


  const annaEditor = await getOrCreateEntityByName(context, 'User', {
    name: 'Anna Mustermann',
    email: 'anna@example.com',
    password: "test1234",
    roles: ['editor'],
  }, "email");


  // Seed 1 company
  const company = {
    name: 'Beispiel GmbH',
    trade: 'Elektronik',
    contact: 'info@beispiel-gmbh.de',
    address: 'Dürkheimer Str. 27, 76185 Karlsruhe',
    size: '_10to30',
    verified: true,
  };


  const theCompany = await getOrCreateEntityByName(context, 'Company', company);

  await createSampleCompanies(context, 100);

  const lucasReview = await getOrCreateEntityByName(context, 'Review', {
     name : 'Lucas Erfahrungsbericht',
     email: 'luca@example.com',
      company: { connect: { id: theCompany.id } },
      gender: 'diverse',
      ageAtEmployment: 22,
      collective: false,
      hoursPerWeek: 38,
      trainingShortenable: true,
      partTime: false,
      genderIdentityRespected: true,
      position: 'apprentice',
      yearOfHiring: '2022',
      listenedTo: 'mostly',
      tone: 'good',
      explained: 'just_right',
      canAskColleagues: 'always',
      canAskBoss: 'always',
      proximity: 'professional',
      boundariesRespected: ['physical_strength', 'emotional'],
      appreciated: 'yes',
      experienceText: 'Sehr gute Erfahrung.',
      languages: 'Deutsch',
      status: 'published',});

 const joelsReview = await getOrCreateEntityByName(context, 'Review', {
        name : 'Joels Erfahrungsbericht',
        email: 'joel@example.com',
        company: { connect: { id: theCompany.id } },
        gender: 'enby',
        ageAtEmployment: 25,
        collective: false,
        hoursPerWeek: 40,
        trainingShortenable: false,
        partTime: false,
        genderIdentityRespected: false,
      position: 'intern',
      yearOfHiring: '2023',
      listenedTo: 'mostly',
      tone: 'ok',
      explained: 'enough',
      canAskColleagues: 'never',
      canAskBoss: 'never',
      proximity: 'casual',
      boundariesRespected: [],
      appreciated: 'partly',
      experienceText: 'Durchwachsene Erfahrung.',
      languages: 'Deutsch, Englisch',
      status: 'awaitingReview',
 });

  console.log(`✅ Seed data inserted`);
  return {
    "theCompany" : theCompany,
    "aReview": lucasReview,
    "anotherReview" : joelsReview,
    "editorAnna": {email : "anna@example.com"}
  }
}

// Only run automatically when not in a Jest worker
if (!process.env.JEST_WORKER_ID) {
  createSampleData();
}
