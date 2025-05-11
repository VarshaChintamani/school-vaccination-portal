import React, { useState, useEffect } from 'react';
import { Box, Drawer, TextField, MenuItem, Button } from '@mui/material';
import { addStudent, updateStudent } from '../../services/api'; // Assuming you have an updateStudent function
import { Student } from '../../types/Student';
import { fetchAllDrives } from '../../services/vaccinationDriveService';

interface AddStudentFormProps {
  open: boolean;
  toggleDrawer: (open: boolean) => void;
  studentData?: any; // New prop for pre-filling data
  refreshList?: () => void; // Ensure this is a function
}

const AddStudentForm: React.FC<AddStudentFormProps> = ({ open, toggleDrawer, studentData, refreshList }) => {
  const [formData, setFormData] = useState({
    full_name: '',
    class: '',
    roll_number: '',
    dob: '',
    gender: 'Male',
  });
  console.log("open",open);
  const [allDrives, setAllDrives] = useState<any[]>([]);
const [eligibleDrives, setEligibleDrives] = useState<any[]>([]);
const [selectedDrive, setSelectedDrive] = useState('');
useEffect(() => {
  const fetchDrives = async () => {
    const data = await fetchAllDrives();
    setAllDrives(data);
  };
  fetchDrives();
}, []);

  // Log the student data for debugging
  console.log("studentData", studentData);

  useEffect(() => {
    if (studentData) {
      setFormData({
        full_name: studentData.full_name,
        class: studentData.class,
        roll_number: studentData.roll_number,
        dob: studentData.dob,
        gender: studentData.gender,
      });
    }
  }, [studentData]); // Reset form data when studentData changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  
    if (name === 'class') {
      // Filter drives based on selected class and availability
      const filtered = allDrives.filter((drive) => {
        const classes = drive.applicable_classes?.split(',').map((c: string) => c.trim());
        return classes?.includes(value) && drive.available_doses > 0;
      });
      setEligibleDrives(filtered);
      setSelectedDrive(''); // reset drive selection when class changes
    }
  };
  

  const handleSubmit = async () => {
    try {
      if (studentData) {
        // If editing an existing student, update the student
        const response = await updateStudent(studentData.id, formData); // Assume updateStudent function
        if(response){
          toggleDrawer(false);  // Close the drawer after submission
          refreshList && refreshList(); // Trigger refresh of student list after submission
        }
      } else {
        // If adding a new student, create a new student
        const response = await addStudent(formData);
        if(response){
          toggleDrawer(false);  // Close the drawer after submission
          refreshList && refreshList(); // Trigger refresh of student list after submission
        }
      }
    } catch (error) {
      console.error('Error saving student:', error);
      alert('Failed to save student');
    }
  };

// useEffect(()=>{
// const fetchDrives = async()=>{
//   const data = await fetchAllDrives();
//   const vaccName = data.map((drive: any)=>
//     drive.vaccine_name);
//   console.log(vaccName,"fvdgxch",data);
  

// };
// fetchDrives();
// }, []);
  const handleCancelClick = () => {
    toggleDrawer(false);  // Close the drawer on cancel
  };console.log("dhcbhjdc",formData.class);
  

  return (
    <Drawer anchor="right" open={open} onClose={() => toggleDrawer(false)}>
      <Box sx={{ width: 350, p: 2, display: 'flex', flexDirection: 'column', gap: 2 }}>
        <h3>{studentData ? 'Edit Student' : 'Add New Student'}</h3>

        <TextField
          label="Full Name"
          name="full_name"
          value={formData.full_name}
          onChange={handleChange}
          fullWidth
        />

        <TextField
          label="Class"
          name="class"
          value={formData.class}
          onChange={handleChange}
          fullWidth
        />

        <TextField
          label="Roll Number"
          name="roll_number"
          value={formData.roll_number}
          onChange={handleChange}
          fullWidth
        />

        <TextField
          label="Date of Birth"
          name="dob"
          type="date"
          InputLabelProps={{ shrink: true }}
          value={formData.dob}
          onChange={handleChange}
          fullWidth
        />

        <TextField
          label="Gender"
          name="gender"
          select
          value={formData.gender}
          onChange={handleChange}
          fullWidth
        >
          <MenuItem value="Male">Male</MenuItem>
          <MenuItem value="Female">Female</MenuItem>
          <MenuItem value="Other">Other</MenuItem>
        </TextField>

        {formData.class && (
  <TextField
    label="Eligible Vaccination Drives"
    select
    fullWidth
    value={selectedDrive}
    onChange={(e) => setSelectedDrive(e.target.value)}
  >
    {eligibleDrives.length > 0 ? (
      eligibleDrives.map((drive) => (
        <MenuItem key={drive.id} value={drive.id}>
          {drive.vaccine_name} ({drive.drive_date})
        </MenuItem>
      ))
    ) : (
      <MenuItem disabled>No eligible drives for this class</MenuItem>
    )}
  </TextField>
)}

        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
          <Button variant="contained" onClick={handleSubmit}>
            {studentData ? 'Save Changes' : 'Save'}
          </Button>
          <Button variant="outlined" onClick={handleCancelClick}>
            Cancel
          </Button>
        </Box>
      </Box>
    </Drawer>
  );
};

export default AddStudentForm;
