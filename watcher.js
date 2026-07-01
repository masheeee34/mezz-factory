const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const watchDir = __dirname;
let timeoutId = null;

// Extrêmement important : Ignorer ces répertoires pour éviter des boucles infinies ou des crashs
const ignoredPatterns = [
  '.git',
  '.next',
  'node_modules',
  'watcher.js',
  'package-lock.json',
  '.vercel'
];

console.log("=================================================");
const startMsg = " Surveillant actif : Auto-push sur modifs actif... ";
console.log(startMsg);
console.log("=================================================");

function shouldIgnore(filePath) {
  return ignoredPatterns.some(pattern => filePath.includes(pattern));
}

function runGit() {
  try {
    // Vérifie s'il y a des modifications à commiter
    const status = execSync('git status --porcelain', { stdio: 'pipe' }).toString().trim();
    if (!status) {
      return;
    }

    console.log(`[${new Date().toLocaleTimeString()}] Modifications détectées. Envoi automatique sur GitHub...`);
    
    // Commandes Git
    execSync('git add .', { stdio: 'inherit' });
    
    // Message de commit générique sans blabla IA
    execSync('git commit -m "auto: mise à jour"', { stdio: 'inherit' });
    
    execSync('git push origin main', { stdio: 'inherit' });
    
    console.log("✅ Poussé sur GitHub avec succès !");
  } catch (err) {
    console.error("❌ Erreur lors du push automatique :", err.message);
  }
}

// Surveille le dossier récursivement
fs.watch(watchDir, { recursive: true }, (eventType, filename) => {
  if (!filename || shouldIgnore(filename)) return;

  // Anti-rebond (debounce) de 5 secondes pour regrouper les sauvegardes multiples en un seul push
  clearTimeout(timeoutId);
  timeoutId = setTimeout(() => {
    runGit();
  }, 5000);
});
