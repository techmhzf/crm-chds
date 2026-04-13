import axios from 'axios';
import * as cheerio from 'cheerio';

export const scrapeLinkedInProfile = async (req, res) => {
  const { linkedinUrl } = req.body;

  // Validate URL
  if (!linkedinUrl || !linkedinUrl.includes('linkedin.com/in/')) {
    return res.status(400).json({ message: 'Invalid LinkedIn profile URL' });
  }

  // Always extract username from URL as a reliable fallback
  const urlSlug = linkedinUrl.replace(/\/$/, '').split('/in/')[1]?.split('?')[0] || '';
  const usernameFromUrl = urlSlug
    .replace(/-/g, ' ')
    .replace(/\b\w/g, (c) => c.toUpperCase())
    .trim();

  const cleanUrl = `https://www.linkedin.com/in/${urlSlug}/`;

  try {
    const { data: html } = await axios.get(cleanUrl, {
      timeout: 8000,
      headers: {
        'User-Agent':
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
        'Accept-Language': 'en-US,en;q=0.9',
        Accept: 'text/html,application/xhtml+xml,application/xhtml+xml,*/*;q=0.8',
        'Accept-Encoding': 'gzip, deflate, br',
        'Cache-Control': 'no-cache',
        Pragma: 'no-cache',
      },
    });

    const $ = cheerio.load(html);

    // ── Name ──────────────────────────────────────────────
    const name =
      $('h1').first().text().trim() ||
      $('title').text().split(/[|–-]/)[0].trim() ||
      usernameFromUrl;

    // ── Role / Headline ───────────────────────────────────
    const role =
      $('h2').first().text().trim() ||
      $('.text-body-medium').first().text().trim() ||
      $('[data-section="summary"] p').first().text().trim() ||
      '';

    // ── Company ───────────────────────────────────────────
    // Try to extract from role (e.g. "Manager @ Company" or "Manager | Company")
    let company = '';
    const atMatch = role.match(/(?:@|at)\s+([^|,\n]+)/i);
    const pipeMatch = role.match(/\|\s*([^|,\n]+)/);
    if (atMatch) company = atMatch[1].trim();
    else if (pipeMatch) company = pipeMatch[1].trim();
    else {
      company =
        $('[data-section="experience"] li').first().find('h3').text().trim() ||
        $('.experience-item').first().find('.company-name').text().trim() ||
        '';
    }

    return res.json({
      name: name || usernameFromUrl,
      role,
      company,
      linkedinUrl: cleanUrl,
      username: urlSlug,
      scraped: !!(name && name !== usernameFromUrl),
    });
  } catch (err) {
    // LinkedIn blocks the request — still return partial data from URL
    return res.json({
      name: usernameFromUrl,
      role: '',
      company: '',
      linkedinUrl: cleanUrl,
      username: urlSlug,
      scraped: false,
    });
  }
};
