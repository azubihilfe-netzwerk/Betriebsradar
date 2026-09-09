import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useForm, RegisterOptions } from 'react-hook-form';
import {
  Button,
  FormField,
  SelectField,
  CheckboxField,
  CheckboxGroup,
  CheckboxSelectField,
  TextAreaField,
} from '../Form';
import { SectionHeading, Paragraph } from '../UI/Heading';
import {
  ReviewToneType,
  ReviewExplainedType,
  ReviewAppreciatedType,
  ReviewPositionType,
  ReviewListenedToType,
  ReviewCanAskBossType,
  ReviewCanAskColleaguesType,
  ReviewCanAskTrainerType,
  ReviewBoundariesRespectedType,
  ReviewEmploymentDurationType,
  ReviewRecommendType,
  ReviewOvertimeHandlingType,
  ReviewWorkplaceSafetyType,
  ReviewGenderDiscriminationExperiencedType,
  ReviewGenderDiscriminationObservedType,
  ReviewEthnicityDiscriminationExperiencedType,
  ReviewEthnicityDiscriminationObservedType,
  ReviewDisabilityDiscriminationExperiencedType,
  ReviewDisabilityDiscriminationObservedType,
} from '../../api/__generated__/graphql';

/** Shared "wie oft?" values behind every checkbox+select discrimination combo. */
type DiscriminationFrequency = 'no' | 'constantly' | 'occasionally' | 'rarely';

type DiscriminationField =
  | 'genderDiscriminationExperienced'
  | 'genderDiscriminationObserved'
  | 'ethnicityDiscriminationExperienced'
  | 'ethnicityDiscriminationObserved'
  | 'disabilityDiscriminationExperienced'
  | 'disabilityDiscriminationObserved';

export interface ReviewFormData {
  name: string;
  email: string;
  ageAtEmployment: string;
  position?: ReviewPositionType;
  yearOfHiring: string;
  employmentDuration?: ReviewEmploymentDurationType;
  listenedTo?: ReviewListenedToType;
  tone?: ReviewToneType;
  explained?: ReviewExplainedType;
  canAskColleagues?: ReviewCanAskColleaguesType;
  canAskBoss?: ReviewCanAskBossType;
  canAskTrainer?: ReviewCanAskTrainerType;
  boundariesRespected: ReviewBoundariesRespectedType[];
  appreciated?: ReviewAppreciatedType;
  experienceText: string;
  languages: string;
  collective: boolean;
  hoursPerWeek: string;
  overtimePerMonth: string;
  overtimeHandling: ReviewOvertimeHandlingType[];
  overtimeHandlingOther: string;
  trainingShortenable: boolean;
  partTime: boolean;
  specialtiesOther: string;
  workplaceSafety?: ReviewWorkplaceSafetyType;
  genderDiscriminationExperienced: ReviewGenderDiscriminationExperiencedType;
  genderDiscriminationObserved: ReviewGenderDiscriminationObservedType;
  ethnicityDiscriminationExperienced: ReviewEthnicityDiscriminationExperiencedType;
  ethnicityDiscriminationObserved: ReviewEthnicityDiscriminationObservedType;
  disabilityDiscriminationExperienced: ReviewDisabilityDiscriminationExperiencedType;
  disabilityDiscriminationObserved: ReviewDisabilityDiscriminationObservedType;
  discriminationExperienceText: string;
  feedback: string;
  moreWishes: string;
  recommend?: ReviewRecommendType;
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
  ageAtEmployment: '',
  position: undefined,
  yearOfHiring: new Date().getFullYear().toString(),
  employmentDuration: undefined,
  listenedTo: undefined,
  tone: undefined,
  explained: undefined,
  canAskColleagues: undefined,
  canAskBoss: undefined,
  canAskTrainer: undefined,
  boundariesRespected: [],
  appreciated: undefined,
  experienceText: '',
  languages: '',
  collective: false,
  hoursPerWeek: '',
  overtimePerMonth: '',
  overtimeHandling: [],
  overtimeHandlingOther: '',
  trainingShortenable: false,
  partTime: false,
  specialtiesOther: '',
  workplaceSafety: undefined,
  genderDiscriminationExperienced: ReviewGenderDiscriminationExperiencedType.No,
  genderDiscriminationObserved: ReviewGenderDiscriminationObservedType.No,
  ethnicityDiscriminationExperienced: ReviewEthnicityDiscriminationExperiencedType.No,
  ethnicityDiscriminationObserved: ReviewEthnicityDiscriminationObservedType.No,
  disabilityDiscriminationExperienced: ReviewDisabilityDiscriminationExperiencedType.No,
  disabilityDiscriminationObserved: ReviewDisabilityDiscriminationObservedType.No,
  discriminationExperienceText: '',
  feedback: '',
  moreWishes: '',
  recommend: undefined,
};

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

