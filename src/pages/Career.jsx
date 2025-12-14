import React, { useState, useEffect } from "react";
import {
  Briefcase,
  MapPin,
  Clock,
  Calendar,
  User,
  Mail,
  Phone,
  Send,
  X,
} from "lucide-react";
import axios from "axios";
import { API_URL } from "../api";
import Layout from "../components/Layout/Layout";
import EmployeeCard from "../components/EmployeeCard";
import Spinner from "../components/Spinner";
import toast from "react-hot-toast";
import { motion } from "framer-motion";

const Career = () => {
  const [employees, setEmployees] = useState([]);
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [jobsLoading, setJobsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("current");
  const [showApplicationModal, setShowApplicationModal] = useState(false);
  const [selectedJob, setSelectedJob] = useState(null);
  const [applicationData, setApplicationData] = useState({
    applicantName: "",
    email: "",
    phone: "",
    description: "",
  });

  const fetchEmployees = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        `${API_URL}/api/employee/get-employees?isActive=true&status=current,past`
      );
      if (response.data.success) {
        setEmployees(response.data.employees);
      }
    } catch (error) {
      console.error("Error fetching employees:", error);
      toast.error("Failed to fetch employees");
    } finally {
      setLoading(false);
    }
  };

  const fetchJobs = async () => {
    try {
      setJobsLoading(true);
      const response = await axios.get(
        `${API_URL}/api/job/get-jobs?isActive=true`
      );
      if (response.data.success) {
        setJobs(response.data.jobs);
      }
    } catch (error) {
      console.error("Error fetching jobs:", error);
      toast.error("Failed to fetch job openings");
    } finally {
      setJobsLoading(false);
    }
  };

  useEffect(() => {
    fetchEmployees();
    fetchJobs();
  }, []);

  const filteredEmployees = employees.filter(
    (employee) => employee.status === activeTab
  );

  const tabs = [
    {
      key: "current",
      label: "Current Team",
      count: employees.filter((e) => e.status === "current").length,
    },
    {
      key: "past",
      label: "Past Members",
      count: employees.filter((e) => e.status === "past").length,
    },
  ];

  const handleApply = (job) => {
    setSelectedJob(job);
    setApplicationData({
      applicantName: "",
      email: "",
      phone: "",
      description: "",
    });
    setShowApplicationModal(true);
  };

  const handleApplicationSubmit = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.post(`${API_URL}/api/job/apply`, {
        jobId: selectedJob._id,
        ...applicationData,
        position: selectedJob.title,
      });

      if (data?.success) {
        toast.success("Application submitted successfully!");
        setShowApplicationModal(false);
        setSelectedJob(null);
        setApplicationData({
          applicantName: "",
          email: "",
          phone: "",
          description: "",
        });
      } else {
        toast.error(data?.message);
      }
    } catch (error) {
      console.log(error);
      toast.error("Something went wrong while submitting application");
    }
  };

  const handleInputChange = (e) => {
    setApplicationData({
      ...applicationData,
      [e.target.name]: e.target.value,
    });
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  if (loading) {
    return (
      <Layout>
        <div className="min-h-screen flex items-center justify-center">
          <Spinner />
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="min-h-screen bg-white">
        {/* Hero */}
        <section className="pt-8 pb-8 border-b-2 border-gray-900">
          <div className="max-w-7xl mx-auto px-6">
            <motion.div
              initial={{ opacity: 0, width: 0 }}
              animate={{ opacity: 1, width: "auto" }}
              transition={{ duration: 0.8 }}
              className="w-20 h-1 bg-gradient-to-r from-emerald-600 to-blue-600 mb-4"
            ></motion.div>
            <motion.h1
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              whileInView={{ opacity: 1, scale: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.1 }}
              className="text-6xl lg:text-7xl font-black text-gray-900 leading-tight mb-6"
            >
              Join the Team
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-xl text-gray-600 max-w-2xl"
            >
              Build the future of drone technology with us. Explore
              opportunities and meet the people behind FlightDrone.
            </motion.p>
          </div>
        </section>

        {/* Job Openings */}
        <section className="py-16 border-b-2 border-gray-900">
          <div className="max-w-7xl mx-auto px-6">
            <div className="flex items-center justify-between mb-12">
              <motion.h2
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                whileInView={{ opacity: 1, scale: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.7 }}
                className="text-4xl font-black text-gray-900"
              >
                Open Positions
              </motion.h2>
              {jobs.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6 }}
                  className="flex items-center gap-2 border-2 border-gray-900 px-4 py-2"
                >
                  <Briefcase className="w-5 h-5" />
                  <span className="font-bold">
                    {jobs.length} {jobs.length === 1 ? "Opening" : "Openings"}
                  </span>
                </motion.div>
              )}
            </div>

            {jobsLoading ? (
              <div className="flex items-center justify-center py-20">
                <Spinner />
              </div>
            ) : jobs.length > 0 ? (
              <div className="space-y-6">
                {jobs.map((job, index) => (
                  <motion.div
                    key={job._id}
                    initial={{ opacity: 0, scale: 0.98, y: 20 }}
                    whileInView={{ opacity: 1, scale: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: index * 0.05 }}
                    className="border-2 border-gray-900 p-8 hover:bg-gray-50 transition-colors group"
                  >
                    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
                      <div className="flex-1">
                        <motion.h3
                          initial={{ opacity: 0, y: 10 }}
                          whileInView={{ opacity: 1, y: 0 }}
                          viewport={{ once: true }}
                          transition={{ duration: 0.45 }}
                          className="text-2xl font-black text-gray-900 mb-4"
                        >
                          {job.title}
                        </motion.h3>

                        <div className="flex flex-wrap gap-3 mb-4">
                          <motion.div
                            initial={{ opacity: 0, y: 8 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.35, delay: 0.05 }}
                            className="flex items-center gap-2 text-sm text-gray-600"
                          >
                            <MapPin className="w-4 h-4" />
                            <span>{job.location}</span>
                          </motion.div>
                          <motion.div
                            initial={{ opacity: 0, y: 8 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.35, delay: 0.08 }}
                            className="flex items-center gap-2 text-sm text-gray-600"
                          >
                            <Briefcase className="w-4 h-4" />
                            <span>{job.jobType}</span>
                          </motion.div>
                          <motion.div
                            initial={{ opacity: 0, y: 8 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.35, delay: 0.11 }}
                            className="flex items-center gap-2 text-sm text-gray-600"
                          >
                            <Clock className="w-4 h-4" />
                            <span>{job.experience}</span>
                          </motion.div>
                          {job.applicationDeadline && (
                            <motion.div
                              initial={{ opacity: 0, y: 8 }}
                              whileInView={{ opacity: 1, y: 0 }}
                              viewport={{ once: true }}
                              transition={{ duration: 0.35, delay: 0.12 }}
                              className="flex items-center gap-2 text-sm text-gray-600"
                            >
                              <Calendar className="w-4 h-4" />
                              <span>
                                Apply by {formatDate(job.applicationDeadline)}
                              </span>
                            </motion.div>
                          )}
                        </div>

                        <p className="text-gray-600 mb-4 line-clamp-2">
                          {job.description}
                        </p>

                        {job.salary && (
                          <p className="text-lg font-bold text-gray-900">
                            {job.salary}
                          </p>
                        )}
                      </div>

                      <button
                        onClick={() => handleApply(job)}
                        className="group/btn relative px-8 py-4 bg-gray-900 text-white font-bold overflow-hidden flex-shrink-0"
                      >
                        <span className="relative z-10 flex items-center gap-2">
                          Apply Now
                          <Send className="w-4 h-4 transition-transform group-hover/btn:translate-x-2" />
                        </span>
                        <div className="absolute inset-0 bg-gradient-to-r from-emerald-600 via-blue-600 to-purple-600 translate-x-[-100%] group-hover/btn:translate-x-0 transition-transform duration-500"></div>
                      </button>
                    </div>
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className="border-2 border-gray-900 p-16 text-center">
                <Briefcase className="w-16 h-16 mx-auto mb-6 text-gray-400" />
                <h3 className="text-2xl font-black text-gray-900 mb-4">
                  No Open Positions
                </h3>
                <p className="text-gray-600 max-w-md mx-auto">
                  We don't have any openings at the moment, but we're always
                  looking for talented people. Check back soon!
                </p>
              </div>
            )}
          </div>
        </section>

        {/* Team Section */}
        <section className="py-16">
          <div className="max-w-7xl mx-auto px-6">
            <div className="mb-12">
              <h2 className="text-4xl font-black text-gray-900 mb-6">
                Meet Our Team
              </h2>

              {/* Tab Navigation */}
              <div className="flex gap-4 border-b-2 border-gray-900">
                {tabs.map((tab) => (
                  <button
                    key={tab.key}
                    onClick={() => setActiveTab(tab.key)}
                    className={`px-6 py-3 font-bold transition-all relative ${
                      activeTab === tab.key
                        ? "text-gray-900"
                        : "text-gray-400 hover:text-gray-600"
                    }`}
                  >
                    {tab.label}
                    {tab.count > 0 && (
                      <span
                        className={`ml-2 px-2 py-1 text-xs font-bold ${
                          activeTab === tab.key
                            ? "bg-gray-900 text-white"
                            : "bg-gray-200 text-gray-600"
                        }`}
                      >
                        {tab.count}
                      </span>
                    )}
                    {activeTab === tab.key && (
                      <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-emerald-600 to-blue-600"></div>
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Employees Grid */}
            {filteredEmployees.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                {filteredEmployees.map((employee, index) => (
                  <EmployeeCard key={employee._id} employee={employee} />
                ))}
              </div>
            ) : (
              <div className="border-2 border-gray-900 p-16 text-center">
                <User className="w-16 h-16 mx-auto mb-6 text-gray-400" />
                <h3 className="text-2xl font-black text-gray-900 mb-4">
                  No {activeTab} team members
                </h3>
                <p className="text-gray-600">
                  Check back later for updates to our team.
                </p>
              </div>
            )}
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 bg-gray-900 text-white">
          <div className="max-w-4xl mx-auto px-6 text-center">
            <h2 className="text-4xl font-black mb-6 text-white">
              Ready to Make an Impact?
            </h2>
            <p className="text-xl text-gray-300 mb-8">
              {jobs.length > 0
                ? `We have ${jobs.length} open position${
                    jobs.length > 1 ? "s" : ""
                  } waiting for the right person. That could be you.`
                : "While we don't have open positions right now, we're always interested in connecting with talented people."}
            </p>
            <div className="w-32 h-1 bg-gradient-to-r from-emerald-600 via-blue-600 to-purple-600 mx-auto"></div>
          </div>
        </section>
      </div>

      {/* Application Modal */}
      {showApplicationModal && selectedJob && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
          <div className="bg-white border-2 border-gray-900 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="border-b-2 border-gray-900 p-6 flex items-center justify-between sticky top-0 bg-white">
              <div>
                <h3 className="text-2xl font-black text-gray-900 mb-2">
                  {selectedJob.title}
                </h3>
                <div className="flex gap-3 text-sm text-gray-600">
                  <span>{selectedJob.location}</span>
                  <span>•</span>
                  <span>{selectedJob.jobType}</span>
                </div>
              </div>
              <button
                onClick={() => setShowApplicationModal(false)}
                className="w-10 h-10 border-2 border-gray-900 flex items-center justify-center hover:bg-gray-900 hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <form onSubmit={handleApplicationSubmit} className="p-6 space-y-6">
              <div>
                <label className="block text-sm font-bold uppercase tracking-wider text-gray-600 mb-2">
                  Full Name *
                </label>
                <div className="relative">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    name="applicantName"
                    value={applicationData.applicantName}
                    onChange={handleInputChange}
                    className="w-full pl-12 pr-4 py-3 border-2 border-gray-300 focus:border-gray-900 focus:outline-none transition-colors"
                    placeholder="Your full name"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold uppercase tracking-wider text-gray-600 mb-2">
                  Email Address *
                </label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="email"
                    name="email"
                    value={applicationData.email}
                    onChange={handleInputChange}
                    className="w-full pl-12 pr-4 py-3 border-2 border-gray-300 focus:border-gray-900 focus:outline-none transition-colors"
                    placeholder="your@email.com"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold uppercase tracking-wider text-gray-600 mb-2">
                  Phone Number *
                </label>
                <div className="relative">
                  <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="tel"
                    name="phone"
                    value={applicationData.phone}
                    onChange={handleInputChange}
                    className="w-full pl-12 pr-4 py-3 border-2 border-gray-300 focus:border-gray-900 focus:outline-none transition-colors"
                    placeholder="+91 XXXXX XXXXX"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold uppercase tracking-wider text-gray-600 mb-2">
                  Position
                </label>
                <input
                  type="text"
                  value={selectedJob.title}
                  className="w-full px-4 py-3 border-2 border-gray-300 bg-gray-50"
                  disabled
                />
              </div>

              <div>
                <label className="block text-sm font-bold uppercase tracking-wider text-gray-600 mb-2">
                  Tell us about yourself *
                </label>
                <textarea
                  name="description"
                  value={applicationData.description}
                  onChange={handleInputChange}
                  rows={6}
                  className="w-full px-4 py-3 border-2 border-gray-300 focus:border-gray-900 focus:outline-none transition-colors resize-none"
                  placeholder="Describe your experience, skills, and why you're interested in this position..."
                  required
                />
              </div>

              <div className="flex gap-4 pt-4">
                <button
                  type="button"
                  onClick={() => setShowApplicationModal(false)}
                  className="flex-1 px-6 py-4 border-2 border-gray-900 text-gray-900 font-bold hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 group relative px-6 py-4 bg-gray-900 text-white font-bold overflow-hidden"
                >
                  <span className="relative z-10 flex items-center justify-center gap-2">
                    Submit Application
                    <Send className="w-4 h-4 transition-transform group-hover:translate-x-2" />
                  </span>
                  <div className="absolute inset-0 bg-gradient-to-r from-emerald-600 via-blue-600 to-purple-600 translate-x-[-100%] group-hover:translate-x-0 transition-transform duration-500"></div>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </Layout>
  );
};

export default Career;
