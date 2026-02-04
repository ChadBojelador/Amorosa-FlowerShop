import { useState, useEffect } from 'react';
import { ChevronDown } from 'lucide-react';
import ProductCard from '../components/ProductCard';
import { bouquetAPI } from '../services/apiService';

const Shop = () => {
  const [sortBy, setSortBy] = useState('default');
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchBouquets();
  }, []);

  const fetchBouquets = async () => {
    try {
      setLoading(true);
      const data = await bouquetAPI.getAll();
      setProducts(data);
    } catch (err) {
      setError('Failed to load bouquets');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#ffffff' }}>
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-800 mb-2">All Bouquets</h1>
            <p className="text-gray-600">
              {loading ? 'Loading...' : `Showing all ${products.length} results`}
            </p>
          </div>

          {/* Sort Dropdown */}
          <div className="relative">
            <select 
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="appearance-none bg-white border-2 border-gray-200 rounded-lg px-6 py-3 pr-10 text-gray-700 font-medium focus:outline-none focus:border-pink-600 cursor-pointer"
            >
              <option value="default">Default sorting</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="name">Name: A to Z</option>
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={20} />
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg mb-6">
            {error}
          </div>
        )}

        {/* Products Grid */}
        {loading ? (
          <div className="text-center py-12">
            <p className="text-gray-500">Loading bouquets...</p>
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500">No bouquets available</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {products.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        )}

        {/* Pagination */}
        {!loading && products.length > 0 && (
          <div className="flex justify-center gap-2 mt-12">
            <button className="w-10 h-10 rounded-lg border-2 border-gray-300 hover:border-pink-600 hover:text-pink-600 flex items-center justify-center transition">
              1
            </button>
            <button className="w-10 h-10 rounded-lg bg-pink-600 text-white flex items-center justify-center">
              2
            </button>
            <button className="w-10 h-10 rounded-lg border-2 border-gray-300 hover:border-pink-600 hover:text-pink-600 flex items-center justify-center transition">
              3
            </button>
            <button className="w-10 h-10 rounded-lg border-2 border-gray-300 hover:border-pink-600 hover:text-pink-600 flex items-center justify-center transition">
              →
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Shop;
