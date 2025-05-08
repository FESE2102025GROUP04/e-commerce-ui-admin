import api from './api';

export const getProducts = async () => {
  try {
    const response = await api.get('/products/listProducts');  // Fixed URL
    return response.data;
  } catch (error) {
    console.error('Error fetching products:', error);
    throw error;
  }
};

export const getProductById = async (id) => {
  try {
    const response = await api.get(`/products/getEachProduct/${id}`);  // Fixed URL
    return response.data;
  } catch (error) {
    console.error('Error fetching product:', error);
    throw error;
  }
};

export const createProduct = async (productData) => {
  try {
    const response = await api.post('/products/addProducts', productData);  // Fixed URL
    return response.data;
  } catch (error) {
    console.error('Error creating product:', error);
    throw error;
  }
};

export const updateProduct = async (id, productData) => {
  try {
    const response = await api.post('/products/updateProdct', { id, ...productData });  // Fixed URL
    return response.data;
  } catch (error) {
    console.error('Error updating product:', error);
    throw error;
  }
};

export const searchProducts = async (productName) => {
  try {
    const response = await api.get(`/products/searchProduct?productName=${productName}`);  // Fixed URL
    return response.data;
  } catch (error) {
    console.error('Error searching products:', error);
    throw error;
  }
};

export const filterProducts = async (categoryId, stockStatus) => {
  try {
    let queryString = '/products/filter?';  // Fixed URL
    if (categoryId) queryString += `categoryId=${categoryId}&`;
    if (stockStatus) queryString += `stockStatus=${stockStatus}`;
    
    const response = await api.get(queryString);
    return response.data;
  } catch (error) {
    console.error('Error filtering products:', error);
    throw error;
  }
};
