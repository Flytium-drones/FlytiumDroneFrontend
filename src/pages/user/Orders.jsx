import { useEffect, useState } from "react";
import Layout from "../../components/Layout/Layout";
import axios from "axios";
import { useAuth } from "../../Context/auth";
import { API_URL } from "../../api";
import moment from "moment";
import { Package, Calendar, DollarSign, User, CheckCircle, Clock, ChevronDown, ChevronUp } from "lucide-react";

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [sortNewestFirst, setSortNewestFirst] = useState(true);
  const [expandedOrders, setExpandedOrders] = useState({});
  const { auth } = useAuth();

  const getOrders = async () => {
    try {
      const response = await axios.get(`${API_URL}/api/payment/user-orders`, {
        headers: {
          Authorization: `Bearer ${auth?.token}`,
        },
      });
      const data = response.data;
      if (data.success) {
        const sortedOrders = sortOrders(data.orders);
        setOrders(sortedOrders);
      }
    } catch (error) {
      console.log("Get Orders Error:", error);
    }
  };

  const sortOrders = (ordersToSort) => {
    return [...ordersToSort].sort((a, b) => {
      const dateA = new Date(a.createdAt);
      const dateB = new Date(b.createdAt);
      return sortNewestFirst ? dateB - dateA : dateA - dateB;
    });
  };

  useEffect(() => {
    getOrders();
  }, [auth?.token]);

  const toggleOrderExpanded = (orderId) => {
    setExpandedOrders(prev => ({
      ...prev,
      [orderId]: !prev[orderId]
    }));
  };

  return (
    <Layout title={"Orders"} description={"Your Order History"}>
      <div className="min-h-screen bg-white py-16">
        <div className="max-w-7xl mx-auto px-6">
          
          {/* Header */}
          <div className="mb-12 pb-8 border-b-2 border-gray-900 flex items-center justify-between">
            <div>
              <h1 className="text-5xl font-black text-gray-900 mb-4">Your Orders</h1>
              <p className="text-xl text-gray-600">Track and manage your purchases</p>
            </div>
            
            <button
              onClick={() => {
                setSortNewestFirst(!sortNewestFirst);
                setOrders(sortOrders(orders));
              }}
              className="flex items-center gap-2 px-6 py-3 border-2 border-gray-900 hover:bg-gray-50 transition-colors font-bold"
            >
              <Clock className="w-5 h-5" />
              {sortNewestFirst ? 'Newest First' : 'Oldest First'}
            </button>
          </div>

          {/* Orders List */}
          {orders.length === 0 ? (
            <div className="border-2 border-gray-900 p-16 text-center">
              <Package className="w-24 h-24 mx-auto mb-6 text-gray-400" />
              <h3 className="text-2xl font-black text-gray-900 mb-4">No Orders Yet</h3>
              <p className="text-gray-600 max-w-md mx-auto mb-8">
                You haven't placed any orders yet. Start shopping to see your orders here!
              </p>
              <button
                onClick={() => window.location.href = '/store'}
                className="group relative px-8 py-4 bg-gray-900 text-white font-bold overflow-hidden"
              >
                <span className="relative z-10">Browse Products</span>
                <div className="absolute inset-0 bg-gradient-to-r from-emerald-600 via-blue-600 to-purple-600 translate-x-[-100%] group-hover:translate-x-0 transition-transform duration-500"></div>
              </button>
            </div>
          ) : (
            <div className="space-y-6">
              {sortOrders(orders)?.map((order, index) => (
                <div
                  key={order._id || index}
                  className="border-2 border-gray-900"
                >
                  {/* Order Header */}
                  <div className="bg-gray-50 p-6 border-b-2 border-gray-900">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
                      <div className="flex items-start gap-3">
                        <Package className="w-5 h-5 mt-1 flex-shrink-0" />
                        <div>
                          <p className="text-xs font-bold uppercase tracking-wider text-gray-600 mb-1">Order ID</p>
                          <p className="text-lg font-black text-gray-900">#{order._id?.slice(-6).toUpperCase()}</p>
                        </div>
                      </div>
                      
                      <div className="flex items-start gap-3">
                        <Calendar className="w-5 h-5 mt-1 flex-shrink-0" />
                        <div>
                          <p className="text-xs font-bold uppercase tracking-wider text-gray-600 mb-1">Order Date</p>
                          <p className="text-lg font-black text-gray-900">
                            {moment(order?.createdAt).format('MMM DD, YYYY')}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-start gap-3">
                        <DollarSign className="w-5 h-5 mt-1 flex-shrink-0" />
                        <div>
                          <p className="text-xs font-bold uppercase tracking-wider text-gray-600 mb-1">Total</p>
                          <p className="text-lg font-black text-gray-900">
                            ₹{order?.products?.reduce((total, item) => total + (item.price * (item.quantity || 1)), 0).toLocaleString()}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-start gap-3">
                        <CheckCircle className="w-5 h-5 mt-1 flex-shrink-0" />
                        <div>
                          <p className="text-xs font-bold uppercase tracking-wider text-gray-600 mb-1">Payment</p>
                          {order?.payment?.method === "COD" ? (
                            <div className="inline-block px-3 py-1 bg-yellow-500 text-gray-900 text-sm font-bold">
                              COD
                            </div>
                          ) : order?.payment?.razorpay_payment_id ? (
                            <div className="inline-block px-3 py-1 bg-emerald-600 text-white text-sm font-bold">
                              PAID
                            </div>
                          ) : (
                            <div className="inline-block px-3 py-1 bg-gray-400 text-white text-sm font-bold">
                              PENDING
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    <button
                      onClick={() => toggleOrderExpanded(order._id)}
                      className="w-full flex items-center justify-between px-4 py-3 border-2 border-gray-900 hover:bg-white transition-colors font-bold"
                    >
                      <span>{expandedOrders[order._id] ? 'Hide' : 'View'} Order Details ({order?.products?.length} items)</span>
                      {expandedOrders[order._id] ? (
                        <ChevronUp className="w-5 h-5" />
                      ) : (
                        <ChevronDown className="w-5 h-5" />
                      )}
                    </button>
                  </div>

                  {/* Order Items (Expandable) */}
                  {expandedOrders[order._id] && (
                    <div className="p-6">
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                        {order?.products?.map((item, idx) => (
                          <div
                            key={idx}
                            className="border-2 border-gray-900 group hover:shadow-lg transition-all"
                          >
                            <div className="aspect-square bg-gray-50 border-b-2 border-gray-900">
                              <img
                                src={item.image}
                                alt={item.name}
                                className="w-full h-full object-contain p-4 group-hover:scale-105 transition-transform"
                              />
                            </div>
                            <div className="p-4">
                              <h4 className="text-sm font-black text-gray-900 mb-2 line-clamp-2">
                                {item.name}
                              </h4>
                              <div className="flex items-center justify-between mb-2">
                                <span className="text-lg font-black text-gray-900">
                                  ₹{item.price.toLocaleString()}
                                </span>
                                <span className="text-xs px-2 py-1 bg-gray-900 text-white font-bold">
                                  Qty: {item.quantity || 1}
                                </span>
                              </div>
                              <div className="pt-2 border-t border-gray-300">
                                <p className="text-sm font-bold text-gray-600">
                                  Subtotal: ₹{(item.price * (item.quantity || 1)).toLocaleString()}
                                </p>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>

                      {/* Shipping Info */}
                      {order?.buyer?.address && (
                        <div className="mt-6 p-6 border-2 border-gray-900 bg-gray-50">
                          <div className="flex items-start gap-3">
                            <User className="w-5 h-5 mt-1" />
                            <div>
                              <p className="text-xs font-bold uppercase tracking-wider text-gray-600 mb-2">Shipping Address</p>
                              <p className="text-lg font-medium text-gray-900">{order?.buyer?.name}</p>
                              <p className="text-gray-600 mt-2">{order?.buyer?.address}</p>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default Orders;
