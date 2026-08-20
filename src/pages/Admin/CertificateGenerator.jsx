import React, { useState, useRef } from "react";
import Layout from "../../components/Layout/Layout";
import AdminMenu from "../../components/Layout/AdminMenu";
import axios from "axios";
import toast from "react-hot-toast";
import { API_URL } from "../../api";
import { useAuth } from "../../Context/auth";
import { Cpu, Image as ImageIcon } from "lucide-react";
import CertificateTemplate from './CertificateTemplate';

const CertificateGenerator = () => {
  const [formData, setFormData] = useState({
    certificateId: "",
    studentName: "",
    rollNo: "",
    year: "",
    courseName: "",
    college: "",
    duration: "",
    startDate: "",
    endDate: "",
    issueDate: "",
  });
  const [isGenerating, setIsGenerating] = useState(false);
  const [sampleImage, setSampleImage] = useState(null);
  
  const { auth } = useAuth();
  const certificateRef = useRef(null);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSampleUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setSampleImage(url);
    }
  };

  const handleGenerateAndSubmit = async (e) => {
    e.preventDefault();
    
    const requiredFields = ['certificateId', 'studentName', 'courseName', 'college', 'duration', 'startDate', 'endDate', 'issueDate'];
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
      const imgData = canvas.toDataURL('image/jpeg', 0.8);
      
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
      pdf.addImage(imgData, 'JPEG', 0, 0, pdfWidth, pdfHeight);
      
      const pdfBlob = pdf.output('blob');
      const pdfFile = new File([pdfBlob], `${formData.certificateId}.pdf`, { type: 'application/pdf' });
      
      toast.loading("Uploading to cloud...", { id: "generate" });
      const cloudinaryFormData = new FormData();
      cloudinaryFormData.append("file", pdfFile);
      cloudinaryFormData.append("upload_preset", "flytium");
      cloudinaryFormData.append("cloud_name", "dhkpwi9ga");

      const uploadRes = await fetch("https://api.cloudinary.com/v1_1/dhkpwi9ga/auto/upload", {
        method: "POST",
        body: cloudinaryFormData,
      });
      
      const uploadData = await uploadRes.json();
      const pdfUrl = uploadData.secure_url;
      
      if (!pdfUrl) {
        console.error("Cloudinary error:", uploadData);
        throw new Error(uploadData.error?.message || "Cloudinary upload failed");
      }

      toast.loading("Saving to database...", { id: "generate" });
      const { data } = await axios.post(`${API_URL}/api/certificate/create`, {
        ...formData,
        pdfUrl: pdfUrl,
        pdf: pdfUrl
      }, {
        headers: { Authorization: `Bearer ${auth?.token}` }
      });
      
      if (data?.success) {
        toast.success(`Certificate ${formData.certificateId} created successfully!`, { id: "generate" });
        setFormData({
          certificateId: "",
          studentName: "",
          rollNo: "",
          year: "",
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
      const errorMsg = error.response?.data?.message || error.message || "Failed to generate certificate";
      toast.error(errorMsg, { id: "generate" });
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <Layout title={"Dashboard - Certificate Generator"}>
      <div className="bg-slate-900 min-h-screen text-slate-300 flex">
        <div className="w-[20%] xl:w-1/5 shrink-0">
          <AdminMenu />
        </div>
        
        {/* Main Content Area */}
        <div className="w-[80%] xl:w-4/5 p-6 flex flex-col h-screen overflow-hidden">
          
          <div className="flex items-center justify-between mb-4 border-b border-slate-800 pb-4 shrink-0">
            <h1 className="text-2xl font-black text-white flex items-center">
              <Cpu className="mr-3 text-emerald-500 w-8 h-8" /> 
              Certificate Generator
            </h1>
          </div>

          {/* Form and Preview Split */}
          <div className="flex flex-col lg:flex-row gap-6 flex-1 overflow-hidden">
            
            {/* Form Column */}
            <div className="lg:w-1/2 bg-slate-950 rounded-xl border border-slate-800 p-6 shadow-xl overflow-y-auto custom-scrollbar">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-lg font-bold text-white flex items-center">
                  <span className="bg-indigo-500/20 text-indigo-400 p-1.5 rounded-lg mr-2">1</span>
                  Enter Details
                </h2>
                
                <label className="cursor-pointer bg-slate-800 hover:bg-slate-700 text-slate-300 px-3 py-1.5 rounded-md text-xs font-semibold flex items-center transition-colors">
                  <ImageIcon className="w-4 h-4 mr-1.5" />
                  Load Sample
                  <input type="file" accept="image/*" onChange={handleSampleUpload} className="hidden" />
                </label>
              </div>

              {/* Sample Viewer */}
              {sampleImage && (
                <div className="mb-6 border border-slate-700 rounded-lg p-2 bg-slate-900 relative">
                  <button 
                    onClick={() => setSampleImage(null)}
                    className="absolute top-4 right-4 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs shadow-lg"
                  >
                    ✕
                  </button>
                  <p className="text-xs text-slate-400 mb-2 font-semibold">Reference Sample Image:</p>
                  <img src={sampleImage} alt="Sample" className="w-full rounded border border-slate-800" />
                </div>
              )}
              
              <form onSubmit={handleGenerateAndSubmit} className="space-y-5">
                <div className="grid grid-cols-1 gap-5">
                  <div>
                    <label className="block text-xs font-semibold text-slate-400 mb-1.5">Certificate ID *</label>
                    <input type="text" name="certificateId"
                      className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2.5 text-white focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 text-sm"
                      placeholder="e.g. FD26011" value={formData.certificateId} onChange={handleChange} required />
                  </div>
                  
                  <div>
                    <label className="block text-xs font-semibold text-slate-400 mb-1.5">Student Name *</label>
                    <input type="text" name="studentName"
                      className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2.5 text-white focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 text-sm"
                      placeholder="e.g. Sunny Choudhary" value={formData.studentName} onChange={handleChange} required />
                  </div>
  
                  <div>
                    <label className="block text-xs font-semibold text-slate-400 mb-1.5">Roll Number</label>
                    <input type="text" name="rollNo"
                      className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2.5 text-white focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 text-sm"
                      placeholder="e.g. 2024041338 (Optional)" value={formData.rollNo} onChange={handleChange} />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-400 mb-1.5">Year / Semester</label>
                    <input type="text" name="year"
                      className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2.5 text-white focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 text-sm"
                      placeholder="e.g. 2nd Year (Optional)" value={formData.year} onChange={handleChange} />
                  </div>
  
                  <div>
                    <label className="block text-xs font-semibold text-slate-400 mb-1.5">College / University *</label>
                    <input type="text" name="college"
                      className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2.5 text-white focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 text-sm"
                      placeholder="e.g. Shri Ramswaroop Memorial College..." value={formData.college} onChange={handleChange} required />
                  </div>
  
                  <div>
                    <label className="block text-xs font-semibold text-slate-400 mb-1.5">Branch / Course Details *</label>
                    <input type="text" name="courseName"
                      className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2.5 text-white focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 text-sm"
                      placeholder="e.g. Computer Science and Engineering" value={formData.courseName} onChange={handleChange} required />
                  </div>
  
                  <div>
                    <label className="block text-xs font-semibold text-slate-400 mb-1.5">Team / Department Name *</label>
                    <input type="text" name="duration"
                      className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2.5 text-white focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 text-sm"
                      placeholder="e.g. Artificial Intelligence & Machine Learning" value={formData.duration} onChange={handleChange} required />
                  </div>
  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-400 mb-1.5">Start Date *</label>
                      <input type="date" name="startDate"
                        className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2.5 text-white focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 [color-scheme:dark] text-sm"
                        value={formData.startDate} onChange={handleChange} required />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-400 mb-1.5">End Date *</label>
                      <input type="date" name="endDate"
                        className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2.5 text-white focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 [color-scheme:dark] text-sm"
                        value={formData.endDate} onChange={handleChange} required />
                    </div>
                  </div>
  
                  <div>
                    <label className="block text-xs font-semibold text-slate-400 mb-1.5">Issue Date *</label>
                    <input type="date" name="issueDate"
                      className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2.5 text-white focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 [color-scheme:dark] text-sm"
                      value={formData.issueDate} onChange={handleChange} required />
                  </div>
                </div>
                
                <button 
                  type="submit" 
                  disabled={isGenerating}
                  className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold py-3.5 px-4 rounded-lg transition-all transform hover:-translate-y-0.5 active:translate-y-0 shadow-lg shadow-emerald-500/25 flex justify-center items-center mt-6 disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  {isGenerating ? "GENERATING & SAVING..." : "GENERATE CERTIFICATE"}
                </button>
              </form>
            </div>

            {/* Live Preview Column */}
            <div className="lg:w-1/2 flex flex-col bg-slate-950 rounded-xl border border-slate-800 p-6 shadow-xl">
              <h2 className="text-lg font-bold text-white mb-4 flex items-center shrink-0">
                <span className="bg-emerald-500/20 text-emerald-400 p-1.5 rounded-lg mr-2">2</span>
                Live Preview
              </h2>
              
              {/* Scaled Preview Container */}
              <div className="flex-1 w-full bg-slate-900 rounded-lg border border-slate-700 flex items-center justify-center overflow-hidden">
                <div 
                  className="relative origin-center bg-white shadow-2xl"
                  style={{
                    width: '800px',
                    height: '1131px',
                    transform: 'scale(0.45)', // scale down to fit pane
                  }}
                >
                  <CertificateTemplate data={formData} />
                </div>
              </div>
              <p className="text-center text-xs text-slate-500 mt-4 shrink-0">
                This is a live preview. The downloaded PDF will be in high resolution.
              </p>
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

export default CertificateGenerator;
