import React, { useState } from 'react';
import { useForm, RegisterOptions } from 'react-hook-form';
import { Button, FormField, SelectField, CheckboxField, TextAreaField } from '../Form';
import { SectionHeading, Paragraph } from '../UI/Heading';
import {
  ReviewGenderType,
  ReviewToneType,
  ReviewExplainedType,
  ReviewAppreciatedType,
  ReviewFeltComfortableSharingType,
  ReviewSharedWithCompanyType,
  ReviewNeedsRespectedType,
  ReviewPositionType,
  ReviewListenedToType,
  ReviewCanAskBossType,
  ReviewCanAskColleaguesType,
  ReviewBoundariesRespectedType,
  ReviewDisabilityTypesType,
  ReviewDisabilitySharedWithCompanyType,
  ReviewDisabilityFeltComfortableSharingType,
  ReviewEthnicityTypesType,
  ReviewEthnicitySharedWithCompanyType,
  ReviewEthnicityFeltComfortableSharingType,
} from '../../api/__generated__/graphql';

export interface ReviewFormData {
  name: string;
  email: string;
  gender: ReviewGenderType;
  genderIdentityRespected: boolean;
  ageAtEmployment: string;
  position?: ReviewPositionType;
  yearOfHiring: string;
  yearOfLeaving: string;
  ongoing: boolean;
  listenedTo?: ReviewListenedToType;
  tone?: ReviewToneType;
  explained?: ReviewExplainedType;
  canAskColleagues?: ReviewCanAskColleaguesType;
  canAskBoss?: ReviewCanAskBossType;
  proximity: string;
  boundariesRespected: ReviewBoundariesRespectedType[];
  appreciated?: ReviewAppreciatedType;
  experienceText: string;
  languages: string;
  collective: boolean;
  hoursPerWeek: string;
  overtimePerMonth: string;
  trainingShortenable: boolean;
  partTime: boolean;
  specialtiesOther: string;
  sharedWithCompany?: ReviewSharedWithCompanyType;
  feltComfortableSharing?: ReviewFeltComfortableSharingType;
  disabilityTypes: ReviewDisabilityTypesType[];
  disabilitySharedWithCompany?: ReviewDisabilitySharedWithCompanyType;
  disabilityFeltComfortableSharing?: ReviewDisabilityFeltComfortableSharingType;
  ethnicityTypes: ReviewEthnicityTypesType[];
  ethnicitySharedWithCompany?: ReviewEthnicitySharedWithCompanyType;
  ethnicityFeltComfortableSharing?: ReviewEthnicityFeltComfortableSharingType;
  needsRespected?: ReviewNeedsRespectedType;
  feedback: string;
  moreWishes: string;
}

export interface ReviewFormProps {
  initialData?: Partial<ReviewFormData>;
  onSubmit: (data: ReviewFormData) => Promise<void>;
  isSubmitting?: boolean;
  submitError?: string;
}

const defaultFormData: ReviewFormData = {
  name: '',
  email: '',
  gender: ReviewGenderType.PreferNotToSay,
  genderIdentityRespected: false,
  ageAtEmployment: '',
  position: undefined,
  yearOfHiring: new Date().getFullYear().toString(),
  yearOfLeaving: '',
  ongoing: false,
  listenedTo: undefined,
  tone: undefined,
  explained: undefined,
  canAskColleagues: undefined,
  canAskBoss: undefined,
  proximity: '',
  boundariesRespected: [],
  appreciated: undefined,
  experienceText: '',
  languages: '',
  collective: false,
  hoursPerWeek: '',
  overtimePerMonth: '',
  trainingShortenable: false,
  partTime: false,
  specialtiesOther: '',
  sharedWithCompany: undefined,
  feltComfortableSharing: undefined,
  disabilityTypes: [],
  disabilitySharedWithCompany: undefined,
  disabilityFeltComfortableSharing: undefined,
  ethnicityTypes: [],
  ethnicitySharedWithCompany: undefined,
  ethnicityFeltComfortableSharing: undefined,
  needsRespected: undefined,
  feedback: '',
  moreWishes: '',
};

