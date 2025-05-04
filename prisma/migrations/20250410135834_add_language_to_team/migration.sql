-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Team" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "credentials" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "user1" TEXT NOT NULL,
    "user2" TEXT NOT NULL,
    "user3" TEXT NOT NULL,
    "user4" TEXT NOT NULL,
    "role" TEXT NOT NULL DEFAULT 'USER',
    "pointsTotal" INTEGER NOT NULL
);
INSERT INTO "new_Team" ("credentials", "id", "name", "password", "pointsTotal", "user1", "user2", "user3", "user4") SELECT "credentials", "id", "name", "password", "pointsTotal", "user1", "user2", "user3", "user4" FROM "Team";
DROP TABLE "Team";
ALTER TABLE "new_Team" RENAME TO "Team";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
