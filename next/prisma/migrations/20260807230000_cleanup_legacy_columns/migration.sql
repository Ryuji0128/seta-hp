-- Product.images を唯一の画像ソースにする前に、旧 image のみを持つ行を移行する。
UPDATE `Product`
SET `images` = JSON_ARRAY(`image`)
WHERE `image` IS NOT NULL
  AND (`images` IS NULL OR JSON_LENGTH(`images`) = 0);

-- 現行コードから参照されない旧列と重複列を削除する。
ALTER TABLE `Product` DROP COLUMN `image`;
ALTER TABLE `User` DROP INDEX `User_username_key`, DROP COLUMN `username`;
ALTER TABLE `ReviewComment` DROP COLUMN `elementSelector`;
