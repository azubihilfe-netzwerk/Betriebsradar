"use strict";
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// keystone.ts
var keystone_exports = {};
__export(keystone_exports, {
  default: () => keystone_default
});
module.exports = __toCommonJS(keystone_exports);
var import_core2 = require("@keystone-6/core");

// schema.ts
var import_core = require("@keystone-6/core");
var import_fields = require("@keystone-6/core/fields");
var import_access = require("@keystone-6/core/access");
var lists = {
  User: (0, import_core.list)({
    access: import_access.allowAll,
    fields: {
      name: (0, import_fields.text)({
        validation: { isRequired: true }
      }),
      email: (0, import_fields.text)({
        validation: { isRequired: true },
        isIndexed: "unique"
      }),
      password: (0, import_fields.password)({ validation: { isRequired: true } }),
      roles: (0, import_fields.multiselect)({
        label: "Rollen",
        type: "enum",
        options: [
          { label: "Admin", value: "admin" },
          { label: "Autor*in", value: "reviewer" },
          { label: "Editor*in", value: "editor" }
        ]
      }),
      createdAt: (0, import_fields.timestamp)({
        defaultValue: { kind: "now" }
      })
    }
  }),
  Reviewer: (0, import_core.list)({
    access: import_access.allowAll,
    fields: {
      name: (0, import_fields.text)({ label: "Name (Anonym m\xF6glich)", validation: { isRequired: true } }),
      publishName: (0, import_fields.checkbox)({ label: "Name ver\xF6ffentlichen?" }),
      gender: (0, import_fields.select)({
        label: "Geschlecht",
        options: [
          { label: "cis-m\xE4nnlich", value: "cis_male" },
          { label: "cis-weiblich", value: "cis_female" },
          { label: "nichtbin\xE4r", value: "enby" },
          { label: "trans", value: "trans" },
          { label: "divers", value: "diverse" },
          { label: "offen", value: "other" }
        ],
        ui: { displayMode: "select" }
      }),
      user: (0, import_fields.relationship)({ ref: "User", label: "User Account" }),
      reviews: (0, import_fields.relationship)({ ref: "Review.reviewer", many: true, label: "Erfahrungsberichte" })
    }
  }),
  Company: (0, import_core.list)({
    access: import_access.allowAll,
    description: "Betriebe, in denen Erfahrungen gemacht wurden",
    fields: {
      name: (0, import_fields.text)({ label: "Name", validation: { isRequired: true } }),
      description: (0, import_fields.text)({ label: "Beschreibung", validation: { isRequired: true } }),
      industry: (0, import_fields.text)({ label: "Branche", validation: { isRequired: true } }),
      trade: (0, import_fields.text)({ label: "Gewerk", validation: { isRequired: true } }),
      size: (0, import_fields.select)({
        label: "Gr\xF6\xDFe",
        options: [
          { label: "1-10", value: "1-10" },
          { label: "10-50", value: "10-50" },
          { label: "50-250", value: "50-250" },
          { label: "ab 250", value: "250+" }
        ],
        ui: { displayMode: "select" },
        validation: { isRequired: true }
      }),
      collective: (0, import_fields.checkbox)({ label: "Kollektiv", defaultValue: false }),
      contact: (0, import_fields.text)({ label: "Kontaktdaten", validation: { isRequired: true } }),
      hoursPerWeek: (0, import_fields.integer)({ label: "h/Woche", validation: { isRequired: true } }),
      trainingShortenable: (0, import_fields.checkbox)({ label: "Ausbildung verk\xFCrzbar" }),
      partTime: (0, import_fields.checkbox)({ label: "Teilzeit" }),
      trainingModels: (0, import_fields.relationship)({ ref: "TrainingModel.companies", many: true, label: "Ausbildungsmodell" }),
      reviews: (0, import_fields.relationship)({ ref: "Review.company", many: true, label: "Anzahl Berichte" }),
      locations: (0, import_fields.text)({ label: "Standort(e)", validation: { isRequired: true } }),
      link: (0, import_fields.text)({ label: "Link", validation: { isRequired: true } })
    }
  }),
  TrainingModel: (0, import_core.list)({
    access: import_access.allowAll,
    fields: {
      title: (0, import_fields.text)({ label: "Berufsbezeichnung", validation: { isRequired: true } }),
      duration: (0, import_fields.text)({ label: "Dauer der Ausbildung", validation: { isRequired: true } }),
      companies: (0, import_fields.relationship)({ ref: "Company.trainingModels", many: true, label: "Betriebe" })
      // TODO: Arbeitsrecht (optional, not yet finished)
    }
  }),
  Review: (0, import_core.list)({
    access: {
      filter: {
        query: ({ session: session2, context, listKey, operation }) => {
          let roles = session2?.data?.roles || [];
          if (roles.includes("editor") || roles.includes("admin")) {
            return {};
          }
          if (roles.includes("reviewer")) {
            return {
              OR: [
                { status: { equals: "published" } },
                { reviewer: { user: { id: { equals: context.session?.data?.id } } } }
              ]
            };
          }
          return { status: { equals: "published" } };
        },
        update: ({ session: session2, context, listKey, operation }) => {
          return { reviewer: { user: { id: context.session?.data.id } } };
        },
        delete: ({ session: session2, context, listKey, operation }) => {
          return { reviewer: { user: { id: context.session?.data.id } } };
        }
      },
      operation: import_access.allowAll
    },
    fields: {
      name: (0, import_fields.text)({ label: "Titel des Erfahrungsberichts", validation: { isRequired: true } }),
      reviewer: (0, import_fields.relationship)({ ref: "Reviewer.reviews", label: "Reviewer" }),
      company: (0, import_fields.relationship)({ ref: "Company.reviews", label: "Betrieb" }),
      ageAtEmployment: (0, import_fields.integer)({ label: "Alter zum Zeitpunkt der Anstellung", validation: { isRequired: true } }),
      genderOuted: (0, import_fields.checkbox)({ label: "Geschlechtl. Identit\xE4t geoutet im Betrieb" }),
      position: (0, import_fields.select)({
        label: "Position",
        options: [
          { label: "Praktikant*in", value: "intern" },
          { label: "Azubi", value: "apprentice" },
          { label: "Gesell*in", value: "journey" },
          { label: "Meister*in", value: "master" },
          { label: "Bauhelfer*in", value: "helper" },
          { label: "Andere", value: "other" }
        ],
        ui: { displayMode: "select" },
        validation: { isRequired: true }
      }),
      duration: (0, import_fields.select)({
        label: "Dauer",
        options: [
          { label: "1-3 Wochen", value: "1-3w" },
          { label: "1-4 Monate", value: "1-4m" },
          { label: "1-3 Jahre", value: "1-3y" }
        ],
        ui: { displayMode: "select" },
        validation: { isRequired: true }
      }),
      yearOfHiring: (0, import_fields.text)({ label: "Einstellungsjahr", validation: { isRequired: true } }),
      // Erfahrungen
      listenedTo: (0, import_fields.checkbox)({ label: "Wurde dir zugeh\xF6rt?" }),
      tone: (0, import_fields.select)({
        label: "Wie war der Umgangston?",
        options: [
          { label: "sehr angenehm", value: "very_good" },
          { label: "angenehm", value: "good" },
          { label: "ok", value: "ok" },
          { label: "unangenehm", value: "bad" },
          { label: "schei\xDFe", value: "awful" }
        ],
        ui: { displayMode: "select" }
      }),
      explained: (0, import_fields.select)({
        label: "Wurde dir alles erkl\xE4rt?",
        options: [
          { label: "zu viel", value: "too_much" },
          { label: "genau richtig", value: "just_right" },
          { label: "ausreichend", value: "enough" },
          { label: "zu wenig", value: "too_little" }
        ],
        ui: { displayMode: "select" }
      }),
      canAskColleagues: (0, import_fields.checkbox)({ label: "Kannst du mit deinen Fragen/Problemen zu deinen Kolleg*innen gehen?" }),
      canAskBoss: (0, import_fields.checkbox)({ label: "F\xFChlst du dich wohl zu deine*r/m Chef*in zu gehen?" }),
      proximity: (0, import_fields.select)({
        label: "Wie war das kollegiale N\xE4he/Distanz-Verh\xE4ltnis?",
        options: [
          { label: "zu nah", value: "too_close" },
          { label: "locker", value: "casual" },
          { label: "professionell", value: "professional" },
          { label: "zu distant", value: "too_distant" }
        ],
        ui: { displayMode: "select" }
      }),
      boundariesRespected: (0, import_fields.checkbox)({ label: "Wurden deine kommunizierten Grenzen ber\xFCcksichtigt?" }),
      appreciated: (0, import_fields.select)({
        label: "Hast du dich wertgesch\xE4tzt gef\xFChlt?",
        options: [
          { label: "ja", value: "yes" },
          { label: "teilweise", value: "partly" },
          { label: "nein", value: "no" }
        ],
        ui: { displayMode: "select" }
      }),
      experienceText: (0, import_fields.text)({ label: "Freitextfeld f\xFCr Ausf\xFChrungen", ui: { displayMode: "textarea" } }),
      languages: (0, import_fields.text)({ label: "Sprachen im Betrieb" }),
      socialGroups: (0, import_fields.relationship)({ ref: "SocialGroup.recommendedByReviews", many: true, label: "W\xFCrdest du den Betrieb Menschen aus einer dieser Gruppen empfehlen?" }),
      sharedWithCompany: (0, import_fields.select)({
        label: "Hast du diese Informationen mit dem Betrieb geteilt?",
        options: [
          { label: "ja", value: "yes" },
          { label: "teilweise", value: "partly" },
          { label: "nein", value: "no" }
        ],
        ui: { displayMode: "select" }
      }),
      feltComfortableSharing: (0, import_fields.select)({
        label: "Hast du dich wohl gef\xFChlt diese Informationen zu teilen?",
        options: [
          { label: "ja", value: "yes" },
          { label: "teilweise", value: "partly" },
          { label: "nein", value: "no" }
        ],
        ui: { displayMode: "select" }
      }),
      needsRespected: (0, import_fields.select)({
        label: "Wurde auf deine Bed\xFCrfnisse & Grenzen R\xFCcksicht genommen?",
        options: [
          { label: "ja", value: "yes" },
          { label: "teilweise", value: "partly" },
          { label: "nein", value: "no" }
        ],
        ui: { displayMode: "select" }
      }),
      feedback: (0, import_fields.text)({ label: "Hast du Feedback zu unserem Fragebogen?", ui: { displayMode: "textarea" } }),
      moreWishes: (0, import_fields.text)({ label: "W\xFCnschst du dir die M\xF6glichkeit weitere Dinge angeben zu k\xF6nnen?", ui: { displayMode: "textarea" } }),
      status: (0, import_fields.select)({
        label: "Zustand des Berichts",
        options: [
          { label: "Entwurf", value: "draft" },
          { label: "In Review", value: "in_review" },
          { label: "Ver\xF6ffentlicht", value: "published" }
        ],
        defaultValue: "draft",
        ui: { displayMode: "segmented-control" }
      })
    }
  }),
  SocialGroup: (0, import_core.list)({
    access: import_access.allowAll,
    fields: {
      //make name uniique
      name: (0, import_fields.text)({ label: "Name der Personengruppe", validation: { isRequired: true }, isIndexed: "unique" }),
      recommendedByReviews: (0, import_fields.relationship)({ ref: "Review.socialGroups", many: true, label: "Empfohlen von Berichten" })
    }
  })
};

