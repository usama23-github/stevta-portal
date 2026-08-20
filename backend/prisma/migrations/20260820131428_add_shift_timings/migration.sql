-- CreateTable
CREATE TABLE "ShiftTiming" (
    "id" TEXT NOT NULL,
    "shiftId" INTEGER NOT NULL,
    "shiftStartTime" TIMESTAMP(3) NOT NULL,
    "checkInOnTime" TIMESTAMP(3) NOT NULL,
    "checkInLate" TIMESTAMP(3) NOT NULL,
    "checkOutEarly" TIMESTAMP(3) NOT NULL,
    "checkOutOnTime" TIMESTAMP(3) NOT NULL,
    "effectiveFrom" TIMESTAMP(3) NOT NULL,
    "effectiveTo" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ShiftTiming_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "ShiftTiming_shiftId_idx" ON "ShiftTiming"("shiftId");

-- CreateIndex
CREATE INDEX "ShiftTiming_effectiveFrom_idx" ON "ShiftTiming"("effectiveFrom");

-- CreateIndex
CREATE INDEX "ShiftTiming_effectiveTo_idx" ON "ShiftTiming"("effectiveTo");

-- AddForeignKey
ALTER TABLE "ShiftTiming" ADD CONSTRAINT "ShiftTiming_shiftId_fkey" FOREIGN KEY ("shiftId") REFERENCES "Shift"("id") ON DELETE CASCADE ON UPDATE CASCADE;
