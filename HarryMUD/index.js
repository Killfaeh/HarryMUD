
///////////////////////
// Appel des modules //
///////////////////////

const { app, BrowserWindow, ipcMain, dialog } = require('electron');
const path = require('path');
const os = require("os");
const fs = require('fs');
var net = require('net');

var mainWindow = null;

////////////////////////
// Options par défaut //
////////////////////////

const userHomeDir = os.homedir();

var okQuit = false;
var settings = { settings: {language: 'fr'}, muds: [] };
var runningSessions = {};

///////////////
// Fonctions //
///////////////

//// Utilitaires ////

/*
function saveSettings()
{
	fs.writeFileSync(userHomeDir + '/Documents/TGCMgames/MUDconnector/settings.json', JSON.stringify(settings));
}
//*/

function createSocket($session)
{
	var socket = new net.Socket();
	socket.setEncoding($session.encoding);
	socket.id = $session.id;
	socket.encoding = $session.encoding;

	socket.on('data', function($data)
	{
		//console.log("#### BEGIN DATA ####");
		//console.log($data);
		//console.log("#### END DATA ####");

		var bufferObj = Buffer.from($data, this.encoding);

		if (this.encoding === 'UTF8' && (bufferObj[bufferObj.length-1] === 1 || bufferObj[6] === 1))
		{
			if (bufferObj[bufferObj.length-1] === 1)
				bufferObj = Buffer.from($data.replace(/.{3}$/, 'IACWILLECHO'), this.encoding);
			else if (bufferObj[6] === 1)
				bufferObj = Buffer.from($data.replace(/^.{3}/, 'IACWONTECHO'), this.encoding);
		}

		var base64String = bufferObj.toString("base64");
		mainWindow.webContents.executeJavaScript("viewManager.receive(" + this.id + ", '" + base64String + "');");
	});

	socket.on('close', function()
	{
		console.log('Connection closed');
		mainWindow.webContents.executeJavaScript("viewManager.closeConnection(" + this.id + ");");
		this.destroy();
	});

	socket.connect($session.port, $session.host, function()
	{
		if ($session.withCharacter === true)
			this.write($session.characterName + '\n', this.encoding);
	});

	return socket;
}

//// Appelée par l'interface graphique ////

async function handleLoadSettingsInGUI()
{
	//console.log("LoadSettingsInGUI");
	mainWindow.webContents.executeJavaScript("viewManager.loadSettings(" + JSON.stringify(settings) + ");");
}

async function handleSaveSettings($event, $settings)
{
	settings.settings = $settings;
	fs.writeFileSync(userHomeDir + '/Documents/TGCMgames/MUDconnector/settings.json', JSON.stringify(settings));
};

async function handleSaveMUDs($event, $settings)
{
	settings.muds = JSON.parse($settings).muds;
	fs.writeFileSync(userHomeDir + '/Documents/TGCMgames/MUDconnector/settings.json', JSON.stringify(settings));
};

async function handleSaveMacros($event, $id, $macros)
{
	for (var i = 0; i < settings.muds.length; i++)
	{
		if (settings.muds[i].id + '' === $id + '')
		{
			settings.muds[i].macros = $macros;
			fs.writeFileSync(userHomeDir + '/Documents/TGCMgames/MUDconnector/settings.json', JSON.stringify(settings));
			//console.log("SaveMacros");
			mainWindow.webContents.executeJavaScript("viewManager.loadSettings(" + JSON.stringify(settings) + ");");
			i = settings.muds.length;
		}
	}
};

async function handleSaveTranslationSettings($event, $id, $translationSettings)
{
	for (var i = 0; i < settings.muds.length; i++)
	{
		if (settings.muds[i].id + '' === $id + '')
		{
			settings.muds[i].translation = $translationSettings;
			fs.writeFileSync(userHomeDir + '/Documents/TGCMgames/MUDconnector/settings.json', JSON.stringify(settings));
			//console.log("SaveTranslationSettings");
			mainWindow.webContents.executeJavaScript("viewManager.loadSettings(" + JSON.stringify(settings) + ");");
			i = settings.muds.length;
		}
	}
};

