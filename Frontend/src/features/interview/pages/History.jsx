import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useInterview } from "../hooks/useInterview";

const History = () => {
  const { reports, getReports, loading } = useInterview();
  const navigate = useNavigate();

  useEffect(() => {
    getReports();
  }, []);

  if (loading) {
    return (
      <main style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100vh", background: "#0f0f1a" }}>
        <h1 style={{ color: "#a5b4fc" }}>Loading your reports...</h1>
      </main>
    );
  }

  return (
    <div style={{ minHeight: "100vh", background: "#0f0f1a", padding: "3rem 2rem" }}>

      {/* Header */}
      <div style={{ textAlign: "center", marginBottom: "3rem" }}>
        <h1 style={{ color: "#fff", fontSize: "2rem", fontWeight: 700 }}>Your Interview Reports</h1>
        <p style={{ color: "#6b7280", marginTop: "0.5rem" }}>All your previously generated interview prep plans.</p>
        <button
          onClick={() => navigate("/")}
          style={{
            marginTop: "1.2rem", background: "transparent",
            border: "1px solid #4f46e5", color: "#a5b4fc",
            padding: "0.5rem 1.4rem", borderRadius: "8px",
            cursor: "pointer", fontSize: "0.9rem"
          }}
        >
          + Generate New Report
        </button>
      </div>

      {/* Empty state */}
      {(!reports || reports.length === 0) && (
        <div style={{ textAlign: "center", color: "#6b7280", marginTop: "4rem" }}>
          <p style={{ fontSize: "1.1rem" }}>No reports yet.</p>
          <p style={{ marginTop: "0.4rem" }}>Go to Home to generate your first interview prep plan!</p>
        </div>
      )}

      {/* Report cards grid */}
      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))",
        gap: "1.2rem",
        maxWidth: "1100px",
        margin: "0 auto"
      }}>
        {reports?.map((r) => {
          const score = r.matchScore ?? 0;
          const scoreColor = score >= 80 ? "#22c55e" : score >= 60 ? "#eab308" : "#ef4444";
          const date = new Date(r.createdAt).toLocaleDateString("en-IN", { dateStyle: "medium" });
          const preview = r.jobdescription?.slice(0, 100) ?? "No description";

          return (
            <div
              key={r._id}
              onClick={() => navigate(`/interview/${r._id}`)}
              style={{
                background: "#1a1a2e",
                border: "1px solid #2a2a3e",
                borderRadius: "14px",
                padding: "1.4rem",
                cursor: "pointer",
                transition: "border-color 0.2s, transform 0.2s",
                display: "flex",
                flexDirection: "column",
                gap: "0.8rem",
              }}
              onMouseEnter={e => {
                e.currentTarget.style.borderColor = "#4f46e5";
                e.currentTarget.style.transform = "translateY(-2px)";
              }}
              onMouseLeave={e => {
                e.currentTarget.style.borderColor = "#2a2a3e";
                e.currentTarget.style.transform = "translateY(0)";
              }}
            >
              {/* Top row: date + score */}
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span style={{ color: "#6b7280", fontSize: "0.8rem" }}>{date}</span>
                <span style={{
                  fontSize: "1.3rem", fontWeight: 700, color: scoreColor,
                  background: scoreColor + "18", padding: "0.2rem 0.7rem",
                  borderRadius: "8px"
                }}>
                  {score}%
                </span>
              </div>

              {/* Job description preview */}
              <p style={{
                color: "#d1d5db", fontSize: "0.92rem",
                lineHeight: "1.5", margin: 0,
                display: "-webkit-box", WebkitLineClamp: 3,
                WebkitBoxOrient: "vertical", overflow: "hidden"
              }}>
                {preview}
              </p>

              {/* Skill gaps */}
              {r.skillGaps?.length > 0 && (
                <div style={{ display: "flex", flexWrap: "wrap", gap: "0.4rem", marginTop: "0.2rem" }}>
                  {r.skillGaps.slice(0, 3).map((gap, i) => (
                    <span key={i} style={{
                      fontSize: "0.75rem", padding: "0.2rem 0.6rem",
                      borderRadius: "6px", fontWeight: 500,
                      background: gap.severity === "high" ? "#ef444420" : gap.severity === "mid" ? "#eab30820" : "#22c55e20",
                      color: gap.severity === "high" ? "#ef4444" : gap.severity === "mid" ? "#eab308" : "#22c55e",
                      border: `1px solid ${gap.severity === "high" ? "#ef444440" : gap.severity === "mid" ? "#eab30840" : "#22c55e40"}`
                    }}>
                      {gap.skill}
                    </span>
                  ))}
                  {r.skillGaps.length > 3 && (
                    <span style={{ fontSize: "0.75rem", color: "#6b7280" }}>+{r.skillGaps.length - 3} more</span>
                  )}
                </div>
              )}

              {/* Footer */}
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "0.2rem" }}>
                <span style={{ color: "#6b7280", fontSize: "0.78rem" }}>
                  {r.technicalQuestions?.length ?? 0} technical · {r.behavioralQuestions?.length ?? 0} behavioral
                </span>
                <span style={{ color: "#4f46e5", fontSize: "0.82rem" }}>View →</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default History;