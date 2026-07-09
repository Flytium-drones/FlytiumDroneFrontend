import { useState, useEffect } from "react";
import axios from "axios";
import { API_URL } from "../api";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { useCart } from "../Context/cart";
import { 
  X, ChevronLeft, ChevronRight, ShoppingCart, ArrowRight, Package, 
  Smartphone, Settings, Compass, Sliders, Info, Gamepad2, BookOpen, 
  Users, Wind, Smile, Wrench, Feather, Cpu, Phone, CheckCircle, Star 
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import SEO from "../components/SEO/SEO";

const IconMap = {
  Package, Smartphone, Settings, Compass, Sliders, 
  Info, Gamepad2, BookOpen, Users, Wind, 
  Smile, Wrench, Feather, Cpu, CheckCircle, Star
};
import { Prices } from "../components/Prices";

const Store = () => {
  // State management
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [checked, setChecked] = useState([]);
  const [showFilters, setShowFilters] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("default");
  const [currentPage, setCurrentPage] = useState(1);
  const [productsPerPage] = useState(12);
  const [radio, setRadio] = useState([]);
  const [categories, setCategories] = useState([]);
  const [viewMode, setViewMode] = useState("grid"); // grid or list
  
  // Store Hero Carousel state
  const [storeHeroes, setStoreHeroes] = useState([]);
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);

  const { cart, setCart } = useCart();
  const navigate = useNavigate();

  // Fetch products and apply initial filters
  useEffect(() => {
    getAllProducts();
    getAllCategories();
    getStoreHeroes();
  }, []);

  useEffect(() => {
    filterAndSortProducts();
  }, [checked, sortBy, searchTerm, products, radio]);

  // Reset page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [checked, sortBy, searchTerm]);

  // Carousel Auto-play logic
  useEffect(() => {
    if (storeHeroes.length > 1) {
      const interval = setInterval(() => {
        setCurrentSlideIndex((prevIndex) => (prevIndex + 1) % storeHeroes.length);
      }, 5000); // 5 seconds per slide
      return () => clearInterval(interval);
    }
  }, [storeHeroes]);

  const getAllProducts = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_URL}/api/product/get-product`);

      if (response?.data?.success) {
        setProducts(response.data.products);
        setFilteredProducts(response.data.products);
      } else {
        toast.error("Failed to fetch products");
      }
    } catch (error) {
      console.error("Error fetching products:", error);
      toast.error(error.response?.data?.message || "Error fetching products");
    } finally {
      setLoading(false);
    }
  };

  const getAllCategories = async () => {
    try {
      const response = await axios.get(`${API_URL}/api/category/get-category`);
      if (response?.data?.success) {
        setCategories(response.data.category);
      }
    } catch (error) {
      console.error("Error fetching categories:", error);
      toast.error("Failed to fetch categories");
    }
  };

  const getStoreHeroes = async () => {
    try {
      const response = await axios.get(`${API_URL}/api/storehero/get`);
      if (response?.data?.success && response?.data?.storeHeroes) {
        setStoreHeroes(response.data.storeHeroes);
      }
    } catch (error) {
      console.error("Error fetching Store Hero data:", error);
    }
  };

  const filterAndSortProducts = () => {
    let tempProducts = [...products];

    // Apply search filter
    if (searchTerm) {
      tempProducts = tempProducts.filter((prod) =>
        prod.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Apply category filter - make sure category exists before accessing _id
    if (checked.length > 0) {
      tempProducts = tempProducts.filter((prod) =>
        checked.includes(prod.category?._id)
      );
    }

    // Apply price range filter - use discounted price if available
    if (radio.length > 0) {
      const [min, max] = radio;
      tempProducts = tempProducts.filter((prod) => {
        const effectivePrice = prod.discountedPrice || prod.price;
        return effectivePrice >= min && effectivePrice <= max;
      });
    }

    // Apply sorting - consider discounted price when sorting by price
    switch (sortBy) {
      case "default":
        tempProducts.sort((a, b) => {
          const isNanoA = a.name.toLowerCase().includes("nano");
          const isNanoB = b.name.toLowerCase().includes("nano");
          if (isNanoA && !isNanoB) return -1;
          if (!isNanoA && isNanoB) return 1;
          return 0;
        });
        break;
      case "price-asc":
        tempProducts.sort((a, b) => {
          const priceA = a.discountedPrice || a.price;
          const priceB = b.discountedPrice || b.price;
          return priceA - priceB;
        });
        break;
      case "price-desc":
        tempProducts.sort((a, b) => {
          const priceA = a.discountedPrice || a.price;
          const priceB = b.discountedPrice || b.price;
          return priceB - priceA;
        });
        break;
      case "discount-high":
        tempProducts.sort((a, b) => {
          const discountA = getDiscountPercentage(a);
          const discountB = getDiscountPercentage(b);
          return discountB - discountA;
        });
        break;
      case "name-asc":
        tempProducts.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case "name-desc":
        tempProducts.sort((a, b) => b.name.localeCompare(a.name));
        break;
    }

    setFilteredProducts(tempProducts);
  };

  // Helper function to calculate discount percentage
  const getDiscountPercentage = (product) => {
    if (product.discountedPrice && product.price > product.discountedPrice) {
      return Math.round(
        ((product.price - product.discountedPrice) / product.price) * 100
      );
    }
    return 0;
  };

  // Enhanced add to cart function
  const handleAddToCart = (product) => {
    try {
      const existingProductIndex = cart.findIndex(
        (item) => item._id === product._id
      );
      let updatedCart;

      if (existingProductIndex >= 0) {
        updatedCart = cart.map((item, index) =>
          index === existingProductIndex
            ? { ...item, quantity: (item.quantity || 1) + 1 }
            : item
        );
        toast.success(`Increased ${product.name} quantity in cart`, {
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
      } else {
        updatedCart = [...cart, { ...product, quantity: 1 }];
        toast.success(`${product.name} added to cart`, {
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
      }

      setCart(updatedCart);
      localStorage.setItem("Flytium", JSON.stringify(updatedCart));
    } catch (error) {
      console.error("Error adding to cart:", error);
      toast.error("Failed to add to cart");
    }
  };

  // Pagination logic
  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = filteredProducts.slice(
    indexOfFirstProduct,
    indexOfLastProduct
  );
  const totalPages = Math.ceil(filteredProducts.length / productsPerPage);

  const handlePageChange = (pageNumber) => {
    if (pageNumber < 1 || pageNumber > totalPages) return;
    setCurrentPage(pageNumber);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const PaginationControls = () => {
    const maxVisiblePages = 5;
    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);
    
    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }

    return (
      <div className="flex justify-center items-center gap-2 mt-4">
        <button
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="w-10 h-10 border-2 border-gray-900 flex items-center justify-center hover:bg-gray-900 hover:text-white transition-colors disabled:opacity-30 disabled:hover:bg-white disabled:hover:text-gray-900"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>

        {startPage > 1 && (
          <>
            <button onClick={() => handlePageChange(1)} className="w-10 h-10 border border-gray-300 hover:border-gray-900">
              1
            </button>
            {startPage > 2 && <span className="px-2">...</span>}
          </>
        )}

        {[...Array(endPage - startPage + 1)].map((_, index) => {
          const pageNumber = startPage + index;
          return (
            <button
              key={pageNumber}
              onClick={() => handlePageChange(pageNumber)}
              className={`w-10 h-10 border-2 font-bold transition-colors ${
                currentPage === pageNumber
                  ? "border-gray-900 bg-gray-900 text-white"
                  : "border-gray-300 hover:border-gray-900"
              }`}
            >
              {pageNumber}
            </button>
          );
        })}

        {endPage < totalPages && (
          <>
            {endPage < totalPages - 1 && <span className="px-2">...</span>}
            <button onClick={() => handlePageChange(totalPages)} className="w-10 h-10 border border-gray-300 hover:border-gray-900">
              {totalPages}
            </button>
          </>
        )}

        <button
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="w-10 h-10 border-2 border-gray-900 flex items-center justify-center hover:bg-gray-900 hover:text-white transition-colors disabled:opacity-30 disabled:hover:bg-white disabled:hover:text-gray-900"
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>
    );
  };

  return (
    <>
      <SEO 
        title="Flytium Store - Buy Drones" 
        description="Shop the best nano drones, DIY kits, and accessories." 
      />
      <div className="bg-white min-h-screen">
      {/* Premium Nano Drone Featured Sections - Carousel */}
      {(() => {
        const nanoDroneFallback = products.find(p => p.name.toLowerCase().includes('nano')) || { 
          _id: 'nano-featured',
          name: 'Flytium Nano Drone', 
          image: '/drone-placeholder.png', 
          price: 2999, 
          discountedPrice: 2499,
          description: 'Build, control, and explore advanced flight features in a compact nano drone.'
        };

        const activeHero = storeHeroes.length > 0 ? storeHeroes[currentSlideIndex] : null;

        return (
          <div className="bg-gradient-to-b from-white to-cyan-50/30 font-sans pb-12 border-b-2 border-slate-100 overflow-hidden relative">
            {/* Background Decorative Elements */}
            <div className="absolute top-0 inset-x-0 h-[800px] pointer-events-none z-0 overflow-hidden">
              <div className="absolute top-[-10%] right-[-5%] w-[600px] h-[600px] bg-blue-100/40 rounded-full blur-[120px]"></div>
              <div className="absolute bottom-[-10%] left-[-10%] w-[500px] h-[500px] bg-cyan-100/40 rounded-full blur-[100px]"></div>
              <div className="absolute inset-0" style={{ backgroundImage: 'radial-gradient(#e5e7eb 1px, transparent 1px)', backgroundSize: '40px 40px', opacity: 0.3 }}></div>
            </div>

            <div className="relative z-10 min-h-[850px]">
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentSlideIndex}
                  initial={{ opacity: 0, x: 50 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -50 }}
                  transition={{ duration: 0.5, ease: "easeInOut" }}
                >
                  {/* 1. HERO SECTION */}
                  <section className="pt-16 pb-12 px-6 max-w-7xl mx-auto">
                    <div className="flex flex-col lg:flex-row gap-12 items-center">
                      
                      {/* Left Side: Product Info & Image */}
                      <div className="flex-1 flex flex-col items-start w-full">
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-50 border border-blue-100 mb-6 shadow-sm">
                          <div className="w-5 h-5 rounded-full bg-blue-500 flex items-center justify-center">
                            <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path></svg>
                          </div>
                          <span className="text-sm font-bold text-blue-600">{activeHero?.badgeText || "Best Price Available"}</span>
                        </div>

                        <h1 className="text-5xl md:text-6xl font-black text-slate-900 leading-tight mb-3">
                          {activeHero?.title || nanoDroneFallback.name}
                        </h1>
                        <h2 className="text-xl md:text-2xl text-slate-500 font-medium mb-4">
                          {activeHero?.subtitle || "DIY Kit for Smart Learning & Fun Flying"}
                        </h2>
                        <p className="text-slate-600 text-lg mb-8 max-w-lg leading-relaxed">
                          {activeHero?.description || nanoDroneFallback.description}
                        </p>

                        <div className="w-full bg-white rounded-3xl p-8 shadow-xl shadow-blue-900/5 border border-slate-100 mb-8 relative group flex justify-center items-center h-[350px]">
                          <img 
                            src={activeHero?.image || nanoDroneFallback.image || "/drone-placeholder.png"} 
                            alt={activeHero?.title || nanoDroneFallback.name} 
                            className="max-h-full max-w-full object-contain drop-shadow-2xl group-hover:scale-105 transition-transform duration-500 ease-out"
                          />
                          <div className="absolute top-4 right-4 bg-white/90 backdrop-blur px-4 py-2 rounded-xl shadow-lg font-black text-xl text-slate-900 border border-slate-100">
                            ₹{activeHero?.discountedPrice || activeHero?.price || nanoDroneFallback.discountedPrice || nanoDroneFallback.price}
                          </div>
                        </div>

                        <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
                          <button 
                            onClick={() => handleAddToCart(nanoDroneFallback)}
                            className="px-8 py-4 bg-gradient-to-r from-yellow-400 to-yellow-500 hover:from-yellow-500 hover:to-yellow-600 text-slate-900 font-black rounded-full shadow-lg shadow-yellow-500/30 flex items-center justify-center gap-3 transition-all transform hover:-translate-y-1"
                          >
                            <ShoppingCart className="w-5 h-5" />
                            BUY NOW
                          </button>
                          <button 
                            onClick={() => {
                              const el = document.getElementById('store-grid');
                              if(el) el.scrollIntoView({ behavior: 'smooth' });
                            }}
                            className="px-8 py-4 bg-white border-2 border-slate-200 text-slate-700 hover:border-slate-800 hover:text-slate-900 font-bold rounded-full shadow-sm flex items-center justify-center gap-2 transition-all"
                          >
                            <ArrowRight className="w-5 h-5" />
                            VIEW ALL DRONES
                          </button>
                        </div>
                      </div>

                      {/* Right Side: Features Panel */}
                      <div className="w-full lg:w-[450px] shrink-0">
                        <div className="bg-white/60 backdrop-blur-xl border border-white rounded-[2rem] p-8 shadow-2xl shadow-cyan-900/10">
                          <div className="flex items-center gap-4 mb-8">
                            <div className="h-0.5 flex-1 bg-gradient-to-r from-transparent to-cyan-200"></div>
                            <h3 className="text-sm font-black tracking-widest text-cyan-600 uppercase">Powerful Features</h3>
                            <div className="h-0.5 w-8 bg-cyan-200"></div>
                            <div className="h-0.5 w-2 bg-cyan-200"></div>
                          </div>

                          <div className="space-y-4">
                            {activeHero?.features?.map((feat, i) => {
                              const IconComponent = IconMap[feat.icon] || Package;
                              return (
                                <div key={i} className="group bg-white rounded-2xl p-4 flex items-center gap-5 shadow-sm border border-slate-50 hover:shadow-md hover:border-blue-100 transition-all cursor-default transform hover:-translate-y-1">
                                  <div className="w-14 h-14 rounded-full bg-blue-50 flex items-center justify-center shrink-0 group-hover:bg-blue-500 transition-colors">
                                    <IconComponent className="w-6 h-6 text-blue-500 group-hover:text-white" />
                                  </div>
                                  <div className="w-px h-10 bg-slate-100"></div>
                                  <p className="font-bold text-slate-800 text-lg group-hover:text-blue-600 transition-colors leading-tight">{feat.title}</p>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      </div>
                    </div>
                  </section>

                  {/* 2. PRODUCT INFORMATION SECTION */}
                  <section className="py-12 bg-white/50 backdrop-blur-sm border-y border-slate-100">
                    <div className="max-w-7xl mx-auto px-6">
                      <h2 className="text-3xl font-black text-slate-900 mb-8 text-center">Product Information</h2>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {activeHero?.productInfo?.map((info, i) => {
                          const IconComponent = IconMap[info.icon] || Info;
                          // Dynamic col-span for odd last items to make grid look nice
                          const isLastOdd = i === activeHero.productInfo.length - 1 && activeHero.productInfo.length % 2 !== 0 && activeHero.productInfo.length % 3 !== 0;
                          return (
                            <div key={i} className={`bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-start gap-4 hover:shadow-md transition-shadow ${isLastOdd ? 'lg:col-span-2' : ''}`}>
                              <div className="w-12 h-12 rounded-xl bg-cyan-50 flex items-center justify-center shrink-0 text-cyan-600">
                                <IconComponent className="w-6 h-6" />
                              </div>
                              <div>
                                <h4 className="text-sm font-bold text-slate-400 uppercase mb-1">{info.title}</h4>
                                <p className="font-bold text-slate-800 leading-snug">{info.description}</p>
                              </div>
                            </div>
                          )
                        })}
                      </div>
                    </div>
                  </section>

                  {/* 3. WHY CHOOSE SECTION & CTA */}
                  <section className="py-16">
                    <div className="max-w-7xl mx-auto px-6">
                      <h2 className="text-3xl font-black text-slate-900 mb-10 text-center">Why Choose {activeHero?.title || 'Flytium'}</h2>
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
                        {activeHero?.whyChoose?.map((item, i) => {
                          const IconComponent = IconMap[item.icon] || Smile;
                          return (
                            <div key={i} className="bg-white rounded-3xl p-6 text-center shadow-sm border border-slate-100 hover:-translate-y-2 transition-transform duration-300">
                              <div className="w-14 h-14 mx-auto bg-blue-50 rounded-2xl flex items-center justify-center text-blue-600 mb-4">
                                <IconComponent className="w-7 h-7" />
                              </div>
                              <h4 className="text-md font-bold text-slate-900">{item.title}</h4>
                            </div>
                          )
                        })}
                      </div>
                    </div>
                  </section>
                </motion.div>
              </AnimatePresence>
            </div>
            
            {/* Carousel Indicators (Dots) */}
            {storeHeroes.length > 1 && (
              <div className="flex justify-center gap-3 -mt-6 pb-10 relative z-20">
                {storeHeroes.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => setCurrentSlideIndex(idx)}
                    className={`w-3 h-3 rounded-full transition-all duration-300 ${
                      currentSlideIndex === idx ? "bg-blue-600 w-8" : "bg-slate-300 hover:bg-slate-400 border border-slate-400"
                    }`}
                    aria-label={`Go to slide ${idx + 1}`}
                  />
                ))}
              </div>
            )}
            
            <div className="max-w-7xl mx-auto px-6 relative z-20 pb-10">
              <div className="bg-gradient-to-br from-slate-900 to-blue-950 rounded-[2rem] p-10 text-center shadow-2xl relative overflow-hidden max-w-4xl mx-auto">
                <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/20 rounded-full blur-[80px]"></div>
                <div className="relative z-10">
                  <h2 className="text-3xl md:text-4xl font-black text-white mb-4">Ready to Build Your Own Drone?</h2>
                  <p className="text-blue-100 mb-8 font-medium">Start your drone learning journey today.</p>
                  <div className="flex justify-center gap-4">
                    <button onClick={() => handleAddToCart(nanoDroneFallback)} className="px-8 py-3 bg-yellow-400 hover:bg-yellow-500 text-slate-900 font-black rounded-full shadow-lg transition-all hover:scale-105">BUY NOW</button>
                    <button onClick={() => navigate('/contact')} className="px-8 py-3 bg-white/10 hover:bg-white/20 text-white border border-white/20 font-bold rounded-full backdrop-blur-sm transition-all hover:scale-105 flex items-center gap-2"><Phone className="w-4 h-4" /> CONTACT US</button>
                  </div>
                </div>
              </div>
            </div>

          </div>
        );
      })()}

      {/* Main Content */}
      <section className="py-12 bg-slate-50">
        <div className="max-w-7xl mx-auto px-6">
          
          {/* Filter Bar */}
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-10 p-4 bg-white rounded-2xl shadow-sm border border-slate-100">
            
            {/* Left: Filters Toggle + Search */}
            <div className="flex w-full md:w-auto items-center gap-4">
              <button
                onClick={() => setShowFilters(!showFilters)}
                className={`px-6 py-3 rounded-xl font-bold transition-all flex items-center gap-2 ${showFilters ? 'bg-slate-900 text-white shadow-md' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'}`}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4"></path></svg>
                {showFilters ? 'Hide Filters' : 'Show Filters'}
              </button>

              <div className="relative flex-1 md:w-72">
                <input
                  type="text"
                  placeholder="Search drones..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-11 pr-4 py-3 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition-all text-slate-700"
                />
                <svg className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
              </div>
            </div>

            {/* Right: Sort */}
            <div className="w-full md:w-auto relative">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="w-full md:w-56 appearance-none px-5 py-3 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition-all text-slate-700 cursor-pointer font-medium"
              >
                <option value="default">Sort: Recommended</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
                <option value="discount-high">Biggest Discount</option>
                <option value="name-asc">Name: A to Z</option>
                <option value="name-desc">Name: Z to A</option>
              </select>
              <svg className="w-5 h-5 absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
            </div>
          </div>

          <div className="flex flex-col lg:flex-row gap-8">
            
            {/* Filters Sidebar */}
            {showFilters && (
              <div className="w-full lg:w-72 flex-shrink-0">
                <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 lg:sticky lg:top-24">
                  
                  <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-100">
                    <h3 className="text-xl font-black text-slate-900">Filters</h3>
                    {(checked.length > 0 || radio.length > 0 || searchTerm !== "") && (
                      <button
                        onClick={() => {
                          setChecked([]);
                          setRadio([]);
                          setSearchTerm("");
                        }}
                        className="text-sm font-bold text-emerald-600 hover:text-emerald-700 transition-colors"
                      >
                        Clear All
                      </button>
                    )}
                  </div>

                  {/* Categories */}
                  <div className="mb-8">
                    <h4 className="text-xs font-black uppercase tracking-widest text-slate-400 mb-4">Categories</h4>
                    <div className="space-y-3">
                      {categories?.map((cat) => (
                        <label key={cat._id} className="flex items-center gap-3 cursor-pointer group">
                          <div className="relative flex items-center justify-center w-5 h-5">
                            <input
                              type="checkbox"
                              className="peer appearance-none w-5 h-5 rounded border-2 border-slate-300 checked:bg-emerald-500 checked:border-emerald-500 cursor-pointer transition-all"
                              checked={checked.includes(cat._id)}
                              onChange={() => {
                                const updatedChecked = checked.includes(cat._id)
                                  ? checked.filter((c) => c !== cat._id)
                                  : [...checked, cat._id];
                                setChecked(updatedChecked);
                              }}
                            />
                            <svg className="absolute w-3 h-3 text-white opacity-0 peer-checked:opacity-100 pointer-events-none transition-opacity" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"></path></svg>
                          </div>
                          <span className="text-slate-600 group-hover:text-slate-900 font-medium transition-colors">{cat.name}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* Price Range */}
                  <div className="mb-8">
                    <h4 className="text-xs font-black uppercase tracking-widest text-slate-400 mb-4">Price Range</h4>
                    <div className="space-y-3">
                      {Prices.map((p) => (
                        <label key={p.id} className="flex items-center gap-3 cursor-pointer group">
                          <div className="relative flex items-center justify-center w-5 h-5">
                            <input
                              type="radio"
                              name="price"
                              value={p.array}
                              checked={JSON.stringify(radio) === JSON.stringify(p.array)}
                              onChange={() => setRadio(p.array)}
                              className="peer appearance-none w-5 h-5 rounded-full border-2 border-slate-300 checked:border-emerald-500 cursor-pointer transition-all"
                            />
                            <div className="absolute w-2.5 h-2.5 rounded-full bg-emerald-500 scale-0 peer-checked:scale-100 pointer-events-none transition-transform duration-200"></div>
                          </div>
                          <span className="text-slate-600 group-hover:text-slate-900 font-medium transition-colors">{p.name}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                </div>
              </div>
            )}

            {/* Products Grid */}
            <div className="flex-1" id="store-grid">
              {loading ? (
                <div className="bg-white rounded-3xl border border-slate-100 flex flex-col items-center justify-center py-24 text-center">
                  <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent animate-spin rounded-full mb-6"></div>
                  <h3 className="text-xl font-black text-slate-900 mb-2">Loading Products</h3>
                  <p className="text-slate-500">Please wait while we fetch the latest drones.</p>
                </div>
              ) : filteredProducts.length === 0 ? (
                <div className="bg-white rounded-3xl border border-slate-100 flex flex-col items-center justify-center py-24 text-center">
                  <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mb-6">
                    <svg className="w-10 h-10 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                  </div>
                  <h3 className="text-2xl font-black text-slate-900 mb-2">No products found</h3>
                  <p className="text-slate-500 max-w-sm mb-6">We couldn't find any products matching your current filters. Try adjusting your search criteria.</p>
                  <button onClick={() => { setChecked([]); setRadio([]); setSearchTerm(""); }} className="px-6 py-3 bg-emerald-500 text-white rounded-xl font-bold hover:bg-emerald-600 transition-colors shadow-lg shadow-emerald-500/20">
                    Clear Filters
                  </button>
                </div>
              ) : (
                <>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-5">
                    {currentProducts.map((product) => (
                      <div
                        key={product._id}
                        className="group bg-white rounded-2xl border border-slate-100 overflow-hidden hover:shadow-xl hover:shadow-slate-200/50 hover:border-slate-200 transition-all duration-300 flex flex-col"
                      >
                        {/* Product Image */}
                        <div className="relative h-48 bg-slate-50 overflow-hidden flex items-center justify-center p-4">
                          <img
                            src={product.image}
                            alt={product.name}
                            className="w-full h-full object-contain group-hover:scale-110 transition-transform duration-700 ease-out"
                          />
                          
                          {/* Badges */}
                          <div className="absolute top-4 left-4 flex flex-col gap-2">
                            {product.discountedPrice && product.price > product.discountedPrice && (
                              <div className="bg-red-500 text-white px-3 py-1 text-xs font-black rounded-lg shadow-sm">
                                {getDiscountPercentage(product)}% OFF
                              </div>
                            )}
                          </div>

                          {/* Quick Actions Overlay */}
                          <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-[2px] opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                            <button
                              onClick={() => navigate(`/product/${product.slug}`)}
                              className="px-6 py-3 bg-white text-slate-900 rounded-xl font-bold hover:bg-emerald-50 hover:text-emerald-600 transition-colors shadow-xl transform translate-y-4 group-hover:translate-y-0 duration-300"
                            >
                              View Details
                            </button>
                          </div>
                        </div>

                        {/* Product Info */}
                        <div className="p-6 flex flex-col flex-1">
                          {/* Category Tag */}
                          <div className="text-xs font-bold text-emerald-500 uppercase tracking-wider mb-2">
                            {product.category?.name || "Drone"}
                          </div>
                          
                          <h3 className="text-lg font-bold text-slate-900 mb-1 line-clamp-2 leading-snug">
                            {product.name}
                          </h3>
                          
                          <p className="text-sm text-slate-500 line-clamp-2 mb-4 flex-1">
                            {product.description}
                          </p>

                          {/* Divider */}
                          <div className="h-px w-full bg-slate-100 mb-4"></div>

                          {/* Price & Action */}
                          <div className="flex items-end justify-between mt-auto gap-2">
                            <div className="flex flex-col">
                              {product.discountedPrice && product.price > product.discountedPrice ? (
                                <>
                                  <span className="text-sm line-through text-slate-400 font-medium">
                                    ₹{product.price.toLocaleString()}
                                  </span>
                                  <span className="text-2xl font-black text-slate-900">
                                    ₹{product.discountedPrice.toLocaleString()}
                                  </span>
                                </>
                              ) : (
                                <span className="text-2xl font-black text-slate-900">
                                  ₹{product.price.toLocaleString()}
                                </span>
                              )}
                            </div>

                            <button
                              onClick={() => handleAddToCart(product)}
                              className="w-12 h-12 rounded-xl bg-slate-900 text-white flex items-center justify-center hover:bg-emerald-500 hover:shadow-lg hover:shadow-emerald-500/30 transition-all duration-300 flex-shrink-0"
                              title="Add to Cart"
                            >
                              <ShoppingCart className="w-5 h-5" />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Pagination */}
                  {totalPages > 1 && (
                    <div className="mt-12 flex justify-center">
                      <PaginationControls />
                    </div>
                  )}
                </>
              )}
            </div>

          </div>
        </div>
      </section>

      </div>
    </>
  );
};

export default Store;
