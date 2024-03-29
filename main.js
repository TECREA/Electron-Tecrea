const {app, BrowserWindow, Menu} = require('electron')
const { webFrame } = require('electron/renderer')
const path = require('path')
const url = require('url')
const shell = require('electron').shell
const ipc = require('electron').ipcMain

let win;

function createWindow () {
    win = new BrowserWindow({
        width:  800,
        height: 600,
        webPreferences: {
            nodeIntegration: true,
            worldSafeExecuteJavaScript: true
        }
    })
    win.loadURL(url.format({
        pathname: path.join(__dirname, 'src/index.html'),
        protocol: 'file',
        slashes: true
    }))

    win.webContents.openDevTools()

    win.on('closed', () => {
        win = null
    })
}

app.allowRendererProcessReuse = false

app.on('ready', createWindow)

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit()
    }
})

app.on('activate', () => {
    if(win === null) {
        createWindow()
    }
})

ipc.on('update-notify-value', function(event, arg) {
    win.webContents.send('targetPriceVal', arg)
  })