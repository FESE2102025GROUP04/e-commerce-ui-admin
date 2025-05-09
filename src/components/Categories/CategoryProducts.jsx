import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getProductsByCategory } from '../../services/categoryService';

const CategoryProducts = () => {
  const { id } = useParams();
  const [categoryData, setCategoryData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCategoryProducts = async () => {
      try {
        setLoading(true);
        const data = await getProductsByCategory(id);
        setCategoryData(data);
      } catch (err) {
        setError('Failed to fetch category products');
      } finally {
        setLoading(false);
      }
    };
    
    fetchCategoryProducts();
  }, [id]);

  if (loading) return <div className="text-center py-10">Loading...</div>;
  if (error) return <div className="text-center py-10 text-red-500">{error}</div>;
  if (!categoryData) return <div className="text-center py-10">Category not found</div>;

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-semibold">Products in {categoryData.category.categoryName}</h2>
          <p className="text-gray-600">{categoryData.category.description}</p>
        </div>
        <div>
          <Link 
            to="/dashboard/categories" 
            className="bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700 mr-2"
          >
            Back to Categories
          </Link>
          <Link 
            to="/dashboard/products/create" 
            className="bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700"
          >
            Add Product
          </Link>
        </div>
      </div>
      
      <div className="bg-white rounded shadow p-6">
        {categoryData.products.length === 0 ? (
          <div className="text-center py-10 text-gray-500">
            No products in this category.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white">
              <thead>
                <tr className="bg-gray-100">
                  <th className="py-2 px-4 text-left">ID</th>
                  <th className="py-2 px-4 text-left">Name</th>
                  <th className="py-2 px-4 text-left">Price</th>
                  <th className="py-2 px-4 text-left">Stock Status</th>
                  <th className="py-2 px-4 text-left">Actions</th>
                </tr>
              </thead>
              <tbody>
                {categoryData.products.map(product => (
                  <tr key={product.id} className="border-b hover:bg-gray-50">
                    <td className="py-2 px-4">{product.id}</td>
                    <td className="py-2 px-4">{product.name}</td>
                    <td className="py-2 px-4">${product.price}</td>
                    <td className="py-2 px-4">
                      <span className={`px-2 py-1 rounded text-xs 
                        ${product.stockStatus === 'available' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                        {product.stockStatus}
                      </span>
                    </td>
                    <td className="py-2 px-4">
                      <Link 
                        to={`/dashboard/products/${product.id}`}
                        className="text-blue-600 hover:underline mr-2"
                      >
                        View
                      </Link>
                      <Link 
                        to={`/dashboard/products/edit/${product.id}`}
                        className="text-green-600 hover:underline"
                      >
                        Edit
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default CategoryProducts;
