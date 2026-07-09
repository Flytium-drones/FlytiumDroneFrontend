import { NavLink } from "react-router-dom";
import { 
  LayoutDashboard, 
  Package, 
  FolderTree, 
  ShoppingCart, 
  Users, 
  Briefcase, 
  FileText, 
  Mail, 
  Image as ImageIcon,
  Tag,
  LayoutTemplate
} from "lucide-react";

const AdminMenu = () => {
  const menuItems = [
    { to: "/dashboard/admin", icon: LayoutDashboard, label: "Dashboard", exact: true },
    { to: "/dashboard/admin/category", icon: FolderTree, label: "Create Category" },
    { to: "/dashboard/admin/products", icon: Package, label: "Create Product" },
    { to: "/dashboard/admin/hero", icon: ImageIcon, label: "Manage Hero" },
    { to: "/dashboard/admin/store-hero", icon: LayoutTemplate, label: "Store Hero" },
    { to: "/dashboard/admin/ads", icon: Tag, label: "Manage Ads" },
    { to: "/dashboard/admin/manage-employees", icon: Users, label: "Manage Team" },
    { to: "/dashboard/admin/orders", icon: ShoppingCart, label: "Orders" },
    { to: "/dashboard/admin/jobs", icon: Briefcase, label: "Manage Jobs" },
    { to: "/dashboard/admin/job-applications", icon: FileText, label: "Job Applications" },
    { to: "/dashboard/admin/contacts", icon: Mail, label: "Contact Submissions" },
    { to: "/dashboard/admin/users", icon: Users, label: "Users" },
  ];

  return (
    <div className="bg-slate-950 min-h-screen border-r-2 border-slate-800">
      <div className="p-6">
        <h2 className="text-2xl font-black text-white mb-2 border-b-2 border-indigo-600 pb-3">
          Admin Panel
        </h2>
        <p className="text-sm text-slate-400 mb-6 font-bold">Management Dashboard</p>
        
        <nav className="space-y-2">
          {menuItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.exact}
              className={({ isActive }) =>
                `flex items-center px-4 py-3 border-2 transition-all font-black text-sm ${
                  isActive
                    ? "bg-indigo-950 border-indigo-600 text-indigo-400"
                    : "bg-slate-900 border-slate-800 text-slate-400 hover:border-indigo-600 hover:text-white"
                }`
              }
            >
              <item.icon className="w-5 h-5 mr-3" />
              {item.label}
            </NavLink>
          ))}
        </nav>
      </div>
    </div>
  );
};

export default AdminMenu;
