-- Development databases may already have the current shape from `prisma db
-- push` while the following cleanup migration is still unapplied. Restore the
-- cleanup inputs only when that cleanup has not already been recorded.

SET @cleanup_applied = (
  SELECT COUNT(*)
  FROM `_prisma_migrations`
  WHERE `migration_name` = '20260807230000_cleanup_legacy_columns'
    AND `finished_at` IS NOT NULL
    AND `rolled_back_at` IS NULL
);

SET @column_exists = (
  SELECT COUNT(*) FROM INFORMATION_SCHEMA.COLUMNS
  WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'Product' AND COLUMN_NAME = 'image'
);
SET @statement = IF(
  @cleanup_applied = 0 AND @column_exists = 0,
  'ALTER TABLE `Product` ADD COLUMN `image` VARCHAR(191) NULL',
  'SELECT 1'
);
PREPARE migration_statement FROM @statement;
EXECUTE migration_statement;
DEALLOCATE PREPARE migration_statement;

SET @column_exists = (
  SELECT COUNT(*) FROM INFORMATION_SCHEMA.COLUMNS
  WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'User' AND COLUMN_NAME = 'username'
);
SET @statement = IF(
  @cleanup_applied = 0 AND @column_exists = 0,
  'ALTER TABLE `User` ADD COLUMN `username` VARCHAR(191) NULL',
  'SELECT 1'
);
PREPARE migration_statement FROM @statement;
EXECUTE migration_statement;
DEALLOCATE PREPARE migration_statement;

SET @index_exists = (
  SELECT COUNT(*) FROM INFORMATION_SCHEMA.STATISTICS
  WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'User' AND INDEX_NAME = 'User_username_key'
);
SET @statement = IF(
  @cleanup_applied = 0 AND @index_exists = 0,
  'CREATE UNIQUE INDEX `User_username_key` ON `User`(`username`)',
  'SELECT 1'
);
PREPARE migration_statement FROM @statement;
EXECUTE migration_statement;
DEALLOCATE PREPARE migration_statement;

SET @column_exists = (
  SELECT COUNT(*) FROM INFORMATION_SCHEMA.COLUMNS
  WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'ReviewComment' AND COLUMN_NAME = 'elementSelector'
);
SET @statement = IF(
  @cleanup_applied = 0 AND @column_exists = 0,
  'ALTER TABLE `ReviewComment` ADD COLUMN `elementSelector` TEXT NULL',
  'SELECT 1'
);
PREPARE migration_statement FROM @statement;
EXECUTE migration_statement;
DEALLOCATE PREPARE migration_statement;
