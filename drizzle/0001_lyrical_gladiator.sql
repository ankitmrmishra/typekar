CREATE TABLE `result` (
	`id` varchar(255) NOT NULL,
	`user_id` varchar(255) NOT NULL,
	`wpm` int NOT NULL,
	`accuracy` int NOT NULL,
	`typeingType` enum('10','30','70','200'),
	`dateOfSubmisson` date,
	`totaltime` float,
	CONSTRAINT `result_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
ALTER TABLE `result` ADD CONSTRAINT `result_user_id_user_id_fk` FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON DELETE no action ON UPDATE no action;