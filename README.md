# METZGER 72 Sports Ticker

## How to Open the Ticker

### Recommended: Use a Local Web Server
Browsers may show the file location bar for local files due to security reasons. For the best experience, run a local web server:

#### Using Python (if installed)
1. Open a terminal in the `rss-ticker` folder.
2. Run:
   ```
   python -m http.server 8080
   ```
3. Open your browser and go to:
   ```
   http://localhost:8080/launcher.html
   ```

#### Using Node.js (if installed)
1. Install `serve` globally:
   ```
   npm install -g serve
   ```
2. Run:
   ```
   serve .
   ```
3. Open your browser and go to the provided local address (e.g., `http://localhost:5000/launcher.html`).

### Direct File Opening (with limitations)
1. Double-click `launcher.html` in the project folder.
2. The ticker will automatically open in a new minimal window.
3. Note: The file location bar may still be visible due to browser security.

## Features
- Real-time scores for major US sports (via ESPN unofficial API)
- Smooth scrolling ticker
- Minimal window with close button
- Automatic refresh and restart

## Customization
- Edit `src/app.js` to change sports or update logic.
- Edit `src/index.html` for style tweaks.

---
Created by METZGER 72
