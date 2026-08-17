import React, { useState, useEffect } from "react";
import Layout from "../../components/Layout/Layout";
import AdminMenu from "../../components/Layout/AdminMenu";
import axios from "axios";
import toast from "react-hot-toast";
import { API_URL } from "../../api";
import { useAuth } from "../../Context/auth";
import { Search, Plus, Trash2, FileText, UploadCloud, CheckCircle, Award, Download } from "lucide-react";

const ManageCertificates = () => {
  const [certificates, setCertificates] = useState([]);
  const [certificateId, setCertificateId] = useState("");
  const [studentName, setStudentName] = useState("");
  const [courseName, setCourseName] = useState("");
  const [issueDate, setIssueDate] = useState("");
  const [pdfUrl, setPdfUrl] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const { auth } = useAuth();

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

  // Handle PDF Upload to Cloudinary
  const handlePdfUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.type !== "application/pdf") {
      toast.error("Please upload a PDF file");
      return;
    }

    try {
      setIsUploading(true);
      const formData = new FormData();
      formData.append("file", file);
      formData.append("upload_preset", "flytium");
      formData.append("cloud_name", "dhkpwi9ga");

      const response = await fetch(
        "https://api.cloudinary.com/v1_1/dhkpwi9ga/auto/upload",
        {
          method: "POST",
          body: formData,
        }
      );

      const data = await response.json();
      setPdfUrl(data.secure_url);
      toast.success("PDF uploaded successfully");
    } catch (error) {
      console.error("Error uploading PDF:", error);
      toast.error("Failed to upload PDF");
    } finally {
      setIsUploading(false);
    }
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!pdfUrl) {
      toast.error("Please upload the PDF certificate first");
      return;
    }

    try {
      setIsSubmitting(true);
      const { data } = await axios.post(`${API_URL}/api/certificate/create`, {
        certificateId,
        studentName,
        courseName,
        issueDate,
        pdfUrl
      }, {
        headers: { Authorization: `Bearer ${auth?.token}` }
      });
      
      if (data?.success) {
        toast.success(`Certificate ${certificateId} created`);
        getAllCertificates();
        // Clear form
        setCertificateId("");
        setStudentName("");
        setCourseName("");
        setIssueDate("");
        setPdfUrl("");
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.response?.data?.message || "Something went wrong");
    } finally {
      setIsSubmitting(false);
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
              <div className="bg-slate-950 rounded-xl border border-slate-800 p-6 sticky top-28 shadow-xl">
                <h2 className="text-xl font-bold text-white mb-6 flex items-center">
                  <Plus className="mr-2 w-5 h-5 text-emerald-400" />
                  Add New Certificate
                </h2>

                <form onSubmit={handleSubmit} className="space-y-5">
                  <div>
                    <label className="block text-sm font-semibold text-slate-400 mb-2">Certificate ID *</label>
                    <input
                      type="text"
                      className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-colors"
                      placeholder="e.g. FLY-2024-001"
                      value={certificateId}
                      onChange={(e) => setCertificateId(e.target.value)}
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-semibold text-slate-400 mb-2">Student Name *</label>
                    <input
                      type="text"
                      className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-colors"
                      placeholder="e.g. Rahul Sharma"
                      value={studentName}
                      onChange={(e) => setStudentName(e.target.value)}
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-slate-400 mb-2">Course Name *</label>
                    <input
                      type="text"
                      className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-colors"
                      placeholder="e.g. Advanced Drone Piloting"
                      value={courseName}
                      onChange={(e) => setCourseName(e.target.value)}
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-slate-400 mb-2">Issue Date *</label>
                    <input
                      type="date"
                      className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-colors [color-scheme:dark]"
                      value={issueDate}
                      onChange={(e) => setIssueDate(e.target.value)}
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-slate-400 mb-2">Upload PDF Document *</label>
                    <div className="relative">
                      <input
                        type="file"
                        accept=".pdf"
                        className="hidden"
                        id="pdf-upload"
                        onChange={handlePdfUpload}
                        disabled={isUploading}
                      />
                      <label 
                        htmlFor="pdf-upload" 
                        className={`flex items-center justify-center w-full px-4 py-3 rounded-lg border-2 border-dashed cursor-pointer transition-colors ${pdfUrl ? 'border-emerald-500/50 bg-emerald-500/5 hover:bg-emerald-500/10' : 'border-slate-700 hover:border-indigo-500 hover:bg-indigo-500/5'}`}
                      >
                        {isUploading ? (
                          <span className="flex items-center text-indigo-400">
                            <UploadCloud className="animate-bounce w-5 h-5 mr-2" />
                            Uploading...
                          </span>
                        ) : pdfUrl ? (
                          <span className="flex items-center text-emerald-400 font-medium">
                            <CheckCircle className="w-5 h-5 mr-2" />
                            PDF Ready
                          </span>
                        ) : (
                          <span className="flex items-center text-slate-400">
                            <UploadCloud className="w-5 h-5 mr-2" />
                            Select PDF File
                          </span>
                        )}
                      </label>
                    </div>
                  </div>
                  
                  <button 
                    type="submit" 
                    disabled={isUploading || isSubmitting}
                    className="w-full bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white font-bold py-3.5 px-4 rounded-lg transition-all transform hover:-translate-y-0.5 active:translate-y-0 shadow-lg shadow-indigo-500/25 flex justify-center items-center mt-6 disabled:opacity-70 disabled:cursor-not-allowed"
                  >
                    {isSubmitting ? "CREATING..." : "GENERATE CERTIFICATE"}
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
                              <p className="text-sm">Create your first certificate using the form.</p>
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
    </Layout>
  );
};

export default ManageCertificates;
