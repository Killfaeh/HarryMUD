var ANSI = 
{
	"SANE": "\u001B[0m", 
	"BOLD": "\u001B[1m", 
	"UNDERLINE": "\u001B[4m", 
	"NO_UNDERLINE": "\u001B[24m", 
	"NEGATIVE": "\u001B[7m", 
	"POSITIVE": "\u001B[27m", 
	
	"BLACK": "\u001B[0;30m", 
	"RED": "\u001B[0;31m", 
	"GREEN": "\u001B[0;32m", 
	"YELLOW": "\u001B[0;33m", 
	"BLUE": "\u001B[0;34m", 
	"MAGENTA": "\u001B[0;35m", 
	"CYAN": "\u001B[0;36m", 
	"WHITE": "\u001B[0;37m", 
	
	"DARK_BLACK": "\u001B[1;30m", 
	"DARK_RED": "\u001B[1;31m", 
	"DARK_GREEN": "\u001B[1;32m", 
	"DARK_YELLOW": "\u001B[1;33m", 
	"DARK_BLUE": "\u001B[1;34m", 
	"DARK_MAGENTA": "\u001B[1;35m", 
	"DARK_CYAN": "\u001B[1;36m", 
	"DARK_WHITE": "\u001B[1;37m", 
	
	"FORGROUND_DEFAULT": "\u001B[39m", 
	
	"BACKGROUND_BLACK": "\u001B[40m", 
	"BACKGROUND_RED": "\u001B[41m", 
	"BACKGROUND_GREEN": "\u001B[42m", 
	"BACKGROUND_YELLOW": "\u001B[43m", 
	"BACKGROUND_BLUE": "\u001B[44m", 
	"BACKGROUND_MAGENTA": "\u001B[45m", 
	"BACKGROUND_CYAN": "\u001B[46m", 
	"BACKGROUND_WHITE": "\u001B[47m", 
	"BACKGROUND_DEFAULT": "\u001B[49m"
}; 

var HTML = 
{
	"SANE": "</span>", 
	"BOLD": "<span style=\"font-weight: bold; \" >", 
	"UNDERLINE": "<span style=\"text-decoration: underline; \" >", 
	
	"BLACK": "<span style=\"color: rgb(0, 0, 0); \" >", 
	"RED": "<span style=\"color: rgb(255, 0, 0); \" >", 
	"GREEN": "<span style=\"color: rgb(0, 255, 0); \" >", 
	"YELLOW": "<span style=\"color: rgb(255, 255, 0); \" >", 
	"BLUE": "<span style=\"color: rgb(117, 140, 252); \" >", 
	"MAGENTA": "<span style=\"color: rgb(255, 0, 255); \" >", 
	"CYAN": "<span style=\"color: rgb(0, 255, 255); \" >", 
	"WHITE": "<span style=\"color: rgb(200, 200, 200); \" >", 
	
	"DARK_BLACK": "<span style=\"color: rgb(0, 0, 0); font-weight: bold; \" >", 
	"DARK_RED": "<span style=\"color: rgb(255, 0, 0); font-weight: bold; \" >", 
	"DARK_GREEN": "<span style=\"color: rgb(0, 255, 0); font-weight: bold; \" >", 
	"DARK_YELLOW": "<span style=\"color: rgb(255, 255, 0); font-weight: bold; \" >", 
	"DARK_BLUE": "<span style=\"color: rgb(117, 140, 252); font-weight: bold; \" >", 
	"DARK_MAGENTA": "<span style=\"color: rgb(255, 0, 255); font-weight: bold; \" >", 
	"DARK_CYAN": "<span style=\"color: rgb(0, 255, 255); font-weight: bold; \" >", 
	"DARK_WHITE": "<span style=\"color: rgb(200, 200, 200); font-weight: bold; \" >", 
	
	"BACKGROUND_BLACK": "<span style=\"background-color: rgb(0, 0, 0); \" >", 
	"BACKGROUND_RED": "<span style=\"background-color: rgb(255, 0, 0); \" >", 
	"BACKGROUND_GREEN": "<span style=\"background-color: rgb(0, 255, 0); \" >", 
	"BACKGROUND_YELLOW": "<span style=\"background-color: rgb(255, 255, 0); \" >", 
	"BACKGROUND_BLUE": "<span style=\"background-color: rgb(117, 140, 252); \" >", 
	"BACKGROUND_MAGENTA": "<span style=\"background-color: rgb(255, 0, 255); \" >", 
	"BACKGROUND_CYAN": "<span style=\"background-color: rgb(0, 255, 255); \" >", 
	"BACKGROUND_WHITE": "<span style=\"background-color: rgb(200, 200, 200); \" >" 
}; 

/*
String.prototype.replaceAll = function($search, $replacement)
{
	var target = this;
	
	while (target.includes($search))
		target = target.replace($search, $replacement);
	
	return target;
};
//*/

