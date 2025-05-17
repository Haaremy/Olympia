-- AlterTable
ALTER TABLE "Game" ADD COLUMN "tagged" TEXT;

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Entries" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "teamId" INTEGER NOT NULL,
    "gameId" INTEGER NOT NULL,
    "player" TEXT NOT NULL,
    "value" INTEGER NOT NULL,
    "lastUpdated" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Entries_teamId_fkey" FOREIGN KEY ("teamId") REFERENCES "Team" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "Entries_gameId_fkey" FOREIGN KEY ("gameId") REFERENCES "Game" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_Entries" ("gameId", "id", "lastUpdated", "player", "teamId", "value") SELECT "gameId", "id", "lastUpdated", "player", "teamId", "value" FROM "Entries";
DROP TABLE "Entries";
ALTER TABLE "new_Entries" RENAME TO "Entries";
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
    CONSTRAINT "Language_gameId_fkey" FOREIGN KEY ("gameId") REFERENCES "Game" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_Language" ("capacity", "descriptionGame", "descriptionPoints", "gameId", "id", "language", "station", "story", "title") SELECT "capacity", "descriptionGame", "descriptionPoints", "gameId", "id", "language", "station", "story", "title" FROM "Language";
DROP TABLE "Language";
ALTER TABLE "new_Language" RENAME TO "Language";
CREATE TABLE "new_Points" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "teamId" INTEGER NOT NULL,
    "gameId" INTEGER NOT NULL,
    "player" TEXT NOT NULL,
    "value" INTEGER NOT NULL,
    "lastUpdated" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Points_teamId_fkey" FOREIGN KEY ("teamId") REFERENCES "Team" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "Points_gameId_fkey" FOREIGN KEY ("gameId") REFERENCES "Game" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_Points" ("gameId", "id", "lastUpdated", "player", "teamId", "value") SELECT "gameId", "id", "lastUpdated", "player", "teamId", "value" FROM "Points";
DROP TABLE "Points";
ALTER TABLE "new_Points" RENAME TO "Points";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
