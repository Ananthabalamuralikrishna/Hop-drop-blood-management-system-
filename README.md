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

**For users (donors and patients)**
- **Separate login for Users and Hospitals** with secure JWT authentication
- **Request blood** by choosing blood group, units required and urgency level, with an optional supporting document upload
- **Track your requests** and see the status (for example Approved) and the hospital handling it
- **Donate blood** by registering your availability, with eligibility checks (age 18 to 65, minimum weight 45 kg), last donation date and health details

**For hospitals**
- **Requests dashboard** to review active blood requests and accept or reject them
- **Stock inventory** to view and adjust available units for all 8 blood groups (A+, A-, B+, B-, O+, O-, AB+, AB-)
- **Community donations** tab to see donors who have registered to give blood

**General**
- **Real-time data handling** for up-to-date donor, request and stock information
- **REST APIs** built with Node.js and Express.js
- **Responsive UI** built with React.js, HTML, CSS and JavaScript
- **Emergency contact details** shown in the footer (helpline and ambulance numbers)

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

### Login (User and Hospital)
<img width="1912" height="916" alt="login" src="https://github.com/user-attachments/assets/f7974544-c1f4-4426-98f2-0177f79e05c5" />

### Request Blood
<img width="1890" height="923" alt="request-blood" src="https://github.com/user-attachments/assets/2b515128-dde1-4c90-8c19-b718ed546de6" />

### Donate Blood
<img width="1901" height="917" alt="donate-blood" src="https://github.com/user-attachments/assets/ff306fe1-3e4d-479d-8cd1-acd12b3c9b15" />

### Hospital Dashboard: Active Requests
<img width="1911" height="857" alt="hospital-requests" src="https://github.com/user-attachments/assets/f148e772-be73-4588-9b22-c32eeb1632bc" />

### Hospital Dashboard: Stock Inventory
<img width="1897" height="896" alt="stock-inventory" src="https://github.com/user-attachments/assets/b8b23aa5-0b83-4ec5-bd0c-22244d3a5c63" />

---

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
- Deploy the app and add a live demo link

## 📫 Contact

**Anantha Bala Murali Krishna**
- GitHub: [@Ananthabalamuralikrishna](https://github.com/Ananthabalamuralikrishna)
- LinkedIn: [Anantha Bala Murali Krishna](https://www.linkedin.com/in/anantha-bala-murali-krishna/)
- Email: bbalamuralikrishna23527@gmail.com
