import axios from 'axios';
import { DriveData } from '../types/Drive';

const API_URL = 'http://localhost:5000/api';

// Get all drives
export const fetchAllDrives = async () => {
    try {
      const response = await axios.get(`${API_URL}/vaccination-drives`);
      return response.data.data;
    } catch (error) {
      console.error('Error fetching drives:', error);
      throw error;
    }
  };
  
  // Get a drive by ID
  export const fetchDriveById = async (id: number) => {
    try {
      const response = await axios.get(`${API_URL}/vaccination-drives/:${id}`);
      return response.data.data;
    } catch (error) {
      console.error(`Error fetching drive ${id}:`, error);
      throw error;
    }
  };
  
  // Create a new drive
  export const createDrive = async (data: DriveData) => {
    try {
      const response = await axios.post(`${API_URL}/vaccination-drives`, data);
      return response.data.data;
    } catch (error) {
      console.error('Error creating drive:', error);
      throw error;
    }
  };
  
  // Update an existing drive
  export const updateDrive = async (id: number, data: DriveData) => {
    try {
      const response = await axios.put(`${API_URL}/vaccination-drives/:${id}`, data);
      return response.data.data;
    } catch (error) {
      console.error(`Error updating drive ${id}:`, error);
      throw error;
    }
  };
  
  // Delete a drive
  export const deleteDrive = async (id: number) => {
    try {
      const response = await axios.delete(`${API_URL}/vaccination-drives/:${id}`);
      return response.data.data;
    } catch (error) {
      console.error(`Error deleting drive ${id}:`, error);
      throw error;
    }
  };