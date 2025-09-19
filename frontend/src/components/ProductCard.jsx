import toast from "react-hot-toast";

export default function ProductCard({ name, price, image, className, onAddToCart, rating = 4.5, originalPrice, id }) {
  const handleAddToCart = async () => {
    const token = localStorage.getItem("token");
    const user = localStorage.getItem("user");
    
    if (!token || !user) {
      toast.error("Please login to add items to cart");
      return;
    }

    // Get user-specific cart key
    const userData = JSON.parse(user);
    const userCartKey = `cart_${userData.email}`;
    
    // Use localStorage for cart functionality since API isn't working
    const existingCart = localStorage.getItem(userCartKey);
    let cart = [];
    
    if (existingCart) {
      try {
        cart = JSON.parse(existingCart);
      } catch (e) {
        console.error('Error parsing cart:', e);
        cart = [];
      }
    }

    const cartProduct = { id, name, price, image, quantity: 1 };
    const existingProductIndex = cart.findIndex(item => item.id === id);
    
    if (existingProductIndex > -1) {
      cart[existingProductIndex].quantity += 1;
      toast.success(`Updated ${name} quantity in cart!`);
    } else {
      cart.push(cartProduct);
      toast.success(`${name} added to cart!`);
    }

    localStorage.setItem(userCartKey, JSON.stringify(cart));

    // Dispatch cart update event
    window.dispatchEvent(new CustomEvent('cartUpdated'));

    // Call the original onAddToCart if provided
    if (onAddToCart) {
      onAddToCart({ id, name, price, image, quantity: 1 });
    }
  };

  return (
    <div className={`bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow p-6 flex flex-col items-center ${className}`}>
      <div className="relative mb-4">
        <img
          src={image}
          alt={name}
          className="h-40 w-40 object-contain rounded-lg"
        />
        {originalPrice && (
          <span className="absolute top-2 right-2 bg-red-500 text-white text-xs px-2 py-1 rounded-full">
            SALE
          </span>
        )}
      </div>
      <h3 className="text-lg font-semibold mb-2 text-center line-clamp-2">{name}</h3>
      <div className="flex items-center mb-2">
        <div className="flex text-yellow-400 mr-2">
          {[...Array(5)].map((_, i) => (
            <span key={i} className={i < Math.floor(rating) ? "★" : "☆"}>
              ★
            </span>
          ))}
        </div>
        <span className="text-sm text-gray-500">({rating})</span>
      </div>
      <div className="mb-4">
        {originalPrice && (
          <span className="text-sm text-gray-500 line-through mr-2">{originalPrice}</span>
        )}
        <span className="text-blue-600 font-bold text-xl">{price}</span>
      </div>
      <button 
        className="bg-blue-600 text-white px-6 py-2 rounded-full hover:bg-blue-700 transition-colors w-full font-semibold"
        onClick={handleAddToCart}
      >
        Add to Cart
      </button>
    </div>
  );
}
