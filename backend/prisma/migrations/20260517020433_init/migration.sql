/*
  Warnings:

  - The values [HQ_ADMIN,OFFICE,INSTITUTE] on the enum `UserRole` will be removed. If these variants are still used in the database, this will fail.
  - The primary key for the `District` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `code` on the `District` table. All the data in the column will be lost.
  - The `regionId` column on the `Office` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The primary key for the `Region` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `code` on the `Region` table. All the data in the column will be lost.
  - The primary key for the `Subdivision` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `code` on the `Subdivision` table. All the data in the column will be lost.
  - You are about to drop the column `username` on the `User` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[email]` on the table `User` will be added. If there are existing duplicate values, this will fail.
  - Changed the type of `id` on the `District` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `regionId` on the `District` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `regionId` on the `Institute` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `districtId` on the `Institute` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `subdivisionId` on the `Institute` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `id` on the `Region` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `id` on the `Subdivision` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `districtId` on the `Subdivision` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Added the required column `email` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "UserRole_new" AS ENUM ('SUPER_ADMIN', 'OFFICE_ADMIN', 'INSTITUTE_ADMIN', 'STAFF');
ALTER TABLE "User" ALTER COLUMN "role" TYPE "UserRole_new" USING ("role"::text::"UserRole_new");
ALTER TYPE "UserRole" RENAME TO "UserRole_old";
ALTER TYPE "UserRole_new" RENAME TO "UserRole";
DROP TYPE "public"."UserRole_old";
COMMIT;

-- DropForeignKey
ALTER TABLE "District" DROP CONSTRAINT "District_regionId_fkey";

-- DropForeignKey
ALTER TABLE "Institute" DROP CONSTRAINT "Institute_districtId_fkey";

-- DropForeignKey
ALTER TABLE "Institute" DROP CONSTRAINT "Institute_regionId_fkey";

-- DropForeignKey
ALTER TABLE "Institute" DROP CONSTRAINT "Institute_subdivisionId_fkey";

-- DropForeignKey
ALTER TABLE "Office" DROP CONSTRAINT "Office_regionId_fkey";

-- DropForeignKey
ALTER TABLE "Subdivision" DROP CONSTRAINT "Subdivision_districtId_fkey";

-- DropIndex
DROP INDEX "District_code_key";

-- DropIndex
DROP INDEX "Region_code_key";

-- DropIndex
DROP INDEX "Subdivision_code_key";

-- DropIndex
DROP INDEX "User_username_key";

-- AlterTable
ALTER TABLE "District" DROP CONSTRAINT "District_pkey",
DROP COLUMN "code",
DROP COLUMN "id",
ADD COLUMN     "id" INTEGER NOT NULL,
DROP COLUMN "regionId",
ADD COLUMN     "regionId" INTEGER NOT NULL,
ADD CONSTRAINT "District_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "Institute" DROP COLUMN "regionId",
ADD COLUMN     "regionId" INTEGER NOT NULL,
DROP COLUMN "districtId",
ADD COLUMN     "districtId" INTEGER NOT NULL,
DROP COLUMN "subdivisionId",
ADD COLUMN     "subdivisionId" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "Office" DROP COLUMN "regionId",
ADD COLUMN     "regionId" INTEGER;

-- AlterTable
ALTER TABLE "Region" DROP CONSTRAINT "Region_pkey",
DROP COLUMN "code",
DROP COLUMN "id",
ADD COLUMN     "id" INTEGER NOT NULL,
ADD CONSTRAINT "Region_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "Subdivision" DROP CONSTRAINT "Subdivision_pkey",
DROP COLUMN "code",
DROP COLUMN "id",
ADD COLUMN     "id" INTEGER NOT NULL,
DROP COLUMN "districtId",
ADD COLUMN     "districtId" INTEGER NOT NULL,
ADD CONSTRAINT "Subdivision_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "User" DROP COLUMN "username",
ADD COLUMN     "email" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- AddForeignKey
ALTER TABLE "District" ADD CONSTRAINT "District_regionId_fkey" FOREIGN KEY ("regionId") REFERENCES "Region"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Subdivision" ADD CONSTRAINT "Subdivision_districtId_fkey" FOREIGN KEY ("districtId") REFERENCES "District"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Office" ADD CONSTRAINT "Office_regionId_fkey" FOREIGN KEY ("regionId") REFERENCES "Region"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Institute" ADD CONSTRAINT "Institute_regionId_fkey" FOREIGN KEY ("regionId") REFERENCES "Region"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Institute" ADD CONSTRAINT "Institute_districtId_fkey" FOREIGN KEY ("districtId") REFERENCES "District"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Institute" ADD CONSTRAINT "Institute_subdivisionId_fkey" FOREIGN KEY ("subdivisionId") REFERENCES "Subdivision"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
