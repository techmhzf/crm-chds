(function () {
  if (document.getElementById('chds-save-btn')) return;

  const btn = document.createElement('button');
  btn.id = 'chds-save-btn';
  btn.textContent = 'Save to CRM';
  document.body.appendChild(btn);

  function setBtn(text, cls, delay) {
    btn.textContent = text;
    btn.className = cls || '';
    btn.disabled = cls === 'saving';
    if (delay) setTimeout(() => { btn.textContent = 'Save to CRM'; btn.className = ''; btn.disabled = false; }, delay);
  }

  btn.addEventListener('click', () => {
    setBtn('Saving...', 'saving');

    // ── NAME ──────────────────────────────────────────────
    // LinkedIn page title is always: "First Last | LinkedIn" or "First Last - Role | LinkedIn"
    const titleName = document.title.split(/[|\-–]/)[0].trim();
    const name =
      document.querySelector('h1')?.innerText?.trim() ||
      (titleName && titleName !== 'LinkedIn' ? titleName : null) ||
      'Unknown';

    // ── ROLE (Headline) ───────────────────────────────────
    // Try multiple selectors LinkedIn uses across different versions
    const role =
      document.querySelector('.text-body-medium.break-words')?.innerText?.trim() ||
      document.querySelector('.pv-text-details__left-panel .text-body-medium')?.innerText?.trim() ||
      document.querySelector('.ph5 .text-body-medium')?.innerText?.trim() ||
      document.querySelector('[data-generated-suggestion-target] span[aria-hidden="true"]')?.innerText?.trim() ||
      // Fallback: parse from page title "Name - Role at Company | LinkedIn"
      (document.title.includes(' - ') ? document.title.split(' - ')[1]?.split('|')[0]?.trim() : '') ||
      '';

    // ── COMPANY ───────────────────────────────────────────
    // First try: parse "@ Company" or "at Company" from the headline
    let company = '';
    const atMatch = role.match(/(?:@|at)\s+([^|,\n]+)/i);
    const pipeMatch = role.match(/\|\s*([^|,\n]+)/);
    if (atMatch) {
      company = atMatch[1].trim();
    } else if (pipeMatch) {
      company = pipeMatch[1].trim();
    } else {
      // Second try: experience section
      company =
        document.querySelector('.pvs-list__item--line-separated .hoverable-link-text span[aria-hidden="true"]')?.innerText?.trim() ||
        document.querySelector('[data-field="experience"] .t-bold span[aria-hidden="true"]')?.innerText?.trim() ||
        document.querySelector('.pv-top-card--experience-list .pv-entity__secondary-title')?.innerText?.trim() ||
        '';
    }

    const linkedinUrl = window.location.href.split('?')[0];
    const lead = { name, role, company, linkedinUrl, status: 'connected', industry: 'other' };

    // Send to background worker — avoids any context invalidation issues
    try {
      chrome.runtime.sendMessage({ type: 'save_lead', lead }, (response) => {
        // Handle: extension context lost
        if (chrome.runtime.lastError || !response) {
          setBtn('Reload page → try again', 'error', 3000);
          return;
        }

        if (response.success) {
          if (response.created === false) {
            setBtn('Already in CRM', 'saved', 2500);
          } else {
            setBtn('Saved to CRM!', 'saved', 2500);
          }
        } else if (response.error === 'not_logged_in') {
          setBtn('Login in extension first', 'error', 3000);
        } else if (response.error === 'unauthorized') {
          setBtn('Session expired — re-login', 'error', 3000);
        } else if (response.error === 'backend_offline') {
          setBtn('Backend offline', 'error', 3000);
        } else {
          setBtn(response.error || 'Error', 'error', 3000);
        }
      });
    } catch {
      setBtn('Reload page → try again', 'error', 3000);
    }
  });
})();
