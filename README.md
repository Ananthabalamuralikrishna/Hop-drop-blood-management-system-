# 🩸 Hope Drop: Blood Bank Management System

A full stack MERN web application that connects **blood donors and hospitals** on one platform, with real-time data handling and secure user access.

![React](https://img.shields.io/badge/React-20232A?style=flat&logo=react&logoColor=61DAFB)
![Node.js](https://img.shields.io/badge/Node.js-339933?style=flat&logo=nodedotjs&logoColor=white)
![Express](https://img.shields.io/badge/Express.js-000000?style=flat&logo=express&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB-47A248?style=flat&logo=mongodb&logoColor=white)
![JWT](https://img.shields.io/badge/JWT-000000?style=flat&logo=jsonwebtokens&logoColor=white)

---

## 📌 Overview

Finding the right blood type quickly can save a life. Hope Drop gives donors and hospitals a single platform to connect, so requests and donor information are easy to find and always up to date.

## ✨ Key Features

- **Donor and hospital platform** that connects people who give blood with those who need it
- **Real-time data handling** for up-to-date donor and request information
- **JWT authentication** for secure login and protected access
- **REST APIs** built with Node.js and Express.js
- **Responsive UI** built with React.js, HTML, CSS and JavaScript

## 🛠️ Tech Stack

| Layer | Technologies |
|-------|--------------|
| **Frontend** | React.js, JavaScript, HTML, CSS |
| **Backend** | Node.js, Express.js |
| **Database** | MongoDB |
| **Auth** | JWT (JSON Web Tokens) |
| **API** | RESTful APIs |
| **Tools** | Git, GitHub, Postman, VS Code |

## 📸 Screenshots

> Add 3 to 4 screenshots here (home page, donor registration, hospital dashboard, blood request).
> Put the images in a `screenshots/` folder in this repo, then link them like this:

```markdown
![Home](screenshots/home.png)
![Dashboard](screenshots/dashboard.png)
```

**Live demo:** _add link here if you deploy it_

## 🚀 Getting Started

### Prerequisites

- Node.js and npm
- MongoDB (local installation or a free MongoDB Atlas cluster)

### 1. Clone the repository

```bash
git clone https://github.com/Ananthabalamuralikrishna/Hop-drop-blood-bank-management-system-.git
cd Hop-drop-blood-bank-management-system-
```

### 2. Set up the backend

```bash
cd server
npm install
```

Create a `.env` file inside the `server` folder:

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key
```

Start the server:

```bash
npm start
```

### 3. Set up the frontend

```bash
cd client
npm install
npm start
```

Open `http://localhost:3000` in your browser.

## 📁 Project Structure

```
Hop-drop-blood-bank-management-system-
├── client/    # React.js frontend
├── server/    # Node.js + Express.js backend (REST APIs, MongoDB, JWT)
└── README.md
```

## 🔐 Security

- JWT tokens protect private routes
- Secrets are stored in a `.env` file, which is not uploaded to GitHub

## 👤 My Role

I managed the database design and API development for this project.

## 🔮 Future Improvements

- Email or SMS alerts for urgent blood requests
- Search donors by blood group and location
- Admin dashboard for hospitals

## 📫 Contact

**Anantha Bala Murali Krishna**
- GitHub: [@Ananthabalamuralikrishna](https://github.com/Ananthabalamuralikrishna)
- LinkedIn: [Anantha Bala Murali Krishna](https://www.linkedin.com/in/anantha-bala-murali-krishna/)
- Email: bbalamuralikrishna23527@gmail.com
