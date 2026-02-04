import { ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const CategoryCard = ({ category }) => {
  return (
    <div className="relative h-80 rounded-3xl overflow-hidden group cursor-pointer">
      {/* Background Gradient */}
      <div className={`absolute inset-0 bg-gradient-to-br ${category.gradient}`}></div>
      
      {/* Image Placeholder */}
      <div className="absolute inset-0 flex items-center justify-center opacity-40 group-hover:opacity-50 transition">
        <span className="text-white text-6xl">🌸</span>
      </div>

      {/* Content */}
      <div className="relative h-full flex flex-col items-center justify-center p-8 text-center">
        <h3 className="text-white text-3xl font-bold mb-6 drop-shadow-lg">
          {category.name}
        </h3>
        <Link 
          to={category.link}
          className="inline-flex items-center gap-2 bg-pink-600 hover:bg-pink-700 text-white px-6 py-3 rounded-full font-semibold transition transform hover:scale-105 shadow-lg"
        >
          Shop Now
          <ChevronRight size={18} />
        </Link>
      </div>

      {/* Hover Overlay */}
      <div className="absolute inset-0 bg-black/10 opacity-0 group-hover:opacity-100 transition"></div>
    </div>
  );
};

export default CategoryCard;
