import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useState, useEffect } from 'react';
import Hero from '../components/Hero';
import ProductCard from '../components/ProductCard';
import CategoryCard from '../components/CategoryCard';
import { bouquetAPI } from '../services/apiService';

const Home = () => {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchFeaturedProducts();
  }, []);

  const fetchFeaturedProducts = async () => {
    try {
      const data = await bouquetAPI.getAll();
      setFeaturedProducts(data.slice(0, 4)); // Get first 4 products
    } catch (err) {
      console.error('Failed to fetch products:', err);
    } finally {
      setLoading(false);
    }
  };

  const categories = [
    { 
      name: 'Private Events', 
      gradient: 'from-pink-400 to-pink-300',
      link: '/events'
    },
    { 
      name: 'Flora', 
      gradient: 'from-orange-400 to-pink-400',
      link: '/bouquets'
    },
    { 
      name: 'Weddings', 
      gradient: 'from-pink-500 to-purple-400',
      link: '/weddings'
    }
  ];

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#ffffff' }}>
      {/* Hero Section */}
      <Hero />

      {/* Featured Products Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl font-bold text-gray-800">Featured Bouquets</h2>
            <div className="flex gap-2">
              <button className="w-10 h-10 rounded-full border-2 border-pink-600 text-pink-600 hover:bg-pink-600 hover:text-white flex items-center justify-center transition">
                <ChevronLeft size={20} />
              </button>
              <button className="w-10 h-10 rounded-full border-2 border-pink-600 text-pink-600 hover:bg-pink-600 hover:text-white flex items-center justify-center transition">
                <ChevronRight size={20} />
              </button>
            </div>
          </div>

          {loading ? (
            <div className="text-center py-12">
              <p className="text-gray-500">Loading products...</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {featuredProducts.map((product) => (
                <ProductCard key={product._id} product={product} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-gray-800 mb-8 text-center">Shop by Category</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {categories.map((category, index) => (
              <CategoryCard key={index} category={category} />
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
