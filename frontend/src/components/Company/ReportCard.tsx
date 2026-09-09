import React from 'react';
import Collapsible from '../UI/Collapsible';
import { Review } from '../../api/__generated__/graphql';
import {
  positionLabels,
  listenedToLabels,
  canAskBossLabels,
  canAskColleaguesLabels,
  canAskTrainerLabels,
  toneLabels,
  explainedLabels,
  appreciatedLabels,
  recommendLabels,
  boundariesRespectedLabels,
  overtimeHandlingLabels,
  workplaceSafetyLabels,
  discriminationFrequencyLabels,
  formatEmploymentPeriod,
} from '../../utils/reviewLabels';

export type ReportCardReview = Pick<
  Review,
  | 'id'
  | 'position'
  | 'yearOfHiring'
  | 'employmentDuration'
  | 'experienceText'
  | 'feedback'
  | 'moreWishes'
  | 'specialtiesOther'
  | 'languages'
  | 'ageAtEmployment'
  | 'hoursPerWeek'
  | 'overtimePerMonth'
  | 'partTime'
  | 'collective'
  | 'trainingShortenable'
  | 'overtimeHandling'
  | 'overtimeHandlingOther'
  | 'workplaceSafety'
  | 'listenedTo'
  | 'canAskBoss'
  | 'canAskColleagues'
  | 'canAskTrainer'
  | 'tone'
  | 'explained'
  | 'appreciated'
  | 'boundariesRespected'
  | 'recommend'
  | 'genderDiscriminationExperienced'
  | 'genderDiscriminationObserved'
  | 'ethnicityDiscriminationExperienced'
  | 'ethnicityDiscriminationObserved'
  | 'disabilityDiscriminationExperienced'
  | 'disabilityDiscriminationObserved'
  | 'discriminationExperienceText'
>;

interface QaEntry {
  label: string;
  value: string;
}

interface TextBlock {
  label: string;
  text: string;
}

interface Section {
  title: string;
  qaItems: QaEntry[];
  textBlocks: TextBlock[];
}

/**
 * Mirrors the topic grouping used when writing a report (see ReviewForm's pages),
 * so reading a report follows the same mental model. Sections and fields with no
 * value are dropped entirely to keep unanswered questions out of view.
 */
