# Kitchen & Garden - Quick Start Guide

## 🚀 Getting Started

### 1. Install Dependencies
```bash
npm install
```

### 2. Set Up Database (First Time Only)
The project is already configured with Turso. The `.env.local` file contains your connection credentials.

To initialize the database and create the default admin user:
```bash
npm run setup
```

This will:
- Create `posts` table
- Create `admins` table
- Create default admin user with credentials:
  - **Username**: `admin`
  - **Password**: `admin123`

### 3. Start Development Server
```bash
npm run dev
```

Visit: http://localhost:3000

### 4. Access Admin Dashboard
- Go to: http://localhost:3000/admin/login
- Login with:
  - **Username**: `admin`
  - **Password**: `admin123`
- Create posts to publish on your blog

## 📋 Admin Dashboard Features

### Create a Post
1. Click "New Post"
2. Fill in the form:
   - **Title** - Name of your recipe/post
   - **Excerpt** - Brief description
   - **Content** - Full recipe details
   - **Image URL** - Path like `/image.jpg`
   - **Author** - Your name (optional)
3. Click "Save Post"

### View Posts
- All posts appear on http://localhost:3000/blog
- Posts are sorted by creation date (newest first)

### Edit/Delete Posts
- Dashboard shows all posts
- Click "Edit" to update a post
- Click "Delete" to remove a post

## 🏗️ Project Structure

```
src/
├── app/
│   ├── api/
│   │   ├── auth/[...nextauth]/route.ts    # Login authentication
│   │   └── posts/
│   │       ├── route.ts                   # GET all posts, POST new post
│   │       └── [id]/route.ts              # GET/PUT/DELETE single post
│   ├── admin/
│   │   ├── login/page.tsx                 # Admin login page
│   │   └── dashboard/page.tsx             # Admin dashboard
│   ├── blog/page.tsx                      # Public blog page
│   ├── page.tsx                           # Home page
│   └── layout.tsx                         # Root layout
├── components/
│   ├── AuthProvider.tsx                   # NextAuth provider
│   ├── Header.tsx                         # Navigation header
│   ├── Footer.tsx                         # Footer
│   └── ...other components
├── lib/
│   └── db.ts                              # Turso database utilities
└── styles/
    └── globals.css                        # Global Tailwind CSS
```

## 🔐 Security Tips

⚠️ Before deploying to production:

1. **Change Default Password**
   - Login to admin dashboard
   - Update password in database

2. **Generate New NEXTAUTH_SECRET**
   ```bash
   openssl rand -base64 32
   ```
   Update in `.env.local`:
   ```
   NEXTAUTH_SECRET=your-new-secret-here
   ```

3. **Update NEXTAUTH_URL**
   Set to your production domain in `.env.local`:
   ```
   NEXTAUTH_URL=https://yourdomain.com
   ```

4. **Enable HTTPS**
   - Required for production
   - Use your hosting provider's SSL certificate

## 📦 Available Scripts

```bash
npm run dev      # Start development server (port 3000)
npm run build    # Build for production
npm start        # Start production server
npm run lint     # Run ESLint
npm run setup    # Initialize database and create admin user
```

## 🗄️ Database

- **Type**: Turso (LibSQL - serverless SQLite)
- **Connection**: Already configured in `.env.local`
- **Tables**:
  - `posts` - Blog posts
  - `admins` - Admin users

### Database Schema

**Posts Table:**
```sql
id              INTEGER PRIMARY KEY
title           TEXT NOT NULL
excerpt         TEXT
content         TEXT
image           TEXT
author          TEXT
created_at      DATETIME DEFAULT NOW
```

**Admins Table:**
```sql
id              INTEGER PRIMARY KEY
username        TEXT NOT NULL UNIQUE
password_hash   TEXT NOT NULL
created_at      DATETIME DEFAULT NOW
```

## 🌐 Routes

### Public Routes
- `/` - Home page with categories
- `/blog` - Blog page (shows all published posts)

### Admin Routes
- `/admin/login` - Admin login page
- `/admin/dashboard` - Admin dashboard (create/edit/delete posts)

### API Routes
- `GET /api/posts` - Get all posts
- `POST /api/posts` - Create new post (requires auth)
- `GET /api/posts/[id]` - Get single post
- `PUT /api/posts/[id]` - Update post (requires auth)
- `DELETE /api/posts?id=[id]` - Delete post (requires auth)
- `POST /api/auth/callback/credentials` - Login endpoint

## 🐛 Troubleshooting

**Posts not appearing?**
- Check `/api/posts` endpoint in browser
- Verify database connection works
- Check browser console for errors

**Can't login?**
- Run `npm run setup` to create admin user
- Check username/password are correct
- Clear browser cookies and try again

**Database errors?**
- Verify `.env.local` has correct credentials
- Check Turso dashboard for database status
- Run `npm run setup` to initialize tables

## 📚 Learn More

- [Next.js Documentation](https://nextjs.org/docs)
- [NextAuth.js Documentation](https://next-auth.js.org)
- [Turso Documentation](https://docs.turso.tech)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)

## 🎉 You're All Set!

Your admin dashboard is ready. Start creating posts and publishing your content!

For detailed admin setup information, see [ADMIN_SETUP.md](./ADMIN_SETUP.md)
