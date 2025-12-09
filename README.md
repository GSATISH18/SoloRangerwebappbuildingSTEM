# SoloRangerwebappbuildingSTEM
Web App Building STEM Carnival  2025
SoloRanger – STEM Resource Finder & Lab Status Hub

SoloRanger – STEM Resource Finder & Lab Status Hub

Group Name: SoloRanger  
Admin Password: soloranger

SoloRanger is a simple front-end web app that helps students discover STEM labs, equipment, and software on campus, and quickly check whether they are available, busy, or under maintenance.

The app also includes an Admin Mode so authorised users can update resources directly from the browser.

------------------------------------------------------------

1. Project Files

This project uses only HTML, CSS, and vanilla JavaScript.

- index.html – Main app: STEM Resource Finder & Lab Status Hub  
- login.html – Student login / sign-up page (flip-card UI)  
- styles.css – All styling for both pages  
- app.js – Front-end logic (data model, filtering, admin mode, CRUD)

------------------------------------------------------------

2. How to Run

No backend is required – everything runs in the browser.

Option A – Live Server (recommended)  
1. Open the folder in VS Code.  
2. Install and enable the Live Server extension.  
3. Right-click login.html → Open with Live Server.

Option B – Open Directly  
1. Double-click login.html or open it with any modern browser.  
2. Login / sign-up will redirect you to index.html.

Flow:  
login.html (student login) → redirects to index.html (main app)

------------------------------------------------------------

3. login.html – Student Login / Sign-Up

- Full-screen animated bookshelf-style background (handled by body.login-bg in styles.css).
- Flip-card UI:
  - Front: Log in (Student ID, Password)
  - Back: Sign up (Name, Student ID, Password)
- Both forms are handled using small JavaScript functions that prevent default submission and redirect to index.html.

Example logic:
function handleLogin(e) {
  e.preventDefault();
  window.location.href = "index.html";
}

function handleSignup(e) {
  e.preventDefault();
  window.location.href = "index.html";
}

There is no real authentication yet – this page acts as a visual gateway to the main application.

------------------------------------------------------------

4. index.html – STEM Resource Finder

The main page shows a searchable and filterable list of labs, equipment, and software.

4.1 Features

- Search bar filters by name, location, and tags.
- Type filter for Labs, Equipment, Software, or All.
- Colour legend:
  - Green – Available
  - Orange – Busy / Crowded
  - Red – Under Maintenance
- Resource cards display:
  - Name
  - Type
  - Location
  - Status pill with colour
  - Tags
  - Optional “Open Resource” button linking to external websites.

------------------------------------------------------------

4.2 Data Model (app.js)

Resources are stored in a front-end array inside app.js.

Each resource contains:
- id  
- name  
- type (lab, equipment, software)  
- location  
- status (available, busy, maintenance)  
- tags  
- optional link to an external resource  

Filtering and rendering are handled by the renderResources() function.

------------------------------------------------------------

5. Admin Mode

Admin Mode allows authorised users to update and manage resources.

5.1 Turning Admin Mode On / Off

- Admin Mode button is located at the top of index.html.
- When switching on:
  - The user is prompted for a password.
  - If the password matches “soloranger”, admin mode is enabled.

When Admin Mode is ON:
- Admin background image is applied.
- Create New Resource panel becomes visible.
- Resource cards show:
  - Status dropdown
  - Edit button

When Admin Mode is OFF:
- Admin tools and panels are hidden.
- Page returns to student view.

------------------------------------------------------------

5.2 Editing Resources

In Admin Mode:
- Status can be updated directly from a dropdown on each card.
- Clicking Edit opens an edit form inside the card.
- Admin can change name, type, location, tags, link, and status.
- Save applies changes.
- Cancel discards changes.

------------------------------------------------------------

5.3 Creating New Resources

Admins can create new resources using the Create New Resource panel.

Required fields:
- Name
- Location

Optional fields:
- Type
- Tags
- External resource link

New resources are added to the list dynamically and displayed immediately.

------------------------------------------------------------

6. Styling Overview (styles.css)

- Global styles for typography and layout.
- Separate background styles for:
  - Student view
  - Admin view
  - Login page
- Glassmorphism effect for main app panel and cards.
- Flip-card animation and styling for the login and sign-up page.

------------------------------------------------------------

7. Limitations

- No real authentication or database.
- Admin password is hard-coded.
- Data does not persist after page refresh.
- Single-page front-end demonstration only.
