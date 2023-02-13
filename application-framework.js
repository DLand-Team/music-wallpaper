const { app, BrowserWindow, dialog, Menu, Tray } = require('electron');
const path = require('path');
const bindings = require("bindings")("electron-as-wallpaper");

let isDev = false;
let mainWindow;

function createWindow() {
	mainWindow = new BrowserWindow({
		show: isDev,
		frame: isDev,
		focusable: isDev,
		transparent: !isDev,
		webPreferences: {
			preload: path.join(__dirname, 'application-preload.js'),
		}
	});
	mainWindow.loadFile('index.html').then(() => {
		if (isDev) {
			mainWindow.webContents.openDevTools();
		} else {
			try {
				bindings.attach(mainWindow.getNativeWindowHandle(), { transparent: true });
				mainWindow.maximize();
				mainWindow.show();
			} catch (e) {
				console.log(e);
			}
		}
	});
}

function createTray() {
	let openClick = () => {
		mainWindow.webContents.send('EFFECT_STATE', true);
	}
	let closeClick = () => {
		mainWindow.webContents.send('EFFECT_STATE', false);
	}
	let resizeClick = () => {
		mainWindow.maximize();
		bindings.refresh();
	}
	let exitClick = () => {
		app.quit();
	}
	let tray = new Tray(path.join(__dirname, './favicon.ico'));
	const contextMenu = Menu.buildFromTemplate([
		{ label: 'Open', type: 'radio', checked: true, click: openClick },
		{ label: 'Close', type: 'radio', checked: false, click: closeClick },
		{ type: 'separator' },
		{ label: 'Resize', type: 'normal', click: resizeClick },
		{ type: 'separator' },
		{ label: 'Exit', type: 'normal', click: exitClick },
	])
	tray.setToolTip('Music Wallpaper');
	tray.setContextMenu(contextMenu);
}

app.whenReady().then(() => {
	createWindow();
	createTray();
	dialog.showMessageBox({ message: '程序已开启，若需关闭请在托盘栏退出' });
	app.on('activate', function () {
		if (BrowserWindow.getAllWindows().length === 0) createWindow();
	});
});
app.on('window-all-closed', function () {
	if (process.platform !== 'darwin') app.quit();
});
