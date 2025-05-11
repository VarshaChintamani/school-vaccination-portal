// server/app.js
const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const db = require('./db');

dotenv.config(); // Load environment variables from .env file

const app = express();
const ADMIN_USER = {
  username: 'admin',
  password: 'password123',
};

const sendSuccess = (res, statusCode = 200, data = {}) => {
  res.status(statusCode).json({
    status: 'SUCCESSFUL',
    statusCode,
    data
  });
};

const sendError = (res, statusCode = 400, error = 'Something went wrong') => {
  res.status(statusCode).json({
    status: 'FAILED',
    statusCode,
    data: { error }
  });
};

// Allow requests from your frontend's port (3000)
app.use(cors({
  origin: 'http://localhost:3000', // frontend URL
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type']
}));

app.use(express.json()); // To parse JSON request bodies


app.post('/login', (req,res) => {
  const { username, password } = req.body;
  if (username === ADMIN_USER.username && password === ADMIN_USER.password) {
    const token = 'fake-jwt-token';
    sendSuccess(res, 200, { token, username: ADMIN_USER.username, role: 'admin' });
    // res.json({ token, username: ADMIN_USER.username, role: 'admin' });
  } else {
    sendError(res, 401, 'Invalid credentials');
    // res.status(401).json({ message: 'Invalid credentials' });
  }
});

// Example route
app.get('/', (req, res) => {
  res.send('Hello from the backend!');
});
console.log("dnhgsx",db.query);

// API to get students
app.get('/api/students', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM students');
    sendSuccess(res, 200, {rows});
  } catch (err) {
    console.error('Error fetching students:', err);
    sendError(res, 500, 'Failed to fetch students');
    // res.status(500).json({ error: 'Failed to fetch students' });
  }
});

app.post('/api/addStudent', async (req,res) => {
const {full_name,class: studentClass, roll_number, dob, gender,vacc_status,vacc_drive} = req.body
try {
const [result] = await db.query(
  `INSERT INTO students (full_name, class, roll_number, dob, gender,vacc_status,vacc_drive) VALUES (?, ?, ?, ?, ?, ?, ?)`,
  [full_name, studentClass, roll_number, dob, gender,vacc_status,vacc_drive]
);
sendSuccess(res, 200, {id: result.insertId, message: 'Student addded succesfully'});
// res.status(201).json({id: result.insertId, message: 'Student addded succesfully'});
} catch (err) {
console.error('Error adding student:', err);
sendError(res, 500, 'Failed to add student');
// res.status(500).json({ error: 'Failed to add student' });
}
});

app.get('/api/students/:id', async (req, res) => {
const studentId = req.params.id;
try {
  const [rows] = await db.query('SELECT * FROM students WHERE id = ?', [studentId]);
  if (rows.length === 0) {
    return sendError(res, 404, 'Student not found');
    // res.status(404).json({ error: 'Student not found' });
  }
  sendSuccess(res, 200, rows[0] );
//    res.json(rows[0]);  Send the student data as a response (first record only)
} catch (err) {
  console.error('Error fetching student:', err);
  sendError(res, 500, 'Failed to fetch student');
  // res.status(500).json({ error: 'Failed to fetch student' });
}
});

app.put('/api/students/:id', async (req, res) => {
  const studentId = req.params.id;
  const { full_name, class: studentClass, roll_number, dob, gender,vacc_status,vacc_drive } = req.body;

  // Convert the 'dob' to MySQL-compatible format (YYYY-MM-DD)
  const formattedDob = new Date(dob).toISOString().split('T')[0]; // Extract just the date part

  try {
    const [result] = await db.query(
      `UPDATE students SET full_name = ?, class = ?, roll_number = ?, dob = ?, gender = ?, vacc_status = ?, vacc_drive = ? WHERE id = ?`,
      [full_name, studentClass, roll_number, formattedDob, gender ,vacc_status,vacc_drive, studentId]
    );

    if (result.affectedRows === 0) {
      return sendError(res, 404, 'Student not found');
      // res.status(404).json({ error: 'Student not found' });
    }

    sendSuccess(res, 200, 'Student updated successfully' );
    res.json({ message: 'Student updated successfully' });
  } catch (err) {
    console.error('Error updating student:', err);
    sendError(res, 500, 'Failed to update student');
    // res.status(500).json({ error: 'Failed to update student' });
  }
});

