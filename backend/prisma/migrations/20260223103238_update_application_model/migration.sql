/*
  Warnings:

  - You are about to drop the column `job_id` on the `applications` table. All the data in the column will be lost.
  - You are about to drop the column `status` on the `applications` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[user_id]` on the table `applications` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `updated_at` to the `applications` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "applications" DROP CONSTRAINT "applications_job_id_fkey";

-- DropIndex
DROP INDEX "applications_user_id_job_id_key";

-- AlterTable
ALTER TABLE "applications" DROP COLUMN "job_id",
DROP COLUMN "status",
ADD COLUMN     "competences" TEXT,
ADD COLUMN     "cv" TEXT,
ADD COLUMN     "full_name" TEXT,
ADD COLUMN     "jobId" INTEGER,
ADD COLUMN     "phone" TEXT,
ADD COLUMN     "updated_at" TIMESTAMP(3) NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "applications_user_id_key" ON "applications"("user_id");

-- AddForeignKey
ALTER TABLE "applications" ADD CONSTRAINT "applications_jobId_fkey" FOREIGN KEY ("jobId") REFERENCES "jobs"("id") ON DELETE SET NULL ON UPDATE CASCADE;
