import React, { useState, useEffect, useRef } from "react";
import { ArrowRight, ArrowLeft } from "lucide-react";
import Container from "../../ui/Container";
import axios from "axios";
import { API_URL } from "../../../api";
import { motion, AnimatePresence } from "framer-motion";

const GalleryCard = () => {
  const [experiences, setExperiences] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [loading, setLoading] = useState(true);

  const containerRef = useRef(null);

  // Fetch hero data from API
  useEffect(() => {
    fetchHeroData();
  }, []);

  const fetchHeroData = async () => {
    try {
      const { data } = await axios.get(`${API_URL}/api/hero`);
      if (data.success && data.heros?.length > 0) {
        const activeHeroes = data.heros
          .filter((hero) => hero.isActive)
          .sort((a, b) => a.order - b.order);

        const transformedData = activeHeroes.map((hero) => ({
          id: hero._id,
          src: hero.image,
          category: hero.category,
          title: hero.title,
          description: hero.description,
          buttonText: hero.buttonText,
          buttonLink: hero.buttonLink,
          features: hero.features,
          stats: hero.stats,
        }));

        setExperiences(transformedData);
      }
    } catch (error) {
      console.error("Error fetching hero data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleNext = () => {
    if (isTransitioning || experiences.length === 0) return;
    setIsTransitioning(true);
    setCurrentIndex((prev) => {
      const next = (prev + 1) % experiences.length;
      console.log("Next clicked - Current:", prev, "Next:", next);
      return next;
    });
    setTimeout(() => setIsTransitioning(false), 700);
  };

  const handlePrev = () => {
    if (isTransitioning || experiences.length === 0) return;
    setIsTransitioning(true);
    setCurrentIndex((prev) => {
      const previous = prev === 0 ? experiences.length - 1 : prev - 1;
      console.log("Prev clicked - Current:", prev, "Previous:", previous);
      return previous;
    });
    setTimeout(() => setIsTransitioning(false), 700);
  };

  const goToSlide = (index) => {
    if (isTransitioning || index === currentIndex) return;
    setIsTransitioning(true);
    console.log("Go to slide:", index);
    setCurrentIndex(index);
    setTimeout(() => setIsTransitioning(false), 700);
  };

  // Auto-play functionality
  useEffect(() => {
    if (experiences.length <= 1) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % experiences.length);
    }, 6000);

    return () => clearInterval(interval);
  }, [experiences.length]);

  const handleButtonClick = (link) => {
    if (link) {
      window.location.href = link;
    }
  };

  // Loading state
  if (loading) {
    return (
      <section className="py-20 bg-white">
        <Container>
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="animate-spin rounded-full h-10 w-10 border-2 border-gray-200 border-t-gray-900"></div>
          </div>
        </Container>
      </section>
    );
  }

  // No data state
  if (!experiences.length) {
    return null;
  }

  return (
    <section
      ref={containerRef}
      className="py-20 bg-gradient-to-br from-gray-50 to-white relative overflow-hidden"
    >
      {/* Subtle geometric patterns */}
      <div className="absolute inset-0 opacity-[0.03]">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `radial-gradient(circle at 2px 2px, currentColor 1px, transparent 0)`,
            backgroundSize: "40px 40px",
          }}
        />
      </div>

      <Container>
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="mb-20 relative"
        >
          <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-8">
            <div className="relative z-10">
              {/* Large number background */}
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="absolute -left-4 -top-8 text-[180px] font-black text-gray-100 leading-none select-none pointer-events-none z-0"
              >
                {String(currentIndex + 1).padStart(2, "0")}
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
                    Featured
                  </span>
                </motion.div>
                <motion.h2
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: 0.4 }}
                  className="text-6xl lg:text-7xl font-black text-gray-900 tracking-tight"
                >
                  Experiences
                </motion.h2>
              </div>
            </div>

            {/* Navigation with counter */}
            {experiences.length > 1 && (
              <div className="flex items-center gap-6 relative z-50 pointer-events-auto">
                <div className="text-right pointer-events-none">
                  <div className="text-4xl font-bold text-gray-900">
                    {String(currentIndex + 1).padStart(2, "0")}
                  </div>
                  <div className="text-sm text-gray-400">
                    / {String(experiences.length).padStart(2, "0")}
                  </div>
                </div>
                <div className="flex gap-2 pointer-events-auto">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      handlePrev();
                    }}
                    disabled={isTransitioning}
                    className="w-14 h-14 border-2 border-gray-900 text-gray-900 flex items-center justify-center hover:bg-gray-900 hover:text-white transition-all disabled:opacity-30 disabled:cursor-not-allowed group cursor-pointer relative z-50"
                    aria-label="Previous"
                  >
                    <ArrowLeft className="w-5 h-5 transition-transform group-hover:-translate-x-0.5 pointer-events-none" />
                  </button>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      handleNext();
                    }}
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
          {experiences.map((experience, index) => (
            <motion.div
              key={experience.id}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{
                opacity: index === currentIndex ? 1 : 0,
                scale: index === currentIndex ? 1 : 0.95,
              }}
              transition={{ duration: 0.7, ease: "easeOut" }}
              className={`transition-all duration-700 ${
                index === currentIndex
                  ? "opacity-100 relative"
                  : "opacity-0 absolute inset-0 pointer-events-none"
              }`}
            >
              <div className="grid lg:grid-cols-12 gap-8 lg:gap-12 items-start">
                {/* Image Side - Takes more space */}
                <motion.div
                  initial={{ opacity: 0, scale: 0.9, x: -50 }}
                  whileInView={{ opacity: 1, scale: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.8, type: "spring", stiffness: 80 }}
                  className="lg:col-span-7 relative group"
                >
                  {/* Image container with creative border */}
                  <div className="relative">
                    {/* Decorative corner elements */}
                    <motion.div
                      initial={{ opacity: 0, scale: 0 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.5, delay: 0.2 }}
                      className="absolute -top-4 -left-4 w-12 h-12 border-l-2 border-t-2 border-gray-900 z-10"
                    ></motion.div>
                    <motion.div
                      initial={{ opacity: 0, scale: 0 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.5, delay: 0.3 }}
                      className="absolute -bottom-4 -right-4 w-12 h-12 border-r-2 border-b-2 border-gray-900 z-10"
                    ></motion.div>

                    <div className="aspect-[4/3] overflow-hidden bg-gray-100 relative flex items-center justify-center">
                      <motion.img
                        initial={{ opacity: 0, scale: 1.2 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                        src={experience.src}
                        alt={experience.title}
                        className="w-full h-full object-contain transition-transform duration-700 group-hover:scale-105"
                        loading="lazy"
                      />

                      {/* Gradient overlay on hover */}
                      <div className="absolute inset-0 bg-gradient-to-t from-gray-900/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                    </div>

                    {/* Floating category badge */}
                    {experience.category && (
                      <motion.div
                        initial={{ opacity: 0, scale: 0.8, y: -20 }}
                        whileInView={{ opacity: 1, scale: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{
                          duration: 0.6,
                          delay: 0.4,
                          type: "spring",
                        }}
                        className="absolute top-6 left-6 bg-white px-4 py-2 shadow-lg"
                      >
                        <span className="text-xs font-bold tracking-[0.2em] uppercase text-gray-900">
                          {experience.category}
                        </span>
                      </motion.div>
                    )}
                  </div>

                  {/* Stats bar below image */}
                  {experience.stats && (
                    <motion.div
                      initial={{ opacity: 0, y: 30 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.6, delay: 0.5 }}
                      className="mt-6 grid grid-cols-3 gap-4 border-l-4 border-gray-900 pl-6"
                    >
                      {experience.stats.participants && (
                        <motion.div
                          initial={{ opacity: 0, scale: 0.8 }}
                          whileInView={{ opacity: 1, scale: 1 }}
                          viewport={{ once: true }}
                          transition={{ duration: 0.5, delay: 0.6 }}
                        >
                          <div className="text-3xl font-black text-gray-900">
                            {experience.stats.participants}
                          </div>
                          <div className="text-xs font-medium tracking-wider uppercase text-gray-500 mt-1">
                            Participants
                          </div>
                        </motion.div>
                      )}
                      {experience.stats.rating && (
                        <motion.div
                          initial={{ opacity: 0, scale: 0.8 }}
                          whileInView={{ opacity: 1, scale: 1 }}
                          viewport={{ once: true }}
                          transition={{ duration: 0.5, delay: 0.7 }}
                        >
                          <div className="text-3xl font-black text-gray-900">
                            {experience.stats.rating}
                          </div>
                          <div className="text-xs font-medium tracking-wider uppercase text-gray-500 mt-1">
                            Rating
                          </div>
                        </motion.div>
                      )}
                      {experience.stats.duration && (
                        <motion.div
                          initial={{ opacity: 0, scale: 0.8 }}
                          whileInView={{ opacity: 1, scale: 1 }}
                          viewport={{ once: true }}
                          transition={{ duration: 0.5, delay: 0.8 }}
                        >
                          <div className="text-3xl font-black text-gray-900">
                            {experience.stats.duration}
                          </div>
                          <div className="text-xs font-medium tracking-wider uppercase text-gray-500 mt-1">
                            Duration
                          </div>
                        </motion.div>
                      )}
                    </motion.div>
                  )}
                </motion.div>

                {/* Content Side */}
                <motion.div
                  initial={{ opacity: 0, x: 50 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.8, delay: 0.3 }}
                  className="lg:col-span-5 space-y-8 lg:pt-8"
                >
                  {/* Title with creative line */}
                  <div>
                    <div className="flex items-start gap-4 mb-6">
                      <motion.div
                        initial={{ height: 0 }}
                        whileInView={{ height: 96 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8, delay: 0.4 }}
                        className="flex-shrink-0 w-1 bg-gradient-to-b from-emerald-500 via-blue-500 to-purple-500"
                      ></motion.div>
                      <motion.h3
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6, delay: 0.5 }}
                        className="text-4xl lg:text-5xl font-black text-gray-900 leading-[0.95] tracking-tight"
                      >
                        {experience.title}
                      </motion.h3>
                    </div>
                  </div>

                  {/* Description */}
                  {experience.description && (
                    <motion.p
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.6, delay: 0.6 }}
                      className="text-lg text-gray-600 leading-relaxed font-light"
                    >
                      {experience.description}
                    </motion.p>
                  )}

                  {/* Features with creative bullets */}
                  {experience.features && experience.features.length > 0 && (
                    <div className="space-y-4 pt-4">
                      {experience.features.map((feature, idx) => (
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

                  {/* CTA Button with creative style */}
                  {experience.buttonText && (
                    <div className="pt-4">
                      <button
                        onClick={() => handleButtonClick(experience.buttonLink)}
                        className="group relative px-10 py-5 bg-gray-900 text-white font-bold tracking-wider uppercase text-sm overflow-hidden"
                      >
                        <span className="relative z-10 flex items-center gap-3">
                          {experience.buttonText}
                          <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-2" />
                        </span>
                        {/* Animated background */}
                        <div className="absolute inset-0 bg-gradient-to-r from-emerald-600 via-blue-600 to-purple-600 translate-x-[-100%] group-hover:translate-x-0 transition-transform duration-500"></div>
                      </button>
                    </div>
                  )}
                </motion.div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Creative Progress Bars */}
        {experiences.length > 1 && (
          <div className="mt-16 space-y-3">
            {experiences.map((exp, index) => (
              <div key={index} className="flex items-center gap-4 group">
                <button
                  onClick={() => goToSlide(index)}
                  disabled={isTransitioning}
                  className="text-sm font-bold text-gray-400 hover:text-gray-900 transition-colors disabled:cursor-not-allowed"
                >
                  {String(index + 1).padStart(2, "0")}
                </button>
                <div className="flex-1 h-px bg-gray-200 relative overflow-hidden">
                  <div
                    className={`absolute inset-y-0 left-0 bg-gray-900 transition-all duration-1000 ${
                      index === currentIndex ? "w-full" : "w-0"
                    }`}
                  />
                </div>
                <div className="text-xs text-gray-400 uppercase tracking-wider max-w-[200px] truncate">
                  {exp.title}
                </div>
              </div>
            ))}
          </div>
        )}
      </Container>
    </section>
  );
};

export default GalleryCard;
