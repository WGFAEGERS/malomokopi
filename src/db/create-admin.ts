import { config } from "dotenv";
config({ path: ".env.local" });

import { eq } from "drizzle-orm";

async function createAdmin() {
  const { auth } = await import("../lib/auth");
  const { db } = await import("./index");
  const { user } = await import("./schema");

  const args = process.argv.slice(2);
  const email = args[0] || process.env.ADMIN_EMAIL || "admin@cafe.com";
  const password = args[1] || process.env.ADMIN_PASSWORD || "admin123";
  const name = args[2] || process.env.ADMIN_NAME || "Admin User";

  console.log("==========================================");
  console.log(" Creating Admin User for MalomoKopi POS");
  console.log("==========================================");
  console.log(`Email    : ${email}`);
  console.log(`Name     : ${name}`);
  console.log(`Password : ${"*".repeat(password.length)}`);
  console.log("------------------------------------------");

  try {
    // Check if user already exists
    const existingUser = await db.select().from(user).where(eq(user.email, email));

    if (existingUser.length > 0) {
      console.log(`⚠️ User with email "${email}" already exists!`);
      console.log(`ID: ${existingUser[0].id}, Name: ${existingUser[0].name}`);
      process.exit(0);
    }

    // Register user via Better Auth server API
    const res = await auth.api.signUpEmail({
      body: {
        email,
        password,
        name,
      },
    });

    console.log("✅ Admin user created successfully!");
    console.log("User ID   :", res.user.id);
    console.log("User Email:", res.user.email);
    console.log("User Name :", res.user.name);
    process.exit(0);
  } catch (error: any) {
    console.error("❌ Failed to create admin user:", error.message || error);
    process.exit(1);
  }
}

createAdmin();
