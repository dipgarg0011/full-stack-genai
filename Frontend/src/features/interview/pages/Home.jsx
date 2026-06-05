import React, { useState, useRef } from "react";
import "../styles/home.scss";
import { useInterview } from "../hooks/useInterview";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const [jobDescription, setJobDescription] = useState("");
  const [selfDescription, setSelfDescription] = useState("");
  const [resumeFile, setResumeFile] = useState(null);
  const fileInputRef = useRef(null);

  const { generateReport, loading } = useInterview();
  const navigate = useNavigate();

  const handleSubmit = async () => {
    if (!jobDescription.trim() || !selfDescription.trim() || !resumeFile) {
      alert("Please fill in all fields and upload your resume.");
      return;
    }

    const report = await generateReport({ jobDescription, selfDescription, resumeFile });

    if (report && report._id) {
      navigate(`/interview/${report._id}`);
    }
  };

  return (
    <div className="page">

      <section className="hero">
        <div className="badge">
          AI Powered Interview Preparation
        </div>

        <h1>Create Your Custom Interview Prep Plan</h1>

        <p>
          Upload your resume, paste the job description and get a
          personalized interview roadmap instantly.
        </p>
      </section>

      <main className="home">

        <div className="leftArea">
          <div className="section-header">
            <h2>Job Description</h2>
            <p>Paste the company job description</p>
          </div>

          <textarea
            id="jobDescription"
            placeholder="Enter job description here..."
            value={jobDescription}
            onChange={(e) => setJobDescription(e.target.value)}
          />
        </div>

        <div className="divider"></div>

        <div className="rightArea">

          <div className="section-header">
            <h2>Candidate Profile</h2>
            <p>Upload resume and describe yourself</p>
          </div>

          <div className="upload-box">
            <label htmlFor="resume">
              📄 {resumeFile ? resumeFile.name : "Upload Resume"}
            </label>

            <input
              ref={fileInputRef}
              type="file"
              id="resume"
              accept=".pdf,.doc,.docx"
              onChange={(e) => setResumeFile(e.target.files[0] || null)}
            />
          </div>

          <div className="input-group">
            <label htmlFor="selfDescription">
              Self Description
            </label>

            <textarea
              id="selfDescription"
              placeholder="Tell us about yourself..."
              value={selfDescription}
              onChange={(e) => setSelfDescription(e.target.value)}
            />
          </div>

          <button
            className="generate-btn"
            onClick={handleSubmit}
            disabled={loading}
          >
            {loading ? "Generating..." : "Generate Interview Report"}
          </button>

        </div>

      </main>

    </div>
  );
};

export default Home;