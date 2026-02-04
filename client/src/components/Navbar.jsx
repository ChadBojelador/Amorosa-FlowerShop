import { Link } from 'react-router-dom';
import { Search, ShoppingCart, Menu, X, User, LogOut } from 'lucide-react';
import { useState } from 'react';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user, logout, isAuthenticated } = useAuth();

  const handleLogout = () => {
    logout();
    setIsMenuOpen(false);
  };

  return (
    <nav className="shadow-sm sticky top-0 z-50" style={{ backgroundColor: '#ffffff' }}>
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 no-underline">
            <span className="font-bold" style={{ fontFamily: 'Meow Script, cursive', color: '#a20100', fontSize: '3rem', padding: '0.5rem'}}>Amorosa.</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            <Link to="/" className="text-gray-700 hover:text-pink-600 transition">Home</Link>
            <Link to="/bouquets" className="text-gray-700 hover:text-pink-600 transition">Bouquets</Link>
            <Link to="/arrangements" className="text-gray-700 hover:text-pink-600 transition">Arrangements</Link>
            <Link to="/plants" className="text-gray-700 hover:text-pink-600 transition">Plants</Link>
            <Link to="/orchid" className="text-gray-700 hover:text-pink-600 transition">Orchid</Link>
            {user?.role === 'admin' && (
              <Link to="/admin" className="text-pink-600 hover:text-pink-700 transition font-semibold">Admin</Link>
            )}
          </div>

          {/* Icons */}
          <div className="flex items-center gap-4">
            <button className="w-10 h-10 rounded-full bg-pink-600 hover:bg-pink-700 flex items-center justify-center text-white transition">
              <Search size={20} />
            </button>
            <button className="w-10 h-10 rounded-full bg-pink-600 hover:bg-pink-700 flex items-center justify-center text-white transition">
              <ShoppingCart size={20} />
            </button>
            
            {/* User Menu */}
            {isAuthenticated ? (
              <div className="hidden md:flex items-center gap-2">
                <span className="text-sm text-gray-700">Hi, {user?.name}</span>
                <button 
                  onClick={handleLogout}
                  className="w-10 h-10 rounded-full bg-gray-200 hover:bg-gray-300 flex items-center justify-center transition"
                >
                  <LogOut size={18} />
                </button>
              </div>
            ) : (
              <Link 
                to="/login"
                className="hidden md:flex w-10 h-10 rounded-full bg-gray-200 hover:bg-gray-300 items-center justify-center transition"
              >
                <User size={20} />
              </Link>
            )}

            <button 
              className="md:hidden w-10 h-10 flex items-center justify-center"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t">
            <div className="flex flex-col gap-4">
              <Link to="/" className="text-gray-700 hover:text-pink-600 transition">Home</Link>
              <Link to="/bouquets" className="text-gray-700 hover:text-pink-600 transition">Bouquets</Link>
              <Link to="/arrangements" className="text-gray-700 hover:text-pink-600 transition">Arrangements</Link>
              <Link to="/plants" className="text-gray-700 hover:text-pink-600 transition">Plants</Link>
              <Link to="/orchid" className="text-gray-700 hover:text-pink-600 transition">Orchid</Link>
              
              {isAuthenticated ? (
                <>
                  {user?.role === 'admin' && (
                    <Link to="/admin" className="text-pink-600 hover:text-pink-700 transition font-semibold">
                      Admin Dashboard
                    </Link>
                  )}
                  <span className="text-sm text-gray-600">Logged in as {user?.name}</span>
                  <button 
                    onClick={handleLogout}
                    className="text-left text-red-600 hover:text-red-700 transition"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <Link to="/login" className="text-pink-600 hover:text-pink-700 transition font-semibold">
                  Login
                </Link>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
