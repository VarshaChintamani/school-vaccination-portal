// src/services/api.ts
import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

export const getStudents = async () => {
  try {
    const response = await axios.get(`${API_URL}/students`);
    return response.data.data.rows;
  } catch (error) {
    console.error('Error fetching students', error);
    return [];
  }
};

export const getStudentDataById = async (id: string) => {
  try {
    const response = await axios.get(`${API_URL}/students/:id`);
    return response.data.data;
  } catch (error) {
    console.error('Error fetching students', error);
    return [];
  }
};

export const login = async (credentials: { username: string; password: string }) => {
  const response = await axios.post('/api/auth/login', credentials);
  return response.data.data;
};


export const addStudent = async (studentData: any) => {
  console.log("studentData",studentData);
  
  try {
    const response = await axios.post(`${API_URL}/addStudent`, studentData);
    return response.data.data;
  } catch (error) {
    console.error('Error adding student', error);
    throw error;
  }
};

export const updateStudent = async (id: string, studentData: any) => {
  try {
    const response = await axios.put(`${API_URL}/students/${id}`, studentData);
    return response.data.data;
  } catch (error) {
    console.error('Error updating student', error);
    throw error;
  }
};

export const deleteStudent = async (id: string) => {
  try {
    const response = await axios.delete(`${API_URL}/students/${id}`);
    return response.data.data;
  } catch (error) {
    console.error('Error deleting student', error);
    throw error;
  }
};


export const getVaccinationRecords = async (studentId: number) => {
  try {
    const response = await axios.get(`${API_URL}/vaccination-records/${studentId}`);
    return response.data.data;
  } catch (error) {
    console.error('Error fetching vaccination records', error);
    return [];
  }
};

export const getDrives = async () => {
  try {
    const response = await axios.get(`${API_URL}/vaccination-drives`);
    return response.data.data;
  } catch (error) {
    console.error('Error fetching students', error);
    return [];
  }
};


export const getVaccinations = async () => {
  try {
    const response = await axios.get(`${API_URL}/vaccination/records`);
    return response.data.data;
  } catch (error) {
    console.error('Error fetching students', error);
    return [];
  }
};

export const getDashboardMetrics = async () => {
  try {
    const response = await axios.get(`${API_URL}/metrics/dashboard`);
    return response.data.data;
  } catch (error) {
    console.error('Error fetching students', error);
    return [];
  }
};


// // Get all drives
// export const fetchAllDrives = async () => {
//   try {
//     const response = await axios.get(`${API_URL}/vaccination-drives`);
//     return response.data.data;
//   } catch (error) {
//     console.error('Error fetching drives:', error);
//     throw error;
//   }
// };

// // Get a drive by ID
// export const fetchDriveById = async (id: number) => {
//   try {
//     const response = await axios.get(`${API_URL}/vaccination-drives/:${id}`);
//     return response.data.data;
//   } catch (error) {
//     console.error(`Error fetching drive ${id}:`, error);
//     throw error;
//   }
// };

// // Create a new drive
// export const createDrive = async (data: DriveData) => {
//   try {
//     const response = await axios.post(`${API_URL}/vaccination-drives`, data);
//     return response.data.data;
//   } catch (error) {
//     console.error('Error creating drive:', error);
//     throw error;
//   }
// };

// // Update an existing drive
// export const updateDrive = async (id: number, data: DriveData) => {
//   try {
//     const response = await axios.put(`${API_URL}/vaccination-drives/:${id}`, data);
//     return response.data.data;
//   } catch (error) {
//     console.error(`Error updating drive ${id}:`, error);
//     throw error;
//   }
// };

// // Delete a drive
// export const deleteDrive = async (id: number) => {
//   try {
//     const response = await axios.delete(`${API_URL}/vaccination-drives/:${id}`);
//     return response.data.data;
//   } catch (error) {
//     console.error(`Error deleting drive ${id}:`, error);
//     throw error;
//   }
// };