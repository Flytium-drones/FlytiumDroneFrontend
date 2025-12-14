import React, { useState } from "react";
import { Play, Pause, Volume2, VolumeX, ArrowRight } from "lucide-react";
import Container from "../../ui/Container";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

const VideoCard = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(true);

  const handlePlayPause = () => {
    const video = document.getElementById("drone-video");
    if (isPlaying) {
      video.pause();
    } else {
      video.play();
    }
    setIsPlaying(!isPlaying);
  };

  const handleMuteToggle = () => {
    const video = document.getElementById("drone-video");
    video.muted = !isMuted;
    setIsMuted(!isMuted);
  };

  const videoFeatures = [
    "Precision Control",
    "4K Recording",
    "Live Streaming",
    "Extended Flight",
  ];

  return (
    <section className="py-20 bg-gray-50 relative overflow-hidden">
      <Container>
        {/* Header */}
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
              In Action
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
            className="text-6xl lg:text-7xl font-black text-gray-900 tracking-tight mb-6"
          >
            See It{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 via-blue-600 to-purple-600">
              Live
            </span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            whileInView={{ opacity: 1, scale: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.4, type: "spring" }}
            className="text-lg text-gray-600 max-w-2xl font-light"
          >
            Experience the precision, power, and beauty of our drone technology
            in real-world applications
          </motion.p>
        </motion.div>

        {/* Main Content */}
        <div className="grid lg:grid-cols-12 gap-12 items-center">
          {/* Video Side - Larger */}
          <div className="lg:col-span-8 relative">
            {/* Decorative corners */}
            <div className="absolute -top-4 -left-4 w-16 h-16 border-l-2 border-t-2 border-gray-900 z-10"></div>
            <div className="absolute -bottom-4 -right-4 w-16 h-16 border-r-2 border-b-2 border-gray-900 z-10"></div>

            <div className="relative aspect-video bg-gray-900 overflow-hidden group">
              <video
                id="drone-video"
                className="w-full h-full object-cover"
                poster="/003.jpg"
                muted={isMuted}
                loop
                onPlay={() => setIsPlaying(true)}
                onPause={() => setIsPlaying(false)}
              >
                <source src="./13370-247710847_medium.mp4" type="video/mp4" />
                Your browser does not support the video tag.
              </video>

              {/* Video Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent">
                {/* Play/Pause Button - Center */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <button
                    onClick={handlePlayPause}
                    className="w-20 h-20 border-2 border-white text-white flex items-center justify-center hover:bg-white hover:text-gray-900 transition-all duration-300 group-hover:scale-110"
                  >
                    {isPlaying ? (
                      <Pause className="w-8 h-8" />
                    ) : (
                      <Play className="w-8 h-8 ml-1" />
                    )}
                  </button>
                </div>

                {/* Video Controls - Bottom */}
                <div className="absolute bottom-6 left-6 right-6 flex justify-between items-center">
                  <button
                    onClick={handleMuteToggle}
                    className="w-12 h-12 border border-white/50 backdrop-blur-sm flex items-center justify-center text-white hover:bg-white hover:text-gray-900 transition-all duration-300"
                  >
                    {isMuted ? (
                      <VolumeX className="w-5 h-5" />
                    ) : (
                      <Volume2 className="w-5 h-5" />
                    )}
                  </button>

                  <div className="text-white text-sm font-medium tracking-wider backdrop-blur-sm bg-black/30 px-4 py-2">
                    LIVE DEMO
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Content Side - Smaller */}
          <div className="lg:col-span-4 space-y-8">
            {/* Title with accent */}
            <div>
              <div className="flex items-start gap-4 mb-6">
                <div className="flex-shrink-0 w-1 h-20 bg-gradient-to-b from-emerald-500 via-blue-500 to-purple-500"></div>
                <h3 className="text-3xl font-black text-gray-900 leading-tight tracking-tight">
                  Aerial Technology Redefined
                </h3>
              </div>
            </div>

            <p className="text-gray-600 leading-relaxed font-light">
              From smooth aerial cinematography to precision industrial
              applications, see how our technology transforms possibilities.
            </p>

            {/* Features with line bullets */}
            <div className="space-y-4">
              {videoFeatures.map((feature, index) => (
                <div key={index} className="flex items-start gap-4 group">
                  <div className="flex-shrink-0 mt-2">
                    <div className="w-6 h-px bg-gray-900 group-hover:w-12 transition-all duration-300"></div>
                  </div>
                  <span className="text-gray-700 font-medium">{feature}</span>
                </div>
              ))}
            </div>

            {/* CTA Button */}
            {/* <div className="pt-4">
            <Link to="/store">
              <button className="group relative px-8 py-4 bg-gray-900 text-white font-bold tracking-wider uppercase text-sm overflow-hidden">
                <span className="relative z-10 flex items-center gap-3">
                  View Products
                  <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-2" />
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-emerald-600 via-blue-600 to-purple-600 translate-x-[-100%] group-hover:translate-x-0 transition-transform duration-500"></div>
              </button>
            </Link>
            </div> */}
          </div>
        </div>
      </Container>
    </section>
  );
};

export default VideoCard;
