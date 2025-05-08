import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout/Layout';
import AdminUserManagement from './components/Page/AdminUserManagement';
import ConsumerUserManagement from './components/Page/ConsumerUserManagement';
import DashboardPage from './components/Page/DashboardPage';

// Product Components
import ProductList from './components/Products/ProductList';
import ProductDetail from './components/Products/ProductDetail';
import ProductForm from './components/Products/ProductForm';

// Category Components
import CategoryList from './components/Categories/CategoryList';
import CategoryForm from './components/Categories/CategoryForm';
import CategoryProducts from './components/Categories/CategoryProducts';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Redirect from root to dashboard */}
        <Route path="/" element={<Navigate to="/dashboard" replace />} />

        {/* Layout wrapper for all /dashboard routes */}
        <Route path="/dashboard" element={<Layout />}>
          <Route index element={<DashboardPage />} />
          <Route path="products" element={<ProductList />} />
          <Route path="products/create" element={<ProductForm />} />
          <Route path="products/edit/:id" element={<ProductForm />} />
          <Route path="products/:id" element={<ProductDetail />} />

          <Route path="categories" element={<CategoryList />} />
          <Route path="categories/create" element={<CategoryForm />} />
          <Route path="categories/edit/:id" element={<CategoryForm />} />
          <Route path="categories/:id/products" element={<CategoryProducts />} />

          <Route path="admin-users" element={<AdminUserManagement />} />
          <Route path="consumer-users" element={<ConsumerUserManagement />} />

          <Route path="*" element={<div>Page Not Found</div>} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
