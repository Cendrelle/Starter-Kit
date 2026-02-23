/*
  Warnings:

  - You are about to drop the column `jobId` on the `applications` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "applications" DROP CONSTRAINT "applications_jobId_fkey";

-- AlterTable
ALTER TABLE "applications" DROP COLUMN "jobId";
