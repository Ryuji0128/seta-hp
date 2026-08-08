-- Product, Work, and Estimate existed through `prisma db push` before the
-- baseline was committed, so their CREATE TABLE statements were missing from
-- migration history. This historical migration makes fresh replay possible.

-- Avoid recreating Estimate when this repair migration is applied out of order
-- to a database that has already applied the later Estimate removal.
SET @estimate_removed = (
    SELECT COUNT(*)
    FROM `_prisma_migrations`
    WHERE `migration_name` = '20260508300000_remove_estimate_model'
      AND `finished_at` IS NOT NULL
      AND `rolled_back_at` IS NULL
);
SET @statement = IF(
    @estimate_removed = 0,
    'CREATE TABLE IF NOT EXISTS `Estimate` (`id` INTEGER NOT NULL AUTO_INCREMENT, `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3), `updatedAt` DATETIME(3) NOT NULL, `fileName` VARCHAR(191) NOT NULL, `filePath` VARCHAR(191) NOT NULL, `amount` INTEGER NOT NULL, `paymentId` VARCHAR(191) NULL, `status` VARCHAR(191) NOT NULL DEFAULT ''pending'', PRIMARY KEY (`id`)) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci',
    'SELECT 1'
);
PREPARE statement FROM @statement;
EXECUTE statement;
DEALLOCATE PREPARE statement;

CREATE TABLE IF NOT EXISTS `Product` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `description` TEXT NOT NULL,
    `price` INTEGER NOT NULL,
    `category` VARCHAR(191) NOT NULL,
    `tags` VARCHAR(191) NOT NULL,
    `image` VARCHAR(191) NULL,
    `images` JSON NULL,
    `stock` VARCHAR(191) NOT NULL DEFAULT '在庫あり',
    `isPublished` BOOLEAN NOT NULL DEFAULT true,
    `purchaseUrl` VARCHAR(191) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `Work` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    `title` VARCHAR(191) NOT NULL,
    `description` TEXT NOT NULL,
    `category` VARCHAR(191) NOT NULL,
    `tags` VARCHAR(191) NOT NULL,
    `image` VARCHAR(191) NULL,
    `isPublished` BOOLEAN NOT NULL DEFAULT true,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
