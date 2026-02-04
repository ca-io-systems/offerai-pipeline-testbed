import { db } from "./schema";
import { hashPassword } from "../auth/password";

export async function seedUsers() {
  const existingUsers = db.prepare("SELECT COUNT(*) as count FROM users").get() as { count: number };
  
  if (existingUsers.count > 0) {
    console.log("Users already seeded, skipping...");
    return;
  }

  const testUsers = [
    { email: "john@example.com", password: "password123", name: "John Doe" },
    { email: "jane@example.com", password: "password123", name: "Jane Smith" },
    { email: "test@example.com", password: "testpassword", name: "Test User" },
  ];

  const stmt = db.prepare("INSERT INTO users (email, password, name) VALUES (?, ?, ?)");

  for (const user of testUsers) {
    const hashedPassword = await hashPassword(user.password);
    stmt.run(user.email, hashedPassword, user.name);
    console.log(`Seeded user: ${user.email}`);
  }

  console.log("Seeding completed!");
}

if (import.meta.main) {
  await seedUsers();
}
