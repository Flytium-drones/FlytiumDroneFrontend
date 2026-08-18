import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Layout from "../components/Layout/Layout";
import { useAuth } from "../Context/auth";
import { useCart } from "../Context/cart";
import { useNavigate } from "react-router-dom";
import { API_URL } from "../api";
import axios from "axios";
import toast from "react-hot-toast";
import { 
  FiCreditCard, 
  FiLock, 
  FiUser, 
  FiMapPin, 
  FiPhone,
  FiMail,
  FiShoppingBag,
  FiLoader
} from "react-icons/fi";

const CheckoutPage = () => {
  const { auth } = useAuth();
  const { cart, getCartTotal, getCartCount, clearCart, canAccessCart } = useCart();
  const navigate = useNavigate();
  
  const [loading, setLoading] = useState(false);
  const [paymentProcessing, setPaymentProcessing] = useState(false);
  const [shippingAddress, setShippingAddress] = useState({
    name: auth?.user?.name || "",
    email: auth?.user?.email || "",
    phone: auth?.user?.phone || "",
    address: "",
    city: "",
    state: "",
    pincode: "",
    country: "India"
  });

  // Redirect if user is not authenticated
  useEffect(() => {
    const accessResult = canAccessCart();
    
    // Wait for auth to load
    if (accessResult === null) return;
    
    if (accessResult === false) {
      toast.error("Please login to proceed with checkout");
      navigate("/login");
      return;
    }

    if (cart.length === 0) {
      toast.error("Your cart is empty");
      navigate("/cart");
      return;
    }
  }, [canAccessCart, cart.length, navigate]);

  // Update address when user data changes
  useEffect(() => {
    if (auth?.user) {
      setShippingAddress(prev => ({
        ...prev,
        name: auth.user.name || prev.name,
        email: auth.user.email || prev.email,
        phone: auth.user.phone || prev.phone
      }));
    }
  }, [auth?.user]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setShippingAddress(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const validateAddress = () => {
    const required = ['name', 'email', 'phone', 'address', 'city', 'pincode'];
    const missing = required.filter(field => !shippingAddress[field].trim());
    
    if (missing.length > 0) {
      toast.error(`Please fill in: ${missing.join(', ')}`);
      return false;
    }

    // Validate email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(shippingAddress.email)) {
      toast.error("Please enter a valid email address");
      return false;
    }

    // Validate phone
    const phoneRegex = /^[6-9]\d{9}$/;
    if (!phoneRegex.test(shippingAddress.phone)) {
      toast.error("Please enter a valid 10-digit phone number");
      return false;
    }

    // Validate pincode
    const pincodeRegex = /^\d{6}$/;
    if (!pincodeRegex.test(shippingAddress.pincode)) {
      toast.error("Please enter a valid 6-digit pincode");
      return false;
    }

    return true;
  };

  const handlePayment = async () => {
    if (!validateAddress()) return;

    setLoading(true);
    setPaymentProcessing(true);

    try {
      // Create order on backend
      const orderData = {
        useCart: true,
        cartItems: cart, // Send cart items from context
        totalAmount: getCartTotal(),
        shippingAddress
      };

      console.log("Creating order with data:", orderData);

      const { data } = await axios.post(
        `${API_URL}/api/payment/create-order`,
        orderData,
        {
          headers: {
            Authorization: `Bearer ${auth?.token}`,
          },
        }
      );

      if (!data.success) {
        throw new Error(data.message || "Failed to create order");
      }

      console.log("Order created successfully:", data);

      // Configure Razorpay options
      const options = {
        key: data.key_id,
        amount: data.amount,
        currency: data.currency,
        order_id: data.id,
        receipt: data.receipt,
        name: "Flytium Drones",
        description: `Order for ${getCartCount()} items`,
        image: "/logo.png",
        prefill: {
          name: shippingAddress.name,
          email: shippingAddress.email,
          contact: shippingAddress.phone,
        },
        theme: {
          color: "#667eea",
        },

        handler: async (response) => {
          console.log("Payment successful:", response);
          await handlePaymentSuccess(response, data.orderDetails);
        },
        modal: {
          ondismiss: () => {
            setPaymentProcessing(false);
            setLoading(false);
            toast.error("Payment cancelled");
          },
        },
      };

      // Open Razorpay payment gateway
      const razorpay = new window.Razorpay(options);
      razorpay.on('payment.failed', (response) => {
        console.error("Payment failed:", response);
        setPaymentProcessing(false);
        setLoading(false);
        toast.error(`Payment failed: ${response.error.description}`);
      });

      razorpay.open();
    } catch (error) {
      console.error("Payment initiation error:", error);
      setLoading(false);
      setPaymentProcessing(false);
      toast.error(error.response?.data?.message || error.message || "Payment failed");
    }
  };

  const handlePaymentSuccess = async (paymentResponse, orderDetails) => {
    try {
      console.log("Verifying payment:", paymentResponse);

      // Verify payment on backend
      const verificationData = {
        razorpay_order_id: paymentResponse.razorpay_order_id,
        razorpay_payment_id: paymentResponse.razorpay_payment_id,
        razorpay_signature: paymentResponse.razorpay_signature,
        orderDetails,
        useCart: true
      };

      const { data } = await axios.post(
        `${API_URL}/api/payment/verify-payment`,
        verificationData,
        {
          headers: {
            Authorization: `Bearer ${auth?.token}`,
          },
        }
      );

      if (data.success) {
        // Clear cart and redirect to success page
        clearCart();
        toast.success("Order placed successfully! 🎉");
        
        // Redirect to orders page with success message
        navigate("dashboard/user/orders", { 
          state: { 
            orderSuccess: true, 
            orderId: data.order._id 
          } 
        });
      } else {
        throw new Error(data.message || "Payment verification failed");
      }
    } catch (error) {
      console.error("Payment verification error:", error);
      toast.error(error.response?.data?.message || "Payment verification failed");
    } finally {
      setPaymentProcessing(false);
      setLoading(false);
    }
  };

  // Show loading if cart is being checked
  const accessResult = canAccessCart();
  if (accessResult === null || (accessResult === false) || cart.length === 0) {
    return (
      <Layout title="Checkout" description="Complete your purchase">
        <div className="container mx-auto p-4 max-w-md">
          <div className="bg-white rounded-xl shadow-lg p-8 text-center">
            <FiLoader className="w-8 h-8 animate-spin text-blue-600 mx-auto mb-4" />
            <p className="text-gray-600">Loading...</p>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout title="Checkout" description="Complete your purchase securely">
      <div className="bg-gray-50 min-h-screen py-8">
        <div className="container mx-auto px-4 max-w-6xl">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-8"
          >
            <h1 className="text-3xl font-bold text-gray-800 mb-2">Secure Checkout</h1>
            <p className="text-gray-600">Complete your order in a few simple steps</p>
          </motion.div>

          <div className="grid lg:grid-cols-2 gap-8">
            {/* Shipping Information */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="space-y-6"
            >
              <div className="bg-white rounded-xl shadow-sm p-6">
                <div className="flex items-center gap-3 mb-6">
                  <FiMapPin className="w-6 h-6 text-blue-600" />
                  <h2 className="text-xl font-semibold text-gray-800">Shipping Address</h2>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Full Name *
                    </label>
                    <div className="relative">
                      <FiUser className="absolute left-3 top-3.5 w-4 h-4 text-gray-400" />
                      <input
                        type="text"
                        name="name"
                        value={shippingAddress.name}
                        onChange={handleInputChange}
                        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Enter your full name"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email Address *
                    </label>
                    <div className="relative">
                      <FiMail className="absolute left-3 top-3.5 w-4 h-4 text-gray-400" />
                      <input
                        type="email"
                        name="email"
                        value={shippingAddress.email}
                        onChange={handleInputChange}
                        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Enter your email"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Phone Number *
                    </label>
                    <div className="relative">
                      <FiPhone className="absolute left-3 top-3.5 w-4 h-4 text-gray-400" />
                      <input
                        type="tel"
                        name="phone"
                        value={shippingAddress.phone}
                        onChange={handleInputChange}
                        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="10-digit mobile number"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Pincode *
                    </label>
                    <input
                      type="text"
                      name="pincode"
                      value={shippingAddress.pincode}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="6-digit pincode"
                      maxLength={6}
                      required
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Street Address *
                    </label>
                    <textarea
                      name="address"
                      value={shippingAddress.address}
                      onChange={handleInputChange}
                      rows={3}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="House number, street name, area"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      City *
                    </label>
                    <input
                      type="text"
                      name="city"
                      value={shippingAddress.city}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="City name"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      State
                    </label>
                    <input
                      type="text"
                      name="state"
                      value={shippingAddress.state}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="State name"
                    />
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Order Summary */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="space-y-6"
            >
              <div className="bg-white rounded-xl shadow-sm p-6 sticky top-8">
                <div className="flex items-center gap-3 mb-6">
                  <FiShoppingBag className="w-6 h-6 text-blue-600" />
                  <h2 className="text-xl font-semibold text-gray-800">Order Summary</h2>
                </div>

                {/* Cart Items */}
                <div className="space-y-4 mb-6">
                  {cart.map((item) => (
                    <div key={item._id} className="flex items-center gap-4">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-16 h-16 object-cover rounded-lg"
                      />
                      <div className="flex-1">
                        <h4 className="font-medium text-gray-800 line-clamp-1">
                          {item.name}
                        </h4>
                        <p className="text-sm text-gray-600">
                          Qty: {item.quantity} × ₹{item.price.toLocaleString()}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-gray-800">
                          ₹{(item.price * item.quantity).toLocaleString()}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Pricing Breakdown */}
                <div className="border-t border-gray-200 pt-4 space-y-2">
                  <div className="flex justify-between text-gray-600">
                    <span>Subtotal ({getCartCount()} items)</span>
                    <span>₹{getCartTotal().toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-gray-600">
                    <span>Shipping</span>
                    <span className="text-green-600">Free</span>
                  </div>
                  <div className="flex justify-between text-lg font-bold text-gray-800 pt-2 border-t border-gray-200">
                    <span>Total</span>
                    <span>₹{getCartTotal().toLocaleString()}</span>
                  </div>
                </div>

                {/* Payment Button */}
                <AnimatePresence>
                  <motion.button
                    whileHover={{ scale: loading ? 1 : 1.02 }}
                    whileTap={{ scale: loading ? 1 : 0.98 }}
                    onClick={handlePayment}
                    disabled={loading || paymentProcessing}
                    className={`
                      w-full mt-6 py-4 px-6 rounded-lg font-semibold text-white
                      flex items-center justify-center gap-3 transition-all
                      ${loading || paymentProcessing 
                        ? 'bg-gray-400 cursor-not-allowed' 
                        : 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-lg hover:shadow-xl'
                      }
                    `}
                  >
                    {paymentProcessing ? (
                      <>
                        <FiLoader className="w-5 h-5 animate-spin" />
                        Processing Payment...
                      </>
                    ) : loading ? (
                      <>
                        <FiLoader className="w-5 h-5 animate-spin" />
                        Creating Order...
                      </>
                    ) : (
                      <>
                        <FiLock className="w-5 h-5" />
                        <FiCreditCard className="w-5 h-5" />
                        Pay ₹{getCartTotal().toLocaleString()} Securely
                      </>
                    )}
                  </motion.button>
                </AnimatePresence>

                {/* Security Badge */}
                <div className="mt-4 flex items-center justify-center gap-2 text-sm text-gray-500">
                  <FiLock className="w-4 h-4" />
                  <span>Secured by Razorpay SSL encryption</span>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default CheckoutPage;