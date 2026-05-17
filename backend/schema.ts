import { list } from '@keystone-6/core';
import { text, relationship, select, integer, float, checkbox, timestamp, password, multiselect } from '@keystone-6/core/fields';
import { allowAll } from '@keystone-6/core/access';
import { randomBytes } from 'crypto';
import { ReviewStatusType } from './tests/gql/graphql';
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
      contact: text({ label: 'Kontaktdaten', validation: { isRequired: true } }),
      size: select({
        label: 'Größe',
        type: 'enum',
        options: [
          { label: '1-10', value: '_1to10' },
          { label: '10-50', value: '_10to50' },
          { label: '50-250', value: '_50to250' },
          { label: 'ab 250', value: '_250plus' },
        ],
        ui: { displayMode: 'select' },
        validation: { isRequired: true },
      }),
      verified: checkbox({ label: 'Verifiziert', defaultValue: false }),
      latitude: float({ label: 'Breitengrad', db: { isNullable: true } }),
      longitude: float({ label: 'Längengrad', db: { isNullable: true } }),
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
      publishName: checkbox({ label: 'Name veröffentlichen?' }),
      gender: select({
        label: 'Geschlecht',
        type: 'enum',
        options: [
          { label: 'cis-männlich', value: 'cis_male' },
          { label: 'cis-weiblich', value: 'cis_female' },
          { label: 'nichtbinär', value: 'enby' },
          { label: 'trans', value: 'trans' },
          { label: 'divers', value: 'diverse' },
          { label: 'offen', value: 'other' },
          { label: 'keine Angabe', value: 'prefer_not_to_say'},
        ],
        ui: { displayMode: 'select' },
      }),
      company: relationship({ ref: 'Company.reviews', label: 'Betrieb' }),
      collective: checkbox({ label: 'Kollektiv', defaultValue: false }),
      hoursPerWeek: integer({ label: 'h/Woche', validation: { isRequired: true } }),
      trainingShortenable: checkbox({ label: 'Ausbildung verkürzbar' }),
      partTime: checkbox({ label: 'Teilzeit' }),
      ageAtEmployment: integer({ label: 'Alter zum Zeitpunkt der Anstellung', validation: { isRequired: true } }),
      duration: select({
        label: 'Dauer',
        type: 'enum',
        options: [
          { label: '1-3 Wochen', value: 'OneToThreeweeks' },
          { label: '1-4 Monate', value: 'OneToFourMonths' },
          { label: '5-12 Monate', value: 'FiveToTwelveMonths' },
          { label: '1-3 Jahre', value: 'OneToThreeYears' },
        ],
        ui: { displayMode: 'select' },
        validation: { isRequired: true },
      }),
      yearOfHiring: text({ label: 'Einstellungsjahr', validation: { isRequired: true } }),
      genderOuted: checkbox({ label: 'Geschlechtl. Identität geoutet im Betrieb' }),
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
      // Erfahrungen
      listenedTo: checkbox({ label: 'Wurde dir zugehört?' }),
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
        label: 'Wurde dir alles erklärt?',
           type: 'enum',
        options: [
          { label: 'zu viel', value: 'too_much' },
          { label: 'genau richtig', value: 'just_right' },
          { label: 'ausreichend', value: 'enough' },
          { label: 'zu wenig', value: 'too_little' },
        ],
        ui: { displayMode: 'select' },
      }),
      canAskColleagues: checkbox({ label: 'Kannst du mit deinen Fragen/Problemen zu deinen Kolleg*innen gehen?' }),
      canAskBoss: checkbox({ label: 'Fühlst du dich wohl zu deine*r/m Chef*in zu gehen?' }),
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
      boundariesRespected: checkbox({ label: 'Wurden deine kommunizierten Grenzen berücksichtigt?' }),
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
      experienceText: text({ label: 'Freitextfeld für Ausführungen', ui: { displayMode: 'textarea' } }),
      languages: text({ label: 'Sprachen im Betrieb' }),
      socialGroups: relationship({ ref: 'SocialGroup.recommendedByReviews', many: true, label: 'Würdest du den Betrieb Menschen aus einer dieser Gruppen empfehlen?' }),
      sharedWithCompany: select({
        label: 'Hast du diese Informationen mit dem Betrieb geteilt?',
           type: 'enum',  
        options: [
          { label: 'ja', value: 'yes' },
          { label: 'teilweise', value: 'partly' },
          { label: 'nein', value: 'no' },
        ],
        ui: { displayMode: 'select' },
      }),
      feltComfortableSharing: select({
        label: 'Hast du dich wohl gefühlt diese Informationen zu teilen?',
        type: 'enum',
        options: [
          { label: 'ja', value: 'yes' },
          { label: 'teilweise', value: 'partly' },
          { label: 'nein', value: 'no' },
        ],
        ui: { displayMode: 'select' },
      }),
      needsRespected: select({
        label: 'Wurde auf deine Bedürfnisse & Grenzen Rücksicht genommen?',
           type: 'enum',
        options: [
          { label: 'ja', value: 'yes' },
          { label: 'teilweise', value: 'partly' },
          { label: 'nein', value: 'no' },
        ],
        ui: { displayMode: 'select' },
      }),
      feedback: text({ label: 'Hast du Feedback zu unserem Fragebogen?', ui: { displayMode: 'textarea' } }),
      moreWishes: text({ label: 'Wünschst du dir die Möglichkeit weitere Dinge angeben zu können?', ui: { displayMode: 'textarea' } }),

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
        db: { isNullable: true },
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

  SocialGroup: list({
    access: allowAll,
    fields: {
      //make name uniique
      name: text({ label: 'Name der Personengruppe', validation: { isRequired: true }, isIndexed: 'unique' }),
      recommendedByReviews: relationship({ ref: 'Review.socialGroups', many: true, label: 'Empfohlen von Berichten' }),
    },
  }),
};
