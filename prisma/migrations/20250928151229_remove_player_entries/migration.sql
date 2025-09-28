/*
  Warnings:

  - You are about to drop the column `player` on the `Entries` table. All the data in the column will be lost.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Entries" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "teamId" INTEGER NOT NULL,
    "gameId" INTEGER NOT NULL,
    "value" INTEGER NOT NULL,
    "slot" INTEGER NOT NULL,
    "lastUpdated" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Entries_teamId_fkey" FOREIGN KEY ("teamId") REFERENCES "Team" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "Entries_gameId_fkey" FOREIGN KEY ("gameId") REFERENCES "Game" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_Entries" ("gameId", "id", "lastUpdated", "slot", "teamId", "value") SELECT "gameId", "id", "lastUpdated", "slot", "teamId", "value" FROM "Entries";
DROP TABLE "Entries";
ALTER TABLE "new_Entries" RENAME TO "Entries";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
