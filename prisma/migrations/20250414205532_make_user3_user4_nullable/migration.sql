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
    "user3" TEXT,
    "user4" TEXT,
    "role" TEXT NOT NULL DEFAULT 'USER',
    "pointsTotal" INTEGER NOT NULL,
    "language" TEXT NOT NULL DEFAULT 'de'
);
INSERT INTO "new_Team" ("credentials", "id", "language", "name", "password", "pointsTotal", "role", "user1", "user2", "user3", "user4") SELECT "credentials", "id", "language", "name", "password", "pointsTotal", "role", "user1", "user2", "user3", "user4" FROM "Team";
DROP TABLE "Team";
ALTER TABLE "new_Team" RENAME TO "Team";
CREATE UNIQUE INDEX "Team_credentials_key" ON "Team"("credentials");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
