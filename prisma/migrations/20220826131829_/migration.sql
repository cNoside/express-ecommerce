-- AlterTable
ALTER TABLE `user` MODIFY `role` ENUM('admin', 'user', 'staff') NOT NULL DEFAULT 'user';
