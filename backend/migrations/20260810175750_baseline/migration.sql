-- CreateEnum
CREATE TYPE "CompanySizeType" AS ENUM ('s1to5', 's5to10', 's10to30', 's30to50', 's50to250', 'size250plus');

-- CreateEnum
CREATE TYPE "ReviewPositionType" AS ENUM ('intern', 'apprentice', 'journey', 'master', 'helper', 'other');

-- CreateEnum
CREATE TYPE "ReviewListenedToType" AS ENUM ('always', 'mostly', 'sometimes', 'rarely', 'never');

-- CreateEnum
CREATE TYPE "ReviewCanAskColleaguesType" AS ENUM ('always', 'mostly', 'sometimes', 'rarely', 'never');

-- CreateEnum
CREATE TYPE "ReviewCanAskBossType" AS ENUM ('always', 'mostly', 'sometimes', 'rarely', 'never');

-- CreateEnum
CREATE TYPE "ReviewToneType" AS ENUM ('very_good', 'good', 'ok', 'bad', 'awful');

-- CreateEnum
CREATE TYPE "ReviewExplainedType" AS ENUM ('too_much', 'just_right', 'enough', 'too_little');

-- CreateEnum
CREATE TYPE "ReviewAppreciatedType" AS ENUM ('yes', 'partly', 'no');

-- CreateEnum
CREATE TYPE "ReviewGenderType" AS ENUM ('prefer_not_to_say', 'cis_male', 'cis_female', 'enby', 'trans', 'trans_male', 'trans_female', 'diverse', 'other');

-- CreateEnum
CREATE TYPE "ReviewSharedWithCompanyType" AS ENUM ('yes', 'partly', 'no');

-- CreateEnum
CREATE TYPE "ReviewFeltComfortableSharingType" AS ENUM ('yes', 'partly', 'no');

-- CreateEnum
CREATE TYPE "ReviewDisabilitySharedWithCompanyType" AS ENUM ('yes', 'partly', 'no');

-- CreateEnum
CREATE TYPE "ReviewDisabilityFeltComfortableSharingType" AS ENUM ('yes', 'partly', 'no');

-- CreateEnum
CREATE TYPE "ReviewEthnicitySharedWithCompanyType" AS ENUM ('yes', 'partly', 'no');

-- CreateEnum
CREATE TYPE "ReviewEthnicityFeltComfortableSharingType" AS ENUM ('yes', 'partly', 'no');

-- CreateEnum
CREATE TYPE "ReviewNeedsRespectedType" AS ENUM ('yes', 'partly', 'no');

-- CreateEnum
CREATE TYPE "ReviewStatusType" AS ENUM ('awaitingReview', 'changesRequested', 'published');

-- CreateTable
CREATE TABLE "User" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL DEFAULT '',
    "email" TEXT NOT NULL DEFAULT '',
    "password" TEXT NOT NULL,
    "roles" JSONB NOT NULL DEFAULT '[]',
    "createdAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Company" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL DEFAULT '',
    "trade" TEXT NOT NULL DEFAULT '',
    "address" TEXT NOT NULL DEFAULT '',
    "contact" TEXT NOT NULL DEFAULT '',
    "size" "CompanySizeType" NOT NULL,
    "verified" BOOLEAN NOT NULL DEFAULT false,
    "latitude" DOUBLE PRECISION,
    "longitude" DOUBLE PRECISION,

    CONSTRAINT "Company_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Review" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL DEFAULT '',
    "email" TEXT NOT NULL DEFAULT '',
    "company" INTEGER,
    "collective" BOOLEAN NOT NULL DEFAULT false,
    "hoursPerWeek" INTEGER,
    "overtimePerMonth" INTEGER,
    "trainingShortenable" BOOLEAN NOT NULL DEFAULT false,
    "partTime" BOOLEAN NOT NULL DEFAULT false,
    "specialtiesOther" TEXT NOT NULL DEFAULT '',
    "ageAtEmployment" INTEGER,
    "yearOfHiring" TEXT NOT NULL DEFAULT '',
    "yearOfLeaving" TEXT NOT NULL DEFAULT '',
    "ongoing" BOOLEAN NOT NULL DEFAULT false,
    "genderIdentityRespected" BOOLEAN NOT NULL DEFAULT false,
    "position" "ReviewPositionType" NOT NULL,
    "listenedTo" "ReviewListenedToType",
    "canAskColleagues" "ReviewCanAskColleaguesType",
    "canAskBoss" "ReviewCanAskBossType",
    "tone" "ReviewToneType",
    "explained" "ReviewExplainedType",
    "proximity" TEXT,
    "boundariesRespected" JSONB NOT NULL DEFAULT '[]',
    "appreciated" "ReviewAppreciatedType",
    "experienceText" TEXT NOT NULL DEFAULT '',
    "languages" TEXT NOT NULL DEFAULT '',
    "gender" "ReviewGenderType",
    "sharedWithCompany" "ReviewSharedWithCompanyType",
    "feltComfortableSharing" "ReviewFeltComfortableSharingType",
    "disabilityTypes" JSONB NOT NULL DEFAULT '[]',
    "disabilitySharedWithCompany" "ReviewDisabilitySharedWithCompanyType",
    "disabilityFeltComfortableSharing" "ReviewDisabilityFeltComfortableSharingType",
    "ethnicityTypes" JSONB NOT NULL DEFAULT '[]',
    "ethnicitySharedWithCompany" "ReviewEthnicitySharedWithCompanyType",
    "ethnicityFeltComfortableSharing" "ReviewEthnicityFeltComfortableSharingType",
    "needsRespected" "ReviewNeedsRespectedType",
    "feedback" TEXT NOT NULL DEFAULT '',
    "moreWishes" TEXT NOT NULL DEFAULT '',
    "status" "ReviewStatusType" DEFAULT 'awaitingReview',
    "emailVerified" BOOLEAN NOT NULL DEFAULT false,
    "accessKey" TEXT NOT NULL DEFAULT '',

    CONSTRAINT "Review_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Review_accessKey_key" ON "Review"("accessKey");

-- CreateIndex
CREATE INDEX "Review_company_idx" ON "Review"("company");

-- AddForeignKey
ALTER TABLE "Review" ADD CONSTRAINT "Review_company_fkey" FOREIGN KEY ("company") REFERENCES "Company"("id") ON DELETE SET NULL ON UPDATE CASCADE;
