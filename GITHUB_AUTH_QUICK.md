# Quick GitHub Authentication & Push

Run this in PowerShell to authenticate and push your code to GitHub:

## Step 1: Create a GitHub Personal Access Token

1. Go to: https://github.com/settings/tokens
2. Click "Generate new token (classic)"
3. Name: "Stumarto Deployment"
4. Select scope: `repo` (check the box)
5. Click "Generate token"
6. **Copy the token** (you'll use it once, then it's gone)

## Step 2: Configure Git & Push

In your VS Code terminal (in the workspace root):

```powershell
# Set git to store credentials temporarily
git config --global credential.helper wincred

# Try pushing (you'll be prompted for credentials)
git push origin main

# When prompted:
# Username: (your GitHub username)
# Password: (paste the token from Step 1)
```

If that doesn't work, try this one-liner:

```powershell
git push "https://(your-github-username):(your-token)@github.com/sujaeet-sharmas/stumarto---school-marketplace.git" main
```

Replace:
- `(your-github-username)` with your actual GitHub username
- `(your-token)` with the PAT token from Step 1

## Step 3: Verify Push

Once pushed, check:
```powershell
git log --oneline -1   # should show: "feat: add Supabase integration..."
```

And visit: https://github.com/sujaeet-sharmas/stumarto---school-marketplace

You should see the new files:
- `.render.yaml`
- `backend/init_supabase.sql`
- Updated `backend/README.md` and `backend/controllers/auth.controller.js`
