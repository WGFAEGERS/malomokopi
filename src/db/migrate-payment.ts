import { config } from "dotenv";
config({ path: ".env.local" });

import postgres from "postgres";

const sql = postgres(process.env.DATABASE_URL!);

async function migrate() {
  console.log("Starting payment migration...");

  // 1. Add 'awaiting_verification' to order_status enum
  try {
    await sql`ALTER TYPE order_status ADD VALUE IF NOT EXISTS 'awaiting_verification' AFTER 'pending'`;
    console.log("✅ Added 'awaiting_verification' to order_status enum");
  } catch (e: any) {
    if (e.message?.includes("already exists")) {
      console.log("⏭️  'awaiting_verification' already exists in enum, skipping");
    } else {
      console.error("❌ Failed to add enum value:", e.message);
    }
  }

  // 2. Add new columns to orders table
  const columns = [
    { name: "customer_name", type: "TEXT" },
    { name: "customer_phone", type: "TEXT" },
    { name: "table_number", type: "TEXT" },
    { name: "payment_proof_url", type: "TEXT" },
  ];

  for (const col of columns) {
    try {
      await sql.unsafe(
        `ALTER TABLE orders ADD COLUMN IF NOT EXISTS ${col.name} ${col.type}`
      );
      console.log(`✅ Added column '${col.name}'`);
    } catch (e: any) {
      if (e.message?.includes("already exists")) {
        console.log(`⏭️  Column '${col.name}' already exists, skipping`);
      } else {
        console.error(`❌ Failed to add column '${col.name}':`, e.message);
      }
    }
  }

  console.log("\n🎉 Payment migration complete!");
  await sql.end();
}

migrate().catch((e) => {
  console.error("Migration failed:", e);
  process.exit(1);
});
