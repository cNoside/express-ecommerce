-- AlterTable
ALTER TABLE `cart` MODIFY `totalPrice` DOUBLE NOT NULL DEFAULT 0,
    MODIFY `totalQuantity` INTEGER NOT NULL DEFAULT 0;