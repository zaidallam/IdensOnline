/*
  Warnings:

  - You are about to drop the column `color` on the `Car` table. All the data in the column will be lost.
  - You are about to drop the column `trim` on the `Car` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Car" DROP COLUMN "color",
DROP COLUMN "trim";