async function handleConnectToMUD($event, $connectInfo)
{
	var connectId = $connectInfo.id + '';

	if (!runningSessions[connectId])
	{
		var session = $connectInfo;
		var socket = createSocket(session);
		session.socket = socket;
		runningSessions[connectId] = session;
	}
	else
	{
		var session = runningSessions[connectId];
		var socket = createSocket(session);
		session.socket = socket;
	}
};

async function handleSendCommand($event, $id, $command)
{
	var connectId = $id + '';

	if (runningSessions[connectId])
		runningSessions[connectId].socket.write($command + '\n', runningSessions[connectId].socket.encoding);
};

async function handleReconnect($event, $id)
{
	var connectId = $id + '';

	if (runningSessions[connectId])
	{
		var session = runningSessions[connectId];
		var socket = createSocket(session);
		session.socket = socket;
	}
};

async function handleQuitGame($event, $id)
{
	var connectId = $id + '';

	if (runningSessions[connectId])
	{
		var session = runningSessions[connectId];
		session.socket.destroy();
		session.socket = null;
		runningSessions[connectId] = null;
	}
};

function handleQuit()
{
	okQuit = true;
	app.quit();
};

////////////////////////////////
// Démarrage de l'application //
////////////////////////////////

// Initialisation des options par défaut

if (!fs.existsSync(userHomeDir + '/Documents/TGCMgames'))
	fs.mkdirSync(userHomeDir + '/Documents/TGCMgames');

if (!fs.existsSync(userHomeDir + '/Documents/TGCMgames/MUDconnector'))
	fs.mkdirSync(userHomeDir + '/Documents/TGCMgames/MUDconnector');

if (!fs.existsSync(userHomeDir + '/Documents/TGCMgames/MUDconnector/settings.json'))
	fs.writeFileSync(userHomeDir + '/Documents/TGCMgames/MUDconnector/settings.json', JSON.stringify(settings));
else
{
	var fileContent = fs.readFileSync(userHomeDir + '/Documents/TGCMgames/MUDconnector/settings.json', "utf8");
	settings = JSON.parse(fileContent);
}

// Fonction de création d'une fenêtre
function createWindow ()
{
	// Création et paramétrage d'une fenêtre
	mainWindow = new BrowserWindow({
		width: 1600,
		height: 1200,
		webPreferences:
		{
			preload: path.join(__dirname, 'preload.js')
		}
	});

	mainWindow.on('close', ($e) => {

		if (okQuit === false)
		{
			$e.preventDefault();
			mainWindow.webContents.executeJavaScript("viewManager.confirmCloseApp();");
		}
	});

	// Charger une page HTML dans la fenêtre
	mainWindow.loadFile('index.html');
}

// Déclencher l'ouverture de la fenêtre uniquement lorsqu'électron a fini de se charger.
app.whenReady().then(() =>
{
	ipcMain.handle('loadSettingsInGUI', handleLoadSettingsInGUI);
	ipcMain.handle('connectToMUD', handleConnectToMUD);
	ipcMain.handle('sendCommand', handleSendCommand);
	ipcMain.handle('reconnect', handleReconnect);
	ipcMain.handle('quitGame', handleQuitGame);
	//ipcMain.handle('openRecentFile', handleOpenRecentFile);
	ipcMain.handle('saveSettings', handleSaveSettings);
	ipcMain.handle('saveMUDs', handleSaveMUDs);
	ipcMain.handle('saveMacros', handleSaveMacros);
	ipcMain.handle('saveTranslationSettings', handleSaveTranslationSettings);
	ipcMain.on('quit', handleQuit);

	createWindow();
	
	app.on('activate', function ()
	{
		if (BrowserWindow.getAllWindows().length === 0)
			createWindow();
	});
});

app.on('window-all-closed', function () { app.quit(); });