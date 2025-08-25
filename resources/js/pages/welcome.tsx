import React, { useState, useEffect } from 'react';
import { ShoppingCart, Search, Menu, X, Heart, Home, Package, User, AlertCircle, CheckCircle, Info, ShoppingBag, Coffee, Utensils, Gift } from 'lucide-react';

interface Product {
  id: number;
  name: string;
  price: number;
  image: string;
  category: string;
}

interface Toast {
  id: string;
  message: string;
  type: 'success' | 'error' | 'info';
  duration: number;
}

const Welcome: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [cartItems, setCartItems] = useState<{id: number, quantity: number}[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);
  const [isCartOpen, setIsCartOpen] = useState<boolean>(false);
  const [toasts, setToasts] = useState<Toast[]>([]);

  // Fetch products from Laravel backend
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch('/api/products');
        const data = await response.json();
        setProducts(data);
        setFilteredProducts(data);
        
        // Extract unique categories
        const uniqueCategories = ['all', ...new Set(data.map((product: Product) => product.category))];
        setCategories(uniqueCategories);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching products:', error);
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  // Filter products based on search term and category
  useEffect(() => {
    let result = products;
    
    if (searchTerm) {
      result = result.filter(product => 
        product.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    if (selectedCategory !== 'all') {
      result = result.filter(product => product.category === selectedCategory);
    }
    
    setFilteredProducts(result);
  }, [searchTerm, selectedCategory, products]);

  // Toast functions
  const showToast = (message: string, type: 'success' | 'error' | 'info' = 'info', duration: number = 3000) => {
    const id = Math.random().toString(36).substring(2, 9);
    const toast = { id, message, type, duration };
    setToasts(current => [...current, toast]);
    
    // Auto remove toast after duration
    setTimeout(() => {
      setToasts(current => current.filter(t => t.id !== id));
    }, duration);
  };

  // Add to cart function
  const addToCart = (productId: number) => {
    const product = products.find(p => p.id === productId) || 
                  placeholderProducts.find(p => p.id === productId);
    const existingItem = cartItems.find(item => item.id === productId);
    
    if (existingItem) {
      setCartItems(cartItems.map(item => 
        item.id === productId ? { ...item, quantity: item.quantity + 1 } : item
      ));
      showToast(`Added another ${product?.name} to your cart`, 'success');
    } else {
      setCartItems([...cartItems, { id: productId, quantity: 1 }]);
      showToast(`${product?.name} added to your cart!`, 'success');
    }
    
    // Show cart after adding item
    setIsCartOpen(true);
  };

  // Remove from cart function
  const removeFromCart = (productId: number) => {
    const product = products.find(p => p.id === productId) || 
                  placeholderProducts.find(p => p.id === productId);
    const existingItem = cartItems.find(item => item.id === productId);
    
    if (existingItem && existingItem.quantity > 1) {
      setCartItems(cartItems.map(item => 
        item.id === productId ? { ...item, quantity: item.quantity - 1 } : item
      ));
      showToast(`Removed one ${product?.name} from your cart`, 'info');
    } else {
      setCartItems(cartItems.filter(item => item.id !== productId));
      showToast(`${product?.name} removed from your cart`, 'info');
    }
  };

  // Calculate total items in cart
  const totalItems = cartItems.reduce((total, item) => total + item.quantity, 0);
  
  // Calculate total price
  const totalPrice = cartItems.reduce((total, item) => {
    const product = products.find(p => p.id === item.id);
    return total + (product ? product.price * item.quantity : 0);
  }, 0);

  // Function to get a random icon for each category
  const getCategoryIcon = (category: string) => {
    const icons = {
      'Food': <Utensils size={40} className="text-yellow-500" />,
      'Beverages': <Coffee size={40} className="text-brown-500" />,
      'Personal Care': <User size={40} className="text-blue-500" />,
      'Household': <Home size={40} className="text-green-500" />,
      'Snacks': <Gift size={40} className="text-red-500" />,
      'default': <ShoppingBag size={40} className="text-gray-500" />
    };
    
    return icons[category as keyof typeof icons] || icons.default;
  };

  // Placeholder data for featured products (in case API fails)
  const placeholderProducts = [
    { id: 1, name: 'Instant Noodles', price: 15, image: '/api/placeholder/200/200', category: 'Food' },
    { id: 2, name: 'Canned Sardines', price: 25, image: '/api/placeholder/200/200', category: 'Food' },
    { id: 3, name: 'Soft Drinks (500ml)', price: 35, image: '/api/placeholder/200/200', category: 'Beverages' },
    { id: 4, name: 'Shampoo Sachet', price: 10, image: '/api/placeholder/200/200', category: 'Personal Care' },
    { id: 5, name: 'Laundry Detergent', price: 20, image: '/api/placeholder/200/200', category: 'Household' },
    { id: 6, name: 'Biscuits', price: 12, image: '/api/placeholder/200/200', category: 'Snacks' },
  ];

  // Use placeholder if loading or API fails
  const displayProducts = loading || filteredProducts.length === 0 ? placeholderProducts : filteredProducts;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Toast Container */}
      <div className="fixed top-4 right-4 z-50 space-y-2 max-w-md">
        {toasts.map(toast => (
          <div 
            key={toast.id} 
            className={`flex items-center p-4 rounded-lg shadow-lg text-white animate-fade-in ${
              toast.type === 'success' ? 'bg-green-500' : 
              toast.type === 'error' ? 'bg-red-500' : 
              'bg-blue-500'
            }`}
          >
            {toast.type === 'success' ? (
              <CheckCircle size={20} className="mr-2" />
            ) : toast.type === 'error' ? (
              <AlertCircle size={20} className="mr-2" />
            ) : (
              <Info size={20} className="mr-2" />
            )}
            <p>{toast.message}</p>
          </div>
        ))}
      </div>
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white shadow-md">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            {/* Logo and Title */}
            <div className="flex items-center">
              <button 
                className="md:hidden mr-4 text-gray-700" 
                onClick={() => setIsMenuOpen(!isMenuOpen)}
              >
                {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
              <h1 className="text-2xl font-bold text-teal-600">Sari-Sari Store</h1>
            </div>
            
            {/* Search Bar */}
            <div className="hidden md:flex relative flex-1 mx-8">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search size={18} className="text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search products..."
                className="pl-10 pr-4 py-2 w-full rounded-lg border border-gray-300 focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            
            {/* Cart Button */}
            <div className="flex items-center">
              <button 
                className="relative p-2 rounded-full hover:bg-gray-100"
                onClick={() => setIsCartOpen(!isCartOpen)}
              >
                <ShoppingCart size={24} className="text-gray-700" />
                {totalItems > 0 && (
                  <span className="absolute top-0 right-0 bg-teal-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                    {totalItems}
                  </span>
                )}
              </button>
            </div>
          </div>
          
          {/* Mobile Search */}
          <div className="mt-4 md:hidden relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search size={18} className="text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search products..."
              className="pl-10 pr-4 py-2 w-full rounded-lg border border-gray-300 focus:ring-2 focus:ring-teal-500 focus:border-transparent"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
      </header>
      
      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="fixed inset-0 z-40 bg-black bg-opacity-50" onClick={() => setIsMenuOpen(false)}>
          <div className="fixed inset-y-0 left-0 max-w-xs w-full bg-white shadow-xl" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between p-4 border-b">
              <h2 className="text-xl font-semibold text-teal-600">Menu</h2>
              <button onClick={() => setIsMenuOpen(false)}>
                <X size={24} className="text-gray-700" />
              </button>
            </div>
            <nav className="p-4">
              <ul>
                <li className="mb-2">
                  <a href="#" className="flex items-center p-2 rounded-lg hover:bg-gray-100">
                    <Home size={20} className="mr-3 text-teal-600" />
                    <span>Home</span>
                  </a>
                </li>
                <li className="mb-2">
                  <a href="#" className="flex items-center p-2 rounded-lg hover:bg-gray-100">
                    <Package size={20} className="mr-3 text-teal-600" />
                    <span>Products</span>
                  </a>
                </li>
                <li className="mb-2">
                  <a href="#" className="flex items-center p-2 rounded-lg hover:bg-gray-100">
                    <Heart size={20} className="mr-3 text-teal-600" />
                    <span>Favorites</span>
                  </a>
                </li>
                <li className="mb-2">
                  <a href="#" className="flex items-center p-2 rounded-lg hover:bg-gray-100">
                    <User size={20} className="mr-3 text-teal-600" />
                    <span>Account</span>
                  </a>
                </li>
              </ul>
            </nav>
          </div>
        </div>
      )}
      
      {/* Shopping Cart Sidebar */}
      {isCartOpen && (
        <div className="fixed inset-0 z-40 bg-black bg-opacity-50" onClick={() => setIsCartOpen(false)}>
          <div className="fixed inset-y-0 right-0 max-w-md w-full bg-white shadow-xl" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between p-4 border-b">
              <h2 className="text-xl font-semibold">Your Cart ({totalItems})</h2>
              <button onClick={() => setIsCartOpen(false)}>
                <X size={24} className="text-gray-700" />
              </button>
            </div>
            <div className="p-4 overflow-y-auto" style={{ maxHeight: 'calc(100vh - 160px)' }}>
              {cartItems.length === 0 ? (
                <div className="text-center py-16">
                  <ShoppingCart size={64} className="mx-auto text-gray-300" />
                  <p className="mt-4 text-gray-600">Your cart is empty</p>
                  <button 
                    className="mt-4 px-4 py-2 bg-teal-500 text-white rounded-lg hover:bg-teal-600"
                    onClick={() => setIsCartOpen(false)}
                  >
                    Start Shopping
                  </button>
                </div>
              ) : (
                <>
                  {cartItems.map(item => {
                    const product = products.find(p => p.id === item.id) || 
                                    placeholderProducts.find(p => p.id === item.id);
                    if (!product) return null;
                    
                    return (
                      <div key={item.id} className="flex items-center py-4 border-b">
                        <img 
                          src={product.image} 
                          alt={product.name} 
                          className="w-16 h-16 object-cover rounded"
                        />
                        <div className="ml-4 flex-1">
                          <h3 className="text-sm font-medium">{product.name}</h3>
                          <p className="text-sm text-gray-500">₱{product.price.toFixed(2)}</p>
                        </div>
                        <div className="flex items-center">
                          <button 
                            className="w-8 h-8 flex items-center justify-center rounded-full border border-gray-300"
                            onClick={() => removeFromCart(item.id)}
                          >
                            -
                          </button>
                          <span className="mx-2">{item.quantity}</span>
                          <button 
                            className="w-8 h-8 flex items-center justify-center rounded-full border border-gray-300"
                            onClick={() => addToCart(item.id)}
                          >
                            +
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </>
              )}
            </div>
            {cartItems.length > 0 && (
              <div className="p-4 border-t mt-auto">
                <div className="flex justify-between mb-4">
                  <span className="font-medium">Total:</span>
                  <span className="font-bold">₱{totalPrice.toFixed(2)}</span>
                </div>
                <button 
                  className="w-full py-3 bg-teal-500 text-white font-medium rounded-lg hover:bg-teal-600"
                  onClick={() => {
                    setIsCartOpen(false);
                    showToast('Proceeding to checkout!', 'success', 5000);
                  }}
                >
                  Proceed to Checkout
                </button>
              </div>
            )}
          </div>
        </div>
      )}
      
      <main className="container mx-auto px-4 py-8">
        {/* Hero Section */}
        <div className="bg-teal-600 rounded-xl p-6 mb-8 text-white">
          <h2 className="text-2xl md:text-3xl font-bold mb-2">Welcome to our Sari-Sari Store!</h2>
          <p className="mb-4">Find your everyday essentials at affordable prices.</p>
          <button 
            className="bg-white text-teal-600 font-medium px-6 py-2 rounded-lg hover:bg-gray-100"
            onClick={() => showToast('Explore our fresh products!', 'info')}
          >
            Explore Products
          </button>
        </div>
        
        {/* Categories */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4">Categories</h2>
          <div className="flex overflow-x-auto pb-2 gap-2">
            {categories.map(category => (
              <button
                key={category}
                className={`px-4 py-2 rounded-full whitespace-nowrap ${
                  selectedCategory === category ? 'bg-teal-500 text-white' : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                }`}
                onClick={() => setSelectedCategory(category)}
              >
                {category.charAt(0).toUpperCase() + category.slice(1)}
              </button>
            ))}
          </div>
        </div>
        
        {/* Products Grid */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4">Our Products</h2>
          {loading ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {[1, 2, 3, 4].map((_, index) => (
                <div key={index} className="bg-white rounded-lg shadow-md p-4 animate-pulse">
                  <div className="bg-gray-200 h-40 rounded-md mb-4"></div>
                  <div className="h-4 bg-gray-200 rounded mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/2 mb-4"></div>
                  <div className="h-8 bg-gray-200 rounded"></div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {displayProducts.map(product => (
                <div key={product.id} className="bg-white rounded-lg shadow-md overflow-hidden">
                  <div className="relative">
                    <img 
                      src={product.image} 
                      alt={product.name} 
                      className="w-full h-48 object-cover"
                    />
                    <div className="absolute top-2 right-2">
                      {getCategoryIcon(product.category)}
                    </div>
                  </div>
                  <div className="p-4">
                    <h3 className="font-medium mb-1">{product.name}</h3>
                    <p className="text-teal-600 font-bold mb-3">₱{product.price.toFixed(2)}</p>
                    <button 
                      className="w-full bg-teal-500 text-white py-2 rounded-lg hover:bg-teal-600 transition-colors"
                      onClick={() => addToCart(product.id)}
                    >
                      Add to Cart
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
        
        {/* Features */}
        <div className="bg-white rounded-xl shadow-md p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4 text-center">Why Shop With Us?</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-12 h-12 bg-teal-100 text-teal-600 rounded-full mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="font-medium mb-2">Quick Delivery</h3>
              <p className="text-gray-600 text-sm">Get your items delivered to your doorstep within hours.</p>
            </div>
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-12 h-12 bg-teal-100 text-teal-600 rounded-full mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="font-medium mb-2">Quality Products</h3>
              <p className="text-gray-600 text-sm">We ensure all our products are fresh and of high quality.</p>
            </div>
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-12 h-12 bg-teal-100 text-teal-600 rounded-full mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <h3 className="font-medium mb-2">Affordable Prices</h3>
              <p className="text-gray-600 text-sm">Get the best value for your money with our competitive prices.</p>
            </div>
          </div>
        </div>
      </main>
      
      {/* Footer */}
      <footer className="bg-gray-800 text-white py-8">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <h3 className="text-lg font-semibold mb-4">Sari-Sari Store</h3>
              <p className="text-gray-300 text-sm">Your neighborhood online store for all your everyday needs.</p>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
              <ul className="text-gray-300 text-sm">
                <li className="mb-2"><a href="#" className="hover:text-teal-400">Home</a></li>
                <li className="mb-2"><a href="#" className="hover:text-teal-400">Products</a></li>
                <li className="mb-2"><a href="#" className="hover:text-teal-400">About Us</a></li>
                <li className="mb-2"><a href="#" className="hover:text-teal-400">Contact</a></li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Contact Us</h3>
              <p className="text-gray-300 text-sm mb-2">123 Main Street, Anytown, PH</p>
              <p className="text-gray-300 text-sm mb-2">Phone: (123) 456-7890</p>
              <p className="text-gray-300 text-sm">Email: info@sarisaristore.com</p>
            </div>
          </div>
          <div className="border-t border-gray-700 mt-8 pt-6 text-center text-gray-300 text-sm">
            <p>&copy; {new Date().getFullYear()} Sari-Sari Store. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

// Add CSS animation for toast
const styles = document.createElement('style');
styles.innerHTML = `
  @keyframes fade-in {
    from { opacity: 0; transform: translateY(-10px); }
    to { opacity: 1; transform: translateY(0); }
  }

  .animate-fade-in {
    animation: fade-in 0.3s ease-out forwards;
  }
`;
document.head.appendChild(styles);

export default Welcome;