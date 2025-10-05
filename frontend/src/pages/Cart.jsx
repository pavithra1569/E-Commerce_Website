import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

export default function Cart() {
  const [cart, setCart] = useState(null);
  const [message, setMessage] = useState("");
  const [showPayment, setShowPayment] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('card'); // card | upi | cod
  const [payment, setPayment] = useState({
    name: "",
    cardNumber: "",
    expiry: "",
    cvv: "",
    upiId: ""
  });
  const [isPaying, setIsPaying] = useState(false);

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

  const handleOrder = async (paymentMeta = {}) => {
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
        body: JSON.stringify({
          paymentMethod: paymentMethod,
          transactionId: paymentMeta.transactionId,
          items: cart.items
        })
      });
      const data = await res.json();
      if (data.success) {
        setMessage("Payment successful and order placed!");
        // Clear user-specific cart
        const user = localStorage.getItem("user");
        if (user) {
          const userData = JSON.parse(user);
          const userCartKey = `cart_${userData.email}`;
          localStorage.removeItem(userCartKey);
        }
        setCart({ items: [] });
        // Notify navbar/cart observers to refresh cart count
        window.dispatchEvent(new CustomEvent('cartUpdated'));
      } else {
        setMessage(data.error || "Order failed");
      }
    } catch (error) {
      console.error('Order API error:', error);
      setMessage("Failed to place order. Please try again.");
    }
  };

  const handlePaymentSubmit = async (e) => {
    e.preventDefault();

    // COD does not require online payment details
    if (paymentMethod === 'cod') {
      setShowPayment(false);
      await handleOrder();
      return;
    }

    // Card/UPI validations
    if (paymentMethod === 'card') {
      if (!payment.name || !payment.cardNumber || !payment.expiry || !payment.cvv) {
        setMessage("Please fill all card details");
        return;
      }
    }
    if (paymentMethod === 'upi') {
      if (!payment.upiId) {
        setMessage("Please enter a valid UPI ID");
        return;
      }
    }

    setIsPaying(true);
    setMessage("");

    // Simulate a payment processing delay and return a mock transactionId
    setTimeout(async () => {
      setIsPaying(false);
      setShowPayment(false);
      const txId = `${paymentMethod.toUpperCase()}_${Date.now()}`;
      await handleOrder({ transactionId: txId });
    }, 1200);
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
                onClick={() => setShowPayment(true)}
              >
                Proceed to Payment
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

      {showPayment && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-semibold">Payment</h3>
              <button onClick={() => setShowPayment(false)} className="text-gray-500 hover:text-gray-700">✕</button>
            </div>

            <form onSubmit={handlePaymentSubmit} className="space-y-4">
              {/* Payment method selector */}
              <div className="flex gap-2">
                {[
                  { key: 'card', label: 'Card' },
                  { key: 'upi', label: 'UPI' },
                  { key: 'cod', label: 'Cash on Delivery' }
                ].map(m => (
                  <button
                    key={m.key}
                    type="button"
                    onClick={() => setPaymentMethod(m.key)}
                    className={`px-3 py-2 rounded-full text-sm border ${paymentMethod === m.key ? 'bg-blue-600 text-white border-blue-600' : 'bg-white text-gray-700 border-gray-300'}`}
                  >
                    {m.label}
                  </button>
                ))}
              </div>

              {paymentMethod === 'card' && (
                <>
                  <div>
                    <label className="block text-sm text-gray-600 mb-1">Cardholder Name</label>
                    <input
                      type="text"
                      value={payment.name}
                      onChange={(e) => setPayment(p => ({ ...p, name: e.target.value }))}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-200"
                      placeholder="John Doe"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-600 mb-1">Card Number</label>
                    <input
                      type="text"
                      value={payment.cardNumber}
                      onChange={(e) => setPayment(p => ({ ...p, cardNumber: e.target.value }))}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-200"
                      placeholder="4242 4242 4242 4242"
                      inputMode="numeric"
                      required
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm text-gray-600 mb-1">Expiry</label>
                      <input
                        type="text"
                        value={payment.expiry}
                        onChange={(e) => setPayment(p => ({ ...p, expiry: e.target.value }))}
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-200"
                        placeholder="MM/YY"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm text-gray-600 mb-1">CVV</label>
                      <input
                        type="password"
                        value={payment.cvv}
                        onChange={(e) => setPayment(p => ({ ...p, cvv: e.target.value }))}
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-200"
                        placeholder="123"
                        inputMode="numeric"
                        required
                      />
                    </div>
                  </div>
                </>
              )}

              {paymentMethod === 'upi' && (
                <div>
                  <label className="block text-sm text-gray-600 mb-1">UPI ID</label>
                  <input
                    type="text"
                    value={payment.upiId}
                    onChange={(e) => setPayment(p => ({ ...p, upiId: e.target.value }))}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-200"
                    placeholder="username@bank"
                    required
                  />
                </div>
              )}

              {paymentMethod === 'cod' && (
                <div className="text-sm text-gray-600 bg-yellow-50 border border-yellow-200 p-3 rounded">
                  You chose Cash on Delivery. You will pay in cash when the product is delivered.
                </div>
              )}

              <div className="flex items-center justify-between border-t pt-4">
                <span className="text-gray-700 font-medium">Total</span>
                <span className="text-blue-600 font-bold text-lg">₹{getTotalPrice().toLocaleString()}</span>
              </div>

              <button
                type="submit"
                disabled={isPaying}
                className={`w-full ${isPaying ? 'bg-blue-400' : 'bg-blue-600 hover:bg-blue-700'} text-white py-3 px-6 rounded-full font-semibold transition-colors`}
              >
                {paymentMethod === 'cod' ? 'Place Order (COD)' : (isPaying ? 'Processing...' : 'Pay Now')}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}