import { useEffect, useState } from "react";
import Layout from "../components/Layout/Layout";
import { useAuth } from "../Context/auth";
import { useCart } from "../Context/cart";
import { useNavigate } from "react-router-dom";
import { API_URL } from "../api";
import axios from "axios";
import { MapPin, Edit2, ShoppingBag, CreditCard, CheckCircle2 } from "lucide-react";

const CheckoutPage = () => {
  const { auth } = useAuth();
  const { cart, setCart } = useCart();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!auth?.token) {
      navigate("/login", { state: "/checkout" });
    }
  }, [auth?.token, navigate]);

  const totalAmount = () => {
    return cart
      .reduce((sum, item) => sum + item.price * (item.quantity || 1), 0)
      .toLocaleString("en-US", {
        style: "currency",
        currency: "INR",
      });
  };

  const updateQuantity = (productId, newQuantity) => {
    if (newQuantity < 1) return;

    const updatedCart = cart.map((item) =>
      item._id === productId ? { ...item, quantity: newQuantity } : item
    );
    setCart(updatedCart);
    localStorage.setItem("Flytium", JSON.stringify(updatedCart));
  };

  const removeItem = (productId) => {
    const updatedCart = cart.filter((item) => item._id !== productId);
    setCart(updatedCart);
    localStorage.setItem("Flytium", JSON.stringify(updatedCart));
  };

  const handlePayment = async () => {
    try {
      setLoading(true);
      const amount = cart.reduce(
        (sum, item) => sum + item.price * (item.quantity || 1),
        0
      );

      const response = await axios.post(
        `${API_URL}/api/payment/order`,
        { amount },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.data.success) {
        alert("Error creating payment order");
        return;
      }

      const options = {
        key: "rzp_test_mn0PTHHGYdjsI8",
        amount: response.data.order.amount,
        currency: response.data.order.currency,
        name: "Flytium",
        description: "Order Payment",
        image: "/logo.png",
        order_id: response.data.order.id,
        handler: async (response) => {
          try {
            const verifyResponse = await axios.post(
              `${API_URL}/api/payment/verify`,
              {
                response,
                products: cart,
                buyer: auth?.user?.id,
                address: auth?.user?.address,
                totalPrice: amount,
              },
              {
                headers: {
                  "Content-Type": "application/json",
                },
              }
            );

            if (verifyResponse.data.success) {
              setCart([]);
              localStorage.removeItem("Flytium");
              alert("Payment Successful");
              navigate("/dashboard/user/orders");
            } else {
              alert("Payment Verification Failed");
            }
          } catch (error) {
            console.error("Verification Error:", error);
            alert("Payment verification failed");
          }
        },
        prefill: {
          name: auth?.user?.name || "Guest",
          email: auth?.user?.email || "guest@example.com",
          contact: auth?.user?.phone || "",
        },
        theme: {
          color: "#3B82F6",
        },

      };

      const razorpay = new window.Razorpay(options);
      razorpay.open();
    } catch (error) {
      console.error("Payment Error:", error);
      alert("Error processing payment");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout title="Checkout" description="Complete your purchase">
      <div className="min-h-screen bg-white py-16">
        <div className="max-w-6xl mx-auto px-6">
          
          {/* Header */}
          <div className="mb-12 pb-8 border-b-2 border-gray-900">
            <h1 className="text-5xl font-black text-gray-900 mb-4">Checkout</h1>
            
            {/* Progress Steps */}
            <div className="flex items-center gap-4 mt-8">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-gray-900 text-white flex items-center justify-center font-bold">1</div>
                <span className="font-bold text-gray-900">Review Cart</span>
              </div>
              <div className="flex-1 h-0.5 bg-gray-900"></div>
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-gray-900 text-white flex items-center justify-center font-bold">2</div>
                <span className="font-bold text-gray-900">Confirm Address</span>
              </div>
              <div className="flex-1 h-0.5 bg-gray-300"></div>
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 border-2 border-gray-300 text-gray-400 flex items-center justify-center font-bold">3</div>
                <span className="font-bold text-gray-400">Payment</span>
              </div>
            </div>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            
            {/* Left: Items & Address */}
            <div className="lg:col-span-2 space-y-8">
              
              {/* Shipping Address */}
              <div className="border-2 border-gray-900 p-8">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-3">
                    <MapPin className="w-6 h-6" />
                    <h2 className="text-2xl font-black text-gray-900">Shipping Address</h2>
                  </div>
                  {auth?.user?.address && (
                    <button
                      onClick={() => navigate("/dashboard/user/profile")}
                      className="flex items-center gap-2 px-4 py-2 border-2 border-gray-900 hover:bg-gray-50 transition-colors font-bold"
                    >
                      <Edit2 className="w-4 h-4" />
                      Edit
                    </button>
                  )}
                </div>
                
                {auth?.user?.address ? (
                  <div className="bg-gray-50 p-6 border-l-4 border-gray-900">
                    <p className="text-gray-900 font-medium leading-relaxed">
                      {auth.user.address}
                    </p>
                  </div>
                ) : (
                  <div className="text-center py-12 bg-gray-50">
                    <MapPin className="w-16 h-16 mx-auto mb-4 text-gray-400" />
                    <p className="text-gray-600 mb-4">No address added yet</p>
                    <button
                      onClick={() => navigate("/dashboard/user/profile")}
                      className="group relative px-8 py-4 bg-gray-900 text-white font-bold overflow-hidden"
                    >
                      <span className="relative z-10">Add Address</span>
                      <div className="absolute inset-0 bg-gradient-to-r from-emerald-600 via-blue-600 to-purple-600 translate-x-[-100%] group-hover:translate-x-0 transition-transform duration-500"></div>
                    </button>
                  </div>
                )}
              </div>

              {/* Order Items */}
              <div className="border-2 border-gray-900 p-8">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-3">
                    <ShoppingBag className="w-6 h-6" />
                    <h2 className="text-2xl font-black text-gray-900">Order Items</h2>
                  </div>
                  <button
                    onClick={() => navigate("/cartpage")}
                    className="flex items-center gap-2 px-4 py-2 border-2 border-gray-900 hover:bg-gray-50 transition-colors font-bold"
                  >
                    <Edit2 className="w-4 h-4" />
                    Edit Cart
                  </button>
                </div>

                <div className="space-y-4">
                  {cart.map((item) => (
                    <div
                      key={item._id}
                      className="flex gap-4 p-4 border-2 border-gray-300 hover:border-gray-900 transition-colors"
                    >
                      <div className="w-24 h-24 border-2 border-gray-900 flex-shrink-0 bg-gray-50 p-2">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-full h-full object-contain"
                        />
                      </div>
                      <div className="flex-1 flex justify-between">
                        <div>
                          <h3 className="font-black text-gray-900 mb-2">{item.name}</h3>
                          <p className="text-sm text-gray-600">Quantity: {item.quantity || 1}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm text-gray-600 mb-1">
                            ₹{item.price.toLocaleString()} × {item.quantity || 1}
                          </p>
                          <p className="text-xl font-black text-gray-900">
                            ₹{(item.price * (item.quantity || 1)).toLocaleString()}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Right: Order Summary */}
            <div className="lg:col-span-1">
              <div className="border-2 border-gray-900 p-8 sticky top-24">
                <h2 className="text-2xl font-black text-gray-900 mb-6">Order Summary</h2>

                <div className="space-y-4 mb-6 pb-6 border-b-2 border-gray-900">
                  <div className="flex justify-between text-gray-600">
                    <span>Subtotal</span>
                    <span className="font-bold">{totalAmount()}</span>
                  </div>
                  <div className="flex justify-between text-gray-600">
                    <span>Shipping</span>
                    <span className="font-bold text-emerald-600">FREE</span>
                  </div>
                  <div className="flex justify-between text-gray-600">
                    <span>Tax</span>
                    <span className="font-bold">Included</span>
                  </div>
                </div>

                <div className="flex justify-between items-center mb-8 pb-8 border-b-2 border-gray-900">
                  <span className="text-lg font-bold text-gray-600">Total</span>
                  <span className="text-3xl font-black text-gray-900">{totalAmount()}</span>
                </div>

                <button
                  disabled={loading || !auth?.user?.address || cart.length === 0}
                  onClick={handlePayment}
                  className="group relative w-full px-8 py-5 bg-gray-900 text-white font-bold overflow-hidden disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <span className="relative z-10 flex items-center justify-center gap-3">
                    {loading ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white border-t-transparent animate-spin"></div>
                        Processing...
                      </>
                    ) : (
                      <>
                        <CreditCard className="w-5 h-5" />
                        Proceed to Payment
                      </>
                    )}
                  </span>
                  {!loading && !(!auth?.user?.address || cart.length === 0) && (
                    <div className="absolute inset-0 bg-gradient-to-r from-emerald-600 via-blue-600 to-purple-600 translate-x-[-100%] group-hover:translate-x-0 transition-transform duration-500"></div>
                  )}
                </button>

                {(!auth?.user?.address || cart.length === 0) && (
                  <p className="text-sm text-gray-500 text-center mt-4">
                    {!auth?.user?.address ? "Please add shipping address" : "Cart is empty"}
                  </p>
                )}

                {/* Security Badge */}
                <div className="mt-6 pt-6 border-t-2 border-gray-300">
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                    <span>Secure checkout with Razorpay</span>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </Layout>
  );
};

export default CheckoutPage;
