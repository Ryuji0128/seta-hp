-- Remove tables and timestamp columns that have no runtime reader, then
-- reconcile indexes that previously matched schema only through prisma db push.
-- Every column/index operation is conditional so drifted development databases
-- and migration-managed production databases converge on the same shape.

DROP TABLE IF EXISTS Blog;
DROP TABLE IF EXISTS Session;

SET @column_exists = (
  SELECT COUNT(*) FROM INFORMATION_SCHEMA.COLUMNS
  WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'Account' AND COLUMN_NAME = 'createdAt'
);
SET @statement = IF(
  @column_exists > 0,
  'ALTER TABLE Account DROP COLUMN createdAt',
  'SELECT 1'
);
PREPARE migration_statement FROM @statement;
EXECUTE migration_statement;
DEALLOCATE PREPARE migration_statement;

SET @column_exists = (
  SELECT COUNT(*) FROM INFORMATION_SCHEMA.COLUMNS
  WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'Account' AND COLUMN_NAME = 'updatedAt'
);
SET @statement = IF(
  @column_exists > 0,
  'ALTER TABLE Account DROP COLUMN updatedAt',
  'SELECT 1'
);
PREPARE migration_statement FROM @statement;
EXECUTE migration_statement;
DEALLOCATE PREPARE migration_statement;

SET @column_exists = (
  SELECT COUNT(*) FROM INFORMATION_SCHEMA.COLUMNS
  WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'Inquiry' AND COLUMN_NAME = 'updatedAt'
);
SET @statement = IF(
  @column_exists > 0,
  'ALTER TABLE Inquiry DROP COLUMN updatedAt',
  'SELECT 1'
);
PREPARE migration_statement FROM @statement;
EXECUTE migration_statement;
DEALLOCATE PREPARE migration_statement;

SET @column_exists = (
  SELECT COUNT(*) FROM INFORMATION_SCHEMA.COLUMNS
  WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'News' AND COLUMN_NAME = 'createdAt'
);
SET @statement = IF(
  @column_exists > 0,
  'ALTER TABLE News DROP COLUMN createdAt',
  'SELECT 1'
);
PREPARE migration_statement FROM @statement;
EXECUTE migration_statement;
DEALLOCATE PREPARE migration_statement;

SET @column_exists = (
  SELECT COUNT(*) FROM INFORMATION_SCHEMA.COLUMNS
  WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'News' AND COLUMN_NAME = 'updatedAt'
);
SET @statement = IF(
  @column_exists > 0,
  'ALTER TABLE News DROP COLUMN updatedAt',
  'SELECT 1'
);
PREPARE migration_statement FROM @statement;
EXECUTE migration_statement;
DEALLOCATE PREPARE migration_statement;

SET @column_exists = (
  SELECT COUNT(*) FROM INFORMATION_SCHEMA.COLUMNS
  WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'User' AND COLUMN_NAME = 'createdAt'
);
SET @statement = IF(
  @column_exists > 0,
  'ALTER TABLE User DROP COLUMN createdAt',
  'SELECT 1'
);
PREPARE migration_statement FROM @statement;
EXECUTE migration_statement;
DEALLOCATE PREPARE migration_statement;

SET @column_exists = (
  SELECT COUNT(*) FROM INFORMATION_SCHEMA.COLUMNS
  WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'User' AND COLUMN_NAME = 'updatedAt'
);
SET @statement = IF(
  @column_exists > 0,
  'ALTER TABLE User DROP COLUMN updatedAt',
  'SELECT 1'
);
PREPARE migration_statement FROM @statement;
EXECUTE migration_statement;
DEALLOCATE PREPARE migration_statement;

SET @column_exists = (
  SELECT COUNT(*) FROM INFORMATION_SCHEMA.COLUMNS
  WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'Work' AND COLUMN_NAME = 'updatedAt'
);
SET @statement = IF(
  @column_exists > 0,
  'ALTER TABLE Work DROP COLUMN updatedAt',
  'SELECT 1'
);
PREPARE migration_statement FROM @statement;
EXECUTE migration_statement;
DEALLOCATE PREPARE migration_statement;

SET @column_exists = (
  SELECT COUNT(*) FROM INFORMATION_SCHEMA.COLUMNS
  WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'ReviewComment' AND COLUMN_NAME = 'updatedAt'
);
SET @statement = IF(
  @column_exists > 0,
  'ALTER TABLE ReviewComment DROP COLUMN updatedAt',
  'SELECT 1'
);
PREPARE migration_statement FROM @statement;
EXECUTE migration_statement;
DEALLOCATE PREPARE migration_statement;

