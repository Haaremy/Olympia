-- CreateTable
CREATE TABLE "GameSettings" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "started" BOOLEAN NOT NULL DEFAULT false,
    "ending" DATETIME NOT NULL
);
