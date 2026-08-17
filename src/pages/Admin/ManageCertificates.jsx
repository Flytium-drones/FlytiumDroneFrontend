import React, { useState, useEffect } from "react";
import Layout from "../../components/Layout/Layout";
import AdminMenu from "../../components/Layout/AdminMenu";
import axios from "axios";
import toast from "react-hot-toast";
import { API_URL } from "../../api";
import { useAuth } from "../../Context/auth";

const ManageCertificates = () => {
  const [certificates, setCertificates] = useState([]);
  const [certificateId, setCertificateId] = useState("");
  const [pdfUrl, setPdfUrl] = useState("");
  const [isUploading, setIsUploading] = useState(false);
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
      const { data } = await axios.post(`${API_URL}/api/certificate/create`, {
        certificateId,
        pdfUrl
      }, {
        headers: { Authorization: `Bearer ${auth?.token}` }
      });
      
      if (data?.success) {
        toast.success(`Certificate ${certificateId} created`);
        getAllCertificates();
        // Clear form
        setCertificateId("");
        setPdfUrl("");
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.response?.data?.message || "Something went wrong");
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
      <div className="container-fluid m-3 p-3">
        <div className="row">
          <div className="col-md-3">
            <AdminMenu />
          </div>
          <div className="col-md-9">
            <h1>Manage Certificates</h1>
            <div className="p-3 w-50">
              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label className="form-label font-bold">Certificate Number / ID</label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Enter Certificate ID"
                    value={certificateId}
                    onChange={(e) => setCertificateId(e.target.value)}
                    required
                  />
                </div>
                
                <div className="mb-3">
                  <label className="form-label font-bold">Upload PDF Certificate</label>
                  <input
                    type="file"
                    accept=".pdf"
                    className="form-control"
                    onChange={handlePdfUpload}
                    disabled={isUploading}
                  />
                  {isUploading && <p className="mt-2 text-blue-600">Uploading PDF... Please wait.</p>}
                  {pdfUrl && <p className="mt-2 text-green-600 font-medium">✅ PDF Uploaded Successfully</p>}
                </div>
                
                <button type="submit" className="btn btn-primary" disabled={isUploading}>
                  {isUploading ? "Uploading..." : "ADD CERTIFICATE"}
                </button>
              </form>
            </div>

            <div className="w-75 mt-4">
              <table className="table">
                <thead>
                  <tr>
                    <th scope="col">Certificate ID</th>
                    <th scope="col">PDF Link</th>
                    <th scope="col">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {certificates?.map((c) => (
                    <tr key={c._id}>
                      <td>{c.certificateId}</td>
                      <td>
                        <a href={c.pdfUrl} target="_blank" rel="noopener noreferrer" className="text-blue-500 underline">
                          View PDF
                        </a>
                      </td>
                      <td>
                        <button
                          className="btn btn-danger ms-2"
                          onClick={() => handleDelete(c._id)}
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
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
