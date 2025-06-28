/*
  Warnings:

  - The primary key for the `Message` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `Message` table. All the data in the column will be lost.
  - The required column `iid` was added to the `Message` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.
  - Added the required column `receiverId` to the `Message` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `Message` DROP PRIMARY KEY,
    DROP COLUMN `id`,
    ADD COLUMN `iid` VARCHAR(191) NOT NULL,
    ADD COLUMN `receiverId` VARCHAR(191) NOT NULL,
    ADD PRIMARY KEY (`iid`);

-- AddForeignKey
ALTER TABLE `Message` ADD CONSTRAINT `Message_receiverId_fkey` FOREIGN KEY (`receiverId`) REFERENCES `Users`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
