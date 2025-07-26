# Create package.json for the Electron app with Python boolean values
package_json = {
    "name": "ai-doctor-helper-windows",
    "version": "1.0.0",
    "description": "AI-powered healthcare assistant with MONAI integration for Windows",
    "main": "src/main/index.js",
    "scripts": {
        "start": "electron .",
        "dev": "electron . --dev",
        "build": "electron-builder",
        "make": "electron-forge make",
        "package": "electron-forge package",
        "lint": "eslint src/",
        "test": "jest",
        "deploy": "powershell -ExecutionPolicy Bypass -File deployment/deploy.ps1",
        "setup-env": "powershell -ExecutionPolicy Bypass -File scripts/setup-environment.ps1",
        "finetune-models": "python scripts/finetune_all_models.py",
        "start-federated": "nvflare simulator flare_app -w workspace -n 2 -t fed_avg"
    },
    "keywords": ["healthcare", "ai", "medical", "monai", "electron", "windows"],
    "author": "Healthcare AI Team",
    "license": "MIT",
    "devDependencies": {
        "@electron-forge/cli": "^7.0.0",
        "@electron-forge/maker-squirrel": "^7.0.0",
        "@electron-forge/maker-zip": "^7.0.0",
        "@electron-forge/webpack": "^7.0.0",
        "electron": "^27.0.0",
        "electron-builder": "^24.6.4"
    },
    "dependencies": {
        "electron-store": "^8.1.0",
        "axios": "^1.5.0",
        "openai": "^4.0.0",
        "supabase": "^1.0.0",
        "@supabase/supabase-js": "^2.38.0",
        "crypto-js": "^4.1.1",
        "winston": "^3.10.0",
        "node-cron": "^3.0.2"
    },
    "build": {
        "appId": "com.healthcare.aidoctorhelper",
        "productName": "AI Doctor Helper",
        "directories": {
            "output": "dist"
        },
        "files": [
            "src/**/*",
            "node_modules/**/*"
        ],
        "win": {
            "target": "nsis",
            "icon": "assets/icon.ico"
        },
        "nsis": {
            "oneClick": False,
            "allowToChangeInstallationDirectory": True
        }
    }
}

# Write package.json
with open(f"{project_name}/package.json", "w") as f:
    json.dump(package_json, f, indent=2)

print("Created package.json with complete Electron configuration")

# Create main Electron entry point
main_js_content = '''const { app, BrowserWindow, Menu, Tray, ipcMain, dialog, shell } = require('electron');
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
'''

with open(f"{project_name}/src/main/index.js", "w") as f:
    f.write(main_js_content)

print("Created main Electron process file")

# Create preload script for security
preload_js_content = '''const { contextBridge, ipcRenderer } = require('electron');

// Expose protected methods that allow the renderer process to use
// the ipcRenderer without exposing the entire object
contextBridge.exposeInMainWorld('electronAPI', {
  // Medical AI functions
  runVista3D: (imagePath) => ipcRenderer.invoke('run-vista3d', imagePath),
  runECGAnalysis: (ecgData) => ipcRenderer.invoke('run-ecg-analysis', ecgData),
  
  // File operations
  openFile: () => ipcRenderer.invoke('dialog:openFile'),
  saveFile: (data) => ipcRenderer.invoke('dialog:saveFile', data),
  
  // Encryption
  encryptData: (data) => ipcRenderer.invoke('encrypt-data', data),
  decryptData: (encryptedData) => ipcRenderer.invoke('decrypt-data', encryptedData),
  
  // Logging
  logAuditEvent: (event) => ipcRenderer.invoke('log-audit-event', event),
  
  // Version info
  getVersion: () => ipcRenderer.invoke('get-version')
});

// Security: Remove access to Node.js APIs
delete window.require;
delete window.exports;
delete window.module;
'''

with open(f"{project_name}/src/preload/preload.js", "w") as f:
    f.write(preload_js_content)

print("Created preload security script")