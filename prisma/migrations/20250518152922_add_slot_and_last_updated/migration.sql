/*
  Warnings:

  - You are about to drop the column `hidden` on the `Game` table. All the data in the column will be lost.
  - Added the required column `slot` to the `Entries` table without a default value. This is not possible if the table is not empty.
  - Added the required column `slot` to the `Points` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Entries" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "teamId" INTEGER NOT NULL,
    "gameId" INTEGER NOT NULL,
    "player" TEXT NOT NULL,
    "value" INTEGER NOT NULL,
    "slot" INTEGER NOT NULL,
    "lastUpdated" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Entries_teamId_fkey" FOREIGN KEY ("teamId") REFERENCES "Team" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "Entries_gameId_fkey" FOREIGN KEY ("gameId") REFERENCES "Game" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_Entries" ("gameId", "id", "lastUpdated", "player", "teamId", "value") SELECT "gameId", "id", "lastUpdated", "player", "teamId", "value" FROM "Entries";
DROP TABLE "Entries";
ALTER TABLE "new_Entries" RENAME TO "Entries";
CREATE TABLE "new_Game" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "url" TEXT NOT NULL,
    "tagged" TEXT
);
INSERT INTO "new_Game" ("id", "tagged", "url") SELECT "id", "tagged", "url" FROM "Game";
DROP TABLE "Game";
ALTER TABLE "new_Game" RENAME TO "Game";
CREATE TABLE "new_Points" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "teamId" INTEGER NOT NULL,
    "gameId" INTEGER NOT NULL,
    "player" TEXT NOT NULL,
    "value" INTEGER NOT NULL,
    "slot" INTEGER NOT NULL,
    "lastUpdated" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Points_teamId_fkey" FOREIGN KEY ("teamId") REFERENCES "Team" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "Points_gameId_fkey" FOREIGN KEY ("gameId") REFERENCES "Game" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_Points" ("gameId", "id", "lastUpdated", "player", "teamId", "value") SELECT "gameId", "id", "lastUpdated", "player", "teamId", "value" FROM "Points";
DROP TABLE "Points";
ALTER TABLE "new_Points" RENAME TO "Points";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
