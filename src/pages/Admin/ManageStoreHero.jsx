import React, { useState, useEffect, useRef } from "react";
import Layout from "../../components/Layout/Layout";
import AdminMenu from "../../components/Layout/AdminMenu";
import axios from "axios";
import { API_URL } from "../../api";
import toast from "react-hot-toast";
import { useAuth } from "../../Context/auth";
import { Save, Image as ImageIcon, LayoutTemplate, Plus, Trash2, ChevronDown } from "lucide-react";
import * as LucideIcons from "lucide-react";

// List of available icons for the user to choose from
const availableIcons = [
  "Package", "Smartphone", "Settings", "Compass", "Sliders", 
  "Info", "Gamepad2", "BookOpen", "Users", "Wind", 
  "Smile", "Wrench", "Feather", "Cpu", "CheckCircle", "Star",
  "Camera", "Battery", "Wifi", "Bluetooth", "Zap", "Shield",
  "Clock", "Video", "Globe", "Cloud", "Award", "Gift",
  "Heart", "Activity", "Target", "Navigation", "Radio"
];

// Map words to icons for auto-select
const keywordToIcon = {
  "diy": "Wrench", "kit": "Package", "mobile": "Smartphone", "phone": "Smartphone",
  "trim": "Settings", "setting": "Settings", "headless": "Compass", "compass": "Compass",
  "flight": "Wind", "advanced": "Sliders", "control": "Gamepad2", "game": "Gamepad2",
  "learn": "BookOpen", "student": "Users", "beginner": "Smile", "user": "Users",
  "light": "Feather", "compact": "Feather", "smart": "Cpu", "cpu": "Cpu",
  "camera": "Camera", "video": "Video", "photo": "Camera", "battery": "Battery",
  "power": "Zap", "fast": "Zap", "safe": "Shield", "protect": "Shield",
  "time": "Clock", "wifi": "Wifi", "connect": "Bluetooth", "award": "Award",
  "best": "Award", "quality": "CheckCircle"
};

const CustomIconSelector = ({ value, onChange }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const SelectedIcon = LucideIcons[value] || LucideIcons.HelpCircle;

  return (
    <div className="relative" ref={dropdownRef}>
      <button 
        type="button" 
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-between bg-slate-900 text-white border border-slate-700 p-2 w-32 focus:border-indigo-500 focus:outline-none text-sm rounded cursor-pointer"
      >
        <span className="flex items-center gap-2 truncate">
           <SelectedIcon className="w-4 h-4 text-indigo-400 shrink-0" />
           <span className="truncate">{value}</span>
        </span>
        <ChevronDown className="w-4 h-4 text-slate-400 shrink-0" />
      </button>

      {isOpen && (
        <div className="absolute z-50 top-full left-0 mt-1 w-48 max-h-60 overflow-y-auto bg-slate-900 border border-slate-700 shadow-2xl rounded custom-scrollbar">
          {availableIcons.map(icon => {
            const IconComp = LucideIcons[icon] || LucideIcons.HelpCircle;
            return (
              <div 
                key={icon} 
                className="flex items-center gap-3 p-3 hover:bg-slate-800 cursor-pointer transition-colors"
                onClick={() => { onChange(icon); setIsOpen(false); }}
              >
                <IconComp className="w-5 h-5 text-indigo-400" />
                <span className="text-sm text-slate-300">{icon}</span>
              </div>
            )
          })}
        </div>
      )}
    </div>
  );
};

