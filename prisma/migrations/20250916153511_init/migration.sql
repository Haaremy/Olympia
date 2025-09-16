/*
  Warnings:

  - Added the required column `cheatPoints` to the `Team` table without a default value. This is not possible if the table is not empty.

*/
-- CreateTable
CREATE TABLE "Reports" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "gameId" INTEGER NOT NULL,
    "message" TEXT NOT NULL,
    "teamId" INTEGER NOT NULL,
    CONSTRAINT "Reports_teamId_fkey" FOREIGN KEY ("teamId") REFERENCES "Team" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

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
    "language" TEXT NOT NULL DEFAULT 'de',
    "cheatPoints" INTEGER NOT NULL
);
INSERT INTO "new_Team" ("id", "language", "name", "password", "pointsTotal", "role", "uname", "user1", "user2", "user3", "user4") SELECT "id", "language", "name", "password", "pointsTotal", "role", "uname", "user1", "user2", "user3", "user4" FROM "Team";
DROP TABLE "Team";
ALTER TABLE "new_Team" RENAME TO "Team";
CREATE UNIQUE INDEX "Team_uname_key" ON "Team"("uname");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