const genderOptions = [
  { label: 'keine Angabe', value: ReviewGenderType.PreferNotToSay },
  { label: 'cis-männlich', value: ReviewGenderType.CisMale },
  { label: 'cis-weiblich', value: ReviewGenderType.CisFemale },
  { label: 'nichtbinär', value: ReviewGenderType.Enby },
  { label: 'transmännlich', value: ReviewGenderType.TransMale },
  { label: 'transweiblich', value: ReviewGenderType.TransFemale },
  { label: 'divers', value: ReviewGenderType.Diverse },
  { label: 'offen', value: ReviewGenderType.Other },
];

const positionOptions = [
  { label: 'Bitte wählen', value: undefined },
  { label: 'Praktikant*in', value: ReviewPositionType.Intern },
  { label: 'Azubi', value: ReviewPositionType.Apprentice },
  { label: 'Gesell*in', value: ReviewPositionType.Journey },
  { label: 'Meister*in', value: ReviewPositionType.Master },
  { label: 'Bauhelfer*in', value: ReviewPositionType.Helper },
  { label: 'Andere', value: ReviewPositionType.Other },
];

const listenedToOptions = [
  { value: undefined, label: 'Bitte wählen' },
  { value: ReviewListenedToType.Always, label: 'immer' },
  { value: ReviewListenedToType.Mostly, label: 'meistens' },
  { value: ReviewListenedToType.Sometimes, label: 'ab und zu' },
  { value: ReviewListenedToType.Rarely, label: 'selten' },
  { value: ReviewListenedToType.Never, label: 'niemals' },
];

const canAskBossOptions = [
  { value: undefined, label: 'Bitte wählen' },
  { value: ReviewCanAskBossType.Always, label: 'immer' },
  { value: ReviewCanAskBossType.Mostly, label: 'meistens' },
  { value: ReviewCanAskBossType.Sometimes, label: 'ab und zu' },
  { value: ReviewCanAskBossType.Rarely, label: 'selten' },
  { value: ReviewCanAskBossType.Never, label: 'niemals' },
];

const canAskColleaguesOptions = [
  { value: undefined, label: 'Bitte wählen' },
  { value: ReviewCanAskColleaguesType.Always, label: 'immer' },
  { value: ReviewCanAskColleaguesType.Mostly, label: 'meistens' },
  { value: ReviewCanAskColleaguesType.Sometimes, label: 'ab und zu' },
  { value: ReviewCanAskColleaguesType.Rarely, label: 'selten' },
  { value: ReviewCanAskColleaguesType.Never, label: 'niemals' },
];

const toneOptions = [
  { value: undefined, label: 'Bitte wählen' },
  { value: ReviewToneType.VeryGood, label: 'sehr angenehm' },
  { value: ReviewToneType.Good, label: 'angenehm' },
  { value: ReviewToneType.Ok, label: 'ok' },
  { value: ReviewToneType.Bad, label: 'unangenehm' },
  { value: ReviewToneType.Awful, label: 'scheiße' },
];

const explainedOptions = [
  { value: undefined, label: 'Bitte wählen' },
  { value: ReviewExplainedType.TooMuch, label: 'zu viel' },
  { value: ReviewExplainedType.JustRight, label: 'genau richtig' },
  { value: ReviewExplainedType.Enough, label: 'ausreichend' },
  { value: ReviewExplainedType.TooLittle, label: 'zu wenig' },
];

const proximityOptions = [
  { value: undefined, label: 'Bitte wählen' },
  { value: 'too_close', label: 'zu nah' },
  { value: 'casual', label: 'locker' },
  { value: 'professional', label: 'professionell' },
  { value: 'too_distant', label: 'zu distant' },
];

const appreciatedOptions = [
  { value: undefined, label: 'Bitte wählen' },
  { value: ReviewAppreciatedType.Yes, label: 'ja' },
  { value: ReviewAppreciatedType.Partly, label: 'teilweise' },
  { value: ReviewAppreciatedType.No, label: 'nein' },
];

const sharedWithCompanyOptions = [
  { value: undefined, label: 'Bitte wählen' },
  { value: ReviewSharedWithCompanyType.Yes, label: 'ja' },
  { value: ReviewSharedWithCompanyType.Partly, label: 'teilweise' },
  { value: ReviewSharedWithCompanyType.No, label: 'nein' },
];

