import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="bg-blue-600 text-white py-12 mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-lg font-semibold mb-4">ShopSphere</h3>
            <p className="text-blue-200">Your one-stop destination for premium electronics and gadgets.</p>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li><Link to="/products" className="text-blue-200 hover:text-white transition-colors">Products</Link></li>
              <li><Link to="/account" className="text-blue-200 hover:text-white transition-colors">Account</Link></li>
              <li><Link to="/cart" className="text-blue-200 hover:text-white transition-colors">Cart</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4">Categories</h3>
            <ul className="space-y-2">
              <li><span className="text-blue-200">Laptops</span></li>
              <li><span className="text-blue-200">Smartphones</span></li>
              <li><span className="text-blue-200">Headphones</span></li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4">Admin</h3>
            <ul className="space-y-2">
              <li><Link to="/admin-login" className="text-blue-200 hover:text-white transition-colors">Admin Login</Link></li>
            </ul>
          </div>
        </div>
        <div className="border-t border-blue-500 mt-8 pt-8 text-center">
          <p className="text-blue-200">&copy; 2025 ShopSphere. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
