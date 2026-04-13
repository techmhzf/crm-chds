import Anthropic from '@anthropic-ai/sdk';

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

export const generateMessage = async (req, res) => {
  try {
    const { name, role, company, industry, profileSummary } = req.body;
    const response = await client.messages.create({
      model: 'claude-3-5-haiku-20241022',
      max_tokens: 400,
      system: 'You write short Hinglish LinkedIn outreach messages — 70% English, 30% Hindi, casual, 4-5 lines, junior-to-senior tone, not salesy, feels human not AI generated. Mix Hindi words naturally like aap, kaam, achha, shukriya, bahut, etc.',
      messages: [{
        role: 'user',
        content: `Write a LinkedIn message for:\nName: ${name}\nRole: ${role || 'Professional'}\nCompany: ${company || 'their company'}\nIndustry: ${industry || 'their industry'}\nAbout: ${profileSummary || 'LinkedIn professional'}\n\nKeep it 4-5 lines, Hinglish, casual but respectful, reference their work, end with soft ask.`,
      }],
    });
    res.json({ message: response.content[0].text });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
