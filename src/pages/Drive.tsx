import React, { useEffect, useState } from 'react';
import { Typography, Button } from '@mui/material';
import { getDrives } from '../services/api';

const Drives = () => {
    const [drives, setDrives] = useState<any>([]);
  
    useEffect(() => {
      const fetchDriveDetails = async () => {
        const data = await getDrives();
        setDrives(data);
      };
      fetchDriveDetails();
    }, []);
  console.log("efrghb",drives);
  
  return (
    <div style={{ padding: '2rem' }}>
      <Typography variant="h4" gutterBottom>
        Vaccination Drives
      </Typography>
      <Typography variant="body1" gutterBottom>
        View, schedule, and manage vaccination drives for students.
      </Typography>

      <Button variant="contained" color="primary" style={{ marginTop: '1rem' }}>
        Schedule New Drive
      </Button>
    </div>
  );
};

export default Drives;
