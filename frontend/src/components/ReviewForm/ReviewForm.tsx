import React, { useState } from 'react';
import { useForm, RegisterOptions } from 'react-hook-form';
import { Button, FormField, SelectField, CheckboxField, TextAreaField } from '../Form';
import {
  ReviewGenderType,
  ReviewToneType,
  ReviewExplainedType,
  ReviewAppreciatedType,
  ReviewFeltComfortableSharingType,
  ReviewSharedWithCompanyType,
  ReviewNeedsRespectedType,
  ReviewPositionType,
  ReviewDurationType,
} from '../../api/__generated__/graphql';

export interface ReviewFormData {
  name: string;
  email: string;
  publishName: boolean;
  gender: ReviewGenderType;
  genderOuted: boolean;
  ageAtEmployment: string;
  position?: ReviewPositionType;
  duration?: ReviewDurationType;
  yearOfHiring: string;
  listenedTo: boolean;
  tone?: ReviewToneType;
  explained?: ReviewExplainedType;
  canAskColleagues: boolean;
  canAskBoss: boolean;
  proximity: string;
  boundariesRespected: boolean;
  appreciated?: ReviewAppreciatedType;
  experienceText: string;
  languages: string;
  collective: boolean;
  hoursPerWeek: string;
  trainingShortenable: boolean;
  partTime: boolean;
  sharedWithCompany?: ReviewSharedWithCompanyType;
  feltComfortableSharing?: ReviewFeltComfortableSharingType;
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
  publishName: false,
  gender: ReviewGenderType.PreferNotToSay,
  ageAtEmployment: '',
  genderOuted: false,
  position: undefined,
  duration: undefined,
  yearOfHiring: new Date().getFullYear().toString(),
  listenedTo: false,
  tone: undefined,
  explained: undefined,
  canAskColleagues: false,
  canAskBoss: false,
  proximity: '',
  boundariesRespected: false,
  appreciated: undefined,
  experienceText: '',
  languages: '',
  collective: false,
  hoursPerWeek: '',
  trainingShortenable: false,
  partTime: false,
  sharedWithCompany: undefined,
  feltComfortableSharing: undefined,
  needsRespected: undefined,
  feedback: '',
  moreWishes: '',
};

