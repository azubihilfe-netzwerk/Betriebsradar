// Generic function to get or create an entity by name
async function getOrCreateByName(context: any, entity: string, data: any) {
  const existing = await context.query[entity].findMany({
    where: { name: { equals: data.name } },

  });
  if (existing.length === 0) {
    let created = await context.query[entity].createOne({ data });
    console.log(`Created ${entity}: ${data.name}`);
    return created;
  } else {
    console.log(`${entity} already exists: ${data.name}`);
    return existing[0];
  }
}

import { getContext } from '@keystone-6/core/context';
import config from './keystone';import * as PrismaModule from '.prisma/client';
import { create_discrimination_groups } from './discrimination_groups_seed_data';
import { password } from '@keystone-6/core/fields';
import { lists } from './schema';
import { ListsWithResolvedRelations } from '@keystone-6/core/dist/declarations/src/lib/core/resolve-relationships';
export async function main() {
  await create_discrimination_groups();
  const context = getContext(config, PrismaModule)

  console.log(`🌱 Inserting sample seed data`);

  const adminUser = {
    name: 'Admin User',
    email: 'admin@example.com',
    password: 'test1234',
  };
  // Use getOrCreateByName for User (by name)
  await getOrCreateByName(context, 'User', adminUser);
  

  // Seed 2 reviewers
  const reviewers = [
    {
      name: 'Anna Mustermann',
      publishName: true,
      gender: 'cis_female',
    },
    {
      name: 'Max Beispiel',
      publishName: false,
      gender: 'cis_male',
    },
  ];


  const anna = await getOrCreateByName(context, 'Reviewer', reviewers[0]);
  const max = await getOrCreateByName(context, 'Reviewer', reviewers[1]);


  // Seed 1 company
  const company = 
    {
    name: 'Beispiel GmbH',
    description: 'Ein Ausbildungsbetrieb für Handwerk und Technik.',
    industry: 'Handwerk',
    trade: 'Elektronik',
    size: '10-50',
    collective: false,
    contact: 'info@beispiel-gmbh.de',
    hoursPerWeek: 38,
    trainingShortenable: true,
    partTime: false,
    locations: 'Berlin',
    link: 'https://beispiel-gmbh.de',
  };


  const theCompany = await getOrCreateByName(context, 'Company', company);

  const annasReview = await getOrCreateByName(context, 'Review', {
     name : 'Annas Erfahrungsbericht',
     reviewer: { connect: { id: anna.id } },
      company: { connect: { id: theCompany.id } },
      ageAtEmployment: 22,
      genderOuted: true,
      position: 'apprentice',
      duration: '1-3y',
      yearOfHiring: '2022',
      listenedTo: true,
      tone: 'good',
      explained: 'just_right',
      canAskColleagues: true,
      canAskBoss: true,
      proximity: 'professional',
      boundariesRespected: true,
      appreciated: 'yes',
      experienceText: 'Sehr gute Erfahrung.',
      languages: 'Deutsch',
      status: 'published',});

 const maxsReview = await getOrCreateByName(context, 'Review', {
        name : 'Maxs Erfahrungsbericht',
        reviewer: { connect: { id: max.id } },
        company: { connect: { id: theCompany.id } },
        ageAtEmployment: 25,
        genderOuted: false,
      position: 'intern',
      duration: '1-4m',
      yearOfHiring: '2023',
      listenedTo: false,
      tone: 'ok',
      explained: 'enough',
      canAskColleagues: false,
      canAskBoss: false,
      proximity: 'casual',
      boundariesRespected: false,
      appreciated: 'partly',
      experienceText: 'Durchwachsene Erfahrung.',
      languages: 'Deutsch, Englisch',
      status: 'in_review',
 });

  console.log(`✅ Seed data inserted`);
  console.log(`👋 Please start the process with \`npm run dev\``);
}

main()
