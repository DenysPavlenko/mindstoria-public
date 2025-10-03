CREATE TABLE `entries` (
	`id` text PRIMARY KEY NOT NULL,
	`trackerId` text NOT NULL,
	`date` text NOT NULL,
	`createdAt` text NOT NULL,
	FOREIGN KEY (`trackerId`) REFERENCES `trackers`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `entry_values` (
	`entryId` text NOT NULL,
	`metricId` text NOT NULL,
	`valueString` text,
	`valueNumber` integer,
	`valueBoolean` integer,
	PRIMARY KEY(`entryId`, `metricId`),
	FOREIGN KEY (`entryId`) REFERENCES `entries`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`metricId`) REFERENCES `metrics`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `metrics` (
	`id` text PRIMARY KEY NOT NULL,
	`trackerId` text NOT NULL,
	`label` text NOT NULL,
	`type` integer NOT NULL,
	`config` text,
	`order` integer DEFAULT 0 NOT NULL,
	FOREIGN KEY (`trackerId`) REFERENCES `trackers`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `trackers` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`iconName` text NOT NULL,
	`description` text,
	`createdAt` text NOT NULL,
	`order` integer DEFAULT 0 NOT NULL
);
