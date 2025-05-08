// client/src/services/uploadService.js

import api from './api';

export const uploadImage = async (file) => {
  try {
    // Create form data object
    const formData = new FormData();
    formData.append('image', file);
    
    // Send multipart form data
    const response = await api.post('/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
    
    return response.data;
  } catch (error) {
    console.error('Error uploading image:', error);
    throw error;
  }
};