const ManageStoreHero = () => {
  const { auth } = useAuth();
  const [isUploading, setIsUploading] = useState(false);
  const [activeSlide, setActiveSlide] = useState(0);
  
  const defaultSlide = {
    badgeText: "Best Price Available",
    title: "Flytium Nano Drone",
    subtitle: "DIY Kit for Smart Learning & Fun Flying",
    description: "Build, control, and explore advanced flight features in a compact nano drone.",
    image: "",
    price: 2999,
    discountedPrice: 2499,
    features: [],
    productInfo: [],
    whyChoose: []
  };

  const [slides, setSlides] = useState([defaultSlide]);

  useEffect(() => {
    fetchStoreHero();
  }, []);

  const fetchStoreHero = async () => {
    try {
      const { data } = await axios.get(`${API_URL}/api/storehero/get`);
      if (data.success && data.storeHeroes && data.storeHeroes.length > 0) {
        setSlides(data.storeHeroes);
      }
    } catch (error) {
      console.error(error);
      toast.error("Error fetching Store Hero data (Backend might not be deployed yet)");
    }
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    try {
      setIsUploading(true);
      const fd = new FormData();
      fd.append("file", file);
      fd.append("upload_preset", "flytium");
      fd.append("cloud_name", "dhkpwi9ga");

      const response = await fetch(
        "https://api.cloudinary.com/v1_1/dhkpwi9ga/image/upload",
        {
          method: "POST",
          body: fd,
        }
      );

      const data = await response.json();
      
      const newSlides = [...slides];
      newSlides[activeSlide].image = data.secure_url;
      setSlides(newSlides);
      
      toast.success("Image uploaded successfully");
    } catch (error) {
      console.error("Error uploading image:", error);
      toast.error("Failed to upload image");
    } finally {
      setIsUploading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`${API_URL}/api/storehero/update`, { slides }, {
        headers: {
          Authorization: `Bearer ${auth?.token}`,
        },
      });
      toast.success("Store Hero slides updated successfully");
      fetchStoreHero();
    } catch (error) {
      console.error(error);
      toast.error("Error saving data. Make sure backend is updated.");
    }
  };

  const suggestIcon = (text) => {
    if (!text) return null;
    const words = text.toLowerCase().split(/\s+/);
    for (const word of words) {
      if (keywordToIcon[word]) {
        return keywordToIcon[word];
      }
    }
    return null;
  };

  const handleChange = (field, value) => {
    const newSlides = [...slides];
    newSlides[activeSlide][field] = value;
    setSlides(newSlides);
  };

  const handleArrayChange = (field, index, key, value) => {
    const newSlides = [...slides];
    newSlides[activeSlide][field][index][key] = value;
    
    // Auto select icon if typing title
    if (key === 'title') {
      const suggested = suggestIcon(value);
      if (suggested) {
        newSlides[activeSlide][field][index].icon = suggested;
      }
    }
    
    setSlides(newSlides);
  };

  const addArrayItem = (field, defaultItem) => {
    const newSlides = [...slides];
    newSlides[activeSlide][field].push(defaultItem);
    setSlides(newSlides);
  };

  const removeArrayItem = (field, index) => {
    const newSlides = [...slides];
    newSlides[activeSlide][field].splice(index, 1);
    setSlides(newSlides);
  };

  const addNewSlide = () => {
    if (slides.length >= 3) {
      toast.error("Maximum 3 slides allowed");
      return;
    }
    setSlides([...slides, { ...defaultSlide }]);
    setActiveSlide(slides.length);
  };

  const removeSlide = (index) => {
    if (slides.length === 1) {
      toast.error("At least 1 slide is required");
      return;
    }
    const newSlides = slides.filter((_, i) => i !== index);
    setSlides(newSlides);
    if (activeSlide >= index && activeSlide > 0) {
      setActiveSlide(activeSlide - 1);
    }
  };

  const currentSlide = slides[activeSlide];

  if (!currentSlide) return null;

  return (
    <Layout title="Manage Store Hero">
      <div className="min-h-screen bg-slate-950 pb-20">
        <div className="flex flex-col md:flex-row">
          <div className="md:w-1/4 shrink-0">
            <AdminMenu />
          </div>

          <div className="flex-1 p-8 overflow-hidden">
            <div className="mb-8 flex items-center justify-between flex-wrap gap-4">
              <div>
                <h1 className="text-4xl font-black text-white mb-2 flex items-center">
                  <LayoutTemplate className="w-10 h-10 mr-3 text-indigo-500" />
                  Store Premium Hero
                </h1>
                <p className="text-slate-400 text-lg">
                  Manage up to 3 featured products (Carousel)
                </p>
              </div>
              <button
                onClick={handleSubmit}
                disabled={isUploading}
                className="bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800 text-white font-black py-3 px-6 border-2 border-emerald-500 transition-all flex items-center shadow-lg shadow-emerald-900/50 disabled:opacity-50"
              >
                <Save className="w-5 h-5 mr-2" />
                Save All Changes
              </button>
            </div>

            {/* Slide Tabs */}
            <div className="flex items-center gap-2 mb-6 border-b border-slate-800 pb-4 overflow-x-auto">
              {slides.map((_, idx) => (
                <div key={idx} className="flex items-center">
                  <button
                    onClick={() => setActiveSlide(idx)}
                    className={`px-6 py-3 font-bold transition-all whitespace-nowrap rounded-l-lg ${
                      activeSlide === idx 
                        ? 'bg-indigo-600 text-white border-2 border-indigo-500' 
                        : 'bg-slate-900 text-slate-400 border-2 border-slate-800 hover:bg-slate-800'
                    }`}
                  >
                    Slide {idx + 1}
                  </button>
                  {slides.length > 1 && (
                    <button 
                      onClick={() => removeSlide(idx)}
                      className={`px-3 py-3 border-y-2 border-r-2 rounded-r-lg transition-colors ${
                        activeSlide === idx 
                          ? 'border-indigo-500 bg-indigo-600 text-indigo-200 hover:text-red-300 hover:bg-indigo-700' 
                          : 'border-slate-800 bg-slate-900 text-slate-500 hover:text-red-400 hover:bg-slate-800'
                      }`}
                      title="Remove Slide"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  )}
                </div>
              ))}
              
              {slides.length < 3 && (
                <button
                  onClick={addNewSlide}
                  className="px-6 py-3 bg-slate-900 border-2 border-dashed border-slate-700 text-slate-400 hover:text-indigo-400 hover:border-indigo-500 font-bold transition-all rounded-lg flex items-center gap-2 whitespace-nowrap"
                >
                  <Plus className="w-5 h-5" /> Add New Slide
                </button>
              )}
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
              {/* Left Column: General Info */}
              <div className="bg-slate-900 border-2 border-slate-800 p-6 space-y-6 shadow-xl rounded-xl">
                <h3 className="text-xl font-black text-white mb-4 border-b border-slate-800 pb-2">Slide {activeSlide + 1} - General Info</h3>
                
                <div>
                  <label className="block text-sm font-bold text-slate-300 mb-2">Badge Text</label>
                  <input type="text" value={currentSlide.badgeText || ''} onChange={(e) => handleChange('badgeText', e.target.value)} className="w-full px-4 py-3 bg-slate-950 border-2 border-slate-800 text-white focus:border-indigo-600 focus:outline-none rounded" />
                </div>
                
                <div>
                  <label className="block text-sm font-bold text-slate-300 mb-2">Title</label>
                  <input type="text" value={currentSlide.title || ''} onChange={(e) => handleChange('title', e.target.value)} className="w-full px-4 py-3 bg-slate-950 border-2 border-slate-800 text-white focus:border-indigo-600 focus:outline-none rounded" />
                </div>

                <div>
                  <label className="block text-sm font-bold text-slate-300 mb-2">Subtitle</label>
                  <input type="text" value={currentSlide.subtitle || ''} onChange={(e) => handleChange('subtitle', e.target.value)} className="w-full px-4 py-3 bg-slate-950 border-2 border-slate-800 text-white focus:border-indigo-600 focus:outline-none rounded" />
                </div>

                <div>
                  <label className="block text-sm font-bold text-slate-300 mb-2">Description</label>
                  <textarea rows="3" value={currentSlide.description || ''} onChange={(e) => handleChange('description', e.target.value)} className="w-full px-4 py-3 bg-slate-950 border-2 border-slate-800 text-white focus:border-indigo-600 focus:outline-none resize-none rounded"></textarea>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-bold text-slate-300 mb-2">Original Price (₹)</label>
                    <input type="number" value={currentSlide.price || 0} onChange={(e) => handleChange('price', e.target.value)} className="w-full px-4 py-3 bg-slate-950 border-2 border-slate-800 text-white focus:border-indigo-600 focus:outline-none rounded" />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-slate-300 mb-2">Discounted Price (₹)</label>
                    <input type="number" value={currentSlide.discountedPrice || 0} onChange={(e) => handleChange('discountedPrice', e.target.value)} className="w-full px-4 py-3 bg-slate-950 border-2 border-slate-800 text-white focus:border-indigo-600 focus:outline-none rounded" />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-bold text-slate-300 mb-2">Product Image</label>
                  <div className="flex items-center gap-4">
                    <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" id={`hero-image-upload-${activeSlide}`} />
                    <label htmlFor={`hero-image-upload-${activeSlide}`} className="cursor-pointer bg-slate-950 border-2 border-slate-800 text-slate-300 px-4 py-3 rounded hover:border-indigo-600 transition-all flex items-center">
                      <ImageIcon className="w-5 h-5 mr-2" />
                      {isUploading ? "Uploading..." : "Upload Image"}
                    </label>
                    {currentSlide.image && <img src={currentSlide.image} alt="Preview" className="h-16 w-auto object-contain border-2 border-slate-800 bg-white p-1 rounded" />}
                  </div>
                </div>
              </div>

              {/* Right Column: Arrays */}
              <div className="space-y-8 overflow-visible">
                {/* Powerful Features */}
                <div className="bg-slate-900 border-2 border-slate-800 p-6 shadow-xl rounded-xl">
                  <div className="flex justify-between items-center mb-4 border-b border-slate-800 pb-2">
                    <h3 className="text-xl font-black text-white">Features (Right Panel)</h3>
                    <button onClick={() => addArrayItem('features', {icon: 'Package', title: 'New Feature'})} className="text-indigo-400 hover:text-indigo-300 bg-slate-950 p-2 rounded border border-slate-800"><Plus className="w-5 h-5"/></button>
                  </div>
                  <div className="space-y-3">
                    {currentSlide.features?.map((item, i) => (
                      <div key={i} className="flex gap-3 items-center bg-slate-950 p-3 border border-slate-800 rounded">
                        <CustomIconSelector value={item.icon} onChange={(val) => handleArrayChange('features', i, 'icon', val)} />
                        <input type="text" value={item.title} onChange={(e) => handleArrayChange('features', i, 'title', e.target.value)} className="flex-1 bg-slate-900 text-white border border-slate-700 p-2 rounded focus:border-indigo-500 focus:outline-none" placeholder="Feature Title" />
                        <button onClick={() => removeArrayItem('features', i)} className="text-red-500 hover:text-red-400 p-2 bg-slate-900 rounded border border-slate-700"><Trash2 className="w-5 h-5"/></button>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Product Information */}
                <div className="bg-slate-900 border-2 border-slate-800 p-6 shadow-xl rounded-xl">
                  <div className="flex justify-between items-center mb-4 border-b border-slate-800 pb-2">
                    <h3 className="text-xl font-black text-white">Product Info (Middle)</h3>
                    <button onClick={() => addArrayItem('productInfo', {icon: 'Info', title: 'New Info', description: 'Description'})} className="text-indigo-400 hover:text-indigo-300 bg-slate-950 p-2 rounded border border-slate-800"><Plus className="w-5 h-5"/></button>
                  </div>
                  <div className="space-y-3">
                    {currentSlide.productInfo?.map((item, i) => (
                      <div key={i} className="flex gap-3 items-start bg-slate-950 p-3 border border-slate-800 relative rounded">
                        <div className="mt-1">
                          <CustomIconSelector value={item.icon} onChange={(val) => handleArrayChange('productInfo', i, 'icon', val)} />
                        </div>
                        <div className="flex-1 space-y-2">
                          <input type="text" placeholder="Title (e.g. Control)" value={item.title} onChange={(e) => handleArrayChange('productInfo', i, 'title', e.target.value)} className="w-full bg-slate-900 text-white border border-slate-700 rounded p-2 focus:border-indigo-500 focus:outline-none" />
                          <input type="text" placeholder="Description" value={item.description} onChange={(e) => handleArrayChange('productInfo', i, 'description', e.target.value)} className="w-full bg-slate-900 text-white border border-slate-700 rounded p-2 focus:border-indigo-500 focus:outline-none" />
                        </div>
                        <button onClick={() => removeArrayItem('productInfo', i)} className="text-red-500 hover:text-red-400 p-2 mt-1 bg-slate-900 rounded border border-slate-700"><Trash2 className="w-5 h-5"/></button>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Why Choose */}
                <div className="bg-slate-900 border-2 border-slate-800 p-6 shadow-xl rounded-xl">
                  <div className="flex justify-between items-center mb-4 border-b border-slate-800 pb-2">
                    <h3 className="text-xl font-black text-white">Why Choose (Bottom)</h3>
                    <button onClick={() => addArrayItem('whyChoose', {icon: 'Smile', title: 'New Reason'})} className="text-indigo-400 hover:text-indigo-300 bg-slate-950 p-2 rounded border border-slate-800"><Plus className="w-5 h-5"/></button>
                  </div>
                  <div className="space-y-3">
                    {currentSlide.whyChoose?.map((item, i) => (
                      <div key={i} className="flex gap-3 items-center bg-slate-950 p-3 border border-slate-800 rounded">
                        <CustomIconSelector value={item.icon} onChange={(val) => handleArrayChange('whyChoose', i, 'icon', val)} />
                        <input type="text" value={item.title} onChange={(e) => handleArrayChange('whyChoose', i, 'title', e.target.value)} className="flex-1 bg-slate-900 text-white border border-slate-700 p-2 rounded focus:border-indigo-500 focus:outline-none" placeholder="Reason Title" />
                        <button onClick={() => removeArrayItem('whyChoose', i)} className="text-red-500 hover:text-red-400 p-2 bg-slate-900 rounded border border-slate-700"><Trash2 className="w-5 h-5"/></button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default ManageStoreHero;
