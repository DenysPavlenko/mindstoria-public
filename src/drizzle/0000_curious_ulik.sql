CREATE TABLE `logs` (
	`id` text PRIMARY KEY NOT NULL,
	`timestamp` text NOT NULL,
	`values` text NOT NULL
);
--> statement-breakpoint
CREATE TABLE `med_logs` (
	`id` text PRIMARY KEY NOT NULL,
	`medId` text NOT NULL,
	`dosage` integer NOT NULL,
	`timestamp` text NOT NULL
);
--> statement-breakpoint
CREATE TABLE `sleep_logs` (
	`id` text PRIMARY KEY NOT NULL,
	`quality` integer NOT NULL,
	`timestamp` text NOT NULL
);
