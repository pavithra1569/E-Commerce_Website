import { Link } from "react-router-dom";
import { useState, useEffect } from "react";

export default function Navbar() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [cartCount, setCartCount] = useState(0);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const checkAuthStatus = () => {
      const token = localStorage.getItem("token");
      const userData = localStorage.getItem("user");
      setIsLoggedIn(!!token);
      
      if (userData) {
        try {
          setUser(JSON.parse(userData));
        } catch (e) {
          setUser(null);
        }
      }
      
      if (token && userData) {
        // Get user-specific cart count from localStorage
        try {
          const user = JSON.parse(userData);
          const userCartKey = `cart_${user.email}`;
          const localCart = localStorage.getItem(userCartKey);
          if (localCart) {
            const cart = JSON.parse(localCart);
            setCartCount(cart.reduce((total, item) => total + (item.quantity || 1), 0));
          } else {
            setCartCount(0);
          }
        } catch (e) {
          setCartCount(0);
        }
      } else {
        setCartCount(0);
      }
    };

    checkAuthStatus();

    // Listen for auth state changes and cart updates
    window.addEventListener('authStateChanged', checkAuthStatus);
    window.addEventListener('storage', checkAuthStatus);
    window.addEventListener('cartUpdated', checkAuthStatus);

    return () => {
      window.removeEventListener('authStateChanged', checkAuthStatus);
      window.removeEventListener('storage', checkAuthStatus);
      window.removeEventListener('cartUpdated', checkAuthStatus);
    };
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    setIsLoggedIn(false);
    setCartCount(0);
    window.location.href = "/";
  };

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto flex justify-between items-center p-4">
        <Link to="/" className="text-2xl font-bold text-blue-600 hover:text-blue-800 transition-colors">
          ShopSphere
        </Link>
        
        <div className="flex items-center gap-6">
          <Link to="/" className="hover:text-blue-600 transition-colors font-medium">Home</Link>
          <Link to="/products" className="hover:text-blue-600 transition-colors font-medium">Products</Link>
          
          {isLoggedIn ? (
            <>
              <Link to="/cart" className="relative hover:text-blue-600 transition-colors font-medium flex items-center">
                <svg className="w-6 h-6 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-1.5 6M7 13l-1.5 6m0 0h9M17 21v-2a2 2 0 00-2-2H9a2 2 0 00-2 2v2" />
                </svg>
                Cart
                {cartCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                    {cartCount}
                  </span>
                )}
              </Link>
              <Link to="/account" className="text-gray-700 hover:text-blue-600 transition-colors">
                Account
              </Link>
              {user && user.email === 'admin@shopsphere.com' && (
                <Link to="/admin" className="text-gray-700 hover:text-blue-600 transition-colors">
                  Admin
                </Link>
              )}
              <button 
                onClick={handleLogout}
                className="bg-red-500 text-white px-4 py-2 rounded-full hover:bg-red-600 transition-colors font-medium"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="hover:text-blue-600 transition-colors font-medium">Login</Link>
              <Link to="/signup" className="bg-blue-600 text-white px-4 py-2 rounded-full hover:bg-blue-700 transition-colors font-medium">Sign Up</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
