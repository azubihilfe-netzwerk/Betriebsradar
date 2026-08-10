-- CreateTable
CREATE TABLE "User" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL DEFAULT '',
    "email" TEXT NOT NULL DEFAULT '',
    "password" TEXT NOT NULL,
    "roles" JSONB NOT NULL,
    "createdAt" DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "Company" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL DEFAULT '',
    "trade" TEXT NOT NULL DEFAULT '',
    "address" TEXT NOT NULL DEFAULT '',
    "contact" TEXT NOT NULL DEFAULT '',
    "size" TEXT NOT NULL,
    "verified" BOOLEAN NOT NULL DEFAULT false,
    "latitude" REAL,
    "longitude" REAL
);

-- CreateTable
CREATE TABLE "Review" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
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
    "position" TEXT NOT NULL,
    "listenedTo" TEXT,
    "canAskColleagues" TEXT,
    "canAskBoss" TEXT,
    "tone" TEXT,
    "explained" TEXT,
    "proximity" TEXT,
    "boundariesRespected" JSONB NOT NULL,
    "appreciated" TEXT,
    "experienceText" TEXT NOT NULL DEFAULT '',
    "languages" TEXT NOT NULL DEFAULT '',
    "gender" TEXT,
    "sharedWithCompany" TEXT,
    "feltComfortableSharing" TEXT,
    "disabilityTypes" JSONB NOT NULL,
    "disabilitySharedWithCompany" TEXT,
    "disabilityFeltComfortableSharing" TEXT,
    "ethnicityTypes" JSONB NOT NULL,
    "ethnicitySharedWithCompany" TEXT,
    "ethnicityFeltComfortableSharing" TEXT,
    "needsRespected" TEXT,
    "feedback" TEXT NOT NULL DEFAULT '',
    "moreWishes" TEXT NOT NULL DEFAULT '',
    "status" TEXT DEFAULT 'awaitingReview',
    "emailVerified" BOOLEAN NOT NULL DEFAULT false,
    "accessKey" TEXT NOT NULL DEFAULT '',
    CONSTRAINT "Review_company_fkey" FOREIGN KEY ("company") REFERENCES "Company" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Review_accessKey_key" ON "Review"("accessKey");

-- CreateIndex
CREATE INDEX "Review_company_idx" ON "Review"("company");
