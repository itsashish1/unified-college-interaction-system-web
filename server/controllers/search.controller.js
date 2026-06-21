import Club from '../models/Club.model.js';
import Event from '../models/Event.model.js';
import Post from '../models/Post.model.js';
import Faculty from '../models/Faculty.model.js';
import Resource from '../models/Resource.model.js';
import { GoogleGenAI } from '@google/genai';
import fs from 'fs';
import path from 'path';

let aiInstance = null;
if (process.env.GEMINI_API_KEY) {
  aiInstance = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
}

let cachedGraphContext = null;
const loadGraphContext = () => {
  if (cachedGraphContext) return cachedGraphContext;
  try {
    const reportPath = path.resolve(process.cwd(), '../graphify-out/GRAPH_REPORT.md');
    if (fs.existsSync(reportPath)) {
      cachedGraphContext = fs.readFileSync(reportPath, 'utf8').substring(0, 15000);
    } else {
      cachedGraphContext = "CampusMate Unified College Interaction System.";
    }
  } catch (err) {
    cachedGraphContext = "CampusMate Unified College Interaction System.";
  }
  return cachedGraphContext;
};

// GET /api/search?q=query
export const globalSearch = async (req, res) => {
  try {
    const { q } = req.query;
    if (!q || q.trim().length < 2) return res.status(400).json({ message: 'Query too short' });
    const regex = { $regex: q, $options: 'i' };

    const [clubs, events, posts, faculty, resources] = await Promise.all([
      Club.find({
        $or: [{ name: regex }, { description: regex }, { category: regex }],
        isActive: true
      }).select('name description category logo').limit(5),
      Event.find({
        $or: [{ title: regex }, { description: regex }, { venue: regex }, { tags: regex }],
        isPublished: true
      }).select('title description startDate venue status').limit(5),
      Post.find({
        $or: [{ title: regex }, { content: regex }, { tags: regex }]
      }).select('title category createdAt').populate('author', 'name').limit(5),
      Faculty.find({
        $or: [{ name: regex }, { department: regex }, { designation: regex }, { subjects: regex }],
        isActive: true
      }).select('name department email designation').limit(5),
      Resource.find({
        $or: [{ title: regex }, { description: regex }, { subject: regex }, { department: regex }]
      }).select('title subject department fileType fileUrl').limit(5)
    ]);

    let aiSuggestion = null;
    if (aiInstance) {
      try {
        const context = loadGraphContext();
        const prompt = `You are an intelligent search assistant for a college system called CampusMate.
Based on the following context about the college's knowledge graph:
${context}

The user is searching for: "${q}"

Provide a very short, helpful 1-2 sentence response. Point them to the right club, event, or department if it exists in the context. Keep it highly relevant and concise.`;
        
        const response = await aiInstance.models.generateContent({
          model: 'gemini-2.5-flash',
          contents: prompt,
        });
        
        if (response.text) aiSuggestion = response.text;
      } catch (err) {
        console.error('Gemini API Error:', err.message);
      }
    }

    res.json({ clubs, events, posts, faculty, resources, aiSuggestion: aiSuggestion || "AI Search is ready! Please configure GEMINI_API_KEY to see real insights." });
  } catch (err) { res.status(500).json({ message: err.message }); }
};
