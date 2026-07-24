import {
  ReviewPositionType,
  ReviewGenderType,
  ReviewListenedToType,
  ReviewCanAskBossType,
  ReviewCanAskColleagueType,
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
  ReviewDisabilityTypeType,
  ReviewEthnicityTypeType,
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
export const canAskColleaguesLabels: Record<ReviewCanAskColleagueType, string> = {
  [ReviewCanAskColleagueType.Always]: 'immer',
  [ReviewCanAskColleagueType.Mostly]: 'meistens',
  [ReviewCanAskColleagueType.Sometimes]: 'ab und zu',
  [ReviewCanAskColleagueType.Rarely]: 'selten',
  [ReviewCanAskColleagueType.Never]: 'niemals',
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

export const proximityLabels: Record<string, string> = {
  too_close: 'zu nah',
  casual: 'locker',
  professional: 'professionell',
  too_distant: 'zu distant',
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

export const boundariesRespectedLabels: Record<ReviewBoundariesRespectedType, string> = {
  [ReviewBoundariesRespectedType.PhysicalStrength]: 'körperlich-kräftetechnisch',
  [ReviewBoundariesRespectedType.Emotional]: 'emotional',
  [ReviewBoundariesRespectedType.Responsibility]: 'verantwortungstechnisch',
  [ReviewBoundariesRespectedType.PhysicalDistance]: 'körperlich-distanztechnisch',
};

export const disabilityTypeLabels: Record<ReviewDisabilityTypeType, string> = {
  [ReviewDisabilityTypeType.AutismSpectrum]: 'Autismus-Spektrum',
  [ReviewDisabilityTypeType.Autoimmune]: 'Autoimmunerkrankung',
  [ReviewDisabilityTypeType.BlindVisuallyImpaired]: 'blind/sehbehindert',
  [ReviewDisabilityTypeType.DeafHearingImpaired]: 'gehörlos/hörbehindert',
  [ReviewDisabilityTypeType.PhysicallyDisabled]: 'körperlich behindert',
  [ReviewDisabilityTypeType.MentalIllness]: 'psychische Erkrankung',
  [ReviewDisabilityTypeType.ChronicIllness]: 'chronische Erkrankung',
  [ReviewDisabilityTypeType.Cardiovascular]: 'Herz-Kreislauf-Erkrankung',
  [ReviewDisabilityTypeType.Musculoskeletal]: 'Skelett-/Muskelerkrankung',
  [ReviewDisabilityTypeType.Metabolic]: 'Stoffwechselerkrankung',
  [ReviewDisabilityTypeType.Digestive]: 'Erkrankung des Verdauungssystems',
  [ReviewDisabilityTypeType.Spasticity]: 'Spastik',
  [ReviewDisabilityTypeType.LearningDisability]: 'Lernschwierigkeiten / sog. geistige Behinderung',
  [ReviewDisabilityTypeType.Neurodivergent]: 'neurodivergent',
  [ReviewDisabilityTypeType.WheelchairMobility]: 'Rollstuhlnutzend / Mobilitätseinschränkung',
  [ReviewDisabilityTypeType.DrugUse]: 'Drogenkonsument*in',
  [ReviewDisabilityTypeType.SexualViolence]: 'Erfahrung sexualisierter Gewalt',
  [ReviewDisabilityTypeType.Overweight]: 'mehrgewichtig/hochgewichtig',
  [ReviewDisabilityTypeType.Underweight]: 'wenigergewichtig',
};

export const ethnicityTypeLabels: Record<ReviewEthnicityTypeType, string> = {
  [ReviewEthnicityTypeType.White]: 'weiß',
  [ReviewEthnicityTypeType.PersonOfColor]: 'Person of Color',
  [ReviewEthnicityTypeType.Black]: 'Schwarz',
  [ReviewEthnicityTypeType.Indigenous]: 'Indigen',
  [ReviewEthnicityTypeType.Jewish]: 'Jüdisch',
  [ReviewEthnicityTypeType.Muslim]: 'Muslim*in',
  [ReviewEthnicityTypeType.Migrant]: 'Migrant*in',
  [ReviewEthnicityTypeType.RomaSinti]: 'Rom*nja/Sinti*zze',
};

/** "seit 2024" while ongoing, "2024–2026" once ended, or just "2024" if neither is known. */
export function formatEmploymentPeriod(
  yearOfHiring?: string | null,
  yearOfLeaving?: string | null,
  ongoing?: boolean | null
): string {
  if (!yearOfHiring) return '';
  if (ongoing) return `seit ${yearOfHiring}`;
  if (yearOfLeaving) return `${yearOfHiring}–${yearOfLeaving}`;
  return `${yearOfHiring}`;
}
