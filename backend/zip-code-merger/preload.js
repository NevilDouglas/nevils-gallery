// preload.js
const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
  chooseOutputDirectory: () => ipcRenderer.invoke('choose-output-directory'),
  mergeZip: () => ipcRenderer.invoke('merge-zip'),
  mergeLocal: () => ipcRenderer.invoke('merge-local')
});
