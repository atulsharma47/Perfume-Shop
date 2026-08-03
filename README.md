# 🌸 Perfume Shop

> A premium full-stack perfume e-commerce application built with the MERN stack, featuring a modern React frontend, Express REST API, MongoDB Atlas database, product reviews, featured collections, and an elegant shopping experience.

![React](https://img.shields.io/badge/React-19-blue?logo=react)
![Node.js](https://img.shields.io/badge/Node.js-Express-green?logo=node.js)
![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-green?logo=mongodb)
![License](https://img.shields.io/badge/License-MIT-blue)
![Status](https://img.shields.io/badge/Status-Active-success)

---

## ✨ Features

- 🌹 Premium perfume catalogue
- 🔍 View complete perfume details
- ⭐ Customer ratings & reviews
- 📝 Submit new reviews
- 💎 Featured perfume collection
- 📱 Responsive design
- ☁️ MongoDB Atlas integration
- 🚀 RESTful API architecture
- 📦 Express backend
- ⚡ Fast React frontend

---

# 📸 Screenshots

> Add screenshots after deployment.

| Home | Product Details |
|------|-----------------|
| Home Screenshot | Product Screenshot |

---

# 🛠 Tech Stack

## Frontend

- React
- React Router
- Axios
- React Share
- React Parallax Tilt
- CSS3

## Backend

- Node.js
- Express.js
- MongoDB Atlas
- Mongoose
- CORS
- dotenv

---

# 📂 Project Structure

```
Perfume-Shop/
│
├── client/
│   ├── public/
│   ├── src/
│   ├── package.json
│
├── server/
│   ├── models/
│   ├── routes/
│   ├── data/
│   ├── index.js
│   ├── package.json
│
└── README.md
```

---

# 🚀 Live Demo

### Frontend

```
https://YOUR_FRONTEND_URL
```

### Backend API

```
https://YOUR_BACKEND_URL
```

### Health Endpoint

```
https://YOUR_BACKEND_URL/api/health
```

### Products Endpoint

```
https://YOUR_BACKEND_URL/api/products
```

---

# ⚙️ Installation

Clone the repository

```bash
git clone https://github.com/atulsharma47/Perfume-Shop.git
```

Move inside project

```bash
cd Perfume-Shop
```

---

## Install Frontend

```bash
cd client
npm install
npm start
```

Runs on

```
http://localhost:3000
```

---

## Install Backend

```bash
cd server
npm install
npm start
```

Runs on

```
http://localhost:5000
```

---

# 🔐 Environment Variables

Create a `.env` file inside the **server** folder.

```env
PORT=5000

MONGO_URI=your_mongodb_connection_string
```

Example

```env
mongodb+srv://username:password@cluster.mongodb.net/perfumeDB
```

---

# 📡 API Endpoints

## Health Check

```
GET /api/health
```

---

## Get All Products

```
GET /api/products
```

---

## Featured Products

```
GET /api/products?featured=true
```

---

## Get Single Product

```
GET /api/products/:id
```

---

## Add Review

```
POST /api/products/:id/reviews
```

---

## Add Product

```
POST /api/products
```

---

# 🗄 Database

MongoDB Atlas is used for storing

- Products
- Reviews
- Ratings

Connected using

- Mongoose ODM

---

# 🏗 Architecture

```
                React Frontend
                       │
                 Axios HTTP Requests
                       │
               Express REST API
                       │
                  Mongoose ODM
                       │
                MongoDB Atlas
```

---

# 📈 Future Improvements

- User Authentication
- JWT Login
- Shopping Cart
- Wishlist
- Checkout
- Payment Gateway
- Admin Dashboard
- Search & Filters
- Order History
- Product Categories
- Coupons
- Dark Mode

---

# 💻 Developed By

**Atul Sharma**

Computer Science Engineer

GitHub

https://github.com/atulsharma47

LinkedIn

(Add your LinkedIn URL)

---

# ⭐ Support

If you found this project useful, consider giving it a ⭐ on GitHub.

It helps others discover the project and motivates future improvements.

---

# 📄 License

This project is licensed under the MIT License.

---

## 🎯 Project Highlights

✔ Full Stack MERN Application

✔ REST API Development

✔ MongoDB Atlas Integration

✔ Responsive React UI

✔ Product Review System

✔ Professional Folder Structure

✔ Cloud Deployment Ready

✔ Recruiter Friendly Codebase
