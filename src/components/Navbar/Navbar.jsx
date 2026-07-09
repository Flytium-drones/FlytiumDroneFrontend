import { useState, useEffect, useRef } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../Context/auth";
import { useCart } from "../../Context/cart";
import { motion, AnimatePresence } from "framer-motion";
import toast from "react-hot-toast";
import {
  FiShoppingCart,
  FiUser,
  FiLogOut,
  FiMenu,
  FiX,
  FiHeart,
  FiPackage,
  FiShield,
} from "react-icons/fi";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { auth, setAuth } = useAuth();
  const { getCartCount, canAccessCart } = useCart();
  const navigate = useNavigate();
  const location = useLocation();
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setUserMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    setAuth({
      user: null,
      token: "",
    });
    localStorage.removeItem("auth");
    toast.success("Logged out successfully");
    navigate("/");
    setUserMenuOpen(false);
  };

  const accessResult = canAccessCart();
  const cartCount = accessResult === true ? getCartCount() : 0;

  const navItems = [
    { name: "Home", path: "/" },
    { name: "About", path: "/about" },
    { name: "Products", path: "/store" },
    { name: "Services", path: "/services" },
    { name: "Career", path: "/career" },
    { name: "Contact", path: "/contact" },
  ];

  return (
    <nav className="fixed left-0 right-0 top-0 z-50 flex justify-center px-4 pt-4 sm:px-6 pointer-events-none">
      <div 
        className={`w-full max-w-6xl rounded-2xl border transition-all duration-300 pointer-events-auto shadow-2xl ${
          scrolled 
            ? "bg-slate-900/80 backdrop-blur-xl border-slate-700/50 shadow-slate-900/20" 
            : "bg-slate-900/40 backdrop-blur-md border-white/10"
        } px-4 py-2.5 sm:px-6 sm:py-3`}
      >
        <div className="flex items-center justify-between gap-4 min-h-[48px]">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-3 group">
            <div className="relative">
              <div className="absolute inset-0 bg-indigo-500 rounded-full blur-md opacity-0 group-hover:opacity-40 transition-opacity duration-300" />
              <img
                src="/logo.png"
                alt="Flytium Drones"
                className="w-auto h-7 sm:h-9 relative z-10 drop-shadow-lg transform group-hover:scale-105 transition-transform duration-300"
              />
            </div>
            <span className="text-lg sm:text-xl tracking-wide text-transparent bg-clip-text bg-gradient-to-r from-white to-slate-300 font-black drop-shadow-sm">
              Flytium
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-1 bg-slate-800/30 p-1 rounded-xl border border-slate-700/30">
            {navItems.map((item) => {
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.name}
                  to={item.path}
                  className="relative px-4 py-2 group rounded-lg transition-all"
                >
                  <span
                    className={`relative z-10 text-sm font-bold tracking-wide transition-colors duration-200 ${
                      isActive
                        ? "text-white"
                        : "text-slate-400 group-hover:text-white"
                    }`}
                  >
                    {item.name}
                  </span>

                  {/* Active Indicator */}
                  {isActive && (
                    <motion.div
                      layoutId="navbar-active-bg"
                      className="absolute inset-0 rounded-lg bg-indigo-500/20 border border-indigo-500/30 shadow-[0_0_15px_rgba(99,102,241,0.2)]"
                      transition={{ type: "spring", stiffness: 350, damping: 25 }}
                    />
                  )}
                  
                  {!isActive && (
                    <div className="absolute inset-0 rounded-lg bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
                  )}
                </Link>
              );
            })}
          </div>

          {/* Right Side - Cart & User Profile */}
          <div className="flex items-center space-x-3 sm:space-x-5">
            {/* Cart Icon */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => {
                const accessResult = canAccessCart();
                if (accessResult === null) {
                  toast.error("Please wait, loading...");
                  return;
                }
                if (accessResult === true) {
                  navigate("/cart");
                } else {
                  toast.error("Please login to access your cart");
                  navigate("/login");
                }
              }}
              className="relative p-2.5 rounded-xl bg-slate-800/50 hover:bg-slate-700/50 border border-slate-700/50 text-slate-300 hover:text-white transition-all duration-300 group"
            >
              <FiShoppingCart className="w-5 h-5 group-hover:stroke-[2.5px] transition-all" />
              {cartCount > 0 && (
                <motion.span
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute -top-1.5 -right-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-gradient-to-r from-indigo-500 to-cyan-400 text-[10px] font-black text-white shadow-lg border border-slate-900"
                >
                  {cartCount > 99 ? "99+" : cartCount}
                </motion.span>
              )}
            </motion.button>

            {/* User Menu / Login */}
            {auth?.user ? (
              <div className="relative" ref={dropdownRef}>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  className={`flex items-center space-x-2.5 rounded-xl px-3 py-2 border transition-all duration-300 ${
                    userMenuOpen 
                      ? "bg-indigo-500/10 border-indigo-500/30 text-white" 
                      : "bg-slate-800/50 hover:bg-slate-700/50 border-slate-700/50 text-slate-300 hover:text-white"
                  }`}
                >
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-cyan-400 flex items-center justify-center shadow-inner">
                    <FiUser className="w-4 h-4 text-white" />
                  </div>
                  <span className="hidden sm:block text-sm font-bold truncate max-w-[100px]">
                    {auth.user.name.split(' ')[0]}
                  </span>
                </motion.button>

                {/* Dark Themed Dropdown */}
                <AnimatePresence>
                  {userMenuOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.95 }}
                      transition={{ duration: 0.2 }}
                      className="absolute right-0 mt-3 w-64 bg-slate-900/95 backdrop-blur-xl rounded-2xl shadow-[0_0_40px_rgba(0,0,0,0.5)] border border-slate-700/50 overflow-hidden z-50 origin-top-right"
                    >
                      {/* User Info Header */}
                      <div className="px-5 py-4 bg-slate-800/50 border-b border-slate-700/50 relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/10 rounded-full blur-2xl -mr-10 -mt-10 pointer-events-none" />
                        <p className="text-sm font-black text-white truncate relative z-10">
                          {auth.user.name}
                        </p>
                        <p className="text-xs font-medium text-slate-400 truncate mt-1 relative z-10">
                          {auth.user.email}
                        </p>
                      </div>

                      {/* Menu Links */}
                      <div className="p-2 space-y-1">
                        <Link
                          to="/dashboard/user/orders"
                          className="flex items-center space-x-3 px-3 py-2.5 rounded-xl text-sm font-bold text-slate-300 hover:text-white hover:bg-slate-800/80 transition-all group"
                          onClick={() => setUserMenuOpen(false)}
                        >
                          <div className="p-1.5 rounded-lg bg-slate-800 group-hover:bg-indigo-500/20 text-slate-400 group-hover:text-indigo-400 transition-colors">
                            <FiPackage className="w-4 h-4" />
                          </div>
                          <span>My Orders</span>
                        </Link>

                        <Link
                          to="/dashboard/user/profile"
                          className="flex items-center space-x-3 px-3 py-2.5 rounded-xl text-sm font-bold text-slate-300 hover:text-white hover:bg-slate-800/80 transition-all group"
                          onClick={() => setUserMenuOpen(false)}
                        >
                          <div className="p-1.5 rounded-lg bg-slate-800 group-hover:bg-pink-500/20 text-slate-400 group-hover:text-pink-400 transition-colors">
                            <FiHeart className="w-4 h-4" />
                          </div>
                          <span>My Profile</span>
                        </Link>

                        {auth?.user?.role === 1 && (
                            <Link
                              to="/dashboard/admin"
                            className="flex items-center space-x-3 px-3 py-2.5 rounded-xl text-sm font-bold text-slate-300 hover:text-white hover:bg-slate-800/80 transition-all group"
                            onClick={() => setUserMenuOpen(false)}
                          >
                            <div className="p-1.5 rounded-lg bg-slate-800 group-hover:bg-emerald-500/20 text-slate-400 group-hover:text-emerald-400 transition-colors">
                              <FiShield className="w-4 h-4" />
                            </div>
                            <span>Admin Panel</span>
                          </Link>
                        )}
                      </div>

                      {/* Logout Button */}
                      <div className="p-2 border-t border-slate-700/50 bg-slate-800/20">
                        <button
                          onClick={handleLogout}
                          className="flex items-center space-x-3 px-3 py-2.5 w-full rounded-xl text-sm font-bold text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-all group"
                        >
                          <div className="p-1.5 rounded-lg bg-red-500/10 text-red-400 group-hover:scale-110 transition-transform">
                            <FiLogOut className="w-4 h-4" />
                          </div>
                          <span>Sign Out</span>
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <div className="hidden lg:flex items-center space-x-3">
                <Link
                  to="/login"
                  className="px-4 py-2 text-sm font-bold text-slate-300 hover:text-white transition-colors"
                >
                  Login
                </Link>
                <Link
                  to="/signup"
                  className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-cyan-500 hover:from-indigo-500 hover:to-cyan-400 text-white text-sm font-bold shadow-lg shadow-indigo-500/25 hover:shadow-indigo-500/40 transition-all transform hover:-translate-y-0.5"
                >
                  Sign Up
                </Link>
              </div>
            )}

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="lg:hidden p-2 rounded-xl bg-slate-800/50 hover:bg-slate-700/50 border border-slate-700/50 text-slate-300 hover:text-white transition-colors"
            >
              {isOpen ? <FiX className="w-6 h-6" /> : <FiMenu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu Dropdown */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="lg:hidden mt-4 overflow-hidden border-t border-slate-700/50"
            >
              <div className="py-4 space-y-2">
                {navItems.map((item) => {
                  const isActive = location.pathname === item.path;
                  return (
                    <Link
                      key={item.name}
                      to={item.path}
                      onClick={() => setIsOpen(false)}
                      className={`block px-4 py-3 rounded-xl text-base font-bold transition-all ${
                        isActive
                          ? "bg-indigo-500/10 text-indigo-400 border border-indigo-500/20"
                          : "text-slate-400 hover:bg-slate-800/50 hover:text-white"
                      }`}
                    >
                      {item.name}
                    </Link>
                  );
                })}
                
                {!auth?.user && (
                  <div className="pt-4 mt-2 border-t border-slate-700/50 grid grid-cols-2 gap-3">
                    <Link
                      to="/login"
                      onClick={() => setIsOpen(false)}
                      className="flex items-center justify-center py-3 rounded-xl bg-slate-800 text-white font-bold hover:bg-slate-700 transition-colors"
                    >
                      Login
                    </Link>
                    <Link
                      to="/signup"
                      onClick={() => setIsOpen(false)}
                      className="flex items-center justify-center py-3 rounded-xl bg-gradient-to-r from-indigo-600 to-cyan-500 text-white font-bold shadow-lg shadow-indigo-500/25"
                    >
                      Sign Up
                    </Link>
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </nav>
  );
};

export default Navbar;
