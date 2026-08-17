/*
  Warnings:

  - A unique constraint covering the columns `[section,postingPlaceId,departmentId]` on the table `Section` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "Section_section_postingPlaceId_key";

-- CreateIndex
CREATE INDEX "Section_departmentId_idx" ON "Section"("departmentId");

-- CreateIndex
CREATE UNIQUE INDEX "Section_section_postingPlaceId_departmentId_key" ON "Section"("section", "postingPlaceId", "departmentId");
