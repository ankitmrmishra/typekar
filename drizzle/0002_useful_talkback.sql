ALTER TABLE `result` MODIFY COLUMN `typeingType` enum('10','30','70','200') NOT NULL;--> statement-breakpoint
ALTER TABLE `result` MODIFY COLUMN `dateOfSubmisson` date NOT NULL;--> statement-breakpoint
ALTER TABLE `result` MODIFY COLUMN `totaltime` float NOT NULL;