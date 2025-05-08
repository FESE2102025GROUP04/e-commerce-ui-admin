// services/userAdminService.js
import api from './api';

export const getAdminUsers = async () => {
  try {
    const response = await api.get('/users/listAdmin');
    return response.data;
  } catch (error) {
    console.error('Error fetching admin users:', error);
    throw error;
  }
};

export const addAdminUser = async (userData) => {
  try {
    const response = await api.post('/users/addUser', userData);
    return response.data;
  } catch (error) {
    console.error('Error creating admin user:', error);
    throw error;
  }
};

export const deleteAdminUser = async (userId) => {
  try {
    console.log('Sending delete request with:', { id: userId });  // Debug log to check user ID
    if (!userId) {
      throw new Error("No User ID provided");
    }
    const response = await api.post('/users/removeUser', { id: userId });
    return response.data;
  } catch (error) {
    console.error('Error deleting admin user:', error.response?.data || error.message);
    throw error;
  }
};


