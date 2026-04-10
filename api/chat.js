// ===== SMAG Technologies AI Chatbot — Vercel Serverless Function =====
// File: api/chat.js

const Groq = require('groq-sdk');

const SYSTEM_PROMPT = `You are SMAG AI Assistant — the friendly, expert chatbot for SMAG Technologies (smagtechnologies.com). SMAG Technologies is a full-service B2B digital marketing and software development agency based in Texas, USA, with offices in Dubai.

SMAG's Services:
- Digital Marketing (SEO, Social Media Marketing, PPC, Email Marketing)
- Website Development (UI/UX Designing, Custom Websites)
- Mobile App Development
- Custom Software Development
- Quality Assurance Services
- Graphic Design (2D, 3D, Video Editing, Content Marketing)

Key Contact Info:
- Phone: 832-592-1313
- Email: info@smagtechnologies.com
- TX Office: 2201 Spinks Road, Flower Mound, TX, USA
- Dubai Office: Building A1, Digital Park, Silicon Oasis, Dubai, UAE

Your behavior:
- Be friendly, warm, and professional
- Answer questions about SMAG services with confidence
- For pricing/quotes: say "Our team creates custom packages. Let me connect you!" and mention the contact form at smagtechnologies.com/contact-us/
- If asked something outside SMAG scope, gently redirect
- Keep replies concise — max 3 short paragraphs
- Occasionally use relevant emojis to feel human
- Never make up specific pricing numbers`;

module.exports = async (req, res) => {
  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const { messages } = req.body;
  if (!messages || !Array.isArray(messages)) {
    return res.status(400).json({ error: 'messages array required' });
  }

  try {
    const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

    const completion = await groq.chat.completions.create({
      model: 'llama3-8b-8192',
      messages: [
        { role: 'system', content: SYSTEM_PROMPT },
        ...messages
      ],
      temperature: 0.7,
      max_tokens: 400,
      stream: false
    });

    const reply = completion.choices[0]?.message?.content || '';
    res.json({ reply });

  } catch (err) {
    console.error('Groq error:', err);
    res.status(500).json({
      reply: 'Sorry, having trouble right now. Please call us at 📞 832-592-1313 or visit smagtechnologies.com!'
    });
  }
};
