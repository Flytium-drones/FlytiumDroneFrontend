import React, { useState, useEffect } from "react";
import Layout from "../../components/Layout/Layout";
import AdminMenu from "../../components/Layout/AdminMenu";
import axios from "axios";
import toast from "react-hot-toast";
import { API_URL } from "../../api";
import { useAuth } from "../../Context/auth";
import { FileText, Trash2, Award, Download } from "lucide-react";

const ManageCertificates = () => {
  const [certificates, setCertificates] = useState([]);
  const { auth } = useAuth();

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
    </Layout>
  );
};

export default ManageCertificates;
