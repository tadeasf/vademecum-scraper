# uhlar-pup

A web scraper for vademecum.nacr.cz that captures full-page screenshots of documents.

## Requirements

- Node.js and npm (for Puppeteer)
- Bun runtime
- Chrome/Chromium browser

## Installation Guide

### 1. Install Bun

```powershell
# Using PowerShell:
curl https://bun.sh/install | bash

# Or using npm:
npm install -g bun
```

### 2. Install Chrome

If you don't have Chrome installed, download and install it from:
`https://www.google.com/chrome/`

### 3. Clone and Setup Project

```bash
# Clone the repository
git clone https://github.com/yourusername/uhlar-pup.git
cd uhlar-pup

# Install dependencies
bun install
```

## Usage

1. Configure the URL:
   - Open `src/index.ts`
   - Modify the `startUrl` variable to point to your desired vademecum.nacr.cz document
   - Adjust the page count in `scrapePages(401, startUrl)` if needed

2. Run the scraper:

```bash
bun run index.ts
```

## How It Works

The scraper performs the following steps for each page:

1. Navigates to the specified vademecum.nacr.cz document
2. Expands the document viewer to full screen
3. Takes a high-quality screenshot of the entire page
4. Saves the screenshot to the `downloads` directory
5. Navigates to the next page using the navigation button
6. Repeats until all pages are captured

Screenshots are saved as PNG files named `page_1.png`, `page_2.png`, etc.

## Troubleshooting

If you encounter any issues:

1. Make sure Chrome is installed
2. Verify your internet connection
3. Ensure you have sufficient disk space for screenshots
4. If you get permission errors, try running the terminal as administrator

## Notes

- The scraper runs in headless mode by default
- Screenshots are saved in the `downloads` directory
- Each screenshot is taken in full-screen mode for best quality
