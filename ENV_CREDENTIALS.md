# i-VANTAGE - Complete Environment Variables & Credentials Reference

This file contains all extracted environment variables, database connection strings, Cloudinary credentials, and authentication secrets for the i-VANTAGE project.

---

## 1. ☁️ Cloudinary Credentials (Asset & Media Storage)

Used for uploading blog cover images, author avatars, service icons, and admin media library assets.

```env
CLOUDINARY_CLOUD_NAME=dfldlh0xd
CLOUDINARY_API_KEY=771348431174726
CLOUDINARY_API_SECRET=0K6N-dO-rEVITfpJur_yqDtC1No
```

* **Cloud Name:** `dfldlh0xd`
* **API Key:** `771348431174726`
* **API Secret:** `0K6N-dO-rEVITfpJur_yqDtC1No`
* **Allowed Image Delivery Domain:** `res.cloudinary.com`

---

## 2. 🗄️ Database (MongoDB Atlas) Credentials

Used by Mongoose to connect the Express backend to the MongoDB cluster.

```env
MONGODB_URI=mongodb+srv://sandeep_db_user:UueT68aRbrRBVkS7@virtualoffice.sssb12s.mongodb.net/i-vantage
```

* **Database Type:** MongoDB Atlas Cluster
* **Username:** `sandeep_db_user`
* **Password:** `UueT68aRbrRBVkS7`
* **Cluster Host:** `virtualoffice.sssb12s.mongodb.net`
* **Database Name:** `i-vantage`

---

## 3. 🖥️ Backend Server Environment File (`server/.env`)

Place this configuration inside `server/.env`:

```env
# ===================================================
# SERVER APPLICATION CONFIGURATION
# ===================================================
PORT=5000
NODE_ENV=development
CLIENT_URL=http://localhost:3000

# ===================================================
# DATABASE CONNECTION
# ===================================================
MONGODB_URI=mongodb+srv://sandeep_db_user:UueT68aRbrRBVkS7@virtualoffice.sssb12s.mongodb.net/i-vantage

# ===================================================
# CLOUDINARY ASSET STORAGE
# ===================================================
CLOUDINARY_CLOUD_NAME=dfldlh0xd
CLOUDINARY_API_KEY=771348431174726
CLOUDINARY_API_SECRET=0K6N-dO-rEVITfpJur_yqDtC1No

# ===================================================
# JWT AUTHENTICATION & SESSION TOKENS
# ===================================================
JWT_ACCESS_SECRET=bfc9a3775f408f50ef4543500324b51af6030b6d0990f510111e2a99a6d6bf69
JWT_REFRESH_SECRET=ea256a156e362d78faeb428790bddf127973328135bae01ab79a7a731fe9d5c4
ACCESS_TOKEN_EXPIRES=7d
REFRESH_TOKEN_EXPIRES=30d
```

---

## 4. 🌐 Frontend Client Environment File (`client/.env.local`)

Place this configuration inside `client/.env.local`:

```env
# ===================================================
# NEXT.JS CLIENT ENVIRONMENT
# ===================================================
NEXT_PUBLIC_API_URL=http://localhost:5000/api/v1
VIKI_API_URL=https://bot.i-vantage.in
```

* **Production Note:** For live production deployments (e.g., Vercel), set `NEXT_PUBLIC_API_URL` to your production backend URL (e.g., `https://api.i-vantage.in/api/v1`).

---

## 5. 🛠️ Admin CLI & Seed Credentials

Used for executing administrative scripts such as `server/scripts/create-admin.js` or `server/seed-admin.js`:

```env
ADMIN_EMAIL=sandeep.assetsense@gmail.com
ADMIN_PASSWORD=your_secure_password
```

---

## 6. 🔒 Security Notice
> **Keep this file secure!** Do not commit plaintext credentials to public repositories. Ensure `ENV_CREDENTIALS.md` is listed in your `.gitignore` if hosting on a public Git platform.
