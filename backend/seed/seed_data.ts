
import { getContext } from '@keystone-6/core/context';
import config from '../keystone';
import * as PrismaModule from '../generated/prisma/client';
import sampleCompanies from './sample_companies.json';

// Splits a "Street Number, PLZ City" string (the format used in
// sample_companies.json and by generate_sample_companies.mjs) into the
// separate fields the Company list now stores.
function splitAddress(address: string) {
  const [streetPart, cityPart] = address.split(',').map((s) => s.trim());
  const match = streetPart.match(/^(.*?)\s+(\S+)$/);
  const street = match ? match[1] : streetPart;
  const houseNumber = match ? match[2] : '';
  const [plz, ...cityWords] = (cityPart ?? '').split(' ');
  return { street, houseNumber, plz, city: cityWords.join(' ') };
}

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

// --- Sample review data ----------------------------------------------------
// Generates 0-5 plausible Erfahrungsberichte per sample company so map/list
// views have realistic amounts of data to render against.

const FIRST_NAMES = [
  'Lea', 'Finn', 'Mia', 'Noah', 'Emma', 'Ben', 'Hannah', 'Paul', 'Lina', 'Jonas',
  'Sophie', 'Luca', 'Mila', 'Elias', 'Marie', 'Felix', 'Anna', 'Leon', 'Ida', 'Tom',
];

const GENDERS = ['prefer_not_to_say', 'cis_male', 'cis_female', 'enby', 'trans', 'trans_male', 'trans_female', 'diverse', 'other'];
const POSITIONS = ['intern', 'apprentice', 'journey', 'master', 'helper', 'other'];
const RATINGS = ['always', 'mostly', 'sometimes', 'rarely', 'never'];
const TONES = ['very_good', 'good', 'ok', 'bad', 'awful'];
const EXPLAINED = ['too_much', 'just_right', 'enough', 'too_little'];
const PROXIMITY = ['too_close', 'casual', 'professional', 'too_distant'];
const YES_PARTLY_NO = ['yes', 'partly', 'no'];
const BOUNDARIES = ['physical_strength', 'emotional', 'responsibility', 'physical_distance'];
const EXPERIENCE_TEXTS = [
  'Insgesamt eine gute Erfahrung gemacht.',
  'Es gab sowohl gute als auch schwierige Phasen.',
  'Das Team war hilfsbereit und offen.',
  'Die Kommunikation hätte besser sein können.',
  'Ich habe mich wohl und respektiert gefühlt.',
];

function randomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function pick<T>(options: T[]): T {
  return options[randomInt(0, options.length - 1)];
}

function pickSome<T>(options: T[]): T[] {
  return options.filter(() => Math.random() < 0.3);
}

function randomReviewData(company: { id: string }) {
  const firstName = pick(FIRST_NAMES);
  const yearOfHiring = String(randomInt(2015, 2024));
  const ongoing = Math.random() < 0.4;
  return {
    name: `${firstName}s Erfahrungsbericht`,
    email: `${firstName.toLowerCase()}.${randomInt(1000, 9999)}@example.com`,
    company: { connect: { id: company.id } },
    gender: pick(GENDERS),
    ageAtEmployment: randomInt(16, 45),
    collective: Math.random() < 0.2,
    hoursPerWeek: randomInt(20, 45),
    overtimePerMonth: randomInt(0, 15),
    trainingShortenable: Math.random() < 0.5,
    partTime: Math.random() < 0.2,
    yearOfHiring,
    yearOfLeaving: ongoing ? undefined : String(randomInt(Number(yearOfHiring), 2026)),
    ongoing,
    genderIdentityRespected: Math.random() < 0.7,
    position: pick(POSITIONS),
    listenedTo: pick(RATINGS),
    tone: pick(TONES),
    explained: pick(EXPLAINED),
    canAskColleagues: pick(RATINGS),
    canAskBoss: pick(RATINGS),
    proximity: pick(PROXIMITY),
    boundariesRespected: pickSome(BOUNDARIES),
    appreciated: pick(YES_PARTLY_NO),
    experienceText: pick(EXPERIENCE_TEXTS),
    languages: 'Deutsch',
    status: Math.random() < 0.85 ? 'published' : 'awaitingReview',
  };
}

export async function createSampleReviews(context: any, companies: { id: string; name?: string }[]) {
  const created = [];
  // Bulk-generated reviews aren't real submissions, so skip the verification
  // email the Review.afterOperation hook would otherwise send for each one.
  context.skipVerificationEmail = true;
  try {
    for (const company of companies) {
      const reviewCount = randomInt(0, 5);
      for (let i = 0; i < reviewCount; i++) {
        const review = await context.query.Review.createOne({ data: randomReviewData(company) });
        created.push(review);
      }
    }
  } finally {
    delete context.skipVerificationEmail;
  }
  console.log(`✅ Created ${created.length} sample reviews across ${companies.length} companies`);
  return created;
}

// --- Sample company data --------------------------------------------------
// sample_companies.json holds 100 companies with real, geocoded German
// addresses (generated once via scripts/generate_sample_companies.mjs), so
// seeding neither invents nonexistent addresses nor calls the geocoding API.

export async function createSampleCompanies(context: any, count: number = 100) {
  const companies = sampleCompanies.slice(0, count);
  const created = [];
  for (const { address, ...company } of companies) {
    created.push(await getOrCreateEntityByName(context, 'Company', { ...company, ...splitAddress(address) }));
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
    street: 'Dürkheimer Str.',
    houseNumber: '27',
    plz: '76185',
    city: 'Karlsruhe',
    size: 's10to30',
    verified: true,
  };


  const theCompany = await getOrCreateEntityByName(context, 'Company', company);

  const sampleCompanyRecords = await createSampleCompanies(context, 100);
  await createSampleReviews(context, sampleCompanyRecords);

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
