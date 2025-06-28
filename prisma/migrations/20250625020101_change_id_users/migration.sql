/*
  Warnings:

  - The primary key for the `Users` table will be changed. If it partially fails, the table could be left without primary key constraint.

*/
-- DropForeignKey
ALTER TABLE `Message` DROP FOREIGN KEY `Message_senderId_fkey`;

-- DropForeignKey
ALTER TABLE `Preferences` DROP FOREIGN KEY `Preferences_userId_fkey`;

-- DropForeignKey
ALTER TABLE `UserOnConversation` DROP FOREIGN KEY `UserOnConversation_userId_fkey`;

-- DropIndex
DROP INDEX `Message_senderId_fkey` ON `Message`;

-- AlterTable
ALTER TABLE `Message` MODIFY `senderId` VARCHAR(191) NOT NULL;

-- AlterTable
ALTER TABLE `Preferences` MODIFY `userId` VARCHAR(191) NOT NULL;

-- AlterTable
ALTER TABLE `UserOnConversation` MODIFY `userId` VARCHAR(191) NOT NULL;

-- AlterTable
ALTER TABLE `Users` DROP PRIMARY KEY,
    MODIFY `id` VARCHAR(191) NOT NULL,
    ADD PRIMARY KEY (`id`);

-- AddForeignKey
ALTER TABLE `Preferences` ADD CONSTRAINT `Preferences_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `Users`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `UserOnConversation` ADD CONSTRAINT `UserOnConversation_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `Users`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Message` ADD CONSTRAINT `Message_senderId_fkey` FOREIGN KEY (`senderId`) REFERENCES `Users`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
