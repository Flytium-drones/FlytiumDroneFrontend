import { useState, useEffect } from "react";
import Layout from "../components/Layout/Layout";
import { useAuth } from "../Context/auth";
import { useNavigate } from "react-router-dom";
import { useCart } from "../Context/cart";
import { Minus, Plus, X, ShoppingBag, ArrowRight } from "lucide-react";
import toast from "react-hot-toast";

const Cart = () => {
  const { auth } = useAuth();
  const navigate = useNavigate();
  const {
    cart,
    updateQuantity: updateCartItemQuantity,
    removeFromCart: removeCartItem,
    getCartTotal,
    canAccessCart,
  } = useCart();

  const [isRemoving, setIsRemoving] = useState(null);

  // Redirect if user is not authenticated
  useEffect(() => {
    const accessResult = canAccessCart();
    if (accessResult === false) {
      toast.error("Please login to access your cart");
      navigate("/login");
    }
  }, [canAccessCart, navigate]);

  // Show loading while auth is loading
  const accessResult = canAccessCart();
  if (accessResult === null) {
    return (
      <Layout title="Cart - Loading" description="Loading your cart">
        <div className="min-h-screen flex items-center justify-center bg-white">
          <div className="w-16 h-16 border-4 border-gray-900 border-t-transparent animate-spin"></div>
        </div>
      </Layout>
    );
  }

  // Show login prompt if user is not authenticated
  if (accessResult === false) {
    return (
      <Layout
        title="Cart - Login Required"
        description="Please login to access your cart"
      >
        <div className="min-h-screen flex items-center justify-center bg-white p-6">
          <div className="max-w-md w-full border-2 border-gray-900 p-12 text-center">
            <div className="w-20 h-20 border-2 border-gray-900 mx-auto mb-8 flex items-center justify-center">
              <ShoppingBag className="w-10 h-10" />
            </div>
            <h2 className="text-3xl font-black text-gray-900 mb-4">
              Login Required
            </h2>
            <p className="text-gray-600 mb-8">
              Please login to access your shopping cart
            </p>
            <div className="space-y-4">
              <button
                onClick={() => navigate("/login")}
                className="w-full group relative px-8 py-4 bg-gray-900 text-white font-bold overflow-hidden"
              >
                <span className="relative z-10 flex items-center justify-center gap-2">
                  Login to Continue
                  <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-2" />
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-emerald-600 via-blue-600 to-purple-600 translate-x-[-100%] group-hover:translate-x-0 transition-transform duration-500"></div>
              </button>
              <button
                onClick={() => navigate("/register")}
                className="w-full px-8 py-4 border-2 border-gray-900 text-gray-900 font-bold hover:bg-gray-900 hover:text-white transition-colors"
              >
                Create Account
              </button>
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  const totalPrice = getCartTotal();
  const itemCount = cart.reduce((sum, item) => sum + (item.quantity || 1), 0);

  const handleQuantityUpdate = (id, quantity) => {
    if (quantity < 1) return;
    updateCartItemQuantity(id, quantity);
  };

  const handleRemoveItem = (id) => {
    setIsRemoving(id);
    setTimeout(() => {
      removeCartItem(id);
      setIsRemoving(null);
      toast.success("Item removed from cart");
    }, 300);
  };

  return (
    <Layout title="Cart" description="Your shopping cart">
      <div className="min-h-screen bg-white">
        {/* Header */}
        <section className="pt-8 pb-8 border-b-2 border-gray-900">
          <div className="max-w-7xl mx-auto px-6">
            <div className="flex items-start justify-between">
              <div>
                <div className="w-20 h-1 bg-gradient-to-r from-emerald-600 to-blue-600 mb-8"></div>
                <h1 className="text-6xl lg:text-7xl font-black text-gray-900 leading-tight mb-4">
                  Cart
                </h1>
                <p className="text-xl text-gray-600">
                  {cart.length === 0
                    ? "Your cart is empty"
                    : `${cart.length} ${
                        cart.length === 1 ? "item" : "items"
                      } in your cart`}
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Main Content */}
        {cart.length === 0 ? (
          <section className="py-32">
            <div className="max-w-2xl mx-auto px-6 text-center">
              <div className="w-32 h-32 border-2 border-gray-200 mx-auto mb-8 flex items-center justify-center">
                <ShoppingBag className="w-16 h-16 text-gray-300" />
              </div>
              <h2 className="text-3xl font-black text-gray-900 mb-4">
                Your cart is empty
              </h2>
              <p className="text-gray-600 mb-8">
                Start adding products to your cart
              </p>
              {/* <button
                onClick={() => navigate("/store")}
                className="group relative px-12 py-5 bg-gray-900 text-white font-bold overflow-hidden"
              >
                <span className="relative z-10 flex items-center gap-3">
                  Browse Products
                  <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-2" />
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-emerald-600 via-blue-600 to-purple-600 translate-x-[-100%] group-hover:translate-x-0 transition-transform duration-500"></div>
              </button> */}
            </div>
          </section>
        ) : (
          <section className="py-16">
            <div className="max-w-7xl mx-auto px-6">
              <div className="grid lg:grid-cols-3 gap-12">
                {/* Cart Items - 2/3 width */}
                <div className="lg:col-span-2 space-y-6">
                  {cart.map((item) => (
                    <div
                      key={item._id}
                      className={`border-2 border-gray-200 transition-all duration-300 ${
                        isRemoving === item._id
                          ? "opacity-0 translate-x-full"
                          : "opacity-100"
                      }`}
                    >
                      <div className="p-6 flex gap-6">
                        {/* Product Image */}
                        <div className="w-32 h-32 flex-shrink-0 bg-gray-50 border border-gray-200 p-4">
                          <img
                            src={item.image}
                            alt={item.name}
                            className="w-full h-full object-contain"
                          />
                        </div>

                        {/* Product Info */}
                        <div className="flex-1 flex flex-col justify-between">
                          <div>
                            <h3 className="text-xl font-black text-gray-900 mb-2">
                              {item.name}
                            </h3>
                            <p className="text-gray-600 text-sm line-clamp-2 mb-4">
                              {item.description}
                            </p>
                          </div>

                          <div className="flex items-center justify-between">
                            {/* Quantity Controls */}
                            <div className="flex items-center gap-4">
                              <button
                                onClick={() =>
                                  handleQuantityUpdate(
                                    item._id,
                                    (item.quantity || 1) - 1
                                  )
                                }
                                disabled={(item.quantity || 1) <= 1}
                                className="w-10 h-10 border-2 border-gray-900 flex items-center justify-center hover:bg-gray-900 hover:text-white transition-colors disabled:opacity-30"
                              >
                                <Minus className="w-4 h-4" />
                              </button>
                              <span className="text-lg font-bold text-gray-900 w-12 text-center">
                                {item.quantity || 1}
                              </span>
                              <button
                                onClick={() =>
                                  handleQuantityUpdate(
                                    item._id,
                                    (item.quantity || 1) + 1
                                  )
                                }
                                className="w-10 h-10 border-2 border-gray-900 flex items-center justify-center hover:bg-gray-900 hover:text-white transition-colors"
                              >
                                <Plus className="w-4 h-4" />
                              </button>
                            </div>

                            {/* Price */}
                            <div className="text-right">
                              <div className="text-2xl font-black text-gray-900">
                                ₹
                                {(
                                  (item.discountedPrice || item.price) *
                                  (item.quantity || 1)
                                ).toLocaleString()}
                              </div>
                              {item.quantity > 1 && (
                                <div className="text-sm text-gray-500">
                                  ₹
                                  {(
                                    item.discountedPrice || item.price
                                  ).toLocaleString()}{" "}
                                  each
                                </div>
                              )}
                            </div>
                          </div>
                        </div>

                        {/* Remove Button */}
                        <button
                          onClick={() => handleRemoveItem(item._id)}
                          className="w-10 h-10 border border-gray-300 flex items-center justify-center hover:border-red-500 hover:text-red-500 transition-colors"
                        >
                          <X className="w-5 h-5" />
                        </button>
                      </div>
                    </div>
                  ))}

                  {/* Continue Shopping */}
                  <button
                    onClick={() => navigate("/store")}
                    className="px-8 py-4 border-2 border-gray-900 text-gray-900 font-bold hover:bg-gray-900 hover:text-white transition-colors"
                  >
                    Continue Shopping
                  </button>
                </div>

                {/* Order Summary - 1/3 width, sticky */}
                <div className="lg:col-span-1">
                  <div className="border-2 border-gray-900 p-8 sticky top-24">
                    <h2 className="text-2xl font-black text-gray-900 mb-8">
                      Order Summary
                    </h2>

                    {/* Summary Details */}
                    <div className="space-y-4 mb-8 pb-8 border-b-2 border-gray-200">
                      <div className="flex justify-between text-gray-600">
                        <span>Items ({itemCount})</span>
                        <span className="font-bold">
                          ₹{totalPrice.toLocaleString()}
                        </span>
                      </div>
                      <div className="flex justify-between text-gray-600">
                        <span>Shipping</span>
                        <span className="font-bold text-emerald-600">FREE</span>
                      </div>
                    </div>

                    {/* Total */}
                    <div className="flex justify-between items-center mb-8">
                      <span className="text-lg font-bold text-gray-900">
                        Total
                      </span>
                      <span className="text-3xl font-black text-gray-900">
                        ₹{totalPrice.toLocaleString()}
                      </span>
                    </div>

                    {/* Checkout Button */}
                    <button
                      onClick={() => navigate("/checkout")}
                      className="w-full group relative px-8 py-5 bg-gray-900 text-white font-bold overflow-hidden mb-4"
                    >
                      <span className="relative z-10 flex items-center justify-center gap-3">
                        Proceed to Checkout
                        <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-2" />
                      </span>
                      <div className="absolute inset-0 bg-gradient-to-r from-emerald-600 via-blue-600 to-purple-600 translate-x-[-100%] group-hover:translate-x-0 transition-transform duration-500"></div>
                    </button>

                    {/* Info Text */}
                    <p className="text-xs text-gray-500 text-center">
                      Secure checkout • Free shipping on all orders
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </section>
        )}
      </div>
    </Layout>
  );
};

export default Cart;
