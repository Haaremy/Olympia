/*
  Warnings:

  - Added the required column `capacity` to the `Language` table without a default value. This is not possible if the table is not empty.
  - Added the required column `descriptionGame` to the `Language` table without a default value. This is not possible if the table is not empty.
  - Added the required column `descriptionPoints` to the `Language` table without a default value. This is not possible if the table is not empty.
  - Added the required column `location` to the `Language` table without a default value. This is not possible if the table is not empty.
  - Added the required column `player` to the `Points` table without a default value. This is not possible if the table is not empty.
  - Added the required column `value` to the `Points` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Language" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "gameId" INTEGER NOT NULL,
    "language" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "story" TEXT NOT NULL,
    "location" TEXT NOT NULL,
    "capacity" TEXT NOT NULL,
    "descriptionGame" TEXT NOT NULL,
    "descriptionPoints" TEXT NOT NULL,
    CONSTRAINT "Language_gameId_fkey" FOREIGN KEY ("gameId") REFERENCES "Game" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Language" ("gameId", "id", "language", "story", "title") SELECT "gameId", "id", "language", "story", "title" FROM "Language";
DROP TABLE "Language";
ALTER TABLE "new_Language" RENAME TO "Language";
CREATE TABLE "new_Points" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "teamId" INTEGER NOT NULL,
    "gameId" INTEGER NOT NULL,
    "player" TEXT NOT NULL,
    "value" INTEGER NOT NULL,
    CONSTRAINT "Points_teamId_fkey" FOREIGN KEY ("teamId") REFERENCES "Team" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Points_gameId_fkey" FOREIGN KEY ("gameId") REFERENCES "Game" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Points" ("gameId", "id", "teamId") SELECT "gameId", "id", "teamId" FROM "Points";
DROP TABLE "Points";
ALTER TABLE "new_Points" RENAME TO "Points";
CREATE TABLE "new_Team" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "credentials" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "user1" TEXT NOT NULL,
    "user2" TEXT NOT NULL,
    "user3" TEXT NOT NULL,
    "user4" TEXT NOT NULL,
    "pointsTotal" INTEGER NOT NULL
);
INSERT INTO "new_Team" ("credentials", "id", "name", "password", "pointsTotal", "user1", "user2", "user3", "user4") SELECT "credentials", "id", "name", "password", "pointsTotal", "user1", "user2", "user3", "user4" FROM "Team";
DROP TABLE "Team";
ALTER TABLE "new_Team" RENAME TO "Team";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
