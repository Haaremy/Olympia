-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Points" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "teamId" INTEGER NOT NULL,
    "gameId" INTEGER NOT NULL,
    "player" TEXT NOT NULL,
    "value" INTEGER NOT NULL,
    "lastUpdated" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Points_teamId_fkey" FOREIGN KEY ("teamId") REFERENCES "Team" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Points_gameId_fkey" FOREIGN KEY ("gameId") REFERENCES "Game" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Points" ("gameId", "id", "player", "teamId", "value") SELECT "gameId", "id", "player", "teamId", "value" FROM "Points";
DROP TABLE "Points";
ALTER TABLE "new_Points" RENAME TO "Points";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
