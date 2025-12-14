import React, { useState } from "react";
import { Mail, Phone, MapPin, Send, Check } from "lucide-react";
import axios from "axios";
import toast from "react-hot-toast";
import { API_URL } from "../api";
import SEO from "../components/SEO/SEO";
import { motion } from "framer-motion";

const Contact = () => {
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      !formData.name.trim() ||
      !formData.email.trim() ||
      !formData.phone.trim() ||
      !formData.message.trim()
    ) {
      toast.error("Please fill in all fields");
      return;
    }

    setIsSubmitting(true);

    try {
      const { data } = await axios.post(
        `${API_URL}/api/contact/submit`,
        formData
      );

      if (data.success) {
        setIsSuccess(true);
        toast.success(data.message);
        setFormData({ name: "", phone: "", email: "", message: "" });

        setTimeout(() => {
          setIsSuccess(false);
        }, 5000);
      }
    } catch (error) {
      console.error("Contact form error:", error);
      toast.error(
        error.response?.data?.message ||
          "Failed to submit form. Please try again."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <SEO
        title="Contact Us | Flytium Drones"
        description="Get in touch with Flytium Drones for drone training, workshops, repairs, or product inquiries."
        keywords="contact Flytium Drones, drone training contact, Gorakhpur drone institute"
        url="/contact"
      />

      <div className="bg-white min-h-screen">
        {/* Hero */}
        <section className="pt-8 pb-8 border-b-2 border-gray-900">
          <div className="max-w-7xl mx-auto px-6">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: 80 }}
              transition={{ duration: 1, delay: 0.2 }}
              className="h-1 bg-gradient-to-r from-emerald-600 to-blue-600 mb-8"
            ></motion.div>
            <motion.h1
              initial={{ opacity: 0, scale: 0.95, y: 30 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{
                duration: 0.8,
                delay: 0.3,
                type: "spring",
                stiffness: 100,
              }}
              className="text-6xl lg:text-7xl font-black text-gray-900 leading-tight mb-6"
            >
              Get in Touch
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.5, type: "spring" }}
              className="text-xl text-gray-600 max-w-2xl"
            >
              Have questions? We'd love to hear from you. Send us a message and
              we'll respond as soon as possible.
            </motion.p>
          </div>
        </section>

        {/* Main Content - Split Layout */}
        <section className="py-16">
          <div className="max-w-7xl mx-auto px-6">
            <div className="grid lg:grid-cols-2 gap-16">
              {/* Left: Contact Info */}
              <div>
                <h2 className="text-3xl font-black text-gray-900 mb-12">
                  Contact Information
                </h2>

                {/* Info Cards */}
                <div className="space-y-6 mb-12">
                  <div className="border-l-4 border-gray-900 pl-6 py-4">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 border-2 border-gray-900 flex items-center justify-center flex-shrink-0">
                        <MapPin className="w-6 h-6" />
                      </div>
                      <div>
                        <h3 className="text-sm font-bold uppercase tracking-wider text-gray-600 mb-2">
                          Location
                        </h3>
                        <p className="text-lg text-gray-900 font-medium">
                          Flytium Drones
                          <br />
                          H. N0 - 49C Near Paidleganj,Gorakhpur, Uttar Pradesh
                          <br />
                          India
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="border-l-4 border-gray-900 pl-6 py-4">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 border-2 border-gray-900 flex items-center justify-center flex-shrink-0">
                        <Phone className="w-6 h-6" />
                      </div>
                      <div>
                        <h3 className="text-sm font-bold uppercase tracking-wider text-gray-600 mb-2">
                          Phone
                        </h3>
                        <p className="text-lg text-gray-900 font-medium">
                          +91 9236993440
                        </p>
                        <p className="text-sm text-gray-600 mt-1">
                          Mon-Sat: 9AM - 6PM
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="border-l-4 border-gray-900 pl-6 py-4">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 border-2 border-gray-900 flex items-center justify-center flex-shrink-0">
                        <Mail className="w-6 h-6" />
                      </div>
                      <div>
                        <h3 className="text-sm font-bold uppercase tracking-wider text-gray-600 mb-2">
                          Email
                        </h3>
                        <p className="text-lg text-gray-900 font-medium">
                          ankit@flytiumdrones.com
                        </p>
                        <p className="text-sm text-gray-600 mt-1">
                          We'll respond within 24 hours
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Map */}
                <div className="border-2 border-gray-900">
                  <iframe
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3563.0815815664944!2d83.41458207548!3d26.747363576878!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x39914485e61aef37%3A0xa6b9a2dcb469be46!2sMadan%20Mohan%20Malaviya%20University%20of%20Technology!5e0!3m2!1sen!2sin!4v1730285000000!5m2!1sen!2sin"
                    className="w-full h-80"
                    allowFullScreen=""
                    loading="lazy"
                    title="Flytium Drones Location"
                  ></iframe>
                </div>
              </div>

              {/* Right: Contact Form */}
              <div className="border-2 border-gray-900 p-8 lg:p-12 h-fit sticky top-24">
                {isSuccess ? (
                  <div className="text-center py-12">
                    <div className="w-20 h-20 bg-emerald-600 text-white mx-auto mb-6 flex items-center justify-center">
                      <Check className="w-10 h-10" />
                    </div>
                    <h3 className="text-2xl font-black text-gray-900 mb-4">
                      Message Sent!
                    </h3>
                    <p className="text-gray-600">
                      We've received your message and will get back to you soon.
                    </p>
                  </div>
                ) : (
                  <>
                    <h2 className="text-3xl font-black text-gray-900 mb-8">
                      Send a Message
                    </h2>

                    <form onSubmit={handleSubmit} className="space-y-6">
                      <div>
                        <label
                          htmlFor="name"
                          className="block text-sm font-bold uppercase tracking-wider text-gray-600 mb-2"
                        >
                          Name
                        </label>
                        <input
                          type="text"
                          id="name"
                          name="name"
                          value={formData.name}
                          onChange={handleChange}
                          required
                          className="w-full px-4 py-3 border-2 border-gray-300 focus:border-gray-900 focus:outline-none transition-colors"
                          placeholder="Your name"
                        />
                      </div>

                      <div>
                        <label
                          htmlFor="email"
                          className="block text-sm font-bold uppercase tracking-wider text-gray-600 mb-2"
                        >
                          Email
                        </label>
                        <input
                          type="email"
                          id="email"
                          name="email"
                          value={formData.email}
                          onChange={handleChange}
                          required
                          className="w-full px-4 py-3 border-2 border-gray-300 focus:border-gray-900 focus:outline-none transition-colors"
                          placeholder="your@email.com"
                        />
                      </div>

                      <div>
                        <label
                          htmlFor="phone"
                          className="block text-sm font-bold uppercase tracking-wider text-gray-600 mb-2"
                        >
                          Phone
                        </label>
                        <input
                          type="tel"
                          id="phone"
                          name="phone"
                          value={formData.phone}
                          onChange={handleChange}
                          required
                          className="w-full px-4 py-3 border-2 border-gray-300 focus:border-gray-900 focus:outline-none transition-colors"
                          placeholder="+91 XXXXX XXXXX"
                        />
                      </div>

                      <div>
                        <label
                          htmlFor="message"
                          className="block text-sm font-bold uppercase tracking-wider text-gray-600 mb-2"
                        >
                          Message
                        </label>
                        <textarea
                          id="message"
                          name="message"
                          value={formData.message}
                          onChange={handleChange}
                          required
                          rows="5"
                          className="w-full px-4 py-3 border-2 border-gray-300 focus:border-gray-900 focus:outline-none transition-colors resize-none"
                          placeholder="Your message..."
                        ></textarea>
                      </div>

                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full group relative px-8 py-5 bg-gray-900 text-white font-bold overflow-hidden disabled:opacity-50"
                      >
                        <span className="relative z-10 flex items-center justify-center gap-3">
                          {isSubmitting ? (
                            <>
                              <div className="w-5 h-5 border-2 border-white border-t-transparent animate-spin"></div>
                              Sending...
                            </>
                          ) : (
                            <>
                              Send Message
                              <Send className="w-5 h-5 transition-transform group-hover:translate-x-2" />
                            </>
                          )}
                        </span>
                        {!isSubmitting && (
                          <div className="absolute inset-0 bg-gradient-to-r from-emerald-600 via-blue-600 to-purple-600 translate-x-[-100%] group-hover:translate-x-0 transition-transform duration-500"></div>
                        )}
                      </button>
                    </form>
                  </>
                )}
              </div>
            </div>
          </div>
        </section>
      </div>
    </>
  );
};

export default Contact;
