import toast from "react-hot-toast";
import AdminMenu from "../../components/Layout/AdminMenu";
import Layout from "../../components/Layout/Layout";
import axios from "axios";
import { useAuth } from "../../Context/auth";
import { useEffect, useState } from "react";
import moment from "moment";
import { API_URL } from "../../api";
import { Select } from "antd";
import { FaBox, FaSearch, FaChevronDown, FaChevronUp } from "react-icons/fa";

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
  const { auth } = useAuth();
  const [expandedProducts, setExpandedProducts] = useState({});

  const getOrders = async () => {
    try {
      const response = await axios.get(`${API_URL}/api/auth/all-orders`, {
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
            border: '1px solid #713200',
            padding: '16px',
            color: '#713200',
          },
          iconTheme: {
            primary: '#713200',
            secondary: '#FFFAEE',
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
        return "bg-green-100 text-green-800";
      case "Cancelled":
        return "bg-red-100 text-red-800";
      case "Processing":
        return "bg-yellow-100 text-yellow-800";
      case "Shipped":
        return "bg-blue-100 text-blue-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const filteredOrders = orders.filter(
    (order) =>
      order.buyer?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order._id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const toggleProductDetails = (orderId, productId) => {
    setExpandedProducts((prev) => ({
      ...prev,
      [`${orderId}-${productId}`]: !prev[`${orderId}-${productId}`],
    }));
  };

  return (
    <Layout title={"Admin Orders"} description={"Manage Orders"}>
      <div className="min-h-screen bg-gray-50">
        <div className="flex flex-col md:flex-row">
          <div className="md:w-1/4 bg-white shadow-md">
            <AdminMenu />
          </div>

          <div className="md:w-3/4 p-6">
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex justify-between items-center mb-6">
                <div className="flex items-center gap-3">
                  <FaBox className="text-blue-500 text-2xl" />
                  <h1 className="text-2xl font-bold text-gray-800">
                    Orders Management
                  </h1>
                </div>
                <div className="relative">
                  <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search orders..."
                    className="pl-10 pr-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </div>

              {filteredOrders.length > 0 ? (
                <div className="space-y-6">
                  {filteredOrders.map((order) => (
                    <div
                      key={order._id}
                      className="bg-white border border-gray-200 rounded-lg overflow-hidden transition-shadow duration-300 hover:shadow-lg"
                    >
                      <div className="p-4 bg-gray-50 border-b">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <div>
                            <p className="text-sm text-gray-600">Order ID</p>
                            <p className="font-medium">
                              #{order._id.slice(-6)}
                            </p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-600">
                              Customer Name
                            </p>
                            <p className="font-medium">{order.buyer?.name}</p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-600">Order Date</p>
                            <p className="font-medium">
                              {moment(order.createdAt).format("MMM DD, YYYY")}
                            </p>
                          </div>
                        </div>
                      </div>

                      <div className="p-4">
                        <div className="flex flex-wrap gap-4 items-center justify-between mb-4">
                          <div className="flex items-center gap-4">
                            <div>
                              <p className="text-sm text-gray-600">
                                Payment Status
                              </p>
                              <span
                                className={`px-2 py-1 rounded-full text-xs font-medium ${
                                  order?.payment?.razorpay_payment_id
                                    ? "bg-green-100 text-green-800"
                                    : "bg-red-100 text-red-800"
                                }`}
                              >
                                {order?.payment?.razorpay_payment_id
                                  ? "Paid"
                                  : "Pending"}
                              </span>
                            </div>
                            <div>
                              <p className="text-sm text-gray-600">Items</p>
                              <p className="font-medium">
                                {order.products?.length}
                              </p>
                            </div>
                          </div>

                          <div>
                            <p className="text-sm text-gray-600 mb-1">
                              Order Status
                            </p>
                            <Select
                              defaultValue={order?.status}
                              style={{ width: 140 }}
                              onChange={(value) =>
                                handleChange(value, order._id)
                              }
                              className="text-sm"
                            >
                              {status.map((item, index) => (
                                <Select.Option key={index} value={item}>
                                  {item}
                                </Select.Option>
                              ))}
                            </Select>
                          </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                          {order.products?.map((item, idx) => (
                            <div
                              key={idx}
                              className="bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-md transition-shadow duration-200"
                            >
                              <div className="relative pb-[100%]">
                                <img
                                  src={item.image}
                                  alt={item.name}
                                  className="absolute inset-0 w-full h-full object-cover"
                                />
                              </div>

                              <div className="p-3">
                                <h4 className="font-medium text-gray-900 truncate">
                                  {item.name}
                                </h4>
                                <p className="text-sm font-medium text-blue-600 mt-1">
                                  Rs. {item.price}
                                </p>

                                <button
                                  onClick={() =>
                                    toggleProductDetails(order._id, idx)
                                  }
                                  className="mt-2 flex items-center gap-1 text-sm text-gray-600 hover:text-gray-900 transition-colors duration-200"
                                >
                                  {expandedProducts[`${order._id}-${idx}`] ? (
                                    <>
                                      <FaChevronUp className="text-xs" />
                                      Hide Details
                                    </>
                                  ) : (
                                    <>
                                      <FaChevronDown className="text-xs" />
                                      Show Details
                                    </>
                                  )}
                                </button>

                                {expandedProducts[`${order._id}-${idx}`] && (
                                  <div className="mt-2 pt-2 border-t border-gray-100">
                                    <div className="space-y-1">
                                      <p className="text-sm text-gray-600 line-clamp-3">
                                        {item.description}
                                      </p>
                                      <div className="text-sm">
                                        <span className="text-gray-600">
                                          Category:{" "}
                                        </span>
                                        <span className="text-gray-900">
                                          {item.category?.name}
                                        </span>
                                      </div>
                                      {/* Add more product details here if needed */}
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
                <div className="text-center py-12">
                  <FaBox className="mx-auto text-gray-400 text-5xl mb-4" />
                  <p className="text-gray-600 text-lg">No orders found</p>
                  <p className="text-gray-500">
                    Orders will appear here once customers place them
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default AdminOrders;