const canAskTrainerOptions = [
  { value: undefined, label: 'Bitte wählen' },
  { value: ReviewCanAskTrainerType.Always, label: 'immer' },
  { value: ReviewCanAskTrainerType.Mostly, label: 'meistens' },
  { value: ReviewCanAskTrainerType.Sometimes, label: 'ab und zu' },
  { value: ReviewCanAskTrainerType.Rarely, label: 'selten' },
  { value: ReviewCanAskTrainerType.Never, label: 'niemals' },
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

const employmentDurationOptions = [
  { value: undefined, label: 'Bitte wählen' },
  { value: ReviewEmploymentDurationType.OneWeekOrLess, label: '1 Woche oder weniger' },
  { value: ReviewEmploymentDurationType.OneToFourWeeks, label: '1-4 Wochen' },
  { value: ReviewEmploymentDurationType.OneToThreeMonths, label: '1-3 Monate' },
  { value: ReviewEmploymentDurationType.ThreeToSixMonths, label: '3-6 Monate' },
  { value: ReviewEmploymentDurationType.SixToTwelveMonths, label: '6-12 Monate' },
  { value: ReviewEmploymentDurationType.OneToThreeYears, label: '1-3 Jahre' },
  { value: ReviewEmploymentDurationType.MoreThanThreeYears, label: 'Mehr als 3 Jahre' },
];

const overtimeHandlingOptions: { value: ReviewOvertimeHandlingType; label: string }[] = [
  { value: ReviewOvertimeHandlingType.Payout, label: 'Auszahlung' },
  { value: ReviewOvertimeHandlingType.TimeOff, label: 'Arbeitszeitausgleich' },
  { value: ReviewOvertimeHandlingType.Bonus, label: 'Überstundenzuschlag' },
  { value: ReviewOvertimeHandlingType.Forfeited, label: 'Verfall' },
  { value: ReviewOvertimeHandlingType.Other, label: 'Sonstiges' },
];

const workplaceSafetyOptions = [
  { value: undefined, label: 'Bitte wählen' },
  { value: ReviewWorkplaceSafetyType.Strong, label: 'stark' },
  { value: ReviewWorkplaceSafetyType.Medium, label: 'mittel' },
  { value: ReviewWorkplaceSafetyType.None, label: 'gar nicht' },
];

/** Options for the select revealed once a discrimination checkbox is ticked ('no' is the unticked state). */
const discriminationFrequencyOptions: { value: DiscriminationFrequency; label: string }[] = [
  { value: 'constantly', label: 'ja, dauernd' },
  { value: 'occasionally', label: 'ja, ab und zu' },
  { value: 'rarely', label: 'kaum' },
];

const appreciatedOptions = [
  { value: undefined, label: 'Bitte wählen' },
  { value: ReviewAppreciatedType.Yes, label: 'ja' },
  { value: ReviewAppreciatedType.Partly, label: 'teilweise' },
  { value: ReviewAppreciatedType.No, label: 'nein' },
];

const recommendOptions = [
  { value: undefined, label: 'Bitte wählen' },
  { value: ReviewRecommendType.Yes, label: 'ja' },
  { value: ReviewRecommendType.Partly, label: 'teilweise' },
  { value: ReviewRecommendType.No, label: 'nein' },
];

const boundaryTypes: { value: ReviewBoundariesRespectedType; label: string }[] = [
  { value: ReviewBoundariesRespectedType.PhysicalStrength, label: 'körperlich-kräftetechnisch' },
  { value: ReviewBoundariesRespectedType.Emotional, label: 'emotional' },
  { value: ReviewBoundariesRespectedType.Responsibility, label: 'verantwortungstechnisch' },
  { value: ReviewBoundariesRespectedType.PhysicalDistance, label: 'körperlich-distanztechnisch' },
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
  const [privacyAccepted, setPrivacyAccepted] = useState(false);

  const {
    register,
    handleSubmit,
    trigger,
    watch,
    setValue,
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

  const maxWordsRule = (max: number): RegisterOptions => ({
    validate: (v: unknown) => {
      const trimmed = (typeof v === 'string' ? v : '').trim();
      const count = trimmed === '' ? 0 : trimmed.split(/\s+/).length;
      return count <= max || `Bitte kürze auf maximal ${max} Wörter (aktuell ${count}).`;
    },
  });

  const sanitize = (data: ReviewFormData): ReviewFormData => {
    const e = <T,>(v: T | string | undefined): T | undefined =>
      v === '' ? undefined : (v as T);
    return {
      ...data,
      position: e(data.position),
      employmentDuration: e(data.employmentDuration),
      listenedTo: e(data.listenedTo),
      canAskBoss: e(data.canAskBoss),
      canAskColleagues: e(data.canAskColleagues),
      canAskTrainer: e(data.canAskTrainer),
      tone: e(data.tone),
      explained: e(data.explained),
      appreciated: e(data.appreciated),
      workplaceSafety: e(data.workplaceSafety),
      recommend: e(data.recommend),
    };
  };

  const [collective, trainingShortenable, partTime] = watch([
    'collective',
    'trainingShortenable',
    'partTime',
  ]);

  const overtimeHandling = watch('overtimeHandling');
  const showOvertimeHandlingOther = overtimeHandling?.includes(ReviewOvertimeHandlingType.Other);

  const [
    genderExperienced,
    genderObserved,
    ethnicityExperienced,
    ethnicityObserved,
    disabilityExperienced,
    disabilityObserved,
  ] = watch([
    'genderDiscriminationExperienced',
    'genderDiscriminationObserved',
    'ethnicityDiscriminationExperienced',
    'ethnicityDiscriminationObserved',
    'disabilityDiscriminationExperienced',
    'disabilityDiscriminationObserved',
  ]);
  const showDiscriminationExperienceText = [genderExperienced, ethnicityExperienced, disabilityExperienced].some(
    v => v !== 'no'
  );

  const discriminationCombo = (name: DiscriminationField, value: string, label: React.ReactNode) => (
    <CheckboxSelectField
      label={label}
      checked={value !== 'no'}
      onCheckedChange={checked =>
        setValue(name, (checked ? 'constantly' : 'no') as ReviewFormData[DiscriminationField])
      }
      options={discriminationFrequencyOptions}
      selectValue={value}
      onSelectChange={v => setValue(name, v as ReviewFormData[DiscriminationField])}
    />
  );

  const currentYear = new Date().getFullYear();
  const hiringYearOptions = Array.from({ length: currentYear - 1969 }, (_, i) => ({
    value: (currentYear - i).toString(),
    label: (currentYear - i).toString(),
  }));
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
        'employmentDuration',
        'ageAtEmployment',
        'hoursPerWeek',
        'overtimePerMonth',
        'overtimeHandling',
        'overtimeHandlingOther',
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
            {...field('employmentDuration', 'Dauer des Arbeitsverhältnisses ist erforderlich.')}
            label="Dauer des Arbeitsverhältnisses"
            options={employmentDurationOptions}
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
          <CheckboxGroup label="Wie wird mit Überstunden umgegangen?">
            {overtimeHandlingOptions.map(oh => (
              <CheckboxField
                key={oh.value}
                value={oh.value}
                {...register('overtimeHandling')}
                label={oh.label}
              />
            ))}
          </CheckboxGroup>
          {showOvertimeHandlingOther && (
            <FormField
              {...field('overtimeHandlingOther', undefined, maxWordsRule(10))}
              label="Sonstiges: Umgang mit Überstunden"
              placeholder="Max. 10 Worte"
            />
          )}
        </>
      ),
    },
    {
      fields: ['languages', 'collective', 'trainingShortenable', 'partTime', 'specialtiesOther', 'workplaceSafety'],
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
            placeholder=" z.B. Deutsch, Chef spricht Englisch, Gesellin spricht Spanisch"
          />
          <CheckboxGroup label="Besonderheiten">
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
          </CheckboxGroup>
          <SelectField
            {...register('workplaceSafety')}
            label="Arbeitssicherheit: Wie sehr wird auf die Arbeitssicherheit der Mitarbeitenden geachtet?"
            options={workplaceSafetyOptions}
          />
          <TextAreaField
            {...field('specialtiesOther', undefined, maxWordsRule(50))}
            label="Sonstiges"
            maxWords={50}
            rows={3}
            placeholder="Weitere Besonderheiten des Betriebs..."
          />
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
        'canAskTrainer',
        'boundariesRespected',
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
            label="Ich konnte mit Fragen/Problemen zu meine*r Chef*in gehen."
            options={canAskBossOptions}
          />
          <SelectField
            {...register('canAskColleagues')}
            label="Ich konnte mit Fragen/Problemen zu Kolleg*innen gehen."
            options={canAskColleaguesOptions}
          />
          <SelectField
            {...register('canAskTrainer')}
            label="Ich konnte mit Fragen/Problemen zur Ausbilder*in gehen."
            options={canAskTrainerOptions}
          />
          <SelectField
            {...register('listenedTo')}
            label="Ich wurde ernst genommen."
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
            {...register('appreciated')}
            label="Hast du dich wertgeschätzt gefühlt?"
            options={appreciatedOptions}
          />
          <CheckboxGroup label="Folgende Grenzen wurden nicht respektiert">
            {boundaryTypes.map(bt => (
              <CheckboxField
                key={bt.value}
                value={bt.value}
                {...register('boundariesRespected')}
                label={bt.label}
              />
            ))}
          </CheckboxGroup>
          <TextAreaField
            {...field('experienceText', undefined, maxWordsRule(150))}
            label="Meine Erfahrung"
            maxWords={150}
            rows={6}
            placeholder="Erzähle etwas genauer, wie du das Betriebsklima und den Umgang miteinander erlebt hast."
          />
        </>
      ),
    },
    {
      fields: [
        'genderDiscriminationExperienced',
        'genderDiscriminationObserved',
        'ethnicityDiscriminationExperienced',
        'ethnicityDiscriminationObserved',
        'disabilityDiscriminationExperienced',
        'disabilityDiscriminationObserved',
        'discriminationExperienceText',
      ],
      render: () => (
        <>
          <div>
            <SectionHeading className="mb-3">Gleichstellung und Diskriminierung</SectionHeading>
            <Paragraph className="mb-2">
              Diese Seite widmet sich Fragen zu verschiedenen Formen der Diskriminierung im
              Betrieb. Deine Erfahrungen helfen, Benachteiligung sichtbar zu machen und andere vor
              abwertendem Verhalten zu warnen.
            </Paragraph>
          </div>
          <div className="space-y-4">
            <h3 className="font-semibold text-blackish text-lg border-b pb-1">Geschlecht</h3>
            {discriminationCombo(
              'genderDiscriminationExperienced',
              genderExperienced,
              'Ich habe im Betrieb selbst Diskriminierung aufgrund meines Geschlechts oder meiner Sexualität* erfahren.'
            )}
            {discriminationCombo(
              'genderDiscriminationObserved',
              genderObserved,
              'Ich habe die Diskriminierung anderer aufgrund ihres Geschlechts oder ihrer Sexualität* im Betrieb beobachtet.'
            )}
            <Paragraph className="text-sm text-gray-600">
              *Sexismus, Homophobie und Queerfeinlichkeit sind Formen der Diskriminierung, bei
              denen Personen aufgrund ihrer Geschlechtsidentität (zB. trans, nicht-binär, inter)
              oder ihrer Sexualität (zB. homosexuell, asexuell) Benachteiligung und Gewalt
              erfahren.
            </Paragraph>
          </div>
          <div className="space-y-4">
            <h3 className="font-semibold text-gray-800 text-lg border-b pb-1">
              Herkunft, Religion, Erscheinungsbild
            </h3>
            {discriminationCombo(
              'ethnicityDiscriminationExperienced',
              ethnicityExperienced,
              'Ich habe im Betrieb selbst Diskriminierung aufgrund meiner Herkunft, meiner Religion oder meines Erscheinungsbildes* erfahren.'
            )}
            {discriminationCombo(
              'ethnicityDiscriminationObserved',
              ethnicityObserved,
              'Ich habe die Diskriminierung anderer aufgrund ihrer Herkunft, Religion oder ihres Erscheinungsbildes* im Betrieb beobachtet.'
            )}
            <Paragraph className="text-sm text-gray-600">
              *Rassismus, Muslimfeindlichkeit und Antisemitismus sind Formen der Diskriminierung,
              bei der Menschen zum Beispiel wegen ihrer Hautfarbe, ihrer Haare, ihres Namens, ihrer
              Sprache oder ihres Glaubens ausgegrenzt und abgewertet werden.
            </Paragraph>
          </div>
          <div className="space-y-2">
            <h3 className="font-semibold text-blackish text-lg border-b pb-1">Beeinträchtigung</h3>
            {discriminationCombo(
              'disabilityDiscriminationExperienced',
              disabilityExperienced,
              'Ich habe im Betrieb selbst Diskriminierung aufgrund meiner Behinderung, meiner Krankheit oder meiner Neurodivergenz* erfahren.'
            )}
            {discriminationCombo(
              'disabilityDiscriminationObserved',
              disabilityObserved,
              'Ich habe die Diskriminierung anderer aufgrund ihrer Behinderung, ihrer Krankheit oder ihrer Neurodivergenz* im Betrieb beobachtet.'
            )}
            <Paragraph className="text-sm text-gray-600">
              *Ableismus ist eine Form von Diskriminierung, bei der Menschen mit Behinderung von
              Menschen ohne Behinderung auf die Merkmale reduziert werden, in denen sie sich vom
              „Normal" unterscheiden. Diese Merkmale können sichtbar (zB. Rollstuhl) oder
              unsichtbar (zB. Psychische Erkrankung) sein. Wenn von diesen Merkmalen darauf
              geschlossen wird, was die Person vermeintlich kann oder nicht kann oder wie sich die
              Person fühlt, ist das eine diskriminierende Ungleichbehandlung.
            </Paragraph>
          </div>
          {showDiscriminationExperienceText && (
            <TextAreaField
              {...field('discriminationExperienceText', undefined, maxWordsRule(250))}
              label="Du hast selbst Diskriminierung erlebt? Hier kannst du genauer beschreiben, in welchem Umfang und Form."
              maxWords={250}
              rows={5}
            />
          )}
        </>
      ),
    },
    {
      fields: ['recommend', 'feedback', 'moreWishes'],
      render: () => (
        <>
          <div>
            <SectionHeading className="mb-3">Feedback zum Betrieb</SectionHeading>
            <Paragraph className="mb-6">Fast geschafft!</Paragraph>
          </div>
          <SelectField
            {...register('recommend')}
            label="Würdest du deinen Betrieb weiter empfehlen?"
            options={recommendOptions}
          />
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
            placeholder="Möchtest du uns zu dieser Website Feedback geben oder hast du Ideen für Verbesserungen?"
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

        {currentPage === pageCount && (
          <div className="mb-4">
            <CheckboxField
              required
              label={
                <>
                  Ich habe die <Link to="/datenschutz" target="_blank" className="underline">Datenschutzerklärung</Link> gelesen und stimme der Datenverarbeitung zu.
                </>
              }
              checked={privacyAccepted}
              onChange={e => setPrivacyAccepted(e.target.checked)}
            />
          </div>
        )}

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
              disabled={isSubmitting || !privacyAccepted}
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
