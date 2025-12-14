import { useState, useEffect } from "react";
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
} from "react-icons/fi";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const { auth, setAuth } = useAuth();
  const { getCartCount, canAccessCart } = useCart();
  const navigate = useNavigate();
  const location = useLocation();

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
    { name: "Services", path: "/services" },
    { name: "Career", path: "/career" },
    { name: "Contact", path: "/contact" },
  ];

  return (
    <nav className="fixed left-0 right-0 top-0 z-50 flex justify-center px-3 pt-2 sm:px-4 sm:pt-3 pointer-events-none">
      <div className="w-full max-w-5xl rounded-lg border border-white/10 bg-slate-900/40 backdrop-blur-md px-3 py-2 shadow-lg transition-all duration-200 supports-[backdrop-filter]:bg-slate-900/40 pointer-events-auto sm:rounded-xl sm:px-4 sm:py-3">
        <div className="flex items-center justify-between gap-3 md:gap-6 min-h-[56px] py-1 transition-all duration-300">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2 sm:space-x-3">
            <img
              src="/logo.png"
              alt="Flytium Drones"
              className="w-auto h-6 sm:h-8"
            />
            <span className="text-base tracking-wide text-white drop-shadow font-extrabold sm:text-lg">
              Flytium Drones
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-1">
            {navItems.map((item) => {
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.name}
                  to={item.path}
                  className="relative px-4 py-2 group"
                >
                  <span
                    className={`relative z-10 font-semibold tracking-wide transition-colors duration-200 transform-gpu will-change-transform ${
                      isActive
                        ? "text-white"
                        : "text-slate-100/80 group-hover:text-white group-hover:-translate-y-0.5"
                    }`}
                  >
                    {item.name}
                  </span>

                  {/* Animated background for active state */}
                  {isActive && (
                    <motion.div
                      layoutId="navbar-active-bg"
                      className="absolute inset-0 rounded-md bg-gradient-to-r from-emerald-500/90 to-cyan-400/90 shadow-[0_8px_24px_rgba(16,185,129,0.45)] ring-1 ring-emerald-400/20"
                      transition={{
                        type: "spring",
                        stiffness: 450,
                        damping: 28,
                      }}
                    />
                  )}

                  {/* Hover effect for non-active items */}
                  {!isActive && (
                    <motion.div
                      className="absolute inset-0 rounded-md bg-white/6 opacity-0 group-hover:opacity-90 transition-opacity duration-150"
                      transition={{ duration: 0.15 }}
                    />
                  )}

                  {/* Animated underline indicator */}
                  <motion.div
                    className="absolute -bottom-1 left-1/2 h-0.5 bg-emerald-400 rounded-full"
                    initial={false}
                    animate={{
                      width: isActive ? "70%" : "0%",
                      x: "-50%",
                    }}
                    transition={{ type: "spring", stiffness: 260, damping: 22 }}
                  />
                </Link>
              );
            })}
          </div>

          {/* Right Side - Cart, User Menu, Mobile Menu */}
          <div className="flex items-center space-x-2 sm:space-x-4">
            {/* Cart Icon */}
            <motion.div
              whileHover={{ scale: 1.06 }}
              whileTap={{ scale: 0.95 }}
              className="relative"
            >
              <button
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
                className="relative rounded-full p-2 text-white/80 transition-colors hover:text-white"
              >
                <FiShoppingCart className="w-6 h-6" />
                {cartCount > 0 && (
                  <motion.span
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-emerald-400 text-xs font-semibold text-slate-900 shadow-sm ring-1 ring-emerald-200"
                  >
                    {cartCount > 99 ? "99+" : cartCount}
                  </motion.span>
                )}
              </button>
            </motion.div>

            {/* User Menu */}
            {auth?.user ? (
              <div className="relative">
                <motion.button
                  whileHover={{ scale: 1.04 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  className="flex items-center space-x-2 rounded-full bg-white/6 px-3 py-2 text-slate-100/90 transition-colors hover:bg-white/10 hover:text-white ring-0 focus:outline-none focus:ring-2 focus:ring-emerald-400/30"
                >
                  <FiUser className="w-6 h-6" />
                  <span className="hidden md:block font-medium">
                    {auth.user.name}
                  </span>
                </motion.button>

                <AnimatePresence>
                  {userMenuOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-2"
                    >
                      <div className="px-4 py-2 border-b border-gray-100">
                        <p className="text-sm font-medium text-gray-800">
                          {auth.user.name}
                        </p>
                        <p className="text-xs text-gray-500">
                          {auth.user.email}
                        </p>
                      </div>

                      <Link
                        to="dashboard/user/orders"
                        className="flex items-center space-x-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                        onClick={() => setUserMenuOpen(false)}
                      >
                        <FiPackage className="w-4 h-4" />
                        <span>My Orders</span>
                      </Link>

                      <Link
                        to="dashboard/user/profile"
                        className="flex items-center space-x-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                        onClick={() => setUserMenuOpen(false)}
                      >
                        <FiHeart className="w-4 h-4" />
                        <span>Profile</span>
                      </Link>

                      {auth?.user?.role === 1 && (
                        <Link
                          to="dashboard/admin"
                          className="flex items-center space-x-2 px-4 py-2 text-sm text-blue-600 hover:bg-blue-50 transition-colors"
                          onClick={() => setUserMenuOpen(false)}
                        >
                          <FiUser className="w-4 h-4" />
                          <span>Admin Dashboard</span>
                        </Link>
                      )}

                      <hr className="my-2" />

                      <button
                        onClick={handleLogout}
                        className="flex items-center space-x-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors w-full text-left"
                      >
                        <FiLogOut className="w-4 h-4" />
                        <span>Logout</span>
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <div className="hidden items-center space-x-2 sm:flex">
                <Link
                  to="/login"
                  className="font-medium text-slate-100/80 transition-colors hover:text-white"
                >
                  Login
                </Link>
                <Link
                  to="/signup"
                  className="rounded-full bg-emerald-400 px-4 py-2 font-semibold text-slate-900 transition-colors hover:bg-emerald-300"
                >
                  Sign Up
                </Link>
              </div>
            )}

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="flex rounded-full p-2 text-slate-100/90 transition-colors hover:bg-white/10 hover:text-white md:hidden"
            >
              {isOpen ? (
                <FiX className="w-6 h-6" />
              ) : (
                <FiMenu className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden mt-2 overflow-hidden rounded-[1.75rem] border border-white/10 bg-slate-900/40 backdrop-blur-md px-2 py-3 supports-[backdrop-filter]:bg-slate-900/40"
            >
              <div className="space-y-1">
                {navItems.map((item) => {
                  const isActive = location.pathname === item.path;
                  return (
                    <motion.div
                      key={item.name}
                      initial={false}
                      animate={{
                        scale: isActive ? 1 : 1,
                      }}
                      className="relative overflow-hidden rounded-lg"
                    >
                      <Link
                        to={item.path}
                        className={`group relative block px-4 py-3 transition-all duration-300 ${
                          isActive
                            ? "font-semibold text-white"
                            : "text-slate-100/80 hover:text-white"
                        }`}
                        onClick={() => setIsOpen(false)}
                      >
                        <span className="relative z-10">{item.name}</span>

                        {/* Active background with gradient */}
                        {isActive && (
                          <motion.div
                            layoutId="mobile-navbar-active"
                            className="absolute inset-0 rounded-xl bg-gradient-to-r from-emerald-500/80 to-cyan-400/80"
                            initial={false}
                            transition={{
                              type: "spring",
                              stiffness: 300,
                              damping: 30,
                            }}
                          />
                        )}

                        {/* Hover background for non-active */}
                        {!isActive && (
                          <div className="absolute inset-0 rounded-xl bg-white/5 opacity-0 transition-opacity duration-200 group-hover:opacity-100" />
                        )}

                        {/* Left accent bar for active */}
                        {isActive && (
                          <motion.div
                            initial={{ height: 0 }}
                            animate={{ height: "100%" }}
                            className="absolute left-0 top-0 w-1 rounded-r bg-white/80"
                            transition={{ duration: 0.3 }}
                          />
                        )}
                      </Link>
                    </motion.div>
                  );
                })}

                {!auth?.user && (
                  <div className="px-4 py-2 space-y-2">
                    <Link
                      to="/login"
                      className="block w-full rounded-full border border-white/20 bg-white/5 py-2 text-center text-slate-100/80 transition-colors hover:bg-white/10 hover:text-white"
                      onClick={() => setIsOpen(false)}
                    >
                      Login
                    </Link>
                    <Link
                      to="/signup"
                      className="block w-full rounded-full bg-emerald-400 py-2 text-center font-semibold text-slate-900 transition-colors hover:bg-emerald-300"
                      onClick={() => setIsOpen(false)}
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
