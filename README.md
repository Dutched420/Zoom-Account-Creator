Zoom Account Creator (Electron + Puppeteer)

A desktop application built with Electron, Puppeteer, and MailJS that automatically creates new Zoom accounts using a temporary email address.
Includes a modern dark UI, click-to-copy saved accounts, and full automation.

✨ Features

🔹 Automated Zoom account creation

🔹 Temporary email generation (MailJS)

🔹 Puppeteer Stealth Mode (avoids detection)

🔹 Modern dark UI with sidebar navigation

🔹 Custom first name, last name, birth year, password

🔹 Saves all generated accounts to accounts.json

🔹 Click any field to instantly copy

🔹 Fully local, no backend required

🔹 Builds into a standalone Windows app

📂 Project Structure
ZoomCreator-App/
 ├─ automation/
 │   └─ zoom.js
 ├─ functions/
 │   └─ createAccount.js
 ├─ renderer/
 │   ├─ index.html
 │   └─ renderer.js
 ├─ assets/
 │   └─ icon.png
 ├─ preload.cjs
 ├─ main.js
 ├─ accounts.json (auto-generated)
 ├─ package.json
 └─ README.md

🚀 Development Setup

Clone the repository:

git clone https://github.com/YOUR_USERNAME/Zoom-Account-Creator.git
cd Zoom-Account-Creator


Install dependencies:

npm install


Start the app:

npm start

🏗️ Build Windows Executable

This project uses electron-builder to package releases.

Build for Windows:

npm run build


The installer and unpacked app will be created in:

dist/

💾 Account Storage

All created accounts are saved automatically in:

accounts.json


Each entry includes:

Account name

Email address

Temp email password

Zoom password

Creation date

Working status

⚠️ Disclaimer

This project is intended for educational and research purposes only.

You are responsible for your use of this software.
The author is not associated with Zoom, nor is this tool endorsed by Zoom Communications.

📜 License

MIT License
© 2025 John Galvenstone
