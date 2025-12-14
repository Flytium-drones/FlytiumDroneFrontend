import { useState, useEffect, useRef } from "react";
import { ShoppingCartIcon, UserIcon } from "@heroicons/react/24/outline";
import { Link, NavLink } from "react-router-dom";
import { useAuth } from "../../../Context/auth";
import toast from "react-hot-toast";
import { useCart } from "../../../Context/cart";

const Navbar = () => {
  const [isSticky, setIsSticky] = useState(false);
  const [prevScrollPos, setPrevScrollPos] = useState(0);
  const [isVisible, setIsVisible] = useState(true);
  const [showDropdown, setShowDropdown] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const navbarRef = useRef(null);
  const dropdownRef = useRef(null);
  const { auth, setAuth } = useAuth();
  const { cart } = useCart();

  const handleLogout = () => {
    setAuth({
      user: null,
      token: "",
    });
    localStorage.removeItem("auth");
    toast.success("Logged out successfully", {
      style: {
        border: "1px solid #059669",
        padding: "16px",
        color: "#059669",
        backgroundColor: "#f0fdf4",
      },
      iconTheme: {
        primary: "#059669",
        secondary: "#f0fdf4",
      },
    });
  };

  const handleScroll = () => {
    const currentScrollPos = window.scrollY;
    const navbarHeight = navbarRef.current?.offsetHeight || 0;

    if (currentScrollPos > navbarHeight) {
      setIsSticky(true);
      setIsVisible(currentScrollPos < prevScrollPos);
    } else {
      setIsSticky(false);
      setIsVisible(true);
    }

    setPrevScrollPos(currentScrollPos);
  };

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [prevScrollPos]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <nav
      ref={navbarRef}
      className={`bg-white/95 backdrop-blur-md border-b border-gray-200 transition-all duration-300 ease-in-out transform ${
        isSticky
          ? `${
              isVisible ? "translate-y-0" : "-translate-y-full"
            } fixed top-0 left-0 w-full z-50 shadow-lg`
          : "relative z-50 shadow-sm"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          <div className="flex items-center space-x-3">
            <img src="/logo.png" alt="Flytium Logo" className="h-12 w-auto" />
            <span className="text-2xl font-bold bg-gradient-to-r from-emerald-600 to-amber-500 bg-clip-text text-transparent">
              FLYTIUM
            </span>
          </div>

          <ul className="hidden md:flex items-center space-x-8">
            <li>
              <NavLink
                to="/"
                className={({ isActive }) =>
                  `text-sm font-medium transition-colors duration-200 ${
                    isActive
                      ? "text-emerald-600"
                      : "text-gray-700 hover:text-emerald-600"
                  }`
                }
              >
                HOME
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/about"
                className={({ isActive }) =>
                  `text-sm font-medium transition-colors duration-200 ${
                    isActive
                      ? "text-emerald-600"
                      : "text-gray-700 hover:text-emerald-600"
                  }`
                }
              >
                ABOUT US
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/services"
                className={({ isActive }) =>
                  `text-sm font-medium transition-colors duration-200 ${
                    isActive
                      ? "text-emerald-600"
                      : "text-gray-700 hover:text-emerald-600"
                  }`
                }
              >
                SERVICES
              </NavLink>
            </li>

            {/* <li>
            <NavLink
              to="/store"
              className={({ isActive }) =>
                `text-sm font-medium transition-colors duration-200 ${
                  isActive
                    ? "text-emerald-600"
                    : "text-gray-700 hover:text-emerald-600"
                }`
              }
            >
              STORE
            </NavLink>
          </li> */}
            <li>
              <NavLink
                to="/career"
                className={({ isActive }) =>
                  `text-sm font-medium transition-colors duration-200 ${
                    isActive
                      ? "text-emerald-600"
                      : "text-gray-700 hover:text-emerald-600"
                  }`
                }
              >
                CAREER
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/contact"
                className={({ isActive }) =>
                  `text-sm font-medium transition-colors duration-200 ${
                    isActive
                      ? "text-emerald-600"
                      : "text-gray-700 hover:text-emerald-600"
                  }`
                }
              >
                CONTACT
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/cartpage"
                className={({ isActive }) =>
                  `flex items-center space-x-1 text-sm font-medium transition-colors duration-200 ${
                    isActive
                      ? "text-emerald-600"
                      : "text-gray-700 hover:text-emerald-600"
                  }`
                }
              >
                <ShoppingCartIcon className="h-5 w-5" />
                <span className="bg-emerald-600 text-white rounded-full px-2 py-0.5 text-xs">
                  {cart?.length || 0}
                </span>
              </NavLink>
            </li>

            {!auth.user ? (
              <li>
                <NavLink
                  to="/login"
                  className="bg-emerald-600 text-white px-4 py-2 rounded-full text-sm font-medium hover:bg-emerald-700 transition-colors duration-200"
                >
                  Login
                </NavLink>
              </li>
            ) : (
              <li className="relative" ref={dropdownRef}>
                <button
                  onClick={() => setShowDropdown(!showDropdown)}
                  className="flex items-center space-x-2 text-gray-700 hover:text-emerald-600 transition-colors duration-200"
                >
                  <UserIcon className="h-5 w-5" />
                </button>

                {showDropdown && (
                  <div className="absolute right-0 mt-3 w-48 bg-white rounded-lg shadow-lg border border-gray-100 py-1 z-50">
                    {auth?.user?.role === 1 ? (
                      <div className="py-1">
                        <NavLink
                          to="/dashboard/admin"
                          className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                          onClick={() => setShowDropdown(false)}
                        >
                          {auth?.user?.name}
                        </NavLink>
                      </div>
                    ) : (
                      <div className="py-1">
                        <NavLink
                          to="/dashboard/user/profile"
                          className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                          onClick={() => setShowDropdown(false)}
                        >
                          {auth?.user?.name}
                        </NavLink>
                        <NavLink
                          to="/dashboard/user/orders"
                          className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                          onClick={() => setShowDropdown(false)}
                        >
                          Orders
                        </NavLink>
                      </div>
                    )}
                    <div className="border-t border-gray-100">
                      <button
                        onClick={() => {
                          handleLogout();
                          setShowDropdown(false);
                        }}
                        className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-50"
                      >
                        Logout
                      </button>
                    </div>
                  </div>
                )}
              </li>
            )}
          </ul>

          <button
            className="md:hidden text-gray-700 hover:text-emerald-600 transition-colors duration-200"
            onClick={() => setShowMobileMenu(!showMobileMenu)}
          >
            {showMobileMenu ? (
              <svg
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            ) : (
              <svg
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            )}
          </button>
        </div>

        {/* Mobile Menu */}
        {showMobileMenu && (
          <div className="md:hidden absolute top-full left-0 w-full bg-white border-t border-gray-100 shadow-lg">
            <div className="container mx-auto px-4 py-2">
              <ul className="space-y-2">
                <li>
                  <Link
                    to="/"
                    className="block py-2 text-gray-700 hover:text-emerald-600 transition-colors duration-200"
                    onClick={() => setShowMobileMenu(false)}
                  >
                    HOME
                  </Link>
                </li>
                <li>
                  <Link
                    to="/about"
                    className="block py-2 text-gray-700 hover:text-emerald-600 transition-colors duration-200"
                    onClick={() => setShowMobileMenu(false)}
                  >
                    ABOUT US
                  </Link>
                </li>
                <li>
                  <Link
                    to="/services"
                    className="block py-2 text-gray-700 hover:text-emerald-600 transition-colors duration-200"
                    onClick={() => setShowMobileMenu(false)}
                  >
                    SERVICES
                  </Link>
                </li>
                <li>
                  <Link
                    to="/career"
                    className="block py-2 text-gray-700 hover:text-emerald-600 transition-colors duration-200"
                    onClick={() => setShowMobileMenu(false)}
                  >
                    CAREERS
                  </Link>
                </li>
                {/* <li>
                <Link
                  to="/store"
                  className="block py-2 text-gray-700 hover:text-emerald-600 transition-colors duration-200"
                  onClick={() => setShowMobileMenu(false)}
                >
                  STORE
                </Link>
              </li> */}
                <li>
                  <NavLink
                    to="/cartpage"
                    className={({ isActive }) =>
                      `flex items-center space-x-1 text-sm font-medium transition-colors duration-200 ${
                        isActive
                          ? "text-emerald-600"
                          : "text-gray-700 hover:text-emerald-600"
                      }`
                    }
                  >
                    <ShoppingCartIcon className="h-5 w-5" />
                    <span className="bg-emerald-600 text-white rounded-full px-2 py-0.5 text-xs">
                      {cart?.length || 0}
                    </span>
                  </NavLink>
                </li>

                {!auth.user ? (
                  <li>
                    <NavLink
                      to="/login"
                      className="bg-emerald-600 text-white px-4 py-2 rounded-full text-sm font-medium hover:bg-emerald-700 transition-colors duration-200"
                    >
                      Login
                    </NavLink>
                  </li>
                ) : (
                  <li className="relative" ref={dropdownRef}>
                    <button
                      onClick={() => setShowDropdown(!showDropdown)}
                      className="flex items-center space-x-2 text-gray-700 hover:text-emerald-600 transition-colors duration-200"
                    >
                      <UserIcon className="h-5 w-5" />
                    </button>

                    {showDropdown && (
                      <div className="absolute right-0 mt-3 w-48 bg-white rounded-lg shadow-lg border border-gray-100 py-1 z-50">
                        {auth?.user?.role === 1 ? (
                          <div className="py-1">
                            <NavLink
                              to="/dashboard/admin"
                              className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                              onClick={() => setShowDropdown(false)}
                            >
                              {auth?.user?.name}
                            </NavLink>
                          </div>
                        ) : (
                          <div className="py-1">
                            <NavLink
                              to="/dashboard/user/profile"
                              className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                              onClick={() => setShowDropdown(false)}
                            >
                              {auth?.user?.name}
                            </NavLink>
                            <NavLink
                              to="/dashboard/user/orders"
                              className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                              onClick={() => setShowDropdown(false)}
                            >
                              Orders
                            </NavLink>
                          </div>
                        )}
                        <div className="border-t border-gray-100">
                          <button
                            onClick={() => {
                              handleLogout();
                              setShowDropdown(false);
                            }}
                            className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-50"
                          >
                            Logout
                          </button>
                        </div>
                      </div>
                    )}
                  </li>
                )}
              </ul>

              <button
                className="md:hidden text-gray-700 hover:text-emerald-600 transition-colors duration-200"
                onClick={() => setShowMobileMenu(!showMobileMenu)}
              >
                {showMobileMenu ? (
                  <svg
                    className="h-6 w-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                ) : (
                  <svg
                    className="h-6 w-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 6h16M4 12h16M4 18h16"
                    />
                  </svg>
                )}
              </button>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
