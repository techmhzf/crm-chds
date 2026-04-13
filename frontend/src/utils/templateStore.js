// ============================================================
// Template Store — Manages default + custom templates
// Storage: localStorage ('chds_templates')
// ============================================================

const STORAGE_KEY = 'chds_templates';

const load = () => {
  try { return JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}'); }
  catch { return {}; }
};

const save = (data) => localStorage.setItem(STORAGE_KEY, JSON.stringify(data));

// Get all edits and custom templates from localStorage
const getStored = () => load();

// Get effective body for a default template (may be overridden)
export const getOverride = (id) => {
  const stored = getStored();
  return stored.overrides?.[id] ?? null;
};

// Save an edited version of a default template
export const saveOverride = (id, body) => {
  const stored = getStored();
  if (!stored.overrides) stored.overrides = {};
  stored.overrides[id] = body;
  save(stored);
};

// Reset a default template back to original
export const resetOverride = (id) => {
  const stored = getStored();
  if (stored.overrides) { delete stored.overrides[id]; save(stored); }
};

// Get all custom (user-created) templates
export const getCustomTemplates = () => {
  return getStored().custom || [];
};

// Add a brand-new custom template
export const addCustomTemplate = (template) => {
  const stored = getStored();
  if (!stored.custom) stored.custom = [];
  const newTemplate = {
    ...template,
    id: `custom_${Date.now()}`,
    isCustom: true,
  };
  stored.custom.push(newTemplate);
  save(stored);
  return newTemplate;
};

// Update an existing custom template
export const updateCustomTemplate = (id, changes) => {
  const stored = getStored();
  if (!stored.custom) return;
  stored.custom = stored.custom.map((t) => (t.id === id ? { ...t, ...changes } : t));
  save(stored);
};

// Delete a custom template
export const deleteCustomTemplate = (id) => {
  const stored = getStored();
  if (!stored.custom) return;
  stored.custom = stored.custom.filter((t) => t.id !== id);
  save(stored);
};

// Get all templates (defaults with overrides applied + custom)
export const getAllEffectiveTemplates = (defaults) => {
  const stored = getStored();
  const overrides = stored.overrides || {};
  const custom = stored.custom || [];

  const effectiveDefaults = defaults.map((t) => ({
    ...t,
    body: overrides[t.id] !== undefined ? overrides[t.id] : t.body,
    isOverridden: overrides[t.id] !== undefined,
    originalBody: t.body,
  }));

  return [...effectiveDefaults, ...custom];
};

// Get effective templates for a specific industry (for the modal)
export const getEffectiveTemplatesForIndustry = (defaults, industry) => {
  const all = getAllEffectiveTemplates(defaults);
  const industryOnes = all.filter((t) => t.industry === industry);
  const general = all.filter((t) => t.industry === 'general');
  return industryOnes.length > 0 ? [...industryOnes, ...general] : general;
};
