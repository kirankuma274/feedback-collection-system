📝 Advanced Feedback Collection System

A full-stack feedback management system with secure authentication, file uploads, admin analytics, dark mode, and CSV export. Built using React, Node.js, Express, MongoDB, and Material UI.

🌐 Live Demo

Frontend: https://feedback-client.vercel.appBackend: https://feedback-backend.onrender.com

🚀 Features

👤 Authentication

Secure login & registration (JWT-based)

Role-based access control (Admin/User)

Protected frontend and backend routes

📝 Feedback Submission

Category dropdown

Star rating system (1–5)

Anonymous option

File upload support (PDF/image)

Client-side validation

🛡️ Admin Dashboard

View & delete feedback

Filter by category or rating

Visual analytics (Pie chart)

Feedback summary (count, average rating)

File viewer for uploads

CSV Export (Download all feedback)

💡 UI/UX

Material UI design system

Dark/Light mode toggle

Responsive layout

Notifications and error handling

🛠 Tech Stack

🔹 Frontend

React (CRA)

Material UI

Axios

Chart.js

React Router DOM

Context API (Auth + Theme)

🔹 Backend

Node.js

Express.js

MongoDB + Mongoose

Multer (file uploads)

JWT Auth

json2csv (CSV export)

📁 Project Structure

Feedback-Collection-System/├── client/ # React frontend├── server/ # Express backend├── README.md





 ⚙️ Installation (Local)

1. Clone the repo

git clone https://github.com/your-username/feedback-collection-system.git

cd feedback-collection-system



2.Setup Backend

cd server

npm install

cp .env.example .env

Fill in MONGO_URI, JWT_SECRET, PORT

npm run dev



3. Setup Frontend

cd ../client

npm install

cp .env.example .env

Set REACT_APP_API_URL to your backend endpoint

npm start







