CREATE TABLE `fairness_feedback` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`bottom_share` integer NOT NULL,
	`middle_share` integer NOT NULL,
	`top_share` integer NOT NULL,
	`stance` text NOT NULL,
	`comment` text NOT NULL,
	`email` text DEFAULT '' NOT NULL,
	`created_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL
);
