import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getCategoryById, createCategory, updateCategory } from '../../services/categoryService';

const CategoryForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditing = Boolean(id);

  const [formData, setFormData] = useState({
    categoryName: '',
    description: '',
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    const fetchCategory = async () => {
      if (!isEditing) return;

      try {
        setLoading(true);
        const categoryData = await getCategoryById(id);
        setFormData({
          categoryName: categoryData.categoryName || '',
          description: categoryData.description || '',
        });
      } catch (err) {
        setError('Failed to fetch category data');
      } finally {
        setLoading(false);
      }
    };

    fetchCategory();
  }, [id, isEditing]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);
      setError(null);

      if (isEditing) {
        await updateCategory(id, formData);
      } else {
        await createCategory(formData);
      }

      setSuccess(true);
      setTimeout(() => {
        navigate('/dashboard/categories');
      }, 1000);
    } catch (err) {
      setError(`Failed to ${isEditing ? 'update' : 'create'} category`);
    } finally {
      setLoading(false);
    }
  };

  if (loading && isEditing) return <div className="text-center py-10">Loading...</div>;

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-2xl font-semibold">{isEditing ? 'Edit Category' : 'Create Category'}</h2>
      </div>
      
      <div className="bg-white rounded shadow p-6">
        {success && (
          <div className="bg-green-100 text-green-700 p-4 mb-4 rounded">
            Category {isEditing ? 'updated' : 'created'} successfully!
          </div>
        )}
        
        {error && (
          <div className="bg-red-100 text-red-700 p-4 mb-4 rounded">
            {error}
          </div>
        )}
        
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700 mb-2">Category Name *</label>
            <input
              type="text"
              name="categoryName"
              value={formData.categoryName}
              onChange={handleChange}
              required
              className="w-full border rounded px-3 py-2"
            />
          </div>
          
          <div className="mb-4">
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
              disabled={loading}
              className={`bg-gray-600 text-white px-6 py-2 rounded hover:bg-gray-700 ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
            >
              {loading ? 'Processing...' : isEditing ? 'Update Category' : 'Create Category'}
            </button>
            
            <button
              type="button"
              onClick={() => navigate('/dashboard/categories')}
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

export default CategoryForm;
