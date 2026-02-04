import { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import bg1 from '../assets/bg1.svg';

const Hero = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  const slides = [
    {
      title: "Special Smells",
      subtitle: "Special Bouquets",
      description: "Discover our top-rated flowers!",
      buttonText: "Get Started",
      bgImage: bg1
    },
    {
      title: "Elegant Arrangements",
      subtitle: "For Every Occasion",
      description: "Handcrafted with love and care",
      buttonText: "Shop Collection",
      bgColor: "from-purple-200 to-pink-100"
    }
  ];

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  return (
    <div className="relative flex justify-center py-4 px-4">
      <div 
        className={`relative transition-all duration-500 min-h-[60vh] flex items-center w-full max-w-[1400px] overflow-hidden ${slides[currentSlide].bgColor ? `bg-gradient-to-r ${slides[currentSlide].bgColor}` : ''}`}
        style={slides[currentSlide].bgImage ? { 
          backgroundImage: `url(${slides[currentSlide].bgImage})`, 
          backgroundSize: 'cover', 
          backgroundPosition: 'center right', 
          backgroundRepeat: 'no-repeat',
          borderRadius: '1.5rem'
        } : { borderRadius: '1.5rem' }}
      >
        <div className="container mx-auto px-4 py-16 md:py-24">
          <div className="flex items-center">
            {/* Text Content */}
            <div className="text-left space-y-6 w-1/2 pl-24">
              <h1 className="text-5xl md:text-6xl font-bold text-black leading-tight" style={{ fontFamily: 'Inter, sans-serif' }}>
                {slides[currentSlide].title}
                <br />
                <span className="text-black">{slides[currentSlide].subtitle}</span>
              </h1>
              <p className="text-black text-lg" style={{ fontFamily: 'Inter, sans-serif' }}>
                {slides[currentSlide].description}
              </p>
              <Link 
                to="/bouquets" 
                className="inline-flex items-center gap-2 text-black px-10 py-5 rounded-full font-semibold transition transform hover:scale-105 shadow-lg no-underline text-3xl"
                style={{ fontFamily: 'Inter, sans-serif', backgroundColor: '#ec4899', textDecoration: 'none' }}
              >
                {slides[currentSlide].buttonText}
              </Link>
            </div>

           
          </div>
        </div>

        {/* Navigation Arrows */}
        <button
          onClick={prevSlide}
          className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-pink-600 hover:bg-pink-700 text-white flex items-center justify-center transition shadow-lg z-10"
        >
          <ChevronLeft size={24} />
        </button>
        <button
          onClick={nextSlide}
          className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-pink-600 hover:bg-pink-700 text-white flex items-center justify-center transition shadow-lg z-10"
        >
          <ChevronRight size={24} />
        </button>
      </div>
    </div>
  );
};

export default Hero;
