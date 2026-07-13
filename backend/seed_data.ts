
import { getContext } from '@keystone-6/core/context';
import config from './keystone';import * as PrismaModule from '.prisma/client';

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

// --- Randomized German company generation -------------------------------

const GERMAN_CITIES: Array<{ city: string; plz: string }> = [
  { city: 'Berlin', plz: '10115' },
  { city: 'Hamburg', plz: '20095' },
  { city: 'München', plz: '80331' },
  { city: 'Köln', plz: '50667' },
  { city: 'Frankfurt am Main', plz: '60311' },
  { city: 'Stuttgart', plz: '70173' },
  { city: 'Düsseldorf', plz: '40210' },
  { city: 'Leipzig', plz: '04109' },
  { city: 'Dortmund', plz: '44135' },
  { city: 'Essen', plz: '45127' },
  { city: 'Bremen', plz: '28195' },
  { city: 'Dresden', plz: '01067' },
  { city: 'Hannover', plz: '30159' },
  { city: 'Nürnberg', plz: '90402' },
  { city: 'Duisburg', plz: '47051' },
  { city: 'Bochum', plz: '44787' },
  { city: 'Wuppertal', plz: '42103' },
  { city: 'Bielefeld', plz: '33602' },
  { city: 'Bonn', plz: '53111' },
  { city: 'Münster', plz: '48143' },
  { city: 'Karlsruhe', plz: '76133' },
  { city: 'Mannheim', plz: '68159' },
  { city: 'Augsburg', plz: '86150' },
  { city: 'Wiesbaden', plz: '65183' },
  { city: 'Mönchengladbach', plz: '41061' },
  { city: 'Gelsenkirchen', plz: '45879' },
  { city: 'Braunschweig', plz: '38100' },
  { city: 'Kiel', plz: '24103' },
  { city: 'Chemnitz', plz: '09111' },
  { city: 'Aachen', plz: '52062' },
  { city: 'Halle (Saale)', plz: '06108' },
  { city: 'Magdeburg', plz: '39104' },
  { city: 'Freiburg im Breisgau', plz: '79098' },
  { city: 'Krefeld', plz: '47798' },
  { city: 'Lübeck', plz: '23552' },
  { city: 'Oberhausen', plz: '46045' },
  { city: 'Erfurt', plz: '99084' },
  { city: 'Mainz', plz: '55116' },
  { city: 'Rostock', plz: '18055' },
  { city: 'Kassel', plz: '34117' },
];

const STREET_NAMES = [
  'Hauptstraße', 'Bahnhofstraße', 'Schulstraße', 'Gartenstraße', 'Bergstraße',
  'Kirchstraße', 'Waldstraße', 'Ringstraße', 'Poststraße', 'Mühlenweg',
  'Industriestraße', 'Amselweg', 'Birkenweg', 'Lindenstraße', 'Goethestraße',
  'Schillerstraße', 'Am Bahnhof', 'Friedrichstraße', 'Königstraße', 'Rathausplatz',
];

const SURNAMES = [
  'Müller', 'Schmidt', 'Schneider', 'Fischer', 'Weber', 'Meyer', 'Wagner',
  'Becker', 'Schulz', 'Hoffmann', 'Koch', 'Bauer', 'Richter', 'Klein', 'Wolf',
  'Schröder', 'Neumann', 'Schwarz', 'Zimmermann', 'Braun', 'Krüger', 'Hofmann',
  'Hartmann', 'Lange', 'Werner', 'Krause', 'Peters', 'Möller', 'Vogel', 'Fuchs',
];

interface Trade {
  name: string;
  suffix: string;
}

const TRADES: Trade[] = [
  { name: 'Elektrotechnik', suffix: 'Elektro' },
  { name: 'Sanitär, Heizung, Klima', suffix: 'Haustechnik' },
  { name: 'Tischlerei', suffix: 'Tischlerei' },
  { name: 'Kfz-Mechatronik', suffix: 'Kfz-Technik' },
  { name: 'Maler und Lackierer', suffix: 'Malerbetrieb' },
  { name: 'Dachdeckerei', suffix: 'Dach' },
  { name: 'Zimmerei', suffix: 'Zimmerei' },
  { name: 'Metallbau', suffix: 'Metallbau' },
  { name: 'Bäckerei', suffix: 'Bäckerei' },
  { name: 'Friseurhandwerk', suffix: 'Friseure' },
  { name: 'Gebäudereinigung', suffix: 'Gebäudeservice' },
  { name: 'Landschaftsgärtnerei', suffix: 'Garten- und Landschaftsbau' },
  { name: 'Fliesenlegerei', suffix: 'Fliesen' },
  { name: 'Schreinerei', suffix: 'Schreinerei' },
  { name: 'Anlagenmechanik', suffix: 'Anlagenbau' },
  { name: 'Maurerhandwerk', suffix: 'Bau' },
  { name: 'Straßenbau', suffix: 'Straßenbau' },
  { name: 'Glaserei', suffix: 'Glaserei' },
  { name: 'Steinmetzhandwerk', suffix: 'Steinmetzbetrieb' },
  { name: 'Installationstechnik', suffix: 'Installationstechnik' },
];

const LEGAL_FORMS = ['GmbH', 'GmbH & Co. KG', 'e.K.', 'OHG', 'Meisterbetrieb', ''];

const COMPANY_SIZES = ['_1to5', '_5to10', '_10to30', '_30to50', '_50to250', '_250plus'];

function pickRandom<T>(items: T[]): T {
  return items[Math.floor(Math.random() * items.length)];
}

function buildCompanyName(surname: string, trade: Trade, legalForm: string): string {
  const base = `${surname} ${trade.suffix}`;
  return legalForm ? `${base} ${legalForm}` : base;
}

function generateRandomCompanies(count: number): Array<{
  name: string;
  trade: string;
  contact: string;
  address: string;
  size: string;
  verified: boolean;
}> {
  const usedNames = new Set<string>();
  const companies = [];

  while (companies.length < count) {
    const surname = pickRandom(SURNAMES);
    const trade = pickRandom(TRADES);
    const legalForm = pickRandom(LEGAL_FORMS);
    const name = buildCompanyName(surname, trade, legalForm);

    if (usedNames.has(name)) continue;
    usedNames.add(name);

    const { city, plz } = pickRandom(GERMAN_CITIES);
    const street = pickRandom(STREET_NAMES);
    const houseNumber = 1 + Math.floor(Math.random() * 150);
    const slug = name.toLowerCase()
      .replace(/[^a-z0-9äöüß]+/g, '-')
      .replace(/(^-|-$)/g, '');

    companies.push({
      name,
      trade: trade.name,
      contact: `info@${slug}.de`,
      address: `${street} ${houseNumber}, ${plz} ${city}`,
      size: pickRandom(COMPANY_SIZES),
      verified: Math.random() < 0.7,
    });
  }

  return companies;
}

export async function createSampleCompanies(context: any, count: number = 100) {
  const companies = generateRandomCompanies(count);
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