function buildSections(review: ReportCardReview): Section[] {
  const sections: Section[] = [
    {
      title: 'Zur Stelle',
      qaItems: [
        review.ageAtEmployment != null
          ? { label: 'Alter bei Anstellung', value: `${review.ageAtEmployment}` }
          : null,
        review.hoursPerWeek != null ? { label: 'Stunden/Woche', value: `${review.hoursPerWeek}` } : null,
        review.overtimePerMonth != null
          ? { label: 'Überstunden/Monat', value: `${review.overtimePerMonth}` }
          : null,
      ].filter((entry): entry is QaEntry => entry !== null),
      textBlocks: [],
    },
    {
      title: 'Allgemeines zum Betrieb',
      qaItems: [
        review.languages ? { label: 'Sprachen im Betrieb', value: review.languages } : null,
        review.collective != null ? { label: 'Kollektiv', value: review.collective ? 'ja' : 'nein' } : null,
        review.trainingShortenable != null
          ? { label: 'Ausbildung verkürzbar', value: review.trainingShortenable ? 'ja' : 'nein' }
          : null,
        review.partTime != null ? { label: 'Teilzeit möglich', value: review.partTime ? 'ja' : 'nein' } : null,
        review.overtimeHandling && review.overtimeHandling.length > 0
          ? {
              label: 'Umgang mit Überstunden',
              value: review.overtimeHandling.map((v) => overtimeHandlingLabels[v]).join(', '),
            }
          : null,
        review.workplaceSafety
          ? { label: 'Arbeitssicherheit', value: workplaceSafetyLabels[review.workplaceSafety] }
          : null,
      ].filter((entry): entry is QaEntry => entry !== null),
      textBlocks: [
        review.specialtiesOther ? { label: 'Sonstiges', text: review.specialtiesOther } : null,
        review.overtimeHandlingOther
          ? { label: 'Umgang mit Überstunden: Sonstiges', text: review.overtimeHandlingOther }
          : null,
      ].filter((block): block is TextBlock => block !== null),
    },
    {
      title: 'Betriebsklima & Respekt',
      qaItems: [
        review.listenedTo ? { label: 'Wird zugehört', value: listenedToLabels[review.listenedTo] } : null,
        review.tone ? { label: 'Umgangston', value: toneLabels[review.tone] } : null,
        review.explained ? { label: 'Erklärungen', value: explainedLabels[review.explained] } : null,
        review.canAskBoss ? { label: 'Fragen an Chef*in möglich', value: canAskBossLabels[review.canAskBoss] } : null,
        review.canAskColleagues
          ? { label: 'Fragen an Kolleg*innen möglich', value: canAskColleaguesLabels[review.canAskColleagues] }
          : null,
        review.canAskTrainer
          ? { label: 'Fragen an Ausbilder*in möglich', value: canAskTrainerLabels[review.canAskTrainer] }
          : null,
        review.boundariesRespected && review.boundariesRespected.length > 0
          ? {
              label: 'Nicht respektierte Grenzen',
              value: review.boundariesRespected.map((v) => boundariesRespectedLabels[v]).join(', '),
            }
          : null,
        review.appreciated ? { label: 'Wertschätzung', value: appreciatedLabels[review.appreciated] } : null,
      ].filter((entry): entry is QaEntry => entry !== null),
      textBlocks: [
        review.experienceText ? { label: 'Erfahrungsbericht', text: review.experienceText } : null,
      ].filter((block): block is TextBlock => block !== null),
    },
    {
      title: 'Gleichstellung & Diskriminierung',
      qaItems: [
        review.genderDiscriminationExperienced && review.genderDiscriminationExperienced !== 'no'
          ? {
              label: 'Diskriminierung (Geschlecht/Sexualität) selbst erfahren',
              value: discriminationFrequencyLabels[review.genderDiscriminationExperienced],
            }
          : null,
        review.genderDiscriminationObserved && review.genderDiscriminationObserved !== 'no'
          ? {
              label: 'Diskriminierung (Geschlecht/Sexualität) bei anderen beobachtet',
              value: discriminationFrequencyLabels[review.genderDiscriminationObserved],
            }
          : null,
        review.ethnicityDiscriminationExperienced && review.ethnicityDiscriminationExperienced !== 'no'
          ? {
              label: 'Diskriminierung (Herkunft/Religion/Erscheinungsbild) selbst erfahren',
              value: discriminationFrequencyLabels[review.ethnicityDiscriminationExperienced],
            }
          : null,
        review.ethnicityDiscriminationObserved && review.ethnicityDiscriminationObserved !== 'no'
          ? {
              label: 'Diskriminierung (Herkunft/Religion/Erscheinungsbild) bei anderen beobachtet',
              value: discriminationFrequencyLabels[review.ethnicityDiscriminationObserved],
            }
          : null,
        review.disabilityDiscriminationExperienced && review.disabilityDiscriminationExperienced !== 'no'
          ? {
              label: 'Diskriminierung (Behinderung/Krankheit/Neurodivergenz) selbst erfahren',
              value: discriminationFrequencyLabels[review.disabilityDiscriminationExperienced],
            }
          : null,
        review.disabilityDiscriminationObserved && review.disabilityDiscriminationObserved !== 'no'
          ? {
              label: 'Diskriminierung (Behinderung/Krankheit/Neurodivergenz) bei anderen beobachtet',
              value: discriminationFrequencyLabels[review.disabilityDiscriminationObserved],
            }
          : null,
      ].filter((entry): entry is QaEntry => entry !== null),
      textBlocks: [
        review.discriminationExperienceText
          ? { label: 'Beschreibung der selbst erlebten Diskriminierung', text: review.discriminationExperienceText }
          : null,
      ].filter((block): block is TextBlock => block !== null),
    },
    {
      title: 'Feedback zum Betrieb',
      qaItems: [
        review.recommend ? { label: 'Weiterempfehlung', value: recommendLabels[review.recommend] } : null,
      ].filter((entry): entry is QaEntry => entry !== null),
      textBlocks: [
        review.feedback ? { label: 'Feedback zum Betrieb', text: review.feedback } : null,
        review.moreWishes ? { label: 'Wünsche ans Betriebsradar', text: review.moreWishes } : null,
      ].filter((block): block is TextBlock => block !== null),
    },
  ];

  return sections.filter((section) => section.qaItems.length > 0 || section.textBlocks.length > 0);
}

interface ReportCardProps {
  review: ReportCardReview;
}

const ReportCard: React.FC<ReportCardProps> = ({ review }) => {
  const period = formatEmploymentPeriod(review.yearOfHiring, review.employmentDuration);
  const positionLabel = review.position ? positionLabels[review.position] : 'Bericht';
  const sections = buildSections(review);

  return (
    <Collapsible
      header={
        <h3 className="text-lg font-semibold text-blackish">
          {positionLabel}
          {period && <span className="font-normal"> ({period})</span>}
        </h3>
      }
    >
      <div className="space-y-5">
        {sections.map((section) => (
          <div key={section.title}>
            <h4 className="mb-2 text-sm font-bold uppercase tracking-wide text-brand">{section.title}</h4>
            <div className="space-y-3">
              {section.qaItems.length > 0 && (
                <dl className="grid grid-cols-1 gap-x-6 gap-y-2 sm:grid-cols-2">
                  {section.qaItems.map((entry) => (
                    <div key={entry.label}>
                      <dt className="text-sm font-bold text-blackish">{entry.label}</dt>
                      <dd className="text-gray-800">{entry.value}</dd>
                    </div>
                  ))}
                </dl>
              )}
              {section.textBlocks.map((block) => (
                <div key={block.label}>
                  <p className="text-sm font-bold text-blackish">{block.label}</p>
                  <p className="whitespace-pre-line text-gray-800">{block.text}</p>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </Collapsible>
  );
};

export default ReportCard;
