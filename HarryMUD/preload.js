const { contextBridge, ipcRenderer } = require('electron')

contextBridge.exposeInMainWorld('electronAPI',
{
	//setNotSavedFiles: ($isNotSavedFiles) => ipcRenderer.send('setNotSavedFiles', $isNotSavedFiles), 
	loadSettingsInGUI: () => ipcRenderer.invoke('loadSettingsInGUI'),
	//openFile: () => ipcRenderer.invoke('openFile'),
	connectToMUD: ($connectInfo) => ipcRenderer.invoke('connectToMUD', $connectInfo),
	sendCommand: ($id, $command) => ipcRenderer.invoke('sendCommand', $id, $command),
	reconnect: ($id) => ipcRenderer.invoke('reconnect', $id),
	quitGame: ($id) => ipcRenderer.invoke('quitGame', $id),
	saveSettings: ($settings) => ipcRenderer.invoke('saveSettings', $settings),
	saveMUDs: ($settings) => ipcRenderer.invoke('saveMUDs', $settings),
	saveMacros: ($id, $macros) => ipcRenderer.invoke('saveMacros', $id, $macros),
	saveTranslationSettings: ($id, $translationSettings) => ipcRenderer.invoke('saveTranslationSettings', $id, $translationSettings),
	quit: () => ipcRenderer.send('quit'), 
})