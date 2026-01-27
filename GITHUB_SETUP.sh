#!/bin/bash

# Stumarto - Quick GitHub Setup & Deployment Script
# Run this script to connect to GitHub and deploy

echo "🚀 Stumarto GitHub Setup Script"
echo "================================="
echo ""

# Check if git is initialized
if [ ! -d .git ]; then
    echo "❌ Git is not initialized. Please run 'git init' first."
    exit 1
fi

# Get GitHub username and repo name
read -p "📝 Enter your GitHub username: " GITHUB_USERNAME
read -p "📝 Enter your desired repository name (default: stumarto): " REPO_NAME
REPO_NAME=${REPO_NAME:-stumarto}

GITHUB_URL="https://github.com/$GITHUB_USERNAME/$REPO_NAME.git"

echo ""
echo "📌 Steps to complete deployment:"
echo "================================="
echo ""
echo "1️⃣  Create a new repository on GitHub:"
echo "    - Go to https://github.com/new"
echo "    - Repository name: $REPO_NAME"
echo "    - Choose Public or Private"
echo "    - DO NOT initialize with README, .gitignore, or license"
echo "    - Click 'Create repository'"
echo ""
echo "2️⃣  Add GitHub remote (run these commands):"
echo "    git remote add origin $GITHUB_URL"
echo "    git branch -M main"
echo "    git push -u origin main"
echo ""
echo "3️⃣  Configure GitHub Pages:"
echo "    - Go to Settings > Pages"
echo "    - Select 'Deploy from a branch'"
echo "    - Choose branch: 'gh-pages'"
echo "    - Click Save"
echo ""
echo "4️⃣  Add API Secret:"
echo "    - Go to Settings > Secrets and variables > Actions"
echo "    - Click 'New repository secret'"
echo "    - Name: GEMINI_API_KEY"
echo "    - Value: [Your Gemini API Key]"
echo "    - Click 'Add secret'"
echo ""
echo "5️⃣  View deployment status:"
echo "    - Go to Actions tab"
echo "    - Monitor the workflow"
echo ""
echo "✅ After deployment, your site will be at:"
echo "   https://$GITHUB_USERNAME.github.io/$REPO_NAME/"
echo ""
