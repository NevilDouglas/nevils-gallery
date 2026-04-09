// main.js
const { app, BrowserWindow, ipcMain, dialog } = require('electron');
const path = require('path');
const fs = require('fs');
const AdmZip = require('adm-zip');

let outputDirectory = __dirname; // standaard outputmap

function createWindow() {
  const win = new BrowserWindow({
    width: 700,
    height: 500,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
    },
  });

  win.loadFile('renderer.html');
}

// electron events
app.whenReady().then(() => {
  createWindow();
  
  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});

// helpers
function isRelevantFile(filePath) {
  const relevantExtensions = ['.js', '.jsx', '.ts', '.tsx', '.html', '.css', '.json', '.env', '.md', '.sql', '.yml', '.yaml'];
  const excludedFilenames = ['package-lock.json'];
  const ext = path.extname(filePath);
  const base = path.basename(filePath);
  return relevantExtensions.includes(ext) && !excludedFilenames.includes(base);
}

function isExcludedDir(dirPath) {
  return dirPath.includes('node_modules');
}

function getAllRelevantFiles(dir) {
  let files = [];
  if (!fs.existsSync(dir)) return files;
  for (const file of fs.readdirSync(dir)) {
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);
    if (stat.isDirectory() && !isExcludedDir(fullPath)) {
      files = files.concat(getAllRelevantFiles(fullPath));
    } else if (stat.isFile() && isRelevantFile(fullPath)) {
      files.push(fullPath);
    }
  }
  return files;
}

function readFilesAsText(files, root, label) {
  let content = `\n\n===== ${label.toUpperCase()} FILES =====\n`;
  for (const filePath of files) {
    const relativePath = path.relative(root, filePath);
    const fileContent = fs.readFileSync(filePath, 'utf-8');
    content += `\n\n--- FILE: ${relativePath} ---\n\n${fileContent}`;
  }
  return content;
}

ipcMain.handle('choose-output-directory', async () => {
  const result = await dialog.showOpenDialog({ properties: ['openDirectory'] });
  if (result.canceled) return { success: false };
  outputDirectory = result.filePaths[0];
  return { success: true, path: outputDirectory };
});

ipcMain.handle('merge-zip', async () => {
  const result = await dialog.showOpenDialog({ properties: ['openFile'], filters: [{ name: 'Zip Files', extensions: ['zip'] }] });
  if (result.canceled) return { success: false };
  const zipPath = result.filePaths[0];

  const zip = new AdmZip(zipPath);
  const extractPath = path.join(__dirname, 'tmp_extract');
  zip.extractAllTo(extractPath, true);

  const frontend-reactPath = path.join(extractPath, 'frontend-react');
  const backendPath = path.join(extractPath, 'backend');

  const frontend-reactFiles = getAllRelevantFiles(frontend-reactPath);
  const backendFiles = getAllRelevantFiles(backendPath);

  let resultContent = '';
  resultContent += readFilesAsText(frontend-reactFiles, extractPath, 'frontend-react');
  resultContent += readFilesAsText(backendFiles, extractPath, 'backend');

  const outputPath = path.join(outputDirectory, 'merged_code_from_zip.txt');
  fs.writeFileSync(outputPath, resultContent);

  return { success: true, path: outputPath };
});

ipcMain.handle('merge-local', async () => {
  const rootPath = path.resolve(__dirname, '..', '..'); 
  const frontend-reactPath = path.join(rootPath, 'frontend-react');
  const backendPath = path.join(rootPath, 'backend');

  const frontend-reactFiles = getAllRelevantFiles(frontend-reactPath);
  const backendFiles = getAllRelevantFiles(backendPath);

  let resultContent = '';
  resultContent += readFilesAsText(frontend-reactFiles, rootPath, 'frontend-react');
  resultContent += readFilesAsText(backendFiles, rootPath, 'backend');

  const outputPath = path.join(outputDirectory, 'merged_code_from_local.txt');
  fs.writeFileSync(outputPath, resultContent);

  return { success: true, path: outputPath };
});
