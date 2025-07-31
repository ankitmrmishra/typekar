import { drizzle } from "drizzle-orm/mysql2";
import { seed } from "drizzle-seed";
import { usersTable } from "./schema";
async function main() {
  const db = drizzle(process.env.DATABASE_URL!);
  await seed(db, { usersTable });
}
main();
