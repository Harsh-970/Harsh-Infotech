import express from 'express';
import { exec } from 'child_process';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.join(__dirname, '..');

const app = express();
const PORT = 3001;

app.use(express.json());

// Serve admin-tools folder as static files
app.use(express.static(__dirname));

// Serve reports folder as static files (accessible under /REPORTS/*)
app.use('/REPORTS', express.static(path.join(projectRoot, 'REPORTS')));

// Serve database data folder as static files
app.use('/data', express.static(path.join(projectRoot, 'src/data')));

// Helper to run commands asynchronously with promise support
function runCommand(cmd) {
  return new Promise((resolve, reject) => {
    exec(cmd, { cwd: projectRoot }, (error, stdout, stderr) => {
      if (error) {
        reject({ error, stdout, stderr });
      } else {
        resolve({ stdout, stderr });
      }
    });
  });
}

// ── API: STATUS & METRICS ────────────────────────────────────
app.get('/api/status', async (req, res) => {
  try {
    const reportPath = path.join(projectRoot, 'REPORTS/CMS_SUMMARY_REPORT.md');
    const indexPath = path.join(projectRoot, 'dist/index.html');
    const duplicatePath = path.join(projectRoot, 'REPORTS/DUPLICATE_SLUGS_REPORT.md');
    const healthPath = path.join(projectRoot, 'REPORTS/CONTENT_HEALTH_REPORT.md');
    
    let lastSync = 'Never';
    let lastBuild = 'Never';
    
    if (fs.existsSync(reportPath)) {
      const stat = fs.statSync(reportPath);
      lastSync = stat.mtime.toLocaleString();
    }
    
    if (fs.existsSync(indexPath)) {
      const stat = fs.statSync(indexPath);
      lastBuild = stat.mtime.toLocaleString();
    }

    // Get last commit info
    let lastCommit = { hash: 'Unknown', message: 'None', date: 'N/A', author: 'N/A' };
    try {
      const { stdout } = await runCommand('git log -n 1 --format="%h|%s|%ar|%an"');
      const parts = stdout.trim().split('|');
      if (parts.length >= 4) {
        lastCommit = {
          hash: parts[0],
          message: parts[1],
          date: parts[2],
          author: parts[3]
        };
      }
    } catch (e) {
      // Git command failed
    }

    // Get current branch
    let currentBranch = 'master';
    try {
      const { stdout } = await runCommand('git rev-parse --abbrev-ref HEAD');
      currentBranch = stdout.trim();
    } catch (e) {
      // Git command failed
    }

    // Get files changed list
    let filesChanged = [];
    try {
      const { stdout } = await runCommand('git status --porcelain');
      if (stdout.trim()) {
        filesChanged = stdout.trim().split('\n').map(line => line.trim());
      }
    } catch (e) {
      // Git command failed
    }

    // Parse duplicate slugs count
    let duplicateSlugs = 0;
    if (fs.existsSync(duplicatePath)) {
      const content = fs.readFileSync(duplicatePath, 'utf8');
      const matches = content.match(/\*\s+Conflict/gi);
      if (matches) duplicateSlugs = matches.length;
    }

    // Parse broken references (Reference Warnings)
    let brokenReferences = 0;
    if (fs.existsSync(healthPath)) {
      const content = fs.readFileSync(healthPath, 'utf8');
      const matches = content.match(/Reference Warning/gi);
      if (matches) brokenReferences = matches.length;
    }

    // Parse dashboard stats
    let healthScore = '0/100';
    let contentCounts = {
      totalProducts: 0,
      totalServices: 0,
      totalCustomizations: 0,
      totalCaseStudies: 0,
      activeContent: 0,
      draftContent: 0,
      archivedContent: 0
    };
    
    let issueCounts = {
      missingImages: 0,
      missingBrochures: 0,
      seoIssues: 0,
      duplicateSlugs,
      brokenReferences
    };

    if (fs.existsSync(reportPath)) {
      const content = fs.readFileSync(reportPath, 'utf8');
      
      const activeMatch = content.match(/Active Content\s*\|\s*(\d+)/i);
      const draftMatch = content.match(/Draft Content\s*\|\s*(\d+)/i);
      const archivedMatch = content.match(/Archived Content\s*\|\s*(\d+)/i);
      const assetsMatch = content.match(/Missing Assets\s*\|\s*(\d+)/i);
      const brochuresMatch = content.match(/Missing Brochures\s*\|\s*(\d+)/i);
      const seoMatch = content.match(/SEO Issues\s*\|\s*(\d+)/i);
      const healthMatch = content.match(/CMS Health Score\s*\|\s*\*\*([^\*]+)\*\*/i);
      
      const productsMatch = content.match(/Total Products\s*\|\s*(\d+)/i);
      const servicesMatch = content.match(/Total Services\s*\|\s*(\d+)/i);
      const customizationsMatch = content.match(/Total Customizations\s*\|\s*(\d+)/i);
      const caseStudiesMatch = content.match(/Total Case Studies\s*\|\s*(\d+)/i);

      if (activeMatch) contentCounts.activeContent = parseInt(activeMatch[1], 10);
      if (draftMatch) contentCounts.draftContent = parseInt(draftMatch[1], 10);
      if (archivedMatch) contentCounts.archivedContent = parseInt(archivedMatch[1], 10);
      
      if (productsMatch) contentCounts.totalProducts = parseInt(productsMatch[1], 10);
      if (servicesMatch) contentCounts.totalServices = parseInt(servicesMatch[1], 10);
      if (customizationsMatch) contentCounts.totalCustomizations = parseInt(customizationsMatch[1], 10);
      if (caseStudiesMatch) contentCounts.totalCaseStudies = parseInt(caseStudiesMatch[1], 10);

      if (assetsMatch) issueCounts.missingImages = parseInt(assetsMatch[1], 10);
      if (brochuresMatch) issueCounts.missingBrochures = parseInt(brochuresMatch[1], 10);
      if (seoMatch) issueCounts.seoIssues = parseInt(seoMatch[1], 10);
      if (healthMatch) healthScore = healthMatch[1];
    }

    res.json({
      success: true,
      healthScore,
      lastSync,
      lastBuild,
      lastCommit,
      currentBranch,
      filesChanged,
      contentCounts,
      issueCounts
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// ── API: RUN SYNC-CONTENT ─────────────────────────────────────
app.post('/api/sync-content', async (req, res) => {
  try {
    const { stdout, stderr } = await runCommand('npm run sync-content');
    res.json({ success: true, stdout, stderr });
  } catch (errorObj) {
    res.status(500).json({
      success: false,
      message: 'Synchronization failed',
      error: errorObj.error.message,
      stdout: errorObj.stdout,
      stderr: errorObj.stderr
    });
  }
});

// ── API: BUILD WEBSITE ───────────────────────────────────────
app.post('/api/build-website', async (req, res) => {
  try {
    const { stdout, stderr } = await runCommand('npm run build');
    res.json({ success: true, stdout, stderr });
  } catch (errorObj) {
    res.status(500).json({
      success: false,
      message: 'Website compilation failed',
      error: errorObj.error.message,
      stdout: errorObj.stdout,
      stderr: errorObj.stderr
    });
  }
});

// ── API: OPEN EDIT FOLDER ────────────────────────────────────
app.post('/api/open-edit-folder', (req, res) => {
  exec('explorer.exe "edit"', { cwd: projectRoot }, (err) => {
    if (err) {
      res.status(500).json({ success: false, error: err.message });
    } else {
      res.json({ success: true });
    }
  });
});

// ── API: OPEN REPORTS FOLDER ──────────────────────────────────
app.post('/api/open-reports-folder', (req, res) => {
  exec('explorer.exe "REPORTS"', { cwd: projectRoot }, (err) => {
    if (err) {
      res.status(500).json({ success: false, error: err.message });
    } else {
      res.json({ success: true });
    }
  });
});

// ── API: PREVIEW WEBSITE (RUN START LOCALLY) ─────────────────
app.post('/api/preview-website', (req, res) => {
  exec('start http://localhost:3000', { cwd: projectRoot }, (err) => {
    if (err) {
      res.status(500).json({ success: false, error: err.message });
    } else {
      res.json({ success: true });
    }
  });
});

// ── API: GET BACKUPS LIST ─────────────────────────────────────
app.get('/api/backups', (req, res) => {
  const backupsDir = path.join(projectRoot, 'edit/backups');
  if (!fs.existsSync(backupsDir)) {
    return res.json({ success: true, backups: [] });
  }

  try {
    const files = fs.readdirSync(backupsDir)
      .filter(f => f.endsWith('.xlsx') || f.endsWith('.csv'))
      .map(f => {
        const filePath = path.join(backupsDir, f);
        const stat = fs.statSync(filePath);
        return {
          filename: f,
          date: stat.mtime.toLocaleString(),
          size: `${(stat.size / 1024).toFixed(1)} KB`,
          timeMs: stat.mtimeMs
        };
      })
      // Sort newest first
      .sort((a, b) => b.timeMs - a.timeMs);

    res.json({ success: true, backups: files });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// ── API: RESTORE BACKUP ──────────────────────────────────────
app.post('/api/restore-backup', async (req, res) => {
  const { filename } = req.body;
  if (!filename) {
    return res.status(400).json({ success: false, error: 'Backup filename is required.' });
  }

  const srcPath = path.join(projectRoot, 'edit/backups', filename);
  if (!fs.existsSync(srcPath)) {
    return res.status(404).json({ success: false, error: 'Backup file not found.' });
  }

  try {
    // Parse the original base filename. E.g. customizations-2026-06-03.xlsx -> customizations.xlsx
    const ext = path.extname(filename);
    const base = path.basename(filename, ext);
    // Find the original base name before the YYYY-MM-DD date suffix (which starts with a hyphen)
    // Backup format matches: ${base}-${today}${ext}
    const dateMatch = base.match(/^(.+)-\d{4}-\d{2}-\d{2}$/i);
    const originalBase = dateMatch ? dateMatch[1] : base;
    const destName = `${originalBase}${ext}`;
    const destPath = path.join(projectRoot, 'edit', destName);

    // Copy file back to the main edit folder
    fs.copyFileSync(srcPath, destPath);

    // Immediately trigger a sync-content run
    const { stdout, stderr } = await runCommand('npm run sync-content');

    res.json({
      success: true,
      message: `Successfully restored backup to ${destName} and re-synchronized content!`,
      stdout,
      stderr
    });
  } catch (errorObj) {
    res.status(500).json({
      success: false,
      message: 'Restore operation failed during synchronization',
      error: errorObj.error ? errorObj.error.message : errorObj.message,
      stdout: errorObj.stdout,
      stderr: errorObj.stderr
    });
  }
});

// ── API: COMMIT CHANGES ──────────────────────────────────────
app.post('/api/commit-changes', async (req, res) => {
  const { message } = req.body;
  const commitMsg = message ? message.trim() : `CMS Update - ${new Date().toISOString().split('T')[0]}`;
  
  try {
    // Stage everything not ignored (reports, data JSONs, static html pages)
    await runCommand('git add .');
    // Commit the changes
    const { stdout, stderr } = await runCommand(`git commit -m "${commitMsg.replace(/"/g, '\\"')}"`);
    res.json({ success: true, stdout, stderr });
  } catch (errorObj) {
    const errStr = errorObj.stdout || errorObj.error.message;
    if (errStr.includes('nothing to commit') || errStr.includes('clean')) {
      res.json({ success: true, message: 'Nothing to commit, repository is up to date.', stdout: errStr });
    } else {
      res.status(500).json({
        success: false,
        message: 'Commit failed',
        error: errorObj.error.message,
        stdout: errorObj.stdout,
        stderr: errorObj.stderr
      });
    }
  }
});

// ── API: PUSH TO GITHUB ──────────────────────────────────────
app.post('/api/push-github', async (req, res) => {
  try {
    const { stdout, stderr } = await runCommand('git push origin master');
    res.json({ success: true, stdout, stderr });
  } catch (errorObj) {
    res.status(500).json({
      success: false,
      message: 'Pushing to GitHub failed',
      error: errorObj.error.message,
      stdout: errorObj.stdout,
      stderr: errorObj.stderr
    });
  }
});

app.listen(PORT, () => {
  console.log(`🚀 CMS Admin Tools Server running at http://localhost:${PORT}`);
});