var HTMLtoANSI = function($input)
{
	var output = $input.replaceAll("[password]", "IAC WILL ECHO")
						.replaceAll("<br />", "\n")
						.replaceAll("<span style=\"display: inline-block; width: 25px; \" ></span>", "\t")
						.replaceAll(HTML.SANE, ANSI.SANE)
						.replaceAll(HTML.BOLD, ANSI.BOLD)
						.replaceAll(HTML.UNDERLINE, ANSI.UNDERLINE)
						.replaceAll(HTML.BLACK, ANSI.BLACK)
						.replaceAll(HTML.RED, ANSI.RED)
						.replaceAll(HTML.GREEN, ANSI.GREEN)
						.replaceAll(HTML.YELLOW, ANSI.YELLOW)
						.replaceAll(HTML.BLUE, ANSI.BLUE)
						.replaceAll(HTML.MAGENTA, ANSI.MAGENTA)
						.replaceAll(HTML.CYAN, ANSI.CYAN)
						.replaceAll(HTML.WHITE, ANSI.WHITE)
						.replaceAll(HTML.DARK_BLACK, ANSI.DARK_BLACK)
						.replaceAll(HTML.DARK_RED, ANSI.DARK_RED)
						.replaceAll(HTML.DARK_GREEN, ANSI.DARK_GREEN)
						.replaceAll(HTML.DARK_YELLOW, ANSI.DARK_YELLOW)
						.replaceAll(HTML.DARK_BLUE, ANSI.DARK_BLUE)
						.replaceAll(HTML.DARK_MAGENTA, ANSI.DARK_MAGENTA)
						.replaceAll(HTML.DARK_CYAN, ANSI.DARK_CYAN)
						.replaceAll(HTML.DARK_WHITE, ANSI.DARK_WHITE)
						.replaceAll(HTML.BACKGROUND_BLACK, ANSI.BACKGROUND_BLACK)
						.replaceAll(HTML.BACKGROUND_RED, ANSI.BACKGROUND_RED)
						.replaceAll(HTML.BACKGROUND_GREEN, ANSI.BACKGROUND_GREEN)
						.replaceAll(HTML.BACKGROUND_YELLOW, ANSI.BACKGROUND_YELLOW)
						.replaceAll(HTML.BACKGROUND_BLUE, ANSI.BACKGROUND_BLUE)
						.replaceAll(HTML.BACKGROUND_MAGENTA, ANSI.BACKGROUND_MAGENTA)
						.replaceAll(HTML.BACKGROUND_CYAN, ANSI.BACKGROUND_CYAN)
						.replaceAll(HTML.BACKGROUND_WHITE, ANSI.BACKGROUND_WHITE); 
	
	return output; 
}; 

var ANSItoHTML = function($input)
{
	var output = $input.replaceAll("IAC WILL ECHO", "[password]")
						.replaceAll("IAC WONT ECHO", "")
						.replaceAll("\n", "<br />")
						.replaceAll("\t", "<span style=\"display: inline-block; width: 25px; \" ></span>")
						.replaceAll(ANSI.SANE, HTML.SANE)
						.replaceAll(ANSI.BOLD, HTML.BOLD)
						.replaceAll(ANSI.UNDERLINE, HTML.UNDERLINE)
						.replaceAll(ANSI.BLACK, HTML.BLACK)
						.replaceAll(ANSI.RED, HTML.RED)
						.replaceAll(ANSI.GREEN, HTML.GREEN)
						.replaceAll(ANSI.YELLOW, HTML.YELLOW)
						.replaceAll(ANSI.BLUE, HTML.BLUE)
						.replaceAll(ANSI.MAGENTA, HTML.MAGENTA)
						.replaceAll(ANSI.CYAN, HTML.CYAN)
						.replaceAll(ANSI.WHITE, HTML.WHITE)
						.replaceAll(ANSI.DARK_BLACK, HTML.DARK_BLACK)
						.replaceAll(ANSI.DARK_RED, HTML.DARK_RED)
						.replaceAll(ANSI.DARK_GREEN, HTML.DARK_GREEN)
						.replaceAll(ANSI.DARK_YELLOW, HTML.DARK_YELLOW)
						.replaceAll(ANSI.DARK_BLUE, HTML.DARK_BLUE)
						.replaceAll(ANSI.DARK_MAGENTA, HTML.DARK_MAGENTA)
						.replaceAll(ANSI.DARK_CYAN, HTML.DARK_CYAN)
						.replaceAll(ANSI.DARK_WHITE, HTML.DARK_WHITE)
						.replaceAll(ANSI.BACKGROUND_BLACK, HTML.BACKGROUND_BLACK)
						.replaceAll(ANSI.BACKGROUND_RED, HTML.BACKGROUND_RED)
						.replaceAll(ANSI.BACKGROUND_GREEN, HTML.BACKGROUND_GREEN)
						.replaceAll(ANSI.BACKGROUND_YELLOW, HTML.BACKGROUND_YELLOW)
						.replaceAll(ANSI.BACKGROUND_BLUE, HTML.BACKGROUND_BLUE)
						.replaceAll(ANSI.BACKGROUND_MAGENTA, HTML.BACKGROUND_MAGENTA)
						.replaceAll(ANSI.BACKGROUND_CYAN, HTML.BACKGROUND_CYAN)
						.replaceAll(ANSI.BACKGROUND_WHITE, HTML.BACKGROUND_WHITE); 
	
	return output; 
}; 

