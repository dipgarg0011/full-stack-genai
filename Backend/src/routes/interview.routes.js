const express = require('express');
const authMiddleware = require('../middleware/auth.middleware');
const interviewcontroller = require('../controllers/interview.controller');
const upload = require('../middleware/file.middleware');

const interviewRouter = express.Router();

/**
 * @routes POST /api/interview
 * @description Generate an interview report based on the candidate's resume, self-description, and job description.
 * @access private
 */
interviewRouter.post("/", authMiddleware.authUser, upload.single('resume'), interviewcontroller.generateReport);

/**
 * @routes GET /api/interview/
 * @description Get all interview reports for the authenticated user.
 * @access private
 */
interviewRouter.get("/", authMiddleware.authUser, interviewcontroller.getAllReports);

/**
 * @routes GET /api/interview/report/:interviewId
 * @description Get a specific interview report by ID.
 * @access private
 */
interviewRouter.get("/report/:interviewId", authMiddleware.authUser, interviewcontroller.getReportById);

/**
 * @routes POST /api/interview/resume/pdf/:interviewReportId
 * @description Generate a PDF of the interview report.
 * @access private
 */
interviewRouter.post("/resume/pdf/:interviewReportId", authMiddleware.authUser, interviewcontroller.generateResumePdf);

module.exports = interviewRouter;