# 🌟 HunarHub

A full-stack MERN platform connecting skilled local entrepreneurs with users for services, bookings, and business growth.


# ✨ Features

## 👤 User
- Browse entrepreneurs by category
- Search services and profiles
- Book services
- Manage orders
- Wishlist entrepreneurs
- Real-time chat with entrepreneurs
- Leave ratings and reviews

## 🧵 Entrepreneur
- Create and manage profile
- Upload portfolio images
- Manage services
- Set availability schedule
- View and manage bookings
- Track earnings
- Receive customer reviews
- Real-time messaging

## 🛠️ Admin
- Dashboard overview
- Approve entrepreneur applications
- Manage users and entrepreneurs
- Manage categories
- Monitor bookings
- Handle complaints
- Manage reviews and platform activity


# 🚀 Tech Stack

## 🎨 Frontend
- React
- TypeScript
- TanStack Query (React Query)
- React Hook Form
- Yup Validation
- Tailwind CSS
- Zustand
- Socket.IO Client
- Recharts
- React Router DOM
- Axios

## ⚙️ Backend
- Node.js
- Express.js
- MongoDB
- JWT Authentication
- Socket.IO
- Cloudinary
- Multer
- Nodemailer


# 🔐 Environment Variables

Create a `.env` file inside the backend folder.

```bash
cd back-end
touch .env
```

Add the following variables:

```env
MONGO_DB_URL=mongodb+srv://<username>:<password>@cluster0.mongodb.net/HunarHub

PORT=5000

FRONTEND_URL=http://localhost:5173

ACCESS_TOKEN_SECRET=your_access_token_secret

REFRESH_TOKEN_SECRET=your_refresh_token_secret

NODE_ENV=development

CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

EMAIL_USER=your_email
EMAIL_PASS=your_email_password
```


# 🧩 Main Modules

## 🔑 Authentication
- JWT access & refresh tokens
- Protected routes
- Role-based authorization

## 📦 Booking System
- Service booking flow
- Booking status management
- Schedule tracking

## 🖼️ Portfolio Management
- Upload portfolio images
- Cloudinary image storage
- Entrepreneur showcase section

## 💬 Real-Time Chat
- Socket.IO based messaging
- User ↔ Entrepreneur communication

## 💰 Earnings System
- Entrepreneur earnings tracking
- Revenue overview
- Booking income records


# 🎥 Demo
https://github.com/user-attachments/assets/a9e996bd-e663-4c32-a23f-b5501bb330d5
