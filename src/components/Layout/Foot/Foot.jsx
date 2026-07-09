import React from "react";
import { Link } from "react-router-dom";
import { Facebook, Instagram, Twitter, Github, Linkedin, Mail, Phone, MapPin } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-slate-950 text-slate-300 py-8 px-6 border-t border-white/10">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
          
          {/* Brand Section */}
          <div className="space-y-4">
            <Link to="/" className="flex items-center space-x-3 mb-4">
              <img src="/logo.png" alt="Flytium Drones" className="h-8 w-auto brightness-0 invert" />
              <span className="text-xl font-extrabold text-white tracking-wide">
                Flytium Drones
              </span>
            </Link>
            <p className="text-slate-400 text-sm leading-relaxed">
              Elevating the future with cutting-edge drone technology. Discover top-tier drones for photography, surveillance, and industrial applications.
            </p>
            <div className="flex space-x-4 pt-2">
              <a href="https://www.instagram.com/flytiumdrones?igsh=MTdyNTJoMWZranprNA==" target="_blank" rel="noopener noreferrer" className="p-2 rounded-full bg-white/5 hover:bg-emerald-500 hover:text-white transition-all duration-300">
                <Instagram className="w-4 h-4" />
              </a>
              <a href="https://www.linkedin.com/company/flytium-drone/" target="_blank" rel="noopener noreferrer" className="p-2 rounded-full bg-white/5 hover:bg-cyan-500 hover:text-white transition-all duration-300">
                <Linkedin className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white font-bold text-base mb-4 flex items-center">
              <span className="w-6 h-1 bg-gradient-to-r from-emerald-400 to-cyan-400 mr-3 rounded-full"></span>
              Quick Links
            </h3>
            <ul className="space-y-2.5 text-sm">
              {[
                { name: "About Us", path: "/about" },
                { name: "Products", path: "/store" },
                { name: "Track Orders", path: "/dashboard/user/orders" },
                { name: "Services", path: "/services" },
                { name: "Career", path: "/career" },
              ].map((link) => (
                <li key={link.name}>
                  <Link to={link.path} className="text-slate-400 hover:text-emerald-400 transition-colors flex items-center group">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 mr-2 opacity-0 group-hover:opacity-100 transition-opacity"></span>
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal & Policy */}
          <div>
            <h3 className="text-white font-bold text-base mb-4 flex items-center">
              <span className="w-6 h-1 bg-gradient-to-r from-emerald-400 to-cyan-400 mr-3 rounded-full"></span>
              Legal
            </h3>
            <ul className="space-y-2.5 text-sm">
              {[
                { name: "Privacy Policy", path: "/privacy-policy" },
                { name: "Terms & Conditions", path: "/terms-conditions" },
                { name: "Shipping Policy", path: "/shipping-policy" },
                { name: "Contact Us", path: "/contact" },
              ].map((link) => (
                <li key={link.name}>
                  <Link to={link.path} className="text-slate-400 hover:text-cyan-400 transition-colors flex items-center group">
                    <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 mr-2 opacity-0 group-hover:opacity-100 transition-opacity"></span>
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-white font-bold text-base mb-4 flex items-center">
              <span className="w-6 h-1 bg-gradient-to-r from-emerald-400 to-cyan-400 mr-3 rounded-full"></span>
              Contact
            </h3>
            <ul className="space-y-3">
              <li className="flex items-start text-slate-400">
                <MapPin className="w-4 h-4 mr-3 text-emerald-400 flex-shrink-0 mt-0.5" />
                <span className="text-sm">H. N0 - 49C Near Paidleganj, Gorakhpur, Uttar Pradesh, India</span>
              </li>
              <li className="flex items-center text-slate-400">
                <Phone className="w-4 h-4 mr-3 text-emerald-400 flex-shrink-0" />
                <span className="text-sm">+91 99236 993440</span>
              </li>
              <li className="flex items-center text-slate-400">
                <Mail className="w-4 h-4 mr-3 text-emerald-400 flex-shrink-0" />
                <span className="text-sm">ankit@flytiumdrones.com</span>
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="pt-6 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-slate-500 text-sm text-center md:text-left">
            © {new Date().getFullYear()} Flytium Drones™. All rights reserved.
          </p>
          <div className="text-slate-500 text-sm flex items-center gap-2">
            Designed with <span className="text-emerald-500 animate-pulse">♥</span> for the future.
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
