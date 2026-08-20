import React, { useState, useEffect, useRef } from "react";
import Layout from "../../components/Layout/Layout";
import AdminMenu from "../../components/Layout/AdminMenu";
import axios from "axios";
import toast from "react-hot-toast";
import { API_URL } from "../../api";
import { useAuth } from "../../Context/auth";
import { Search, Plus, Trash2, FileText, UploadCloud, CheckCircle, Award, Download, Cpu } from "lucide-react";
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';
import CertificateTemplate from './CertificateTemplate';

const ManageCertificates = () => {
  const [certificates, setCertificates] = useState([]);
  const [formData, setFormData] = useState({
    certificateId: "",
    studentName: "",
    rollNo: "",
    courseName: "",
    college: "",
    duration: "",
    startDate: "",
    endDate: "",
    issueDate: "",
  });
  const [isGenerating, setIsGenerating] = useState(false);
  
  const { auth } = useAuth();
  const certificateRef = useRef(null);

  // Get all certificates
  const getAllCertificates = async () => {
    try {
      const { data } = await axios.get(`${API_URL}/api/certificate/get-all`, {
        headers: { Authorization: `Bearer ${auth?.token}` }
      });
      if (data.success) {
        setCertificates(data.certificates);
      }
    } catch (error) {
      console.log(error);
      toast.error("Something went wrong in getting certificates");
    }
  };

  useEffect(() => {
    if (auth?.token) {
      getAllCertificates();
    }
  }, [auth?.token]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Handle form submission and generation
  const handleGenerateAndSubmit = async (e) => {
    e.preventDefault();
    
    // Quick validation
    const requiredFields = ['certificateId', 'studentName', 'rollNo', 'courseName', 'college', 'duration', 'startDate', 'endDate', 'issueDate'];
    for (const field of requiredFields) {
      if (!formData[field]) {
        toast.error(`Please fill out ${field.replace(/([A-Z])/g, ' $1').toLowerCase()}`);
        return;
      }
    }

    try {
      setIsGenerating(true);
      toast.loading("Generating PDF...", { id: "generate" });

      const element = certificateRef.current;
      const canvas = await html2canvas(element, { 
        scale: 2, 
        useCORS: true,
        logging: false
      });
      const imgData = canvas.toDataURL('image/png');
      
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
      
      const pdfBlob = pdf.output('blob');
      
      toast.loading("Uploading to cloud...", { id: "generate" });
      const cloudinaryFormData = new FormData();
      cloudinaryFormData.append("file", pdfBlob, `${formData.certificateId}.pdf`);
      cloudinaryFormData.append("upload_preset", "flytium");
      cloudinaryFormData.append("cloud_name", "dhkpwi9ga");

      const uploadRes = await fetch("https://api.cloudinary.com/v1_1/dhkpwi9ga/auto/upload", {
        method: "POST",
        body: cloudinaryFormData,
      });
      
      const uploadData = await uploadRes.json();
      const pdfUrl = uploadData.secure_url;
      
      toast.loading("Saving to database...", { id: "generate" });
      const { data } = await axios.post(`${API_URL}/api/certificate/create`, {
        ...formData,
        pdfUrl
      }, {
        headers: { Authorization: `Bearer ${auth?.token}` }
      });
      
      if (data?.success) {
        toast.success(`Certificate ${formData.certificateId} created successfully!`, { id: "generate" });
        getAllCertificates();
        // Clear form
        setFormData({
          certificateId: "",
          studentName: "",
          rollNo: "",
          courseName: "",
          college: "",
          duration: "",
          startDate: "",
          endDate: "",
          issueDate: "",
        });
      } else {
        toast.error(data.message, { id: "generate" });
      }
    } catch (error) {
      console.log(error);
      toast.error(error.response?.data?.message || "Failed to generate certificate", { id: "generate" });
    } finally {
      setIsGenerating(false);
    }
  };

  // Delete certificate
  const handleDelete = async (id) => {
    try {
      let answer = window.prompt("Are you sure you want to delete this certificate? Type 'yes' to confirm");
      if (answer !== "yes") return;
      
      const { data } = await axios.delete(`${API_URL}/api/certificate/delete/${id}`, {
        headers: { Authorization: `Bearer ${auth?.token}` }
      });
      if (data.success) {
        toast.success("Certificate deleted successfully");
        getAllCertificates();
      }
    } catch (error) {
      console.log(error);
      toast.error("Something went wrong in deleting certificate");
    }
  };

  return (
    <Layout title={"Dashboard - Manage Certificates"}>
      <div className="bg-slate-900 min-h-screen text-slate-300 flex">
        <div className="w-1/4">
          <AdminMenu />
        </div>
        <div className="w-3/4 p-8">
          
          <div className="flex items-center justify-between mb-8 border-b border-slate-800 pb-4">
            <h1 className="text-3xl font-black text-white flex items-center">
              <FileText className="mr-3 text-indigo-500 w-8 h-8" /> 
              Manage Certificates
            </h1>
            <span className="bg-indigo-600/20 text-indigo-400 px-4 py-1.5 rounded-full text-sm font-bold border border-indigo-500/30">
              Total: {certificates.length}
            </span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* Create Form */}
            <div className="lg:col-span-1">
              <div className="bg-slate-950 rounded-xl border border-slate-800 p-6 sticky top-28 shadow-xl max-h-[85vh] overflow-y-auto custom-scrollbar">
                <h2 className="text-xl font-bold text-white mb-6 flex items-center sticky top-0 bg-slate-950 py-2 z-10 border-b border-slate-800">
                  <Cpu className="mr-2 w-5 h-5 text-emerald-400" />
                  Certificate Generator
                </h2>

                <form onSubmit={handleGenerateAndSubmit} className="space-y-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-400 mb-1">Certificate ID *</label>
                    <input type="text" name="certificateId"
                      className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-white focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                      placeholder="e.g. FD26006" value={formData.certificateId} onChange={handleChange} required />
                  </div>
                  
                  <div>
                    <label className="block text-xs font-semibold text-slate-400 mb-1">Student Name *</label>
                    <input type="text" name="studentName"
                      className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-white focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                      placeholder="e.g. Prakhar Tiwari" value={formData.studentName} onChange={handleChange} required />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-400 mb-1">Roll Number *</label>
                    <input type="text" name="rollNo"
                      className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-white focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                      placeholder="e.g. 2024041338" value={formData.rollNo} onChange={handleChange} required />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-400 mb-1">College/University *</label>
                    <input type="text" name="college"
                      className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-white focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                      placeholder="e.g. Madan Mohan Malaviya University Of Technology" value={formData.college} onChange={handleChange} required />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-400 mb-1">Course Details *</label>
                    <input type="text" name="courseName"
                      className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-white focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                      placeholder="e.g. Electronics and communication (IOT), Btech 2nd yr" value={formData.courseName} onChange={handleChange} required />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-400 mb-1">Duration Text *</label>
                    <input type="text" name="duration"
                      className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-white focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                      placeholder="e.g. Six-week" value={formData.duration} onChange={handleChange} required />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-slate-400 mb-1">Start Date *</label>
                      <input type="date" name="startDate"
                        className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-white focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 [color-scheme:dark]"
                        value={formData.startDate} onChange={handleChange} required />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-400 mb-1">End Date *</label>
                      <input type="date" name="endDate"
                        className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-white focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 [color-scheme:dark]"
                        value={formData.endDate} onChange={handleChange} required />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-400 mb-1">Issue Date *</label>
                    <input type="date" name="issueDate"
                      className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-white focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 [color-scheme:dark]"
                      value={formData.issueDate} onChange={handleChange} required />
                  </div>
                  
                  <button 
                    type="submit" 
                    disabled={isGenerating}
                    className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold py-3 px-4 rounded-lg transition-all transform hover:-translate-y-0.5 active:translate-y-0 shadow-lg shadow-emerald-500/25 flex justify-center items-center mt-6 disabled:opacity-70 disabled:cursor-not-allowed"
                  >
                    {isGenerating ? "GENERATING & SAVING..." : "GENERATE CERTIFICATE"}
                  </button>
                </form>
              </div>
            </div>

            {/* List Table */}
            <div className="lg:col-span-2">
              <div className="bg-slate-950 rounded-xl border border-slate-800 overflow-hidden shadow-xl">
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-slate-900/50 border-b border-slate-800">
                        <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Details</th>
                        <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Date</th>
                        <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Document</th>
                        <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800">
                      {certificates?.map((c) => (
                        <tr key={c._id} className="hover:bg-slate-900/30 transition-colors">
                          <td className="px-6 py-4">
                            <div className="flex flex-col">
                              <span className="text-white font-bold">{c.studentName}</span>
                              <span className="text-emerald-400 text-sm font-medium">{c.certificateId}</span>
                              <span className="text-slate-500 text-xs mt-1">{c.courseName}</span>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-300">
                            {new Date(c.issueDate).toLocaleDateString('en-US', {
                              year: 'numeric', month: 'short', day: 'numeric'
                            })}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex space-x-2">
                              <a 
                                href={c.pdfUrl.replace('.pdf', '.jpg')} 
                                target="_blank" 
                                rel="noopener noreferrer" 
                                className="inline-flex items-center px-3 py-1.5 bg-blue-500/10 text-blue-400 rounded-md text-sm font-medium hover:bg-blue-500/20 transition-colors"
                              >
                                <FileText className="w-4 h-4 mr-1.5" />
                                View
                              </a>
                              <a 
                                href={c.pdfUrl.replace('/upload/', '/upload/fl_attachment/').replace('.pdf', '.jpg')} 
                                download
                                className="inline-flex items-center px-3 py-1.5 bg-green-500/10 text-green-400 rounded-md text-sm font-medium hover:bg-green-500/20 transition-colors"
                              >
                                <Download className="w-4 h-4 mr-1.5" />
                                Download
                              </a>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-right">
                            <button
                              className="inline-flex items-center justify-center p-2 bg-red-500/10 text-red-400 rounded-lg hover:bg-red-500 hover:text-white transition-all"
                              onClick={() => handleDelete(c._id)}
                              title="Delete Certificate"
                            >
                              <Trash2 className="w-5 h-5" />
                            </button>
                          </td>
                        </tr>
                      ))}
                      
                      {certificates.length === 0 && (
                        <tr>
                          <td colSpan="4" className="px-6 py-12 text-center text-slate-500">
                            <div className="flex flex-col items-center justify-center">
                              <Award className="w-12 h-12 text-slate-700 mb-3" />
                              <p className="text-lg font-medium text-slate-400">No certificates found</p>
                              <p className="text-sm">Create your first certificate using the generator.</p>
                            </div>
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
      
      {/* Hidden Certificate Template for PDF Generation */}
      <div style={{ position: 'absolute', left: '-9999px', top: '-9999px' }}>
        <CertificateTemplate ref={certificateRef} data={formData} />
      </div>
      
    </Layout>
  );
};

export default ManageCertificates;
