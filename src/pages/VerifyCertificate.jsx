import React, { useState } from "react";
import Layout from "../components/Layout/Layout";
import axios from "axios";
import { API_URL } from "../api";
import { Search, Award, CheckCircle, XCircle, FileText, Download } from "lucide-react";
import toast from "react-hot-toast";

const VerifyCertificate = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [certificates, setCertificates] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  const handleVerify = async (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;

    try {
      setLoading(true);
      setError(false);
      setCertificates([]);
      
      const { data } = await axios.get(`${API_URL}/api/certificate/verify/${searchQuery.trim()}`);
      
      if (data?.success) {
        setCertificates(data.certificates);
        toast.success("Certificates Found successfully");
      }
    } catch (error) {
      console.log(error);
      setError(true);
      toast.error(error.response?.data?.message || "Certificate not found");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout title={"Verify Certificate - Flytium Drones"} description={"Verify your Flytium Drones training certificate"}>
      <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8 flex flex-col items-center">
        
        <div className="max-w-2xl w-full space-y-8">
          <div>
            <div className="mx-auto h-20 w-20 bg-blue-100 rounded-full flex items-center justify-center">
              <Award className="h-10 w-10 text-blue-600" />
            </div>
            <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
              Verify Certificate
            </h2>
            <p className="mt-2 text-center text-sm text-gray-600">
              Enter your Certificate ID or Name below to verify its authenticity
            </p>
          </div>

          <form className="mt-8 space-y-6" onSubmit={handleVerify}>
            <div className="flex rounded-md shadow-sm">
              <input
                type="text"
                required
                className="flex-1 min-w-0 block w-full px-4 py-4 rounded-none rounded-l-md border border-gray-300 focus:ring-blue-500 focus:border-blue-500 sm:text-lg"
                placeholder="Enter Certificate ID or Name (e.g. FLY-12345 or Rahul)"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <button
                type="submit"
                disabled={loading}
                className="inline-flex items-center px-6 py-4 border border-transparent text-base font-medium rounded-r-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-blue-400"
              >
                {loading ? "Verifying..." : (
                  <>
                    <Search className="h-5 w-5 mr-2" />
                    Verify
                  </>
                )}
              </button>
            </div>
          </form>

          {error && (
            <div className="mt-8 bg-red-50 border border-red-200 rounded-lg p-6 text-center">
              <XCircle className="mx-auto h-12 w-12 text-red-500 mb-4" />
              <h3 className="text-lg font-medium text-red-800">Certificate Not Found</h3>
              <p className="mt-2 text-sm text-red-600">
                The name or certificate ID you entered is invalid or does not exist in our records. Please check and try again.
              </p>
            </div>
          )}

          {certificates.length > 0 && (
            <div className="mt-8 space-y-6">
              <h3 className="text-xl font-bold text-gray-900 text-center">Found {certificates.length} Certificate(s)</h3>
              {certificates.map((cert) => (
                <div key={cert._id} className="bg-white border border-green-200 rounded-lg shadow-sm overflow-hidden">
                  <div className="bg-green-50 px-6 py-4 border-b border-green-200 flex items-center justify-between">
                    <div className="flex items-center">
                      <CheckCircle className="h-6 w-6 text-green-500 mr-2" />
                      <h3 className="text-lg font-medium text-green-800">Verified Authentic Certificate</h3>
                    </div>
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                      Valid
                    </span>
                  </div>
                  <div className="px-6 py-5 border-t border-gray-200">
                    <dl className="grid grid-cols-1 gap-x-4 gap-y-6 sm:grid-cols-2">
                      <div className="sm:col-span-1">
                        <dt className="text-sm font-medium text-gray-500">Student Name</dt>
                        <dd className="mt-1 text-lg font-semibold text-gray-900">{cert.studentName}</dd>
                      </div>
                      <div className="sm:col-span-1">
                        <dt className="text-sm font-medium text-gray-500">Certificate ID</dt>
                        <dd className="mt-1 text-lg font-semibold text-gray-900">{cert.certificateId}</dd>
                      </div>
                      <div className="sm:col-span-1">
                        <dt className="text-sm font-medium text-gray-500">Branch</dt>
                        <dd className="mt-1 text-lg font-semibold text-gray-900">{cert.courseName}</dd>
                      </div>
                      <div className="sm:col-span-1">
                        <dt className="text-sm font-medium text-gray-500">Course / Program</dt>
                        <dd className="mt-1 text-lg font-semibold text-gray-900">{cert.duration}</dd>
                      </div>
                      <div className="sm:col-span-1">
                        <dt className="text-sm font-medium text-gray-500">Issue Date</dt>
                        <dd className="mt-1 text-lg font-semibold text-gray-900">
                          {new Date(cert.issueDate).toLocaleDateString("en-US", {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                          })}
                        </dd>
                      </div>
                      <div className="sm:col-span-2 mt-4 pt-4 border-t border-gray-100 flex flex-wrap gap-4">
                        <a
                          href={cert.pdfUrl.replace('.pdf', '.jpg')}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center px-6 py-3 border border-gray-300 text-base font-medium rounded-md shadow-sm text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                        >
                          <FileText className="h-5 w-5 mr-2 text-gray-500" />
                          View
                        </a>
                        <a
                          href={cert.pdfUrl.replace('/upload/', '/upload/fl_attachment/').replace('.pdf', '.jpg')}
                          className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                        >
                          <Download className="h-5 w-5 mr-2" />
                          Download
                        </a>
                      </div>
                    </dl>
                  </div>
                </div>
              ))}
            </div>
          )}

        </div>
      </div>
    </Layout>
  );
};

export default VerifyCertificate;
