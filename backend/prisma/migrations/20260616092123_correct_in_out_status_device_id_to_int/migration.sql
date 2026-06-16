/*
  Warnings:

  - The `deviceId` column on the `Attendance` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - You are about to drop the column `inOutstatus` on the `AttendanceLogs` table. All the data in the column will be lost.
  - Added the required column `inOutStatus` to the `AttendanceLogs` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Attendance" DROP COLUMN "deviceId",
ADD COLUMN     "deviceId" INTEGER;

-- AlterTable
ALTER TABLE "AttendanceLogs" DROP COLUMN "inOutstatus",
ADD COLUMN     "inOutStatus" INTEGER NOT NULL;
