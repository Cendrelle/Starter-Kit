/*
  Warnings:

  - Added the required column `type` to the `Donation` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "DonationType" AS ENUM ('FULL_PC', 'PARTIAL_PC', 'COMMON_POOL');

-- CreateEnum
CREATE TYPE "PcType" AS ENUM ('BASIC', 'STANDARD', 'PREMIUM');

-- AlterTable
ALTER TABLE "Donation" ADD COLUMN     "pcType" "PcType",
ADD COLUMN     "percentage" INTEGER,
ADD COLUMN     "type" "DonationType" NOT NULL;
