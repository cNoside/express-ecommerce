/*
  Warnings:

  - You are about to drop the `cart` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `product` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `cart` DROP FOREIGN KEY `Cart_userId_fkey`;

-- AlterTable
ALTER TABLE `profile` ADD COLUMN `updatedById` INTEGER NULL;

-- DropTable
DROP TABLE `cart`;

-- DropTable
DROP TABLE `product`;

-- AddForeignKey
ALTER TABLE `Profile` ADD CONSTRAINT `Profile_updatedById_fkey` FOREIGN KEY (`updatedById`) REFERENCES `User`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