const feltComfortableSharingOptions = [
  { value: undefined, label: 'Bitte wählen' },
  { value: ReviewFeltComfortableSharingType.Yes, label: 'ja' },
  { value: ReviewFeltComfortableSharingType.Partly, label: 'teilweise' },
  { value: ReviewFeltComfortableSharingType.No, label: 'nein' },
];

const disabilitySharedOptions = [
  { value: undefined, label: 'Bitte wählen' },
  { value: ReviewDisabilitySharedWithCompanyType.Yes, label: 'ja' },
  { value: ReviewDisabilitySharedWithCompanyType.Partly, label: 'teilweise' },
  { value: ReviewDisabilitySharedWithCompanyType.No, label: 'nein' },
];

const disabilityFeltOptions = [
  { value: undefined, label: 'Bitte wählen' },
  { value: ReviewDisabilityFeltComfortableSharingType.Yes, label: 'ja' },
  { value: ReviewDisabilityFeltComfortableSharingType.Partly, label: 'teilweise' },
  { value: ReviewDisabilityFeltComfortableSharingType.No, label: 'nein' },
];

const ethnicitySharedOptions = [
  { value: undefined, label: 'Bitte wählen' },
  { value: ReviewEthnicitySharedWithCompanyType.Yes, label: 'ja' },
  { value: ReviewEthnicitySharedWithCompanyType.Partly, label: 'teilweise' },
  { value: ReviewEthnicitySharedWithCompanyType.No, label: 'nein' },
];

const ethnicityFeltOptions = [
  { value: undefined, label: 'Bitte wählen' },
  { value: ReviewEthnicityFeltComfortableSharingType.Yes, label: 'ja' },
  { value: ReviewEthnicityFeltComfortableSharingType.Partly, label: 'teilweise' },
  { value: ReviewEthnicityFeltComfortableSharingType.No, label: 'nein' },
];

const needsRespectedOptions = [
  { value: undefined, label: 'Bitte wählen' },
  { value: ReviewNeedsRespectedType.Yes, label: 'ja' },
  { value: ReviewNeedsRespectedType.Partly, label: 'teilweise' },
  { value: ReviewNeedsRespectedType.No, label: 'nein' },
];

const boundaryTypes: { value: ReviewBoundariesRespectedType; label: string }[] = [
  { value: ReviewBoundariesRespectedType.PhysicalStrength, label: 'körperlich-kräftetechnisch' },
  { value: ReviewBoundariesRespectedType.Emotional, label: 'emotional' },
  { value: ReviewBoundariesRespectedType.Responsibility, label: 'verantwortungstechnisch' },
  { value: ReviewBoundariesRespectedType.PhysicalDistance, label: 'körperlich-distanztechnisch' },
];

const disabilityTypeOptions: { value: ReviewDisabilityTypesType; label: string }[] = [
  { value: ReviewDisabilityTypesType.AutismSpectrum, label: 'Autismus-Spektrum' },
  { value: ReviewDisabilityTypesType.Autoimmune, label: 'Autoimmunerkrankung' },
  { value: ReviewDisabilityTypesType.BlindVisuallyImpaired, label: 'blind/sehbehindert' },
  { value: ReviewDisabilityTypesType.DeafHearingImpaired, label: 'gehörlos/hörbehindert' },
  { value: ReviewDisabilityTypesType.PhysicallyDisabled, label: 'körperlich behindert' },
  { value: ReviewDisabilityTypesType.MentalIllness, label: 'psychische Erkrankung' },
  { value: ReviewDisabilityTypesType.ChronicIllness, label: 'chronische Erkrankung' },
  { value: ReviewDisabilityTypesType.Cardiovascular, label: 'Herz-Kreislauf-Erkrankung' },
  { value: ReviewDisabilityTypesType.Musculoskeletal, label: 'Skelett-/Muskelerkrankung' },
  { value: ReviewDisabilityTypesType.Metabolic, label: 'Stoffwechselerkrankung' },
  { value: ReviewDisabilityTypesType.Digestive, label: 'Erkrankung des Verdauungssystems' },
  { value: ReviewDisabilityTypesType.Spasticity, label: 'Spastik' },
  { value: ReviewDisabilityTypesType.LearningDisability, label: 'Lernschwierigkeiten / sog. geistige Behinderung' },
  { value: ReviewDisabilityTypesType.Neurodivergent, label: 'neurodivergent' },
  { value: ReviewDisabilityTypesType.WheelchairMobility, label: 'Rollstuhlnutzend / Mobilitätseinschränkung' },
  { value: ReviewDisabilityTypesType.DrugUse, label: 'Drogenkonsument*in' },
  { value: ReviewDisabilityTypesType.SexualViolence, label: 'Erfahrung sexualisierter Gewalt' },
  { value: ReviewDisabilityTypesType.Overweight, label: 'mehrgewichtig/hochgewichtig' },
  { value: ReviewDisabilityTypesType.Underweight, label: 'wenigergewichtig' },
];

