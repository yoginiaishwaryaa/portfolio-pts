# Portfolio

A modern, responsive portfolio website built with React, TypeScript, and Vite.

## Tech Stack

- **Framework**: React 18
- **Language**: TypeScript
- **Build Tool**: Vite
- **Styling**: CSS

## Features

- Interactive UI with custom cursor
- Animated mascot character
- Navigation menu
- Hero section
- Projects showcase
- Publications section
- Skills display
- Contact information

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn

### Installation

1. Clone the repository
2. Install dependencies:

```bash
npm install
```

### Development

Start the development server:

```bash
npm run dev
```

The site will be available at `http://localhost:5173`

### Build

Build for production:

```bash
npm run build
```

Preview the production build:

```bash
npm run preview
```

## Deploying to GitHub Pages

Follow these steps to deploy your portfolio to GitHub Pages:

### Step 1: Install GitHub Pages Plugin

Install the gh-pages package as a dev dependency:

```bash
npm install gh-pages --save-dev
```

### Step 2: Configure Vite Base URL

Edit `vite.config.ts` and add the `base` property so Vite knows your site lives in a subfolder:

```typescript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  base: '/YOUR-REPO-NAME/',  // ← Replace with your repo name
  plugins: [react()],
})
```

Replace `YOUR-REPO-NAME` with your actual GitHub repository name (e.g., `/portfolio-pts/`).

### Step 3: Update Build Scripts

Add deployment scripts to `package.json`:

```json
"scripts": {
  "dev": "vite",
  "build": "tsc && vite build",
  "predeploy": "npm run build",
  "deploy": "gh-pages -d dist"
}
```

### Step 4: Create and Push to GitHub

From inside the `portfolio-pts` folder:

```bash
git init
git add .
git commit -m "initial commit"
git branch -M main
git remote add origin https://github.com/YOUR-USERNAME/YOUR-REPO-NAME.git
git push -u origin main
```

> **Note**: Create an empty repository first at [github.com/new](https://github.com/new). Keep it **public** and do NOT initialize with a README.

Replace `YOUR-USERNAME` and `YOUR-REPO-NAME` with your GitHub username and repository name.

### Step 5: Deploy Your Site

Build and deploy your portfolio:

```bash
npm run deploy
```

This command builds your site and automatically pushes it to the `gh-pages` branch.

### Step 6: Enable GitHub Pages

1. Go to your repository on GitHub
2. Navigate to **Settings → Pages**
3. Under **Branch**, select `gh-pages` and `/ (root)`
4. Click **Save**

Your site will be live at: `https://YOUR-USERNAME.github.io/YOUR-REPO-NAME/`

> **Tip**: It typically takes 1–2 minutes for the first deployment to go live. After that, simply run `npm run deploy` whenever you make changes.

## License

See LICENSE file for details.
