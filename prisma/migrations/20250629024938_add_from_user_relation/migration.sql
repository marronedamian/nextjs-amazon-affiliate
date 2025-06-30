-- AlterTable
ALTER TABLE `Notification` ADD COLUMN `fromUserId` VARCHAR(191) NULL;

-- AddForeignKey
ALTER TABLE `Notification` ADD CONSTRAINT `Notification_fromUserId_fkey` FOREIGN KEY (`fromUserId`) REFERENCES `Users`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
