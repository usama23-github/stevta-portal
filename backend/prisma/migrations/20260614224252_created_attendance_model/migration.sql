/*
  Warnings:

  - You are about to drop the column `additionalInstituteId` on the `Staff` table. All the data in the column will be lost.
  - You are about to drop the column `additionalOfficeId` on the `Staff` table. All the data in the column will be lost.
  - You are about to drop the column `cnic` on the `Staff` table. All the data in the column will be lost.
  - You are about to drop the column `designationId` on the `Staff` table. All the data in the column will be lost.
  - You are about to drop the column `email` on the `Staff` table. All the data in the column will be lost.
  - You are about to drop the column `phone` on the `Staff` table. All the data in the column will be lost.
  - You are about to drop the column `primaryInstituteId` on the `Staff` table. All the data in the column will be lost.
  - You are about to drop the column `primaryOfficeId` on the `Staff` table. All the data in the column will be lost.
  - You are about to drop the column `staffCategory` on the `Staff` table. All the data in the column will be lost.
  - You are about to drop the column `staffType` on the `Staff` table. All the data in the column will be lost.
  - You are about to drop the column `staffId` on the `User` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[empNo]` on the table `Staff` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `department` to the `Staff` table without a default value. This is not possible if the table is not empty.
  - Added the required column `designation` to the `Staff` table without a default value. This is not possible if the table is not empty.
  - Added the required column `empNo` to the `Staff` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Staff" DROP CONSTRAINT "Staff_additionalInstituteId_fkey";

-- DropForeignKey
ALTER TABLE "Staff" DROP CONSTRAINT "Staff_additionalOfficeId_fkey";

-- DropForeignKey
ALTER TABLE "Staff" DROP CONSTRAINT "Staff_designationId_fkey";

-- DropForeignKey
ALTER TABLE "Staff" DROP CONSTRAINT "Staff_primaryInstituteId_fkey";

-- DropForeignKey
ALTER TABLE "Staff" DROP CONSTRAINT "Staff_primaryOfficeId_fkey";

-- DropForeignKey
ALTER TABLE "User" DROP CONSTRAINT "User_staffId_fkey";

-- DropIndex
DROP INDEX "Staff_cnic_key";

-- DropIndex
DROP INDEX "User_staffId_key";

-- AlterTable
ALTER TABLE "Staff" DROP COLUMN "additionalInstituteId",
DROP COLUMN "additionalOfficeId",
DROP COLUMN "cnic",
DROP COLUMN "designationId",
DROP COLUMN "email",
DROP COLUMN "phone",
DROP COLUMN "primaryInstituteId",
DROP COLUMN "primaryOfficeId",
DROP COLUMN "staffCategory",
DROP COLUMN "staffType",
ADD COLUMN     "department" TEXT NOT NULL,
ADD COLUMN     "designation" TEXT NOT NULL,
ADD COLUMN     "empNo" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "User" DROP COLUMN "staffId";

-- CreateTable
CREATE TABLE "Attendance" (
    "id" TEXT NOT NULL,
    "empNo" TEXT NOT NULL,
    "inOutstatus" INTEGER NOT NULL,
    "dateTime" TIMESTAMP(3) NOT NULL,
    "deviceId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Attendance_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Staff_empNo_key" ON "Staff"("empNo");
