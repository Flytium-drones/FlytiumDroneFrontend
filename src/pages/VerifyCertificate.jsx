import React, { useState } from "react";
import Layout from "../components/Layout/Layout";
import axios from "axios";
import { API_URL } from "../api";
import { Search, Award, CheckCircle, XCircle, FileText } from "lucide-react";
import toast from "react-hot-toast";

const VerifyCertificate = () => {
  const [certificateId, setCertificateId] = useState("");
  const [certificate, setCertificate] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  const handleVerify = async (e) => {
    e.preventDefault();
    if (!certificateId.trim()) return;

    try {
      setLoading(true);
      setError(false);
      setCertificate(null);
      
      const { data } = await axios.get(`${API_URL}/api/certificate/verify/${certificateId}`);
      
      if (data?.success) {
        setCertificate(data.certificate);
        toast.success("Certificate Verified Successfully");
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
              Enter your certificate ID below to verify its authenticity
            </p>
          </div>

          <form className="mt-8 space-y-6" onSubmit={handleVerify}>
            <div className="flex rounded-md shadow-sm">
              <input
                type="text"
                required
                className="flex-1 min-w-0 block w-full px-4 py-4 rounded-none rounded-l-md border border-gray-300 focus:ring-blue-500 focus:border-blue-500 sm:text-lg"
                placeholder="Enter Certificate ID (e.g. FLY-12345)"
                value={certificateId}
                onChange={(e) => setCertificateId(e.target.value)}
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
                The certificate ID you entered is invalid or does not exist in our records. Please check the ID and try again.
              </p>
            </div>
          )}

          {certificate && (
            <div className="mt-8 bg-white border border-green-200 rounded-lg shadow-sm overflow-hidden text-center p-8">
              <CheckCircle className="mx-auto h-16 w-16 text-green-500 mb-4" />
              <h3 className="text-2xl font-bold text-gray-900 mb-2">Verified Authentic Certificate</h3>
              <p className="text-gray-600 mb-6">
                Certificate ID: <span className="font-semibold text-gray-900">{certificate.certificateId}</span>
              </p>
              
              <a
                href={certificate.pdfUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                <FileText className="h-5 w-5 mr-2" />
                View / Download Certificate
              </a>
            </div>
          )}

        </div>
      </div>
    </Layout>
  );
};

export default VerifyCertificate;