var removeANSI = function($input)
{
	var output = $input.replaceAll("IAC WILL ECHO", "")
						.replaceAll("IAC WONT ECHO", "")
						.replaceAll(ANSI.SANE, "")
						.replaceAll(ANSI.BOLD, "")
						.replaceAll(ANSI.UNDERLINE, "")
						.replaceAll(ANSI.BLACK, "")
						.replaceAll(ANSI.RED, "")
						.replaceAll(ANSI.GREEN, "")
						.replaceAll(ANSI.YELLOW, "")
						.replaceAll(ANSI.BLUE, "")
						.replaceAll(ANSI.MAGENTA, "")
						.replaceAll(ANSI.CYAN, "")
						.replaceAll(ANSI.WHITE, "")
						.replaceAll(ANSI.DARK_BLACK, "")
						.replaceAll(ANSI.DARK_RED, "")
						.replaceAll(ANSI.DARK_GREEN, "")
						.replaceAll(ANSI.DARK_YELLOW, "")
						.replaceAll(ANSI.DARK_BLUE, "")
						.replaceAll(ANSI.DARK_MAGENTA, "")
						.replaceAll(ANSI.DARK_CYAN, "")
						.replaceAll(ANSI.DARK_WHITE, "")
						.replaceAll(ANSI.BACKGROUND_BLACK, "")
						.replaceAll(ANSI.BACKGROUND_RED, "")
						.replaceAll(ANSI.BACKGROUND_GREEN, "")
						.replaceAll(ANSI.BACKGROUND_YELLOW, "")
						.replaceAll(ANSI.BACKGROUND_BLUE, "")
						.replaceAll(ANSI.BACKGROUND_MAGENTA, "")
						.replaceAll(ANSI.BACKGROUND_CYAN, "")
						.replaceAll(ANSI.BACKGROUND_WHITE, ""); 
	
	return output; 
}; 

/*
var telnetCommands =
{
	1: "ECHO",
	//3: "SUPR",
	//5: "STAT",
	//6: "TIME",
	10: '<br />',
	//13: '',
	//24: "TTYP",
	//31: "WSIZ",
	//32: "TSPD",
	//32: "&nbsp;",
	//33: "RFCT",
	//34: "LNMD",
	//36: "ENVS",
	//60: "&lt;",
	//62: "&gt;",
	//91: "MXP",
	//242: "SYNCH",
	//236: "EOF",
	//237: "SUSP",
	//238: "ABORT",
	//239: "EOR",
	//240: "SE",
	//241: "NOP",
	//242: "DM",
	//243: "BREAK",
	//244: "IP",
	//245: "AO",
	//246: "AYT",
	//247: "EC",
	//248: "EL",
	//249: "GA",
	//250: "SB",
	251: "WILL",
	252: "WONT",
	//253: "DO",
	//254: "DONT",
	255: "IAC",
};
//*/

var latin1Decode =
{
	1: "ECHO",
	//3: "",
	//5: "",
	//6: "",
	10: '<br />',
	//13: '',
	//24: "",
	//31: "",
	//32: "",
	//32: "&nbsp;",
	//33: "",
	//34: "",
	//36: "",
	//60: "&lt;",
	//62: "&gt;",
	//91: "",
	//242: "",
	//236: "",
	//237: "",
	//238: "",
	//239: "",
	//240: "",
	//241: "",
	//242: "",
	//243: "",
	//244: "",
	//245: "",
	//246: "",
	//247: "",
	//248: "",
	//249: "",
	//250: "",
	251: "WILL",
	252: "WONT",
	//253: "",
	//254: "",
	255: "IAC",
};

var utf8Decode =
{
	1: "ECHO",
	251: "WILL",
	252: "WONT",
	255: "IAC",
};

var languageColors = 
{
	de: HTML.DARK_WHITE,
	es: HTML.DARK_YELLOW,
	fr: HTML.DARK_CYAN,
	it: HTML.DARK_RED,
	pt: HTML.DARK_RED
};

var languageNames = 
{
	de: "DEUTSCH",
	es: "ESPAÑOL",
	fr: "FRANÇAIS",
	it: "ITALIANO",
	pt: "PORTUGUÊS"
};

if (Loader !== undefined && Loader !== null)
	Loader.hasLoaded("encoding");
