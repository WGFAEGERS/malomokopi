import { config } from "dotenv";
config({ path: ".env.local" });

import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { categories, menuItems } from "./schema";

if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL is not defined in .env.local");
}

const queryClient = postgres(process.env.DATABASE_URL);
const db = drizzle(queryClient);

const seedCategories = [
  { name: "Coffee" },
  { name: "Tea" },
  { name: "Pastries" },
  { name: "Sandwiches" },
  { name: "Smoothies" },
];

const seedProducts = [
  // Coffee (categoryId: 1)
  { name: "Espresso", price: 350, categoryId: 1, imageUrl: "https://images.unsplash.com/photo-1510707577719-ae7c14805e3a?w=400&h=300&fit=crop", available: true },
  { name: "Cappuccino", price: 450, categoryId: 1, imageUrl: "https://images.unsplash.com/photo-1572442388796-11668a67e53d?w=400&h=300&fit=crop", available: true },
  { name: "Latte", price: 500, categoryId: 1, imageUrl: "https://images.unsplash.com/photo-1461023058943-07fcbe16d735?w=400&h=300&fit=crop", available: true },
  { name: "Americano", price: 400, categoryId: 1, imageUrl: "https://images.unsplash.com/photo-1551030173-122aabc4489c?w=400&h=300&fit=crop", available: true },
  // Tea (categoryId: 2)
  { name: "Green Tea", price: 300, categoryId: 2, imageUrl: "https://images.unsplash.com/photo-1556881286-fc6915169721?w=400&h=300&fit=crop", available: true },
  { name: "Earl Grey", price: 350, categoryId: 2, imageUrl: "https://images.unsplash.com/photo-1597318181409-cf64d0b5d8a2?w=400&h=300&fit=crop", available: true },
  { name: "Chai Latte", price: 450, categoryId: 2, imageUrl: "https://images.unsplash.com/photo-1557006021-b85faa2bc5e2?w=400&h=300&fit=crop", available: true },
  { name: "Matcha Latte", price: 550, categoryId: 2, imageUrl: "https://images.unsplash.com/photo-1536256263959-770b48d82b0a?w=400&h=300&fit=crop", available: true },
  // Pastries (categoryId: 3)
  { name: "Croissant", price: 350, categoryId: 3, imageUrl: "https://images.unsplash.com/photo-1555507036-ab1f4038024a?w=400&h=300&fit=crop", available: true },
  { name: "Blueberry Muffin", price: 400, categoryId: 3, imageUrl: "https://images.unsplash.com/photo-1607958996333-41aef7caefaa?w=400&h=300&fit=crop", available: true },
  { name: "Chocolate Cake", price: 550, categoryId: 3, imageUrl: "https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=400&h=300&fit=crop", available: true },
  { name: "Cinnamon Roll", price: 450, categoryId: 3, imageUrl: "https://images.unsplash.com/photo-1509365390695-33aee754301f?w=400&h=300&fit=crop", available: true },
  // Sandwiches (categoryId: 4)
  { name: "Club Sandwich", price: 750, categoryId: 4, imageUrl: "https://images.unsplash.com/photo-1528735602780-2552fd46c7af?w=400&h=300&fit=crop", available: true },
  { name: "Grilled Cheese", price: 600, categoryId: 4, imageUrl: "https://images.unsplash.com/photo-1528736235302-52922df5c122?w=400&h=300&fit=crop", available: true },
  { name: "BLT Sandwich", price: 700, categoryId: 4, imageUrl: "https://images.unsplash.com/photo-1619096252214-ef06c45683e3?w=400&h=300&fit=crop", available: true },
  { name: "Chicken Wrap", price: 650, categoryId: 4, imageUrl: "https://images.unsplash.com/photo-1626700051175-6818013e1d4f?w=400&h=300&fit=crop", available: true },
  // Smoothies (categoryId: 5)
  { name: "Mango Smoothie", price: 550, categoryId: 5, imageUrl: "https://images.unsplash.com/photo-1623065422902-30a2d299bbe4?w=400&h=300&fit=crop", available: true },
  { name: "Berry Blast", price: 600, categoryId: 5, imageUrl: "https://images.unsplash.com/photo-1553530666-ba11a7da3888?w=400&h=300&fit=crop", available: true },
  { name: "Banana Smoothie", price: 500, categoryId: 5, imageUrl: "https://images.unsplash.com/photo-1638176066666-ffb2f013c7dd?w=400&h=300&fit=crop", available: true },
  { name: "Avocado Smoothie", price: 650, categoryId: 5, imageUrl: "https://images.unsplash.com/photo-1638176066666-ffb2f013c7dd?w=400&h=300&fit=crop", available: true },
];

async function seed() {
  try {
    console.log("Seeding categories...");
    await db.insert(categories).values(seedCategories);

    console.log("Seeding 20 products...");
    await db.insert(menuItems).values(seedProducts);

    console.log("Done! Inserted 5 categories and 20 products.");
  } catch (error) {
    console.error("Error during seeding:", error);
  } finally {
    await queryClient.end();
  }
}

seed();
