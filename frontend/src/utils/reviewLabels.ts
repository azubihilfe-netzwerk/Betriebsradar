import {
  ReviewPositionType,
  ReviewListenedToType,
  ReviewCanAskBossType,
  ReviewCanAskColleaguesType,
  ReviewCanAskTrainerType,
  ReviewToneType,
  ReviewExplainedType,
  ReviewAppreciatedType,
  ReviewBoundariesRespectedType,
  ReviewEmploymentDurationType,
  ReviewRecommendType,
  ReviewOvertimeHandlingType,
  ReviewWorkplaceSafetyType,
  ReviewGenderDiscriminationExperiencedType,
} from '../api/__generated__/graphql';

export const positionLabels: Record<ReviewPositionType, string> = {
  [ReviewPositionType.Intern]: 'Praktikant*in',
  [ReviewPositionType.Apprentice]: 'Azubi',
  [ReviewPositionType.Journey]: 'Gesell*in',
  [ReviewPositionType.Master]: 'Meister*in',
  [ReviewPositionType.Helper]: 'Bauhelfer*in',
  [ReviewPositionType.Other]: 'Andere',
};

const frequencyLabels = {
  [ReviewListenedToType.Always]: 'immer',
  [ReviewListenedToType.Mostly]: 'meistens',
  [ReviewListenedToType.Sometimes]: 'ab und zu',
  [ReviewListenedToType.Rarely]: 'selten',
  [ReviewListenedToType.Never]: 'niemals',
};

export const listenedToLabels: Record<ReviewListenedToType, string> = frequencyLabels;
export const canAskBossLabels: Record<ReviewCanAskBossType, string> = {
  [ReviewCanAskBossType.Always]: 'immer',
  [ReviewCanAskBossType.Mostly]: 'meistens',
  [ReviewCanAskBossType.Sometimes]: 'ab und zu',
  [ReviewCanAskBossType.Rarely]: 'selten',
  [ReviewCanAskBossType.Never]: 'niemals',
};
export const canAskColleaguesLabels: Record<ReviewCanAskColleaguesType, string> = {
  [ReviewCanAskColleaguesType.Always]: 'immer',
  [ReviewCanAskColleaguesType.Mostly]: 'meistens',
  [ReviewCanAskColleaguesType.Sometimes]: 'ab und zu',
  [ReviewCanAskColleaguesType.Rarely]: 'selten',
  [ReviewCanAskColleaguesType.Never]: 'niemals',
};
export const canAskTrainerLabels: Record<ReviewCanAskTrainerType, string> = {
  [ReviewCanAskTrainerType.Always]: 'immer',
  [ReviewCanAskTrainerType.Mostly]: 'meistens',
  [ReviewCanAskTrainerType.Sometimes]: 'ab und zu',
  [ReviewCanAskTrainerType.Rarely]: 'selten',
  [ReviewCanAskTrainerType.Never]: 'niemals',
};

export const toneLabels: Record<ReviewToneType, string> = {
  [ReviewToneType.VeryGood]: 'sehr angenehm',
  [ReviewToneType.Good]: 'angenehm',
  [ReviewToneType.Ok]: 'ok',
  [ReviewToneType.Bad]: 'unangenehm',
  [ReviewToneType.Awful]: 'scheiße',
};

export const explainedLabels: Record<ReviewExplainedType, string> = {
  [ReviewExplainedType.TooMuch]: 'zu viel',
  [ReviewExplainedType.JustRight]: 'genau richtig',
  [ReviewExplainedType.Enough]: 'ausreichend',
  [ReviewExplainedType.TooLittle]: 'zu wenig',
};

export const employmentDurationLabels: Record<ReviewEmploymentDurationType, string> = {
  [ReviewEmploymentDurationType.OneWeekOrLess]: '1 Woche oder weniger',
  [ReviewEmploymentDurationType.OneToFourWeeks]: '1-4 Wochen',
  [ReviewEmploymentDurationType.OneToThreeMonths]: '1-3 Monate',
  [ReviewEmploymentDurationType.ThreeToSixMonths]: '3-6 Monate',
  [ReviewEmploymentDurationType.SixToTwelveMonths]: '6-12 Monate',
  [ReviewEmploymentDurationType.OneToThreeYears]: '1-3 Jahre',
  [ReviewEmploymentDurationType.MoreThanThreeYears]: 'Mehr als 3 Jahre',
};

export const appreciatedLabels: Record<ReviewAppreciatedType, string> = {
  [ReviewAppreciatedType.Yes]: 'ja',
  [ReviewAppreciatedType.Partly]: 'teilweise',
  [ReviewAppreciatedType.No]: 'nein',
};

const yesPartlyNo = { Yes: 'ja', Partly: 'teilweise', No: 'nein' };

export const recommendLabels: Record<ReviewRecommendType, string> = {
  [ReviewRecommendType.Yes]: yesPartlyNo.Yes,
  [ReviewRecommendType.Partly]: yesPartlyNo.Partly,
  [ReviewRecommendType.No]: yesPartlyNo.No,
};

export const boundariesRespectedLabels: Record<ReviewBoundariesRespectedType, string> = {
  [ReviewBoundariesRespectedType.PhysicalStrength]: 'körperlich-kräftetechnisch',
  [ReviewBoundariesRespectedType.Emotional]: 'emotional',
  [ReviewBoundariesRespectedType.Responsibility]: 'verantwortungstechnisch',
  [ReviewBoundariesRespectedType.PhysicalDistance]: 'körperlich-distanztechnisch',
};

export const overtimeHandlingLabels: Record<ReviewOvertimeHandlingType, string> = {
  [ReviewOvertimeHandlingType.Payout]: 'Auszahlung',
  [ReviewOvertimeHandlingType.TimeOff]: 'Arbeitszeitausgleich',
  [ReviewOvertimeHandlingType.Bonus]: 'Überstundenzuschlag',
  [ReviewOvertimeHandlingType.Forfeited]: 'Verfall',
  [ReviewOvertimeHandlingType.Other]: 'Sonstiges',
};

export const workplaceSafetyLabels: Record<ReviewWorkplaceSafetyType, string> = {
  [ReviewWorkplaceSafetyType.Strong]: 'stark',
  [ReviewWorkplaceSafetyType.Medium]: 'mittel',
  [ReviewWorkplaceSafetyType.None]: 'gar nicht',
};

/**
 * Shared "wie oft?" scale used by every checkbox+select discrimination combo
 * (gender/ethnicity/disability x experienced/observed). All six generated enum
 * types share the same underlying values, so one label map covers all of them.
 */
export const discriminationFrequencyLabels: Record<'no' | 'constantly' | 'occasionally' | 'rarely', string> = {
  [ReviewGenderDiscriminationExperiencedType.No]: 'nein',
  [ReviewGenderDiscriminationExperiencedType.Constantly]: 'ja, dauernd',
  [ReviewGenderDiscriminationExperiencedType.Occasionally]: 'ja, ab und zu',
  [ReviewGenderDiscriminationExperiencedType.Rarely]: 'kaum',
};

/** "2024, 1-3 Jahre" if a duration is known, or just "2024" otherwise. */
export function formatEmploymentPeriod(
  yearOfHiring?: string | null,
  employmentDuration?: ReviewEmploymentDurationType | null
): string {
  if (!yearOfHiring) return '';
  if (employmentDuration) return `${yearOfHiring}, ${employmentDurationLabels[employmentDuration]}`;
  return `${yearOfHiring}`;
}
