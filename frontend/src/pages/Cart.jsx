import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

export default function Cart() {
  const [cart, setCart] = useState(null);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("token");
    const user = localStorage.getItem("user");
    
    if (!token || !user) {
      setCart({ items: [] });
      return;
    }

    // Get user-specific cart from localStorage
    const userData = JSON.parse(user);
    const userCartKey = `cart_${userData.email}`;
    const localCart = localStorage.getItem(userCartKey);
    
    if (localCart) {
      try {
        const parsedCart = JSON.parse(localCart);
        setCart({ items: parsedCart });
      } catch (e) {
        console.error('Error parsing local cart:', e);
        setCart({ items: [] });
      }
    } else {
      setCart({ items: [] });
    }
  }, []);

  const handleOrder = async () => {
    if (!cart || !cart.items || cart.items.length === 0) {
      setMessage("Your cart is empty. Add some products first!");
      return;
    }

    try {
      const token = localStorage.getItem("token");
      const res = await fetch("http://localhost:5000/api/order", {
        method: "POST",
        headers: { 
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json"
        },
      });
      const data = await res.json();
      if (data.success) {
        setMessage("Order placed successfully!");
        // Clear user-specific cart
        const user = localStorage.getItem("user");
        if (user) {
          const userData = JSON.parse(user);
          const userCartKey = `cart_${userData.email}`;
          localStorage.removeItem(userCartKey);
        }
        setCart({ items: [] });
      } else {
        setMessage(data.error || "Order failed");
      }
    } catch (error) {
      console.error('Order API error:', error);
      setMessage("Failed to place order. Please try again.");
    }
  };

  const getTotalPrice = () => {
    if (!cart || !cart.items) return 0;
    return cart.items.reduce((total, item) => {
      const price = parseFloat(item.price?.replace(/[₹,]/g, '') || item.productId?.price?.replace(/[₹,]/g, '') || '0');
      return total + (price * (item.quantity || 1));
    }, 0);
  };

  const removeFromCart = (productId) => {
    // Update local cart immediately
    setCart(prevCart => ({
      ...prevCart,
      items: prevCart.items.filter(item => (item.id || item.productId?._id) !== productId)
    }));

    // Update user-specific localStorage
    const user = localStorage.getItem("user");
    if (user) {
      try {
        const userData = JSON.parse(user);
        const userCartKey = `cart_${userData.email}`;
        const localCart = localStorage.getItem(userCartKey);
        
        if (localCart) {
          const parsedCart = JSON.parse(localCart);
          const updatedCart = parsedCart.filter(item => (item.id || item.productId?._id) !== productId);
          localStorage.setItem(userCartKey, JSON.stringify(updatedCart));
          
          // Dispatch cart update event
          window.dispatchEvent(new CustomEvent('cartUpdated'));
        }
      } catch (e) {
        console.error('Error updating local cart:', e);
      }
    }

    // Try API call as well
    const token = localStorage.getItem("token");
    if (token) {
      fetch(`http://localhost:5000/api/cart/${productId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      }).catch(error => console.error('Remove from cart API error:', error));
    }
  };

  if (!cart) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your cart...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-100">
      <div className="max-w-4xl mx-auto py-8 px-4">
        <h2 className="text-3xl font-bold mb-8 text-blue-700">Shopping Cart</h2>
        
        {cart.items.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
            <div className="text-6xl mb-4">🛒</div>
            <h3 className="text-2xl font-semibold text-gray-800 mb-4">Your cart is empty</h3>
            <p className="text-gray-600 mb-8">Looks like you haven't added any items to your cart yet.</p>
            <Link 
              to="/products" 
              className="bg-blue-600 text-white px-8 py-3 rounded-full font-semibold hover:bg-blue-700 transition-colors inline-block"
            >
              Start Shopping
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2 space-y-4">
              {cart.items.map(item => (
                <div key={item.id || item.productId?._id} className="bg-white rounded-xl shadow-md p-6 flex items-center space-x-4">
                  <img 
                    src={item.image || item.productId?.image} 
                    alt={item.name || item.productId?.name}
                    className="w-20 h-20 object-contain rounded-lg bg-gray-100 p-2"
                  />
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-800">{item.name || item.productId?.name}</h3>
                    <p className="text-gray-600">Quantity: {item.quantity || 1}</p>
                    <p className="text-blue-600 font-bold text-lg">{item.price || item.productId?.price}</p>
                  </div>
                  <button
                    onClick={() => removeFromCart(item.id || item.productId?._id)}
                    className="text-red-500 hover:text-red-700 p-2 rounded-full hover:bg-red-50 transition-colors"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              ))}
            </div>

            {/* Order Summary */}
            <div className="bg-white rounded-xl shadow-md p-6 h-fit">
              <h3 className="text-xl font-semibold mb-4 text-gray-800">Order Summary</h3>
              <div className="space-y-3 mb-6">
                <div className="flex justify-between">
                  <span className="text-gray-600">Subtotal</span>
                  <span className="font-semibold">₹{getTotalPrice().toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Shipping</span>
                  <span className="font-semibold text-green-600">Free</span>
                </div>
                <div className="border-t pt-3">
                  <div className="flex justify-between text-lg font-bold">
                    <span>Total</span>
                    <span className="text-blue-600">₹{getTotalPrice().toLocaleString()}</span>
                  </div>
                </div>
              </div>
              
              <button
                className="w-full bg-blue-600 text-white py-3 px-6 rounded-full font-semibold hover:bg-blue-700 transition-colors mb-4"
                onClick={handleOrder}
              >
                Place Order
              </button>
              
              <Link 
                to="/products" 
                className="block text-center text-blue-600 hover:text-blue-800 transition-colors"
              >
                Continue Shopping
              </Link>
            </div>
          </div>
        )}
        
        {message && (
          <div className={`mt-6 p-4 rounded-lg text-center font-semibold ${
            message.includes('successfully') ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
          }`}>
            {message}
          </div>
        )}
      </div>
    </div>
  );
}