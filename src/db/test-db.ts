import { config } from "dotenv";
config({ path: ".env.local" });

import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";

async function testConnection() {
  const databaseUrl = process.env.DATABASE_URL;

  if (!databaseUrl) {
    console.error("❌ Error: DATABASE_URL is not defined in .env.local");
    process.exit(1);
  }

  console.log("Testing connection to Supabase...");
  console.log(`URL: ${databaseUrl.split('@')[1]}`); // Show only the host part for security

  const queryClient = postgres(databaseUrl);
  const db = drizzle(queryClient);

  try {
    const start = Date.now();
    // Simple query to test connection
    const result = await db.execute("SELECT 1 as connected");
    const end = Date.now();

    console.log("✅ Connection successful!");
    console.log(`⏱️ Latency: ${end - start}ms`);
    console.log("Result:", result);

    // Check if categories table exists by querying it
    console.log("\n--- Checking Categories ---");
    try {
      const allCategories = await db.execute("SELECT * FROM categories ORDER BY id ASC");
      console.log(`✅ Found ${allCategories.length} categories:`);
      allCategories.forEach((cat: any) => {
        console.log(`  - ID: ${cat.id}, Name: ${cat.name}`);
      });
    } catch (e: unknown) {
      console.warn("⚠️ Warning: Table 'categories' error.");
      if (e instanceof Error) console.error(e.message);
    }

    console.log("\n--- Checking Menu Items ---");
    try {
      const allMenuItems = await db.execute("SELECT * FROM menu_items ORDER BY id ASC");
      console.log(`✅ Found ${allMenuItems.length} menu items:`);
      allMenuItems.forEach((item: any) => {
        console.log(`  - ID: ${item.id}, Name: ${item.name}, Price: ${item.price}, Available: ${item.available}`);
      });
    } catch (e: unknown) {
      console.warn("⚠️ Warning: Table 'menu_items' error.");
      if (e instanceof Error) console.error(e.message);
    }
  } catch (error) {
    console.error("❌ Connection failed!");
    console.error("Error details:", error);
  } finally {
    await queryClient.end();
  }
}

testConnection();
