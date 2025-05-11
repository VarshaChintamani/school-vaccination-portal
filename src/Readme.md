### ##  Overview

The **School Vaccination Portal** is a full-stack web application developed for the SE ZG503 Full Stack Application Development course. It helps school coordinators manage student vaccination efforts efficiently. The system allows adding and editing student records, scheduling and tracking vaccination drives, marking vaccination statuses, and generating detailed reports. Designed for ease of use, the application includes a React frontend, Node.js backend, and a MySQL database with well-structured APIs and modern UI practices.

---

### ##  Features

* **Simulated Authentication**: Simple token-based login for the school coordinator (admin role).
* **Dashboard**: Displays total students, vaccinated percentage, and upcoming drives (within 30 days).
* **Student Management**:

  * Add/edit students
  * Bulk import students via CSV
  * Filter/search by name, ID, class, and vaccination status
* **Vaccination Drive Management**:

  * Add/edit drives
  * Validations to prevent overlaps and ensure a 15-day buffer
  * Disable edits for past drives
* **Reports**:

  * Generate vaccination reports with filters
  * Export data as CSV
  * Paginated results

---

### ## Tech Stack

| Layer      | Technology                  |
| ---------- | --------------------------- |
| Frontend   | React + TypeScript          |
| Backend    | Node.js + Express           |
| Database   | MySQL                       |
| UI Styling | MUI                         |

---

### ## 🗂 Project Structure

```
school-vaccination-portal/
├── client/               # Frontend - React + TS
│   └── src/
│       ├── components/
│       ├── pages/
│       ├── services/
│       └── App.tsx
├── server/               # Backend - Express
│   ├── routes/
│   ├── controllers/
│   ├── models/
│   └── app.js
├── README.md
└── .env (local config)
```

---

### ## ⚙️ Setup Instructions

#### 🔧 Backend Setup

1. Navigate to the server directory:

   ```bash
   cd server
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Add `.env` file:

   ```env
   DB_HOST=localhost
   DB_USER=root
   DB_PASSWORD=yourpassword
   DB_NAME=vaccination_portal
   PORT=5000
   ```

4. Start the backend:

   ```bash
   node app.js
   ```

#### 💻 Frontend Setup

1. Navigate to the client directory:

   ```bash
   cd client
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Run the frontend:

   ```bash
   npm start
   ```

4. Open [http://localhost:3000](http://localhost:3000)

---

### ## 📡 API Documentation

| Endpoint            | Method     | Description                       |
| ------------------- | ---------- | --------------------------------- |
| `/api/students`     | GET/POST   | List or add students              |
| `/api/students/:id` | PUT/DELETE | Update/delete student             |
| `/api/drives`       | GET/POST   | List or create vaccination drives |
| `/api/drives/:id`   | PUT        | Edit drive details                |
| `/api/records`      | POST       | Mark vaccination for a student    |
| `/api/dashboard`    | GET        | Dashboard metrics                 |


---

### ## 🧩 Database Schema

#### Tables:

* **students**: `id`, `name`, `class`, `age`
* **vaccination\_drives**: `id`, `vaccine_name`, `date`, `available_doses`, `applicable_classes`
* **vaccination\_records**: `id`, `student_id`, `drive_id`, `status`
---

### ## ❗ Assumptions

* Only school coordinator (admin) uses the system
* Authentication is simulated; not real token-based
* No duplicate vaccine entries per student-drive
* Vaccination drives must be scheduled at least 15 days ahead
* Editing of past drives is disabled
* CSV import assumes correct format with validation

