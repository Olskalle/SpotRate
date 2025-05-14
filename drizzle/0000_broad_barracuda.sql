CREATE TABLE `marker_images` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`marker_id` integer,
	`uri` text NOT NULL,
	`created_at` text DEFAULT '2025-05-14T11:23:30.573Z',
	FOREIGN KEY (`marker_id`) REFERENCES `markers`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `markers` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`title` text NOT NULL,
	`description` text DEFAULT '' NOT NULL,
	`latitude` real NOT NULL,
	`longitude` real NOT NULL,
	`created_at` text DEFAULT '2025-05-14T11:23:30.572Z'
);
