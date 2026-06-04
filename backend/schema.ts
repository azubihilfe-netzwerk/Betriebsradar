import { list } from '@keystone-6/core';
import { text, relationship, select, integer, float, checkbox, timestamp, password, multiselect } from '@keystone-6/core/fields';
import { allowAll } from '@keystone-6/core/access';
import { randomBytes } from 'crypto';
import { sendVerificationEmail } from './mailer';
import { geocodeAddress } from './geocoder';

const isEditorOrAdmin = (session: any) =>
  session?.data?.roles?.includes('editor') || session?.data?.roles?.includes('admin') || false;

const generateAccessKey = () => randomBytes(32).toString('hex');


export const lists = {
  User: list({
    access: allowAll,
    fields: {
      name: text({
        validation: { isRequired: true }
      }),
      email: text({
        validation: { isRequired: true },
        isIndexed: 'unique',
      }),
      password: password({ validation: { isRequired: true } }),
      roles: multiselect({
        label: 'Rollen',
        type: 'enum',
        options: [
          { label: 'Admin', value: 'admin' },
          { label: 'Autor*in', value: 'reviewer' },
          { label: 'Editor*in', value: 'editor' },
        ]
      }),
      createdAt: timestamp({
        defaultValue: { kind: 'now' },
      }),
    },
  }),

  Company: list({
    access: {
      filter: {
        query: ({ session }) => true,
        update: ({ session }) => isEditorOrAdmin(session),
        delete: ({ session }) => isEditorOrAdmin(session),
      },
      operation: allowAll
    },
    description: 'Betriebe, in denen Erfahrungen gemacht wurden',
    fields: {
      name: text({ label: 'Name', validation: { isRequired: true } }),
      trade: text({ label: 'Gewerk', validation: { isRequired: true } }),
      address: text({ label: 'Adresse', validation: { isRequired: true } }),
      contact: text({ label: 'Kontaktdaten (optional)', validation: {isRequired: false} }),
      size: select({
        label: 'Größe',
        type: 'enum',
        options: [
          { label: '1–5', value: '_1to5' },
          { label: '5–10', value: '_5to10' },
          { label: '10–30', value: '_10to30' },
          { label: '30–50', value: '_30to50' },
          { label: '50–250', value: '_50to250' },
          { label: 'ab 250', value: '_250plus' },
        ],
        ui: { displayMode: 'select' },
        validation: { isRequired: true },
      }),
      verified: checkbox({ label: 'Verifiziert', defaultValue: false }),
      latitude: float({ label: 'Breitengrad', validation: {isRequired: false} }),
      longitude: float({ label: 'Längengrad', validation: {isRequired: false} }),
      //Relationships
      reviews: relationship({ ref: 'Review.company', many: true, label: 'Anzahl Berichte' }),
    },
    hooks: {
      resolveInput: async ({ resolvedData, operation }) => {
        if (operation === 'create' && resolvedData.address) {
          const coords = await geocodeAddress(String(resolvedData.address));
          if (coords) {
            return { ...resolvedData, latitude: coords.lat, longitude: coords.lon };
          }
        }
        return resolvedData;
      },
    },
  }),

  Review: list({
    access: {
      filter: {
        query: ({ session, context, listKey, operation }) => {
          let roles = session?.data?.roles || [];
          if (roles.includes('editor') || roles.includes('admin')) {
            //as editor or admin see all reviews
            return {};
          }
          // If logged in as author, see all published reviews or own reviews
          if (roles.includes('reviewer')) {
            return {
              OR: [
                { status: { equals: 'published' } },
                { user: { id: { equals: context.session?.data?.id } } }
              ]
            }
          }
          return { status: { equals: 'published' } };
        },
        update: ({ session, context, listKey, operation }) => {
          return { user: { id: context.session?.data.id } };
        },
        delete: ({ session, context, listKey, operation }) => {
          return { user: { id: context.session?.data.id } };
        },
      },
      operation: allowAll,
    },
    fields: {
      name: text({ label: 'Titel des Erfahrungsberichts', validation: { isRequired: true } }),
      email: text({ label: 'E-Mail-Adresse', validation: { isRequired: true } }),
      
      company: relationship({ ref: 'Company.reviews', label: 'Betrieb' }),
      collective: checkbox({ label: 'Kollektiv', defaultValue: false }),
      hoursPerWeek: integer({ label: 'Durchschnittliche h/Woche', validation: {isRequired: false} }),
      overtimePerMonth: integer({ label: 'Geschätzte Überstunden/Monat (Jahresmittel)', validation: {isRequired: false} }),
      trainingShortenable: checkbox({ label: 'Ausbildung verkürzbar' }),
      partTime: checkbox({ label: 'Teilzeit möglich' }),
      specialtiesOther: text({ label: 'Sonstiges (Besonderheiten)', validation: {isRequired: false}, ui: { displayMode: 'textarea' } }),
      ageAtEmployment: integer({ label: 'Alter zum Zeitpunkt der Anstellung', validation: {isRequired: false} }),
      yearOfHiring: text({ label: 'Beginn Arbeitszeit (Jahr)', validation: { isRequired: true } }),
      yearOfLeaving: text({ label: 'Ende Arbeitszeit (Jahr)', validation: {isRequired: false} }),
      ongoing: checkbox({ label: 'Dauert an', defaultValue: false }),
      genderIdentityRespected: checkbox({ label: 'Geschlechtliche Identität wurde im Betrieb respektiert' }),
      position: select({
        label: 'Position',
        type: 'enum',
        options: [
          { label: 'Praktikant*in', value: 'intern' },
          { label: 'Azubi', value: 'apprentice' },
          { label: 'Gesell*in', value: 'journey' },
          { label: 'Meister*in', value: 'master' },
          { label: 'Bauhelfer*in', value: 'helper' },
          { label: 'Andere', value: 'other' },
        ],
        ui: { displayMode: 'select' },
        validation: { isRequired: true },
      }),
      // Betriebsklima & Respekt
      listenedTo: select({
        label: 'Wurde dir zugehört?',
        type: 'enum',
        options: [
          { label: 'immer', value: 'always' },
          { label: 'meistens', value: 'mostly' },
          { label: 'ab und zu', value: 'sometimes' },
          { label: 'selten', value: 'rarely' },
          { label: 'niemals', value: 'never' },
        ],
        ui: { displayMode: 'select' },
      }),
      canAskColleagues: select({
        label: 'Konnte ich mit Fragen/Problemen zu Kolleg*innen gehen?',
        type: 'enum',
        options: [
          { label: 'immer', value: 'always' },
          { label: 'meistens', value: 'mostly' },
          { label: 'ab und zu', value: 'sometimes' },
          { label: 'selten', value: 'rarely' },
          { label: 'niemals', value: 'never' },
        ],
        ui: { displayMode: 'select' },
      }),
      canAskBoss: select({
        label: 'Konnte ich mit Fragen/Problemen zu meine*r Chef*in gehen?',
        type: 'enum',
        options: [
          { label: 'immer', value: 'always' },
          { label: 'meistens', value: 'mostly' },
          { label: 'ab und zu', value: 'sometimes' },
          { label: 'selten', value: 'rarely' },
          { label: 'niemals', value: 'never' },
        ],
        ui: { displayMode: 'select' },
      }),
      tone: select({
        label: 'Wie war der Umgangston?',
        type: 'enum',
        options: [
          { label: 'sehr angenehm', value: 'very_good' },
          { label: 'angenehm', value: 'good' },
          { label: 'ok', value: 'ok' },
          { label: 'unangenehm', value: 'bad' },
          { label: 'scheiße', value: 'awful' },
        ],
        ui: { displayMode: 'select' },
      }),
      explained: select({
        label: 'Wurde dir genug erklärt?',
        type: 'enum',
        options: [
          { label: 'zu viel', value: 'too_much' },
          { label: 'genau richtig', value: 'just_right' },
          { label: 'ausreichend', value: 'enough' },
          { label: 'zu wenig', value: 'too_little' },
        ],
        ui: { displayMode: 'select' },
      }),
      proximity: select({
        label: 'Wie war das kollegiale Nähe/Distanz-Verhältnis?',
        options: [
          { label: 'zu nah', value: 'too_close' },
          { label: 'locker', value: 'casual' },
          { label: 'professionell', value: 'professional' },
          { label: 'zu distant', value: 'too_distant' },
        ],
        ui: { displayMode: 'select' },
      }),
      boundariesRespected: multiselect({
        label: 'Meine Grenzen wurden respektiert (Mehrfachauswahl)',
        type: 'enum',
        options: [
          { label: 'körperlich-kräftetechnisch', value: 'physical_strength' },
          { label: 'emotional', value: 'emotional' },
          { label: 'verantwortungstechnisch', value: 'responsibility' },
          { label: 'körperlich-distanztechnisch', value: 'physical_distance' },
        ],
      }),
      appreciated: select({
        label: 'Hast du dich wertgeschätzt gefühlt?',
        type: 'enum',
        options: [
          { label: 'ja', value: 'yes' },
          { label: 'teilweise', value: 'partly' },
          { label: 'nein', value: 'no' },
        ],
        ui: { displayMode: 'select' },
      }),
      experienceText: text({ label: 'Freitextfeld: Betriebsklima & Umgang', ui: { displayMode: 'textarea' } }),
      languages: text({ label: 'Sprachen im Betrieb' }),
      // Geschlecht
      gender: select({
        label: 'Geschlecht',
        type: 'enum',
        options: [
          { label: 'keine Angabe', value: 'prefer_not_to_say' },
          { label: 'cis-männlich', value: 'cis_male' },
          { label: 'cis-weiblich', value: 'cis_female' },
          { label: 'nichtbinär', value: 'enby' },
          { label: 'trans', value: 'trans' },
          { label: 'transmännlich', value: 'trans_male' },
          { label: 'transweiblich', value: 'trans_female' },
          { label: 'divers', value: 'diverse' },
          { label: 'offen', value: 'other' },
        ],
        ui: { displayMode: 'select' },
      }),
      sharedWithCompany: select({
        label: 'War dem Betrieb deine Geschlechtsidentität bekannt?',
        type: 'enum',
        options: [
          { label: 'ja', value: 'yes' },
          { label: 'teilweise', value: 'partly' },
          { label: 'nein', value: 'no' },
        ],
        ui: { displayMode: 'select' },
      }),
      feltComfortableSharing: select({
        label: 'Hast du dich damit wohlgefühlt, dass dem Betrieb deine Geschlechtsidentität bekannt war?',
        type: 'enum',
        options: [
          { label: 'ja', value: 'yes' },
          { label: 'teilweise', value: 'partly' },
          { label: 'nein', value: 'no' },
        ],
        ui: { displayMode: 'select' },
      }),
      // Beeinträchtigung
      disabilityTypes: multiselect({
        label: 'Beeinträchtigungen (Mehrfachauswahl)',
        type: 'enum',
        options: [
          { label: 'Autismus-Spektrum', value: 'autism_spectrum' },
          { label: 'Autoimmunerkrankung', value: 'autoimmune' },
          { label: 'blinde/sehbehinderte Personen', value: 'blind_visually_impaired' },
          { label: 'gehörlose/hörbehinderte Personen', value: 'deaf_hearing_impaired' },
          { label: 'körperlich behindert', value: 'physically_disabled' },
          { label: 'psychische Erkrankung', value: 'mental_illness' },
          { label: 'chronische Erkrankung', value: 'chronic_illness' },
          { label: 'Herz-Kreislauf-Erkrankung', value: 'cardiovascular' },
          { label: 'Skelett-/Muskelerkrankung', value: 'musculoskeletal' },
          { label: 'Stoffwechselerkrankung', value: 'metabolic' },
          { label: 'Erkrankung des Verdauungssystems', value: 'digestive' },
          { label: 'Spastik', value: 'spasticity' },
          { label: 'Lernschwierigkeiten / sog. geistige Behinderung', value: 'learning_disability' },
          { label: 'neurodivergent', value: 'neurodivergent' },
          { label: 'Rollstuhlnutzend / Mobilitätseinschränkung', value: 'wheelchair_mobility' },
          { label: 'Drogenkonsument*in', value: 'drug_use' },
          { label: 'Erfahrung sexualisierter Gewalt', value: 'sexual_violence' },
          { label: 'mehrgewichtig/hochgewichtig', value: 'overweight' },
          { label: 'wenigergewichtig', value: 'underweight' },
        ],
      }),
      disabilitySharedWithCompany: select({
        label: 'War dem Betrieb deine Beeinträchtigung bekannt?',
        type: 'enum',
        options: [
          { label: 'ja', value: 'yes' },
          { label: 'teilweise', value: 'partly' },
          { label: 'nein', value: 'no' },
        ],
        ui: { displayMode: 'select' },
      }),
      disabilityFeltComfortableSharing: select({
        label: 'Hast du dich damit wohlgefühlt, dass dem Betrieb deine Beeinträchtigung bekannt war?',
        type: 'enum',
        options: [
          { label: 'ja', value: 'yes' },
          { label: 'teilweise', value: 'partly' },
          { label: 'nein', value: 'no' },
        ],
        ui: { displayMode: 'select' },
      }),
      // Herkunft & Erscheinungsbild
      ethnicityTypes: multiselect({
        label: 'Herkunft & Erscheinungsbild (Mehrfachauswahl)',
        type: 'enum',
        options: [
          { label: 'weiß', value: 'white' },
          { label: 'Person of Color', value: 'person_of_color' },
          { label: 'Schwarz', value: 'black' },
          { label: 'Indigen', value: 'indigenous' },
          { label: 'Jüdisch', value: 'jewish' },
          { label: 'Muslim*in', value: 'muslim' },
          { label: 'Migrant*in', value: 'migrant' },
          { label: 'Rom*nja/Sinti*zze', value: 'roma_sinti' },
        ],
      }),
      ethnicitySharedWithCompany: select({
        label: 'War dem Betrieb deine Herkunft/Erscheinungsbild bekannt?',
        type: 'enum',
        options: [
          { label: 'ja', value: 'yes' },
          { label: 'teilweise', value: 'partly' },
          { label: 'nein', value: 'no' },
        ],
        ui: { displayMode: 'select' },
      }),
      ethnicityFeltComfortableSharing: select({
        label: 'Hast du dich damit wohlgefühlt, dass dem Betrieb deine Herkunft/Erscheinungsbild bekannt war?',
        type: 'enum',
        options: [
          { label: 'ja', value: 'yes' },
          { label: 'teilweise', value: 'partly' },
          { label: 'nein', value: 'no' },
        ],
        ui: { displayMode: 'select' },
      }),
      needsRespected: select({
        label: 'Wurde insgesamt auf deine Bedürfnisse bezüglich deiner Identität Rücksicht genommen?',
        type: 'enum',
        options: [
          { label: 'ja', value: 'yes' },
          { label: 'teilweise', value: 'partly' },
          { label: 'nein', value: 'no' },
        ],
        ui: { displayMode: 'select' },
      }),
      feedback: text({ label: 'Feedback zum Betrieb', ui: { displayMode: 'textarea' } }),
      moreWishes: text({ label: 'Wünsche an das Betriebsradar / weiteres Feedback', ui: { displayMode: 'textarea' } }),

      /**Internal fields -> cannot be updated by reviewing person*/
      status: select({
        label: 'Zustand des Berichts',
           type: 'enum',
        options: [
          { label: 'Ready for Review', value: 'awaitingReview' },
          { label: 'Änderungen erwünscht', value: 'changesRequested'},
          { label: 'Veröffentlicht', value: 'published' },
        ],
        defaultValue: 'awaitingReview',
        ui: { displayMode: 'segmented-control' },
        access: {
          update: ({ session, context, listKey, operation }) =>  session?.data?.roles.includes('editor') || false,
          create: ({ session, context, listKey, operation }) =>  false, //no one can set this field on creation, it will be set to 'draft' by default
        },         
      }),
      emailVerified: checkbox({ label: 'E-Mail verifiziert', defaultValue: false }),
      //the access key is generated on creation and cannot be updated, it is used to allow users to edit their review without having an account
      accessKey: text({
        label: 'Zugriffsschlüssel',
        isIndexed: 'unique',
        validation: {isRequired: false},
        access: {
          read: ({ session }) => session?.data?.roles?.includes('editor') || session?.data?.roles?.includes('admin') || true,
          create: () => true,
          update: () => false,
        },
        hooks: {
          resolveInput: async ({ resolvedData, operation }) => {
            if (operation === 'create' && !resolvedData.accessKey) {
              return generateAccessKey();
            }
            return resolvedData.accessKey;
          },
        },
      }),
    },
    hooks: {
      afterOperation: async ({ operation, item }) => {
        if (operation === 'create' && item?.email && item?.accessKey) {
          await sendVerificationEmail(String(item.email), String(item.accessKey), String(item.name));
        }
      },
    },
  }),

};
