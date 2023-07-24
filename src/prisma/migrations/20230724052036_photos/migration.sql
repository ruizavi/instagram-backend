/*
  Warnings:

  - You are about to alter the column `photo` on the `Profile` table. The data in that column could be lost. The data in that column will be cast from `String` to `Binary`.
  - You are about to drop the column `path` on the `Media` table. All the data in the column will be lost.
  - Added the required column `resource` to the `Media` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Profile" (
    "userID" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "bio" TEXT,
    "photo" BLOB,
    CONSTRAINT "Profile_userID_fkey" FOREIGN KEY ("userID") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Profile" ("bio", "firstName", "lastName", "photo", "userID") SELECT "bio", "firstName", "lastName", "photo", "userID" FROM "Profile";
DROP TABLE "Profile";
ALTER TABLE "new_Profile" RENAME TO "Profile";
CREATE TABLE "new_Media" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "postID" INTEGER NOT NULL,
    "resource" BLOB NOT NULL,
    CONSTRAINT "Media_postID_fkey" FOREIGN KEY ("postID") REFERENCES "Post" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Media" ("id", "postID") SELECT "id", "postID" FROM "Media";
DROP TABLE "Media";
ALTER TABLE "new_Media" RENAME TO "Media";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
