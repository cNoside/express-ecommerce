/*
  Warnings:

  - You are about to drop the column `totalPrice` on the `cart` table. All the data in the column will be lost.
  - You are about to drop the column `totalQuantity` on the `cart` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `cart` DROP COLUMN `totalPrice`,
    DROP COLUMN `totalQuantity`;
