import { list } from '@keystone-6/core';
import { text, relationship, select, integer, checkbox, timestamp, password, email } from '@keystone-6/core/fields';
import { document } from '@keystone-6/fields-document';
import { allowAll } from '@keystone-6/core/access';

export const lists = {
   User: list({
    // WARNING
    //   for this starter project, anyone can create, query, update and delete anything
    //   if you want to prevent random people on the internet from accessing your data,
    //   you can find out more at https://keystonejs.com/docs/guides/auth-and-access-control
    access: allowAll,

    // this is the fields for our User list
    fields: {
      // by adding isRequired, we enforce that every User should have a name
      //   if no name is provided, an error will be displayed
      name: text({ validation: { isRequired: true } }),

      email: text({
        validation: { isRequired: true },
        // by adding isIndexed: 'unique', we're saying that no user can have the same
        // email as another user - this may or may not be a good idea for your project
        isIndexed: 'unique',
      }),

      password: password({ validation: { isRequired: true } }),


      createdAt: timestamp({
        // this sets the timestamp to Date.now() when the user is first created
        defaultValue: { kind: 'now' },
      }),
    },
  }),

  Reviewer: list({
    access: allowAll,
    fields: {
      name: text({ label: 'Name (Anonym möglich)', validation: { isRequired: true } }),
      publishName: checkbox({ label: 'Name veröffentlichen?' }),
      gender: select({
        label: 'Geschlecht',
        options: [
          { label: 'cis-männlich', value: 'cis_male' },
          { label: 'cis-weiblich', value: 'cis_female' },
          { label: 'nichtbinär', value: 'enby' },
          { label: 'trans', value: 'trans' },
          { label: 'divers', value: 'diverse' },
          { label: 'offen', value: 'other' },
        ],
        ui: { displayMode: 'select' },
      }),
      user: relationship({ ref: 'User', label: 'User Account' }),
      reviews: relationship({ ref: 'Review.reviewer', many: true, label: 'Erfahrungsberichte' }),
    },
  }),

  Company: list({
    access: allowAll,
    description: 'Betriebe, in denen Erfahrungen gemacht wurden',
    fields: {
      name: text({ label: 'Name', validation: { isRequired: true } }),
      description: text({ label: 'Beschreibung', validation: { isRequired: true } }),
      industry: text({ label: 'Branche', validation: { isRequired: true } }),
      trade: text({ label: 'Gewerk', validation: { isRequired: true } }),
      size: select({
        label: 'Größe',
        options: [
          { label: '1-10', value: '1-10' },
          { label: '10-50', value: '10-50' },
          { label: '50-250', value: '50-250' },
          { label: 'ab 250', value: '250+' },
        ],
        ui: { displayMode: 'select' },
        validation: { isRequired: true },
      }),
      collective: checkbox({ label: 'Kollektiv', defaultValue: false }),
      contact: text({ label: 'Kontaktdaten', validation: { isRequired: true } }),
      hoursPerWeek: integer({ label: 'h/Woche', validation: { isRequired: true } }),
      trainingShortenable: checkbox({ label: 'Ausbildung verkürzbar' }),
      partTime: checkbox({ label: 'Teilzeit' }),
      trainingModels: relationship({ ref: 'TrainingModel.companies', many: true, label: 'Ausbildungsmodell' }),
      reviews: relationship({ ref: 'Review.company', many: true, label: 'Anzahl Berichte' }),
      locations: text({ label: 'Standort(e)', validation: { isRequired: true } }),
      link: text({ label: 'Link', validation: { isRequired: true } }),
    },
  }),

  TrainingModel: list({
    access: allowAll,
    fields: {
      title: text({ label: 'Berufsbezeichnung', validation: { isRequired: true } }),
      duration: text({ label: 'Dauer der Ausbildung', validation: { isRequired: true } }),
      companies: relationship({ ref: 'Company.trainingModels', many: true, label: 'Betriebe' }),
      // TODO: Arbeitsrecht (optional, not yet finished)
    },
  }),

  Review: list({
    access: allowAll,
    fields: {
      name: text({ label: 'Titel des Erfahrungsberichts', validation: { isRequired: true } }),
      reviewer: relationship({ ref: 'Reviewer.reviews', label: 'Reviewer' }),
      company: relationship({ ref: 'Company.reviews', label: 'Betrieb' }),
      ageAtEmployment: integer({ label: 'Alter zum Zeitpunkt der Anstellung', validation: { isRequired: true } }),
      genderOuted: checkbox({ label: 'Geschlechtl. Identität geoutet im Betrieb' }),
      position: select({
        label: 'Position',
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
      duration: select({
        label: 'Dauer',
        options: [
          { label: '1-3 Wochen', value: '1-3w' },
          { label: '1-4 Monate', value: '1-4m' },
          { label: '1-3 Jahre', value: '1-3y' },
        ],
        ui: { displayMode: 'select' },
        validation: { isRequired: true },
      }),
      yearOfHiring: text({ label: 'Einstellungsjahr', validation: { isRequired: true } }),
      // Erfahrungen
      listenedTo: checkbox({ label: 'Wurde dir zugehört?' }),
      tone: select({
        label: 'Wie war der Umgangston?',
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
        options: [
          { label: 'ja', value: 'yes' },
          { label: 'teilweise', value: 'partly' },
          { label: 'nein', value: 'no' },
        ],
        ui: { displayMode: 'select' },
      }),
      experienceText: text({ label: 'Freitextfeld für Ausführungen', ui: { displayMode: 'textarea' } }),
      groupsInCompany: relationship({ ref: 'DiscriminationGroup.reviews', many: true, label: 'Personengruppen im Betrieb' }),
      languages: text({ label: 'Sprachen im Betrieb' }),
      discriminationGroups: relationship({ ref: 'DiscriminationGroup.recommendedByReviews', many: true, label: 'Empfohlene Personengruppen' }),
      sharedWithCompany: select({
        label: 'Hast du diese Informationen mit dem Betrieb geteilt?',
        options: [
          { label: 'ja', value: 'yes' },
          { label: 'teilweise', value: 'partly' },
          { label: 'nein', value: 'no' },
        ],
        ui: { displayMode: 'select' },
      }),
      feltComfortableSharing: select({
        label: 'Hast du dich wohl gefühlt diese Informationen zu teilen?',
        options: [
          { label: 'ja', value: 'yes' },
          { label: 'teilweise', value: 'partly' },
          { label: 'nein', value: 'no' },
        ],
        ui: { displayMode: 'select' },
      }),
      needsRespected: select({
        label: 'Wurde auf deine Bedürfnisse & Grenzen Rücksicht genommen?',
        options: [
          { label: 'ja', value: 'yes' },
          { label: 'teilweise', value: 'partly' },
          { label: 'nein', value: 'no' },
        ],
        ui: { displayMode: 'select' },
      }),
      feedback: text({ label: 'Hast du Feedback zu unserem Fragebogen?', ui: { displayMode: 'textarea' } }),
      moreWishes: text({ label: 'Wünschst du dir die Möglichkeit weitere Dinge angeben zu können?', ui: { displayMode: 'textarea' } }),
      status: select({
        label: 'Zustand des Berichts',
        options: [
          { label: 'Entwurf', value: 'draft' },
          { label: 'In Review', value: 'in_review' },
          { label: 'Published', value: 'published' },
        ],
        defaultValue: 'draft',
        ui: { displayMode: 'segmented-control' },
      }),
    },
  }),

  DiscriminationGroup: list({
    access: allowAll,
    fields: {
      //make name uniique
      name: text({ label: 'Name der Personengruppe', validation: { isRequired: true } , isIndexed: 'unique'}),
      reviews: relationship({ ref: 'Review.groupsInCompany', many: true, label: 'Berichte mit dieser Gruppe' }),
      recommendedByReviews: relationship({ ref: 'Review.discriminationGroups', many: true, label: 'Empfohlen von Berichten' }),
    },
  }),
};
