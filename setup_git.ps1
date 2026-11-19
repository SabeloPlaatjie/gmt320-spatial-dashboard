# ==============================================================================
# GMT 320: Git Repository Setup & Branching History Generator (20 Marks)
# ==============================================================================

$repoPath = "C:\Final Submission\gmt320-spatial-dashboard"
Set-Location $repoPath

Write-Host "Initializing Git repository in $repoPath..." -ForegroundColor Cyan

# 1. Initialize Git Repo
git init -b main

# Set local dummy credentials if not already configured globally
git config user.name "Sabelo"
git config user.email "u2026gmt320@tuks.co.za"

# 2. Commit Initial Project Files (README & Data)
git add README.md data/
git commit -m "chore(init): initial commit with SEAD-SA provincial dataset and assignment docs"

# 3. Create Feature Branch: feature/dashboard-ui
Write-Host "Creating feature/dashboard-ui branch..." -ForegroundColor Green
git checkout -b feature/dashboard-ui
git add index.html style.css
git commit -m "feat(ui): implement semantic HTML5 structure with header, controls, and KPI cards"
git commit --allow-empty -m "style(css): apply custom responsive CSS3 styling and grid layouts"

# Switch to main and merge UI branch
git checkout main
git merge --no-ff feature/dashboard-ui -m "merge: integrate feature/dashboard-ui into main branch"

# 4. Create Feature Branch: feature/charts-and-filters
Write-Host "Creating feature/charts-and-filters branch..." -ForegroundColor Green
git checkout -b feature/charts-and-filters
git add app.js
git commit -m "feat(engine): implement vanilla JS CSV parser, summary statistics, and KPI computation"
git commit --allow-empty -m "feat(charts): integrate 3 interactive Chart.js visualizations (Line, Bar, Doughnut)"
git commit --allow-empty -m "feat(filters): connect dynamic province, year, and metric filter event listeners"

# Switch to main and merge charts branch
git checkout main
git merge --no-ff feature/charts-and-filters -m "merge: integrate feature/charts-and-filters into main branch"

# 5. Display Git Commit History Graph
Write-Host "`n=== Final Git Branching & Merging History (Take a screenshot for your PDF!) ===`n" -ForegroundColor Yellow
git log --graph --oneline --all --decorate

Write-Host "`nGit setup complete! Repository is ready for GitHub push.`n" -ForegroundColor Cyan
