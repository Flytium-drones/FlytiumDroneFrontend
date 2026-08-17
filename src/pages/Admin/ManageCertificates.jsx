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
  const [studentName, setStudentName] = useState("");
  const [courseName, setCourseName] = useState("");
  const [issueDate, setIssueDate] = useState("");
  const [grade, setGrade] = useState("");
  const [description, setDescription] = useState("");
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

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.post(`${API_URL}/api/certificate/create`, {
        certificateId,
        studentName,
        courseName,
        issueDate,
        grade,
        description
      }, {
        headers: { Authorization: `Bearer ${auth?.token}` }
      });
      
      if (data?.success) {
        toast.success(`${studentName}'s certificate is created`);
        getAllCertificates();
        // Clear form
        setCertificateId("");
        setStudentName("");
        setCourseName("");
        setIssueDate("");
        setGrade("");
        setDescription("");
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
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Enter Student Name"
                    value={studentName}
                    onChange={(e) => setStudentName(e.target.value)}
                    required
                  />
                </div>
                <div className="mb-3">
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Enter Course Name"
                    value={courseName}
                    onChange={(e) => setCourseName(e.target.value)}
                    required
                  />
                </div>
                <div className="mb-3">
                  <input
                    type="date"
                    className="form-control"
                    placeholder="Select Issue Date"
                    value={issueDate}
                    onChange={(e) => setIssueDate(e.target.value)}
                    required
                  />
                </div>
                <div className="mb-3">
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Enter Grade (Optional)"
                    value={grade}
                    onChange={(e) => setGrade(e.target.value)}
                  />
                </div>
                <div className="mb-3">
                  <textarea
                    className="form-control"
                    placeholder="Enter Description (Optional)"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                  />
                </div>
                <button type="submit" className="btn btn-primary">
                  CREATE CERTIFICATE
                </button>
              </form>
            </div>

            <div className="w-75 mt-4">
              <table className="table">
                <thead>
                  <tr>
                    <th scope="col">ID</th>
                    <th scope="col">Student</th>
                    <th scope="col">Course</th>
                    <th scope="col">Date</th>
                    <th scope="col">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {certificates?.map((c) => (
                    <tr key={c._id}>
                      <td>{c.certificateId}</td>
                      <td>{c.studentName}</td>
                      <td>{c.courseName}</td>
                      <td>{new Date(c.issueDate).toLocaleDateString()}</td>
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
