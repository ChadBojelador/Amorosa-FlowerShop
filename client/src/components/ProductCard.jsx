import { ShoppingCart, Eye, Heart } from 'lucide-react';
import { useState } from 'react';

const ProductCard = ({ product }) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div 
      className="bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 group"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Image Container */}
      <div className="relative h-64 bg-gray-100 overflow-hidden">
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-gray-400">{product.name}</span>
        </div>
        
        {/* Hover Icons */}
        {isHovered && (
          <div className="absolute top-4 right-4 flex flex-col gap-2 animate-fade-in">
            <button className="w-10 h-10 rounded-full bg-pink-600 hover:bg-pink-700 text-white flex items-center justify-center transition shadow-lg">
              <Heart size={18} />
            </button>
            <button className="w-10 h-10 rounded-full bg-pink-600 hover:bg-pink-700 text-white flex items-center justify-center transition shadow-lg">
              <Eye size={18} />
            </button>
          </div>
        )}

        {/* Available Badge */}
        {product.is_available === false && (
          <div className="absolute top-4 left-4 bg-gray-600 text-white px-3 py-1 rounded-full text-sm font-semibold">
            Out of Stock
          </div>
        )}
      </div>

      {/* Product Info */}
      <div className="p-5">
        <h3 className="text-lg font-semibold text-gray-800 mb-2">{product.name}</h3>
        <div className="flex items-center gap-2 mb-4">
          <span className="text-pink-600 font-bold text-xl">${product.base_price}</span>
        </div>

        {/* Action Buttons */}
        <div className="space-y-2">
          <button className="w-full bg-pink-600 hover:bg-pink-700 text-white py-3 rounded-full font-semibold flex items-center justify-center gap-2 transition">
            <ShoppingCart size={18} />
            Select Options
          </button>
          <button className="w-full border-2 border-pink-600 text-pink-600 hover:bg-pink-50 py-3 rounded-full font-semibold transition">
            Quick View
          </button>
          <button className="w-full border-2 border-gray-300 text-gray-700 hover:bg-gray-50 py-3 rounded-full font-semibold transition">
            Compare
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
