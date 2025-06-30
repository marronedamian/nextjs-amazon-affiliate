/*
  Warnings:

  - You are about to drop the column `notificationTypeId` on the `Notification` table. All the data in the column will be lost.
  - You are about to drop the column `type` on the `Notification` table. All the data in the column will be lost.
  - Added the required column `typeId` to the `Notification` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `Notification` DROP FOREIGN KEY `Notification_notificationTypeId_fkey`;

-- DropIndex
DROP INDEX `Notification_notificationTypeId_fkey` ON `Notification`;

-- AlterTable
ALTER TABLE `Notification` DROP COLUMN `notificationTypeId`,
    DROP COLUMN `type`,
    ADD COLUMN `typeId` VARCHAR(191) NOT NULL;

-- AddForeignKey
ALTER TABLE `Notification` ADD CONSTRAINT `Notification_typeId_fkey` FOREIGN KEY (`typeId`) REFERENCES `NotificationType`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
