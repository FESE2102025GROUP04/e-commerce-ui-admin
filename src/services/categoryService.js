  import api from './api';

  export const getCategories = async () => {
    try {
      const response = await api.get('/category/listCategory');
      console.log('Categories fetched:', response.data);  // 
      return response.data;
    } catch (error) {
      console.error('Error fetching categories:', error);
      throw error;
    }
  };

  export const getCategoryById = async (id) => {
    try {
      const response = await api.get(`/category/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching category:', error);
      throw error;
    }
  };

  export const createCategory = async (categoryData) => {
    try {
      const response = await api.post('/category/createCategory', categoryData);
      return response.data;
    } catch (error) {
      console.error('Error creating category:', error);
      throw error;
    }
  };

  export const updateCategory = async (id, categoryData) => {
    try {
      const response = await api.post('/category/updateCategoryInfo', { id, ...categoryData });
      return response.data;
    } catch (error) {
      console.error('Error updating category:', error);
      throw error;
    }
  };

  export const searchCategories = async (categoryName) => {
    try {
      const response = await api.get(`/category/searchCategory?categoryName=${categoryName}`);
      return response.data;
    } catch (error) {
      console.error('Error searching categories:', error);
      throw error;
    }
  };

  // Ensure the missing getProductsByCategory function is here
  export const getProductsByCategory = async (id) => {
    try {
      const response = await api.get(`/category/${id}/products`);
      return response.data;
    } catch (error) {
      console.error('Error fetching products by category:', error);
      throw error;
    }
  };
