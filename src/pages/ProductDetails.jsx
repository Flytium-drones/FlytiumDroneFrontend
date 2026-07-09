import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { API_URL } from "../api";
import toast from "react-hot-toast";
import { useCart } from "../Context/cart";
import SEO from "../components/SEO/SEO";
import { Minus, Plus, ShoppingCart, ArrowLeft, Tag, Package, ShieldCheck, Truck } from "lucide-react";

const ProductDetails = () => {
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const { slug } = useParams();
  const navigate = useNavigate();
  const { cart, setCart } = useCart();

  useEffect(() => {
    getProduct();
  }, [slug]);

  const getProduct = async () => {
    try {
      const response = await axios.get(
        `${API_URL}/api/product/get-product/${slug}`
      );
      if (response?.data?.success) {
        setProduct(response.data.product);
      }
    } catch (error) {
      console.error("Error fetching product:", error);
      toast.error("Error fetching product details");
    } finally {
      setLoading(false);
    }
  };

  const handleIncreaseQuantity = () => {
    setQuantity((prev) => prev + 1);
  };

  const handleDecreaseQuantity = () => {
    if (quantity > 1) {
      setQuantity((prev) => prev - 1);
    }
  };

  const handleAddToCart = () => {
    try {
      const existingProductIndex = cart.findIndex(
        (item) => item._id === product._id
      );
      let updatedCart;

      if (existingProductIndex >= 0) {
        updatedCart = cart.map((item, index) =>
          index === existingProductIndex
            ? { ...item, quantity: (item.quantity || 0) + quantity }
            : item
        );
        toast.success(`Added ${quantity} more ${product.name}(s) to cart`, {
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
      } else {
        updatedCart = [...cart, { ...product, quantity }];
        toast.success(`Added ${quantity} ${product.name}(s) to cart`, {
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
      }

      setCart(updatedCart);
      localStorage.setItem("Flytium", JSON.stringify(updatedCart));
      setQuantity(1);
    } catch (error) {
      console.error("Error adding to cart:", error);
      toast.error("Failed to add to cart");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="w-16 h-16 border-4 border-gray-900 border-t-transparent animate-spin"></div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-white">
        <Package className="w-24 h-24 mb-6 text-gray-400" />
        <h2 className="text-3xl font-black text-gray-900 mb-4">Product Not Found</h2>
        <button
          onClick={() => navigate("/store")}
          className="group px-8 py-4 bg-gray-900 text-white font-bold flex items-center gap-2 hover:bg-gray-800 transition-colors"
        >
          <ArrowLeft className="w-5 h-5 transition-transform group-hover:-translate-x-2" />
          Back to Store
        </button>
      </div>
    );
  }

  return (
    <>
      <SEO 
        title={product?.name ? `${product.name} - Flytium Drones` : "Flytium Drones"} 
        description={product?.description || "High performance nano drones and kits."}
        image={product?.image}
      />
      <div className="min-h-screen bg-white">
      
      {/* Navigation */}
      <div className="border-b-2 border-gray-900">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <button
            onClick={() => navigate("/store")}
            className="group flex items-center gap-2 text-gray-600 hover:text-gray-900 font-medium transition-colors"
          >
            <ArrowLeft className="w-5 h-5 transition-transform group-hover:-translate-x-2" />
            Back to Store
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          
          {/* Product Image */}
          <div className="border-2 border-gray-900 p-8 lg:p-12 bg-gray-50">
            <div className="aspect-square bg-white border-2 border-gray-900 flex items-center justify-center p-8">
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-full object-contain"
              />
            </div>
          </div>

          {/* Product Info */}
          <div className="flex flex-col">
            
            {/* Category Tag */}
            <div className="flex items-center gap-2 mb-6">
              <Tag className="w-4 h-4" />
              <span className="text-sm font-bold uppercase tracking-wider text-gray-600">
                {product.category.name}
              </span>
            </div>

            {/* Product Title */}
            <h1 className="text-5xl font-black text-gray-900 leading-tight mb-6">
              {product.name}
            </h1>

            {/* Price Section */}
            <div className="mb-8 pb-8 border-b-2 border-gray-900">
              <div className="flex items-end gap-4 mb-2">
                <span className="text-5xl font-black text-gray-900">
                  ₹{product.price.toLocaleString()}
                </span>
                <span className="text-2xl text-gray-400 line-through mb-2">
                  ₹{(product.price * 1.2).toLocaleString()}
                </span>
              </div>
              <div className="inline-block px-3 py-1 bg-emerald-600 text-white text-sm font-bold">
                SAVE 20%
              </div>
            </div>

            {/* Description */}
            <p className="text-lg text-gray-600 mb-8 leading-relaxed">
              {product.description}
            </p>

            {/* Quantity Selector */}
            <div className="mb-8">
              <label className="block text-sm font-bold uppercase tracking-wider text-gray-600 mb-4">
                Quantity
              </label>
              <div className="flex items-center gap-4">
                <button
                  onClick={handleDecreaseQuantity}
                  disabled={quantity <= 1}
                  className="w-12 h-12 border-2 border-gray-900 flex items-center justify-center hover:bg-gray-900 hover:text-white disabled:opacity-30 disabled:hover:bg-white disabled:hover:text-gray-900 transition-colors"
                >
                  <Minus className="w-5 h-5" />
                </button>

                <span className="text-2xl font-black text-gray-900 min-w-[60px] text-center">
                  {quantity}
                </span>

                <button
                  onClick={handleIncreaseQuantity}
                  className="w-12 h-12 border-2 border-gray-900 flex items-center justify-center hover:bg-gray-900 hover:text-white transition-colors"
                >
                  <Plus className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Total */}
            <div className="mb-8 p-6 border-2 border-gray-900">
              <div className="flex justify-between items-center">
                <span className="text-sm font-bold uppercase tracking-wider text-gray-600">
                  Total Price
                </span>
                <span className="text-3xl font-black text-gray-900">
                  ₹{(product.price * quantity).toLocaleString()}
                </span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-4 mb-8">
              <button
                onClick={handleAddToCart}
                className="flex-1 group relative px-8 py-5 bg-gray-900 text-white font-bold overflow-hidden"
              >
                <span className="relative z-10 flex items-center justify-center gap-3">
                  <ShoppingCart className="w-5 h-5" />
                  Add {quantity} to Cart
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-emerald-600 via-blue-600 to-purple-600 translate-x-[-100%] group-hover:translate-x-0 transition-transform duration-500"></div>
              </button>

              <button
                onClick={() => navigate("/cartpage")}
                className="flex-1 px-8 py-5 border-2 border-gray-900 text-gray-900 font-bold hover:bg-gray-50 transition-colors"
              >
                View Cart
              </button>
            </div>

            {/* Features */}
            <div className="space-y-4">
              <div className="flex items-start gap-4 border-l-4 border-gray-900 pl-4 py-2">
                <Truck className="w-6 h-6 flex-shrink-0 mt-1" />
                <div>
                  <p className="font-bold text-gray-900">Free Shipping</p>
                  <p className="text-sm text-gray-600">On orders over ₹999</p>
                </div>
              </div>

              

              <div className="flex items-start gap-4 border-l-4 border-gray-900 pl-4 py-2">
                <Package className="w-6 h-6 flex-shrink-0 mt-1" />
                <div>
                  <p className="font-bold text-gray-900">Secure Packaging</p>
                  <p className="text-sm text-gray-600">Safe delivery guaranteed</p>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
      </div>
    </>
  );
};

export default ProductDetails;
