-- インデックス追加
CREATE INDEX `Estimate_status_idx` ON `Estimate`(`status`);
CREATE INDEX `Inquiry_createdAt_idx` ON `Inquiry`(`createdAt`);
CREATE INDEX `News_date_idx` ON `News`(`date`);
CREATE INDEX `Product_category_idx` ON `Product`(`category`);
CREATE INDEX `Product_isPublished_idx` ON `Product`(`isPublished`);
CREATE INDEX `Work_category_idx` ON `Work`(`category`);
CREATE INDEX `Work_isPublished_idx` ON `Work`(`isPublished`);

-- 未使用のVerificationTokenテーブルを削除
DROP TABLE IF EXISTS `VerificationToken`;
