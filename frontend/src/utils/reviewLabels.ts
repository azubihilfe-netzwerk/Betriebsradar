import {
  ReviewPositionType,
  ReviewGenderType,
  ReviewListenedToType,
  ReviewCanAskBossType,
  ReviewCanAskColleaguesType,
  ReviewCanAskTrainerType,
  ReviewToneType,
  ReviewExplainedType,
  ReviewAppreciatedType,
  ReviewSharedWithCompanyType,
  ReviewFeltComfortableSharingType,
  ReviewDisabilitySharedWithCompanyType,
  ReviewDisabilityFeltComfortableSharingType,
  ReviewEthnicitySharedWithCompanyType,
  ReviewEthnicityFeltComfortableSharingType,
  ReviewNeedsRespectedType,
  ReviewBoundariesRespectedType,
  ReviewDisabilityTypesType,
  ReviewEthnicityTypesType,
  ReviewEmploymentDurationType,
  ReviewRecommendType,
} from '../api/__generated__/graphql';

export const positionLabels: Record<ReviewPositionType, string> = {
  [ReviewPositionType.Intern]: 'Praktikant*in',
  [ReviewPositionType.Apprentice]: 'Azubi',
  [ReviewPositionType.Journey]: 'Gesell*in',
  [ReviewPositionType.Master]: 'Meister*in',
  [ReviewPositionType.Helper]: 'Bauhelfer*in',
  [ReviewPositionType.Other]: 'Andere',
};

