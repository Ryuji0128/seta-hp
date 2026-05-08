-- Session.userId の外部キーに ON DELETE CASCADE を追加
ALTER TABLE `Session` DROP FOREIGN KEY `Session_userId_fkey`;
ALTER TABLE `Session` ADD CONSTRAINT `Session_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
