const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
  scanWifi: () => ipcRenderer.invoke('scan-vifi'),
  openRickRoll: () => ipcRenderer.send('open-rick-roll')
});
