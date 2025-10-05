import { useEffect, useMemo, useState } from "react";
import SearchBar from "../components/SearchBar";
import ProductCard from "../components/ProductCard";

const categories = [
  "Laptops",
  "Smartphones",
  "Headphones",
  "Tablets",
  "Smartwatches",
  "Gaming",
  "Cameras",
  "Audio",
  "Accessories"
];

export default function Products() {
  const [selectedCategory, setSelectedCategory] = useState(categories[0]);
  const [products, setProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredProducts, setFilteredProducts] = useState([]);

  useEffect(() => {
    const controller = new AbortController();
    const params = new URLSearchParams();
    if (selectedCategory) params.append('category', selectedCategory);
    if (searchTerm) params.append('q', searchTerm);

    fetch(`http://localhost:5000/api/products?${params.toString()}`, { signal: controller.signal })
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setProducts(data);
          setFilteredProducts(data);
        } else {
          setProducts([]);
          setFilteredProducts([]);
        }
      })
      .catch((error) => {
        if (error.name !== 'AbortError') {
          console.error('Products API error:', error);
          const sampleProducts = getSampleProducts(selectedCategory);
          const filtered = searchTerm
            ? sampleProducts.filter(p => p.name.toLowerCase().includes(searchTerm.toLowerCase()))
            : sampleProducts;
          setProducts(filtered);
          setFilteredProducts(filtered);
        }
      });

    return () => controller.abort();
  }, [selectedCategory, searchTerm]);

  // Client-side filter as a safety net when backend search unavailable
  useEffect(() => {
    if (!searchTerm) {
      setFilteredProducts(products);
      return;
    }
    const needle = searchTerm.toLowerCase();
    const filtered = products.filter(product =>
      (product.name && product.name.toLowerCase().includes(needle)) ||
      (product.description && product.description.toLowerCase().includes(needle)) ||
      (product.category && product.category.toLowerCase().includes(needle))
    );
    setFilteredProducts(filtered);
  }, [searchTerm, products]);

  const getSampleProducts = (category) => {
    const sampleData = {
      "Laptops": [
        { _id: '1', name: 'MacBook Pro 14-inch', price: '₹1,99,900', image: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=400&h=400&fit=crop' },
        { _id: '2', name: 'Dell XPS 13', price: '₹1,25,000', image: 'https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=400&h=400&fit=crop' },
        { _id: '3', name: 'HP Spectre x360', price: '₹1,15,000', image: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=400&h=400&fit=crop' }
      ],
      "Smartphones": [
        { _id: '4', name: 'iPhone 15 Pro', price: '₹1,34,900', image: 'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=400&h=400&fit=crop' },
        { _id: '5', name: 'Samsung Galaxy S24', price: '₹89,999', image: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400&h=400&fit=crop' },
        { _id: '6', name: 'Google Pixel 8', price: '₹75,999', image: 'https://images.unsplash.com/photo-1598300042247-d088f8ab3a91?w=400&h=400&fit=crop' }
      ],
      "Headphones": [
        { _id: '7', name: 'Sony WH-1000XM5', price: '₹29,990', image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=400&fit=crop' },
        { _id: '8', name: 'Bose QuietComfort', price: '₹26,900', image: 'https://images.unsplash.com/photo-1484704849700-f032a568e944?w=400&h=400&fit=crop' },
        { _id: '9', name: 'AirPods Pro', price: '₹24,900', image: 'https://images.unsplash.com/photo-1606220945770-b5b6c2c55bf1?w=400&h=400&fit=crop' }
      ],
      "Gaming": [
        { _id: '10', name: 'PlayStation 5', price: '₹54,990', image: 'https://images.unsplash.com/photo-1606144042614-b2417e99c4e3?w=400&h=400&fit=crop' },
        { _id: '11', name: 'Xbox Series X', price: '₹52,990', image: 'https://images.unsplash.com/photo-1621259182978-fbf93132d53d?w=400&h=400&fit=crop' },
        { _id: '12', name: 'Gaming Keyboard', price: '₹8,999', image: 'https://images.unsplash.com/photo-1541140532154-b024d705b90a?w=400&h=400&fit=crop' }
      ],
      "Smartwatches": [
        { _id: '13', name: 'Apple Watch Series 9', price: '₹45,900', image: 'https://images.unsplash.com/photo-1551816230-ef5deaed4a26?w=400&h=400&fit=crop' },
        { _id: '14', name: 'Samsung Galaxy Watch', price: '₹28,999', image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&h=400&fit=crop' }
      ]
    };
    return sampleData[category] || [];
  };


  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-100">
      <div className="flex">
        {/* Sidebar */}
        <aside className="w-64 bg-white shadow-lg p-6 min-h-screen">
          <h3 className="text-lg font-bold mb-4 text-blue-700">Categories</h3>
          <ul>
            {categories.map(cat => (
              <li key={cat}>
                <button
                  className={`block w-full text-left px-4 py-2 rounded mb-2 transition-colors ${selectedCategory === cat ? "bg-blue-600 text-white shadow-md" : "hover:bg-blue-100 text-gray-700"}`}
                  onClick={() => setSelectedCategory(cat)}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-medium">{cat}</span>
                    {selectedCategory === cat && (
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    )}
                  </div>
                </button>
              </li>
            ))}
          </ul>
          
          {/* Product count for selected category */}
          <div className="mt-6 p-4 bg-blue-50 rounded-lg">
            <h4 className="font-semibold text-blue-700 mb-2">Products in {selectedCategory}</h4>
            <p className="text-blue-600 text-2xl font-bold">{filteredProducts.length}</p>
          </div>
        </aside>

        {/* Products */}
        <main className="flex-1 p-8">
          <h2 className="text-2xl font-bold mb-6 text-blue-700">{selectedCategory}</h2>
          <SearchBar onSearch={setSearchTerm} placeholder={`Search ${selectedCategory.toLowerCase()}...`} />
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {filteredProducts.length === 0 ? (
              <div className="col-span-full text-center py-12">
                <div className="text-gray-500 text-lg">No products found in this category.</div>
                <p className="text-gray-400 mt-2">Try selecting a different category.</p>
              </div>
            ) : (
              filteredProducts.map(product => (
                <ProductCard
                  key={product._id || product.id}
                  id={product._id || product.id}
                  name={product.name}
                  price={product.price}
                  image={product.image}
                  rating={product.rating}
                  originalPrice={product.originalPrice}
                />
              ))
            )}
          </div>
        </main>
      </div>
    </div>
  );
}