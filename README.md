# PennyWise

PennyWise is a responsive, dependency-free prototype for everyday budgeting and shared money planning. It brings budget tracking, sample grocery cashback and travel offers, holiday savings, household bills, IOU notes, and demo-only money assistant concepts into one place.

https://www.canva.com/design/DAHXqBH4RYM/AgU4uyei79Aai9GXTteQdA/edit


## Start the website (no compiling needed)

This is a static website: the browser runs the HTML, CSS, and JavaScript directly. You do not need to install Node.js, download packages, or build/compile anything.

### Easiest: open it in your browser

1. Find `index.html` in the project folder.
2. Double-click it. It should open in your default web browser.
3. Try the menu on the left. On a phone-sized window, use the menu button in the top-left.

### Alternative: run a local web server

Use this if opening the file directly does not work as expected:

1. In VS Code, choose **Terminal → New Terminal** from the menu.
2. In the terminal at the bottom of VS Code, enter this command and press Return:

   ```sh
   python3 -m http.server 4173
   ```

3. Open a browser and go to `http://localhost:4173`.
4. Keep the terminal open while using the website. To stop the server, click the terminal and press **Control+C**.

If you see “python3: command not found”, use the first method or ask for help installing Python.

### If the page looks unstyled or buttons do nothing

Make sure `index.html`, `styles.css`, and `app.js` are all together in the same project folder. Refresh the browser page after saving changes in VS Code.

## Prototype behavior

- Navigate between Overview, Budget, Deals & rewards, Trips & goals, Shared home, Money owed, and Money sidekick.
- Add expenses and IOU notes; changes update the current page in memory.
- Save and unsave sample deals.
- Use the mobile menu on smaller screens.
- Try the sample assistant cards to see example responses.

The app uses illustrative data and does not connect to banks, merchants, transport providers, calendars, messaging, AI services, or files. It does not make payments, send invites, book travel, submit forms, or change documents. Data entered into forms is not persisted after a page reload.
