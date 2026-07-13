-- AlterTable
ALTER TABLE "Staff" ADD COLUMN     "postingPlaceId" INTEGER,
ADD COLUMN     "sectionId" INTEGER,
ALTER COLUMN "designation" DROP NOT NULL,
ALTER COLUMN "department" DROP NOT NULL;

-- CreateIndex
CREATE INDEX "Staff_postingPlaceId_idx" ON "Staff"("postingPlaceId");

-- CreateIndex
CREATE INDEX "Staff_sectionId_idx" ON "Staff"("sectionId");

-- AddForeignKey
ALTER TABLE "Staff" ADD CONSTRAINT "Staff_postingPlaceId_fkey" FOREIGN KEY ("postingPlaceId") REFERENCES "PostingPlace"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Staff" ADD CONSTRAINT "Staff_sectionId_fkey" FOREIGN KEY ("sectionId") REFERENCES "Section"("id") ON DELETE SET NULL ON UPDATE CASCADE;
