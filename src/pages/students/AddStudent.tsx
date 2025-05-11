import React, { useEffect, useState } from 'react';
import { TextField, Button, Typography, Box, RadioGroup, FormControlLabel, Radio, FormControl, InputLabel, Select, MenuItem, SelectChangeEvent } from '@mui/material';
import { useLocation, useNavigate } from 'react-router-dom';
import { addStudent, updateStudent } from '../../services/api';
import { fetchAllDrives } from '../../services/vaccinationDriveService';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

const AddStudent = () => {
  const [formData, setFormData] = useState({
    full_name: '',
    class: '',
    roll_number: '',
    dob: '',
    gender: '',
    vacc_status: 'Not Vaccinated',
    vacc_drive: '',
  });
  const [allDrives, setAllDrives] = useState<any[]>([]);
  const [eligibleDrives, setEligibleDrives] = useState<any[]>([]);
  
  const location = useLocation();
  const editData = location.state;

  console.log("editData", editData);

  useEffect(() => {
    if (editData) {
      setFormData({
        full_name: editData.full_name,
        class: editData.class,
        roll_number: editData.roll_number,
        dob: editData.dob,
        gender: editData.gender,
        vacc_status: editData.vacc_status,
        vacc_drive: editData.vacc_drive,
      });
    }
  }, [editData]);

  const [isReview, setIsReview] = useState(false);
  const [vaccineName, setVaccineName] = useState<any>([]);

  useEffect(() => {
    const fetchDrives = async () => {
      const data = await fetchAllDrives();
      setAllDrives(data);
      const vaccName = data.map((drive: any) => drive.vaccine_name);
      console.log(vaccName, "fvdgxch", data);
      setVaccineName(vaccName);
    };
    fetchDrives();
  }, []);

  // const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
  //   const { name, value } = e.target;
  //   setFormData({
  //     ...formData,
  //     [name]: value,
  //   });
  // };
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  
    if (name === 'class') {
      // Filter drives that include the class and have available doses
      const filtered = allDrives.filter((drive) => {
        const applicableClasses = drive.applicable_classes?.split(',').map((c: string) => c.trim());
        return applicableClasses?.includes(value) && drive.available_doses > 0;
      });
      setEligibleDrives(filtered);
      setFormData(prev => ({ ...prev, vacc_drive: '' })); // reset selected drive
    }
  };
  
  const handleSelectChange = (e: SelectChangeEvent<string>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleReviewClick = () => {
    setIsReview(true);
  };

  const handleEditClick = () => {
    setIsReview(false);
  };

  const navigate = useNavigate();

  const handleSubmit = async () => {
    setIsReview(false);
    console.log("formData",formData);
    
    if(editData){
        const response = await updateStudent(editData.id, formData);
        if (response) {
          navigate('/students');
        }  
    } else {

        const response = await addStudent(formData);
        if (response) {
            navigate('/students');
        }
    }
  };

  return (
    <Box sx={{ maxWidth: 600, margin: 'auto', padding: 3 }}>
      {isReview ? (
        <div>
          <Typography variant="h4" gutterBottom>
            Review Page
          </Typography>
          <Typography variant="body1"><strong>Full Name:</strong> {formData.full_name}</Typography>
          <Typography variant="body1"><strong>Class:</strong> {formData.class}</Typography>
          <Typography variant="body1"><strong>Roll Number:</strong> {formData.roll_number}</Typography>
          <Typography variant="body1"><strong>Date of Birth:</strong> {formData.dob}</Typography>
          <Typography variant="body1"><strong>Gender:</strong> {formData.gender}</Typography>
          <Typography variant="body1"><strong>Vaccination Status:</strong> {formData.vacc_status}</Typography>
          <Typography variant="body1"><strong>Vaccination Drive:</strong> {formData.vacc_drive}</Typography>
          <Button variant="outlined" onClick={handleEditClick} sx={{ marginTop: 2 }}>
            Back to editing page
          </Button>
          <Button variant="outlined" onClick={handleSubmit} sx={{ marginTop: 2, marginLeft: 2 }}>
            Save
          </Button>
        </div>
      ) : (
        <div>
            <Button
  startIcon={<ArrowBackIcon />}
  onClick={() => navigate('/students')}
  sx={{ mb: 2 }}
>
  Back to Students List
</Button>
          <Typography variant="h4" gutterBottom>
            Add Student
          </Typography>
          <TextField
            label="Full Name"
            variant="outlined"
            fullWidth
            margin="normal"
            name="full_name"
            value={formData.full_name}
            onChange={handleInputChange}
          />
          <FormControl fullWidth margin="normal">
  <InputLabel>Class</InputLabel>
  <Select
    name="class"
    value={formData.class}
    onChange={handleSelectChange}
    label="Class"
  >
    {[...Array(10)].map((_, i) => {
      const classNumber = (i + 1).toString();
      return (
        <MenuItem key={classNumber} value={classNumber}>
          {classNumber}
        </MenuItem>
      );
    })}
  </Select>
</FormControl>

          <TextField
            label="Roll Number"
            variant="outlined"
            fullWidth
            margin="normal"
            name="roll_number"
            value={formData.roll_number}
            onChange={handleInputChange}
          />
          <TextField
            label="Date of Birth"
            variant="outlined"
            fullWidth
            margin="normal"
            type="date"
            name="dob"
            value={formData.dob}
            onChange={handleInputChange}
            InputLabelProps={{
              shrink: true,
            }}
          />
          <FormControl fullWidth margin="normal">
            <InputLabel>Gender</InputLabel>
            <Select
              name="gender"
              value={formData.gender}
              onChange={handleSelectChange}
              label="Gender"
            >
              <MenuItem value="Male">Male</MenuItem>
              <MenuItem value="Female">Female</MenuItem>
              <MenuItem value="Other">Other</MenuItem>
            </Select>
          </FormControl>
          <FormControl component="fieldset" fullWidth margin="normal">
            <Typography variant="body1">Vaccination Status</Typography>
            <RadioGroup
              row
              name="vacc_status"
              value={formData.vacc_status}
              onChange={handleInputChange}
            >
              <FormControlLabel value="Vaccinated" control={<Radio />} label="Vaccinated" />
              <FormControlLabel value="Not Vaccinated" control={<Radio />} label="Not Vaccinated" />
            </RadioGroup>
          </FormControl>
          {formData.vacc_status === 'Vaccinated' && 
          <FormControl fullWidth margin="normal">
            <InputLabel>Vaccination Drive</InputLabel>
            <Select
              name="vacc_drive"
              value={formData.vacc_drive}
              onChange={handleSelectChange}
              label="Vaccination Drive"
              >
              {/* {vaccineName?.map((vaccine: any, index: any) => (
                  <MenuItem key={index} value={vaccine}>
                  {vaccine}
                </MenuItem>
              ))} */}
{eligibleDrives.length > 0 ? (
  eligibleDrives.map((drive) => (
    <MenuItem key={drive.id} value={drive.vaccine_name}>
      {drive.vaccine_name} ({drive.drive_date})
    </MenuItem>
  ))
) : (
  <MenuItem disabled>No eligible drives</MenuItem>
)}
            </Select>
          </FormControl>
            }
          <Button variant="contained" onClick={handleReviewClick} sx={{ marginTop: 2 }}>
            Review
          </Button>
        </div>
      )}
    </Box>
  );
};

export default AddStudent;
