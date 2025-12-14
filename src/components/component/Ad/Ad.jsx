import React, { useState, useEffect } from "react";
import { ArrowRight, ArrowLeft } from "lucide-react";
import axios from "axios";
import { API_URL } from "../../../api";
import toast from "react-hot-toast";
import { motion } from "framer-motion";

const ProductAdCard = () => {
  const [ads, setAds] = useState([]);
  const [currentAdIndex, setCurrentAdIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);

  const getAds = async () => {
    try {
      const { data } = await axios.get(`${API_URL}/api/ad/get-ads`);
      if (data?.success && data.ads?.length > 0) {
        setAds(data.ads);
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to load ads");
    }
  };

  const handleNext = () => {
    if (isTransitioning || ads.length === 0) return;
    setIsTransitioning(true);
    setCurrentAdIndex((prev) => (prev + 1) % ads.length);
    setTimeout(() => setIsTransitioning(false), 700);
  };

  const handlePrev = () => {
    if (isTransitioning || ads.length === 0) return;
    setIsTransitioning(true);
    setCurrentAdIndex((prev) => (prev === 0 ? ads.length - 1 : prev - 1));
    setTimeout(() => setIsTransitioning(false), 700);
  };

  // Auto-change ads every 6 seconds
  useEffect(() => {
    if (ads.length > 1) {
      const interval = setInterval(() => {
        setCurrentAdIndex((prev) => (prev + 1) % ads.length);
      }, 6000);
      return () => clearInterval(interval);
    }
  }, [ads.length]);

  // Load ads on component mount
  useEffect(() => {
    getAds();
  }, []);

  // Don't render if no ads
  if (!ads.length) return null;

  const currentAd = ads[currentAdIndex];

  return (
    <section className="py-20 bg-white relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header with navigation */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="mb-16"
        >
          <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-8">
            <div className="relative">
              {/* Large number background */}
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="absolute -left-4 -top-8 text-[180px] font-black text-gray-100 leading-none select-none pointer-events-none z-0"
              >
                {String(currentAdIndex + 1).padStart(2, "0")}
              </motion.div>

              <div className="relative z-20">
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: 0.3 }}
                  className="inline-flex items-center gap-3 mb-4"
                >
                  <div className="h-px w-12 bg-gray-900"></div>
                  <span className="text-sm font-medium tracking-[0.2em] uppercase text-gray-600">
                    {currentAd.badge || "Featured"}
                  </span>
                </motion.div>
                <motion.h2
                  initial={{ opacity: 0, scale: 0.95, y: 20 }}
                  whileInView={{ opacity: 1, scale: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{
                    duration: 0.6,
                    delay: 0.4,
                    type: "spring",
                    stiffness: 100,
                  }}
                  className="text-6xl lg:text-7xl font-black text-gray-900 tracking-tight"
                >
                  Offers
                </motion.h2>
              </div>
            </div>

            {/* Navigation with counter */}
            {ads.length > 1 && (
              <div className="flex items-center gap-6 relative z-50 pointer-events-auto">
                <div className="text-right pointer-events-none">
                  <div className="text-4xl font-bold text-gray-900">
                    {String(currentAdIndex + 1).padStart(2, "0")}
                  </div>
                  <motion.div
                    className="text-sm text-gray-400"
                    initial={{ opacity: 0, y: 6 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: 0.15, ease: "easeIn" }}
                  >
                    / {String(ads.length).padStart(2, "0")}
                  </motion.div>
                </div>
                <div className="flex gap-2 pointer-events-auto">
                  <button
                    type="button"
                    onClick={handlePrev}
                    disabled={isTransitioning}
                    className="w-14 h-14 border-2 border-gray-900 text-gray-900 flex items-center justify-center hover:bg-gray-900 hover:text-white transition-all disabled:opacity-30 disabled:cursor-not-allowed group cursor-pointer relative z-50"
                    aria-label="Previous"
                  >
                    <ArrowLeft className="w-5 h-5 transition-transform group-hover:-translate-x-0.5 pointer-events-none" />
                  </button>
                  <button
                    type="button"
                    onClick={handleNext}
                    disabled={isTransitioning}
                    className="w-14 h-14 bg-gray-900 text-white flex items-center justify-center hover:bg-gray-800 transition-all disabled:opacity-30 disabled:cursor-not-allowed group cursor-pointer relative z-50"
                    aria-label="Next"
                  >
                    <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-0.5 pointer-events-none" />
                  </button>
                </div>
              </div>
            )}
          </div>
        </motion.div>

        {/* Main Content */}
        <div className="relative">
          {ads.map((ad, index) => (
            <div
              key={ad._id || index}
              className={`transition-all duration-700 ${
                index === currentAdIndex
                  ? "opacity-100 relative"
                  : "opacity-0 absolute inset-0 pointer-events-none"
              }`}
            >
              <div className="grid lg:grid-cols-12 gap-8 lg:gap-12 items-center">
                {/* Content Side */}
                <div className="lg:col-span-5 space-y-8">
                  {/* Title with accent line */}
                  <div>
                    <div className="flex items-start gap-4 mb-6">
                      <div className="flex-shrink-0 w-1 h-24 bg-gradient-to-b from-emerald-500 via-blue-500 to-purple-500"></div>
                      <h3 className="text-4xl lg:text-5xl font-black text-gray-900 leading-[0.95] tracking-tight">
                        {ad.title}
                      </h3>
                    </div>
                  </div>

                  {/* Description */}
                  {ad.description && (
                    <p className="text-lg text-gray-600 leading-relaxed font-light">
                      {ad.description}
                    </p>
                  )}

                  {/* Features */}
                  {Array.isArray(ad.features) && ad.features.length > 0 && (
                    <div className="space-y-4 pt-4">
                      {ad.features.map((feature, idx) => (
                        <div key={idx} className="flex items-start gap-4 group">
                          <div className="flex-shrink-0 mt-2">
                            <div className="w-6 h-px bg-gray-900 group-hover:w-12 transition-all duration-300"></div>
                          </div>
                          <span className="text-gray-700 font-medium">
                            {feature}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Discount Badge */}
                  {ad.discount && (
                    <div className="inline-block border-2 border-gray-900 px-6 py-3">
                      <span className="text-2xl font-black text-gray-900">
                        {ad.discount}% OFF
                      </span>
                    </div>
                  )}

                  {/* CTA Button */}
                  <div className="pt-4">
                    <button className="group relative px-10 py-5 bg-gray-900 text-white font-bold tracking-wider uppercase text-sm overflow-hidden">
                      <span className="relative z-10 flex items-center gap-3">
                        {ad.buttonText || "Shop Now"}
                        <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-2" />
                      </span>
                      <div className="absolute inset-0 bg-gradient-to-r from-emerald-600 via-blue-600 to-purple-600 translate-x-[-100%] group-hover:translate-x-0 transition-transform duration-500"></div>
                    </button>
                  </div>
                </div>

                {/* Image Side */}
                <div className="lg:col-span-7 relative group">
                  <div className="relative">
                    {/* Decorative corner elements */}
                    <div className="absolute -top-4 -left-4 w-12 h-12 border-l-2 border-t-2 border-gray-900 z-10"></div>
                    <div className="absolute -bottom-4 -right-4 w-12 h-12 border-r-2 border-b-2 border-gray-900 z-10"></div>

                    <div className="aspect-[4/3] overflow-hidden bg-gray-100 relative">
                      <img
                        src={ad.image}
                        alt={ad.title}
                        className="w-full h-full object-contain p-8 transition-transform duration-700 group-hover:scale-105"
                        loading="lazy"
                      />

                      {/* Gradient overlay on hover */}
                      <div className="absolute inset-0 bg-gradient-to-t from-gray-900/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Progress Bars */}
        {ads.length > 1 && (
          <div className="mt-16 space-y-3">
            {ads.map((ad, index) => (
              <div key={index} className="flex items-center gap-4 group">
                <button
                  onClick={() => {
                    if (!isTransitioning) {
                      setIsTransitioning(true);
                      setCurrentAdIndex(index);
                      setTimeout(() => setIsTransitioning(false), 700);
                    }
                  }}
                  disabled={isTransitioning}
                  className="text-sm font-bold text-gray-400 hover:text-gray-900 transition-colors disabled:cursor-not-allowed"
                >
                  {String(index + 1).padStart(2, "0")}
                </button>
                <div className="flex-1 h-px bg-gray-200 relative overflow-hidden">
                  <div
                    className={`absolute inset-y-0 left-0 bg-gray-900 transition-all duration-1000 ${
                      index === currentAdIndex ? "w-full" : "w-0"
                    }`}
                  />
                </div>
                <div className="text-xs text-gray-400 uppercase tracking-wider max-w-[200px] truncate">
                  {ad.title}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default ProductAdCard;
