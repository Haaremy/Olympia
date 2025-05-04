/*
  Warnings:

  - You are about to drop the column `location` on the `Language` table. All the data in the column will be lost.
  - Added the required column `station` to the `Language` table without a default value. This is not possible if the table is not empty.

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
    "station" TEXT NOT NULL,
    "capacity" TEXT NOT NULL,
    "descriptionGame" TEXT NOT NULL,
    "descriptionPoints" TEXT NOT NULL,
    CONSTRAINT "Language_gameId_fkey" FOREIGN KEY ("gameId") REFERENCES "Game" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Language" ("capacity", "descriptionGame", "descriptionPoints", "gameId", "id", "language", "story", "title") SELECT "capacity", "descriptionGame", "descriptionPoints", "gameId", "id", "language", "story", "title" FROM "Language";
DROP TABLE "Language";
ALTER TABLE "new_Language" RENAME TO "Language";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
