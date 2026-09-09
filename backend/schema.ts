import { list, g } from '@keystone-6/core';
import { text, relationship, select, integer, float, checkbox, timestamp, password, multiselect, virtual } from '@keystone-6/core/fields';
import { allowAll } from '@keystone-6/core/access';
import { randomBytes } from 'crypto';
import { sendVerificationEmail } from './mailer';
import { geocodeAddress } from './geocoder';

const isEditor = (session: any) =>
  session?.data?.roles?.includes('editor') ;

const isAdmin = (session: any) =>
  session?.data?.roles?.includes('admin') || false;

const isEditorOrAdmin = (session: any) =>
  isEditor(session) || isAdmin(session);

const isOwnItem = (session: any, item: { id: unknown }) =>
  session != null && String(session.itemId) === String(item.id);

const generateAccessKey = () => randomBytes(32).toString('hex');

const resolveAddress = (street?: unknown, houseNumber?: unknown, plz?: unknown, city?: unknown) =>
  [
    [street, houseNumber].filter(Boolean).join(' '),
    [plz, city].filter(Boolean).join(' '),
  ].filter(Boolean).join(', ');


export const lists = {
  User: list({
    access: {
      operation: {
        query: {
          one: allowAll,
          many: ({ session }) => isEditorOrAdmin(session),
          count: ({ session }) => isEditorOrAdmin(session),
        },
        create: ({ session }) => isAdmin(session),
        update: ({ session }) => session != null, 
        delete: ({ session }) => isAdmin(session),
      },
      filter: {
        update: ({ session }) => {
          if (isAdmin(session)) return true;
          return { id: { equals: Number(session.itemId) } };
        },
      },
    },
    ui: {
      singular: "Nutzer:in",
      plural: "Nutzer:innen",
      label: "Nutzer:innen"
    },
    fields: {
      name: text({
        validation: { isRequired: true },
        access: {
          update: ({ session, item }) => isAdmin(session) || isOwnItem(session, item),
        },
      }),
      email: text({
        validation: { isRequired: true },
        isIndexed: 'unique',
        access: {
          read: (args) => args.kind !== 'item' || isAdmin(args.session) || isOwnItem(args.session, args.item),
          update: ({ session, item }) => isAdmin(session) || isOwnItem(session, item),
        },
      }),
      password: password({
        validation: { isRequired: true },
        access: {
          update: ({ session, item }) => isAdmin(session) || isOwnItem(session, item),
        },
      }),
      roles: multiselect({
        type: 'enum',
        options: [
          { label: 'Admin', value: 'admin' },
          { label: 'Editor*in', value: 'editor' },
        ],
        ui: { label: 'Rollen' },
        access: {
          read: (args) => args.kind !== 'item' || isAdmin(args.session) || isOwnItem(args.session, args.item),
          update: ({ session }) => isAdmin(session),
        },
      }),
      createdAt: timestamp({
        defaultValue: { kind: 'now' },
      }),
    },
  }),

  Company: list({
    ui: {
      label: "Betriebe",
      singular: "Betrieb",
      plural: "Betrieb"
    },
    access: {
      filter: {
        query: ({ session }) => true,
        update: ({ session }) => isEditorOrAdmin(session),
        delete: ({ session }) => isEditorOrAdmin(session),
      },
      operation: allowAll
    },
    graphql: { description: 'Betriebe, in denen Erfahrungen gemacht wurden' },
    fields: {
      name: text({ validation: { isRequired: true }, ui: { label: 'Name' } }),
      trade: text({ validation: { isRequired: true }, ui: { label: 'Gewerk' } }),
      street: text({ validation: { isRequired: false }, ui: { label: 'Straße' } }),
      houseNumber: text({ validation: { isRequired: false }, ui: { label: 'Hausnummer' } }),
      plz: text({ validation: { isRequired: false }, ui: { label: 'PLZ' } }),
      city: text({ validation: { isRequired: false }, ui: { label: 'Stadt' } }),
      address: virtual({
        field: g.field({
          type: g.String,
          resolve(item: any) {
            return resolveAddress(item.street, item.houseNumber, item.plz, item.city);
          },
        }),
        ui: { label: 'Adresse' },
      }),
      contact: text({ validation: {isRequired: false}, ui: { label: 'Kontaktdaten (optional)' } }),
      size: select({
        type: 'enum',
        options: [
          { label: '1–5', value: 's1to5' },
          { label: '5–10', value: 's5to10' },
          { label: '10–30', value: 's10to30' },
          { label: '30–50', value: 's30to50' },
          { label: '50–250', value: 's50to250' },
          { label: 'ab 250', value: 'size250plus' },
        ],
        ui: { displayMode: 'select', label: 'Größe' },
        validation: { isRequired: true },
      }),
      verified: checkbox({ defaultValue: false, ui: { label: 'Verifiziert' } }),
      latitude: float({ validation: {isRequired: false}, ui: { label: 'Breitengrad' } }),
      longitude: float({ validation: {isRequired: false}, ui: { label: 'Längengrad' } }),
      //Relationships
      reviews: relationship({ ref: 'Review.company', many: true, ui: { label: 'Anzahl Berichte' } }),
    },
    hooks: {
      resolveInput: async ({ resolvedData, operation, item }) => {
        const street = resolvedData.street ?? item?.street;
        const houseNumber = resolvedData.houseNumber ?? item?.houseNumber;
        const plz = resolvedData.plz ?? item?.plz;
        const city = resolvedData.city ?? item?.city;

        const hasCoords = resolvedData.latitude != null && resolvedData.longitude != null;
        if (operation === 'create' && (street || houseNumber || plz || city) && !hasCoords) {
          const coords = await geocodeAddress(resolveAddress(street, houseNumber, plz, city));
          if (coords) {
            return { ...resolvedData, latitude: coords.lat, longitude: coords.lon };
          }
        }
        return resolvedData;
      },
    },
  }),

  Review: list({
    ui: {
      plural: "Berichte",
      singular: "Bericht",
      label: "Berichte"
    },
    access: {
      filter: {
        query: ({ session, context, listKey, operation }) => {
          let roles = session?.data?.roles || [];
          if (roles.includes('editor') || roles.includes('admin')) {
            //as editor or admin see all reviews
            return {};
          }
          // If not logged in, see only published reviews
          return { status: { equals: 'published' } };
        },
        update: ({ session }) => isEditorOrAdmin(session),
        delete: ({ session }) => isEditorOrAdmin(session),
      },
      operation: allowAll,
    },
    fields: {
      name: text({ validation: { isRequired: true }, ui: { label: 'Name' } }),
      email: text({ validation: { isRequired: true }, ui: { label: 'E-Mail-Adresse' } }),      company: relationship({ ref: 'Company.reviews', ui: { label: 'Betrieb' } }),
      collective: checkbox({ defaultValue: false, ui: { label: 'Kollektiv' } }),
      hoursPerWeek: integer({ validation: {isRequired: false}, ui: { label: 'Durchschnittliche h/Woche' } }),
      overtimePerMonth: integer({ validation: {isRequired: false}, ui: { label: 'Geschätzte Überstunden/Monat (Jahresmittel)' } }),
      trainingShortenable: checkbox({ ui: { label: 'Ausbildung verkürzbar' } }),
      partTime: checkbox({ ui: { label: 'Teilzeit möglich' } }),
      specialtiesOther: text({ validation: {isRequired: false}, ui: { displayMode: 'textarea', label: 'Sonstiges (Besonderheiten)' } }),
      ageAtEmployment: integer({ validation: {isRequired: false}, ui: { label: 'Alter zum Zeitpunkt der Anstellung' } }),
      yearOfHiring: text({ validation: { isRequired: true }, ui: { label: 'Beginn Arbeitszeit (Jahr)' } }),
      employmentDuration: select({
        type: 'enum',
        options: [
          { label: '1 Woche oder weniger', value: 'one_week_or_less' },
          { label: '1-4 Wochen', value: 'one_to_four_weeks' },
          { label: '1-3 Monate', value: 'one_to_three_months' },
          { label: '3-6 Monate', value: 'three_to_six_months' },
          { label: '6-12 Monate', value: 'six_to_twelve_months' },
          { label: '1-3 Jahre', value: 'one_to_three_years' },
          { label: 'Mehr als 3 Jahre', value: 'more_than_three_years' },
        ],
        ui: { displayMode: 'select', label: 'Dauer des Arbeitsverhältnisses' },
        validation: { isRequired: true },
      }),
      overtimeHandling: multiselect({
        type: 'enum',
        options: [
          { label: 'Auszahlung', value: 'payout' },
          { label: 'Arbeitszeitausgleich', value: 'time_off' },
          { label: 'Überstundenzuschlag', value: 'bonus' },
          { label: 'Verfall', value: 'forfeited' },
          { label: 'Sonstiges', value: 'other' },
        ],
        ui: { label: 'Umgang mit Überstunden (Mehrfachauswahl)' },
      }),
      overtimeHandlingOther: text({ validation: { isRequired: false }, ui: { label: 'Umgang mit Überstunden: Sonstiges' } }),
      workplaceSafety: select({
        type: 'enum',
        options: [
          { label: 'stark', value: 'strong' },
          { label: 'mittel', value: 'medium' },
          { label: 'gar nicht', value: 'none' },
        ],
        ui: { displayMode: 'select', label: 'Arbeitssicherheit: Wie sehr wird darauf geachtet?' },
      }),
      position: select({
        type: 'enum',
        options: [
          { label: 'Praktikant*in', value: 'intern' },
          { label: 'Azubi', value: 'apprentice' },
          { label: 'Gesell*in', value: 'journey' },
          { label: 'Meister*in', value: 'master' },
          { label: 'Bauhelfer*in', value: 'helper' },
          { label: 'Andere', value: 'other' },
        ],
        ui: { displayMode: 'select', label: 'Position' },
        validation: { isRequired: true },
      }),
      // Betriebsklima & Respekt
      listenedTo: select({
        type: 'enum',
        options: [
          { label: 'immer', value: 'always' },
          { label: 'meistens', value: 'mostly' },
          { label: 'ab und zu', value: 'sometimes' },
          { label: 'selten', value: 'rarely' },
          { label: 'niemals', value: 'never' },
        ],
        ui: { displayMode: 'select', label: 'Wurde ich ernst genommen?' },
      }),
      canAskColleagues: select({
        type: 'enum',
        options: [
          { label: 'immer', value: 'always' },
          { label: 'meistens', value: 'mostly' },
          { label: 'ab und zu', value: 'sometimes' },
          { label: 'selten', value: 'rarely' },
          { label: 'niemals', value: 'never' },
        ],
        ui: { displayMode: 'select', label: 'Konnte ich mit Fragen/Problemen zu Kolleg*innen gehen?' },
      }),
      canAskBoss: select({
        type: 'enum',
        options: [
          { label: 'immer', value: 'always' },
          { label: 'meistens', value: 'mostly' },
          { label: 'ab und zu', value: 'sometimes' },
          { label: 'selten', value: 'rarely' },
          { label: 'niemals', value: 'never' },
        ],
        ui: { displayMode: 'select', label: 'Konnte ich mit Fragen/Problemen zu meine*r Chef*in gehen?' },
      }),
      canAskTrainer: select({
        type: 'enum',
        options: [
          { label: 'immer', value: 'always' },
          { label: 'meistens', value: 'mostly' },
          { label: 'ab und zu', value: 'sometimes' },
          { label: 'selten', value: 'rarely' },
          { label: 'niemals', value: 'never' },
        ],
        ui: { displayMode: 'select', label: 'Konnte ich mit Fragen/Problemen zur Ausbilder*in gehen?' },
      }),
      tone: select({
        type: 'enum',
        options: [
          { label: 'sehr angenehm', value: 'very_good' },
          { label: 'angenehm', value: 'good' },
          { label: 'ok', value: 'ok' },
          { label: 'unangenehm', value: 'bad' },
          { label: 'scheiße', value: 'awful' },
        ],
        ui: { displayMode: 'select', label: 'Wie war der Umgangston?' },
      }),
      explained: select({
        type: 'enum',
        options: [
          { label: 'zu viel', value: 'too_much' },
          { label: 'genau richtig', value: 'just_right' },
          { label: 'ausreichend', value: 'enough' },
          { label: 'zu wenig', value: 'too_little' },
        ],
        ui: { displayMode: 'select', label: 'Wurde dir genug erklärt?' },
      }),
      boundariesRespected: multiselect({
        type: 'enum',
        options: [
          { label: 'körperlich-kräftetechnisch', value: 'physical_strength' },
          { label: 'emotional', value: 'emotional' },
          { label: 'verantwortungstechnisch', value: 'responsibility' },
          { label: 'körperlich-distanztechnisch', value: 'physical_distance' },
        ],
        ui: { label: 'Folgende Grenzen wurden nicht respektiert (Mehrfachauswahl)' },
      }),
      appreciated: select({
        type: 'enum',
        options: [
          { label: 'ja', value: 'yes' },
          { label: 'teilweise', value: 'partly' },
          { label: 'nein', value: 'no' },
        ],
        ui: { displayMode: 'select', label: 'Hast du dich wertgeschätzt gefühlt?' },
      }),
      experienceText: text({ ui: { displayMode: 'textarea', label: 'Freitextfeld: Betriebsklima & Umgang' } }),
      languages: text({ ui: { label: 'Sprachen im Betrieb' } }),
      // Gleichstellung & Diskriminierung: für jede Kategorie "selbst erfahren" / "bei anderen beobachtet",
      // als Enum mit Default 'no' (Checkbox nicht angekreuzt -> 'no', angekreuzt -> gewählte Häufigkeit)
      genderDiscriminationExperienced: select({
        type: 'enum',
        options: [
          { label: 'nein', value: 'no' },
          { label: 'ja, dauernd', value: 'constantly' },
          { label: 'ja, ab und zu', value: 'occasionally' },
          { label: 'kaum', value: 'rarely' },
        ],
        defaultValue: 'no',
        validation: { isRequired: true },
        ui: { displayMode: 'select', label: 'Diskriminierung aufgrund Geschlecht/Sexualität selbst erfahren' },
      }),
      genderDiscriminationObserved: select({
        type: 'enum',
        options: [
          { label: 'nein', value: 'no' },
          { label: 'ja, dauernd', value: 'constantly' },
          { label: 'ja, ab und zu', value: 'occasionally' },
          { label: 'kaum', value: 'rarely' },
        ],
        defaultValue: 'no',
        validation: { isRequired: true },
        ui: { displayMode: 'select', label: 'Diskriminierung aufgrund Geschlecht/Sexualität bei anderen beobachtet' },
      }),
      ethnicityDiscriminationExperienced: select({
        type: 'enum',
        options: [
          { label: 'nein', value: 'no' },
          { label: 'ja, dauernd', value: 'constantly' },
          { label: 'ja, ab und zu', value: 'occasionally' },
          { label: 'kaum', value: 'rarely' },
        ],
        defaultValue: 'no',
        validation: { isRequired: true },
        ui: { displayMode: 'select', label: 'Diskriminierung aufgrund Herkunft/Religion/Erscheinungsbild selbst erfahren' },
      }),
      ethnicityDiscriminationObserved: select({
        type: 'enum',
        options: [
          { label: 'nein', value: 'no' },
          { label: 'ja, dauernd', value: 'constantly' },
          { label: 'ja, ab und zu', value: 'occasionally' },
          { label: 'kaum', value: 'rarely' },
        ],
        defaultValue: 'no',
        validation: { isRequired: true },
        ui: { displayMode: 'select', label: 'Diskriminierung aufgrund Herkunft/Religion/Erscheinungsbild bei anderen beobachtet' },
      }),
      disabilityDiscriminationExperienced: select({
        type: 'enum',
        options: [
          { label: 'nein', value: 'no' },
          { label: 'ja, dauernd', value: 'constantly' },
          { label: 'ja, ab und zu', value: 'occasionally' },
          { label: 'kaum', value: 'rarely' },
        ],
        defaultValue: 'no',
        validation: { isRequired: true },
        ui: { displayMode: 'select', label: 'Diskriminierung aufgrund Behinderung/Krankheit/Neurodivergenz selbst erfahren' },
      }),
      disabilityDiscriminationObserved: select({
        type: 'enum',
        options: [
          { label: 'nein', value: 'no' },
          { label: 'ja, dauernd', value: 'constantly' },
          { label: 'ja, ab und zu', value: 'occasionally' },
          { label: 'kaum', value: 'rarely' },
        ],
        defaultValue: 'no',
        validation: { isRequired: true },
        ui: { displayMode: 'select', label: 'Diskriminierung aufgrund Behinderung/Krankheit/Neurodivergenz bei anderen beobachtet' },
      }),
      discriminationExperienceText: text({
        validation: { isRequired: false },
        ui: { displayMode: 'textarea', label: 'Beschreibung der selbst erlebten Diskriminierung' },
      }),
      feedback: text({ ui: { displayMode: 'textarea', label: 'Feedback zum Betrieb' } }),
      moreWishes: text({ ui: { displayMode: 'textarea', label: 'Wünsche an das Betriebsradar / weiteres Feedback' } }),
      recommend: select({
        type: 'enum',
        options: [
          { label: 'ja', value: 'yes' },
          { label: 'teilweise', value: 'partly' },
          { label: 'nein', value: 'no' },
        ],
        ui: { displayMode: 'select', label: 'Würdest du deinen Betrieb weiter empfehlen?' },
      }),

      /**Internal fields -> cannot be updated by reviewing person*/
      status: select({
        type: 'enum',
        options: [
          { label: 'Ready for Review', value: 'awaitingReview' },
          { label: 'Änderungen erwünscht', value: 'changesRequested'},
          { label: 'Veröffentlicht', value: 'published' },
        ],
        defaultValue: 'awaitingReview',
        ui: { displayMode: 'segmented-control', label: 'Zustand des Berichts' },
        access: {
          update: ({ session, context, listKey, operation }) =>  session?.data?.roles.includes('editor') || false,
          create: ({ session, context, listKey, operation }) =>  false, //no one can set this field on creation, it will be set to 'draft' by default
        },
      }),
      emailVerified: checkbox({ defaultValue: false, ui: { label: 'E-Mail verifiziert' } }),
      //the access key is generated on creation and cannot be updated, it is used to allow users to edit their review without having an account
      accessKey: text({
        isIndexed: 'unique',
        validation: {isRequired: false},
        ui: { label: 'Zugriffsschlüssel' },
        access: {
          read: ({ session }) => isEditorOrAdmin(session),
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
      afterOperation: async ({ operation, item, context }) => {
        if (operation === 'create' && item?.email && item?.accessKey && !(context as any).skipVerificationEmail) {
          await sendVerificationEmail(String(item.email), String(item.accessKey), String(item.name));
        }
      },
    },
  }),

};
