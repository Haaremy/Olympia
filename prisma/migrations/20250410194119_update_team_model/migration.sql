/*
  Warnings:

  - A unique constraint covering the columns `[credentials]` on the table `Team` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Team_credentials_key" ON "Team"("credentials");
