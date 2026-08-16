-- AlterTable
ALTER TABLE "Section" ADD COLUMN     "departmentId" INTEGER;

-- CreateTable
CREATE TABLE "Department" (
    "id" SERIAL NOT NULL,
    "department" TEXT NOT NULL,
    "postingPlaceId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Department_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Department_postingPlaceId_idx" ON "Department"("postingPlaceId");

-- CreateIndex
CREATE UNIQUE INDEX "Department_department_postingPlaceId_key" ON "Department"("department", "postingPlaceId");

-- AddForeignKey
ALTER TABLE "Section" ADD CONSTRAINT "Section_departmentId_fkey" FOREIGN KEY ("departmentId") REFERENCES "Department"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Department" ADD CONSTRAINT "Department_postingPlaceId_fkey" FOREIGN KEY ("postingPlaceId") REFERENCES "PostingPlace"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
