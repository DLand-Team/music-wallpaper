const { contextBridge, ipcRenderer } = require('electron');

window.addEventListener('DOMContentLoaded', () => {
	const replaceText = (selector, text) => {
		const element = document.getElementById(selector)
		if (element) element.innerText = text
	}

	for (const type of ['chrome', 'node', 'electron']) {
		replaceText(`${type}-version`, process.versions[type])
	}
});

contextBridge.exposeInMainWorld('electronAPI', {
	handleEachEffectState: (callback) => ipcRenderer.on('EACH_EFFECT_STATE', callback),
	handleAllEffectState: (callback) => ipcRenderer.on('ALL_EFFECT_STATE', callback),
});
