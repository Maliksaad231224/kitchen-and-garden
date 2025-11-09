# Kitchen & Garden - Admin Setup Guide

## Backend Architecture

This project uses:
- **Turso Database** (LibSQL) - SQLite-based serverless database
- **NextAuth.js** - Authentication for admin users
- **Next.js API Routes** - RESTful backend API

## Database Schema

### Posts Table
```sql
CREATE TABLE IF NOT EXISTS posts (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  title TEXT NOT NULL,
  excerpt TEXT,
  content TEXT,
  image TEXT,
  author TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
```

### Admins Table
```sql
CREATE TABLE IF NOT EXISTS admins (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  username TEXT NOT NULL UNIQUE,
  password_hash TEXT NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
```

## Environment Variables

Create a `.env.local` file with:

```bash
# Turso Database Configuration
TURSO_CONNECTION_URL=libsql://your-database.turso.io
TURSO_AUTH_TOKEN=your-auth-token

# NextAuth Configuration
NEXTAUTH_SECRET=your-super-secret-key-change-in-production
NEXTAUTH_URL=http://localhost:3000

# Admin Credentials
ADMIN_USERNAME=admin
ADMIN_PASSWORD_HASH=will-be-generated
```

## Initial Setup

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Create default admin user:**
   ```bash
   npm run setup
   ```
   This will:
   - Create database tables if they don't exist
   - Create a default admin user with credentials:
     - Username: `admin`
     - Password: `admin123`

3. **Start development server:**
   ```bash
   npm run dev
   ```
   Visit http://localhost:3000

## Admin Features

### Login to Admin Dashboard
1. Go to http://localhost:3000/admin/login
2. Enter credentials:
   - Username: `admin`
   - Password: `admin123`
3. You'll be redirected to http://localhost:3000/admin/dashboard

### Create a New Post
1. Click "New Post" button
2. Fill in:
   - **Title** (required)
   - **Excerpt** (optional) - Brief summary of the post
   - **Content** (optional) - Full post content
   - **Image URL** (optional) - Path to image, e.g., `/image.jpg`
   - **Author** (optional) - Author name, defaults to logged-in username
3. Click "Save Post"

### Edit a Post
1. On dashboard, find the post you want to edit
2. Click "Edit" button
3. Modify the fields
4. Click "Save Post"

### Delete a Post
1. On dashboard, find the post to delete
2. Click "Delete" button
3. Confirm deletion

### View Published Posts
Published posts appear on:
- `/blog` - Blog page with all published posts

## API Endpoints

### Get All Posts
```bash
GET /api/posts
Response: Array of posts
```

### Create a Post (requires authentication)
```bash
POST /api/posts
Body: {
  "title": "Post Title",
  "excerpt": "Brief excerpt",
  "content": "Full content",
  "image": "/image.jpg",
  "author": "Author Name"
}
```

### Get Single Post
```bash
GET /api/posts/[id]
Response: Single post object
```

### Update a Post (requires authentication)
```bash
PUT /api/posts/[id]
Body: {
  "title": "Updated Title",
  "excerpt": "Updated excerpt",
  "content": "Updated content",
  "image": "/image.jpg",
  "author": "Updated author"
}
```

### Delete a Post (requires authentication)
```bash
DELETE /api/posts?id=[id]
```

## Security Notes

⚠️ **Before deploying to production:**

1. **Change the default admin password:**
   - Login to admin dashboard
   - Update the password in the database directly (use bcryptjs to hash)

2. **Generate a new NEXTAUTH_SECRET:**
   ```bash
   openssl rand -base64 32
   ```

3. **Update NEXTAUTH_URL:**
   - Set to your production domain
   - Example: `https://yourdomain.com`

4. **Use environment variables:**
   - Never hardcode secrets in code
   - Use production environment secrets in your hosting provider

5. **Enable HTTPS:**
   - NextAuth requires HTTPS in production

## Troubleshooting

### Database Connection Issues
- Verify TURSO_CONNECTION_URL and TURSO_AUTH_TOKEN
- Check that your Turso database is active
- Run the setup command to initialize tables

### Authentication Issues
- Clear browser cookies
- Check NEXTAUTH_SECRET is set
- Verify admin user exists in database

### Posts Not Showing
- Check that posts exist in database
- Verify `/api/posts` endpoint returns data
- Check browser console for errors

## File Structure

```
src/
├── app/
│   ├── api/
│   │   ├── auth/[...nextauth]/route.ts    # Authentication
│   │   └── posts/
│   │       ├── route.ts                   # GET/POST posts
│   │       └── [id]/route.ts              # GET/PUT/DELETE single post
│   ├── admin/
│   │   ├── login/page.tsx                 # Login page
│   │   └── dashboard/page.tsx             # Admin dashboard
│   ├── blog/page.tsx                      # Blog page (fetches from DB)
│   └── layout.tsx                         # Root layout with AuthProvider
├── components/
│   └── AuthProvider.tsx                   # NextAuth session provider
├── lib/
│   └── db.ts                              # Turso database utilities
└── types/
    └── next-auth.d.ts                     # NextAuth type definitions
```

## Next Steps

- Customize the admin dashboard UI
- Add more fields to posts (e.g., tags, categories)
- Implement user roles (editor, contributor, etc.)
- Add image upload functionality
- Implement post scheduling
- Add comment functionality
