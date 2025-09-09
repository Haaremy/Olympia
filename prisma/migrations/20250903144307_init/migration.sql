/*
  Warnings:

  - You are about to drop the column `credentials` on the `Team` table. All the data in the column will be lost.
  - Added the required column `uname` to the `Team` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Team" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "uname" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "user1" TEXT NOT NULL,
    "user2" TEXT NOT NULL,
    "user3" TEXT,
    "user4" TEXT,
    "role" TEXT NOT NULL DEFAULT 'USER',
    "pointsTotal" REAL NOT NULL,
    "language" TEXT NOT NULL DEFAULT 'de'
);
INSERT INTO "new_Team" ("id", "language", "name", "password", "pointsTotal", "role", "user1", "user2", "user3", "user4") SELECT "id", "language", "name", "password", "pointsTotal", "role", "user1", "user2", "user3", "user4" FROM "Team";
DROP TABLE "Team";
ALTER TABLE "new_Team" RENAME TO "Team";
CREATE UNIQUE INDEX "Team_uname_key" ON "Team"("uname");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
