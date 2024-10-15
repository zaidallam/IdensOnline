/*
  Warnings:

  - You are about to drop the column `license_plate` on the `Car` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "Car_license_plate_key";

-- AlterTable
ALTER TABLE "Car" DROP COLUMN "license_plate",
ADD COLUMN     "trim" VARCHAR(59);