SET @column_exists = (
  SELECT COUNT(*) FROM INFORMATION_SCHEMA.COLUMNS
  WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'ApiRateLimit' AND COLUMN_NAME = 'createdAt'
);
SET @statement = IF(
  @column_exists > 0,
  'ALTER TABLE ApiRateLimit DROP COLUMN createdAt',
  'SELECT 1'
);
PREPARE migration_statement FROM @statement;
EXECUTE migration_statement;
DEALLOCATE PREPARE migration_statement;

SET @column_exists = (
  SELECT COUNT(*) FROM INFORMATION_SCHEMA.COLUMNS
  WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'ApiRateLimit' AND COLUMN_NAME = 'updatedAt'
);
SET @statement = IF(
  @column_exists > 0,
  'ALTER TABLE ApiRateLimit DROP COLUMN updatedAt',
  'SELECT 1'
);
PREPARE migration_statement FROM @statement;
EXECUTE migration_statement;
DEALLOCATE PREPARE migration_statement;

SET @constraint_exists = (
  SELECT COUNT(*) FROM INFORMATION_SCHEMA.TABLE_CONSTRAINTS
  WHERE CONSTRAINT_SCHEMA = DATABASE() AND TABLE_NAME = 'Account'
    AND CONSTRAINT_NAME = 'Account_userId_fkey' AND CONSTRAINT_TYPE = 'FOREIGN KEY'
);
SET @statement = IF(
  @constraint_exists > 0,
  'ALTER TABLE Account DROP FOREIGN KEY Account_userId_fkey',
  'SELECT 1'
);
PREPARE migration_statement FROM @statement;
EXECUTE migration_statement;
DEALLOCATE PREPARE migration_statement;

ALTER TABLE Account
  ADD CONSTRAINT Account_userId_fkey
  FOREIGN KEY (userId) REFERENCES User(id)
  ON DELETE CASCADE ON UPDATE CASCADE;

SET @index_exists = (
  SELECT COUNT(*) FROM INFORMATION_SCHEMA.STATISTICS
  WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'Account' AND INDEX_NAME = 'Account_userId_key'
);
SET @statement = IF(
  @index_exists > 0,
  'DROP INDEX Account_userId_key ON Account',
  'SELECT 1'
);
PREPARE migration_statement FROM @statement;
EXECUTE migration_statement;
DEALLOCATE PREPARE migration_statement;

SET @index_exists = (
  SELECT COUNT(*) FROM INFORMATION_SCHEMA.STATISTICS
  WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'Product' AND INDEX_NAME = 'Product_isPublished_idx'
);
SET @statement = IF(
  @index_exists > 0,
  'DROP INDEX Product_isPublished_idx ON Product',
  'SELECT 1'
);
PREPARE migration_statement FROM @statement;
EXECUTE migration_statement;
DEALLOCATE PREPARE migration_statement;

SET @index_exists = (
  SELECT COUNT(*) FROM INFORMATION_SCHEMA.STATISTICS
  WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'Work' AND INDEX_NAME = 'Work_isPublished_idx'
);
SET @statement = IF(
  @index_exists > 0,
  'DROP INDEX Work_isPublished_idx ON Work',
  'SELECT 1'
);
PREPARE migration_statement FROM @statement;
EXECUTE migration_statement;
DEALLOCATE PREPARE migration_statement;

SET @index_exists = (
  SELECT COUNT(*) FROM INFORMATION_SCHEMA.STATISTICS
  WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'Product' AND INDEX_NAME = 'Product_isPublished_createdAt_idx'
);
SET @statement = IF(
  @index_exists = 0,
  'CREATE INDEX Product_isPublished_createdAt_idx ON Product(isPublished, createdAt)',
  'SELECT 1'
);
PREPARE migration_statement FROM @statement;
EXECUTE migration_statement;
DEALLOCATE PREPARE migration_statement;

SET @index_exists = (
  SELECT COUNT(*) FROM INFORMATION_SCHEMA.STATISTICS
  WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'Work' AND INDEX_NAME = 'Work_isPublished_createdAt_idx'
);
SET @statement = IF(
  @index_exists = 0,
  'CREATE INDEX Work_isPublished_createdAt_idx ON Work(isPublished, createdAt)',
  'SELECT 1'
);
PREPARE migration_statement FROM @statement;
EXECUTE migration_statement;
DEALLOCATE PREPARE migration_statement;
