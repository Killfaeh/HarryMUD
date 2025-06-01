function Document($connectInfo)
{
	///////////////
	// Attributs //
	///////////////

	var init = false;
	var connectInfo = $connectInfo;
	var logs = '';
	var translationLogs = '';

	var previousCommands = new Array();
	var commandsCursor = 0;
	var tmpCommand = "";
	var setTmpCommand = false;
	var passwordMode = false; 

	var html = '<div class="document" >'
					+ '<div class="macrosPanel" >'
						+ '<div id="macros" class="macros" ></div>'
						+ '<div id="addMacroIcon" class="addMacroIcon" ></div>'
					+ '</div>'
					+ '<div class="gamePanel" >'
						+ '<div id="console" class="console" ></div>'
						+ '<div id="commandBlock" class="commandBlock" >'
							+ '<input id="command" class="commandInput" type="text" />'
							+ '<input id="sendCommand" class="button" type="button" value="Send command" />'
							+ '<div class="wall" ></div>'
						+ '</div>'
						+ '<div id="connectBlock" class="connectBlock" >'
							+ '<input id="reconnect" class="button reconnectButton" type="button" value="Reconnect" />'
						+ '</div>'
					+ '</div>'
					+ '<div class="translatePanel" >'
						+ '<div id="translateConsole" class="translateConsole" ></div>'
						+ '<div id="translateBlock" class="translateBlock" >'
							+ '<input id="english" class="englishInput" type="text" />'
							+ '<input id="translate" class="button" type="button" value="Translate" />'
							+ '<div class="wall" ></div>'
						+ '</div>'
					+ '</div>'
				+ '</div>';

    var component = new Component(html);

	var tabManager = new TabManager();
	tabManager.setEditMode(false);
	component.getById('macros').appendChild(tabManager);

	var macroListBox = new ListBox();
	macroListBox.setEditMode(true);
	var macrosTab = new Tab('<span>Macros</span>', macroListBox);
	tabManager.addTab(macrosTab);

	var translateListBox = new ListBox();
	translateListBox.setEditMode(true);
	var translationTab = new Tab('<span>Translation settings</span>', translateListBox);
	tabManager.addTab(translationTab);

	macrosTab.select();

	var addIcon = Loader.getSVG('icons', 'plus-icon', 30, 30);
	component.getById('addMacroIcon').appendChild(addIcon);

	//////////////
	// Méthodes //
	//////////////

	this.init = function()
	{
		for (var i = 0; i < connectInfo.macros.length; i++)
			createMacro(connectInfo.macros[i]);

		macroListBox.onChange = function() { saveMacros(); };

		for (var i = 0; i < connectInfo.translation.length; i++)
			createTranslation(connectInfo.translation[i]);

		translateListBox.onChange = function() { saveTranslationSettings(); };
	};

	var base64ToBytes = function($base64)
	{
		var binString = atob($base64);
		return new TextDecoder().decode(Uint8Array.from(binString, (m) => m.codePointAt(0)));
	};

	var stripHtml = function($html)
	{
		var tmp = document.createElement("DIV");
		tmp.innerHTML = $html;
		return tmp.textContent || tmp.innerText || "";
	};

	var sendCommand = function($command)
	{
		if (passwordMode === false && $command !== '')
		{
			previousCommands.push($command);
			displayMessage('<span style="font-weight: bold; " >&gt; </span>' + $command);
		}
		
		commandsCursor = previousCommands.length;
		tmpCommand = "";
		setTmpCommand = false;
		window.electronAPI.sendCommand(connectInfo.id, $command);
		component.getById('command').value = '';
	};

	var displayMessage = function($message)
	{
		var message = $message;

		if (message !== '')
		{
			logs = logs + '<p>' + message + '</p>';

			component.getById('console').innerHTML = logs;
			component.getById('console').scrollTop = 1000000000000000;
			component.getById('console').setAttribute('scrollTop', 1000000000000000);
		}

		return message;
	};

	this.receive = function($base64)
	{
		var message = atob($base64);

		if (connectInfo.encoding === 'UTF8')
			message = base64ToBytes($base64);

		message = message.replaceAll('<', '&amp;lt;').replaceAll('>', '&amp;gt;');

		if (connectInfo.encoding === 'latin1')
		{
			var splitedMessage = message.split('');

			for (var i = 0; i < splitedMessage.length; i++)
			{
				var charCode = message.charCodeAt(i);

				//console.log(charCode + ' : ' + splitedMessage[i]);

				var code = latin1Decode[charCode];

				if (connectInfo.encoding === 'UTF8')
					code = utf8Decode[charCode];

				if (utils.isset(code))
					splitedMessage[i] = code;
			}

			message = splitedMessage.join('');
		}

		if (/.*IACWILLECHO$/.test(message) || /.*IAC WILL ECHO$/.test(message))
		{
			component.getById('command').setAttribute('type', 'password');
			passwordMode = true;

			if (connectInfo.withCharacter === true && init === false)
				window.electronAPI.sendCommand(connectInfo.id, connectInfo.characterPassword);

			init = true;
		}
		else
		{
			component.getById('command').setAttribute('type', 'text');
			passwordMode = false;
		}

		message = stripHtml(message).replaceAll(' ', '&nbsp;').replaceAll('IACWILLECHO', '').replaceAll('IACWONTECHO', '').replaceAll('IACWILL', '')
																.replaceAll('IAC WILL ECHO', '').replaceAll('IAC WONT ECHO', '').replaceAll('IAC WILL', '').replaceAll('IAC', '');
		message = ANSItoHTML(message);

		displayMessage(message);
		component.getById('commandBlock').style.display = 'block';
		component.getById('connectBlock').style.display = 'none';
		//component.getById('command').value = '';

		// {tell}Irvine tells you 'coucou'

		var translateList = translateListBox.getElementsList();

		for (var i = 0; i < translateList.length; i++)
		{
			var regexAll = new RegExp(translateList[i].start + ".*" + translateList[i].end);
			var regexStart = new RegExp(translateList[i].start);
			var regexEnd = new RegExp(translateList[i].end);

			if (regexAll.test(message))
			{
				console.log("Translate...");

				var request = new HttpRequestJson();
				request.setMethod('GET');
				request.setTarget('https://translate.googleapis.com/translate_a/single');

				request.onSuccess = function($status, $data)
				{
					console.log("SUCCESS");
					console.log($status);
					//console.log($data);

					var translation = '';

					for (var j = 0; j < $data[0].length; j++)
						translation = translation + $data[0][j][0];

					var translationArray = translation.split(' ');
					translation = translationArray.join(' ');

					displayMessage(languageColors[viewManager.getSettings().getLanguage()] + '[' + languageNames[viewManager.getSettings().getLanguage()] + ' - START]</span><br /><span style="font-weight: bold; " >' 
									+ stripHtml(translation)
									+ '</span><br />' + languageColors[viewManager.getSettings().getLanguage()] + '[' + languageNames[viewManager.getSettings().getLanguage()] + ' - END]</span>');
				};

				request.onError = function($status, $data)
				{
					console.log("ERROR");
					console.log($status);
					console.log($data);
				};

				var messageToTranslate = stripHtml(message).replaceAll('\n', ' ').replaceAll('<br />', ' ').replaceAll('&nbsp;', ' ');

				if (translateList[i].start !== '' && translateList[i].start !== '^' && translateList[i].start !== '$' && translateList[i].start !== '.' && translateList[i].start !== '.*')
					messageToTranslate = messageToTranslate.replace(regexStart, '');

				if (translateList[i].end !== '' && translateList[i].end !== '^' && translateList[i].end !== '$' && translateList[i].end !== '.' && translateList[i].end !== '.*')
					messageToTranslate = messageToTranslate.replace(regexEnd, '');

				request.send({ "client": "gtx", "sl": "en", "tl": viewManager.getSettings().getLanguage(), "dt": "t", "q": messageToTranslate }, {});

				i = translateList.length;
			}
		}
	};

	this.closeConnection = function()
	{
		displayMessage(HTML.DARK_YELLOW + "[warning] Connection closed.</span>");
		setTmpCommand = false; 
        tmpCommand = 0; 
        commandsCursor = 0; 
        previousCommands = new Array();
		component.getById('commandBlock').style.display = 'none';
		component.getById('connectBlock').style.display = 'block';
		component.getById('command').value = '';
	};

	var createMacro = function($macroData)
	{
		var itemHTML = '<div class="macroRow" >'
							+ '<div id="label" >' + $macroData.label + '</div>'
							+ '<div id="icons" class="icons" ></div>'
						+ '</div>';

		var item = new ListItem(itemHTML);
		item.label = $macroData.label;
		item.command = $macroData.command;

		var editIcon = Loader.getSVG('icons', 'edit-icon', 16, 16);
		editIcon.item = item;
		item.getById('icons').appendChild(editIcon);

		var removeIcon = Loader.getSVG('icons', 'close-icon', 16, 16);
		removeIcon.item = item;
		item.getById('icons').appendChild(removeIcon);

		item.onClick = function()
		{
			var strCommand = this.command;
			var commandsList = this.command.split(';');

			for (var i = 0; i < commandsList.length; i++)
			{
				var command = commandsList[i];
				command = command.replace(/^ +/, '').replace(/ +$/, '');
				sendCommand(command);
			}
		};

		editIcon.onClick = function()
		{
			var htmlPopup = '<div>'
								+ '<h2>Edit macro</h2>'
								+ '<p>'
									+ '<input type="text" id="label" style="width: 300px; " placeholder="Label" value="' + this.item.label + '" />'
									+ '<br /><br />'
									+ '<input type="text" id="command" style="width: 300px; " placeholder="Command" value="' + this.item.command + '" />'
								+ '</p>'
							+ '</div>';
			
			var editPopup = new ConfirmPopup(htmlPopup, true);
			editPopup.item = this.item;

			editPopup.onOk = function()
			{
				var label = this.getById('label').value;
				var command = this.getById('command').value;

				if (label !== '' && command !== '')
				{
					this.item.label = label;
					this.item.command = command;
					this.item.getById('label').innerHTML = label;
				}

				saveMacros();
				return true;
			};

			document.getElementById('main').appendChild(editPopup);
		};

		removeIcon.onClick = function()
		{
			var htmlPopup = '<p>Are you sure you want to remove this macro? </p>';
			var removePopup = new ConfirmPopup(htmlPopup, true);
			removePopup.item = this.item;

			removePopup.onOk = function()
			{
				macroListBox.removeElement(this.item);
				saveMacros();
				return true;
			};

			document.getElementById('main').appendChild(removePopup);
		};

		macroListBox.addElement(item);
	};

	var saveMacros = function()
	{
		var macrosToSave = [];
		var macrosList = macroListBox.getElementsList();

		for (var i = 0; i < macrosList.length; i++)
			macrosToSave.push({ label: macrosList[i].label, command: macrosList[i].command });

		window.electronAPI.saveMacros(connectInfo.id, macrosToSave);
	};

	var createTranslation = function($translateData)
	{
		var itemHTML = '<div class="macroRow" >'
							+ '<div id="label" >' + $translateData.label + '</div>'
							+ '<div id="icons" class="icons" ></div>'
						+ '</div>';

		var item = new ListItem(itemHTML);
		item.label = $translateData.label;
		item.start = $translateData.start;
		item.end = $translateData.end;

		var editIcon = Loader.getSVG('icons', 'edit-icon', 16, 16);
		editIcon.item = item;
		item.getById('icons').appendChild(editIcon);

		var removeIcon = Loader.getSVG('icons', 'close-icon', 16, 16);
		removeIcon.item = item;
		item.getById('icons').appendChild(removeIcon);

		editIcon.onClick = function()
		{
			var htmlPopup = '<div>'
								+ '<h2>Edit translation block</h2>'
								+ '<p>'
									+ '<input type="text" id="label" style="width: 300px; " placeholder="Label" value="' + this.item.label + '" />'
									+ '<br /><br />'
									+ '<input type="text" id="start" style="width: 300px; " placeholder="Start" value="' + this.item.start + '" />'
									+ '<br /><br />'
									+ '<input type="text" id="end" style="width: 300px; " placeholder="End" value="' + this.item.end + '" />'
								+ '</p>'
							+ '</div>';
			
			var editPopup = new ConfirmPopup(htmlPopup, true);
			editPopup.item = this.item;

			editPopup.onOk = function()
			{
				var label = this.getById('label').value;
				var start = this.getById('start').value;
				var end = this.getById('end').value;

				if (label !== '' && (start !== '' || end !== ''))
				{
					this.item.label = label;
					this.item.start = start;
					this.item.end = end;
					this.item.getById('label').innerHTML = label;
				}

				saveTranslationSettings();
				return true;
			};

			document.getElementById('main').appendChild(editPopup);
		};

		removeIcon.onClick = function()
		{
			var htmlPopup = '<p>Are you sure you want to remove this translation block? </p>';
			var removePopup = new ConfirmPopup(htmlPopup, true);
			removePopup.item = this.item;

			removePopup.onOk = function()
			{
				translateListBox.removeElement(this.item);
				saveTranslationSettings();
				return true;
			};

			document.getElementById('main').appendChild(removePopup);
		};

		translateListBox.addElement(item);
	};

	var saveTranslationSettings = function()
	{
		var translationSettingsToSave = [];
		var translateList = translateListBox.getElementsList();

		for (var i = 0; i < translateList.length; i++)
			translationSettingsToSave.push({ label: translateList[i].label, start: translateList[i].start, end: translateList[i].end });

		window.electronAPI.saveTranslationSettings(connectInfo.id, translationSettingsToSave);
	};

	var previousCommand = function()
	{
		if (previousCommands.length > 0)
        {
            commandsCursor--; 
                    
            if (commandsCursor < 0)
                commandsCursor = 0; 
                    
            if (setTmpCommand === false)
            {
                tmpCommand = component.getById('command').value; 
                setTmpCommand = true; 
            }
                    
            component.getById('command').value = previousCommands[commandsCursor]; 
        }
	};

	var nextCommand = function()
	{
		if (previousCommands.length > 0)
        {
            commandsCursor++; 
                    
            if (commandsCursor > previousCommands.length)
                commandsCursor = previousCommands.length; 
                    
            if (commandsCursor >= previousCommands.length)
            {
                if (tmpCommand === "")
                {
                    commandsCursor = previousCommands.length-1; 
                    component.getById('command').value = previousCommands[commandsCursor]; 
                }
                else
					component.getById('command').value = tmpCommand; 
            }
            else
				component.getById('command').value = previousCommands[commandsCursor]; 
                        
            //console.log("Nombre de commandes : " + previousCommands.length + ", Curseur : " + commandsCursor + ", tmp commande : " + tmpCommand); 
        }
	};

	////////////////////////////
	// Gestion des événements //
	////////////////////////////

	addIcon.onClick = function()
	{
		var htmlPopup = '';

		var selectedTab = tabManager.getSelected();

		if (selectedTab === macrosTab)
		{
			htmlPopup = '<div>'
							+ '<h2>Create new macro</h2>'
							+ '<p>'
								+ '<input type="text" id="label" style="width: 300px; " placeholder="Label" />'
								+ '<br /><br />'
								+ '<input type="text" id="command" style="width: 300px; " placeholder="Command" />'
							+ '</p>'
						+ '</div>';
		}
		else
		{
			htmlPopup = '<div>'
							+ '<h2>Create new translation block</h2>'
							+ '<p>'
								+ '<input type="text" id="label" style="width: 300px; " placeholder="Label" />'
								+ '<br /><br />'
								+ '<input type="text" id="start" style="width: 300px; " placeholder="Start" value="^" />'
								+ '<br /><br />'
								+ '<input type="text" id="end" style="width: 300px; " placeholder="End" value="$" />'
							+ '</p>'
						+ '</div>';
		}

		var createPopup = new ConfirmPopup(htmlPopup);

		if (selectedTab === macrosTab)
		{
			createPopup.onOk = function()
			{
				var label = this.getById('label').value;
				var command = this.getById('command').value;

				if (label !== '' && command !== '')
					createMacro({ label: label, command: command });

				saveMacros();

				return true;
			};
		}
		else
		{
			createPopup.onOk = function()
			{
				var label = this.getById('label').value;
				var start = this.getById('start').value;
				var end = this.getById('end').value;

				if (label !== '' && (start !== '' || end !== ''))
					createTranslation({ label: label, start: start, end: end });

				saveTranslationSettings();

				return true;
			};
		}

		document.getElementById('main').appendChild(createPopup);
	};

	this.onKeyDown = function($event)
	{
		//console.log("DOC KEYDOWN");
		//console.log($event.keyCode);

		if ($event.keyCode === 13)
			sendCommand(component.getById('command').value);
        else if ($event.keyCode === 38)
            previousCommand();
        else if ($event.keyCode === 40)
            nextCommand();
	};

	this.onKeyUp = function($event)
	{
		console.log("DOC KEYUP");
		console.log($event.keyCode);
	};

	component.getById('command').addEvent("keydown", function($event)
	{
		if (window.event)
			$event = window.event;

		if ($event.keyCode === 38)
		{
			Events.preventDefault($event);
            previousCommand();
		}
        else if ($event.keyCode === 40)
		{
			Events.preventDefault($event);
            nextCommand();
		}
	});

	component.getById('sendCommand').onClick = function() { sendCommand(component.getById('command').value); };
	component.getById('reconnect').onClick = function() { window.electronAPI.reconnect(connectInfo.id); };

	component.getById('translate').onClick = function()
	{
		var contentToTranslate = component.getById('english').value;

		if (contentToTranslate !== '')
		{
			var request = new HttpRequestJson();
			request.setMethod('GET');
			request.setTarget('https://translate.googleapis.com/translate_a/single');

			request.onSuccess = function($status, $data)
			{
				console.log("SUCCESS");
				console.log($status);
				//console.log($data);

				var translation = '';

				for (var j = 0; j < $data[0].length; j++)
					translation = translation + $data[0][j][0];

				translationLogs = translationLogs + '<p>' + HTML.DARK_GREEN + '[ENGLISH]</span><br /><span style="font-weight: bold; " >' + contentToTranslate + '</span>'
													+ '<br /><br />' + languageColors[viewManager.getSettings().getLanguage()] 
													+ '[' + languageNames[viewManager.getSettings().getLanguage()] + ']</span><br /><span style="font-weight: bold; " >' + translation + '</span></p>';

				component.getById('translateConsole').innerHTML = translationLogs;
				component.getById('translateConsole').scrollTop = 1000000000000000;
				component.getById('translateConsole').setAttribute('scrollTop', 1000000000000000);
				component.getById('english').value = '';
			};

			request.onError = function($status, $data)
			{
				console.log("ERROR");
				console.log($status);
				console.log($data);
			};

			var messageToTranslate = stripHtml(contentToTranslate).replaceAll('<br />', '');
			request.send({ "client": "gtx", "sl": "en", "tl": viewManager.getSettings().getLanguage(), "dt": "t", "q": messageToTranslate }, {});
		}
	};

	////////////////
	// Accesseurs //
	////////////////

	// GET
	
	this.getConnectInfo = function() { return connectInfo; };
	
	// SET
	
	//////////////
	// Héritage //
	//////////////
	
	var $this = utils.extend(component, this);
	return $this; 
}

if (Loader !== null && Loader !== undefined)
	Loader.hasLoaded("document");

