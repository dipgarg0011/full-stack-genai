const { GoogleGenAI } = require("@google/genai");
const { z } = require("zod");
const { zodToJsonSchema } = require("zod-to-json-schema");

const ai = new GoogleGenAI({
  apiKey: process.env.GOOGLE_API_KEY,
});

const interviewReportSchema = z.object({
  matchScore: z
    .number()
    .describe("How well the candidate profile matches the job requirements, on a scale of 1 to 100."),

  technicalQuestions: z.array(
    z.object({
      question: z.string().describe("The technical question asked during the interview."),
      intention: z.string().describe("Why this question is being asked."),
      answer: z.string().describe("How to answer the technical question effectively."),
    })
  ).describe("A list of technical questions with intentions and answers."),

  behavioralQuestions: z.array(
    z.object({
      question: z.string().describe("The behavioral question asked during the interview."),
      intention: z.string().describe("Why this question is being asked."),
      answer: z.string().describe("How to answer the behavioral question effectively."),
    })
  ).describe("A list of behavioral questions with intentions and answers."),

  skillGaps: z.array(
    z.object({
      skill: z.string().describe("The skill that the candidate is lacking."),
      severity: z.enum(["low", "mid", "high"]).describe("Severity of the skill gap."),
    })
  ).describe("A list of skill gaps identified."),

  preparationPlan: z.array(
    z.object({
      day: z.number().describe("The day number in the preparation plan."),
      focus: z.string().describe("The main focus area for that day."),
      tasks: z.array(z.string()).describe("List of tasks to complete that day."),
    })
  ).describe("A day-by-day preparation plan for the candidate."),
});

async function generateInterviewreport({ resume, selfdescription, jobdescription }) {
  const prompt = `Generate a professional interview assessment report for a candidate based on the following information:

Resume:
${resume}

Self Description:
${selfdescription}

Job Description:
${jobdescription}

Analyze how well the candidate's skills, experience, projects, and background align with the job requirements.

Important Instructions:
* Keep all responses concise and point-wise.
* Use bullet points instead of long paragraphs.
* Be realistic and constructive in the evaluation.
* Base the assessment on the provided information only.
* Return ONLY valid JSON matching the provided schema.
* Do not include markdown, code blocks, or any text outside the JSON response.`;

  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseSchema: zodToJsonSchema(interviewReportSchema),
    },
  });

  return JSON.parse(response.text);
}

module.exports = {
  generateInterviewreport,
};