// auth.ts
var import_auth = require("@keystone-6/auth");
var import_session = require("@keystone-6/core/session");
var { withAuth } = (0, import_auth.createAuth)({
  listKey: "User",
  identityField: "email",
  // this is a GraphQL query fragment for fetching what data will be attached to a context.session
  //   this can be helpful for when you are writing your access control functions
  //   you can find out more at https://keystonejs.com/docs/guides/auth-and-access-control
  sessionData: "id name createdAt roles",
  secretField: "password",
  // WARNING: remove initFirstItem functionality in production
  //   see https://keystonejs.com/docs/config/auth#init-first-item for more
  initFirstItem: {
    // if there are no items in the database, by configuring this field
    //   you are asking the Keystone AdminUI to create a new user
    //   providing inputs for these fields
    fields: ["name", "email", "password"]
    // it uses context.sudo() to do this, which bypasses any access control you might have
    //   you shouldn't use this in production
  }
});
var sessionMaxAge = 60 * 60 * 24 * 30;
var session = (0, import_session.statelessSessions)({
  maxAge: sessionMaxAge,
  secret: process.env.SESSION_SECRET
});

// keystone.ts
var keystone_default = withAuth(
  (0, import_core2.config)({
    db: {
      // we're using sqlite for the fastest startup experience
      //   for more information on what database might be appropriate for you
      //   see https://keystonejs.com/docs/guides/choosing-a-database#title
      provider: "sqlite",
      url: "file:./keystone.db",
      idField: { kind: "autoincrement" }
    },
    lists,
    session,
    server: {
      port: 3010
    }
  })
);
//# sourceMappingURL=config.js.map
