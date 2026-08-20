import React, { useState, useRef } from "react";
import Layout from "../../components/Layout/Layout";
import AdminMenu from "../../components/Layout/AdminMenu";
import axios from "axios";
import toast from "react-hot-toast";
import { API_URL } from "../../api";
import { useAuth } from "../../Context/auth";
import { Cpu } from "lucide-react";
import CertificateTemplate from './CertificateTemplate';

const CertificateGenerator = () => {
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

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleGenerateAndSubmit = async (e) => {
    e.preventDefault();
    
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

      const html2canvas = window.html2canvas;
      const { jsPDF } = window.jspdf;

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
      const pdfFile = new File([pdfBlob], `${formData.certificateId}.pdf`, { type: 'application/pdf' });
      
      toast.loading("Saving to database...", { id: "generate" });
      
      // Create FormData to send to backend which requires a 'pdf' file
      const submitData = new FormData();
      Object.keys(formData).forEach(key => {
        submitData.append(key, formData[key]);
      });
      submitData.append('pdf', pdfFile);

      const { data } = await axios.post(`${API_URL}/api/certificate/create`, submitData, {
        headers: { 
          Authorization: `Bearer ${auth?.token}`,
          'Content-Type': 'multipart/form-data'
        }
      });
      
      if (data?.success) {
        toast.success(`Certificate ${formData.certificateId} created successfully!`, { id: "generate" });
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

  return (
    <Layout title={"Dashboard - Certificate Generator"}>
      <div className="bg-slate-900 min-h-screen text-slate-300 flex">
        <div className="w-1/4">
          <AdminMenu />
        </div>
        <div className="w-3/4 p-8">
          
          <div className="flex items-center justify-between mb-8 border-b border-slate-800 pb-4">
            <h1 className="text-3xl font-black text-white flex items-center">
              <Cpu className="mr-3 text-emerald-500 w-8 h-8" /> 
              Certificate Generator
            </h1>
          </div>

          <div className="bg-slate-950 rounded-xl border border-slate-800 p-8 shadow-xl max-w-3xl mx-auto">
            <form onSubmit={handleGenerateAndSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-slate-400 mb-2">Certificate ID *</label>
                  <input type="text" name="certificateId"
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-3 text-white focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                    placeholder="e.g. FD26006" value={formData.certificateId} onChange={handleChange} required />
                </div>
                
                <div>
                  <label className="block text-sm font-semibold text-slate-400 mb-2">Student Name *</label>
                  <input type="text" name="studentName"
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-3 text-white focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                    placeholder="e.g. Prakhar Tiwari" value={formData.studentName} onChange={handleChange} required />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-400 mb-2">Roll Number *</label>
                  <input type="text" name="rollNo"
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-3 text-white focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                    placeholder="e.g. 2024041338" value={formData.rollNo} onChange={handleChange} required />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-400 mb-2">College/University *</label>
                  <input type="text" name="college"
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-3 text-white focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                    placeholder="e.g. Madan Mohan Malaviya University Of Technology" value={formData.college} onChange={handleChange} required />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-semibold text-slate-400 mb-2">Course Details *</label>
                  <input type="text" name="courseName"
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-3 text-white focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                    placeholder="e.g. Electronics and communication (IOT), Btech 2nd yr" value={formData.courseName} onChange={handleChange} required />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-semibold text-slate-400 mb-2">Duration Text *</label>
                  <input type="text" name="duration"
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-3 text-white focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                    placeholder="e.g. Six-week" value={formData.duration} onChange={handleChange} required />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-400 mb-2">Start Date *</label>
                  <input type="date" name="startDate"
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-3 text-white focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 [color-scheme:dark]"
                    value={formData.startDate} onChange={handleChange} required />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-400 mb-2">End Date *</label>
                  <input type="date" name="endDate"
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-3 text-white focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 [color-scheme:dark]"
                    value={formData.endDate} onChange={handleChange} required />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-400 mb-2">Issue Date *</label>
                  <input type="date" name="issueDate"
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-3 text-white focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 [color-scheme:dark]"
                    value={formData.issueDate} onChange={handleChange} required />
                </div>
              </div>
              
              <button 
                type="submit" 
                disabled={isGenerating}
                className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold py-4 px-4 rounded-lg transition-all transform hover:-translate-y-0.5 active:translate-y-0 shadow-lg shadow-emerald-500/25 flex justify-center items-center mt-8 disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {isGenerating ? "GENERATING & SAVING..." : "GENERATE CERTIFICATE"}
              </button>
            </form>
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

export default CertificateGenerator;
