import React, { useRef } from "react";
import Container from "../../ui/Container";
import { motion } from "framer-motion";

const ImageSlider = () => {
  const scrollerRef = useRef(null);
  const [isPaused, setIsPaused] = React.useState(false);

  const cards = [
    {
      id: 1,
      title: "Components",
      subtitle: "Premium Parts",
      description: "High-quality components engineered for peak performance",
      features: ["Flight Controllers", "Motors & ESCs", "Cameras"],
      image: "/FCpix.png",
    },
    {
      id: 2,
      title: "Technology",
      subtitle: "Smart Systems",
      description:
        "Cutting-edge AI and sensor technology for autonomous flight",
      features: ["AI Navigation", "Obstacle Avoidance", "Real-time Processing"],
      image: "/sensors.png",
    },
    {
      id: 3,
      title: "Innovation",
      subtitle: "Future Forward",
      description: "Revolutionary designs pushing the boundaries",
      features: [
        "Next-Gen Materials",
        "Advanced Aerodynamics",
        "Modular Design",
      ],
      image: "/RT.png",
    },
    {
      id: 4,
      title: "Solutions",
      subtitle: "Complete Systems",
      description: "End-to-end drone solutions for professionals",
      features: ["Custom Solutions", "24/7 Support", "Global Warranty"],
      image: "/motor.png",
    },
    {
      id: 5,
      title: "Support",
      subtitle: "24/7 Assistance",
      description: "Round-the-clock support for all your needs",
      features: ["Live Chat", "Video Tutorials", "Remote Assistance"],
      image: "/C1.png",
    },
    {
      id: 6,
      title: "Training",
      subtitle: "Skill Development",
      description: "Comprehensive training programs",
      features: ["Certified Courses", "Hands-on Training", "Safety Protocols"],
      image: "/ESC.png",
    },
  ];

  // Duplicate cards for seamless infinite effect
  const duplicatedCards = [...cards, ...cards, ...cards];

  return (
    <section className="py-20 bg-white relative overflow-hidden">
      <Container>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="mb-16"
        >
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="inline-flex items-center gap-3 mb-4"
          >
            <div className="h-px w-12 bg-gray-900"></div>
            <span className="text-sm font-medium tracking-[0.2em] uppercase text-gray-600">
              Solutions
            </span>
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            whileInView={{ opacity: 1, scale: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{
              duration: 0.6,
              delay: 0.3,
              type: "spring",
              stiffness: 100,
            }}
            className="text-6xl lg:text-7xl font-black text-gray-900 tracking-tight"
          >
            What We{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 via-blue-600 to-purple-600">
              Offer
            </span>
          </motion.h2>
        </motion.div>
      </Container>

      {/* Infinite Scrolling Cards */}
      <div
        className="relative w-full overflow-hidden"
        style={{
          width: "100vw",
          marginLeft: "calc(-50vw + 50%)",
          marginRight: "calc(-50vw + 50%)",
        }}
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
      >
        <div
          ref={scrollerRef}
          className="flex gap-6 py-6 animate-infinite-scroll"
          style={{
            paddingLeft: "2rem",
            paddingRight: "2rem",
            width: "fit-content",
            minWidth: "100vw",
            willChange: "transform",
            animationPlayState: isPaused ? "paused" : "running",
          }}
        >
          {duplicatedCards.map((card, index) => (
            <motion.div
              key={`${card.id}-${index}`}
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: (index % 6) * 0.05 }}
              whileHover={{ scale: 1.02 }}
              className="group relative flex-shrink-0 w-[300px] lg:w-[340px]"
            >
              {/* Card */}
              <motion.div
                className="relative bg-white border-2 border-gray-900 h-[420px] p-6 overflow-hidden transition-all duration-300 hover:shadow-2xl"
                initial={{ y: 6 }}
                whileInView={{ y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
              >
                {/* Decorative corner */}
                <div className="absolute top-0 right-0 w-16 h-16 border-r-2 border-t-2 border-gray-200"></div>

                {/* Image Container */}
                <div className="mb-6 relative h-32 flex items-center justify-center bg-gray-50 group-hover:bg-gray-100 transition-colors">
                  <img
                    src={card.image}
                    alt={card.title}
                    className="w-24 h-24 object-contain transition-transform duration-500 group-hover:scale-110"
                  />

                  {/* Accent line */}
                  <div className="absolute bottom-0 left-0 w-0 h-1 bg-gradient-to-r from-emerald-500 via-blue-500 to-purple-500 group-hover:w-full transition-all duration-500"></div>
                </div>

                {/* Content */}
                <div className="space-y-4">
                  {/* Title */}
                  <div>
                    <div className="text-xs font-bold tracking-[0.2em] uppercase text-gray-500 mb-1">
                      {card.subtitle}
                    </div>
                    <h3 className="text-2xl font-black text-gray-900 tracking-tight">
                      {card.title}
                    </h3>
                  </div>

                  {/* Description */}
                  <p className="text-sm text-gray-600 leading-relaxed">
                    {card.description}
                  </p>

                  {/* Features */}
                  <div className="space-y-2 pt-2">
                    {card.features.map((feature, idx) => (
                      <div key={idx} className="flex items-start gap-3">
                        <div className="flex-shrink-0 mt-1.5">
                          <div className="w-4 h-px bg-gray-900"></div>
                        </div>
                        <span className="text-xs text-gray-700 font-medium">
                          {feature}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Hover arrow */}
                <div className="absolute bottom-6 right-6 w-10 h-10 border border-gray-900 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </div>
              </motion.div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ImageSlider;
