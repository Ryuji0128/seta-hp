-- Estimate に userId カラム追加（optional）
ALTER TABLE `Estimate` ADD COLUMN `userId` VARCHAR(191) NULL;
CREATE INDEX `Estimate_userId_idx` ON `Estimate`(`userId`);
ALTER TABLE `Estimate` ADD CONSTRAINT `Estimate_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- Inquiry に userId カラム追加（optional）
ALTER TABLE `Inquiry` ADD COLUMN `userId` VARCHAR(191) NULL;
CREATE INDEX `Inquiry_userId_idx` ON `Inquiry`(`userId`);
ALTER TABLE `Inquiry` ADD CONSTRAINT `Inquiry_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
