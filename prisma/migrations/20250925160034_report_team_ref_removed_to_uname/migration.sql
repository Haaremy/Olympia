/*
  Warnings:

  - You are about to drop the column `teamId` on the `Reports` table. All the data in the column will be lost.
  - Added the required column `teamName` to the `Reports` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Reports" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "gameId" INTEGER NOT NULL,
    "message" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "teamName" TEXT NOT NULL
);
INSERT INTO "new_Reports" ("createdAt", "gameId", "id", "message") SELECT "createdAt", "gameId", "id", "message" FROM "Reports";
DROP TABLE "Reports";
ALTER TABLE "new_Reports" RENAME TO "Reports";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
