/*
  Warnings:

  - Added the required column `appointment_type` to the `Appointment` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Appointment" ADD COLUMN     "appointment_type" TEXT NOT NULL;
