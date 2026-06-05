import {
  getAllInterviewReports,
  generateInterviewReport,
  getInterviewReportById,
  generateResumePdf,
} from "../services/interview.api";
import { useContext } from "react";
import { InterviewContext } from "../interview.context";

export const useInterview = () => {
  const context = useContext(InterviewContext);

  if (!context) {
    throw new Error("useInterview must be used within an InterviewProvider");
  }

  const { loading, setLoading, report, setReport, reports, setReports } = context;

  const generateReport = async ({ jobDescription, selfDescription, resumeFile }) => {
    setLoading(true);
    let interviewReport = null;
    try {
      const response = await generateInterviewReport({ jobDescription, selfDescription, resumeFile });
      interviewReport = response.interviewReport;
      setReport(interviewReport);
    } catch (error) {
      console.error("generateReport error:", error);
    } finally {
      setLoading(false);
    }
    return interviewReport;
  };

  const getReportById = async (interviewId) => {
    setLoading(true);
    let interviewReport = null;
    try {
      const response = await getInterviewReportById(interviewId);
      interviewReport = response.interviewReport;
      setReport(interviewReport);
    } catch (error) {
      console.error("getReportById error:", error);
    } finally {
      setLoading(false);
    }
    return interviewReport;
  };

  const getReports = async () => {
    setLoading(true);
    let interviewReports = null;
    try {
      const response = await getAllInterviewReports();
      interviewReports = response.interviewReports;
      setReports(interviewReports);
    } catch (error) {
      console.error("getReports error:", error);
    } finally {
      setLoading(false);
    }
    return interviewReports;
  };

  const getResumePdf = async (interviewReportId) => {
    setLoading(true);
    try {
      const response = await generateResumePdf({ interviewReportId });
      const url = window.URL.createObjectURL(new Blob([response], { type: "application/pdf" }));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `resume_${interviewReportId}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("getResumePdf error:", error);
    } finally {
      setLoading(false);
    }
  };

  return { loading, report, reports, generateReport, getReportById, getReports, getResumePdf };
};