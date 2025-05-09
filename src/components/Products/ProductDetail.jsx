import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getProductById } from '../../services/productService';

const ProductDetail = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        const productData = await getProductById(id);
        setProduct(productData);
      } catch (err) {
        setError('Failed to fetch product details');
      } finally {
        setLoading(false);
      }
    };
    
    fetchProduct();
  }, [id]);

  if (loading) return <div className="text-center py-10">Loading...</div>;
  if (error) return <div className="text-center py-10 text-red-500">{error}</div>;
  if (!product) return <div className="text-center py-10">Product not found</div>;

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold">Product Detail</h2>
        <div>
          <Link 
            to="/dashboard/products" 
            className="bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700 mr-2"
          >
            Back to List
          </Link>
          <Link 
            to={`/dashboard/products/edit/${product.id}`}
            className="bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700"
          >
            Edit Product
          </Link>
        </div>
      </div>
      
      <div className="bg-white rounded shadow p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <div className="bg-gray-100 p-4 rounded h-64 flex items-center justify-center">
              {product.imageUrl ? (
                <img 
                  src={product.imageUrl} 
                  alt={product.productName}
                  className="max-h-full max-w-full object-contain"
                />
              ) : (
                <div className="text-gray-400">No image available</div>
              )}
            </div>
          </div>
          
          <div>
            <h3 className="text-xl font-semibold mb-2">{product.productName}</h3>
            <p className="text-gray-500 mb-4">ID: {product.id}</p>
            
            <div className="mb-4">
              <span className="font-medium">Price:</span> ${product.price}
            </div>
            
            <div className="mb-4">
              <span className="font-medium">Category:</span> {product.Category?.categoryName || 'N/A'}
            </div>
            
            <div className="mb-4">
              <span className="font-medium">Stock Status:</span> 
              <span className={`ml-2 px-2 py-1 rounded text-xs 
                ${product.stockStatus === 'available' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                {product.stockStatus}
              </span>
            </div>
          </div>
        </div>
        
        <div className="mt-6">
          <h4 className="font-medium mb-2">Description:</h4>
          <p className="text-gray-700">{product.description || 'No description available'}</p>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
