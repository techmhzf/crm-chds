// ============================================================
// CHDS CRM — Background Service Worker
// Handles all API calls and storage so content scripts
// never lose access even after extension reload
// ============================================================

const API = 'https://crm-chds.onrender.com/api';

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === 'login') {
    handleLogin(message.email, message.password, sendResponse);
    return true;
  }
  if (message.type === 'logout') {
    chrome.storage.local.remove(['token', 'user']);
    sendResponse({ success: true });
    return true;
  }
  if (message.type === 'get_auth') {
    chrome.storage.local.get(['token', 'user'], sendResponse);
    return true;
  }
  if (message.type === 'save_lead') {
    handleSaveLead(message.lead, sendResponse);
    return true;
  }
});

async function handleLogin(email, password, sendResponse) {
  try {
    const res = await fetch(`${API}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
    const data = await res.json();
    if (!res.ok) {
      sendResponse({ error: data.message || 'Login failed' });
      return;
    }
    await chrome.storage.local.set({ token: data.token, user: data.user });
    sendResponse({ success: true, user: data.user });
  } catch {
    sendResponse({ error: 'Backend offline — is http://localhost:5000 running?' });
  }
}

async function handleSaveLead(lead, sendResponse) {
  try {
    const { token } = await chrome.storage.local.get(['token']);
    if (!token) {
      sendResponse({ error: 'not_logged_in' });
      return;
    }
    // Use /upsert — idempotent: returns existing lead instead of duplicating
    const res = await fetch(`${API}/leads/upsert`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(lead),
    });
    if (res.ok) {
      const data = await res.json();
      // data.created = true (new) | false (already existed)
      sendResponse({ success: true, lead: data.lead, created: data.created });
    } else if (res.status === 401) {
      await chrome.storage.local.remove(['token', 'user']);
      sendResponse({ error: 'unauthorized' });
    } else {
      const data = await res.json().catch(() => ({}));
      sendResponse({ error: data.message || `Server error ${res.status}` });
    }
  } catch {
    sendResponse({ error: 'backend_offline' });
  }
}
