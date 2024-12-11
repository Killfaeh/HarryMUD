function SettingsPopup()
{
	///////////////
	// Attributs //
	///////////////

	var popupHTML = '<h2>Settings</h2>'
					+ '<h3>Translation</h3>'
					+ '<table>'
						+ '<tr>'
							+ '<td class="labelCell" >Target language</td>'
							+ '<td id="languageCell" ></td>'
						+ '</tr>'
					+ '</table>';
	
	var popup = new Popup(popupHTML);
	popup.addClass('settingsPopup');

	/*
	var languageOptions = [ { name: "Deutsch", value: 'de', color: 'rgb(255, 255, 255)' },
							{ name: "Español", value: 'es', color: 'rgb(255, 255, 0)' },
							{ name: "Français", value: 'fr', color: 'rgb(0, 255, 255)' }, 
							{ name: "Italiano", value: 'it', color: 'rgb(255, 0, 0)' },
							{ name: "Português", value: 'pt', color: 'rgb(255, 128, 0)' } ];
	//*/
	
	var languageOptions = [ { name: "Deutsch", value: 'de', color: null },
							{ name: "Español", value: 'es', color: null },
							{ name: "Français", value: 'fr', color: null }, 
							{ name: "Italiano", value: 'it', color: null },
							{ name: "Português", value: 'pt', color: null } ];

	var languageComboBox = new ComboBox('language', languageOptions, 'fr', false, 50);
	popup.getById('languageCell').appendChild(languageComboBox);
	
	//////////////
	// Méthodes //
	//////////////
	
	this.loadFromJSON = function($json)
	{
		if (utils.isset($json.settings))
		{
			if (utils.isset($json.settings.language) && $json.settings.language !== '')
				languageComboBox.setCurrentValue($json.settings.language);
			else
				languageComboBox.setCurrentValue('fr');
		}
	};

	var saveSettings = function()
	{
		var settings =
		{
			language: languageComboBox.getCurrentValue()
		};

		window.electronAPI.saveSettings(settings);
	};

	///////////////////////////////////
	// Initialisation des événements //
	///////////////////////////////////

	popup.onHide = function()
	{
		saveSettings();
		return true;
	};

	////////////////
	// Accesseurs //
	////////////////
	
	// GET
	
	this.getLanguage = function() { return languageComboBox.getCurrentValue(); };
	
	// SET

	
	//////////////
	// Héritage //
	//////////////
	
	var $this = utils.extend(popup, this);
	return $this; 
}

if (Loader !== null && Loader !== undefined)
	Loader.hasLoaded("settingsPopup");