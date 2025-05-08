import React, { useState } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid
} from 'recharts';
import { ChevronUp, ChevronDown, ChevronLeft, ChevronRight } from 'lucide-react';

const chartData = [
  { name: '22 Jul', sales: 2400 },
  { name: '23 Jul', sales: 1398 },
  { name: '24 Jul', sales: 9800 },
  { name: '25 Jul', sales: 3908 },
  { name: '26 Jul', sales: 4800 },
  { name: '27 Jul', sales: 3800 },
  { name: '28 Jul', sales: 4300 },
  { name: '29 Jul', sales: 6400 }
];

const productDetails = {
  'Air Jordan 8': 'Classic high-top silhouette from the Jordan line with excellent ankle support.',
  'Air Jordan 5': 'Known for its reflective tongue and lace locks, great for collectors.',
  'Air Jordan 13': 'Famous for its panther-inspired design and comfort.',
  'Nike Air Max': 'Lightweight and comfortable running shoes with visible air units.',
  'Nike': 'Popular general line including lifestyle and athletic wear shoes.'
};

const DashboardPage = () => {
  const [selectedMonth, setSelectedMonth] = useState('Jul 2023');
  const [monthPickerOpen, setMonthPickerOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);

  return (
    <>
      {/* Summary Cards */}
      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        {[{ label: 'Total Revenue', value: '$82,650', change: '11%', color: 'green' },
          { label: 'Total Orders', value: '1,645', change: '11%', color: 'green' },
          { label: 'Total Customers', value: '1,462', change: '17%', color: 'amber' },
          { label: 'Pending', value: '11', change: null, color: null }
        ].map(({ label, value, change, color }) => (
          <div
            key={label}
            className="bg-white rounded-lg p-5 shadow hover:shadow-md transition cursor-pointer"
            onClick={() => setSelectedProduct(label)}
          >
            <div className="flex justify-between items-center mb-2">
              <div>
                <h3 className="text-sm font-semibold text-gray-700">{label}</h3>
                <p className="text-xs text-gray-400">Last 30 days</p>
              </div>
              {change && (
                <div className={`flex items-center text-sm text-${color}-500`}>
                  <ChevronUp size={16} />
                  <span>{change}</span>
                </div>
              )}
            </div>
            <h2 className="text-3xl font-bold">{value}</h2>
          </div>
        ))}
      </section>

      {/* Sales Chart */}
      <section className="bg-white rounded-lg p-6 shadow mb-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">Sales Analytics</h3>
          <div
            className="flex items-center border border-gray-200 rounded px-3 py-1 text-sm cursor-pointer"
            onClick={() => setMonthPickerOpen(!monthPickerOpen)}
          >
            <span>{selectedMonth}</span>
            <ChevronDown size={16} className="ml-2" />
          </div>
        </div>
        <div className="h-48">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" stroke="#6B7280" />
              <YAxis stroke="#6B7280" />
              <Tooltip />
              <Bar dataKey="sales" fill="#10B981" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </section>

      {/* Product Section */}
      <section className="bg-white rounded-lg p-6 shadow mb-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">Top Selling Products</h3>
          <div className="flex space-x-2">
            <button className="p-1 rounded border border-gray-200">
              <ChevronLeft size={18} />
            </button>
            <button className="p-1 rounded border border-gray-200">
              <ChevronRight size={18} />
            </button>
          </div>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
          {Object.keys(productDetails).map((product, index) => (
            <button
              key={index}
              onClick={() => setSelectedProduct(product)}
              className="border border-gray-200 rounded-md p-3 text-center hover:shadow transition bg-white w-full"
            >
              <div className="bg-gray-200 h-24 rounded-md mb-2"></div>
              <h4 className="font-medium">{product}</h4>
              <p className="text-xs text-gray-500">752 Pcs</p>
            </button>
          ))}
        </div>
      </section>

      {/* Product Details */}
      {selectedProduct && (
        <section className="bg-white rounded-lg p-6 shadow">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold">Details</h3>
            <button
              onClick={() => setSelectedProduct(null)}
              className="text-sm text-red-500 hover:underline"
            >
              Close
            </button>
          </div>
          <div className="text-gray-700">
            <p>
              <strong>{selectedProduct}</strong>: {productDetails[selectedProduct] || 'No description available'}
            </p>
          </div>
        </section>
      )}
    </>
  );
};

export default DashboardPage;
