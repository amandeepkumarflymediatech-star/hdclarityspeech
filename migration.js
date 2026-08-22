require('dotenv').config();
const mysql = require('mysql2/promise');

async function migrate() {
  const connection = await mysql.createConnection({
    host: process.env.MYSQL_HOST || '127.0.0.1',
    user: process.env.MYSQL_USER || 'root',
    password: process.env.MYSQL_PASSWORD || 'root',
    database: process.env.MYSQL_DATABASE || 'hdclarityspeech'
  });

  const queries = `-- CreateTable
CREATE TABLE \`User\` (
    \`id\` VARCHAR(191) NOT NULL,
    \`email\` VARCHAR(191) NOT NULL,
    \`name\` VARCHAR(191) NULL,
    \`emailVerified\` DATETIME(3) NULL,
    \`image\` VARCHAR(191) NULL,
    \`password\` VARCHAR(191) NULL,
    \`role\` ENUM('ADMIN', 'TUTOR', 'STUDENT') NOT NULL DEFAULT 'STUDENT',
    \`isActive\` BOOLEAN NOT NULL DEFAULT true,
    \`bio\` TEXT NULL,
    \`experience\` TEXT NULL,
    \`qualifications\` TEXT NULL,
    \`languages\` VARCHAR(191) NULL,
    \`isApproved\` BOOLEAN NOT NULL DEFAULT false,
    \`createdAt\` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    \`updatedAt\` DATETIME(3) NOT NULL,

    UNIQUE INDEX \`User_email_key\`(\`email\`),
    PRIMARY KEY (\`id\`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE \`Account\` (
    \`id\` VARCHAR(191) NOT NULL,
    \`userId\` VARCHAR(191) NOT NULL,
    \`type\` VARCHAR(191) NOT NULL,
    \`provider\` VARCHAR(191) NOT NULL,
    \`providerAccountId\` VARCHAR(191) NOT NULL,
    \`refresh_token\` TEXT NULL,
    \`access_token\` TEXT NULL,
    \`expires_at\` INTEGER NULL,
    \`token_type\` VARCHAR(191) NULL,
    \`scope\` VARCHAR(191) NULL,
    \`id_token\` TEXT NULL,
    \`session_state\` VARCHAR(191) NULL,

    UNIQUE INDEX \`Account_provider_providerAccountId_key\`(\`provider\`, \`providerAccountId\`),
    PRIMARY KEY (\`id\`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE \`Session_NextAuth\` (
    \`id\` VARCHAR(191) NOT NULL,
    \`sessionToken\` VARCHAR(191) NOT NULL,
    \`userId\` VARCHAR(191) NOT NULL,
    \`expires\` DATETIME(3) NOT NULL,

    UNIQUE INDEX \`Session_NextAuth_sessionToken_key\`(\`sessionToken\`),
    PRIMARY KEY (\`id\`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE \`Specialization\` (
    \`id\` VARCHAR(191) NOT NULL,
    \`name\` VARCHAR(191) NOT NULL,
    \`description\` TEXT NULL,
    \`isActive\` BOOLEAN NOT NULL DEFAULT true,

    UNIQUE INDEX \`Specialization_name_key\`(\`name\`),
    PRIMARY KEY (\`id\`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE \`TutorSpecialization\` (
    \`id\` VARCHAR(191) NOT NULL,
    \`tutorId\` VARCHAR(191) NOT NULL,
    \`specializationId\` VARCHAR(191) NOT NULL,

    UNIQUE INDEX \`TutorSpecialization_tutorId_specializationId_key\`(\`tutorId\`, \`specializationId\`),
    PRIMARY KEY (\`id\`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE \`SessionType\` (
    \`id\` VARCHAR(191) NOT NULL,
    \`name\` VARCHAR(191) NOT NULL,
    \`description\` TEXT NULL,
    \`durationMinutes\` INTEGER NOT NULL,
    \`basePrice\` DOUBLE NOT NULL,
    \`discountPrice\` DOUBLE NULL,
    \`isActive\` BOOLEAN NOT NULL DEFAULT true,
    \`cancellationPolicy\` VARCHAR(191) NULL,
    \`reschedulingPolicy\` VARCHAR(191) NULL,

    PRIMARY KEY (\`id\`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE \`TutorSessionType\` (
    \`id\` VARCHAR(191) NOT NULL,
    \`tutorId\` VARCHAR(191) NOT NULL,
    \`sessionTypeId\` VARCHAR(191) NOT NULL,
    \`customPrice\` DOUBLE NULL,

    UNIQUE INDEX \`TutorSessionType_tutorId_sessionTypeId_key\`(\`tutorId\`, \`sessionTypeId\`),
    PRIMARY KEY (\`id\`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE \`Package\` (
    \`id\` VARCHAR(191) NOT NULL,
    \`name\` VARCHAR(191) NOT NULL,
    \`description\` TEXT NULL,
    \`totalSessions\` INTEGER NOT NULL,
    \`price\` DOUBLE NOT NULL,
    \`discount\` DOUBLE NULL,
    \`validityDays\` INTEGER NOT NULL,
    \`isActive\` BOOLEAN NOT NULL DEFAULT true,

    PRIMARY KEY (\`id\`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE \`PackageSessionType\` (
    \`id\` VARCHAR(191) NOT NULL,
    \`packageId\` VARCHAR(191) NOT NULL,
    \`sessionTypeId\` VARCHAR(191) NOT NULL,

    UNIQUE INDEX \`PackageSessionType_packageId_sessionTypeId_key\`(\`packageId\`, \`sessionTypeId\`),
    PRIMARY KEY (\`id\`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE \`Order\` (
    \`id\` VARCHAR(191) NOT NULL,
    \`studentId\` VARCHAR(191) NOT NULL,
    \`packageId\` VARCHAR(191) NULL,
    \`bookingId\` VARCHAR(191) NULL,
    \`amount\` DOUBLE NOT NULL,
    \`currency\` VARCHAR(191) NOT NULL DEFAULT 'INR',
    \`status\` VARCHAR(191) NOT NULL DEFAULT 'PENDING',
    \`createdAt\` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    \`updatedAt\` DATETIME(3) NOT NULL,

    PRIMARY KEY (\`id\`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE \`Payment\` (
    \`id\` VARCHAR(191) NOT NULL,
    \`orderId\` VARCHAR(191) NOT NULL,
    \`studentId\` VARCHAR(191) NOT NULL,
    \`amount\` DOUBLE NOT NULL,
    \`currency\` VARCHAR(191) NOT NULL,
    \`razorpayOrderId\` VARCHAR(191) NOT NULL,
    \`razorpayPaymentId\` VARCHAR(191) NULL,
    \`status\` VARCHAR(191) NOT NULL DEFAULT 'PENDING',
    \`createdAt\` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    \`updatedAt\` DATETIME(3) NOT NULL,

    UNIQUE INDEX \`Payment_orderId_key\`(\`orderId\`),
    UNIQUE INDEX \`Payment_razorpayOrderId_key\`(\`razorpayOrderId\`),
    UNIQUE INDEX \`Payment_razorpayPaymentId_key\`(\`razorpayPaymentId\`),
    PRIMARY KEY (\`id\`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE \`PaymentTransaction\` (
    \`id\` VARCHAR(191) NOT NULL,
    \`paymentId\` VARCHAR(191) NOT NULL,
    \`status\` VARCHAR(191) NOT NULL,
    \`rawData\` TEXT NOT NULL,
    \`createdAt\` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (\`id\`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE \`Booking\` (
    \`id\` VARCHAR(191) NOT NULL,
    \`studentId\` VARCHAR(191) NOT NULL,
    \`tutorId\` VARCHAR(191) NOT NULL,
    \`sessionTypeId\` VARCHAR(191) NOT NULL,
    \`status\` VARCHAR(191) NOT NULL DEFAULT 'PENDING_PAYMENT',
    \`createdAt\` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    \`updatedAt\` DATETIME(3) NOT NULL,

    PRIMARY KEY (\`id\`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE \`Session\` (
    \`id\` VARCHAR(191) NOT NULL,
    \`bookingId\` VARCHAR(191) NOT NULL,
    \`tutorId\` VARCHAR(191) NOT NULL,
    \`studentId\` VARCHAR(191) NOT NULL,
    \`calendlyEventUri\` VARCHAR(191) NULL,
    \`calendlyInviteeUri\` VARCHAR(191) NULL,
    \`scheduledAt\` DATETIME(3) NOT NULL,
    \`endTime\` DATETIME(3) NOT NULL,
    \`meetingUrl\` VARCHAR(191) NULL,
    \`cancelUrl\` VARCHAR(191) NULL,
    \`rescheduleUrl\` VARCHAR(191) NULL,
    \`status\` VARCHAR(191) NOT NULL DEFAULT 'SCHEDULED',
    \`tutorNotes\` TEXT NULL,
    \`studentFeedback\` TEXT NULL,
    \`createdAt\` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    \`updatedAt\` DATETIME(3) NOT NULL,

    UNIQUE INDEX \`Session_calendlyEventUri_key\`(\`calendlyEventUri\`),
    UNIQUE INDEX \`Session_calendlyInviteeUri_key\`(\`calendlyInviteeUri\`),
    PRIMARY KEY (\`id\`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE \`SessionHistory\` (
    \`id\` VARCHAR(191) NOT NULL,
    \`sessionId\` VARCHAR(191) NOT NULL,
    \`previousTime\` DATETIME(3) NULL,
    \`newTime\` DATETIME(3) NULL,
    \`action\` VARCHAR(191) NOT NULL,
    \`reason\` TEXT NULL,
    \`actorId\` VARCHAR(191) NULL,
    \`createdAt\` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (\`id\`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE \`StudentPackage\` (
    \`id\` VARCHAR(191) NOT NULL,
    \`studentId\` VARCHAR(191) NOT NULL,
    \`packageId\` VARCHAR(191) NOT NULL,
    \`totalSessions\` INTEGER NOT NULL,
    \`usedSessions\` INTEGER NOT NULL DEFAULT 0,
    \`remainingSessions\` INTEGER NOT NULL,
    \`expiresAt\` DATETIME(3) NOT NULL,
    \`status\` VARCHAR(191) NOT NULL DEFAULT 'ACTIVE',
    \`createdAt\` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    \`updatedAt\` DATETIME(3) NOT NULL,

    PRIMARY KEY (\`id\`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE \`StudentSessionBalance\` (
    \`id\` VARCHAR(191) NOT NULL,
    \`studentId\` VARCHAR(191) NOT NULL,
    \`sessionTypeId\` VARCHAR(191) NOT NULL,
    \`balance\` INTEGER NOT NULL DEFAULT 0,

    UNIQUE INDEX \`StudentSessionBalance_studentId_sessionTypeId_key\`(\`studentId\`, \`sessionTypeId\`),
    PRIMARY KEY (\`id\`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE \`SessionBalanceTransaction\` (
    \`id\` VARCHAR(191) NOT NULL,
    \`balanceId\` VARCHAR(191) NOT NULL,
    \`amount\` INTEGER NOT NULL,
    \`reason\` VARCHAR(191) NOT NULL,
    \`relatedEntityId\` VARCHAR(191) NULL,
    \`createdAt\` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (\`id\`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE \`CalendlyConnection\` (
    \`id\` VARCHAR(191) NOT NULL,
    \`tutorId\` VARCHAR(191) NOT NULL,
    \`accessToken\` TEXT NULL,
    \`refreshToken\` TEXT NULL,
    \`userUri\` VARCHAR(191) NULL,
    \`schedulingUrl\` VARCHAR(191) NULL,
    \`isActive\` BOOLEAN NOT NULL DEFAULT true,
    \`lastSyncAt\` DATETIME(3) NULL,

    UNIQUE INDEX \`CalendlyConnection_tutorId_key\`(\`tutorId\`),
    PRIMARY KEY (\`id\`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE \`CalendlyEventType\` (
    \`id\` VARCHAR(191) NOT NULL,
    \`connectionId\` VARCHAR(191) NOT NULL,
    \`uri\` VARCHAR(191) NOT NULL,
    \`name\` VARCHAR(191) NOT NULL,
    \`duration\` INTEGER NOT NULL,
    \`activeOnPlatform\` BOOLEAN NOT NULL DEFAULT false,

    UNIQUE INDEX \`CalendlyEventType_uri_key\`(\`uri\`),
    PRIMARY KEY (\`id\`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE \`WebhookEvent\` (
    \`id\` VARCHAR(191) NOT NULL,
    \`source\` VARCHAR(191) NOT NULL,
    \`eventId\` VARCHAR(191) NOT NULL,
    \`eventType\` VARCHAR(191) NOT NULL,
    \`payload\` LONGTEXT NOT NULL,
    \`status\` VARCHAR(191) NOT NULL DEFAULT 'PENDING',
    \`error\` TEXT NULL,
    \`createdAt\` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    \`updatedAt\` DATETIME(3) NOT NULL,

    UNIQUE INDEX \`WebhookEvent_eventId_key\`(\`eventId\`),
    PRIMARY KEY (\`id\`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE \`TutorEarning\` (
    \`id\` VARCHAR(191) NOT NULL,
    \`tutorId\` VARCHAR(191) NOT NULL,
    \`sessionId\` VARCHAR(191) NULL,
    \`amount\` DOUBLE NOT NULL,
    \`platformFee\` DOUBLE NOT NULL,
    \`netEarning\` DOUBLE NOT NULL,
    \`status\` VARCHAR(191) NOT NULL DEFAULT 'PENDING',
    \`payoutId\` VARCHAR(191) NULL,
    \`createdAt\` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    \`updatedAt\` DATETIME(3) NOT NULL,

    UNIQUE INDEX \`TutorEarning_sessionId_key\`(\`sessionId\`),
    PRIMARY KEY (\`id\`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE \`TutorPayout\` (
    \`id\` VARCHAR(191) NOT NULL,
    \`tutorId\` VARCHAR(191) NOT NULL,
    \`amount\` DOUBLE NOT NULL,
    \`status\` VARCHAR(191) NOT NULL DEFAULT 'PROCESSING',
    \`referenceId\` VARCHAR(191) NULL,
    \`createdAt\` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    \`updatedAt\` DATETIME(3) NOT NULL,

    PRIMARY KEY (\`id\`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE \`Notification\` (
    \`id\` VARCHAR(191) NOT NULL,
    \`userId\` VARCHAR(191) NOT NULL,
    \`type\` VARCHAR(191) NOT NULL,
    \`title\` VARCHAR(191) NOT NULL,
    \`message\` TEXT NOT NULL,
    \`isRead\` BOOLEAN NOT NULL DEFAULT false,
    \`relatedId\` VARCHAR(191) NULL,
    \`createdAt\` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (\`id\`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE \`ActivityLog\` (
    \`id\` VARCHAR(191) NOT NULL,
    \`actorId\` VARCHAR(191) NULL,
    \`action\` VARCHAR(191) NOT NULL,
    \`entityType\` VARCHAR(191) NOT NULL,
    \`entityId\` VARCHAR(191) NOT NULL,
    \`oldValue\` TEXT NULL,
    \`newValue\` TEXT NULL,
    \`createdAt\` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (\`id\`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE \`PlatformSetting\` (
    \`id\` VARCHAR(191) NOT NULL,
    \`key\` VARCHAR(191) NOT NULL,
    \`value\` TEXT NOT NULL,
    \`description\` VARCHAR(191) NULL,
    \`updatedAt\` DATETIME(3) NOT NULL,

    UNIQUE INDEX \`PlatformSetting_key_key\`(\`key\`),
    PRIMARY KEY (\`id\`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE \`ContactMessage\` (
    \`id\` VARCHAR(191) NOT NULL,
    \`name\` VARCHAR(191) NOT NULL,
    \`email\` VARCHAR(191) NOT NULL,
    \`studyPreference\` VARCHAR(191) NOT NULL,
    \`message\` TEXT NOT NULL,
    \`createdAt\` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    \`status\` VARCHAR(191) NOT NULL DEFAULT 'UNREAD',

    PRIMARY KEY (\`id\`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE \`BlogPost\` (
    \`id\` VARCHAR(191) NOT NULL,
    \`title\` VARCHAR(191) NOT NULL,
    \`slug\` VARCHAR(191) NOT NULL,
    \`content\` LONGTEXT NOT NULL,
    \`excerpt\` TEXT NULL,
    \`coverImage\` VARCHAR(191) NULL,
    \`published\` BOOLEAN NOT NULL DEFAULT false,
    \`authorId\` VARCHAR(191) NOT NULL,
    \`tags\` VARCHAR(191) NULL,
    \`createdAt\` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    \`updatedAt\` DATETIME(3) NOT NULL,

    UNIQUE INDEX \`BlogPost_slug_key\`(\`slug\`),
    PRIMARY KEY (\`id\`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE \`SeoMetadata\` (
    \`id\` VARCHAR(191) NOT NULL,
    \`pagePath\` VARCHAR(191) NOT NULL,
    \`title\` VARCHAR(191) NOT NULL,
    \`description\` TEXT NULL,
    \`keywords\` VARCHAR(191) NULL,
    \`ogImage\` VARCHAR(191) NULL,
    \`createdAt\` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    \`updatedAt\` DATETIME(3) NOT NULL,

    UNIQUE INDEX \`SeoMetadata_pagePath_key\`(\`pagePath\`),
    PRIMARY KEY (\`id\`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE \`Account\` ADD CONSTRAINT \`Account_userId_fkey\` FOREIGN KEY (\`userId\`) REFERENCES \`User\`(\`id\`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE \`Session_NextAuth\` ADD CONSTRAINT \`Session_NextAuth_userId_fkey\` FOREIGN KEY (\`userId\`) REFERENCES \`User\`(\`id\`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE \`TutorSpecialization\` ADD CONSTRAINT \`TutorSpecialization_tutorId_fkey\` FOREIGN KEY (\`tutorId\`) REFERENCES \`User\`(\`id\`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE \`TutorSpecialization\` ADD CONSTRAINT \`TutorSpecialization_specializationId_fkey\` FOREIGN KEY (\`specializationId\`) REFERENCES \`Specialization\`(\`id\`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE \`TutorSessionType\` ADD CONSTRAINT \`TutorSessionType_tutorId_fkey\` FOREIGN KEY (\`tutorId\`) REFERENCES \`User\`(\`id\`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE \`TutorSessionType\` ADD CONSTRAINT \`TutorSessionType_sessionTypeId_fkey\` FOREIGN KEY (\`sessionTypeId\`) REFERENCES \`SessionType\`(\`id\`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE \`PackageSessionType\` ADD CONSTRAINT \`PackageSessionType_packageId_fkey\` FOREIGN KEY (\`packageId\`) REFERENCES \`Package\`(\`id\`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE \`PackageSessionType\` ADD CONSTRAINT \`PackageSessionType_sessionTypeId_fkey\` FOREIGN KEY (\`sessionTypeId\`) REFERENCES \`SessionType\`(\`id\`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE \`Order\` ADD CONSTRAINT \`Order_studentId_fkey\` FOREIGN KEY (\`studentId\`) REFERENCES \`User\`(\`id\`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE \`Order\` ADD CONSTRAINT \`Order_packageId_fkey\` FOREIGN KEY (\`packageId\`) REFERENCES \`Package\`(\`id\`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE \`Order\` ADD CONSTRAINT \`Order_bookingId_fkey\` FOREIGN KEY (\`bookingId\`) REFERENCES \`Booking\`(\`id\`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE \`Payment\` ADD CONSTRAINT \`Payment_orderId_fkey\` FOREIGN KEY (\`orderId\`) REFERENCES \`Order\`(\`id\`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE \`Payment\` ADD CONSTRAINT \`Payment_studentId_fkey\` FOREIGN KEY (\`studentId\`) REFERENCES \`User\`(\`id\`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE \`PaymentTransaction\` ADD CONSTRAINT \`PaymentTransaction_paymentId_fkey\` FOREIGN KEY (\`paymentId\`) REFERENCES \`Payment\`(\`id\`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE \`Booking\` ADD CONSTRAINT \`Booking_studentId_fkey\` FOREIGN KEY (\`studentId\`) REFERENCES \`User\`(\`id\`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE \`Booking\` ADD CONSTRAINT \`Booking_tutorId_fkey\` FOREIGN KEY (\`tutorId\`) REFERENCES \`User\`(\`id\`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE \`Booking\` ADD CONSTRAINT \`Booking_sessionTypeId_fkey\` FOREIGN KEY (\`sessionTypeId\`) REFERENCES \`SessionType\`(\`id\`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE \`Session\` ADD CONSTRAINT \`Session_bookingId_fkey\` FOREIGN KEY (\`bookingId\`) REFERENCES \`Booking\`(\`id\`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE \`Session\` ADD CONSTRAINT \`Session_tutorId_fkey\` FOREIGN KEY (\`tutorId\`) REFERENCES \`User\`(\`id\`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE \`Session\` ADD CONSTRAINT \`Session_studentId_fkey\` FOREIGN KEY (\`studentId\`) REFERENCES \`User\`(\`id\`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE \`SessionHistory\` ADD CONSTRAINT \`SessionHistory_sessionId_fkey\` FOREIGN KEY (\`sessionId\`) REFERENCES \`Session\`(\`id\`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE \`StudentPackage\` ADD CONSTRAINT \`StudentPackage_studentId_fkey\` FOREIGN KEY (\`studentId\`) REFERENCES \`User\`(\`id\`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE \`StudentPackage\` ADD CONSTRAINT \`StudentPackage_packageId_fkey\` FOREIGN KEY (\`packageId\`) REFERENCES \`Package\`(\`id\`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE \`StudentSessionBalance\` ADD CONSTRAINT \`StudentSessionBalance_studentId_fkey\` FOREIGN KEY (\`studentId\`) REFERENCES \`User\`(\`id\`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE \`StudentSessionBalance\` ADD CONSTRAINT \`StudentSessionBalance_sessionTypeId_fkey\` FOREIGN KEY (\`sessionTypeId\`) REFERENCES \`SessionType\`(\`id\`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE \`SessionBalanceTransaction\` ADD CONSTRAINT \`SessionBalanceTransaction_balanceId_fkey\` FOREIGN KEY (\`balanceId\`) REFERENCES \`StudentSessionBalance\`(\`id\`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE \`CalendlyConnection\` ADD CONSTRAINT \`CalendlyConnection_tutorId_fkey\` FOREIGN KEY (\`tutorId\`) REFERENCES \`User\`(\`id\`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE \`CalendlyEventType\` ADD CONSTRAINT \`CalendlyEventType_connectionId_fkey\` FOREIGN KEY (\`connectionId\`) REFERENCES \`CalendlyConnection\`(\`id\`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE \`TutorEarning\` ADD CONSTRAINT \`TutorEarning_tutorId_fkey\` FOREIGN KEY (\`tutorId\`) REFERENCES \`User\`(\`id\`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE \`TutorEarning\` ADD CONSTRAINT \`TutorEarning_payoutId_fkey\` FOREIGN KEY (\`payoutId\`) REFERENCES \`TutorPayout\`(\`id\`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE \`TutorPayout\` ADD CONSTRAINT \`TutorPayout_tutorId_fkey\` FOREIGN KEY (\`tutorId\`) REFERENCES \`User\`(\`id\`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE \`Notification\` ADD CONSTRAINT \`Notification_userId_fkey\` FOREIGN KEY (\`userId\`) REFERENCES \`User\`(\`id\`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE \`ActivityLog\` ADD CONSTRAINT \`ActivityLog_actorId_fkey\` FOREIGN KEY (\`actorId\`) REFERENCES \`User\`(\`id\`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE \`BlogPost\` ADD CONSTRAINT \`BlogPost_authorId_fkey\` FOREIGN KEY (\`authorId\`) REFERENCES \`User\`(\`id\`) ON DELETE RESTRICT ON UPDATE CASCADE;

`;
  
  const statements = queries.split(';');
  for (let statement of statements) {
    if (statement.trim()) {
      console.log('Executing:', statement.trim().substring(0, 50) + '...');
      try {
        await connection.query(statement);
      } catch (err) {
        console.error("Error executing statement:", err.message);
      }
    }
  }
  
  console.log('Migration complete!');
  process.exit(0);
}

migrate();
