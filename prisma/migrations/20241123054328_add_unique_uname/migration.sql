/*
  Warnings:

  - You are about to alter the column `timestamp` on the `Post` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Float`.
  - A unique constraint covering the columns `[uname]` on the table `User` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateTable
CREATE TABLE "Comment" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "post_id" INTEGER NOT NULL,
    "creator" INTEGER NOT NULL,
    "description" TEXT NOT NULL,
    "timestamp" REAL NOT NULL DEFAULT (strftime('%s', 'now') * 1000),
    CONSTRAINT "Comment_post_id_fkey" FOREIGN KEY ("post_id") REFERENCES "Post" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Comment_creator_fkey" FOREIGN KEY ("creator") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Post" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "title" TEXT NOT NULL,
    "link" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "creator" INTEGER NOT NULL,
    "subgroup" TEXT NOT NULL,
    "timestamp" REAL NOT NULL DEFAULT (strftime('%s', 'now') * 1000)
);
INSERT INTO "new_Post" ("creator", "description", "id", "link", "subgroup", "timestamp", "title") SELECT "creator", "description", "id", "link", "subgroup", "timestamp", "title" FROM "Post";
DROP TABLE "Post";
ALTER TABLE "new_Post" RENAME TO "Post";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;

-- CreateIndex
CREATE UNIQUE INDEX "User_uname_key" ON "User"("uname");
