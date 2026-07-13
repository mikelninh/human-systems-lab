CREATE TABLE `leads` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`role` text NOT NULL,
	`name` text NOT NULL,
	`email` text NOT NULL,
	`organisation` text DEFAULT '' NOT NULL,
	`cause` text DEFAULT '' NOT NULL,
	`interest` text DEFAULT '' NOT NULL,
	`budget` text DEFAULT '' NOT NULL,
	`message` text DEFAULT '' NOT NULL,
	`created_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL
);
