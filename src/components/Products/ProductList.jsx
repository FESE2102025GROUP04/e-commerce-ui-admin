import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getProducts, searchProducts, filterProducts } from '../../services/productService';
import { getCategories } from '../../services/categoryService';

const ProductList = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [stockStatus, setStockStatus] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [productsData, categoriesData] = await Promise.all([
          getProducts(),
          getCategories()
        ]);
        setProducts(productsData);
        setCategories(categoriesData);
      } catch (err) {
        setError('Failed to fetch data');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, []);

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!searchTerm) {
      const productsData = await getProducts();
      setProducts(productsData);
      return;
    }
    
    try {
      setLoading(true);
      const results = await searchProducts(searchTerm);
      setProducts(results);
    } catch (err) {
      setError('Failed to search products');
    } finally {
      setLoading(false);
    }
  };

  const handleFilter = async () => {
    try {
      setLoading(true);
      const results = await filterProducts(selectedCategory, stockStatus);
      setProducts(results);
    } catch (err) {
      setError('Failed to filter products');
    } finally {
      setLoading(false);
    }
  };

  const handleClearFilters = async () => {
    setSelectedCategory('');
    setStockStatus('');
    
    try {
      setLoading(true);
      const productsData = await getProducts();
      setProducts(productsData);
    } catch (err) {
      setError('Failed to clear filters');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="text-center py-10">Loading...</div>;
  if (error) return <div className="text-center py-10 text-red-500">{error}</div>;

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold">Product Management</h2>
        <Link 
          to="/products/create" 
          className="bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700"
        >
          Create New Product
        </Link>
      </div>
      
      <div className="bg-white rounded shadow p-6 mb-6">
        <div className="flex flex-wrap gap-4 mb-4">
          {/* Search Form */}
          <form onSubmit={handleSearch} className="flex">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search products..."
              className="border rounded-l px-4 py-2 w-64"
            />
            <button 
              type="submit" 
              className="bg-gray-600 text-white px-4 py-2 rounded-r hover:bg-gray-700"
            >
              Search
            </button>
          </form>
          
          {/* Filter Options */}
          <div className="flex flex-wrap gap-2">
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="border rounded px-4 py-2"
            >
              <option value="">All Categories</option>
              {categories.map(category => (
                <option key={category.id} value={category.id}>{category.categoryName}</option>
              ))}
            </select>
            
            <select
              value={stockStatus}
              onChange={(e) => setStockStatus(e.target.value)}
              className="border rounded px-4 py-2"
            >
              <option value="">All Stock Status</option>
              <option value="available">Available</option>
              <option value="unavailable">Unavailable</option>
            </select>
            
            <button 
              onClick={handleFilter}
              className="bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700"
            >
              Apply Filters
            </button>
            
            <button 
              onClick={handleClearFilters}
              className="bg-gray-300 text-gray-800 px-4 py-2 rounded hover:bg-gray-400"
            >
              Clear Filters
            </button>
          </div>
        </div>
        
        {/* Products Table */}
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white">
            <thead>
              <tr className="bg-gray-100">
                <th className="py-2 px-4 text-left">ID</th>
                <th className="py-2 px-4 text-left">Name</th>
                <th className="py-2 px-4 text-left">Price</th>
                <th className="py-2 px-4 text-left">Category</th>
                <th className="py-2 px-4 text-left">Stock Status</th>
                <th className="py-2 px-4 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.length > 0 ? (
                products.map((product) => (
                  <tr key={product.id} className="border-b hover:bg-gray-50">
                    <td className="py-2 px-4">{product.id}</td>
                    <td className="py-2 px-4">{product.productName}</td>
                    <td className="py-2 px-4">${product.price}</td>
                    <td className="py-2 px-4">{product.Category?.categoryName || 'N/A'}</td>
                    <td className="py-2 px-4">
                      <span className={`px-2 py-1 rounded text-xs 
                        ${product.stockStatus === 'available' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                        {product.stockStatus}
                      </span>
                    </td>
                    <td className="py-2 px-4">
                      <Link 
                        to={`/products/${product.id}`}
                        className="text-blue-600 hover:underline mr-2"
                      >
                        View
                      </Link>
                      <Link 
                        to={`/products/edit/${product.id}`}
                        className="text-green-600 hover:underline"
                      >
                        Edit
                      </Link>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="py-4 text-center">
                    No products found
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

export default ProductList;
