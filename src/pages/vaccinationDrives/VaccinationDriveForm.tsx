import React, { useEffect, useState } from 'react';
import { TextField, Button, Typography, Box, FormControl, InputLabel, Select, MenuItem, OutlinedInput, Checkbox, ListItemText, FormHelperText } from '@mui/material';
import { useNavigate, useParams } from 'react-router-dom';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { fetchDriveById, updateDrive, createDrive } from '../../services/vaccinationDriveService';

const VaccinationDriveForm = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEdit = Boolean(id);

  const [isReview, setIsReview] = useState(false);

  const classOptions = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10'];

  const validationSchema = Yup.object({
    vaccine_name: Yup.string().required('Vaccine name is required'),
    date: Yup.date().required('Date is required'),
    available_doses: Yup.number()
      .required('Available doses are required')
      .positive('Doses must be a positive number')
      .integer('Doses must be an integer'),
    applicable_classes: Yup.array().min(1, 'Select at least one class').required('Applicable classes are required'),
  });

  const formik = useFormik({
    initialValues: {
      vaccine_name: '',
      date: '',
      available_doses: '',
      applicable_classes: [] as string[],
    },
    validationSchema,
    onSubmit: async (values) => {
      const payload = {
        ...values,
        available_doses: Number(values.available_doses),
        applicable_classes: values.applicable_classes.join(','),
      };
      try {
        if (isEdit && id) {
          await updateDrive(Number(id), payload);
          alert('Drive updated!');
        } else {
          await createDrive(payload);
          alert('Drive created!');
        }
        navigate('/vaccination-drives');
      } catch (error) {
        alert('Operation failed');
      }
    },
  });

  useEffect(() => {
    if (isEdit && id) {
      fetchDriveById(Number(id)).then((data: any) => {
        formik.setValues({
          vaccine_name: data.vaccine_name || '',
          date: data.date || '',
          available_doses: data.available_doses?.toString() || '',
          applicable_classes: data.applicable_classes ? data.applicable_classes.split(',') : [],
        });
      });
    }
  }, [id, isEdit]);

  const handleClassesChange = (event: any) => {
    const {
      target: { value },
    } = event;
    formik.setFieldValue('applicable_classes', typeof value === 'string' ? value.split(',') : value);
  };

  const handleReviewClick = () => {
    setIsReview(true);
  };

  const handleEditClick = () => {
    setIsReview(false);
  };

  return (
    <Box sx={{ maxWidth: 600, margin: 'auto', padding: 3 }}>
      {isReview ? (
        <div>
          <Typography variant="h4" gutterBottom>
            Review Drive Details
          </Typography>
          <Typography variant="body1"><strong>Vaccine Name:</strong> {formik.values.vaccine_name}</Typography>
          <Typography variant="body1"><strong>Date:</strong> {formik.values.date}</Typography>
          <Typography variant="body1"><strong>Available Doses:</strong> {formik.values.available_doses}</Typography>
          <Typography variant="body1"><strong>Applicable Classes:</strong> {formik.values.applicable_classes.join(', ')}</Typography>

          <Button variant="outlined" onClick={handleEditClick} sx={{ marginTop: 2 }}>
            Back to Editing
          </Button>
          <Button variant="contained" onClick={formik.handleSubmit as any} sx={{ marginTop: 2, marginLeft: 2 }}>
            {isEdit ? 'Update Drive' : 'Create Drive'}
          </Button>
        </div>
      ) : (
        <form onSubmit={formik.handleSubmit}>
          <Button
            startIcon={<ArrowBackIcon />}
            onClick={() => navigate('/vaccination-drives')}
            sx={{ mb: 2 }}
          >
            Back to Drives List
          </Button>

          <Typography variant="h4" gutterBottom>
            {isEdit ? 'Edit Vaccination Drive' : 'Add New Vaccination Drive'}
          </Typography>

          <TextField
            label="Vaccine Name"
            variant="outlined"
            fullWidth
            margin="normal"
            name="vaccine_name"
            value={formik.values.vaccine_name}
            onChange={formik.handleChange}
            error={formik.touched.vaccine_name && Boolean(formik.errors.vaccine_name)}
            helperText={formik.touched.vaccine_name && formik.errors.vaccine_name}
            required
          />
          <TextField
            label="Date"
            variant="outlined"
            fullWidth
            margin="normal"
            type="date"
            name="date"
            value={formik.values.date}
            onChange={formik.handleChange}
            InputLabelProps={{
              shrink: true,
            }}
            error={formik.touched.date && Boolean(formik.errors.date)}
            helperText={formik.touched.date && formik.errors.date}
            required
          />
          <TextField
            label="Available Doses"
            variant="outlined"
            fullWidth
            margin="normal"
            type="number"
            name="available_doses"
            value={formik.values.available_doses}
            onChange={formik.handleChange}
            error={formik.touched.available_doses && Boolean(formik.errors.available_doses)}
            helperText={formik.touched.available_doses && formik.errors.available_doses}
            required
          />

          <FormControl fullWidth margin="normal" error={formik.touched.applicable_classes && Boolean(formik.errors.applicable_classes)}>
            <InputLabel>Applicable Classes</InputLabel>
            <Select
              multiple
              value={formik.values.applicable_classes}
              onChange={handleClassesChange}
              input={<OutlinedInput label="Applicable Classes" />}
              renderValue={(selected) => (selected as string[]).join(', ')}
              name="applicable_classes"
            >
              {classOptions.map((classNum) => (
                <MenuItem key={classNum} value={classNum}>
                  <Checkbox checked={formik.values.applicable_classes.indexOf(classNum) > -1} />
                  <ListItemText primary={classNum} />
                </MenuItem>
              ))}
            </Select>
            {formik.touched.applicable_classes && formik.errors.applicable_classes && (
              <FormHelperText>{formik.errors.applicable_classes}</FormHelperText>
            )}
          </FormControl>

          <Button variant="contained" sx={{ marginTop: 2 }} type="button" onClick={handleReviewClick}>
            Review
          </Button>
        </form>
      )}
    </Box>
  );
};

export default VaccinationDriveForm;
