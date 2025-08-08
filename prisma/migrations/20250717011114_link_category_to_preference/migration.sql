/*
  Warnings:

  - You are about to drop the column `updatedAt` on the `Category` table. All the data in the column will be lost.
  - Added the required column `categoryId` to the `CategoryPreference` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `Category` DROP COLUMN `updatedAt`;

-- AlterTable
ALTER TABLE `CategoryPreference` ADD COLUMN `categoryId` VARCHAR(191) NOT NULL;

-- AddForeignKey
ALTER TABLE `CategoryPreference` ADD CONSTRAINT `CategoryPreference_categoryId_fkey` FOREIGN KEY (`categoryId`) REFERENCES `Category`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
