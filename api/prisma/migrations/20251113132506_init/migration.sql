-- CreateTable
CREATE TABLE `collecte_calendrier` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `date` DATETIME(3) NOT NULL,
    `typeCollecte` VARCHAR(191) NOT NULL,
    `annee` INTEGER NOT NULL,
    `mois` INTEGER NOT NULL,
    `jour` INTEGER NOT NULL,
    `estFerie` BOOLEAN NOT NULL DEFAULT false,
    `description` VARCHAR(191) NULL,

    UNIQUE INDEX `collecte_calendrier_date_key`(`date`),
    INDEX `collecte_calendrier_date_idx`(`date`),
    INDEX `collecte_calendrier_annee_mois_idx`(`annee`, `mois`),
    INDEX `collecte_calendrier_typeCollecte_idx`(`typeCollecte`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `jours_feries` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `date` DATETIME(3) NOT NULL,
    `nom` VARCHAR(191) NOT NULL,
    `annee` INTEGER NOT NULL,

    UNIQUE INDEX `jours_feries_date_key`(`date`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `utilisateur` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `email` VARCHAR(191) NOT NULL,
    `telephone` VARCHAR(191) NULL,
    `notifEmail` BOOLEAN NOT NULL DEFAULT true,
    `notifSms` BOOLEAN NOT NULL DEFAULT false,
    `timezone` VARCHAR(191) NOT NULL DEFAULT 'Europe/Paris',

    UNIQUE INDEX `utilisateur_email_key`(`email`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `notification_log` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `utilisateurId` INTEGER NOT NULL,
    `type` VARCHAR(191) NOT NULL,
    `message` TEXT NOT NULL,
    `envoyeLe` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `statut` VARCHAR(191) NOT NULL,

    INDEX `notification_log_utilisateurId_idx`(`utilisateurId`),
    INDEX `notification_log_envoyeLe_idx`(`envoyeLe`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `notification_log` ADD CONSTRAINT `notification_log_utilisateurId_fkey` FOREIGN KEY (`utilisateurId`) REFERENCES `utilisateur`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
