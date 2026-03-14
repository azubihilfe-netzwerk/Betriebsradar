
import { getContext } from '@keystone-6/core/context';
import config from './keystone';import * as PrismaModule from '.prisma/client';
import { create_social_groups } from './social_groups_seed_data';
import { password } from '@keystone-6/core/fields';
import { lists } from './schema';
import { ListsWithResolvedRelations } from '@keystone-6/core/dist/declarations/src/lib/core/resolve-relationships';
import { resolveTripleslashReference } from 'typescript';

// Generic function to get or create an entity by name
async function getOrCreateByName(context: any, entity: string, data: any, queryField: string = 'name') {
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

export async function main() {
  await create_social_groups(); 
  const context = getContext(config, PrismaModule)

  console.log(`🌱 Inserting sample seed data`);

  const adminUser = {
    name: 'Admin User',
    email: 'admin@example.com',
    password: 'test1234',
    roles: ['admin'],
  };
  // Use getOrCreateByName for User (by name)
  await getOrCreateByName(context, 'User', adminUser);
  

  const annaUser = await getOrCreateByName(context, 'User', {
    name: 'Anna Mustermann',
    email: 'anna@example.com',
    password: "test1234",
    roles: ['editor'],
  }, "email");

  const lucaUser = await getOrCreateByName(context, 'User', {
    name: 'Luca Meyer',
    email: 'luca.meyer42@hotmail.com',
    password: "test1234",
    roles: ['reviewer'],
  }, "email");

  const joelUser = await getOrCreateByName(context, 'User', {
    name: 'Joel Schmidt',
    email: 'joel.schmidt42@gmail.com',
    password: "test1234",
    roles: ['reviewer'],
  }, "email");

  // Seed 2 reviewers
  const reviewers = [
    {
      name: 'Luca Meyer',
      publishName: true,
      gender: 'diverse',
      user: { connect: { id: lucaUser.id } },
    },
    {
      name: 'Joel Schmidt',
      publishName: false,
      gender: 'enby',
      user: { connect: { id: joelUser.id } },
    },
  ];

  const luca = await getOrCreateByName(context, 'Reviewer', reviewers[0]);
  const joel = await getOrCreateByName(context, 'Reviewer', reviewers[1]);


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
    locations: 'Dürkheimer Str. 27 \n 76185 Karlsruhe',
    link: 'https://beispiel-gmbh.de',
  };


  const theCompany = await getOrCreateByName(context, 'Company', company);

  const lucasReview = await getOrCreateByName(context, 'Review', {
     name : 'Lucas Erfahrungsbericht',
     reviewer: { connect: { id: luca.id } },
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

 const joelsReview = await getOrCreateByName(context, 'Review', {
        name : 'Joels Erfahrungsbericht',
        reviewer: { connect: { id: joel.id } },
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
