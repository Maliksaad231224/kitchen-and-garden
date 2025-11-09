import { createClient } from "@libsql/client";
import { hash } from "bcryptjs";
import * as fs from "fs";
import * as path from "path";

// Load .env.local file
const envPath = path.resolve(process.cwd(), ".env.local");
if (fs.existsSync(envPath)) {
  const envContent = fs.readFileSync(envPath, "utf-8");
  envContent.split("\n").forEach((line) => {
    const trimmed = line.trim();
    if (trimmed && !trimmed.startsWith("#")) {
      const [key, ...valueParts] = trimmed.split("=");
      const value = valueParts.join("=").replace(/^["']|["']$/g, "");
      if (key) {
        process.env[key] = value;
      }
    }
  });
}

const turso = createClient({
  url: process.env.TURSO_CONNECTION_URL,
  authToken: process.env.TURSO_AUTH_TOKEN,
});

async function setupAdmin() {
  try {
    console.log("Initializing database...");

    // Create posts table
    await turso.execute(`
      CREATE TABLE IF NOT EXISTS posts (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT NOT NULL,
        excerpt TEXT,
        content TEXT,
        image TEXT,
        author TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log("✓ Posts table created");

    // Create admins table
    await turso.execute(`
      CREATE TABLE IF NOT EXISTS admins (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT NOT NULL UNIQUE,
        password_hash TEXT NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log("✓ Admins table created");

    // Check if admin already exists
    const result = await turso.execute(
      "SELECT * FROM admins WHERE username = ?",
      ["admin"]
    );

    if (result.rows.length > 0) {
      console.log("✓ Admin user already exists");
      return;
    }

    // Hash the default password
    const hashedPassword = await hash("admin123", 10);

    // Create default admin user
    await turso.execute(
      "INSERT INTO admins (username, password_hash) VALUES (?, ?)",
      ["admin", hashedPassword]
    );

    console.log("✅ Setup completed successfully!");
    console.log("");
    console.log("Admin credentials:");
    console.log("  Username: admin");
    console.log("  Password: admin123");
    console.log("");
    console.log("Access admin panel at: http://localhost:3000/admin/login");
  } catch (error) {
    console.error("❌ Error during setup:", error);
    process.exit(1);
  }
}

setupAdmin();
