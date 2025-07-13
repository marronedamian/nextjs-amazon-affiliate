/*
  Warnings:

  - Added the required column `amazonLink` to the `Article` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `Article` ADD COLUMN `amazonLink` VARCHAR(191) NOT NULL;
