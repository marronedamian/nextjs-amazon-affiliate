/*
  Warnings:

  - You are about to drop the column `affiliateUrl` on the `Article` table. All the data in the column will be lost.
  - You are about to drop the column `lang` on the `Article` table. All the data in the column will be lost.
  - Added the required column `language` to the `Article` table without a default value. This is not possible if the table is not empty.
  - Added the required column `products` to the `Article` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `Article` DROP COLUMN `affiliateUrl`,
    DROP COLUMN `lang`,
    ADD COLUMN `language` VARCHAR(191) NOT NULL,
    ADD COLUMN `products` JSON NOT NULL;
