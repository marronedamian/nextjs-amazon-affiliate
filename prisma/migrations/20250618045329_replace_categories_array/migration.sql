-- AlterTable
ALTER TABLE `users_login` ADD COLUMN `categories` VARCHAR(191) NULL,
    ADD COLUMN `priceRangeMax` INTEGER NULL,
    ADD COLUMN `priceRangeMin` INTEGER NULL;
