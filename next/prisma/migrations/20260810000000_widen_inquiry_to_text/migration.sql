-- Widen Inquiry.inquiry from the default VARCHAR(191) to TEXT.
-- InquirySchema accepts up to 500 characters (and the contact form's custom-request
-- template alone approaches the 191 limit), so messages between 192-500 chars passed
-- validation but failed the DB insert (P2000) with a generic 500. TEXT removes the cap.
-- Widening is non-destructive; the operation is a no-op if the column is already TEXT.

SET @is_text = (
  SELECT COUNT(*) FROM INFORMATION_SCHEMA.COLUMNS
  WHERE TABLE_SCHEMA = DATABASE()
    AND TABLE_NAME = 'Inquiry'
    AND COLUMN_NAME = 'inquiry'
    AND DATA_TYPE = 'text'
);
SET @statement = IF(
  @is_text = 0,
  'ALTER TABLE Inquiry MODIFY inquiry TEXT NOT NULL',
  'SELECT 1'
);
PREPARE migration_statement FROM @statement;
EXECUTE migration_statement;
DEALLOCATE PREPARE migration_statement;
