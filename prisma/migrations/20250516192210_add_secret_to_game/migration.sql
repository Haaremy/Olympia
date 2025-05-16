/*
  Warnings:

  - Added the required column `secret` to the `Game` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Game" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "url" TEXT NOT NULL,
    "hidden" BOOLEAN NOT NULL DEFAULT false,
    "secret" INTEGER NOT NULL
);
INSERT INTO "new_Game" ("hidden", "id", "url") SELECT "hidden", "id", "url" FROM "Game";
DROP TABLE "Game";
ALTER TABLE "new_Game" RENAME TO "Game";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
