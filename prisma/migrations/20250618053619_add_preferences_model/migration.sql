/*
  Warnings:

  - You are about to drop the `users_login` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE `users_login`;

-- CreateTable
CREATE TABLE `Users` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `email` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NULL,
    `image` VARCHAR(191) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `Users_email_key`(`email`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Preferences` (
    `id` VARCHAR(191) NOT NULL,
    `userId` INTEGER NOT NULL,
    `priceRangeMin` INTEGER NOT NULL,
    `priceRangeMax` INTEGER NOT NULL,

    UNIQUE INDEX `Preferences_userId_key`(`userId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `CategoryPreference` (
    `id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `preferencesId` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Preferences` ADD CONSTRAINT `Preferences_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `Users`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `CategoryPreference` ADD CONSTRAINT `CategoryPreference_preferencesId_fkey` FOREIGN KEY (`preferencesId`) REFERENCES `Preferences`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
