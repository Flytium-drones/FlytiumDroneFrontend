import {
  BrowserRouter as Router,
  Route,
  Routes,
  useLocation,
} from "react-router-dom";
import Navbar from "./components/Navbar/Navbar";
import Login from "./pages/auth/Login";
import Account from "./pages/auth/Register";
import Contact from "./pages/Contact";
import Successful from "./pages/LoginSuccess";
import Successful2 from "./pages/RegisterSuccess";
import Store from "./pages/Store";
import Home from "./pages/Home";
import "./App.css";
import Pagenotfound from "./pages/Pagenotfound";
import CartPage from "./pages/CartPage";
import Footer from "./components/Layout/Foot/Foot";
import CheckoutPage from "./pages/CheckoutPage";
import NewCheckoutPage from "./pages/NewCheckoutPage";
import Orders from "./pages/user/Orders";
import Profile from "./pages/user/Profile";
import AdminDashboard from "./pages/Admin/AdminDashboard";
import CreateProduct from "./pages/Admin/CreateProduct";
import CreateCategory from "./pages/Admin/CreateCategory";
import AdminOrders from "./pages/Admin/AdminOrders";
import Users from "./pages/Admin/Users";
import AdminRoute from "./components/Routes/AdminRoute";
import Private from "./components/Routes/Private";
import ProductDetails from "./pages/ProductDetails";
import About from "./pages/About";
import Service from "./pages/Service";
import { Toaster } from "react-hot-toast";
import ManageHero from "./pages/Admin/ManageHero";
import PrivacyPolicy from "./pages/policy/PrivacyPolicy";
import ShippingPolicy from "./pages/policy/ShippingPolicy";
import TermsConditions from "./pages/policy/TermsConditions";
import "./styles/globals.css";
import CategoryProducts from "./pages/CategoryProducts";
import CreateAd from "./pages/Admin/CreateAd";
import Career from "./pages/Career";
import ManageEmployees from "./pages/Admin/ManageEmployees";
import ManageJobs from "./pages/Admin/ManageJobs";
import JobApplications from "./pages/Admin/JobApplications";
import ManageContacts from "./pages/Admin/ManageContacts";
import { LenisProvider } from "./components/LenisProvider";
import ScrollToTop from "./components/ScrollToTop";

const AppContent = () => {
  const location = useLocation();
  const isHome = location.pathname === "/";

  return (
    <div className={isHome ? "" : "pt-28"}>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/login-success" element={<Successful />} />
        <Route path="/signup" element={<Account />} />
        <Route path="/register-success" element={<Successful2 />} />
        {/* <Route path="/store" element={<Store />} /> */}
        <Route path="/checkout" element={<NewCheckoutPage />} />
        <Route path="/checkout-old" element={<CheckoutPage />} />
        <Route path="/about" element={<About />} />
        <Route path="/services" element={<Service />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/career" element={<Career />} />
        <Route path="/cart" element={<CartPage />} />
        <Route path="/cartpage" element={<CartPage />} />
        <Route path="/dashboard" element={<Private />}>
          <Route path="user/orders" element={<Orders />} />
          <Route path="user/profile" element={<Profile />} />
        </Route>

        <Route path="/dashboard" element={<AdminRoute />}>
          <Route path="admin" element={<AdminDashboard />} />
          <Route path="admin/users" element={<Users />} />
          <Route path="admin/products" element={<CreateProduct />} />
          <Route path="admin/orders" element={<AdminOrders />} />
          <Route path="admin/category" element={<CreateCategory />} />
          <Route path="admin/hero" element={<ManageHero />} />
          <Route path="admin/ads" element={<CreateAd />} />
          <Route path="admin/manage-employees" element={<ManageEmployees />} />
          <Route path="admin/jobs" element={<ManageJobs />} />
          <Route path="admin/job-applications" element={<JobApplications />} />
          <Route path="admin/contacts" element={<ManageContacts />} />
        </Route>

        <Route path="/product/:slug" element={<ProductDetails />} />
        <Route path="/privacy-policy" element={<PrivacyPolicy />} />
        <Route path="/terms-conditions" element={<TermsConditions />} />
        <Route path="/shipping-policy" element={<ShippingPolicy />} />
        <Route path="/category/:slug" element={<CategoryProducts />} />
        <Route path="*" element={<Pagenotfound />} />
      </Routes>
      <Footer />
    </div>
  );
};

function App() {
  return (
    <>
      <Toaster position="top-right" reverseOrder={false} />
      <LenisProvider>
        <Router>
          <Navbar />
          <AppContent />
          <ScrollToTop />
        </Router>
      </LenisProvider>
    </>
  );
}

export default App;
