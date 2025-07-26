const { contextBridge, ipcRenderer } = require('electron');

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
