import React, { useState, useEffect } from "react";
import "./Hero.css";
import { ArrowRight } from "lucide-react";
import { motion } from "framer-motion";

const Hero = ({ handleOrderPopup }) => {
  const [displayedText, setDisplayedText] = useState("");
  const fullText = "A New Chapter in Aerial Innovation";

  useEffect(() => {
    let index = 0;
    const timer = setInterval(() => {
      if (index <= fullText.length) {
        setDisplayedText(fullText.slice(0, index));
        index++;
      } else {
        clearInterval(timer);
      }
    }, 30);

    return () => clearInterval(timer);
  }, []);

  return (
    <section className="relative flex min-h-screen w-full items-center justify-center overflow-hidden bg-black text-white">
      <video
        className="absolute inset-0 h-full w-full object-cover"
        autoPlay
        muted
        loop
        playsInline
        preload="auto"
      >
        <source
          src="https://res.cloudinary.com/dzqtx9kms/video/upload/f_auto,q_auto/Drone_Forest_Chase_Hyper_Realistic_Action_jc5zse.mp4"
          type="video/mp4"
        />
      </video>
      <div className="absolute inset-0 bg-gradient-to-b from-slate-950/90 via-slate-950/75 to-slate-950/95 backdrop-blur-sm" />

      <div className="relative z-10 mx-auto max-w-4xl px-6 py-24 text-center sm:px-8 md:px-12">
        <motion.p
          initial={{ opacity: 0, scale: 0.8, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{
            duration: 0.6,
            ease: "easeOut",
            type: "spring",
            stiffness: 100,
          }}
          className="text-xs uppercase tracking-[0.4em] text-emerald-300 drop-shadow"
        >
          Flytium Drones
        </motion.p>
        <motion.h1
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3, delay: 0.3 }}
          className="mt-6 text-4xl font-bold leading-tight text-white drop-shadow-[0_10px_25px_rgba(0,0,0,0.7)] sm:text-5xl md:text-6xl"
        >
          {displayedText}
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{
            duration: 0.4,
            delay: 2,
            ease: "easeOut",
            type: "spring",
          }}
          className="mt-6 text-base text-slate-100/90 drop-shadow sm:text-lg md:text-xl"
        >
          Experience next-generation unmanned systems engineered for precision,
          performance, and mission success.
        </motion.p>
        <motion.div
          initial={{ opacity: 0, scale: 0.8, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{
            duration: 0.8,
            delay: 2.3,
            ease: "easeOut",
            type: "spring",
          }}
          className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row"
        >
          <motion.a
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            href="/services"
            className="inline-flex items-center justify-center rounded-full border border-white/70 px-8 py-3 text-sm font-semibold uppercase tracking-wider text-white transition hover:border-white hover:bg-white/10"
          >
            Explore Services
          </motion.a>
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 2.5 }}
        className="pointer-events-none absolute bottom-6 left-1/2 hidden -translate-x-1/2 flex-col items-center gap-2 text-white/60 sm:flex"
      >
        <span className="text-[11px] uppercase tracking-[0.3em]">Scroll</span>
        <span className="h-12 w-px bg-gradient-to-b from-white via-white/40 to-transparent" />
      </motion.div>
    </section>
  );
};

export default Hero;
