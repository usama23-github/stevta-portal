/*
  Warnings:

  - You are about to drop the column `dateTime` on the `Attendance` table. All the data in the column will be lost.
  - You are about to drop the column `inOutstatus` on the `Attendance` table. All the data in the column will be lost.
  - Added the required column `attendanceDate` to the `Attendance` table without a default value. This is not possible if the table is not empty.
  - Added the required column `attendanceStatusId` to the `Attendance` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Attendance" DROP COLUMN "dateTime",
DROP COLUMN "inOutstatus",
ADD COLUMN     "attendanceDate" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "attendanceStatusId" INTEGER NOT NULL,
ADD COLUMN     "checkInStatusId" INTEGER,
ADD COLUMN     "checkInTime" TIMESTAMP(3),
ADD COLUMN     "checkOutStatusId" INTEGER,
ADD COLUMN     "checkOutTime" TIMESTAMP(3),
ADD COLUMN     "leaveTypeId" INTEGER,
ALTER COLUMN "deviceId" DROP NOT NULL;

-- CreateTable
CREATE TABLE "AttendanceLogs" (
    "id" TEXT NOT NULL,
    "empNo" TEXT NOT NULL,
    "inOutstatus" INTEGER NOT NULL,
    "dateTime" TIMESTAMP(3) NOT NULL,
    "deviceId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "AttendanceLogs_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Attendance_attendanceDate_idx" ON "Attendance"("attendanceDate");