export const genderLabels: Record<ReviewGenderType, string> = {
  [ReviewGenderType.PreferNotToSay]: 'keine Angabe',
  [ReviewGenderType.CisMale]: 'cis-männlich',
  [ReviewGenderType.CisFemale]: 'cis-weiblich',
  [ReviewGenderType.Enby]: 'nichtbinär',
  [ReviewGenderType.Trans]: 'trans',
  [ReviewGenderType.TransMale]: 'transmännlich',
  [ReviewGenderType.TransFemale]: 'transweiblich',
  [ReviewGenderType.Diverse]: 'divers',
  [ReviewGenderType.Other]: 'offen',
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

export const sharedWithCompanyLabels: Record<ReviewSharedWithCompanyType, string> = {
  [ReviewSharedWithCompanyType.Yes]: yesPartlyNo.Yes,
  [ReviewSharedWithCompanyType.Partly]: yesPartlyNo.Partly,
  [ReviewSharedWithCompanyType.No]: yesPartlyNo.No,
};
export const feltComfortableSharingLabels: Record<ReviewFeltComfortableSharingType, string> = {
  [ReviewFeltComfortableSharingType.Yes]: yesPartlyNo.Yes,
  [ReviewFeltComfortableSharingType.Partly]: yesPartlyNo.Partly,
  [ReviewFeltComfortableSharingType.No]: yesPartlyNo.No,
};
export const disabilitySharedWithCompanyLabels: Record<ReviewDisabilitySharedWithCompanyType, string> = {
  [ReviewDisabilitySharedWithCompanyType.Yes]: yesPartlyNo.Yes,
  [ReviewDisabilitySharedWithCompanyType.Partly]: yesPartlyNo.Partly,
  [ReviewDisabilitySharedWithCompanyType.No]: yesPartlyNo.No,
};
export const disabilityFeltComfortableSharingLabels: Record<ReviewDisabilityFeltComfortableSharingType, string> = {
  [ReviewDisabilityFeltComfortableSharingType.Yes]: yesPartlyNo.Yes,
  [ReviewDisabilityFeltComfortableSharingType.Partly]: yesPartlyNo.Partly,
  [ReviewDisabilityFeltComfortableSharingType.No]: yesPartlyNo.No,
};
export const ethnicitySharedWithCompanyLabels: Record<ReviewEthnicitySharedWithCompanyType, string> = {
  [ReviewEthnicitySharedWithCompanyType.Yes]: yesPartlyNo.Yes,
  [ReviewEthnicitySharedWithCompanyType.Partly]: yesPartlyNo.Partly,
  [ReviewEthnicitySharedWithCompanyType.No]: yesPartlyNo.No,
};
export const ethnicityFeltComfortableSharingLabels: Record<ReviewEthnicityFeltComfortableSharingType, string> = {
  [ReviewEthnicityFeltComfortableSharingType.Yes]: yesPartlyNo.Yes,
  [ReviewEthnicityFeltComfortableSharingType.Partly]: yesPartlyNo.Partly,
  [ReviewEthnicityFeltComfortableSharingType.No]: yesPartlyNo.No,
};
export const needsRespectedLabels: Record<ReviewNeedsRespectedType, string> = {
  [ReviewNeedsRespectedType.Yes]: yesPartlyNo.Yes,
  [ReviewNeedsRespectedType.Partly]: yesPartlyNo.Partly,
  [ReviewNeedsRespectedType.No]: yesPartlyNo.No,
};
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

export const disabilityTypeLabels: Record<ReviewDisabilityTypesType, string> = {
  [ReviewDisabilityTypesType.AutismSpectrum]: 'Autismus-Spektrum / Autismus',
  [ReviewDisabilityTypesType.Adhs]: 'ADHS (Aufmerksamkeitsdefizit-/Hyperaktivitätsstörung)',
  [ReviewDisabilityTypesType.OtherNeurodivergence]: 'andere Neurodivergenz / neurodivergente Wahrnehmungs- oder Verarbeitungsweisen',
  [ReviewDisabilityTypesType.MentalIllness]: 'psychische Erkrankung oder psychische Beeinträchtigung',
  [ReviewDisabilityTypesType.ChronicIllness]: 'chronische Erkrankung',
  [ReviewDisabilityTypesType.Autoimmune]: 'Autoimmunerkrankung',
  [ReviewDisabilityTypesType.Neurological]: 'neurologische Erkrankung',
  [ReviewDisabilityTypesType.Cardiovascular]: 'Herz-Kreislauf-Erkrankung',
  [ReviewDisabilityTypesType.Musculoskeletal]: 'Erkrankung oder Beeinträchtigung des Bewegungsapparats (Muskeln, Knochen, Gelenke)',
  [ReviewDisabilityTypesType.PhysicallyDisabled]: 'körperliche Behinderung',
  [ReviewDisabilityTypesType.WheelchairMobility]: 'Mobilitätseinschränkung / Rollstuhlnutzung',
  [ReviewDisabilityTypesType.BlindVisuallyImpaired]: 'Sehbehinderung / Blindheit',
  [ReviewDisabilityTypesType.DeafHearingImpaired]: 'Hörbehinderung / Gehörlosigkeit',
  [ReviewDisabilityTypesType.SpeechCommunication]: 'Sprach- oder Kommunikationsbeeinträchtigung',
  [ReviewDisabilityTypesType.LearningDisability]: 'Lernschwierigkeiten / Lernbehinderung',
  [ReviewDisabilityTypesType.CognitiveDisability]: 'kognitive Beeinträchtigung / geistige Behinderung',
  [ReviewDisabilityTypesType.Metabolic]: 'Stoffwechselerkrankung',
  [ReviewDisabilityTypesType.Digestive]: 'Erkrankung oder Beeinträchtigung des Verdauungssystems',
  [ReviewDisabilityTypesType.Spasticity]: 'Spastik / motorische Beeinträchtigung',
  [ReviewDisabilityTypesType.HigherBodyWeight]: 'höheres Körpergewicht',
  [ReviewDisabilityTypesType.LowerBodyWeight]: 'niedrigeres Körpergewicht',
  [ReviewDisabilityTypesType.Addiction]: 'Suchterkrankung / problematischer Substanzkonsum',
  [ReviewDisabilityTypesType.SexualViolenceTrauma]: 'Erfahrungen mit sexualisierter Gewalt / Trauma',
};

export const ethnicityTypeLabels: Record<ReviewEthnicityTypesType, string> = {
  [ReviewEthnicityTypesType.White]: 'weiß',
  [ReviewEthnicityTypesType.PersonOfColor]: 'Person of Color',
  [ReviewEthnicityTypesType.Black]: 'Schwarz',
  [ReviewEthnicityTypesType.Indigenous]: 'Indigen',
  [ReviewEthnicityTypesType.Jewish]: 'Jüdisch',
  [ReviewEthnicityTypesType.Muslim]: 'Muslim*in',
  [ReviewEthnicityTypesType.Migrant]: 'Migrant*in',
  [ReviewEthnicityTypesType.RomaSinti]: 'Rom*nja/Sinti*zze',
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
