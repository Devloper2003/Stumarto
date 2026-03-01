Railway deployment helper

What this adds
- A GitHub Actions workflow at `.github/workflows/deploy-railway.yml` that builds the app and runs the Railway CLI to deploy.
- A local PowerShell helper `scripts/deploy-railway.ps1` to build and push using the Railway CLI.

Before you deploy (required)
1. Create a Railway project and note its Project ID.
2. Create a Railway API token (Settings → API Keys).
3. Add the following GitHub repository secrets:
   - `RAILWAY_TOKEN` — your Railway API token
   - `RAILWAY_PROJECT_ID` — the Railway project id

Deploy via GitHub Actions
1. Push to `main` or `master` branch. The workflow will build and run `railway up`.

Deploy locally
1. Install Railway CLI: `npm i -g @railway/cli`
2. Run: `.\scripts\deploy-railway.ps1 -ProjectId <your-project-id>`

Notes
- CI uses `npm ci` and `npm run build`. Ensure your repo includes any needed secrets (e.g., `MONGODB_URI`) in Railway environment variables.
- The backend server uses `process.env.PORT` and will serve the built frontend when available.
