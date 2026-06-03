CREATE TABLE `ApiRateLimit` (
  `id` INTEGER NOT NULL AUTO_INCREMENT,
  `identifier` VARCHAR(191) NOT NULL,
  `count` INTEGER NOT NULL,
  `resetAt` DATETIME(3) NOT NULL,
  `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updatedAt` DATETIME(3) NOT NULL,

  UNIQUE INDEX `ApiRateLimit_identifier_key`(`identifier`),
  INDEX `ApiRateLimit_resetAt_idx`(`resetAt`),
  PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
