-- CreateTable
CREATE TABLE "Vote" (
    "user_id" INTEGER NOT NULL,
    "post_id" INTEGER NOT NULL,
    "value" INTEGER NOT NULL,

    PRIMARY KEY ("post_id", "user_id"),
    CONSTRAINT "Vote_post_id_fkey" FOREIGN KEY ("post_id") REFERENCES "Post" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Vote_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Comment" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "post_id" INTEGER NOT NULL,
    "creator" INTEGER NOT NULL,
    "description" TEXT NOT NULL,
    "timestamp" REAL NOT NULL DEFAULT (strftime('%s', 'now') * 1000),
    CONSTRAINT "Comment_post_id_fkey" FOREIGN KEY ("post_id") REFERENCES "Post" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Comment_creator_fkey" FOREIGN KEY ("creator") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Comment" ("creator", "description", "id", "post_id", "timestamp") SELECT "creator", "description", "id", "post_id", "timestamp" FROM "Comment";
DROP TABLE "Comment";
ALTER TABLE "new_Comment" RENAME TO "Comment";
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
