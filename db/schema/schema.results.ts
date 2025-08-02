// this here i am writing the schema for results
/**
 * the schema will consists of follwoing things
 * 1: who was the user
 * 2: wpm
 * 3: accuracy
 * 4: which type, [10,30,70,200]
 * 5: Date and time of submission
 * 6: time it took
 */

import {
  date,
  float,
  int,
  mysqlEnum,
  mysqlTable,
  varchar,
} from "drizzle-orm/mysql-core";
import { users } from "../schema";

export const results = mysqlTable("result", {
  id: varchar("id", { length: 255 })
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  userId: varchar("user_id", { length: 255 })
    .notNull()
    .references(() => users.id),
  wpm: int().notNull(),
  accuracy: int().notNull(),
  typeingType: mysqlEnum(["10", "30", "70", "200"]).notNull(),
  dateOfSubmisson: date().notNull(),
  totaltime: float().notNull(),
});
