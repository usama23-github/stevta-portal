-- CreateTable
CREATE TABLE "PostingPlace" (
    "id" SERIAL NOT NULL,
    "postingPlace" TEXT NOT NULL,
    "order" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PostingPlace_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Section" (
    "id" SERIAL NOT NULL,
    "section" TEXT NOT NULL,
    "postingPlaceId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Section_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "PostingPlace_postingPlace_key" ON "PostingPlace"("postingPlace");

-- AddForeignKey
ALTER TABLE "Section" ADD CONSTRAINT "Section_postingPlaceId_fkey" FOREIGN KEY ("postingPlaceId") REFERENCES "PostingPlace"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
