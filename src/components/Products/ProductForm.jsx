import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getProductById, createProduct, updateProduct } from '../../services/productService';
import { getCategories } from '../../services/categoryService';
import { uploadImage } from '../../services/uploadService';

const ProductForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditing = Boolean(id);
  const fileInputRef = useRef(null);
  
  const [formData, setFormData] = useState({
    productName: '',
    description: '',
    price: '',
    stockStatus: 'available',
    imageUrl: '',
    categoryId: '',
  });
  
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState('');
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Fetch categories
        const categoriesData = await getCategories();
        setCategories(categoriesData);
        
        // If editing, fetch product data
        if (isEditing) {
          const productData = await getProductById(id);
          setFormData({
            productName: productData.productName || '',
            description: productData.description || '',
            price: productData.price || '',
            stockStatus: productData.stockStatus || 'available',
            imageUrl: productData.imageUrl || '',
            categoryId: productData.categoryId || '',
          });
          
          // Set image preview if image URL exists
          if (productData.imageUrl) {
            setImagePreview(productData.imageUrl);
          }
        }
      } catch (err) {
        setError('Failed to fetch data');
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, [id, isEditing]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };
  
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      
      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };
  
  const handleImageUpload = async () => {
    if (!imageFile) return null;
    
    try {
      setIsUploading(true);
      setUploadProgress(10);
      
      // Mock progress (in a real app, you'd use Axios progress events)
      const progressInterval = setInterval(() => {
        setUploadProgress(prev => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return 90;
          }
          return prev + 10;
        });
      }, 300);
      
      // Upload image
      const result = await uploadImage(imageFile);
      
      // Clear interval and set to 100%
      clearInterval(progressInterval);
      setUploadProgress(100);
      
      return result.fileUrl;
    } catch (err) {
      setError('Failed to upload image');
      return null;
    } finally {
      setIsUploading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      setLoading(true);
      setError(null);
      
      // Handle image upload if there's a file
      let finalImageUrl = formData.imageUrl;
      if (imageFile) {
        const uploadedImageUrl = await handleImageUpload();
        if (uploadedImageUrl) {
          finalImageUrl = uploadedImageUrl;
        }
      }
      
      // Format data for API
      const productData = {
        ...formData,
        price: parseFloat(formData.price),
        categoryId: parseInt(formData.categoryId),
        imageUrl: finalImageUrl
      };
      
      if (isEditing) {
        await updateProduct(id, productData);
      } else {
        await createProduct(productData);
      }
      
      setSuccess(true);
      setTimeout(() => {
        navigate('/dashboard/products');
      }, 1500);
    } catch (err) {
      setError(`Failed to ${isEditing ? 'update' : 'create'} product`);
    } finally {
      setLoading(false);
    }
  };
  
  const triggerFileInput = () => {
    fileInputRef.current.click();
  };
  
  const removeImage = () => {
    setImageFile(null);
    setImagePreview('');
    setFormData({
      ...formData,
      imageUrl: ''
    });
    
    // Reset file input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  if (loading && !isEditing) return <div className="text-center py-10">Loading...</div>;

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-2xl font-semibold">{isEditing ? 'Edit Product' : 'Create Product'}</h2>
      </div>
      
      <div className="bg-white rounded shadow p-6">
        {success && (
          <div className="bg-green-100 text-green-700 p-4 mb-4 rounded">
            Product {isEditing ? 'updated' : 'created'} successfully!
          </div>
        )}
        
        {error && (
          <div className="bg-red-100 text-red-700 p-4 mb-4 rounded">
            {error}
          </div>
        )}
        
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-gray-700 mb-2">Product Name *</label>
              <input
                type="text"
                name="productName"
                value={formData.productName}
                onChange={handleChange}
                required
                className="w-full border rounded px-3 py-2"
              />
            </div>
            
            <div>
              <label className="block text-gray-700 mb-2">Price *</label>
              <input
                type="number"
                name="price"
                value={formData.price}
                onChange={handleChange}
                required
                step="0.01"
                min="0"
                className="w-full border rounded px-3 py-2"
              />
            </div>
            
            <div>
              <label className="block text-gray-700 mb-2">Category *</label>
              <select
                name="categoryId"
                value={formData.categoryId}
                onChange={handleChange}
                required
                className="w-full border rounded px-3 py-2"
              >
                <option value="">Select Category</option>
                {categories.map(category => (
                  <option key={category.id} value={category.id}>
                    {category.categoryName}
                  </option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="block text-gray-700 mb-2">Stock Status</label>
              <select
                name="stockStatus"
                value={formData.stockStatus}
                onChange={handleChange}
                className="w-full border rounded px-3 py-2"
              >
                <option value="available">Available</option>
                <option value="unavailable">Unavailable</option>
              </select>
            </div>
          </div>
          
          <div className="mt-6">
            <label className="block text-gray-700 mb-2">Product Image</label>
            <div className="border rounded p-4">
              <div className="flex flex-col items-center">
                {/* Hidden file input */}
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleImageChange}
                  accept="image/*"
                  className="hidden"
                />
                
                {/* Image preview */}
                {imagePreview ? (
                  <div className="mb-4">
                    <div className="relative">
                      <img
                        src={imagePreview}
                        alt="Product preview"
                        className="h-48 object-contain rounded"
                      />
                      <button
                        type="button"
                        onClick={removeImage}
                        className="absolute top-0 right-0 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center"
                      >
                        ×
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="mb-4 border-2 border-dashed border-gray-300 rounded-lg p-8 w-full flex flex-col items-center justify-center text-gray-500">
                    <svg className="w-12 h-12 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <p>No image selected</p>
                  </div>
                )}
                
                {/* Upload progress */}
                {isUploading && (
                  <div className="w-full mb-4">
                    <div className="bg-gray-200 rounded-full h-2 dark:bg-gray-700 w-full mb-1">
                      <div className="bg-gray-600 h-2 rounded-full" style={{ width: `${uploadProgress}%` }}></div>
                    </div>
                    <p className="text-xs text-gray-500 text-center">{uploadProgress}% Uploaded</p>
                  </div>
                )}
                
                {/* Upload button */}
                <button
                  type="button"
                  onClick={triggerFileInput}
                  className="bg-gray-200 text-gray-700 px-4 py-2 rounded hover:bg-gray-300 flex items-center"
                >
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                  </svg>
                  {imagePreview ? 'Change Image' : 'Upload Image'}
                </button>
              </div>
            </div>
          </div>
          
          <div className="mt-6">
            <label className="block text-gray-700 mb-2">Description</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows="4"
              className="w-full border rounded px-3 py-2"
            />
          </div>
          
          <div className="mt-6 flex items-center">
            <button
              type="submit"
              disabled={loading || isUploading}
              className={`bg-gray-600 text-white px-6 py-2 rounded hover:bg-gray-700 ${(loading || isUploading) ? 'opacity-70 cursor-not-allowed' : ''}`}
            >
              {loading ? 'Processing...' : isEditing ? 'Update Product' : 'Create Product'}
            </button>
            
            <button
              type="button"
              onClick={() => navigate('/dashboard/products')}
              className="ml-4 bg-gray-300 text-gray-800 px-6 py-2 rounded hover:bg-gray-400"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProductForm;
