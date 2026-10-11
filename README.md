# Blog Platform

A full-stack blogging platform built with React, Node.js/Express, MongoDB, and TailwindCSS.

## Project Structure

```
Blog_platform/
├── client/          # React + Vite frontend
└── server/          # Express.js backend
```

## Prerequisites

- **Node.js** v18+ 
- **MongoDB** (local or MongoDB Atlas)

## Setup & Running

### 1. Start MongoDB

**Option A – Local MongoDB:**
```bash
# Windows (if MongoDB is installed)
net start MongoDB
# Or start from MongoDB Compass
```

**Option B – MongoDB Atlas (Cloud):**
1. Create a free cluster at [mongodb.com/atlas](https://www.mongodb.com/atlas)
2. Get your connection string
3. Update `server/.env`: `MONGO_URI=mongodb+srv://user:pass@cluster.mongodb.net/blogplatform`

### 2. Start the Backend Server

```bash
cd server
npm run dev
```
Server runs on: **http://localhost:5000**

### 3. Start the Frontend

```bash
cd client
npm run dev
```
Frontend runs on: **http://localhost:5173**

## Environment Variables

Edit `server/.env`:
```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/blogplatform
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production
JWT_EXPIRE=7d
```

## Features

- **Authentication**: Register, login, JWT-based session
- **Posts**: Create, read, edit, delete blog posts with tags
- **Comments**: Add, edit, delete comments on posts
- **Profile**: Edit bio, view your posts
- **Search**: Search posts by title/content
- **Pagination**: Posts paginated (10 per page)

## API Endpoints

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/api/auth/register` | No | Register user |
| POST | `/api/auth/login` | No | Login user |
| GET | `/api/auth/me` | Yes | Get current user |
| PUT | `/api/auth/profile` | Yes | Update profile/bio |
| GET | `/api/posts` | No | Get all posts |
| GET | `/api/posts/:id` | No | Get single post |
| POST | `/api/posts` | Yes | Create post |
| PUT | `/api/posts/:id` | Yes | Update post (author only) |
| DELETE | `/api/posts/:id` | Yes | Delete post (author only) |
| GET | `/api/comments/post/:postId` | No | Get post comments |
| POST | `/api/comments/post/:postId` | Yes | Add comment |
| PUT | `/api/comments/:id` | Yes | Edit comment (author only) |
| DELETE | `/api/comments/:id` | Yes | Delete comment (author only) |
