import { config } from "dotenv";
config({ path: ".env.local" });

import { eq } from "drizzle-orm";

async function createAdmin() {
  const { auth } = await import("../lib/auth");
  const { db } = await import("./index");
  const { user, account } = await import("./schema");
  const { hashPassword } = await import("better-auth/crypto");

  const args = process.argv.slice(2);
  const email = args[0] || process.env.ADMIN_EMAIL || "admin@cafe.com";
  const password = args[1] || process.env.ADMIN_PASSWORD || "admin123";
  const name = args[2] || process.env.ADMIN_NAME || "Admin User";

  console.log("==========================================");
  console.log(" Creating/Updating Admin for MalomoKopi POS");
  console.log("==========================================");
  console.log(`Email    : ${email}`);
  console.log(`Name     : ${name}`);
  console.log(`Password : ${"*".repeat(password.length)}`);
  console.log("------------------------------------------");

  try {
    // Check if user already exists
    const existingUser = await db.select().from(user).where(eq(user.email, email));

    if (existingUser.length > 0) {
      console.log(`ℹ️ User with email "${email}" already exists.`);
      console.log(`ID: ${existingUser[0].id}, Current Name: ${existingUser[0].name}`);
      console.log("Updating credentials and resetting password...");

      const hashedPassword = await hashPassword(password);

      // Update user details
      await db
        .update(user)
        .set({
          name,
          emailVerified: true,
          updatedAt: new Date(),
        })
        .where(eq(user.id, existingUser[0].id));

      // Check if account row exists
      const existingAccount = await db
        .select()
        .from(account)
        .where(eq(account.userId, existingUser[0].id));

      if (existingAccount.length > 0) {
        await db
          .update(account)
          .set({
            password: hashedPassword,
            updatedAt: new Date(),
          })
          .where(eq(account.userId, existingUser[0].id));
      } else {
        await db.insert(account).values({
          id: crypto.randomUUID(),
          accountId: existingUser[0].id,
          providerId: "credential",
          userId: existingUser[0].id,
          password: hashedPassword,
          createdAt: new Date(),
          updatedAt: new Date(),
        });
      }

      console.log("✅ Admin user credentials updated successfully!");
      console.log("User ID   :", existingUser[0].id);
      console.log("User Email:", email);
      console.log("User Name :", name);
      console.log("Password  : updated to specified password");
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

    if (res?.user?.id) {
      await db
        .update(user)
        .set({ emailVerified: true })
        .where(eq(user.id, res.user.id));
    }

    console.log("✅ Admin user created successfully!");
    console.log("User ID   :", res.user.id);
    console.log("User Email:", res.user.email);
    console.log("User Name :", res.user.name);
    process.exit(0);
  } catch (error: any) {
    console.error("❌ Failed to create/update admin user:", error.message || error);
    process.exit(1);
  }
}

createAdmin();
