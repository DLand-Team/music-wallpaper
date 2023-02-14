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
			webgl: true,
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
	let effect2d1Click = (menuItem) => {
		mainWindow.webContents.send('EACH_EFFECT_STATE', { name: '2d-1', state: menuItem.checked });
	}
	let effect2d2Click = (menuItem) => {
		mainWindow.webContents.send('EACH_EFFECT_STATE', { name: '2d-2', state: menuItem.checked });
	}
	let effect2d3Click = (menuItem) => {
		mainWindow.webContents.send('EACH_EFFECT_STATE', { name: '2d-3', state: menuItem.checked });
	}
	let openClick = () => {
		mainWindow.webContents.send('ALL_EFFECT_STATE', true);
	}
	let closeClick = () => {
		mainWindow.webContents.send('ALL_EFFECT_STATE', false);
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
		{ label: 'Effect 2D 1', type: 'checkbox', checked: true, click: effect2d1Click },
		{ label: 'Effect 2D 1', type: 'checkbox', checked: true, click: effect2d2Click },
		{ label: 'Effect 2D 3', type: 'checkbox', checked: true, click: effect2d3Click },
		{ type: 'separator' },
		{ label: 'All Open', type: 'radio', checked: true, click: openClick },
		{ label: 'All Close', type: 'radio', checked: false, click: closeClick },
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
	if (!isDev) {
		dialog.showMessageBox({ message: '程序已开启，若需关闭请在托盘栏退出' });
	}
	app.on('activate', function () {
		if (BrowserWindow.getAllWindows().length === 0) createWindow();
	});
});
app.on('window-all-closed', function () {
	if (process.platform !== 'darwin') app.quit();
});
