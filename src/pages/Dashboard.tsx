import React, { useEffect, useState } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Button,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { getDashboardMetrics } from '../services/api';

import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

interface VaccinationDrive {
  id: number;
  vaccine_name: string;
  scheduled_date: string;
  slots_available: number;
}

const Dashboard = ({ onLogout }: { onLogout: () => void }) => {
  const [metrics, setMetrics] = useState({
    total_students: 0,
    vaccinated_students: 0,
    percentage_vaccinated: 0,
    upcoming_drives: [] as VaccinationDrive[],
  });

  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.clear();
    onLogout();
    navigate('/login');
  };

  useEffect(() => {
    const fetchMetrics = async () => {
      const data = await getDashboardMetrics();
      setMetrics(data);
    };
    fetchMetrics();
  }, []);

  const notVaccinated = metrics.total_students - metrics.vaccinated_students;

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>Dashboard</Typography>

      <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
        <Card sx={{ flex: '1 1 300px' }}>
          <CardContent>
            <Typography variant="h6">Total Students</Typography>
            <Typography>{metrics.total_students}</Typography>
          </CardContent>
        </Card>

        <Card sx={{ flex: '1 1 300px' }}>
          <CardContent>
            <Typography variant="h6">Vaccinated Students</Typography>
            <Typography>{metrics.vaccinated_students}</Typography>
          </CardContent>
        </Card>

        <Card sx={{ flex: '1 1 300px' }}>
          <CardContent>
            <Typography variant="h6">Vaccination Percentage</Typography>
            <Typography>{metrics.percentage_vaccinated}%</Typography>
          </CardContent>
        </Card>
      </Box>

      {/* Bar Chart: Students Vaccinated vs Not Vaccinated */}
      <Box sx={{ mt: 4, maxWidth: 600 }}>
        <Typography variant="h6" gutterBottom>Vaccination Status Overview</Typography>
        <Bar
          data={{
            labels: ['Vaccinated', 'Not Vaccinated'],
            datasets: [
              {
                label: 'Number of Students',
                data: [metrics.vaccinated_students, notVaccinated],
                backgroundColor: ['#4caf50', '#f44336'],
              },
            ],
          }}
          options={{
            responsive: true,
            plugins: {
              legend: { display: false },
              title: { display: true, text: 'Students Vaccination Count' },
            },
          }}
        />
      </Box>

      {/* Bar Chart: Upcoming Drives */}
      {metrics.upcoming_drives.length > 0 && (
        <Box sx={{ mt: 4, maxWidth: 700 }}>
          <Typography variant="h6" gutterBottom>Upcoming Vaccination Drives</Typography>
          <Bar
            data={{
              labels: metrics.upcoming_drives.map(d => `${d.vaccine_name} (${new Date(d.scheduled_date).toLocaleDateString()})`),
              datasets: [
                {
                  label: 'Slots Available',
                  data: metrics.upcoming_drives.map(d => d.slots_available),
                  backgroundColor: '#2196f3',
                },
              ],
            }}
            options={{
              indexAxis: 'y',
              responsive: true,
              plugins: {
                title: { display: true, text: 'Upcoming Drive Slots' },
                legend: { display: false },
              },
              scales: {
                x: { beginAtZero: true },
              },
            }}
          />
        </Box>
      )}

      {/* Quick Links */}
      <Box sx={{ mt: 4 }}>
        <Typography variant="h6">Quick Links</Typography>
        <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', mt: 1 }}>
          <Button onClick={() => navigate('/students')} variant="outlined">
            Manage Students
          </Button>
          <Button onClick={() => navigate('/vaccination-drives')} variant="outlined">
            Manage Vaccination Drives
          </Button>
        </Box>
        <Button variant="outlined" onClick={handleLogout} sx={{ mt: 2 }}>
          Logout
        </Button>
      </Box>
    </Box>
  );
};

export default Dashboard;
