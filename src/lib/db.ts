import { createClient } from "@libsql/client";
import { hash, compare } from "bcryptjs";

const turso = createClient({
  url: process.env.TURSO_CONNECTION_URL!,
  authToken: process.env.TURSO_AUTH_TOKEN!,
});

export type Post = {
  id: number;
  title: string;
  excerpt: string | null;
  content: string | null;
  image: string | null;
  author: string | null;
  created_at: string;
};

export type Admin = {
  id: number;
  username: string;
  password_hash: string;
  created_at: string;
};

export type User = {
  id: number;
  username: string;
  password_hash?: string | null;
  created_at: string;
};

export type Comment = {
  id: number;
  post_id: number;
  user_id: number;
  username: string | null;
  content: string;
  created_at: string;
};

// Get all posts
export async function getAllPosts(): Promise<Post[]> {
  try {
    const result = await turso.execute("SELECT * FROM posts ORDER BY created_at DESC");
    return (result.rows as any[]).map((row) => ({
      id: row.id,
      title: row.title,
      excerpt: row.excerpt,
      content: row.content,
      image: row.image,
      author: row.author,
      created_at: row.created_at,
    }));
  } catch (error) {
    console.error("Error fetching posts:", error);
    return [];
  }
}

// Get a single post by ID
export async function getPostById(id: number): Promise<Post | null> {
  try {
    const result = await turso.execute(
      "SELECT * FROM posts WHERE id = ?",
      [id]
    );
    const row = (result.rows as any[])[0];
    if (!row) return null;

    return {
      id: row.id,
      title: row.title,
      excerpt: row.excerpt,
      content: row.content,
      image: row.image,
      author: row.author,
      created_at: row.created_at,
    };
  } catch (error) {
    console.error("Error fetching post:", error);
    return null;
  }
}

// Create a new post
export async function createPost(
  title: string,
  excerpt: string | null,
  content: string | null,
  image: string | null,
  author: string | null
): Promise<Post | null> {
  try {
    const result = await turso.execute(
      `INSERT INTO posts (title, excerpt, content, image, author) 
       VALUES (?, ?, ?, ?, ?) 
       RETURNING *`,
      [title, excerpt, content, image, author]
    );
    const row = (result.rows as any[])[0];
    if (!row) return null;

    return {
      id: row.id,
      title: row.title,
      excerpt: row.excerpt,
      content: row.content,
      image: row.image,
      author: row.author,
      created_at: row.created_at,
    };
  } catch (error) {
    console.error("Error creating post:", error);
    return null;
  }
}

// Update a post
export async function updatePost(
  id: number,
  title: string,
  excerpt: string | null,
  content: string | null,
  image: string | null,
  author: string | null
): Promise<Post | null> {
  try {
    const result = await turso.execute(
      `UPDATE posts 
       SET title = ?, excerpt = ?, content = ?, image = ?, author = ? 
       WHERE id = ? 
       RETURNING *`,
      [title, excerpt, content, image, author, id]
    );
    const row = (result.rows as any[])[0];
    if (!row) return null;

    return {
      id: row.id,
      title: row.title,
      excerpt: row.excerpt,
      content: row.content,
      image: row.image,
      author: row.author,
      created_at: row.created_at,
    };
  } catch (error) {
    console.error("Error updating post:", error);
    return null;
  }
}

// Delete a post
export async function deletePost(id: number): Promise<boolean> {
  try {
    await turso.execute("DELETE FROM posts WHERE id = ?", [id]);
    return true;
  } catch (error) {
    console.error("Error deleting post:", error);
    return false;
  }
}

// Get admin by username
export async function getAdminByUsername(username: string): Promise<Admin | null> {
  try {
    const result = await turso.execute("SELECT * FROM admins WHERE username = ?", [
      username,
    ]);
    const row = (result.rows as any[])[0];
    if (!row) return null;

    return {
      id: row.id,
      username: row.username,
      password_hash: row.password_hash,
      created_at: row.created_at,
    };
  } catch (error) {
    console.error("Error fetching admin:", error);
    return null;
  }
}

// Verify admin password
export async function verifyAdminPassword(
  username: string,
  password: string
): Promise<Admin | null> {
  try {
    const admin = await getAdminByUsername(username);
    if (!admin) {
      return null;
    }
    const isValid = await compare(password, admin.password_hash);
    if (!isValid) {
      return null;
    }
    return admin;
  } catch (error) {
    console.error("Error verifying admin password:", error);
    return null;
  }
}

// Create an admin user (for setup)
export async function createAdmin(
  username: string,
  password: string
): Promise<Admin | null> {
  try {
    const passwordHash = await hash(password, 10);
    const result = await turso.execute(
      "INSERT INTO admins (username, password_hash) VALUES (?, ?) RETURNING *",
      [username, passwordHash]
    );

    const row = (result.rows as any[])[0];
    if (!row) return null;

    return {
      id: row.id,
      username: row.username,
      password_hash: row.password_hash,
      created_at: row.created_at,
    };
  } catch (error) {
    console.error("Error creating admin:", error);
    return null;
  }
}

// User functions
export async function getUserByUsername(username: string): Promise<User | null> {
  try {
    const result = await turso.execute("SELECT * FROM users WHERE username = ?", [
      username,
    ]);
    const row = (result.rows as any[])[0];
    if (!row) return null;

    return {
      id: row.id,
      username: row.username,
      password_hash: row.password_hash,
      created_at: row.created_at,
    };
  } catch (error) {
    console.error("Error fetching user:", error);
    return null;
  }
}

