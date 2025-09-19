import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

export default function ProductDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    fetch(`http://localhost:5000/api/products/${id}`)
      .then((res) => res.json())
      .then((data) => {
        setProduct(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [id]);

  const handleAddToCart = () => {
    const token = localStorage.getItem("token");
    fetch("http://localhost:5000/api/cart", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ productId: id, quantity }),
    })
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          const event = new CustomEvent('showToast', { 
            detail: { message: 'Product added to cart!', type: 'success' } 
          });
          window.dispatchEvent(event);
        }
      });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading product details...</p>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-100 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Product Not Found</h2>
          <button 
            onClick={() => navigate('/products')}
            className="bg-blue-600 text-white px-6 py-2 rounded-full hover:bg-blue-700 transition-colors"
          >
            Back to Products
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-100">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <button 
          onClick={() => navigate(-1)}
          className="mb-6 flex items-center text-blue-600 hover:text-blue-800 transition-colors"
        >
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back
        </button>

        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 p-8">
            {/* Product Image */}
            <div className="flex justify-center">
              <img
                src={product.image}
                alt={product.name}
                className="w-full max-w-md h-96 object-contain rounded-lg"
              />
            </div>

            {/* Product Info */}
            <div className="space-y-6">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">{product.name}</h1>
                <p className="text-gray-600">{product.category}</p>
              </div>

              {/* Rating */}
              <div className="flex items-center space-x-2">
                <div className="flex text-yellow-400">
                  {[...Array(5)].map((_, i) => (
                    <span key={i} className={i < Math.floor(product.rating || 4.5) ? "★" : "☆"}>
                      ★
                    </span>
                  ))}
                </div>
                <span className="text-gray-600">({product.rating || 4.5})</span>
                <span className="text-gray-400">• 128 reviews</span>
              </div>

              {/* Price */}
              <div className="space-y-2">
                <div className="flex items-center space-x-3">
                  <span className="text-3xl font-bold text-blue-600">{product.price}</span>
                  {product.originalPrice && (
                    <span className="text-xl text-gray-500 line-through">{product.originalPrice}</span>
                  )}
                </div>
                {product.originalPrice && (
                  <span className="inline-block bg-red-100 text-red-800 text-sm px-2 py-1 rounded-full">
                    Save ₹{parseInt(product.originalPrice.replace(/[₹,]/g, '')) - parseInt(product.price.replace(/[₹,]/g, ''))}
                  </span>
                )}
              </div>

              {/* Description */}
              <div>
                <h3 className="text-lg font-semibold mb-2">Description</h3>
                <p className="text-gray-600 leading-relaxed">
                  {product.description || "Premium quality e-gadget with cutting-edge technology and exceptional performance. Perfect for professionals and enthusiasts alike."}
                </p>
              </div>

              {/* Features */}
              <div>
                <h3 className="text-lg font-semibold mb-2">Key Features</h3>
                <ul className="space-y-1 text-gray-600">
                  <li>• High-quality materials and construction</li>
                  <li>• Latest technology integration</li>
                  <li>• Excellent performance and reliability</li>
                  <li>• 1-year manufacturer warranty</li>
                </ul>
              </div>

              {/* Quantity and Add to Cart */}
              <div className="space-y-4">
                <div className="flex items-center space-x-4">
                  <label className="text-sm font-medium text-gray-700">Quantity:</label>
                  <div className="flex items-center border border-gray-300 rounded-lg">
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="px-3 py-1 hover:bg-gray-100 transition-colors"
                    >
                      -
                    </button>
                    <span className="px-4 py-1 border-x border-gray-300">{quantity}</span>
                    <button
                      onClick={() => setQuantity(quantity + 1)}
                      className="px-3 py-1 hover:bg-gray-100 transition-colors"
                    >
                      +
                    </button>
                  </div>
                </div>

                <div className="flex space-x-4">
                  <button
                    onClick={handleAddToCart}
                    className="flex-1 bg-blue-600 text-white py-3 px-6 rounded-full font-semibold hover:bg-blue-700 transition-colors"
                  >
                    Add to Cart
                  </button>
                  <button className="flex-1 bg-gray-200 text-gray-800 py-3 px-6 rounded-full font-semibold hover:bg-gray-300 transition-colors">
                    Buy Now
                  </button>
                </div>
              </div>

              {/* Additional Info */}
              <div className="border-t pt-4 space-y-2 text-sm text-gray-600">
                <p>✓ Free shipping on orders over ₹999</p>
                <p>✓ 30-day return policy</p>
                <p>✓ Secure payment options</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
