-- CreateTable
CREATE TABLE "Game" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "url" TEXT NOT NULL,
    "language" TEXT NOT NULL,
    "hidden" BOOLEAN NOT NULL DEFAULT false
);

-- CreateTable
CREATE TABLE "Language" (
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

-- CreateTable
CREATE TABLE "Team" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "credentials" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "user1" TEXT NOT NULL,
    "user2" TEXT NOT NULL,
    "user3" TEXT,
    "user4" TEXT,
    "role" TEXT NOT NULL DEFAULT 'USER',
    "pointsTotal" REAL NOT NULL,
    "language" TEXT NOT NULL DEFAULT 'de'
);

-- CreateTable
CREATE TABLE "Points" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "teamId" INTEGER NOT NULL,
    "gameId" INTEGER NOT NULL,
    "player" TEXT NOT NULL,
    "value" INTEGER NOT NULL,
    "lastUpdated" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Points_teamId_fkey" FOREIGN KEY ("teamId") REFERENCES "Team" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Points_gameId_fkey" FOREIGN KEY ("gameId") REFERENCES "Game" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Entries" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "teamId" INTEGER NOT NULL,
    "gameId" INTEGER NOT NULL,
    "player" TEXT NOT NULL,
    "value" INTEGER NOT NULL,
    "lastUpdated" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Entries_teamId_fkey" FOREIGN KEY ("teamId") REFERENCES "Team" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Entries_gameId_fkey" FOREIGN KEY ("gameId") REFERENCES "Game" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "GameSettings" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "started" BOOLEAN NOT NULL DEFAULT false,
    "ending" DATETIME NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "Team_credentials_key" ON "Team"("credentials");
