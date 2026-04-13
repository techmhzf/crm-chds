# CHDS CRM — Chrome Extension

## How to Load in Chrome

1. Open Chrome → go to `chrome://extensions`
2. Enable **Developer mode** toggle (top right corner)
3. Click **Load unpacked**
4. Select the `chrome-extension` folder from this project
5. The extension icon will appear in your Chrome toolbar

## First-Time Setup

1. Click the **CHDS CRM** extension icon in the toolbar
2. Log in with your CRM credentials (same email/password as the web app)
3. You'll see a green "Logged in" confirmation

## Using the Extension

1. Go to any LinkedIn profile (`linkedin.com/in/username`)
2. The **"Save to CRM"** button appears in the bottom-right corner
3. Click it — the lead is saved instantly with their name, role, and company
4. Button turns green with "Saved! ✓" confirmation

## Button States

| State | Meaning |
|-------|---------|
| `Save to CRM` | Ready to save |
| `Saved! ✓` (green) | Successfully saved |
| `Login to CRM first` (red) | Not logged in — open popup to sign in |
| `Error — try again` (red) | API error or duplicate lead |

## Requirements

- CRM backend must be running on `http://localhost:5000`
- Works only on `linkedin.com/in/*` profile pages
- For production: change `localhost:5000` in `content.js` and `popup.js` to your deployed backend URL
