// services/userService.js
import api from './api';

export const getConsumerUsers = async () => {
  try {
    const response = await api.get('/users/listConsumer');
    return response.data;
  } catch (error) {
    console.error('Error fetching consumer users:', error.response?.data || error.message);
    throw error;
  }
};


