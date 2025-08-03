# HackCheck - Secure Password Checker

A full-stack web application designed to help users **securely check** if their passwords have been compromised in known data breaches.

![React](https://img.shields.io/badge/React-20232A?style=for-the-badge\&logo=react\&logoColor=61DAFB)
![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge\&logo=nodedotjs\&logoColor=white)
![Express.js](https://img.shields.io/badge/Express.js-000000?style=for-the-badge\&logo=express\&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB-4EA94B?style=for-the-badge\&logo=mongodb\&logoColor=white)

---
✨ Features:

HackCheck demonstrates a complete full-stack workflow with a focus on security and user experience:

🔒 Secure Password Checking using the k-Anonymity model via the Have I Been Pwned API.

---

👤 User Authentication:

1. Email & password sign-up and login.
2. Password hashing with bcrypt.js
3. 6-digit OTP email verification via Nodemailer
4. 🔐 Persistent Login Sessions using sessionStorage and React Context API
5. 🌓 Dynamic UI: Auth-based navigation with a responsive dark-themed interface
6. 💳 Simulated E-Commerce Flow: Pricing tiers, checkout UI, and live form validation
7. 🎯 Animations: Smooth scroll-triggered animations using Intersection Observer API 

-------------------------------------------------

🛠️ Tech Stack : 

Frontend -

1. Framework: React.js
2. Routing: React Router v6
3. State Management: React Hooks (useState, useContext)
4. Styling: Pure CSS (Flexbox & Grid)

Backend -

1. Runtime: Node.js
2. Framework: Express.js
3. Database: MongoDB
4. ODM: Mongoose
5. Auth: bcrypt.js for hashing, Nodemailer for OTP verification

Security -

1. Environment variables are securely managed with .env and dotenv
2. .env file is ignored in Git for protection

------

Screenshots:

<img width="1920" height="1140" alt="Screenshot 2025-08-03 182707" src="https://github.com/user-attachments/assets/c562bbf8-147f-4dc1-ae62-7dd3f8882607" />
<img width="1920" height="1140" alt="Screenshot 2025-08-03 182715" src="https://github.com/user-attachments/assets/68c574ed-6908-4221-a422-25fc10b6e34b" />
<img width="1920" height="1140" alt="Screenshot 2025-08-03 182732" src="https://github.com/user-attachments/assets/02e014d4-0855-44ca-9132-2aa5327ac747" />

----

⚙️ Getting Started
To run the project locally:

Prerequisites
Node.js (v14+)

npm

MongoDB installed and running locally

Installation Steps
Clone the Repository

bash
Copy
Edit
git clone https://github.com/your-github-username/your-repo-name.git
cd your-repo-name
Install Dependencies

bash
Copy
Edit
npm install
Configure Environment Variables

Create a .env file in the root directory

Add the following values:

env
Copy
Edit
MONGO_URI=mongodb://localhost:27017/hackcheck
GMAIL_USER=youremail@gmail.com
GMAIL_APP_PASS=your-app-password

----

▶️ Running the App

Use two terminal tabs:

1. Start the Backend Server
bash
Copy
Edit
npm run server
Runs on http://localhost:5000 — should show MongoDB Connected....

2. Start the Frontend (New Terminal)
bash
Copy
Edit
npm start
Opens at http://localhost:3000.

---

📬 Contact:

Swaroop Vaidya
📧 swaroopsvaidya@gmail.com
🔗 LinkedIn : https://www.linkedin.com/in/swaroop-vaidya/
