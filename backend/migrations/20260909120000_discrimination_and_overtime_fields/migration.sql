-- CreateEnum
CREATE TYPE "ReviewWorkplaceSafetyType" AS ENUM ('strong', 'medium', 'none');

-- CreateEnum
CREATE TYPE "ReviewGenderDiscriminationExperiencedType" AS ENUM ('no', 'constantly', 'occasionally', 'rarely');

-- CreateEnum
CREATE TYPE "ReviewGenderDiscriminationObservedType" AS ENUM ('no', 'constantly', 'occasionally', 'rarely');

-- CreateEnum
CREATE TYPE "ReviewEthnicityDiscriminationExperiencedType" AS ENUM ('no', 'constantly', 'occasionally', 'rarely');

-- CreateEnum
CREATE TYPE "ReviewEthnicityDiscriminationObservedType" AS ENUM ('no', 'constantly', 'occasionally', 'rarely');

-- CreateEnum
CREATE TYPE "ReviewDisabilityDiscriminationExperiencedType" AS ENUM ('no', 'constantly', 'occasionally', 'rarely');

-- CreateEnum
CREATE TYPE "ReviewDisabilityDiscriminationObservedType" AS ENUM ('no', 'constantly', 'occasionally', 'rarely');

-- AlterTable
ALTER TABLE "Review"
DROP COLUMN "gender",
DROP COLUMN "genderIdentityRespected",
DROP COLUMN "sharedWithCompany",
DROP COLUMN "feltComfortableSharing",
DROP COLUMN "disabilityTypes",
DROP COLUMN "disabilityOther",
DROP COLUMN "disabilitySharedWithCompany",
DROP COLUMN "disabilityFeltComfortableSharing",
DROP COLUMN "ethnicityTypes",
DROP COLUMN "ethnicitySharedWithCompany",
DROP COLUMN "ethnicityFeltComfortableSharing",
DROP COLUMN "needsRespected",
ADD COLUMN     "overtimeHandling" JSONB NOT NULL DEFAULT '[]',
ADD COLUMN     "overtimeHandlingOther" TEXT NOT NULL DEFAULT '',
ADD COLUMN     "workplaceSafety" "ReviewWorkplaceSafetyType",
ADD COLUMN     "genderDiscriminationExperienced" "ReviewGenderDiscriminationExperiencedType" NOT NULL DEFAULT 'no',
ADD COLUMN     "genderDiscriminationObserved" "ReviewGenderDiscriminationObservedType" NOT NULL DEFAULT 'no',
ADD COLUMN     "ethnicityDiscriminationExperienced" "ReviewEthnicityDiscriminationExperiencedType" NOT NULL DEFAULT 'no',
ADD COLUMN     "ethnicityDiscriminationObserved" "ReviewEthnicityDiscriminationObservedType" NOT NULL DEFAULT 'no',
ADD COLUMN     "disabilityDiscriminationExperienced" "ReviewDisabilityDiscriminationExperiencedType" NOT NULL DEFAULT 'no',
ADD COLUMN     "disabilityDiscriminationObserved" "ReviewDisabilityDiscriminationObservedType" NOT NULL DEFAULT 'no',
ADD COLUMN     "discriminationExperienceText" TEXT NOT NULL DEFAULT '';

-- Backfill: only test/seed data exists in this environment so far, no real
-- submissions have been lost by picking a placeholder duration here.
UPDATE "Review" SET "employmentDuration" = 'one_to_three_months' WHERE "employmentDuration" IS NULL;

-- AlterTable
ALTER TABLE "Review" ALTER COLUMN "employmentDuration" SET NOT NULL;

-- DropEnum
DROP TYPE "ReviewGenderType";

-- DropEnum
DROP TYPE "ReviewSharedWithCompanyType";

-- DropEnum
DROP TYPE "ReviewFeltComfortableSharingType";

-- DropEnum
DROP TYPE "ReviewDisabilitySharedWithCompanyType";

-- DropEnum
DROP TYPE "ReviewDisabilityFeltComfortableSharingType";

-- DropEnum
DROP TYPE "ReviewEthnicitySharedWithCompanyType";

-- DropEnum
DROP TYPE "ReviewEthnicityFeltComfortableSharingType";

-- DropEnum
DROP TYPE "ReviewNeedsRespectedType";
