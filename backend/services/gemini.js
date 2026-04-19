const { GoogleGenerativeAI } = require('@google/generative-ai');

class GeminiService {
  constructor() {
    this.genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    this.model = this.genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
  }

  async generateSummary(content) {
    const prompt = `You are an academic assistant. Create a clear, well-structured summary of the following study material. Use bullet points and headings where appropriate. Make it easy to understand and revise from:\n\n${content}`;
    const result = await this.model.generateContent(prompt);
    return result.response.text();
  }

  async answerQuestion(content, question) {
    const prompt = `You are an academic tutor. Based on the following study material, answer the student's question clearly and thoroughly.\n\nStudy Material:\n${content}\n\nStudent's Question: ${question}\n\nProvide a detailed, easy-to-understand answer.`;
    const result = await this.model.generateContent(prompt);
    return result.response.text();
  }

  async generateQuizQuestions(content, numQuestions = 5) {
    const prompt = `Based on the following study material, generate exactly ${numQuestions} multiple choice quiz questions to test understanding. Return ONLY valid JSON in this exact format (no markdown, no code blocks):
[
  {
    "question": "Question text here?",
    "options": ["Option A", "Option B", "Option C", "Option D"],
    "correctAnswer": 0,
    "explanation": "Brief explanation of why this is correct"
  }
]

Study Material:
${content}`;

    const result = await this.model.generateContent(prompt);
    let text = result.response.text().trim();
    text = text.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
    return JSON.parse(text);
  }
}

module.exports = new GeminiService();