app.delete('/api/students/:id', async (req, res) => {
  const { id } = req.params;

  try {
    await db.query(`DELETE FROM students WHERE id = ?`, [id]);
    sendSuccess(res, 200, 'Student deleted successfully' );
    // res.json({ message: 'Student deleted successfully' });
  } catch (err) {
    console.error('Error deleting student:', err);
    sendError(res, 500, 'Failed to delete student');
    // res.status(500).json({ error: 'Failed to delete student' });
  }
});
//   Get all vaccination drives
app.get('/api/vaccination-drives', async (req, res) => {
  try {
      const [rows] = await db.query('SELECT * FROM vaccination_drives ORDER BY drive_date ASC');
      sendSuccess(res, 200, rows);
      // res.json(rows);
  } catch (err) {
      console.error('ERROR',err);
      sendError(res, 500, 'Failed to fetch vaccination drives');
      // res.status(500).json({ error: 'Failed to fetch vaccination drives'});
  }
}
)

//   Create a new vaccination drive
app.post('/api/vaccination-drives', async (req, res) => {
  const { vaccine_name, date, available_doses, applicable_classes } = req.body;

  try {
    const driveDate = new Date(date);
    const today = new Date();
    const diffDays = Math.ceil((driveDate - today) / (1000 * 60 * 60 * 24));

    if (diffDays < 15) {
      return sendError(res, 400, 'Drives must be scheduled at least 15 days in advance.');
      // return res.status(400).json({ error: 'Drives must be scheduled at least 15 days in advance.' });
    }

    // Check for scheduling conflicts
    const [conflicts] = await db.query(
      `SELECT * FROM vaccination_drives WHERE date = ? AND vaccine_name = ?`,
      [date, vaccine_name]
    );
    if (conflicts.length > 0) {
      return sendError(res, 400, 'A drive with the same vaccine already exists on this date.');
      // return res.status(400).json({ error: 'A drive with the same vaccine already exists on this date.' });
    }

    const [result] = await db.query(
      `INSERT INTO vaccination_drives (vaccine_name, date, available_doses, applicable_classes)
        VALUES (?, ?, ?, ?)`,
      [vaccine_name, date, available_doses, applicable_classes]
    );

    sendSuccess(res, 201, { id: result.insertId, message: 'Vaccination drive created successfully' });
    // res.status(201).json({ id: result.insertId, message: 'Vaccination drive created successfully' });
  } catch (err) {
    console.error('Error creating drive:', err);
    sendError(res, 500, 'Failed to create drive');
    // res.status(500).json({ error: 'Failed to create drive' });
  }
});

//   Get a single vaccination drive by ID
app.get('/api/vaccination-drives/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const [rows] = await db.query('SELECT * FROM vaccination_drives WHERE id = ?', [id]);
    if (rows.length === 0) {
      return  sendError(res, 404, 'Drive not found');

      // res.status(404).json({ error: 'Drive not found' });
    }

    sendSuccess(res, 200,  rows[0] );
    // res.json(rows[0]);
  } catch (err) {
    console.error('Error fetching drive:', err);
    sendError(res, 500, 'Failed to fetch drive');
    // res.status(500).json({ error: 'Failed to fetch drive' });
  }
});

// Update a vaccination drive (only if it's not expired)
app.put('/api/vaccination-drives/:id', async (req, res) => {
  const { id } = req.params;
  const { vaccine_name, date, available_doses, applicable_classes } = req.body;

  try {
    const [existing] = await db.query('SELECT * FROM vaccination_drives WHERE id = ?', [id]);

    if (existing.length === 0) {
      return sendError(res, 404, 'Drive not found');
      // return res.status(404).json({ error: 'Drive not found' });
    }

    const existingDate = new Date(existing[0].date);
    const today = new Date();

    if (existingDate < today) {
      return sendError(res, 500, 'Cannot edit a past vaccination drive');
      // return res.status(400).json({ error: 'Cannot edit a past vaccination drive' });
    }

    await db.query(
      `UPDATE vaccination_drives 
        SET vaccine_name = ?, date = ?, available_doses = ?, applicable_classes = ? 
        WHERE id = ?`,
      [vaccine_name, date, available_doses, applicable_classes, id]
    );

    sendSuccess(res, 200, 'Drive updated successfully' );
    // res.json({ message: 'Drive updated successfully' });
  } catch (err) {
    console.error('Error updating drive:', err);
    sendError(res, 500, 'Failed to update drive');
    // res.status(500).json({ error: 'Failed to update drive' });
  }
});

