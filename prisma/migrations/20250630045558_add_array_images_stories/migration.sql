/*
  Warnings:

  - You are about to drop the column `images` on the `Story` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `Story` DROP COLUMN `images`;

-- CreateTable
CREATE TABLE `StoryImage` (
    `id` VARCHAR(191) NOT NULL,
    `storyId` VARCHAR(191) NOT NULL,
    `url` VARCHAR(191) NOT NULL,
    `order` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `StoryImage` ADD CONSTRAINT `StoryImage_storyId_fkey` FOREIGN KEY (`storyId`) REFERENCES `Story`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
