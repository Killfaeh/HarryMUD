function MUDlistPopup()
{
	///////////////
	// Attributs //
	///////////////

	var popupHTML = '<h2>MUD library</h2>'
					+ '<div class="popupCanvas" >'
						+ '<div id="MUDlist" class="MUDlist" ></div>'
						+ '<div id="MUDinfoPanel" class="MUDinfoPanel" ></div>'
					+ '</div>'
					+ '<div id="addIcon" class="addIcon" ></div>';
	
	var popup = new Popup(popupHTML);
	popup.addClass('MUDlistPopup');

	var mudListBox = new ListBox();
	mudListBox.setEditMode(true);
	popup.getById('MUDlist').appendChild(mudListBox);

	var addIcon = Loader.getSVG('icons', 'plus-icon', 20, 20);
	popup.getById('addIcon').appendChild(addIcon);
	
	//////////////
	// Méthodes //
	//////////////
	
	this.loadFromJSON = function($json)
	{
		mudListBox.onChange = function() {};
		popup.getById('MUDinfoPanel').empty();
		mudListBox.removeAllElement();

		for (var i = 0; i < $json.muds.length; i++)
		{
			var mudData = $json.muds[i];

			var itemHTML = '<div class="mudRow" >'
									+ '<div>' + mudData.label + '</div>'
									+ '<div id="icons" class="icons" ></div>'
								+ '</div>';

			var item = new ListItem(itemHTML);

			var removeIcon = Loader.getSVG('icons', 'close-icon', 16, 16);
			removeIcon.item = item;
			item.getById('icons').appendChild(removeIcon);

			item.label = mudData.label;
			item.data = new MUDinfo();
			item.data.onConnect = function($connectInfo) { $this.hide(); };
			item.data.loadFromJSON(mudData);

			item.onSelect = function($element)
			{
				popup.getById('MUDinfoPanel').empty();
				popup.getById('MUDinfoPanel').appendChild(this.data);
			};

			removeIcon.onClick = function()
			{
				var htmlPopup = '<p>Are you sure you want to remove this MUD from your library? </p>';
				var removePopup = new ConfirmPopup(htmlPopup, true);
				removePopup.item = this.item;

				removePopup.onOk = function()
				{
					mudListBox.removeElement(this.item);
					saveSettings();
					return true;
				};

				document.getElementById('main').appendChild(removePopup);
			};

			mudListBox.addElement(item);
		}

		mudListBox.onChange = function() { saveSettings(); };
	};

	var saveSettings = function()
	{
		var settingsData = { muds: [] };

		var mudList = mudListBox.getElementsList();

		for (var i = 0; i < mudList.length; i++)
			settingsData.muds.push(mudList[i].data.getJSON());

		window.electronAPI.saveMUDs(JSON.stringify(settingsData));
	};

	///////////////////////////////////
	// Initialisation des événements //
	///////////////////////////////////

	mudListBox.onChange = function() { saveSettings(); };
	
	addIcon.onClick = function()
	{
		var mudData = { label: "New MUD", host: "127.0.0.1", port: 4000, characterName: "", characterPassword: "", notes: "Notes" };

		var itemHTML = '<div class="mudRow" >'
			+ '<div>' + mudData.label + '</div>'
			//+ '<div id="removeIcon" class="removeIcon" >X</div>'
		+ '</div>';

		var item = new ListItem(itemHTML);

		item.label = mudData.label;
		item.data = new MUDinfo();
		item.data.onConnect = function($connectInfo) { $this.hide(); };
		item.data.loadFromJSON(mudData);

		item.onSelect = function($element)
		{
			popup.getById('MUDinfoPanel').empty();
			popup.getById('MUDinfoPanel').appendChild(this.data);
		};

		mudListBox.addElement(item);
		item.select();
	};

	popup.onHide = function()
	{
		saveSettings();
		return true;
	};

	////////////////
	// Accesseurs //
	////////////////
	
	// GET
	
	
	// SET

	
	//////////////
	// Héritage //
	//////////////
	
	var $this = utils.extend(popup, this);
	return $this; 
}

if (Loader !== null && Loader !== undefined)
	Loader.hasLoaded("MUDlistPopup");