import { app, BrowserWindow, screen, ipcMain, dialog } from 'electron'
import * as path from 'path'
import * as fs from 'fs'
import * as url from 'url'
require('@electron/remote/main').initialize()

let win: BrowserWindow = null
const args = process.argv.slice(1),
  serve = args.some(val => val === '--serve')

function createWindow(): BrowserWindow {

  const electronScreen = screen
  const size = electronScreen.getPrimaryDisplay().workAreaSize

  // Create the browser window.
  win = new BrowserWindow({
    x: 0,
    y: 0,
    width: size.width,
    height: size.height,
    title: 'Fordító prog. Beadandó',
    webPreferences: ({
      nodeIntegration: true,
      enableRemoteModule: true,
      allowRunningInsecureContent: (serve) ? true : false,
      contextIsolation: false,
    } as any),
  })


  if (serve) {
    win.webContents.openDevTools()
    require('electron-reload')(__dirname, {
      electron: require(path.join(__dirname, '/../node_modules/electron'))
    })
    win.loadURL('http://localhost:4200')
  } else {
    // Path when running electron executable
    let pathIndex = './index.html'

    if (fs.existsSync(path.join(__dirname, '../dist/index.html'))) {
       // Path when running electron in local folder
      pathIndex = '../dist/index.html'
    }

    win.loadURL(url.format({
      pathname: path.join(__dirname, pathIndex),
      protocol: 'file:',
      slashes: true
    }))
  }

  // Emitted when the window is closed.
  win.on('closed', () => {
    win = null
  })

  return win
}

try {
  // This method will be called when Electron has finished
  app.on('ready', () => setTimeout(createWindow, 400))

  app.on('window-all-closed', () => {
    if (process.platform !== 'darwin')
      app.quit()

  })

  app.on('activate', () => {
    if (win === null)
      createWindow()

  })

  ipcMain.handle('open-file', async (__event, __arg) => {
    const { filePaths } = await dialog.showOpenDialog(win, {
      properties: [ 'openFile' ],
      filters: [
        { name: 'Text Files', extensions: [ 'csv' ] },
        { name: 'All Files', extensions: [ '*' ] }
      ]
    })
    return filePaths
  })
} catch (e) {
  // Catch Error
  // throw e;
}
