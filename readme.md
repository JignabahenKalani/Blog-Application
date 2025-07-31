# 📝 Blog Application

A simple and user-friendly Full Stack Blog Application to register users, create, read, update, and delete (CRUD) blog posts for only valid user. Built using **Node.js**, **Express**, **Sequelize**, **JWT Authentication**

---

## 🚀 Features

- 🔐 User registration and login with JWT authentication  
- 📝 Create new blog posts with title and content  
- 📄 View all posts on the homepage (sorted by newest first)  
- ✏️ Edit existing posts (only by the author)  
- 🗑️ Delete posts (only by the author)  
- ⚡ Live updates on posts list after create, edit, or delete  

---

## 🖥️ Tech Stack

- **Frontend:** HTML, CSS, JavaScript  
- **Backend:** Node.js, Express.js  
- **Database:** MySQL with Sequelize ORM  
- **Authentication:** JWT tokens  

---
## 🔧 Setup & Run
1. **Clone the repository**  
   ```bash
   git clone https://github.com/JignabahenKalani/blog-application.git
   cd blog-application

2. **Install dependencies**

    npm install
    
    .env file 
        DB_HOST=localhost
        DB_PORT=3306
        DB_USERNAME=root
        DB_PASSWORD=your_mysql_password
        DB_DATABASE=blog_db
        JWT_SECRET=yourSuperSecretKey

    npm run start
    Open your browser and visit:http://localhost:3001

# 📸 Screenshot
 ![alt text]

## 📦 Dependencies
 express,sequelize,mysql2,jsonwebtoken,bcrypt,nodemon (dev dependency)

## 🌐 Live Demo
View the live site here: 
My github link here: https://github.com/JignabahenKalani