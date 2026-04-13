// ============================================================
// CH Digital Solutions — Conversation Starter Templates
// Style: Faraaz's actual LinkedIn outreach pattern
// Formula: Greeting → Profile observation → Brief intro → Genuine question → Warm close
// Variables: {name}, {company}, {role}
// ============================================================

import {
  Globe, Target, Monitor, Plane, Home, TrendingUp, Megaphone, Palette,
} from 'lucide-react';

export const DEFAULT_TEMPLATES = [

  // ─── GENERAL ─────────────────────────────────────────────
  {
    id: 'gen_intro_1',
    industry: 'general',
    label: 'Warm Intro (Curious)',
    tone: 'Friendly',
    body: `Hi {name}, great to connect!

Came across your profile — your work as a {role} at {company} really stood out.

I'm Faraaz from CH Digital Solutions, and we've been exploring how professionals across different fields manage their work and client relationships.

Just curious — what does your typical workflow look like when you're juggling multiple priorities at once?

Would love to hear your perspective.`,
  },
  {
    id: 'gen_intro_2',
    industry: 'general',
    label: 'Simple & Genuine',
    tone: 'Casual',
    body: `Hey {name},

Came across your profile and wanted to reach out — your journey as a {role} looks really interesting.

I'm Faraaz from CH Digital Solutions. We work across different industries, so I'm always curious to learn how things actually operate on the ground.

What's been the biggest shift in how you approach your work over the last year or so?

Would love to hear your thoughts.`,
  },

  // ─── DESIGN ──────────────────────────────────────────────
  {
    id: 'design_intro_1',
    industry: 'design',
    label: 'Creative Process (Conversation Starter)',
    tone: 'Casual',
    body: `Hey {name},

Came across your profile — your work looks really clean, especially the way you handle layouts and visuals.

I'm Faraaz from CH Digital Solutions, and we've been exploring creative and tech spaces lately.

Just curious — when you're working on a design, do you focus more on the visual feel first or the idea behind it?

Would love to hear your thoughts.`,
  },
  {
    id: 'design_intro_2',
    industry: 'design',
    label: 'Client & Process',
    tone: 'Friendly',
    body: `Hi {name},

Came across your profile — the kind of work you do at {company} in the design space really stood out.

I'm Faraaz from CH Digital Solutions, and we've been speaking with creatives across different fields to understand how they manage projects and client expectations.

Wanted to ask — how do you usually handle feedback when a client has a very different vision from yours?

Would really value your perspective on that.`,
  },

  // ─── TECH ────────────────────────────────────────────────
  {
    id: 'tech_intro_1',
    industry: 'tech',
    label: 'Systems & Engineering',
    tone: 'Professional',
    body: `Hi {name}, great to connect!

Came across your profile — your journey at {company} working on complex systems really stood out, especially your experience in building and scaling things.

I'm Faraaz from CH Digital Solutions, focused on simplifying workflows through practical tech solutions.

Just curious — what do you think differentiates a well-built system from an average one in real-world applications?

Would love to learn from your experience.`,
  },
  {
    id: 'tech_intro_2',
    industry: 'tech',
    label: 'Startup & Building',
    tone: 'Casual',
    body: `Hey {name},

Came across your profile — building at {company} as a {role} looks like a genuinely interesting challenge.

I'm Faraaz from CH Digital Solutions, and we've been exploring how tech teams approach problem-solving when resources are limited.

Just curious — when you're working under tight constraints, what's the first thing you prioritise — speed, quality, or scalability?

Would love to hear how you think about it.`,
  },

  // ─── TRAVEL ──────────────────────────────────────────────
  {
    id: 'travel_intro_1',
    industry: 'travel',
    label: 'Operations & Workflow',
    tone: 'Friendly',
    body: `Hello {name},

Came across your profile — your work in building tailored travel experiences really looked interesting.

I'm Faraaz from CH Digital Solutions, and we've recently started exploring how different industries manage their day-to-day operations.

Just wanted to understand from your experience — when it comes to handling bookings and client coordination, what does your usual workflow look like?

Thoda samajhna tha how things actually work on the ground. Would really value your perspective.`,
  },
  {
    id: 'travel_intro_2',
    industry: 'travel',
    label: 'Client Relationships',
    tone: 'Casual',
    body: `Hi {name},

Came across your profile — the kind of travel experiences you create at {company} looks like genuinely fulfilling work.

I'm Faraaz from CH Digital Solutions, and I've been curious about how travel professionals like yourself keep clients coming back, especially in such a competitive space.

What do you think makes the biggest difference in building long-term client relationships in travel?

Would love to hear your take on it.`,
  },

  // ─── SALES ───────────────────────────────────────────────
  {
    id: 'sales_intro_1',
    industry: 'sales',
    label: 'Outreach & Prospecting',
    tone: 'Casual',
    body: `Hi {name}, great to connect!

Came across your profile — your experience in sales at {company} really caught my attention.

I'm Faraaz from CH Digital Solutions, and we've been looking at how sales professionals approach building meaningful client relationships in today's market.

Just curious — what do you think is the one thing most salespeople get wrong when reaching out to new prospects?

Would love to hear your take.`,
  },
  {
    id: 'sales_intro_2',
    industry: 'sales',
    label: 'Process & Strategy',
    tone: 'Friendly',
    body: `Hey {name},

Came across your profile — the kind of work you do as a {role} looks like it requires real skill in reading people and situations.

I'm Faraaz from CH Digital Solutions. We've been exploring how sales teams adapt their approach when the traditional methods stop working.

Wanted to ask — how do you personally handle it when a promising lead suddenly goes cold?

Would genuinely love to understand your process.`,
  },

  // ─── REAL ESTATE ─────────────────────────────────────────
  {
    id: 'realestate_intro_1',
    industry: 'real_estate',
    label: 'Client Journey',
    tone: 'Professional',
    body: `Hi {name}, great to connect!

Came across your profile — your work in real estate at {company} stood out, especially the kind of experience you've built over time.

I'm Faraaz from CH Digital Solutions, and we've been looking at how real estate professionals manage the entire client journey, from first contact to closing.

Just curious — what does your process look like when a new buyer first reaches out to you?

Would love to understand how things work in your space.`,
  },
  {
    id: 'realestate_intro_2',
    industry: 'real_estate',
    label: 'Market & Trust',
    tone: 'Casual',
    body: `Hi {name},

Came across your profile — the work you do in real estate at {company} looks like it requires a lot of trust-building, especially with first-time clients.

I'm Faraaz from CH Digital Solutions, exploring how professionals in competitive markets manage client expectations.

Just curious — in today's market, what's the one thing that makes a client choose you over another agent?

Genuinely want to understand what's working right now.`,
  },

  // ─── FINANCE ─────────────────────────────────────────────
  {
    id: 'finance_intro_1',
    industry: 'finance',
    label: 'Trust & First Conversations',
    tone: 'Professional',
    body: `Hi {name}, great to connect!

Came across your profile — your background in finance at {company} really stood out.

I'm Faraaz from CH Digital Solutions, and we've been looking at how finance professionals build trust with new clients, especially in today's fast-changing environment.

Just curious — what do you think is the hardest part about that initial conversation when someone is unsure about whether to trust their money with someone new?

Would really value your perspective on this.`,
  },
  {
    id: 'finance_intro_2',
    industry: 'finance',
    label: 'Client Education',
    tone: 'Friendly',
    body: `Hi {name},

Came across your profile — working as a {role} at {company} sounds like it requires both deep expertise and the ability to simplify complex things for clients.

I'm Faraaz from CH Digital Solutions, curious about how finance professionals approach client education — especially when clients don't fully understand financial products.

How do you usually handle it when a client is hesitant or confused about a decision?

Would genuinely love to learn from your experience.`,
  },

  // ─── MARKETING ───────────────────────────────────────────
  {
    id: 'marketing_intro_1',
    industry: 'marketing',
    label: 'Content & Strategy',
    tone: 'Casual',
    body: `Hey {name},

Came across your profile — your work in marketing at {company} immediately stood out.

I'm Faraaz from CH Digital Solutions, and we've been exploring how marketing teams are adapting their strategies as platforms and algorithms keep changing.

Just curious — when you're planning content, do you start with the audience insight or the platform format?

Would love to hear your creative process.`,
  },
  {
    id: 'marketing_intro_2',
    industry: 'marketing',
    label: 'Results & Measurement',
    tone: 'Professional',
    body: `Hi {name}, great to connect!

Came across your profile — your experience as a {role} at {company} in the marketing space really caught my attention.

I'm Faraaz from CH Digital Solutions, and I've been curious about how marketing professionals balance creative freedom with the pressure to show measurable results.

What does your process look like when a campaign underperforms — how do you diagnose what went wrong?

Would genuinely love to understand how you approach it.`,
  },
];

// ─── Industry Metadata ────────────────────────────────────
export const INDUSTRY_LABELS = {
  general: 'General', sales: 'Sales', travel: 'Travel',
  tech: 'Tech', design: 'Design', real_estate: 'Real Estate',
  finance: 'Finance', marketing: 'Marketing',
};

export const INDUSTRY_ICONS = {
  general: Globe,
  sales: Target,
  tech: Monitor,
  travel: Plane,
  real_estate: Home,
  finance: TrendingUp,
  marketing: Megaphone,
  design: Palette,
};

export const TONE_COLORS = {
  Friendly:     'text-amber-400 border-amber-500/30 bg-amber-500/10',
  Professional: 'text-blue-400  border-blue-500/30  bg-blue-500/10',
  Casual:       'text-green-400 border-green-500/30 bg-green-500/10',
  Custom:       'text-purple-400 border-purple-500/30 bg-purple-500/10',
};

export const INDUSTRIES = Object.keys(INDUSTRY_LABELS);

export const fillTemplate = (body = '', lead = {}) =>
  body
    .replace(/\{name\}/g,    lead.name    || 'there')
    .replace(/\{company\}/g, lead.company || 'your company')
    .replace(/\{role\}/g,    lead.role    || 'your role');
