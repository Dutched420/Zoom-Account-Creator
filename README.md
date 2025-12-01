# Zoom Account Creator (Electron + Puppeteer)

A desktop application built with Electron, Puppeteer, and MailJS that automatically creates Zoom accounts using a temporary email address. Includes a dark modern UI, click-to-copy functionality, and full automation.

---

## Features

- Automated Zoom account creation
- Temporary email generation (MailJS)
- Puppeteer Stealth Mode (avoids detection)
- Custom first name, last name, birth year, and password
- Saves all generated accounts into accounts.json
- Click any field to instantly copy
- Fully local desktop app
- Builds into a standalone Windows executable


## Building the Windows Executable

This project uses electron-builder.

To build:

npm run build

Output will be in:

dist/

---

## Account Storage

All generated accounts are saved automatically in:

accounts.json

Each entry includes:
- Account name
- Email address
- Email password
- Zoom password
- Creation date
- Working status

---

## Disclaimer

This software is provided for educational and research purposes only.  
The author is not associated with Zoom, nor is this tool endorsed by Zoom Communications.  
You are responsible for how you use this software.

---

## License

MIT License  
© 2025 John Galvenstone
