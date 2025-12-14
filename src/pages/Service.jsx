import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
  Truck,
  Shield,
  Clock,
  Package,
  Headphones,
  Wrench,
} from "lucide-react";
import { motion } from "framer-motion";

const Service = () => {
  const [activeService, setActiveService] = useState(0);

  const services = [
    {
      id: 1,
      icon: Truck,
      title: "Nationwide Delivery",
      shortDesc: "Fast & Reliable",
      description:
        "We deliver precision-engineered drone components across India with express shipping options and real-time tracking.",
    },
    {
      id: 2,
      icon: Shield,
      title: "Quality Assurance",
      shortDesc: "Tested & Certified",
      description:
        "Every component undergoes rigorous testing. We guarantee performance, durability, and compliance with industry standards.",
    },
    {
      id: 3,
      icon: Clock,
      title: "Technical Support",
      shortDesc: "Expert Assistance",
      description:
        "Our engineering team provides comprehensive technical support—from product selection to troubleshooting and optimization.",
    },
    {
      id: 4,
      icon: Package,
      title: "Custom Solutions",
      shortDesc: "Tailored Builds",
      description:
        "Need a specific configuration? We design and source custom drone systems for specialized applications and research projects.",
    },
    {
      id: 5,
      icon: Wrench,
      title: "Repair & Maintenance",
      shortDesc: "Professional Care",
      description:
        "Complete repair services for all drone models. We diagnose issues, replace components, and optimize performance.",
    },
    {
      id: 6,
      icon: Headphones,
      title: "Consultation",
      shortDesc: "Strategic Guidance",
      description:
        "Whether you're starting a project or scaling operations, our consultants help you make informed technical and commercial decisions.",
    },
  ];

  const trainingPrograms = [
    {
      title: "IoT Development",
      duration: "6 Weeks",
      level: "Foundation",
      focus: "Hardware & Software Integration",
      modules: [
        "Sensor Networks",
        "Data Protocols",
        "Embedded Systems",
        "Cloud Connectivity",
      ],
    },
    {
      title: "Drone Assembly",
      duration: "4 Weeks",
      level: "Practical",
      focus: "Hands-On Build Experience",
      modules: [
        "Frame Construction",
        "Flight Controllers",
        "ESC Calibration",
        "Flight Testing",
      ],
    },
    {
      title: "Advanced Automation",
      duration: "8 Weeks",
      level: "Professional",
      focus: "AI & Autonomous Systems",
      modules: [
        "Computer Vision",
        "Path Planning",
        "Mission Control",
        "Safety Protocols",
      ],
    },
  ];

  return (
    <div className="bg-white">
      {/* Hero Section - Minimal */}
      <section className="pt-8 pb-8 border-b-2 border-gray-900">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-3xl"
          >
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: 80 }}
              transition={{ duration: 1, delay: 0.3 }}
              className="h-1 bg-gradient-to-r from-emerald-600 to-blue-600 mb-8"
            ></motion.div>
            <motion.h1
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{
                duration: 0.8,
                delay: 0.4,
                type: "spring",
                stiffness: 100,
              }}
              className="text-6xl lg:text-7xl font-black text-gray-900 leading-tight mb-6"
            >
              What We Do
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6, type: "spring" }}
              className="text-2xl text-gray-600 leading-relaxed"
            >
              Professional drone solutions, technical expertise, and specialized
              training for innovators and industry.
            </motion.p>
          </motion.div>
        </div>
      </section>

      {/* Interactive Services Grid */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6 }}
            className="mb-16"
          >
            <h2 className="text-4xl font-black text-gray-900 mb-4">
              Our Services
            </h2>
            <p className="text-gray-600">Click to explore each service</p>
          </motion.div>

          <div className="grid lg:grid-cols-2 gap-16">
            {/* Left: Service List */}
            <div className="space-y-4">
              {services.map((service, index) => {
                const Icon = service.icon;
                return (
                  <div
                    key={service.id}
                    onClick={() => setActiveService(index)}
                    className={`group cursor-pointer border-l-4 transition-all ${
                      activeService === index
                        ? "border-gray-900 bg-gray-50"
                        : "border-gray-200 hover:border-gray-400"
                    }`}
                  >
                    <div className="p-6 flex items-start gap-6">
                      <div
                        className={`flex-shrink-0 w-12 h-12 flex items-center justify-center border-2 transition-colors ${
                          activeService === index
                            ? "border-gray-900 bg-gray-900 text-white"
                            : "border-gray-300 text-gray-400 group-hover:border-gray-500"
                        }`}
                      >
                        <Icon className="w-6 h-6" strokeWidth={2} />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-2">
                          <h3
                            className={`text-xl font-bold transition-colors ${
                              activeService === index
                                ? "text-gray-900"
                                : "text-gray-600 group-hover:text-gray-900"
                            }`}
                          >
                            {service.title}
                          </h3>
                          <span className="text-3xl font-black text-gray-200">
                            0{service.id}
                          </span>
                        </div>
                        <p className="text-sm text-gray-500">
                          {service.shortDesc}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Right: Active Service Detail */}
            <div className="lg:sticky lg:top-32 h-fit">
              <div className="border-2 border-gray-900 p-12">
                <div className="absolute top-0 left-0 w-20 h-20 border-l-2 border-t-2 border-gray-900"></div>
                <div className="absolute bottom-0 right-0 w-20 h-20 border-r-2 border-b-2 border-gray-900"></div>

                <div className="text-7xl font-black text-gray-100 mb-8">
                  0{services[activeService].id}
                </div>

                <h3 className="text-3xl font-black text-gray-900 mb-4">
                  {services[activeService].title}
                </h3>

                <div className="w-16 h-1 bg-gradient-to-r from-emerald-600 to-blue-600 mb-6"></div>

                <p className="text-lg text-gray-600 leading-relaxed">
                  {services[activeService].description}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Training Programs - Table Layout */}
      <section className="py-32 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="mb-16">
            <h2 className="text-4xl font-black text-gray-900 mb-4">
              Training Programs
            </h2>
            <p className="text-gray-600">
              Structured learning paths for technical excellence
            </p>
          </div>

          {/* Training Cards */}
          <div className="grid md:grid-cols-3 gap-8">
            {trainingPrograms.map((program, index) => (
              <div
                key={index}
                className="bg-white border-2 border-gray-900 p-8 hover:shadow-2xl transition-shadow"
              >
                {/* Number */}
                <div className="text-5xl font-black text-gray-200 mb-6">
                  0{index + 1}
                </div>

                {/* Title */}
                <h3 className="text-2xl font-black text-gray-900 mb-6">
                  {program.title}
                </h3>

                {/* Meta Info */}
                <div className="flex gap-4 mb-6 pb-6 border-b-2 border-gray-200">
                  <div>
                    <div className="text-xs text-gray-500 uppercase tracking-wider mb-1">
                      Duration
                    </div>
                    <div className="font-bold text-gray-900">
                      {program.duration}
                    </div>
                  </div>
                  <div className="border-l-2 border-gray-200 pl-4">
                    <div className="text-xs text-gray-500 uppercase tracking-wider mb-1">
                      Level
                    </div>
                    <div className="font-bold text-gray-900">
                      {program.level}
                    </div>
                  </div>
                </div>

                {/* Focus */}
                <div className="mb-6">
                  <div className="text-xs text-gray-500 uppercase tracking-wider mb-2">
                    Focus Area
                  </div>
                  <p className="text-sm font-semibold text-gray-900">
                    {program.focus}
                  </p>
                </div>

                {/* Modules */}
                <div>
                  <div className="text-xs text-gray-500 uppercase tracking-wider mb-3">
                    Key Modules
                  </div>
                  <div className="space-y-2">
                    {program.modules.map((module, idx) => (
                      <div key={idx} className="flex items-start gap-2">
                        <div className="w-1 h-1 bg-gray-900 mt-2"></div>
                        <span className="text-sm text-gray-700">{module}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* CTA */}
          <Link to="/store">
            <div className="mt-16 text-center">
              <button className="group relative px-12 py-5 bg-gray-900 text-white font-bold tracking-wider uppercase text-sm overflow-hidden">
                <span className="relative z-10 flex items-center gap-3">
                  View All Products
                  <svg
                    className="w-5 h-5 transition-transform group-hover:translate-x-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13 7l5 5m0 0l-5 5m5-5H6"
                    />
                  </svg>
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-emerald-600 via-blue-600 to-purple-600 translate-x-[-100%] group-hover:translate-x-0 transition-transform duration-500"></div>
              </button>
            </div>
          </Link>
        </div>
      </section>

      {/* Contact CTA - Split Layout */}
      <section className="py-32">
        <div className="max-w-7xl mx-auto px-6">
          <div className="border-2 border-gray-900 grid md:grid-cols-2">
            {/* Left: Message */}
            <div className="p-16 border-r-2 border-gray-900">
              <div className="text-6xl font-black text-gray-100 mb-8">?</div>
              <h2 className="text-4xl font-black text-gray-900 mb-6 leading-tight">
                Have a specific
                <br />
                requirement?
              </h2>
              <p className="text-lg text-gray-600 leading-relaxed mb-8">
                We provide custom solutions, technical consultations, and
                specialized training programs tailored to your needs.
              </p>
              <div className="w-16 h-1 bg-gradient-to-r from-emerald-600 to-blue-600"></div>
            </div>

            {/* Right: Action */}
            <div className="p-16 bg-gray-50 flex flex-col justify-center">
              <div className="space-y-6">
                <div>
                  <div className="text-xs text-gray-500 uppercase tracking-wider mb-2">
                    Get In Touch
                  </div>
                  <p className="text-sm text-gray-700">
                    Our team will respond within 24 hours
                  </p>
                </div>

                <Link
                  to="/contact"
                  className="block w-full group relative px-8 py-5 bg-gray-900 text-white font-bold tracking-wider uppercase text-sm overflow-hidden"
                >
                  <span className="relative z-10 flex items-center justify-center gap-3">
                    Contact Us
                    <svg
                      className="w-5 h-5 transition-transform group-hover:translate-x-2"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M13 7l5 5m0 0l-5 5m5-5H6"
                      />
                    </svg>
                  </span>
                  <div className="absolute inset-0 bg-gradient-to-r from-emerald-600 via-blue-600 to-purple-600 translate-x-[-100%] group-hover:translate-x-0 transition-transform duration-500"></div>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Service;
