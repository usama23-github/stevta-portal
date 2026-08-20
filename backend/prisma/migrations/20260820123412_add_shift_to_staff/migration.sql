-- AlterTable
ALTER TABLE "Staff" ADD COLUMN     "shiftId" INTEGER;

-- CreateTable
CREATE TABLE "Shift" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Shift_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "StaffShiftHistory" (
    "id" TEXT NOT NULL,
    "staffId" TEXT NOT NULL,
    "shiftId" INTEGER NOT NULL,
    "effectiveFrom" TIMESTAMP(3) NOT NULL,
    "effectiveTo" TIMESTAMP(3),
    "changedById" TEXT,
    "reason" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "StaffShiftHistory_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "StaffShiftHistory_staffId_idx" ON "StaffShiftHistory"("staffId");

-- CreateIndex
CREATE INDEX "StaffShiftHistory_shiftId_idx" ON "StaffShiftHistory"("shiftId");

-- CreateIndex
CREATE INDEX "StaffShiftHistory_effectiveFrom_idx" ON "StaffShiftHistory"("effectiveFrom");

-- CreateIndex
CREATE INDEX "StaffShiftHistory_effectiveTo_idx" ON "StaffShiftHistory"("effectiveTo");

-- CreateIndex
CREATE INDEX "Staff_shiftId_idx" ON "Staff"("shiftId");

-- AddForeignKey
ALTER TABLE "Staff" ADD CONSTRAINT "Staff_shiftId_fkey" FOREIGN KEY ("shiftId") REFERENCES "Shift"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StaffShiftHistory" ADD CONSTRAINT "StaffShiftHistory_staffId_fkey" FOREIGN KEY ("staffId") REFERENCES "Staff"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StaffShiftHistory" ADD CONSTRAINT "StaffShiftHistory_shiftId_fkey" FOREIGN KEY ("shiftId") REFERENCES "Shift"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
