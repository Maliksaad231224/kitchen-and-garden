import { hash } from "bcryptjs";
import turso, { initializeDatabase } from "@/lib/db";

async function setupAdmin() {
  try {
    // Initialize database first
    await initializeDatabase();

    // Check if admin already exists
    const result = await turso.execute(
      "SELECT * FROM admins WHERE username = ?",
      ["admin"]
    );

    if ((result.rows as any[]).length > 0) {
      console.log("Admin user already exists");
      return;
    }

    // Hash the default password
    const hashedPassword = await hash("admin123", 10);

    // Create default admin user
    await turso.execute(
      "INSERT INTO admins (username, password_hash) VALUES (?, ?)",
      ["admin", hashedPassword]
    );

    console.log("Admin user created successfully!");
    console.log("Username: admin");
    console.log("Password: admin123");
  } catch (error) {
    console.error("Error setting up admin:", error);
  }
}

// Run setup
setupAdmin();
