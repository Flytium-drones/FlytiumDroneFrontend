import toast from "react-hot-toast";
import AdminMenu from "../../components/Layout/AdminMenu";
import Layout from "../../components/Layout/Layout";
import axios from "axios";
import { useAuth } from "../../Context/auth";
import { useEffect, useState } from "react";
import moment from "moment";
import { API_URL } from "../../api";
import { Select } from "antd";
import {
  Package,
  Search,
  ChevronDown,
  ChevronUp,
  ShoppingBag,
  User,
  Calendar,
  CreditCard,
  MapPin,
  Mail,
  Phone,
  CheckCircle,
  Clock
} from "lucide-react";

const AdminOrders = () => {
  const [status] = useState([
    "Not Process",
    "Processing",
    "Shipped",
    "Delivered",
    "Cancelled",
  ]);
  const [orders, setOrders] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const { auth } = useAuth();
  const [expandedProducts, setExpandedProducts] = useState({});

  const getOrders = async () => {
    try {
      const response = await axios.get(`${API_URL}/api/payment/all-orders`, {
        headers: {
          Authorization: `Bearer ${auth?.token}`,
        },
      });
      const data = response.data;
      if (data.success) {
        setOrders(data.orders);
      }
    } catch (error) {
      console.log("Get Orders Error:", error);
      toast.error("Error fetching orders");
    }
  };

  useEffect(() => {
    getOrders();
  }, [auth?.token]);

  const handleChange = async (value, orderId) => {
    try {
      const response = await axios.put(
        `${API_URL}/api/auth/order-status/${orderId}`,
        {
          status: value,
        }
      );
      const data = response.data;
      if (data.success) {
        toast.success(data.message, {
          style: {
            border: "1px solid #713200",
            padding: "16px",
            color: "#713200",
          },
          iconTheme: {
            primary: "#713200",
            secondary: "#FFFAEE",
          },
        });
        getOrders();
      }
    } catch (error) {
      console.log("Change Status Error:", error);
      toast.error("Error updating status");
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "Delivered":
        return "border-emerald-500 bg-emerald-500/10 text-emerald-400";
      case "Cancelled":
        return "border-red-500 bg-red-500/10 text-red-400";
      case "Processing":
        return "border-amber-500 bg-amber-500/10 text-amber-400";
      case "Shipped":
        return "border-cyan-500 bg-cyan-500/10 text-cyan-400";
      default:
        return "border-slate-600 bg-slate-600/10 text-slate-400";
    }
  };

  const filteredOrders = orders.filter((order) => {
    const searchStr = searchTerm.toLowerCase().replace('#', '');
    const razorpayId = order?.payment?.razorpay_order_id?.toLowerCase() || '';
    const orderId = order._id.toLowerCase();
    
    const matchesSearch = order.buyer?.name.toLowerCase().includes(searchStr) ||
                          orderId.includes(searchStr) ||
                          razorpayId.includes(searchStr);
                          
    const matchesStatus = statusFilter === "All" || order.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const toggleProductDetails = (orderId, productId) => {
    setExpandedProducts((prev) => ({
      ...prev,
      [`${orderId}-${productId}`]: !prev[`${orderId}-${productId}`],
    }));
  };

  return (
    <Layout title={"Admin Orders"} description={"Manage Orders"}>
      <div className="min-h-screen bg-slate-950">
        <div className="flex flex-col lg:flex-row">
          <div className="lg:w-1/5 bg-slate-900 border-r-2 border-slate-800">
            <AdminMenu />
          </div>

          <div className="flex-1 p-8">
            {/* Header */}
            <div className="mb-12 pb-8 border-b-2 border-slate-800">
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                <div className="flex items-center gap-4">
                  <div className="p-3 border-2 border-indigo-600 bg-indigo-600/10">
                    <ShoppingBag className="w-8 h-8 text-indigo-400" />
                  </div>
                  <div>
                    <h1 className="text-5xl font-black text-white mb-2">Orders</h1>
                    <p className="text-xl text-slate-400">Manage and track all orders</p>
                  </div>
                </div>
                
                <div className="relative">
                  <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
                  <input
                    type="text"
                    placeholder="Search by customer or order ID..."
                    className="pl-14 pr-6 py-4 bg-slate-900 border-2 border-slate-800 focus:border-indigo-600 text-white placeholder-slate-500 font-medium outline-none transition-colors w-96"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
              <div 
                onClick={() => setStatusFilter("All")}
                className={`bg-slate-900 border-2 p-6 cursor-pointer transition-all ${statusFilter === "All" ? 'border-indigo-600' : 'border-slate-800 hover:border-indigo-400'}`}
              >
                <div className="flex items-center gap-3 mb-2">
                  <ShoppingBag className="w-5 h-5 text-indigo-400" />
                  <p className="text-sm font-bold uppercase tracking-wider text-slate-400">Total Orders</p>
                </div>
                <p className="text-4xl font-black text-white">{orders.length}</p>
              </div>
              
              <div 
                onClick={() => setStatusFilter("Processing")}
                className={`bg-slate-900 border-2 p-6 cursor-pointer transition-all ${statusFilter === "Processing" ? 'border-amber-500' : 'border-slate-800 hover:border-amber-400'}`}
              >
                <div className="flex items-center gap-3 mb-2">
                  <Clock className="w-5 h-5 text-amber-400" />
                  <p className="text-sm font-bold uppercase tracking-wider text-slate-400">Processing</p>
                </div>
                <p className="text-4xl font-black text-white">
                  {orders.filter(o => o.status === 'Processing').length}
                </p>
              </div>

              <div 
                onClick={() => setStatusFilter("Delivered")}
                className={`bg-slate-900 border-2 p-6 cursor-pointer transition-all ${statusFilter === "Delivered" ? 'border-emerald-500' : 'border-slate-800 hover:border-emerald-400'}`}
              >
                <div className="flex items-center gap-3 mb-2">
                  <CheckCircle className="w-5 h-5 text-emerald-400" />
                  <p className="text-sm font-bold uppercase tracking-wider text-slate-400">Delivered</p>
                </div>
                <p className="text-4xl font-black text-white">
                  {orders.filter(o => o.status === 'Delivered').length}
                </p>
              </div>

              <div className="bg-slate-900 border-2 border-slate-800 p-6">
                <div className="flex items-center gap-3 mb-2">
                  <Search className="w-5 h-5 text-cyan-400" />
                  <p className="text-sm font-bold uppercase tracking-wider text-slate-400">Filtered</p>
                </div>
                <p className="text-4xl font-black text-white">{filteredOrders.length}</p>
              </div>
            </div>

            {/* Orders List */}
            {filteredOrders.length > 0 ? (
              <div className="space-y-6">
                {filteredOrders.map((order) => (
                  <div
                    key={order._id}
                    className="bg-slate-900 border-2 border-slate-800 hover:border-indigo-600 transition-all"
                  >
                    {/* Order Header */}
                    <div className="p-6 bg-slate-800/50 border-b-2 border-slate-800">
                      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
                        <div className="flex items-start gap-3">
                          <Package className="w-5 h-5 mt-1 text-indigo-400" />
                          <div>
                            <p className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">Order ID</p>
                            <p className="text-lg font-black text-white">
                              #{order?.payment?.razorpay_order_id?.slice(-8) || order._id.slice(-8)}
                            </p>
                          </div>
                        </div>
                        
                        <div className="flex items-start gap-3">
                          <User className="w-5 h-5 mt-1 text-cyan-400" />
                          <div>
                            <p className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">Customer</p>
                            <p className="text-lg font-black text-white">{order.buyer?.name}</p>
                            <p className="text-sm text-slate-400">{order.buyer?.email}</p>
                          </div>
                        </div>
                        
                        <div className="flex items-start gap-3">
                          <Calendar className="w-5 h-5 mt-1 text-amber-400" />
                          <div>
                            <p className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">Order Date</p>
                            <p className="text-lg font-black text-white">
                              {moment(order.createdAt).format("MMM DD, YYYY")}
                            </p>
                          </div>
                        </div>
                        
                        <div className="flex items-start gap-3">
                          <CreditCard className="w-5 h-5 mt-1 text-emerald-400" />
                          <div>
                            <p className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">Total Amount</p>
                            <p className="text-lg font-black text-white">₹{order.totalAmount}</p>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="p-6">
                      {/* Status and Payment */}
                      <div className="flex flex-wrap gap-6 items-center justify-between mb-6 pb-6 border-b-2 border-slate-800">
                        <div className="flex items-center gap-6">
                          <div>
                            <p className="text-xs text-slate-500 font-bold uppercase mb-2">Payment Status</p>
                            <div className={`px-4 py-2 border-2 ${
                              order?.payment?.method === "COD" 
                                ? "border-yellow-500 bg-yellow-500/10 text-yellow-400"
                                : order?.payment?.razorpay_payment_id
                                  ? "border-emerald-500 bg-emerald-500/10 text-emerald-400"
                                  : "border-red-500 bg-red-500/10 text-red-400"
                            } font-bold`}>
                              {order?.payment?.method === "COD" ? "COD" : order?.payment?.razorpay_payment_id ? "PAID" : "PENDING"}
                            </div>
                            {order?.payment?.razorpay_payment_id && (
                              <p className="text-xs text-slate-500 mt-1">
                                ID: {order.payment.razorpay_payment_id.slice(-8)}
                              </p>
                            )}
                          </div>
                        </div>

                        <div>
                          <p className="text-xs text-slate-500 font-bold uppercase mb-2">Order Status</p>
                          <Select
                            defaultValue={order?.status}
                            style={{ width: 160 }}
                            onChange={(value) => handleChange(value, order._id)}
                            className="dark-select"
                          >
                            {status.map((item, index) => (
                              <Select.Option key={index} value={item}>
                                {item}
                              </Select.Option>
                            ))}
                          </Select>
                        </div>
                      </div>

                      {/* Shipping Address */}
                      <div className="mb-6 p-6 bg-slate-800/50 border-2 border-slate-800">
                        <div className="flex items-center gap-3 mb-4 pb-4 border-b-2 border-slate-800">
                          <MapPin className="w-5 h-5 text-indigo-400" />
                          <h3 className="text-xl font-black text-white">Shipping Address</h3>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div className="space-y-2">
                            <p className="text-lg font-bold text-white">{order.shippingAddress?.name}</p>
                            <p className="text-slate-400">{order.shippingAddress?.address}</p>
                            <p className="text-slate-400">
                              {order.shippingAddress?.city}, {order.shippingAddress?.state}
                            </p>
                            <p className="text-slate-400">PIN: {order.shippingAddress?.pincode}</p>
                          </div>
                          <div className="space-y-2">
                            <div className="flex items-center gap-2">
                              <Mail className="w-4 h-4 text-cyan-400" />
                              <p className="text-slate-400">{order.shippingAddress?.email}</p>
                            </div>
                            <div className="flex items-center gap-2">
                              <Phone className="w-4 h-4 text-amber-400" />
                              <p className="text-slate-400">{order.shippingAddress?.phone}</p>
                            </div>
                            <p className="text-slate-400">Country: {order.shippingAddress?.country || 'India'}</p>
                          </div>
                        </div>
                      </div>

                      {/* Products Grid */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                        {order.products?.map((item, idx) => (
                          <div
                            key={idx}
                            className="border-2 border-slate-800 hover:border-cyan-500 transition-all overflow-hidden group"
                          >
                            <div className="aspect-square bg-slate-800">
                              <img
                                src={item.image}
                                alt={item.name}
                                className="w-full h-full object-contain p-4 group-hover:scale-105 transition-transform"
                              />
                            </div>

                            <div className="p-4 bg-slate-800/50">
                              <h4 className="font-black text-white text-sm mb-2 line-clamp-1">
                                {item.name}
                              </h4>
                              <div className="flex justify-between items-center mb-2">
                                <p className="text-lg font-black text-cyan-400">₹{item.price}</p>
                                <p className="text-xs px-2 py-1 bg-slate-900 text-white font-bold">
                                  Qty: {item.quantity}
                                </p>
                              </div>
                              <p className="text-sm font-bold text-emerald-400">
                                Total: ₹{item.price * item.quantity}
                              </p>

                              <button
                                onClick={() => toggleProductDetails(order._id, idx)}
                                className="mt-3 w-full flex items-center justify-center gap-2 px-3 py-2 border-2 border-slate-700 hover:border-indigo-600 text-slate-400 hover:text-white text-xs font-bold transition-colors"
                              >
                                {expandedProducts[`${order._id}-${idx}`] ? (
                                  <>
                                    <ChevronUp className="w-4 h-4" />
                                    Hide Details
                                  </>
                                ) : (
                                  <>
                                    <ChevronDown className="w-4 h-4" />
                                    Show Details
                                  </>
                                )}
                              </button>

                              {expandedProducts[`${order._id}-${idx}`] && (
                                <div className="mt-3 pt-3 border-t-2 border-slate-800">
                                  <p className="text-sm text-slate-400 line-clamp-3 mb-2">
                                    {item.description}
                                  </p>
                                  <div className="text-sm">
                                    <span className="text-slate-500">Category: </span>
                                    <span className="text-white font-bold">{item.category?.name}</span>
                                  </div>
                                </div>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="border-2 border-slate-800 bg-slate-900 p-16 text-center">
                <Package className="w-24 h-24 mx-auto mb-6 text-slate-700" />
                <h3 className="text-2xl font-black text-white mb-4">No Orders Found</h3>
                <p className="text-slate-400 max-w-md mx-auto">
                  {searchTerm 
                    ? 'Try adjusting your search criteria' 
                    : 'Orders will appear here once customers place them'}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default AdminOrders;
