# uhlar-pup

A web scraper for vademecum.nacr.cz that captures full-page screenshots of documents.

## Requirements

- Windows Subsystem for Linux (WSL2)
- Bun runtime
- Chromium dependencies

## Installation Guide

### 1. Install WSL2 (Windows only)
```powershell
# Open PowerShell as Administrator and run:
wsl --install
```
Restart your computer after installation.

### 2. Install Bun
```bash
# Inside WSL2 terminal:
curl -fsSL https://bun.sh/install | bash
```

### 3. Install Chromium Dependencies (WSL2/Linux)
```bash
# Inside WSL2 terminal:
sudo apt update
sudo apt install -y ca-certificates \
    fonts-liberation \
    libasound2 \
    libatk-bridge2.0-0 \
    libatk1.0-0 \
    libc6 \
    libcairo2 \
    libcups2 \
    libdbus-1-3 \
    libexpat1 \
    libfontconfig1 \
    libgbm1 \
    libgcc1 \
    libglib2.0-0 \
    libgtk-3-0 \
    libnspr4 \
    libnss3 \
    libpango-1.0-0 \
    libpangocairo-1.0-0 \
    libstdc++6 \
    libx11-6 \
    libx11-xcb1 \
    libxcb1 \
    libxcomposite1 \
    libxcursor1 \
    libxdamage1 \
    libxext6 \
    libxfixes3 \
    libxi6 \
    libxrandr2 \
    libxrender1 \
    libxss1 \
    libxtst6 \
    lsb-release \
    wget \
    xdg-utils
```

### 4. Clone and Setup Project
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

1. Make sure all Chromium dependencies are installed
2. Check that WSL2 is properly configured (Windows users)
3. Verify your internet connection
4. Ensure you have sufficient disk space for screenshots

## Notes

- The scraper runs in headless mode by default
- Screenshots are saved in the `downloads` directory
- Each screenshot is taken in full-screen mode for best quality
