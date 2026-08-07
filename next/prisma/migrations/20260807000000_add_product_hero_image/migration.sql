-- Add Product.isHeroImage for databases created before the field was added to schema.prisma.
-- The checks keep this migration safe for environments where the column was added manually.
SET @column_exists = (
  SELECT COUNT(*)
  FROM INFORMATION_SCHEMA.COLUMNS
  WHERE TABLE_SCHEMA = DATABASE()
    AND TABLE_NAME = 'Product'
    AND COLUMN_NAME = 'isHeroImage'
);
SET @add_column_sql = IF(
  @column_exists = 0,
  'ALTER TABLE Product ADD COLUMN isHeroImage BOOLEAN NOT NULL DEFAULT false',
  'SELECT 1'
);
PREPARE add_column_statement FROM @add_column_sql;
EXECUTE add_column_statement;
DEALLOCATE PREPARE add_column_statement;

SET @index_exists = (
  SELECT COUNT(*)
  FROM INFORMATION_SCHEMA.STATISTICS
  WHERE TABLE_SCHEMA = DATABASE()
    AND TABLE_NAME = 'Product'
    AND INDEX_NAME = 'Product_isHeroImage_isPublished_idx'
);
SET @add_index_sql = IF(
  @index_exists = 0,
  'CREATE INDEX Product_isHeroImage_isPublished_idx ON Product(isHeroImage, isPublished)',
  'SELECT 1'
);
PREPARE add_index_statement FROM @add_index_sql;
EXECUTE add_index_statement;
DEALLOCATE PREPARE add_index_statement;
