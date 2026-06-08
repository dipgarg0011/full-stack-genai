import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useInterview } from "../hooks/useInterview";
import "../styles/home.scss";

const Home = () => {
  const [jobDescription, setJobDescription] = useState("");
  const [resume, setResume] = useState(null);
  const [selfDescription, setSelfDescription] = useState("");
  const [error, setError] = useState("");

  const navigate = useNavigate();
  const { generateReport, loading } = useInterview();

  const handleGenerateReport = async (e) => {
    e.preventDefault();
    setError("");

    if (!jobDescription || !resume || !selfDescription) {
      setError("All fields are required");
      return;
    }

    const report = await generateReport({
      jobDescription,
      selfDescription,
      resumeFile: resume,
    });

    if (report?._id) {
      navigate(`/interview/${report._id}`);
    } else {
      setError("Failed to generate report. Please try again.");
    }
  };

  return (
    <div className="page">
      <section className="hero">
        <div className="badge">AI Powered Interview Preparation</div>
        <h1>Create Your Custom Interview Prep Plan</h1>
        <p>
          Upload your resume, paste the job description and get a personalized
          interview roadmap instantly.
        </p>
        <button
          onClick={() => navigate("/history")}
          style={{
            marginTop: "1rem",
            background: "transparent",
            border: "1px solid #6366f1",
            color: "#a5b4fc",
            padding: "0.5rem 1.2rem",
            borderRadius: "8px",
            cursor: "pointer",
            fontSize: "0.9rem",
          }}
        >
          📋 View Past Reports
        </button>
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
            <label htmlFor="resume">📄 Upload Resume</label>
            <input
              type="file"
              id="resume"
              accept=".pdf,.doc,.docx"
              onChange={(e) => setResume(e.target.files?.[0])}
            />
          </div>

          <div className="input-group">
            <label htmlFor="selfDescription">Self Description</label>
            <textarea
              id="selfDescription"
              placeholder="Tell us about yourself..."
              value={selfDescription}
              onChange={(e) => setSelfDescription(e.target.value)}
            />
          </div>

          <button
            className="generate-btn"
            onClick={handleGenerateReport}
            disabled={loading}
          >
            {loading ? "Generating..." : "Generate Interview Report"}
          </button>

          {error && (
            <p className="error-message" style={{ color: "red" }}>
              {error}
            </p>
          )}
        </div>
      </main>
    </div>
  );
};

export default Home;
