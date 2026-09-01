/*
  Warnings:

  - You are about to alter the column `name` on the `Shift` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(100)`.
  - Added the required column `absentTime` to the `ShiftTiming` table without a default value. This is not possible if the table is not empty.
  - Added the required column `postingPlaceId` to the `ShiftTiming` table without a default value. This is not possible if the table is not empty.
  - Added the required column `postingPlaceId` to the `StaffShiftHistory` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "ShiftTiming_effectiveFrom_idx";

-- DropIndex
DROP INDEX "ShiftTiming_effectiveTo_idx";

-- DropIndex
DROP INDEX "ShiftTiming_shiftId_idx";

-- DropIndex
DROP INDEX "StaffShiftHistory_effectiveFrom_idx";

-- DropIndex
DROP INDEX "StaffShiftHistory_effectiveTo_idx";

-- DropIndex
DROP INDEX "StaffShiftHistory_staffId_idx";

-- AlterTable
ALTER TABLE "Shift" ALTER COLUMN "name" SET DATA TYPE VARCHAR(100);

-- AlterTable
ALTER TABLE "ShiftTiming" ADD COLUMN     "absentTime" TIME NOT NULL,
ADD COLUMN     "districtId" INTEGER,
ADD COLUMN     "postingPlaceId" INTEGER NOT NULL,
ADD COLUMN     "regionId" INTEGER,
ALTER COLUMN "shiftStartTime" SET DATA TYPE TIME,
ALTER COLUMN "checkInOnTime" SET DATA TYPE TIME,
ALTER COLUMN "checkInLate" SET DATA TYPE TIME,
ALTER COLUMN "checkOutEarly" SET DATA TYPE TIME,
ALTER COLUMN "checkOutOnTime" SET DATA TYPE TIME;

-- AlterTable
ALTER TABLE "StaffShiftHistory" ADD COLUMN     "designationId" INTEGER,
ADD COLUMN     "districtId" INTEGER,
ADD COLUMN     "postingPlaceId" INTEGER NOT NULL,
ADD COLUMN     "regionId" INTEGER,
ADD COLUMN     "sectionId" INTEGER;

-- CreateIndex
CREATE INDEX "Shift_name_idx" ON "Shift"("name");

-- CreateIndex
CREATE INDEX "ShiftTiming_shiftId_effectiveFrom_idx" ON "ShiftTiming"("shiftId", "effectiveFrom");

-- CreateIndex
CREATE INDEX "ShiftTiming_postingPlaceId_idx" ON "ShiftTiming"("postingPlaceId");

-- CreateIndex
CREATE INDEX "ShiftTiming_effectiveFrom_effectiveTo_idx" ON "ShiftTiming"("effectiveFrom", "effectiveTo");

-- CreateIndex
CREATE INDEX "StaffShiftHistory_staffId_effectiveFrom_idx" ON "StaffShiftHistory"("staffId", "effectiveFrom");

-- CreateIndex
CREATE INDEX "StaffShiftHistory_postingPlaceId_idx" ON "StaffShiftHistory"("postingPlaceId");

-- CreateIndex
CREATE INDEX "StaffShiftHistory_effectiveFrom_effectiveTo_idx" ON "StaffShiftHistory"("effectiveFrom", "effectiveTo");

-- AddForeignKey
ALTER TABLE "StaffShiftHistory" ADD CONSTRAINT "StaffShiftHistory_designationId_fkey" FOREIGN KEY ("designationId") REFERENCES "Designation"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StaffShiftHistory" ADD CONSTRAINT "StaffShiftHistory_sectionId_fkey" FOREIGN KEY ("sectionId") REFERENCES "Section"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StaffShiftHistory" ADD CONSTRAINT "StaffShiftHistory_postingPlaceId_fkey" FOREIGN KEY ("postingPlaceId") REFERENCES "PostingPlace"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StaffShiftHistory" ADD CONSTRAINT "StaffShiftHistory_regionId_fkey" FOREIGN KEY ("regionId") REFERENCES "Region"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StaffShiftHistory" ADD CONSTRAINT "StaffShiftHistory_districtId_fkey" FOREIGN KEY ("districtId") REFERENCES "District"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ShiftTiming" ADD CONSTRAINT "ShiftTiming_postingPlaceId_fkey" FOREIGN KEY ("postingPlaceId") REFERENCES "PostingPlace"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ShiftTiming" ADD CONSTRAINT "ShiftTiming_regionId_fkey" FOREIGN KEY ("regionId") REFERENCES "Region"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ShiftTiming" ADD CONSTRAINT "ShiftTiming_districtId_fkey" FOREIGN KEY ("districtId") REFERENCES "District"("id") ON DELETE SET NULL ON UPDATE CASCADE;
