/*
  Warnings:

  - A unique constraint covering the columns `[job_id,email]` on the table `job_applications` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "job_applications_job_id_email_key" ON "job_applications"("job_id", "email");
