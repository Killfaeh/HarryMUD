function MUDinfo()
{
	var id = (new Date()).getTime() + '' + Math.round(Math.random()*1000);
	var macros = [];
	var translationSettings = [];

	var html = '<table class="MUDinfo" >'
					+ '<tr>'
						+ '<td class="labelCell" >Label</td>'
						+ '<td><input id="label" type="text" value="New MUD" /></td>'
					+ '</tr>'
					+ '<tr>'
						+ '<td class="labelCell" >Host</td>'
						+ '<td><input id="host" type="text" value="127.0.0.1" /></td>'
					+ '</tr>'
					+ '<tr>'
						+ '<td class="labelCell" >Port</td>'
						+ '<td><input id="port" type="number" value="4000" /></td>'
					+ '</tr>'
					+ '<tr>'
						+ '<td class="labelCell" >Encoding</td>'
						+ '<td id="encodingCell" ></td>'
					+ '</tr>'
					+ '<tr>'
						+ '<td class="labelCell" >Default character name</td>'
						+ '<td><input id="characterName" type="text" value="" /></td>'
					+ '</tr>'
					+ '<tr>'
						+ '<td class="labelCell" >Default character password</td>'
						+ '<td><input id="characterPassword" type="password" value="" /></td>'
					+ '</tr>'
					+ '<tr>'
						+ '<td class="labelCell" colspan="2" >Notes</td>'
					+ '</tr>'
					+ '<tr>'
						+ '<td colspan="2" ><textarea id="notes" ></textarea></td>'
					+ '</tr>'
					+ '<tr>'
						+ '<td style="textalign: right;" colspan="2" >'
							+ '<input id="connectNoCharacter" type="button" value="Connect without character" />'
							+ '<input id="connectWithCharacter" type="button" value="Connect with character" />'
						+ '</td>'
					+ '</tr>'
				+ '</table>';
	
	var component = new Component(html);

	var encodingOptions = [ { name: "Latin 1", value: 'latin1', color: null }, { name: "UTF-8", value: 'UTF8', color: null } ];

	var encodingComoboBox = new ComboBox('encoding', encodingOptions, 'latin1', false, 50);
	component.getById('encodingCell').appendChild(encodingComoboBox);

	//////////////
	// Méthodes //
	//////////////
	
	this.loadFromJSON = function($json)
	{
		if (utils.isset($json.id))
			id = $json.id;

		component.getById('label').value = $json.label;
		component.getById('host').value = $json.host;
		component.getById('port').value = $json.port;
		component.getById('characterName').value = $json.characterName;
		component.getById('characterPassword').value = $json.characterPassword;
		component.getById('notes').value = $json.notes;

		if (utils.isset($json.encoding))
			encodingComoboBox.setCurrentValue($json.encoding);

		if (utils.isset($json.macros))
			macros = $json.macros;

		if (utils.isset($json.translation))
			translationSettings = $json.translation;
	};

	///////////////////////////////////
	// Initialisation des événements //
	///////////////////////////////////

	this.onConnect = function($connectInfo) {};

	component.getById('connectNoCharacter').onClick = function()
	{
		var connectInfo = $this.getJSON();
		connectInfo.withCharacter = false;
		$this.onConnect(connectInfo);
		viewManager.connect(connectInfo);
	};

	component.getById('connectWithCharacter').onClick = function()
	{
		var connectInfo = $this.getJSON();
		connectInfo.withCharacter = true;
		$this.onConnect(connectInfo);
		viewManager.connect(connectInfo);
	};

	////////////////
	// Accesseurs //
	////////////////
	
	// GET
	
	this.getJSON = function()
	{
		var jsonData =
		{
			id: id,
			label: component.getById('label').value,
			host: component.getById('host').value,
			port: component.getById('port').value,
			encoding: encodingComoboBox.getCurrentValue(),
			characterName: component.getById('characterName').value,
			characterPassword: component.getById('characterPassword').value,
			notes: component.getById('notes').value,
			macros: macros,
			translation: translationSettings
		};

		return jsonData;
	};
	
	// SET

	
	//////////////
	// Héritage //
	//////////////
	
	var $this = utils.extend(component, this);
	return $this; 
}

if (Loader !== null && Loader !== undefined)
	Loader.hasLoaded("MUDinfo");