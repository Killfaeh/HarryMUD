function ViewManager()
{
	///////////////
	// Attributs //
	///////////////
	
	var component = new Component('<div></div>');

	//// Menu Bar ////

	var menuBar = new MenuBar();
	
	// File 
					
	var menuBarItemFile = new MenuItem("Settings");
	var itemSettings = new MenuItem("General settings");
	var itemMUDlist = new MenuItem("MUD library");

	//// Tab manager ////

	var tabManager = new TabManager();
	tabManager.setEditMode(true);
	component.appendChild(tabManager);

	//// MUD manager ////

	var settingsPopup = new SettingsPopup();
	var mudManager = new MUDlistPopup();

	//////////////
	// Méthodes //
	//////////////

	this.init = function()
	{
		document.getElementById('screen').removeAllChildren();

		//// Menu Bar ////

		document.getElementById('screen').appendChild(menuBar);

		// File 

		menuBar.addElement(menuBarItemFile);
		menuBarItemFile.addElement(itemSettings);
		menuBarItemFile.addElement(itemMUDlist);

		//// Tab manager ////

		document.getElementById('screen').appendChild(tabManager);
		tabManager.style.top = '34px';
		$this.focus();

		window.electronAPI.loadSettingsInGUI();
	};
	
	this.resize = function()
	{
		
	};

	this.loadSettings = function($settingsData)
	{
		console.log("Load settings in GUI...");
		settingsPopup.loadFromJSON($settingsData);
		mudManager.loadFromJSON($settingsData);
	};

	this.connect = function($connectInfo)
	{
		console.log("Connect...");
		console.log($connectInfo);

		// Vérifier d'abord si l'onglet est déjà ouvert

		var open = false;

		var tabList = tabManager.getTabList();

		for (var j = 0; j < tabList.length; j++)
		{
			// S'il est ouvert, on met le focus sur son onglet
			if ($connectInfo.id === tabList[j].getContent().getConnectInfo().id)
			{
				tabList[j].select();
				open = true;
				j = tabList.length;
			}
		}

		if (open === false)
		{
			var newGame = new Document($connectInfo);
			newGame.init();
			var tab = new Tab('<span>' + $connectInfo.label + '</span>', newGame);

			tab.onClose = function()
			{
				var close = false;

				var closePopup = new ConfirmPopup('<p>Are you sure you want to end this game session?</p>', true);

				closePopup.onOk = function()
				{	
					window.electronAPI.quitGame(tab.getContent().getConnectInfo().id);
					tabManager.removeTab(tab);
					this.hide();
					return true;
				};

				document.getElementById('main').appendChild(closePopup);
	
				return close;
			};

			tabManager.addTab(tab);
			window.electronAPI.connectToMUD($connectInfo);
		}
	};

	this.receive = function($id, $base64)
	{
		var tabList = tabManager.getTabList();

		for (var j = 0; j < tabList.length; j++)
		{
			if ($id + '' === tabList[j].getContent().getConnectInfo().id + '')
			{
				tabList[j].getContent().receive($base64);
				j = tabList.length;
			}
		}
	};

	this.closeConnection = function($id)
	{
		var tabList = tabManager.getTabList();

		for (var j = 0; j < tabList.length; j++)
		{
			if ($id + '' === tabList[j].getContent().getConnectInfo().id + '')
			{
				tabList[j].getContent().closeConnection();
				j = tabList.length;
			}
		}
	};

	this.confirmCloseApp = function()
	{
		var tabList = tabManager.getTabList();

		if (tabList.length > 0)
		{
			var closePopup = new ConfirmPopup('<p>Some games are running.<br />Are you sure you want to end these game sessions?</p>', true);

			closePopup.onOk = function()
			{	
				window.electronAPI.quit();
				return true;
			};

			document.getElementById('main').appendChild(closePopup);
		}
		else
			window.electronAPI.quit();
	};

	///////////////////////////////////
	// Initialisation des événements //
	///////////////////////////////////

	itemSettings.onAction = function() { document.getElementById('main').appendChild(settingsPopup); };
	itemMUDlist.onAction = function() { document.getElementById('main').appendChild(mudManager); };

	this.onKeyDown = function($event)
	{
		var selectedTab = tabManager.getSelected();

		if (utils.isset(selectedTab))
			selectedTab.getContent().onKeyDown($event);
	};

	////////////////
	// Accesseurs //
	////////////////
	
	// GET

	this.getSettings = function() { return settingsPopup; };
	
	// SET

	var $this = utils.extend(component, this);
	var timer = setInterval(function() { $this.focus(); }, 50);
	return $this;
}
	
// A la fin du fichier Javascript, on signale au module de chargement que le fichier a fini de charger.
if (Loader !== undefined && Loader !== null)
	Loader.hasLoaded("viewManager");

