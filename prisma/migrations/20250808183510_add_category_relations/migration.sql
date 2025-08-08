/*
  Warnings:

  - A unique constraint covering the columns `[preferencesId,categoryId]` on the table `CategoryPreference` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE `Post` ADD COLUMN `categoryId` VARCHAR(191) NULL;

-- AlterTable
ALTER TABLE `Story` ADD COLUMN `categoryId` VARCHAR(191) NULL;

-- CreateIndex
CREATE UNIQUE INDEX `CategoryPreference_preferencesId_categoryId_key` ON `CategoryPreference`(`preferencesId`, `categoryId`);

-- AddForeignKey
ALTER TABLE `Story` ADD CONSTRAINT `Story_categoryId_fkey` FOREIGN KEY (`categoryId`) REFERENCES `Category`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Post` ADD CONSTRAINT `Post_categoryId_fkey` FOREIGN KEY (`categoryId`) REFERENCES `Category`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
