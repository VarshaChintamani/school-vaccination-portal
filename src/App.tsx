import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import StudentsList from './pages/students/Students';
import Login from './pages/Login';
import Sidebar from './components/Sidebar';
import { Box } from '@mui/material';
import VaccinationDrivePage from './pages/vaccinationDrives/VaccinationDrivePage';
import AddStudent from './pages/students/AddStudent';
import VaccinationDriveForm from './pages/vaccinationDrives/VaccinationDriveForm';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(!!localStorage.getItem('token'));
  useEffect(() => {
    const checkAuth = () => {
      setIsAuthenticated(!!localStorage.getItem('token'));
    };
    window.addEventListener('storage', checkAuth); // Listen for storage changes
    return () => {
      window.removeEventListener('storage', checkAuth);
    };
  }, []);

  return (
    <Router>
      {isAuthenticated ? (
        <Box sx={{ display: 'flex' }}>
          <Sidebar onLogout={() => setIsAuthenticated(false)}/>
          <Box
            component="main"
            sx={{
              paddingLeft: 2,
            }}
          >
            <Routes>
            <Route path="/" element={<Dashboard onLogout={() => setIsAuthenticated(false)} />} />
            <Route path="/students" element={<StudentsList />} />
              <Route path="/vaccination-drives" element={<VaccinationDrivePage />} />
              <Route path="/addStudent" element={<AddStudent />} />
              <Route path="/vaccination-drives/new" element={<VaccinationDriveForm />} />
              {/* If user manually tries to visit /login after logging in, redirect */}
              <Route path="/login" element={<Navigate to="/" />} />
            </Routes>
          </Box>
        </Box>
      ) : (
        <Routes>
          <Route path="/login" element={<Login onLogin={() => setIsAuthenticated(true)} />} />
          {/* If user tries to visit any page without login, redirect to /login */}
          <Route path="*" element={<Navigate to="/login" />} />
        </Routes>
      )}
    </Router>
  );
}

export default App;
