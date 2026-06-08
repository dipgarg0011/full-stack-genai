const pdfParse = require('pdf-parse-fork');
const PDFDocument = require('pdfkit');
const { generateInterviewreport } = require('../services/ai.services');
const InterviewReportModel = require('../models/interviewreport.model');


/**
 * @desc Generate an interview report based on the candidate's resume, self-description, and job description.
 */
async function generateReport(req, res) {
    try {
        const resumeFile = req.file;

        if (!resumeFile) {
            return res.status(400).json({
                success: false,
                message: "Resume file is required"
            });
        }

        if (!req.user || !req.user.id) {
            return res.status(401).json({
                success: false,
                message: "Unauthorized"
            });
        }

        const resumeData = await pdfParse(resumeFile.buffer);
        const { selfdescription, jobdescription } = req.body;

        const interviewReportbyAi = await generateInterviewreport({
            resume: resumeData.text,
            selfdescription,
            jobdescription
        });

        console.log(
            JSON.stringify(interviewReportbyAi, null, 2)
        );

        let interviewReport;

        try {
            interviewReport = await InterviewReportModel.create({
                user: req.user.id,
                resume: resumeData.text,
                selfdescription,
                jobdescription,
                ...interviewReportbyAi
            });
        } catch (err) {
            console.error("Report save failed:", err);

            return res.status(502).json({
                success: false,
                message: "AI returned invalid report shape",
                error: err.message
            });
        }

        return res.status(201).json({
            success: true,
            interviewReport
        });

    } catch (error) {
        console.error("generateReport error:", error);

        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
}

/**
 * @desc Get a specific interview report by ID. 
 */

async function getReportById(req, res) {
    try {
        const { interviewId } = req.params;

        if (!req.user || !req.user.id) {
            return res.status(401).json({
                success: false,
                message: "Unauthorized"
            });
        }

        const interviewReport = await InterviewReportModel.findById(interviewId);

        if (!interviewReport) {
            return res.status(404).json({
                success: false,
                message: "Interview report not found"
            });
        }

        if (interviewReport.user.toString() !== req.user.id.toString()) {
            return res.status(403).json({
                success: false,
                message: "Access denied"
            });
        }

        return res.status(200).json({
            success: true,
            interviewReport
        });

    } catch (error) {
        console.error("getReportById error:", error);

        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
}

/**
 * @desc Get all interview reports for the authenticated user.
 */
async function getAllReports(req, res) {
    try {
        if (!req.user || !req.user.id) {
            return res.status(401).json({
                success: false,
                message: "Unauthorized"
            });
        }

        const interviewReports = await InterviewReportModel.find({
            user: req.user.id});
            
        return res.status(200).json({
            success: true,
            interviewReports
        });

    } catch (error) {
        console.error("getAllReports error:", error);

        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
}

async function generateResumePdf(req, res) {
    try {
        const { interviewReportId } = req.params;

        if (!req.user || !req.user.id) {
            return res.status(401).json({
                success: false,
                message: "Unauthorized"
            });
        }

        const interviewReport = await InterviewReportModel.findById(interviewReportId);

        if (!interviewReport) {
            return res.status(404).json({
                success: false,
                message: "Interview report not found"
            });
        }

        if (interviewReport.user.toString() !== req.user.id.toString()) {
            return res.status(403).json({
                success: false,
                message: "Access denied"
            });
        }

        const doc = new PDFDocument();

        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader(
            'Content-Disposition',
            `attachment; filename="resume_${interviewReportId}.pdf"`
        );

        doc.pipe(res);

        doc.fontSize(20).text('Interview Preparation Report', {
            underline: true
        });

        doc.moveDown();

        doc.fontSize(14).text('Match Score', {
            underline: true
        });

        doc.fontSize(12).text(`${interviewReport.matchScore}%`);

        doc.moveDown();

        doc.fontSize(14).text('Technical Questions', {
            underline: true
        });

        interviewReport.technicalQuestions.forEach((q, i) => {
            doc.fontSize(11).text(`Q${i + 1}: ${q.question}`);
            doc.fontSize(10).text(`Answer: ${q.answer}`);
            doc.moveDown(0.5);
        });

        doc.moveDown();

        doc.fontSize(14).text('Behavioral Questions', {
            underline: true
        });

        interviewReport.behavioralQuestions.forEach((q, i) => {
            doc.fontSize(11).text(`Q${i + 1}: ${q.question}`);
            doc.fontSize(10).text(`Answer: ${q.answer}`);
            doc.moveDown(0.5);
        });

        doc.moveDown();

        doc.fontSize(14).text('Skill Gaps', {
            underline: true
        });

        interviewReport.skillGaps.forEach((gap) => {
            doc.fontSize(11).text(
                `${gap.skill} (${gap.severity})`
            );
        });

        doc.moveDown();

        doc.fontSize(14).text('Preparation Plan', {
            underline: true
        });

        interviewReport.preparationPlan.forEach((day) => {
            doc.fontSize(11).text(
                `Day ${day.day}: ${day.focus}`
            );

            day.tasks.forEach((task) => {
                doc.fontSize(10).text(`• ${task}`);
            });

            doc.moveDown(0.5);
        });

        doc.end();

    } catch (error) {
        console.error("generateResumePdf error:", error);

        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
}

/**
 * &desc controller for getting a specific interview report by ID.
 */

async function getInterviewReportById(req, res) {

    const { interviewId } = req.params;

    const interviewReport= await interviewReportModel.findOne({id:interviewId, user: req.user.id});

    if(!interviewReport){
        return res.status(404).json({
            success: false,
            message: "Interview report not found"
        });
    }
    return res.status(200).json({
        success: true,
        interviewReport
    });
}

module.exports = {
    generateReport,
    getReportById,
    getAllReports,
    generateResumePdf,
    getInterviewReportById
};