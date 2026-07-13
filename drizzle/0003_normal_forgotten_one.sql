CREATE TABLE `consensus_suggestions` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`issue` text NOT NULL,
	`cohort` text NOT NULL,
	`locale` text NOT NULL,
	`statement` text NOT NULL,
	`created_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL
);
--> statement-breakpoint
CREATE TABLE `consensus_votes` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`issue` text NOT NULL,
	`session_id` text NOT NULL,
	`statement_id` text NOT NULL,
	`cohort` text NOT NULL,
	`vote` text NOT NULL,
	`locale` text DEFAULT 'de' NOT NULL,
	`created_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `consensus_vote_session_statement` ON `consensus_votes` (`issue`,`session_id`,`statement_id`);