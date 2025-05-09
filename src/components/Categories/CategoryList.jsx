import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getCategories, searchCategories } from '../../services/categoryService';

const CategoryList = () => {
  const [categories, setCategories] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoading(true);
        const categoriesData = await getCategories();
        setCategories(categoriesData);
      } catch (err) {
        setError('Failed to fetch categories');
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!searchTerm) {
      const categoriesData = await getCategories();
      setCategories(categoriesData);
      return;
    }

    try {
      setLoading(true);
      const results = await searchCategories(searchTerm);
      setCategories(results);
    } catch (err) {
      setError('Failed to search categories');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="text-center py-10">Loading...</div>;
  if (error) return <div className="text-center py-10 text-red-500">{error}</div>;

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold">Category Management</h2>
        <Link 
          to="/dashboard/categories/create" 
          className="bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700"
        >
          Create New Category
        </Link>
      </div>
      
      <div className="bg-white rounded shadow p-6 mb-6">
        <div className="flex flex-wrap gap-4 mb-4">
          <form onSubmit={handleSearch} className="flex">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search categories..."
              className="border rounded-l px-4 py-2 w-64"
            />
            <button 
              type="submit" 
              className="bg-gray-600 text-white px-4 py-2 rounded-r hover:bg-gray-700"
            >
              Search
            </button>
          </form>
        </div>

        {/* Categories Table */}
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white">
            <thead>
              <tr className="bg-gray-100">
                <th className="py-2 px-4 text-left">ID</th>
                <th className="py-2 px-4 text-left">Category Name</th>
                <th className="py-2 px-4 text-left">Description</th>
                <th className="py-2 px-4 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {categories.length > 0 ? (
                categories.map((category) => (
                  <tr key={category.id} className="border-b hover:bg-gray-50">
                    <td className="py-2 px-4">{category.id}</td>
                    <td className="py-2 px-4">{category.categoryName}</td>
                    <td className="py-2 px-4">
                      {category.description ? 
                        (category.description.length > 50 ? 
                          `${category.description.substring(0, 50)}...` : 
                          category.description) : 
                        'No description'}
                    </td>
                    <td className="py-2 px-4">
                      <Link 
                        to={`/dashboard/categories/${category.id}/products`}
                        className="text-blue-600 hover:underline mr-2"
                      >
                        View
                      </Link>
                      <Link 
                        to={`/dashboard/categories/edit/${category.id}`}
                        className="text-green-600 hover:underline"
                      >
                        Edit
                      </Link>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4" className="py-4 text-center">
                    No categories found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default CategoryList;
