# 🛒 ShopFest — MERN Stack E-Commerce Platform

A full-stack e-commerce platform built with the MERN stack (MongoDB, Express.js, React, Node.js) featuring JWT authentication, Razorpay payment integration, admin dashboard, and cloud-based image storage.

## 🚀 Live Demo

> https://shopfest.onrender.com

## 📸 Screenshots

## ✨ Features

### Customer Side
- 🔐 **JWT Authentication** — Secure register, login and session management
- 🛍️ **Product Browsing** — Browse all products with search functionality
- 🔍 **Product Detail Page** — Detailed view of each product
- 🛒 **Cart Management** — Add, remove, increase/decrease quantity with dynamic price update
- 💳 **Razorpay Payment** — Seamless and secure checkout experience
- 📦 **Order Tracking** — View order history and status
- 👤 **User Profile** — Manage personal details
- 📧 **Email Notifications** — Transactional emails via Nodemailer
- 🌙 **Responsive Design** — Works across all screen sizes

### Admin Side
- 📊 **Admin Dashboard** — Overview of sales and analytics
- 📦 **Product Management** — Add, edit, delete products (CRUD)
- 🖼️ **Image Upload** — Cloud-based image storage via Cloudinary + Multer
- 👥 **User Management** — View and manage all users
- 📋 **Order Management** — View and update order status

## 🛠️ Tech Stack

### Frontend
| Technology | Usage |
|---|---|
| React.js | UI components and routing |
| Redux Toolkit | Global state management (cart) |
| CSS3 | Styling and responsive design |
| Axios | API calls |

### Backend
| Technology | Usage |
|---|---|
| Node.js | Runtime environment |
| Express.js | REST API framework |
| MongoDB | Database |
| Mongoose | ODM for MongoDB |
| JWT | Authentication |
| Bcrypt | Password hashing |
| Razorpay | Payment gateway |
| Cloudinary | Cloud image storage |
| Multer | File upload middleware |
| Nodemailer | Email notifications |

## 📁 Project Structure

```
ShopFest/
├── backend/
│   ├── config/
│   │   ├── db.js               # MongoDB connection
│   │   └── cloudinary.js       # Cloudinary config
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── productController.js
│   │   ├── orderController.js
│   │   ├── paymentController.js
│   │   └── analyticsController.js
│   ├── middleware/
│   │   ├── authMiddleware.js
│   │   └── adminMiddleware.js
│   ├── model/
│   │   ├── User.js
│   │   ├── Product.js
│   │   └── Order.js
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── productRoutes.js
│   │   ├── orderRoutes.js
│   │   ├── paymentRoutes.js
│   │   └── analyticsRoutes.js
│   ├── utils/
│   │   └── sendEmail.js
│   ├── .env.example
│   └── index.js
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── admin/
│   │   │   ├── AdminDashboard.jsx
│   │   │   ├── AdminProducts.jsx
│   │   │   ├── AdminOrders.jsx
│   │   │   ├── AdminUsers.jsx
│   │   │   ├── AddProduct.jsx
│   │   │   └── EditProduct.jsx
│   │   ├── components/
│   │   │   ├── Navbar.jsx
│   │   │   ├── Footer.jsx
│   │   │   └── ProductCard.jsx
│   │   ├── pages/
│   │   │   ├── Home.jsx
│   │   │   ├── Shop.jsx
│   │   │   ├── ProductDetail.jsx
│   │   │   ├── Cart.jsx
│   │   │   ├── Checkout.jsx
│   │   │   ├── Login.jsx
│   │   │   ├── Register.jsx
│   │   │   ├── Profile.jsx
│   │   │   ├── OrderSuccess.jsx
│   │   │   ├── About.jsx
│   │   │   ├── Disclaimer.jsx
│   │   │   └── ReturnPolicy.jsx
│   │   ├── redux/
│   │   │   ├── store.js
│   │   │   └── cartSlice.js
│   │   ├── context/
│   │   │   └── AuthContext.jsx
│   │   └── styles/
└── README.md
```

## ⚙️ How to Run Locally

### Prerequisites
- Node.js installed
- MongoDB Atlas account
- Cloudinary account
- Razorpay account

### Backend Setup
```bash
cd backend
npm install
```

Create `.env` file (refer to `.env.example`):
```
MONGO_URI=your_mongodb_uri
JWT_SECRET=your_jwt_secret
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
RAZORPAY_KEY_ID=your_razorpay_key
RAZORPAY_KEY_SECRET=your_razorpay_secret
EMAIL_USER=your_email
EMAIL_PASS=your_email_password
```

```bash
npm run dev
```

### Frontend Setup
```bash
cd frontend
npm install
npm start
```

## 🔮 Future Improvements

- [ ] Add product reviews and ratings
- [ ] Implement wishlist feature
- [ ] Add coupon/discount code system
- [ ] Push notifications for order updates
- [ ] AI powered product recommendations

## 👨‍💻 Author

**Manav Meshram**
B.Tech Computer Science | JC Bose University, YMCA
📧 Manav40487@gmail.com
🔗 [GitHub](https://github.com/manav40487-netizen)

---

⭐ If you like this project, give it a star on GitHub!
