/*
  Warnings:

  - Made the column `fromUserId` on table `Notification` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE `Notification` DROP FOREIGN KEY `Notification_fromUserId_fkey`;

-- DropIndex
DROP INDEX `Notification_fromUserId_fkey` ON `Notification`;

-- AlterTable
ALTER TABLE `Notification` ADD COLUMN `notificationTypeId` VARCHAR(191) NULL,
    MODIFY `fromUserId` VARCHAR(191) NOT NULL;

-- CreateTable
CREATE TABLE `NotificationType` (
    `id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `NotificationType_name_key`(`name`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `NotificationTypeTranslation` (
    `id` VARCHAR(191) NOT NULL,
    `language` VARCHAR(191) NOT NULL,
    `label` VARCHAR(191) NOT NULL,
    `notificationTypeId` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `NotificationTypeTranslation_language_notificationTypeId_key`(`language`, `notificationTypeId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `NotificationTypeTranslation` ADD CONSTRAINT `NotificationTypeTranslation_notificationTypeId_fkey` FOREIGN KEY (`notificationTypeId`) REFERENCES `NotificationType`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Notification` ADD CONSTRAINT `Notification_fromUserId_fkey` FOREIGN KEY (`fromUserId`) REFERENCES `Users`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Notification` ADD CONSTRAINT `Notification_notificationTypeId_fkey` FOREIGN KEY (`notificationTypeId`) REFERENCES `NotificationType`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
