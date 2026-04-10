// ===== SMAG Technologies AI Chatbot — Vercel Serverless Function =====
const Groq = require('groq-sdk');

const SYSTEM_PROMPT = `You are SMAG AI Assistant — a smart, friendly expert for SMAG Technologies (smagtechnologies.com), a B2B digital marketing & software agency in Texas, USA with offices in Dubai.

Services: SEO, Social Media, PPC, Email Marketing, Web Development, Mobile Apps, Custom Software, QA, Graphic Design (2D/3D/Video).

Contact: 📞 832-592-1313 | 📧 info@smagtechnologies.com
TX: 2201 Spinks Road, Flower Mound, TX | Dubai: Silicon Oasis, Digital Park

Rules:
- Keep replies under 3 sentences max
- Be warm, confident, professional
- For pricing: "We offer custom packages — contact us at smagtechnologies.com/contact-us/"
- Use 1-2 emojis max per reply
- Never make up prices
- Redirect off-topic questions back to SMAG services`;

module.exports = async (req, res) => {
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
      model: 'llama-3.3-70b-versatile',
      messages: [{ role: 'system', content: SYSTEM_PROMPT }, ...messages],
      temperature: 0.7,
      max_tokens: 200,
      stream: false
    });
    const reply = completion.choices[0]?.message?.content || '';
    res.json({ reply });
  } catch (err) {
    console.error('Groq error:', err);
    res.status(500).json({
      reply: 'Sorry, having trouble right now. Please call us at 📞 832-592-1313!'
    });
  }
};