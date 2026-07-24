import React from 'react';
import Collapsible from '../UI/Collapsible';
import { Review } from '../../api/__generated__/graphql';
import {
  positionLabels,
  genderLabels,
  listenedToLabels,
  canAskBossLabels,
  canAskColleaguesLabels,
  toneLabels,
  explainedLabels,
  proximityLabels,
  appreciatedLabels,
  sharedWithCompanyLabels,
  feltComfortableSharingLabels,
  disabilitySharedWithCompanyLabels,
  disabilityFeltComfortableSharingLabels,
  ethnicitySharedWithCompanyLabels,
  ethnicityFeltComfortableSharingLabels,
  needsRespectedLabels,
  boundariesRespectedLabels,
  disabilityTypeLabels,
  ethnicityTypeLabels,
  formatEmploymentPeriod,
} from '../../utils/reviewLabels';

export type ReportCardReview = Pick<
  Review,
  | 'id'
  | 'position'
  | 'yearOfHiring'
  | 'yearOfLeaving'
  | 'ongoing'
  | 'experienceText'
  | 'feedback'
  | 'moreWishes'
  | 'specialtiesOther'
  | 'languages'
  | 'gender'
  | 'ageAtEmployment'
  | 'hoursPerWeek'
  | 'overtimePerMonth'
  | 'partTime'
  | 'collective'
  | 'trainingShortenable'
  | 'listenedTo'
  | 'canAskBoss'
  | 'canAskColleagues'
  | 'tone'
  | 'explained'
  | 'proximity'
  | 'appreciated'
  | 'boundariesRespected'
  | 'genderIdentityRespected'
  | 'needsRespected'
  | 'sharedWithCompany'
  | 'feltComfortableSharing'
  | 'disabilityTypes'
  | 'disabilitySharedWithCompany'
  | 'disabilityFeltComfortableSharing'
  | 'ethnicityTypes'
  | 'ethnicitySharedWithCompany'
  | 'ethnicityFeltComfortableSharing'
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
      ].filter((entry): entry is QaEntry => entry !== null),
      textBlocks: [review.specialtiesOther ? { label: 'Sonstiges', text: review.specialtiesOther } : null].filter(
        (block): block is TextBlock => block !== null
      ),
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
        review.boundariesRespected && review.boundariesRespected.length > 0
          ? {
              label: 'Respektierte Grenzen',
              value: review.boundariesRespected.map((v) => boundariesRespectedLabels[v]).join(', '),
            }
          : null,
        review.proximity
          ? { label: 'Nähe/Distanz', value: proximityLabels[review.proximity] ?? review.proximity }
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
        review.gender ? { label: 'Geschlecht', value: genderLabels[review.gender] } : null,
        review.genderIdentityRespected != null
          ? { label: 'Geschlechtliche Identität respektiert', value: review.genderIdentityRespected ? 'ja' : 'nein' }
          : null,
        review.needsRespected
          ? { label: 'Bedürfnisse respektiert', value: needsRespectedLabels[review.needsRespected] }
          : null,
        review.sharedWithCompany
          ? { label: 'Mit Betrieb geteilt', value: sharedWithCompanyLabels[review.sharedWithCompany] }
          : null,
        review.feltComfortableSharing
          ? { label: 'Wohl beim Teilen gefühlt', value: feltComfortableSharingLabels[review.feltComfortableSharing] }
          : null,
        review.disabilityTypes && review.disabilityTypes.length > 0
          ? {
              label: 'Behinderung/Beeinträchtigung',
              value: review.disabilityTypes.map((v) => disabilityTypeLabels[v]).join(', '),
            }
          : null,
        review.disabilitySharedWithCompany
          ? {
              label: 'Behinderung mit Betrieb geteilt',
              value: disabilitySharedWithCompanyLabels[review.disabilitySharedWithCompany],
            }
          : null,
        review.disabilityFeltComfortableSharing
          ? {
              label: 'Wohl beim Teilen (Behinderung)',
              value: disabilityFeltComfortableSharingLabels[review.disabilityFeltComfortableSharing],
            }
          : null,
        review.ethnicityTypes && review.ethnicityTypes.length > 0
          ? { label: 'Ethnizität', value: review.ethnicityTypes.map((v) => ethnicityTypeLabels[v]).join(', ') }
          : null,
        review.ethnicitySharedWithCompany
          ? {
              label: 'Ethnizität mit Betrieb geteilt',
              value: ethnicitySharedWithCompanyLabels[review.ethnicitySharedWithCompany],
            }
          : null,
        review.ethnicityFeltComfortableSharing
          ? {
              label: 'Wohl beim Teilen (Ethnizität)',
              value: ethnicityFeltComfortableSharingLabels[review.ethnicityFeltComfortableSharing],
            }
          : null,
      ].filter((entry): entry is QaEntry => entry !== null),
      textBlocks: [],
    },
    {
      title: 'Feedback zum Betrieb',
      qaItems: [],
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
  const period = formatEmploymentPeriod(review.yearOfHiring, review.yearOfLeaving, review.ongoing);
  const positionLabel = review.position ? positionLabels[review.position] : 'Bericht';
  const sections = buildSections(review);

  return (
    <Collapsible
      header={
        <h3 className="text-lg font-semibold text-blackish">
          {positionLabel}
          {period && <span className="font-normal text-gray-600"> ({period})</span>}
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
                      <dt className="text-sm font-semibold text-gray-600">{entry.label}</dt>
                      <dd className="text-gray-800">{entry.value}</dd>
                    </div>
                  ))}
                </dl>
              )}
              {section.textBlocks.map((block) => (
                <div key={block.label}>
                  <p className="text-sm font-semibold text-gray-600">{block.label}</p>
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
