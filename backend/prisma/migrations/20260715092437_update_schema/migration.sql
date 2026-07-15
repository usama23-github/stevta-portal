/*
  Warnings:

  - The primary key for the `Designation` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `category` on the `Designation` table. All the data in the column will be lost.
  - You are about to drop the column `name` on the `Designation` table. All the data in the column will be lost.
  - You are about to drop the column `scale` on the `Designation` table. All the data in the column will be lost.
  - You are about to drop the column `sectionId` on the `Designation` table. All the data in the column will be lost.
  - The `id` column on the `Designation` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - You are about to drop the column `designation` on the `Staff` table. All the data in the column will be lost.
  - You are about to drop the column `instituteId` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `officeId` on the `User` table. All the data in the column will be lost.
  - You are about to drop the `Institute` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Office` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `OfficeSection` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[designation,postingPlaceId,scaleId]` on the table `Designation` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[section,postingPlaceId]` on the table `Section` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `designation` to the `Designation` table without a default value. This is not possible if the table is not empty.
  - Added the required column `postingPlaceId` to the `Designation` table without a default value. This is not possible if the table is not empty.
  - Added the required column `scaleId` to the `Designation` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Designation" DROP CONSTRAINT "Designation_sectionId_fkey";

-- DropForeignKey
ALTER TABLE "Institute" DROP CONSTRAINT "Institute_districtId_fkey";

-- DropForeignKey
ALTER TABLE "Institute" DROP CONSTRAINT "Institute_rdOfficeId_fkey";

-- DropForeignKey
ALTER TABLE "Institute" DROP CONSTRAINT "Institute_regionId_fkey";

-- DropForeignKey
ALTER TABLE "Institute" DROP CONSTRAINT "Institute_subdivisionId_fkey";

-- DropForeignKey
ALTER TABLE "Office" DROP CONSTRAINT "Office_parentOfficeId_fkey";

-- DropForeignKey
ALTER TABLE "Office" DROP CONSTRAINT "Office_regionId_fkey";

-- DropForeignKey
ALTER TABLE "OfficeSection" DROP CONSTRAINT "OfficeSection_officeId_fkey";

-- DropForeignKey
ALTER TABLE "User" DROP CONSTRAINT "User_instituteId_fkey";

-- DropForeignKey
ALTER TABLE "User" DROP CONSTRAINT "User_officeId_fkey";

-- AlterTable
ALTER TABLE "Designation" DROP CONSTRAINT "Designation_pkey",
DROP COLUMN "category",
DROP COLUMN "name",
DROP COLUMN "scale",
DROP COLUMN "sectionId",
ADD COLUMN     "designation" TEXT NOT NULL,
ADD COLUMN     "postingPlaceId" INTEGER NOT NULL,
ADD COLUMN     "scaleId" INTEGER NOT NULL,
DROP COLUMN "id",
ADD COLUMN     "id" SERIAL NOT NULL,
ADD CONSTRAINT "Designation_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "Staff" DROP COLUMN "designation",
ADD COLUMN     "designationId" INTEGER;

-- AlterTable
ALTER TABLE "User" DROP COLUMN "instituteId",
DROP COLUMN "officeId";

-- DropTable
DROP TABLE "Institute";

-- DropTable
DROP TABLE "Office";

-- DropTable
DROP TABLE "OfficeSection";

-- DropEnum
DROP TYPE "DesignationCategory";

-- DropEnum
DROP TYPE "OfficeType";

-- CreateTable
CREATE TABLE "Scale" (
    "id" SERIAL NOT NULL,
    "scale" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Scale_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Scale_scale_key" ON "Scale"("scale");

-- CreateIndex
CREATE INDEX "Designation_scaleId_idx" ON "Designation"("scaleId");

-- CreateIndex
CREATE INDEX "Designation_postingPlaceId_idx" ON "Designation"("postingPlaceId");

-- CreateIndex
CREATE UNIQUE INDEX "Designation_designation_postingPlaceId_scaleId_key" ON "Designation"("designation", "postingPlaceId", "scaleId");

-- CreateIndex
CREATE INDEX "District_regionId_idx" ON "District"("regionId");

-- CreateIndex
CREATE INDEX "Section_postingPlaceId_idx" ON "Section"("postingPlaceId");

-- CreateIndex
CREATE UNIQUE INDEX "Section_section_postingPlaceId_key" ON "Section"("section", "postingPlaceId");

-- CreateIndex
CREATE INDEX "Staff_designationId_idx" ON "Staff"("designationId");

-- CreateIndex
CREATE INDEX "Subdivision_districtId_idx" ON "Subdivision"("districtId");

-- AddForeignKey
ALTER TABLE "Designation" ADD CONSTRAINT "Designation_scaleId_fkey" FOREIGN KEY ("scaleId") REFERENCES "Scale"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Designation" ADD CONSTRAINT "Designation_postingPlaceId_fkey" FOREIGN KEY ("postingPlaceId") REFERENCES "PostingPlace"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Staff" ADD CONSTRAINT "Staff_designationId_fkey" FOREIGN KEY ("designationId") REFERENCES "Designation"("id") ON DELETE SET NULL ON UPDATE CASCADE;