//delete vaccination drive
app.delete('/api/vaccination-drives/:id', async (req, res) => {
  const { id } = req.params;

  try {
    await db.query(`DELETE FROM vaccination_drives WHERE id = ?`, [id]);
    sendSuccess(res, 200, 'Drive deleted successfully');
    // res.json({ message: 'Drive deleted successfully' });
  } catch (err) {
    console.error('Error deleting drive:', err);
    sendError(res, 500, 'Failed to delete drive');
    // res.status(500).json({ error: 'Failed to delete drive' });
  }
});

app.get('/api/drives', async (req, res) => {
    try {
      const [rows] = await db.query('SELECT * FROM vaccination_drives');
      sendSuccess(res, 200, {rows });
      // res.json(rows);
    } catch (err) {
      console.error('Error fetching drives:', err);
      sendError(res, 500, 'Failed to fetch drives');
      // res.status(500).json({ error: 'Failed to fetch drives' });
    }
  });
  
  app.get('/api/records', async (req, res) => {
    try {
      const [rows] = await db.query('SELECT * FROM vaccination_records');
      sendSuccess(res, 200, {rows });
      // res.json(rows);
    } catch (err) {
      console.error('Error fetching drives:', err);
      sendError(res, 500, 'Failed to fetch drives');
      // res.status(500).json({ error: 'Failed to fetch drives' });
    }
  });

  //dashboard metrics
  app.get('/api/metrics/students', async (req, res) => {
    try {
      const [[{ total }]] = await db.query('SELECT COUNT(*) as total FROM students');
      const [[{ vaccinated }]] = await db.query(
        `SELECT COUNT(*) as vaccinated FROM students WHERE vacc_status = 'Vaccinated'`
      );
      const percentage = total > 0 ? ((vaccinated / total) * 100).toFixed(2) : 0;
      sendSuccess(res, 200, {
        total_students: total,
        vaccinated_students: vaccinated,
        vaccinated_percentage: Number(percentage),
      });

      // res.json({
      //   status: 'SUCCESSFUL',
      //   statusCode: 200,
      //   data: {
      //     total_students: total,
      //     vaccinated_students: vaccinated,
      //     vaccinated_percentage: Number(percentage),
      //   },
      // });
    } catch (err) {
      console.error('Error fetching student metrics:', err);
      sendError(res, 500, 'Failed to fetch student metrics');
      // res.status(500).json({
      //   status: 'FAILED',
      //   statusCode: 500,
      //   data: { error: 'Failed to fetch student metrics' },
      // });
    }
  });
  
  app.get('/api/metrics/upcoming-drives', async (req, res) => {
    try {
      const [drives] = await db.query(`
        SELECT * FROM vaccination_drives
        WHERE date BETWEEN CURDATE() AND DATE_ADD(CURDATE(), INTERVAL 30 DAY)
        ORDER BY date ASC
      `);
      sendSuccess(res, 200, {drives});
      // res.json({
      //   status: 'SUCCESSFUL',
      //   statusCode: 200,
      //   data: drives,
      // });
    } catch (err) {
      console.error('Error fetching upcoming drives:', err);
      sendError(res, 500, 'Failed to fetch upcoming metrics');
      // res.status(500).json({
      //   status: 'FAILED',
      //   statusCode: 500,
      //   data: { error: 'Failed to fetch upcoming drives' },
      // });
    }
  });
 
  app.get('/api/metrics/dashboard', async (req, res) => {
    try {
      const [[{ total_students }]] = await db.query(`
        SELECT COUNT(*) AS total_students FROM students
      `);
  
      const [[{ vaccinated_students }]] = await db.query(`
        SELECT COUNT(*) AS vaccinated_students FROM students WHERE vacc_status = 'Vaccinated'
      `);
  
      const percentage_vaccinated = total_students > 0 
        ? ((vaccinated_students / total_students) * 100).toFixed(2)
        : 0;
  
      const [upcoming_drives] = await db.query(`
        SELECT id, vaccine_name, drive_date AS scheduled_date, available_doses
        FROM vaccination_drives
        WHERE drive_date BETWEEN CURDATE() AND DATE_ADD(CURDATE(), INTERVAL 30 DAY)
        ORDER BY drive_date ASC
      `);
  
      sendSuccess(res, 200, {
        total_students,
        vaccinated_students,
        percentage_vaccinated,
        upcoming_drives
      });
  
    } catch (err) {
      console.error('Error fetching dashboard metrics:', err);
      sendError(res, 500, 'Failed to fetch dashboard metrics');
    }
  });

  // Start the server
  //node app.js
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