const genderOptions = [
  { label: 'keine Angabe', value: ReviewGenderType.PreferNotToSay },
  { label: 'cis-männlich', value: ReviewGenderType.CisMale },
  { label: 'cis-weiblich', value: ReviewGenderType.CisFemale },
  { label: 'nichtbinär', value: ReviewGenderType.Enby },
  { label: 'trans', value: ReviewGenderType.Trans },
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


const durationOptions = [
                { value: undefined, label: 'Bitte wählen' },
                { value: ReviewDurationType.OneToThreeweeks, label: '1-3 Wochen' },
                { value: ReviewDurationType.FiveToTwelveMonths, label: '5-12 Monate' },
                { value: ReviewDurationType.OneToFourMonths, label: '1-4 Monate' },
                { value: ReviewDurationType.OneToThreeYears, label: '1-3 Jahre' },
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

const feltComfortableSharingOptions = [
  { value: undefined, label: 'Bitte wählen' },
  { value: ReviewFeltComfortableSharingType.Yes, label: 'ja' },
  { value: ReviewFeltComfortableSharingType.Partly, label: 'teilweise' },
  { value: ReviewFeltComfortableSharingType.No, label: 'nein' },
];

const sharedWithCompanyOptions = [
  { value: undefined, label: 'Bitte wählen' },
  { value: ReviewSharedWithCompanyType.Yes, label: 'ja' },
  { value: ReviewSharedWithCompanyType.Partly, label: 'teilweise' },
  { value: ReviewSharedWithCompanyType.No, label: 'nein' },
];

const needsRespectedOptions = [
  { value: undefined, label: 'Bitte wählen' },
  { value: ReviewNeedsRespectedType.Yes, label: 'ja' },
  { value: ReviewNeedsRespectedType.Partly, label: 'teilweise' },
  { value: ReviewNeedsRespectedType.No, label: 'nein' },
];

const FIELDS_PER_PAGE: Record<number, Array<keyof ReviewFormData>> = {
  1: ['name', 'publishName', 'email',], //general information
  2: ['position', 'yearOfHiring', 'ageAtEmployment', 'duration', 'hoursPerWeek'], //about the position
  3: [ 'languages', 'collective', 'trainingShortenable', 'partTime'], //about the company in general
  4: [ 'listenedTo', 'tone','explained', 'canAskBoss', 'canAskColleagues', 'boundariesRespected',  'proximity',  'appreciated', 'experienceText' ], //experiences and respect
  5: [ 'gender', 'genderOuted',  'sharedWithCompany', 'feltComfortableSharing','needsRespected'], //discrimination
  6: ['feedback', 'moreWishes'], //final questions
};

const ReviewForm: React.FC<ReviewFormProps> = ({
  initialData,
  onSubmit,
  isSubmitting = false,
  submitError,
}) => {
  const [currentPage, setCurrentPage] = useState(1);

  const { register, handleSubmit, trigger, watch, formState: { errors } } = useForm<ReviewFormData>({
    defaultValues: { ...defaultFormData, ...initialData },
    mode: 'onTouched',
  });

  const field = (name: keyof ReviewFormData, requiredMsg?: string, extra?: RegisterOptions) => ({
    ...register(name, { ...(requiredMsg ? { required: requiredMsg } : {}), ...extra }),
    ...(requiredMsg ? { required: true as const } : {}),
    error: errors[name]?.message,
  });

  // register() returns ref/onChange/onBlur but not `checked`, so watch boolean fields for CheckboxField
  const [
    listenedTo, boundariesRespected, canAskBoss, canAskColleagues,
    genderOuted, collective, trainingShortenable, partTime, publishName,
  ] = watch([
    'listenedTo', 'boundariesRespected', 'canAskBoss', 'canAskColleagues',
    'genderOuted', 'collective', 'trainingShortenable', 'partTime', 'publishName',
  ]);


  const handleNext = async () => {
      const fieldsOnCurrentPage = FIELDS_PER_PAGE[currentPage] || [];
    const valid = fieldsOnCurrentPage.length ? await trigger(fieldsOnCurrentPage) : true;
    if (valid) {
      setCurrentPage(prev => Math.min(prev + 1, 6));
      window.scrollTo(0, 0);
    }
  };

  const handlePrev = () => {
    setCurrentPage(prev => Math.max(prev - 1, 1));
    window.scrollTo(0, 0);
  };

  const renderPage = () => {
    switch (currentPage) {
      case 1:
        return (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-800 mb-3">Deine Kontaktdaten</h2>
              <p className="text-gray-600 mb-6">Damit wir deinen Bericht zuordnen können, benötigen wir ein paar Angaben zu deiner Person. Dein Name und deine E-Mail-Adresse werden nicht veröffentlicht, es sei denn, du stimmst dem ausdrücklich zu.</p>
            </div>

            <FormField
              {...field('name', 'Name ist erforderlich. Keine Sorge: Wird nicht veröffentlicht.')}
              label="Dein Name"
              placeholder="Dein Name"
            />

            <div className="p-4 bg-blue-50 rounded-lg">
              <CheckboxField {...register('publishName')} label="Mein Name darf veröffentlicht werden" checked={publishName} />
            </div>

            <FormField
              {...field('email', 'E-Mail ist erforderlich, damit wir dich kontaktieren können.', { pattern: { value: /^\S+@\S+$/i, message: 'Ungültige E-Mail-Adresse' } })}
              label="E-Mail"
              placeholder="deine@email.de"
              type="email"
            />
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-800 mb-3">Zur Ausbildungsstelle</h2>
              <p className="text-gray-600 mb-6">Erzähl uns etwas über deine Ausbildung – welchen Beruf du lernst, wann du angefangen hast, wie alt du warst und wie viele Stunden du arbeitest.</p>
            </div>

            <SelectField
              {...field('position', 'Position ist erforderlich')}
              label="Position/Ausbildungsberuf"
              options={positionOptions}
            />

            <SelectField
              {...register('yearOfHiring')}
              label="Ausbildungsjahr"
              required
              options={Array.from({ length: 20 }, (_, i) => ({
                value: (new Date().getFullYear() - i).toString(),
                label: (new Date().getFullYear() - i).toString(),
              }))}
            />

            <FormField
              {...field('ageAtEmployment', 'Alter ist erforderlich')}
              type="number"
              label="Alter bei Ausbildungsbeginn"
              min="14"
              max="100"
            />

            <SelectField
              {...field('duration', 'Dauer ist erforderlich')}
              label="Dauer der Ausbildung"
              options={durationOptions}
            />

            <FormField
              {...field('hoursPerWeek', 'Stunden pro Woche sind erforderlich')}
              type="number"
              label="Stunden pro Woche"
            />
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-800 mb-3">Allgemeines zum Betrieb</h2>
              <p className="text-gray-600 mb-6">Hier geht es um allgemeine Rahmenbedingungen im Betrieb, in dem du ausgebildet wirst – zum Beispiel welche Sprachen gesprochen werden und welche besonderen Merkmale der Betrieb hat.</p>
            </div>

            <FormField
              {...register('languages')}
              label="Sprachen im Betrieb"
              placeholder="z.B. Deutsch, Englisch"
            />

            <div className="space-y-3 pt-2">
              <h3 className="font-semibold text-gray-800">Besonderheiten</h3>
              <CheckboxField {...register('collective')} label="Kollektiv" checked={collective} />
              <CheckboxField {...register('trainingShortenable')} label="Ausbildung verkürzbar" checked={trainingShortenable} />
              <CheckboxField {...register('partTime')} label="Teilzeit möglich" checked={partTime} />
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-800 mb-3">Erfahrungen & Respekt</h2>
              <p className="text-gray-600 mb-6">Wie hast du die Zusammenarbeit und den Umgang im Betrieb erlebt? Hier kannst du erzählen, ob dir zugehört wurde, wie der Ton war und ob deine Grenzen respektiert wurden.</p>
            </div>
         

            <div className="space-y-3 p-4 bg-gray-50 rounded-lg">
              <CheckboxField {...register('canAskBoss')} label="Ich konnte Fragen an meinen Chef/meine Chefin stellen" checked={canAskBoss} />
              <CheckboxField {...register('canAskColleagues')} label="Ich konnte Fragen an Kolleg*innen stellen" checked={canAskColleagues} />
               <CheckboxField {...register('listenedTo')} label="Mir wurde zugehört" checked={listenedTo} />
              <CheckboxField {...register('boundariesRespected')} label="Meine Grenzen wurden respektiert" checked={boundariesRespected} />
            </div>

            <SelectField
              {...field('tone', 'Umgangston ist erforderlich')}
              label="Wie war der Umgangston?"
              options={toneOptions}
            />

            <SelectField
              {...field('explained', 'Diese Angabe ist erforderlich')}
              label="Wurde dir alles erklärt?"
              options={explainedOptions}
            />

            <SelectField
              {...field('proximity', 'Diese Angabe ist erforderlich')}
              label="Nähe/Distanz-Verhältnis"
              options={proximityOptions}
            />

            <SelectField
              {...field('appreciated', 'Diese Angabe ist erforderlich')}
              label="Hast du dich wertgeschätzt gefühlt?"
              options={appreciatedOptions}
            />

            <TextAreaField
              {...field('experienceText', 'Erfahrungsbericht ist erforderlich')}
              label="Meine Erfahrung"
              rows={6}
              placeholder="Erzähle uns von deinen Erfahrungen..."
            />
          </div>
        );

      case 5:
        return (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-800 mb-3">Gleichstellung & Diskriminierung</h2>
              <p className="text-gray-600 mb-6">Dieser Abschnitt widmet sich Fragen zu Geschlecht und möglicher Diskriminierung. Deine Angaben helfen, Benachteiligungen sichtbar zu machen und die Arbeitsbedingungen für alle zu verbessern.</p>
            </div>

            <SelectField
              {...register('gender')}
              label="Geschlecht"
              options={genderOptions}
            />

            <div className="space-y-3 p-4 bg-gray-50 rounded-lg">
              <CheckboxField {...register('genderOuted')} label="Meine geschlechtliche Identität wurde im Betrieb respektiert" checked={genderOuted} />
            </div>

            <SelectField
              {...field('sharedWithCompany', 'Diese Angabe ist erforderlich')}
              label="Hast du diese Informationen mit dem Betrieb geteilt?"
              options={sharedWithCompanyOptions}
            />

            <SelectField
              {...field('feltComfortableSharing', 'Diese Angabe ist erforderlich')}
              label="Hast du dich wohl gefühlt, diese Informationen zu teilen?"
              options={feltComfortableSharingOptions}
            />

            <SelectField
              {...field('needsRespected', 'Diese Angabe ist erforderlich')}
              label="Wurde auf deine Bedürfnisse Rücksicht genommen?"
              options={needsRespectedOptions}
            />
          </div>
        );

      case 6:
        return (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-800 mb-3">Abschluss</h2>
              <p className="text-gray-600 mb-6">Fast geschafft! Teile uns abschließend dein Feedback mit und lass uns wissen, ob du noch weitere Wünsche oder Anmerkungen hast.</p>
            </div>

            <TextAreaField
              {...field('feedback', 'Feedback ist erforderlich')}
              label="Feedback und Kritik"
              rows={4}
              placeholder="Was könnte der Betrieb verbessern?"
            />

            <TextAreaField
              {...register('moreWishes')}
              label="Weitere Wünsche"
              rows={3}
              placeholder="Wünschst du dir die Möglichkeit weitere Dinge angeben zu können? ?"
            />

            {submitError && (
              <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
                {submitError}
              </div>
            )}
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-md p-6 md:p-8">
        {/* Progress Indicator */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-700">
              Seite {currentPage} von 6
            </span>
            <span className="text-sm text-gray-500">{Math.round((currentPage / 6) * 100)}%</span>
          </div>
          <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-navbar-blue transition-all duration-300"
              style={{ width: `${(currentPage / 6) * 100}%` }}
            />
          </div>
        </div>

        {/* Page Content */}
        <div key={currentPage} className="mb-8">{renderPage()}</div>

        {/* Navigation Buttons */}
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

          {currentPage < 6 ? (
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
              type="submit"
              variant="primary"
              isLoading={isSubmitting}
              disabled={isSubmitting}
              className="flex-1"
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
