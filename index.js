const { app, BrowserWindow, Menu, Tray, ipcMain, dialog, shell } = require('electron');
const path = require('path');
const Store = require('electron-store');
const { spawn } = require('child_process');

// Initialize secure storage
const store = new Store({
  encryptionKey: 'your-encryption-key-here'
});

let mainWindow;
let tray;

function createWindow() {
  // Create the browser window
  mainWindow = new BrowserWindow({
    width: 1400,
    height: 900,
    minWidth: 800,
    minHeight: 600,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: path.join(__dirname, '../preload/preload.js')
    },
    icon: path.join(__dirname, '../../assets/icon.png')
  });

  // Load the app
  mainWindow.loadFile(path.join(__dirname, '../renderer/index.html'));

  // Handle window closed
  mainWindow.on('closed', () => {
    mainWindow = null;
  });

  // Handle minimize to tray
  mainWindow.on('minimize', (event) => {
    event.preventDefault();
    mainWindow.hide();
  });

  // Create system tray
  createTray();
}

function createTray() {
  tray = new Tray(path.join(__dirname, '../../assets/tray-icon.png'));

  const contextMenu = Menu.buildFromTemplate([
    { label: 'Show App', click: () => mainWindow.show() },
    { label: 'Run Diagnostics', click: () => runDiagnostics() },
    { label: 'HIPAA Compliance Check', click: () => runComplianceCheck() },
    { type: 'separator' },
    { label: 'Quit', click: () => app.quit() }
  ]);

  tray.setContextMenu(contextMenu);
  tray.setToolTip('AI Doctor Helper');

  tray.on('double-click', () => {
    mainWindow.show();
  });
}

// IPC handlers for medical AI functions
ipcMain.handle('run-vista3d', async (event, imagePath) => {
  return new Promise((resolve, reject) => {
    const process = spawn('python', ['scripts/run_vista3d.py', imagePath]);
    let output = '';

    process.stdout.on('data', (data) => {
      output += data.toString();
    });

    process.on('close', (code) => {
      if (code === 0) {
        resolve(JSON.parse(output));
      } else {
        reject(new Error(`VISTA3D process exited with code ${code}`));
      }
    });
  });
});

ipcMain.handle('run-ecg-analysis', async (event, ecgData) => {
  return new Promise((resolve, reject) => {
    const process = spawn('python', ['scripts/run_ecg_analysis.py', JSON.stringify(ecgData)]);
    let output = '';

    process.stdout.on('data', (data) => {
      output += data.toString();
    });

    process.on('close', (code) => {
      if (code === 0) {
        resolve(JSON.parse(output));
      } else {
        reject(new Error(`ECG analysis process exited with code ${code}`));
      }
    });
  });
});

// App event handlers
app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

// Helper functions
function runDiagnostics() {
  const diagnosticsWindow = new BrowserWindow({
    width: 800,
    height: 600,
    parent: mainWindow,
    modal: true,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: path.join(__dirname, '../preload/preload.js')
    }
  });

  diagnosticsWindow.loadFile(path.join(__dirname, '../renderer/diagnostics.html'));
}

function runComplianceCheck() {
  spawn('powershell', ['-ExecutionPolicy', 'Bypass', '-File', 'deployment/hipaa-compliance-check.ps1'], {
    stdio: 'inherit'
  });
}
