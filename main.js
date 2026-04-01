const { app, BrowserWindow, ipcMain, shell } = require('electron');
const path = require('path');
const { exec } = require('child_process');

function createWindow() {
  const win = new BrowserWindow({
    width: 1000,
    height: 700,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      nodeIntegration: false,
      contextIsolation: true,
    },
    title: "CRACKWIFI - DEVELOPER BY TONY THANG",
    backgroundColor: '#000000',
  });

  win.loadFile('index.html');
  // win.webContents.openDevTools(); // Mở để debug nếu cần
}

app.whenReady().then(() => {
  createWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});

// Xử lý quét WiFi thực tế trên Windows
ipcMain.handle('scan-vifi', async () => {
  return new Promise((resolve, reject) => {
    exec('netsh wlan show networks mode=bssid', (error, stdout, stderr) => {
      if (error) {
        resolve([]); // Trả về mảng rỗng nếu lỗi (ví dụ: máy không có card WiFi)
        return;
      }
      
      const networks = [];
      const lines = stdout.split('\n');
      lines.forEach(line => {
        if (line.includes('SSID')) {
          const parts = line.split(':');
          if (parts.length > 1) {
            const ssid = parts[1].trim();
            if (ssid && !networks.includes(ssid)) {
              networks.push(ssid);
            }
          }
        }
      });
      resolve(networks);
    });
  });
});

// Xử lý mở link Rickroll
ipcMain.on('open-rick-roll', () => {
    shell.openExternal('https://streamable.com/udjjp9');
});
