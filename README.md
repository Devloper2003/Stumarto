# 🏪 Stumarto - School Marketplace

> An AI-powered school marketplace platform built with React, TypeScript, and Vite

## Features

✨ **AI-Powered Features:**
- Intelligent product recommendations using Google Gemini AI
- Smart search and filtering
- AI-assisted seller dashboard

🛍️ **Marketplace Features:**
- User authentication (Login/Signup)
- Product browsing and details
- Shopping cart & checkout
- Order tracking
- Seller dashboard
- Product reviews
- Admin panel

## Quick Start

### Prerequisites
- Node.js 18+ 
- npm or yarn
- Google Gemini API key

### Installation

```bash
# Install dependencies
npm install

# Set up environment variables
# Copy .env.local and add your Gemini API key
GEMINI_API_KEY=your_api_key_here

# Run locally
npm run dev

# Build for production
npm run build

# Preview build
npm run preview
```

## GitHub Pages Deployment

### Automatic Deployment (Recommended)
1. Push to GitHub repository
2. GitHub Actions automatically builds and deploys to GitHub Pages
3. Your site will be live at: `https://username.github.io/stumarto/`

### Manual Setup Steps

1. **Create GitHub Repository**
   - Go to https://github.com/new
   - Name: `stumarto`
   - Don't initialize with files

2. **Push Code**
   ```bash
   git remote add origin https://github.com/YOUR_USERNAME/stumarto.git
   git branch -M main
   git push -u origin main
   ```

3. **Configure GitHub Pages**
   - Settings → Pages
   - Deploy from: Branch
   - Branch: `gh-pages`

4. **Add Secrets**
   - Settings → Secrets and variables → Actions
   - Add `GEMINI_API_KEY` secret

5. **Deploy**
   ```bash
   # Automatic: Just push to main
   git push origin main
   
   # Or manual:
   npm run deploy
   ```

For detailed setup, see [DEPLOYMENT.md](DEPLOYMENT.md)

## Project Structure

```
stumarto/
├── pages/              # Page components
├── services/          # API services (Gemini)
├── App.tsx           # Main component
├── main.html         # Entry HTML
├── vite.config.ts    # Vite configuration
└── .github/workflows # CI/CD pipeline
```

## Tech Stack

- **Frontend:** React 19 + TypeScript
- **Build:** Vite
- **Styling:** Tailwind CSS
- **Routing:** React Router v7
- **AI:** Google Gemini API
- **Deployment:** GitHub Pages

## Environment Variables

```env
GEMINI_API_KEY=your_google_gemini_api_key
```

## Scripts

```bash
npm run dev       # Start development server
npm run build     # Build for production
npm run preview   # Preview production build
npm run deploy    # Deploy to GitHub Pages
```

## License

MIT

## Support

For issues and questions, open an issue on GitHub.

---

**Made with ❤️ for the school marketplace community**
