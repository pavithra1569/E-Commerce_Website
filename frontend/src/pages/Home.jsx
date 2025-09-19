import ProductCard from "../components/ProductCard";
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import laptopImg from "../assets/images/laptop.jpeg";
import smartphoneImg from "../assets/images/smartphone.jpeg";
import headphoneImg from "../assets/images/headphone.jpeg";

export default function Home() {
  const [featuredProducts, setFeaturedProducts] = useState([]);

  useEffect(() => {
    // Fetch featured products from backend
    fetch("http://localhost:5000/api/products")
      .then(res => res.json())
      .then(data => {
        // Get first 8 products as featured
        setFeaturedProducts(data.slice(0, 8));
      })
      .catch(err => console.error('Failed to fetch products:', err));
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-100">
      {/* Hero Section */}
      <section className="flex flex-col items-center justify-center py-16 bg-white shadow">
        <div className="max-w-4xl w-full flex flex-col md:flex-row items-center gap-8 px-6">
          <img
            src={laptopImg}
            alt="ShopSphere Hero"
            className="rounded-xl shadow-md h-56 w-56 object-contain bg-gray-100 p-4 mb-6 md:mb-0"
          />
          <div className="text-center md:text-left">
            <h1 className="text-5xl font-extrabold mb-4 text-blue-700">
              Welcome to ShopSphere
            </h1>
            <p className="text-gray-600 mb-6 text-lg">
              Discover the latest electronics, gadgets, and accessories at unbeatable prices.
            </p>
            <Link to="/products" className="bg-blue-600 text-white px-8 py-3 rounded-full font-semibold text-lg shadow hover:bg-blue-700 transition duration-200 inline-block">
              Shop Now
            </Link>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="max-w-7xl mx-auto mt-12 px-4">
        <h2 className="text-2xl font-bold mb-6 text-blue-700">Shop by Category</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
          <div className="bg-white rounded-xl shadow p-6 flex flex-col items-center hover:shadow-lg transition-shadow cursor-pointer">
            <img
              src={laptopImg}
              alt="Laptops"
              className="h-28 w-28 object-contain bg-gray-100 p-2 mb-2 rounded-lg"
            />
            <span className="font-semibold mt-2">Laptops</span>
          </div>
          <div className="bg-white rounded-xl shadow p-6 flex flex-col items-center hover:shadow-lg transition-shadow cursor-pointer">
            <img
              src={smartphoneImg}
              alt="Smartphones"
              className="h-28 w-28 object-contain bg-gray-100 p-2 mb-2 rounded-lg"
            />
            <span className="font-semibold mt-2">Smartphones</span>
          </div>
          <div className="bg-white rounded-xl shadow p-6 flex flex-col items-center hover:shadow-lg transition-shadow cursor-pointer">
            <img
              src={headphoneImg}
              alt="Headphones"
              className="h-28 w-28 object-contain bg-gray-100 p-2 mb-2 rounded-lg"
            />
            <span className="font-semibold mt-2">Headphones</span>
          </div>
          <div className="bg-white rounded-xl shadow p-6 flex flex-col items-center hover:shadow-lg transition-shadow cursor-pointer">
            <div className="h-28 w-28 bg-gradient-to-br from-purple-400 to-purple-600 rounded-lg flex items-center justify-center mb-2">
              <span className="text-white text-2xl font-bold">⌚</span>
            </div>
            <span className="font-semibold mt-2">Smartwatches</span>
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="max-w-7xl mx-auto mt-16 px-4">
        <h2 className="text-2xl font-bold mb-6 text-blue-700">Featured Products</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
          {featuredProducts.length > 0 ? (
            featuredProducts.map(product => (
              <ProductCard
                key={product._id}
                id={product._id}
                name={product.name}
                price={product.price}
                image={product.image}
                rating={4.5}
                className="hover:scale-105 transition-transform duration-200"
              />
            ))
          ) : (
            // Fallback products while loading
            <>
              <ProductCard
                name="MacBook Pro 14-inch"
                price="₹1,99,900"
                originalPrice="₹2,19,900"
                image={laptopImg}
                rating={4.8}
                className="hover:scale-105 transition-transform duration-200"
              />
              <ProductCard
                name="iPhone 15 Pro"
                price="₹1,34,900"
                image={smartphoneImg}
                rating={4.7}
                className="hover:scale-105 transition-transform duration-200"
              />
              <ProductCard
                name="Sony WH-1000XM5"
                price="₹29,990"
                originalPrice="₹34,990"
                image={headphoneImg}
                rating={4.6}
                className="hover:scale-105 transition-transform duration-200"
              />
              <ProductCard
                name="Logitech MX Master 3S"
                price="₹8,995"
                image="https://images.unsplash.com/photo-1527814050087-3793815479db?w=300&h=300&fit=crop"
                rating={4.5}
                className="hover:scale-105 transition-transform duration-200"
              />
            </>
          )}
        </div>
      </section>
    </div>
  );
}
