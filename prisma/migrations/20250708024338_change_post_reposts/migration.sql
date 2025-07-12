/*
  Warnings:

  - A unique constraint covering the columns `[userId,repostId]` on the table `Post` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX `Post_userId_repostId_key` ON `Post`(`userId`, `repostId`);
