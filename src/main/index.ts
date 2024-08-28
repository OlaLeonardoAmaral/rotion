import { electronApp, is, optimizer } from '@electron-toolkit/utils'
import { app, BrowserWindow, ipcMain, shell } from 'electron'
import { createFileRoute, createURLRoute } from 'electron-router-dom'
import { join } from 'path'
import path from 'node:path'
import './ipc'
import './store'

function createWindow(): void {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    width: 1120,
    height: 700,
    show: false,
    autoHideMenuBar: true,
    backgroundColor: '#17141f',
    titleBarStyle: 'hiddenInset',
    trafficLightPosition: {
      x: 20,
      y: 20,
    },
    // ...(process.platform === 'linux' ? { icon } : {}),
    webPreferences: {
      preload: join(__dirname, '../preload/index.js'),
      sandbox: false
    }
  })

  mainWindow.on('ready-to-show', () => {
    mainWindow.show()
  })

  mainWindow.webContents.setWindowOpenHandler((details) => {
    shell.openExternal(details.url)
    return { action: 'deny' }
  })
  
  const fileRoute = createFileRoute(
    join(__dirname, '../renderer/index.html'),
    'main',
  )
  
  if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
    const devServerURL = createURLRoute(process.env['ELECTRON_RENDERER_URL'], 'main')
    mainWindow.loadURL(devServerURL)
  } else {
    mainWindow.loadFile(...fileRoute)
  }
}

if(process.platform === 'darwin') {
  // app.dock.setIcon(path.resolve(__dirname, '../resources/icon.png'))
  app.dock.setIcon(path.join(__dirname, '../../build/icon.png'))
}

app.whenReady().then(() => {
  
  electronApp.setAppUserModelId('com.electron')

  app.on('browser-window-created', (_, window) => {
    optimizer.watchWindowShortcuts(window)
  })

  // IPC test
  ipcMain.on('ping', () => console.log('pong'))

  createWindow()

  app.on('activate', function () {

    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})
