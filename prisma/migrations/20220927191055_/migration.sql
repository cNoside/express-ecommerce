-- AlterTable
ALTER TABLE `order` ADD COLUMN `orderStatus` ENUM('pending', 'processing', 'shipped', 'delivered', 'cancelled') NOT NULL DEFAULT 'processing';
