/*
  Warnings:

  - A unique constraint covering the columns `[empNo,dateTime,deviceId]` on the table `AttendanceLogs` will be added. If there are existing duplicate values, this will fail.
  - Changed the type of `deviceId` on the `AttendanceLogs` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "AttendanceLogs" DROP COLUMN "deviceId",
ADD COLUMN     "deviceId" INTEGER NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "AttendanceLogs_empNo_dateTime_deviceId_key" ON "AttendanceLogs"("empNo", "dateTime", "deviceId");
