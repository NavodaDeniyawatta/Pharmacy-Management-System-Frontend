# 💊 Pharmacy Management & E-Commerce System – Frontend

A responsive web application built using **React.js** and **TailwindCSS**, designed to provide a seamless online pharmacy experience.  
The frontend handles user interaction, authentication, product browsing, prescription uploads, order management, and real-time notifications.

---

## 🚀 Overview
The frontend delivers a modern and intuitive user interface for customers, pharmacists, and admins. It connects with the backend REST APIs and Firebase cloud services to ensure secure, real-time functionality.

---

## ✨ Features Implemented

🔐 **Authentication & Security**
- Firebase Authentication with OTP-based email verification  
- Role-based access (Admin, Pharmacist, Customer)  
- Secure password storage using Firebase Auth

💊 **Medicine Management**
- Advanced browsing with search and filter options  
- Real-time stock display from MongoDB Atlas (via backend APIs)

📑 **Prescription Handling**
- Secure upload of prescription files (PDF/Image) through Firebase Cloud Storage  
- Workflow for pharmacist validation and order approval  

🛒 **Order Management**
- Cart, checkout, and integrated payment flow (Stripe/PayPal APIs)  
- Order status tracking with dynamic updates  

🚚 **Delivery Dashboard**
- Real-time delivery tracking and proof of delivery updates  

📈 **Admin Dashboard**
- Inventory overview, low-stock alerts, and sales analytics charts  

🔔 **Notifications**
- Real-time push notifications via Firebase Cloud Messaging  

---

## ⚙️ Tech Stack

**Frontend:** React.js, TailwindCSS  
**Cloud Services:** Firebase (Auth, Cloud Storage, Cloud Messaging, Hosting)  
**API Communication:** RESTful APIs via Axios  
**Payment Integration:** Stripe / PayPal  
**Deployment:** Firebase Hosting  

---

## 🧠 Getting Started

### Prerequisites
- Node.js (v16 or higher)
- Firebase project setup

### Installation
```bash
git clone https://github.com/<your-username>/pharmacy-frontend.git
cd pharmacy-frontend
npm install