const ethnicityTypeOptions: { value: ReviewEthnicityTypesType; label: string }[] = [
  { value: ReviewEthnicityTypesType.White, label: 'weiß' },
  { value: ReviewEthnicityTypesType.PersonOfColor, label: 'Person of Color' },
  { value: ReviewEthnicityTypesType.Black, label: 'Schwarz' },
  { value: ReviewEthnicityTypesType.Indigenous, label: 'Indigen' },
  { value: ReviewEthnicityTypesType.Jewish, label: 'Jüdisch' },
  { value: ReviewEthnicityTypesType.Muslim, label: 'Muslim*in' },
  { value: ReviewEthnicityTypesType.Migrant, label: 'Migrant*in' },
  { value: ReviewEthnicityTypesType.RomaSinti, label: 'Rom*nja/Sinti*zze' },
];

type FormPage = {
  fields: Array<keyof ReviewFormData>;
  render: () => React.ReactNode;
};

const ReviewForm: React.FC<ReviewFormProps> = ({
  initialData,
  onSubmit,
  isSubmitting = false,
  submitError,
}) => {
  const [currentPage, setCurrentPage] = useState(1);

  const {
    register,
    handleSubmit,
    trigger,
    watch,
    formState: { errors },
  } = useForm<ReviewFormData>({
    defaultValues: { ...defaultFormData, ...initialData },
    mode: 'onTouched',
  });

  const field = (name: keyof ReviewFormData, requiredMsg?: string, extra?: RegisterOptions) => ({
    ...register(name, { ...(requiredMsg ? { required: requiredMsg } : {}), ...extra }),
    ...(requiredMsg ? { required: true as const } : {}),
    error: errors[name]?.message,
  });

  const sanitize = (data: ReviewFormData): ReviewFormData => {
    const e = <T,>(v: T | string | undefined): T | undefined =>
      v === '' ? undefined : (v as T);
    return {
      ...data,
      position: e(data.position),
      listenedTo: e(data.listenedTo),
      canAskBoss: e(data.canAskBoss),
      canAskColleagues: e(data.canAskColleagues),
      tone: e(data.tone),
      explained: e(data.explained),
      proximity: data.proximity || '',
      appreciated: e(data.appreciated),
      sharedWithCompany: e(data.sharedWithCompany),
      feltComfortableSharing: e(data.feltComfortableSharing),
      disabilitySharedWithCompany: e(data.disabilitySharedWithCompany),
      disabilityFeltComfortableSharing: e(data.disabilityFeltComfortableSharing),
      ethnicitySharedWithCompany: e(data.ethnicitySharedWithCompany),
      ethnicityFeltComfortableSharing: e(data.ethnicityFeltComfortableSharing),
      needsRespected: e(data.needsRespected),
    };
  };

  const [collective, trainingShortenable, partTime] = watch([
    'collective',
    'trainingShortenable',
    'partTime',
  ]);

  const currentYear = new Date().getFullYear();
  const hiringYearOptions = Array.from({ length: currentYear - 1969 }, (_, i) => ({
    value: (currentYear - i).toString(),
    label: (currentYear - i).toString(),
  }));
  const leavingYearOptions = [
    { value: '', label: 'Dauert an' },
    ...Array.from({ length: currentYear - 1969 }, (_, i) => ({
      value: (currentYear - i).toString(),
      label: (currentYear - i).toString(),
    })),
  ];

  const pages: FormPage[] = [
    {
      fields: ['name', 'email'],
      render: () => (
        <>
          <div>
            <SectionHeading className="mb-3">Deine Kontaktdaten</SectionHeading>
            <Paragraph className="mb-6">
              Dein Name und deine E-Mail-Adresse werden nur genutzt, um dich bei Rückfragen zu
              kontaktieren. Sie werden nie veröffentlicht.
            </Paragraph>
          </div>
          <FormField
            {...field('name', 'Name ist erforderlich.')}
            label="Dein Name"
            placeholder="Dein Name"
          />
          <FormField
            {...field('email', 'E-Mail ist erforderlich, damit wir dich kontaktieren können.', {
              pattern: { value: /^\S+@\S+$/i, message: 'Ungültige E-Mail-Adresse' },
            })}
            label="E-Mail"
            placeholder="deine@email.de"
            type="email"
          />
        </>
      ),
    },
    {
      fields: [
        'position',
        'yearOfHiring',
        'yearOfLeaving',
        'ageAtEmployment',
        'hoursPerWeek',
        'overtimePerMonth',
      ],
      render: () => (
        <>
          <div>
            <SectionHeading className="mb-3">Zur (Arbeits)Stelle</SectionHeading>
            <Paragraph className="mb-6">
              Erzähl uns etwas über deine Arbeit: welchen Beruf übtest du dort aus, wann hast du
              dort gearbeitet, wie alt warst du und wie waren die Arbeitszeiten geregelt.
            </Paragraph>
          </div>
          <SelectField
            {...field('position', 'Position ist erforderlich')}
            label="Position im Betrieb"
            options={positionOptions}
          />
          <SelectField
            {...register('yearOfHiring')}
            label="Beginn Arbeitszeit (Jahr)"
            required
            options={hiringYearOptions}
          />
          <SelectField
            {...register('yearOfLeaving')}
            label="Ende Arbeitszeit (Jahr)"
            options={leavingYearOptions}
          />
          <FormField
            {...field('ageAtEmployment')}
            type="number"
            label="Dein Alter bei Arbeitsbeginn (optional)"
            min="14"
            max="100"
          />
          <FormField
            {...field('hoursPerWeek')}
            type="number"
            label="Durchschnittliche Stunden/Woche (optional)"
          />
          <FormField
            {...field('overtimePerMonth')}
            type="number"
            label="Geschätztes (Jahres-)Mittel an Überstunden pro Monat (optional)"
          />
        </>
      ),
    },
    {
      fields: ['languages', 'collective', 'trainingShortenable', 'partTime', 'specialtiesOther'],
      render: () => (
        <>
          <div>
            <SectionHeading className="mb-3">Allgemeines zum Betrieb</SectionHeading>
            <Paragraph className="mb-6">
              Hier geht es um allgemeine Rahmenbedingungen im Betrieb.
            </Paragraph>
          </div>
          <FormField
            {...register('languages')}
            label="Sprachen im Betrieb"
            placeholder="z.B. Deutsch, Englisch"
          />
          <div className="space-y-3 pt-2">
            <h3 className="font-semibold text-gray-800">Besonderheiten</h3>
            <CheckboxField {...register('collective')} label="Kollektiv" checked={collective} />
            <CheckboxField
              {...register('trainingShortenable')}
              label="Ausbildung verkürzbar"
              checked={trainingShortenable}
            />
            <CheckboxField
              {...register('partTime')}
              label="Teilzeit möglich"
              checked={partTime}
            />
            <div className="pt-2">
              <TextAreaField
                {...register('specialtiesOther')}
                label="Sonstiges"
                rows={3}
                placeholder="Weitere Besonderheiten des Betriebs..."
              />
            </div>
          </div>
        </>
      ),
    },
    {
      fields: [
        'listenedTo',
        'tone',
        'explained',
        'canAskBoss',
        'canAskColleagues',
        'boundariesRespected',
        'proximity',
        'appreciated',
        'experienceText',
      ],
      render: () => (
        <>
          <div>
            <SectionHeading className="mb-3">Betriebsklima & Respekt</SectionHeading>
            <Paragraph className="mb-6">
              Wie hast du die Zusammenarbeit und den Umgang im Betrieb erlebt?
            </Paragraph>
          </div>
          <SelectField
            {...register('canAskBoss')}
            label="Ich konnte mit Fragen/Problemen zu meine*r Chef*in gehen"
            options={canAskBossOptions}
          />
          <SelectField
            {...register('canAskColleagues')}
            label="Ich konnte mit Fragen/Problemen zu Kolleg*innen gehen"
            options={canAskColleaguesOptions}
          />
          <SelectField
            {...register('listenedTo')}
            label="Mir wurde zugehört"
            options={listenedToOptions}
          />
          <SelectField
            {...register('tone')}
            label="Wie war der Umgangston?"
            options={toneOptions}
          />
          <SelectField
            {...register('explained')}
            label="Wurde dir genug erklärt?"
            options={explainedOptions}
          />
          <SelectField
            {...register('proximity')}
            label="Nähe/Distanz-Verhältnis"
            options={proximityOptions}
          />
          <SelectField
            {...register('appreciated')}
            label="Hast du dich wertgeschätzt gefühlt?"
            options={appreciatedOptions}
          />
          <div className="space-y-3 pt-2">
            <h3 className="font-semibold text-gray-800">Meine Grenzen wurden respektiert</h3>
            <p className="text-sm text-gray-500">Mehrfachauswahl möglich</p>
            <div className="space-y-2">
              {boundaryTypes.map(bt => (
                <label key={bt.value} className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    value={bt.value}
                    {...register('boundariesRespected')}
                    className="w-4 h-4 accent-brand"
                  />
                  <span className="text-sm text-gray-700">{bt.label}</span>
                </label>
              ))}
            </div>
          </div>
          <TextAreaField
            {...register('experienceText')}
            label="Meine Erfahrung"
            rows={6}
            placeholder="Erzähle etwas genauer, wie du das Betriebsklima und den Umgang miteinander erlebt hast."
          />
        </>
      ),
    },
    {
      fields: [
        'gender',
        'sharedWithCompany',
        'feltComfortableSharing',
        'disabilityTypes',
        'disabilitySharedWithCompany',
        'disabilityFeltComfortableSharing',
        'ethnicityTypes',
        'ethnicitySharedWithCompany',
        'ethnicityFeltComfortableSharing',
        'genderIdentityRespected',
        'needsRespected',
      ],
      render: () => (
        <>
          <div>
            <SectionHeading className="mb-3">Gleichstellung & Diskriminierung</SectionHeading>
            <Paragraph className="mb-2">
              Dieser Abschnitt widmet sich Fragen zu Geschlecht und anderen Formen der
              Diskriminierung. Deine Erfahrungen helfen, Benachteiligung sichtbar zu machen und
              andere vor diskriminierendem Verhalten zu warnen.
            </Paragraph>
          </div>
          <div className="space-y-4">
            <h3 className="font-semibold text-gray-800 text-lg border-b pb-1">Geschlecht</h3>
            <SelectField {...register('gender')} label="Geschlecht" options={genderOptions} />
            <SelectField
              {...register('sharedWithCompany')}
              label="War dem Betrieb deine Geschlechtsidentität bekannt?"
              options={sharedWithCompanyOptions}
            />
            <SelectField
              {...register('feltComfortableSharing')}
              label="Hast du dich damit wohlgefühlt, dass dem Betrieb deine Geschlechtsidentität bekannt war?"
              options={feltComfortableSharingOptions}
            />
          </div>
          <div className="space-y-4">
            <h3 className="font-semibold text-gray-800 text-lg border-b pb-1">Beeinträchtigung</h3>
            <div className="space-y-2">
              <p className="text-sm text-gray-600">Wähle aus, was auf dich zutrifft.</p>
              {disabilityTypeOptions.map(dt => (
                <label key={dt.value} className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    value={dt.value}
                    {...register('disabilityTypes')}
                    className="w-4 h-4 accent-brand"
                  />
                  <span className="text-sm text-gray-700">{dt.label}</span>
                </label>
              ))}
            </div>
            <SelectField
              {...register('disabilitySharedWithCompany')}
              label="War dem Betrieb deine Beeinträchtigung bekannt?"
              options={disabilitySharedOptions}
            />
            <SelectField
              {...register('disabilityFeltComfortableSharing')}
              label="Hast du dich damit wohlgefühlt, dass dem Betrieb deine Beeinträchtigung bekannt war?"
              options={disabilityFeltOptions}
            />
          </div>
          <div className="space-y-4">
            <h3 className="font-semibold text-gray-800 text-lg border-b pb-1">
              Herkunft & Erscheinungsbild
            </h3>
            <div className="space-y-2">
              <p className="text-sm text-gray-600">Mehrfachauswahl möglich</p>
              {ethnicityTypeOptions.map(et => (
                <label key={et.value} className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    value={et.value}
                    {...register('ethnicityTypes')}
                    className="w-4 h-4 accent-brand"
                  />
                  <span className="text-sm text-gray-700">{et.label}</span>
                </label>
              ))}
            </div>
            <SelectField
              {...register('ethnicitySharedWithCompany')}
              label="War dem Betrieb deine Herkunft/Erscheinungsbild bekannt?"
              options={ethnicitySharedOptions}
            />
            <SelectField
              {...register('ethnicityFeltComfortableSharing')}
              label="Hast du dich damit wohlgefühlt, dass dem Betrieb deine Herkunft/Erscheinungsbild bekannt war?"
              options={ethnicityFeltOptions}
            />
          </div>
          <div className="space-y-4">
            <h3 className="font-semibold text-gray-800 text-lg border-b pb-1">Gesamt</h3>
            <SelectField
              {...register('needsRespected')}
              label="Wurde insgesamt auf deine Bedürfnisse bezüglich deiner Identität Rücksicht genommen?"
              options={needsRespectedOptions}
            />
          </div>
        </>
      ),
    },
    {
      fields: ['feedback', 'moreWishes'],
      render: () => (
        <>
          <div>
            <SectionHeading className="mb-3">Feedback zum Betrieb</SectionHeading>
            <Paragraph className="mb-6">Fast geschafft!</Paragraph>
          </div>
          <TextAreaField
            {...register('feedback')}
            label="Feedback zum Betrieb"
            rows={4}
            placeholder="Kann der Betrieb etwas verbessern? (optional)"
          />
          <TextAreaField
            {...register('moreWishes')}
            label="Wünsche an das Betriebsradar"
            rows={3}
            placeholder="Möchtest du uns Feedback geben oder weitere Dinge ergänzen?"
          />
          {submitError && (
            <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-brand-error">
              {submitError}
            </div>
          )}
        </>
      ),
    },
  ];

  const pageCount = pages.length;

  const handleNext = async () => {
    const { fields } = pages[currentPage - 1];
    const valid = fields.length ? await trigger(fields) : true;
    if (valid) {
      setCurrentPage(prev => Math.min(prev + 1, pageCount));
      window.scrollTo(0, 0);
    }
  };

  const handlePrev = () => {
    setCurrentPage(prev => Math.max(prev - 1, 1));
    window.scrollTo(0, 0);
  };

  return (
    <form className="min-h-screen">
      <div className="max-w-2xl mx-auto">
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-700">
              Seite {currentPage} von {pageCount}
            </span>
            <span className="text-sm text-gray-500">
              {Math.round((currentPage / pageCount) * 100)}%
            </span>
          </div>
          <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-brand transition-all duration-300"
              style={{ width: `${(currentPage / pageCount) * 100}%` }}
            />
          </div>
        </div>

        <div key={currentPage} className="space-y-6 mb-8">
          {pages[currentPage - 1].render()}
        </div>

        <div className="flex gap-4">
          {currentPage > 1 && (
            <Button
              type="button"
              variant="secondary"
              onClick={handlePrev}
              disabled={isSubmitting}
              className="flex-1"
            >
              Zurück
            </Button>
          )}
          {currentPage < pageCount ? (
            <Button
              type="button"
              variant="primary"
              onClick={handleNext}
              disabled={isSubmitting}
              className="flex-1"
            >
              Weiter
            </Button>
          ) : (
            <Button
              type="button"
              variant="primary"
              isLoading={isSubmitting}
              disabled={isSubmitting}
              className="flex-1"
              onClick={handleSubmit(data => onSubmit(sanitize(data)))}
            >
              Abschicken
            </Button>
          )}
        </div>
      </div>
    </form>
  );
};

export default ReviewForm;