export async function verifyUserPassword(
  username: string,
  password: string
): Promise<User | null> {
  try {
    const user = await getUserByUsername(username);
    if (!user) return null;
    if (!user.password_hash) return null;
    const isValid = await compare(password, user.password_hash as string);
    if (!isValid) return null;
    return user;
  } catch (error) {
    console.error("Error verifying user password:", error);
    return null;
  }
}

export async function createUser(
  username: string,
  password?: string
): Promise<User | null> {
  try {
    let passwordHash: string | null = null;
    if (password) {
      passwordHash = await hash(password, 10);
    }
    const result = await turso.execute(
      "INSERT INTO users (username, password_hash) VALUES (?, ?) RETURNING *",
      [username, passwordHash]
    );
    const row = (result.rows as any[])[0];
    if (!row) return null;

    return {
      id: row.id,
      username: row.username,
      password_hash: row.password_hash,
      created_at: row.created_at,
    };
  } catch (error) {
    console.error("Error creating user:", error);
    return null;
  }
}

export async function findOrCreateOAuthUser(username: string): Promise<User | null> {
  try {
    const existing = await getUserByUsername(username);
    if (existing) return existing;

    // create without password (oauth account)
    const result = await turso.execute(
      "INSERT INTO users (username, password_hash) VALUES (?, ?) RETURNING *",
      [username, null]
    );
    const row = (result.rows as any[])[0];
    if (!row) return null;

    return {
      id: row.id,
      username: row.username,
      password_hash: row.password_hash,
      created_at: row.created_at,
    };
  } catch (error) {
    console.error("Error creating oauth user:", error);
    return null;
  }
}

// Initialize database - create tables if they don't exist
export async function initializeDatabase(): Promise<void> {
  try {
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

    await turso.execute(`
      CREATE TABLE IF NOT EXISTS admins (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT NOT NULL UNIQUE,
        password_hash TEXT NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // users table for regular account holders
    await turso.execute(`
      CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT NOT NULL UNIQUE,
        password_hash TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // comments table
    await turso.execute(`
      CREATE TABLE IF NOT EXISTS comments (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        post_id INTEGER NOT NULL,
        user_id INTEGER NOT NULL,
        content TEXT NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY(post_id) REFERENCES posts(id),
        FOREIGN KEY(user_id) REFERENCES users(id)
      )
    `);

    console.log("Database initialized successfully");
  } catch (error) {
    console.error("Error initializing database:", error);
  }
}

// Comments accessors
export async function createComment(
  post_id: number,
  user_id: number,
  content: string
): Promise<Comment | null> {
  try {
    const result = await turso.execute(
      "INSERT INTO comments (post_id, user_id, content) VALUES (?, ?, ?) RETURNING *",
      [post_id, user_id, content]
    );
    const row = (result.rows as any[])[0];
    if (!row) return null;

    // Fetch username
    const user = await turso.execute("SELECT username FROM users WHERE id = ?", [
      user_id,
    ]);
    const userRow = (user.rows as any[])[0];

    return {
      id: row.id,
      post_id: row.post_id,
      user_id: row.user_id,
      username: userRow ? userRow.username : null,
      content: row.content,
      created_at: row.created_at,
    };
  } catch (error) {
    console.error("Error creating comment:", error);
    return null;
  }
}

export async function getCommentById(id: number): Promise<Comment | null> {
  try {
    const result = await turso.execute(
      `SELECT c.*, u.username FROM comments c LEFT JOIN users u ON c.user_id = u.id WHERE c.id = ?`,
      [id]
    );
    const row = (result.rows as any[])[0];
    if (!row) return null;

    return {
      id: row.id,
      post_id: row.post_id,
      user_id: row.user_id,
      username: row.username || null,
      content: row.content,
      created_at: row.created_at,
    };
  } catch (error) {
    console.error("Error fetching comment:", error);
    return null;
  }
}

export async function updateComment(
  id: number,
  content: string
): Promise<Comment | null> {
  try {
    const result = await turso.execute(
      `UPDATE comments SET content = ? WHERE id = ? RETURNING *`,
      [content, id]
    );
    const row = (result.rows as any[])[0];
    if (!row) return null;

    // fetch username
    const userRes = await turso.execute("SELECT username FROM users WHERE id = ?", [row.user_id]);
    const userRow = (userRes.rows as any[])[0];

    return {
      id: row.id,
      post_id: row.post_id,
      user_id: row.user_id,
      username: userRow ? userRow.username : null,
      content: row.content,
      created_at: row.created_at,
    };
  } catch (error) {
    console.error("Error updating comment:", error);
    return null;
  }
}

export async function deleteCommentById(id: number): Promise<boolean> {
  try {
    await turso.execute("DELETE FROM comments WHERE id = ?", [id]);
    return true;
  } catch (error) {
    console.error("Error deleting comment:", error);
    return false;
  }
}

export async function getCommentsByPostId(post_id: number): Promise<Comment[]> {
  try {
    const result = await turso.execute(
      `SELECT c.*, u.username FROM comments c JOIN users u ON c.user_id = u.id WHERE c.post_id = ? ORDER BY c.created_at ASC`,
      [post_id]
    );
    return (result.rows as any[]).map((row) => ({
      id: row.id,
      post_id: row.post_id,
      user_id: row.user_id,
      username: row.username,
      content: row.content,
      created_at: row.created_at,
    }));
  } catch (error) {
    console.error("Error fetching comments:", error);
    return [];
  }
}

export default turso;
