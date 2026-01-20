/*
  Warnings:

  - A unique constraint covering the columns `[title]` on the table `Libro` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Libro_title_key" ON "Libro"("title");
