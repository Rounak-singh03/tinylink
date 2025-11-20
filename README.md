# TinyLink - URL Shortener

TinyLink is a simple URL-shortening application similar to Bitly.  
Users can create short links, view click statistics, delete links, and visit a dedicated stats page.

## 🚀 Live Demo
https://tinylink-3.onrender.com/

## 🎥 Video Explanation
https://drive.google.com/file/d/1psTRJaKtqSEWIiG0Dg6tBDsKJ9O1G8RP/view?usp=sharing

## 📂 GitHub Repository
https://github.com/Rounak-singh03/tinylink

## 📌 Features
- Create short links
- Optional custom code support
- 302 redirect to original URL
- Auto-increment click count
- Shows last clicked timestamp
- Delete link
- Stats page for each code
- API-based clean architecture
- Deployed on Render with Neon PostgreSQL

## 🛠️ Tech Stack
- **Backend:** Node.js, Express.js
- **Database:** Neon PostgreSQL
- **Frontend:** HTML, CSS, JavaScript (Tailwind for styling)
- **Deployment:** Render (Server) + Neon (DB)

## 📡 API Endpoints

### Create Link
`POST /api/links`

### Get All Links
`GET /api/links`

### Get Link Stats
`GET /api/links/:code`

### Delete Link
`DELETE /api/links/:code`

### Redirect
`GET /:code` → Redirects to original URL

### Health Check
`GET /healthz`

## 📦 Folder Structure

