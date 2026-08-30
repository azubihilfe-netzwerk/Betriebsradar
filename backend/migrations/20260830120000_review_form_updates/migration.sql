-- CreateEnum
CREATE TYPE "ReviewEmploymentDurationType" AS ENUM ('one_week_or_less', 'one_to_four_weeks', 'one_to_three_months', 'three_to_six_months', 'six_to_twelve_months', 'one_to_three_years', 'more_than_three_years');

-- CreateEnum
CREATE TYPE "ReviewCanAskTrainerType" AS ENUM ('always', 'mostly', 'sometimes', 'rarely', 'never');

-- CreateEnum
CREATE TYPE "ReviewRecommendType" AS ENUM ('yes', 'partly', 'no');

-- AlterTable
ALTER TABLE "Review"
DROP COLUMN "yearOfLeaving",
DROP COLUMN "proximity",
DROP COLUMN "ongoing",
ADD COLUMN     "employmentDuration" "ReviewEmploymentDurationType",
ADD COLUMN     "canAskTrainer" "ReviewCanAskTrainerType",
ADD COLUMN     "disabilityOther" TEXT NOT NULL DEFAULT '',
ADD COLUMN     "recommend" "ReviewRecommendType";
