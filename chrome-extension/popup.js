const app = document.getElementById('app');

function showLogin(errorMsg) {
  app.innerHTML = `
    <label>Email</label>
    <input type="email" id="email" placeholder="you@example.com" />
    <label>Password</label>
    <input type="password" id="password" placeholder="••••••••" />
    <button class="btn-primary" id="login-btn">Sign in</button>
    ${errorMsg ? `<p class="error-msg">${errorMsg}</p>` : ''}
  `;

  // Allow Enter key to submit
  document.getElementById('password').addEventListener('keydown', (e) => {
    if (e.key === 'Enter') document.getElementById('login-btn').click();
  });

  document.getElementById('login-btn').addEventListener('click', () => {
    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value;
    if (!email || !password) return;

    const btn = document.getElementById('login-btn');
    btn.textContent = 'Signing in...';
    btn.disabled = true;

    // Login via background worker
    chrome.runtime.sendMessage({ type: 'login', email, password }, (response) => {
      if (chrome.runtime.lastError || !response) {
        showLogin('Extension error — try reloading');
        return;
      }
      if (response.error) {
        showLogin(response.error);
      } else {
        showLoggedIn(response.user);
      }
    });
  });
}

function showLoggedIn(user) {
  app.innerHTML = `
    <div class="status-row">
      <div class="green-dot"></div>
      <div>
        <div class="user-name">${user.name}</div>
        <div class="user-email">${user.email}</div>
      </div>
    </div>
    <p class="hint">Go to any LinkedIn profile<br>(<strong style="color:#fff">linkedin.com/in/username</strong>)<br>and click <strong style="color:#fff">"Save to CRM"</strong></p>
    <button class="btn-secondary" id="logout-btn">Logout</button>
  `;
  document.getElementById('logout-btn').addEventListener('click', () => {
    chrome.runtime.sendMessage({ type: 'logout' }, () => showLogin());
  });
}

// On popup open — check auth via background
chrome.runtime.sendMessage({ type: 'get_auth' }, (result) => {
  if (chrome.runtime.lastError || !result) {
    showLogin('Extension error — try reloading');
    return;
  }
  if (result.token && result.user) {
    showLoggedIn(result.user);
  } else {
    showLogin();
  }
});
