
import { getContext } from '@keystone-6/core/context';
import config from './keystone';import * as PrismaModule from '.prisma/client';
import { create_social_groups } from './social_groups_seed_data';

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
  const context = getContext(config, PrismaModule).sudo()

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


  // Seed 1 company
  const company = 
    {
    name: 'Beispiel GmbH',
    description: 'Ein Ausbildungsbetrieb für Handwerk und Technik.',
    trade: 'Elektronik',
    contact: 'info@beispiel-gmbh.de',
    address: 'Dürkheimer Str. 27 \n 76185 Karlsruhe',
    size: '_10to50',
  };


  const theCompany = await getOrCreateByName(context, 'Company', company);

  const lucasReview = await getOrCreateByName(context, 'Review', {
     name : 'Lucas Erfahrungsbericht',
     email: 'luca@example.com',
      company: { connect: { id: theCompany.id } },
      publishName: true,
      gender: 'diverse',
      ageAtEmployment: 22,
      collective: false,
      hoursPerWeek: 38,
      trainingShortenable: true,
      partTime: false,
      genderOuted: true,
      position: 'apprentice',
      duration: '_1to3years',
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
        email: 'joel@example.com',
        company: { connect: { id: theCompany.id } },
        publishName: false,
        gender: 'enby',
        ageAtEmployment: 25,
        collective: false,
        hoursPerWeek: 40,
        trainingShortenable: false,
        partTime: false,
        genderOuted: false,
      position: 'intern',
      duration: '_1to4months',
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
}

main()
