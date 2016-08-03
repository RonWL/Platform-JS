/*
"Platform-JS"
This plugin was created in order to streamline the process of building standard compliant digital ads, while giving developers involved the ability to customize the units.
	
Copyright (c) 2016 Ron W. LaGon - DDB Chicago

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
*/


$.dispatch = {
    id: 'Platform JS',
    version: 'v3',
    defaults: {
		//	Options are at the moment "DC" -> DoubleClick , "SK" -> Sizmek , "FT" -> FlashTalking , "" -> None		
		$platform:"DC", 
		
		//	Option to Load External Animation Library or Not (Greensock {0 - None, 1 - "Lite", or 2 - "Max"}).  If None Chosen, will default to not loading the Tweening Engine.
		//	The loaded URI is the CDN endpoint to the latest version of GS.
		$loadGS: 0,
		
		//	Select If the Unit is Dynamic or Static (Now ONLY Supports FlashTalking)
		$dataType: "Static",
		
		//	If the Unit Will be Dynamic, This array will hold the elements to be Registered with the variables in the Manifest.js file (Flash Talking)
		$dynElms: [],
		
		//	This Array holds the Variable(s) from which the elements in "$dynElms" will be populated with
		$dynVars: [],
		
		//	How Many Clicktags will be used within the Unit (Other than the Default Click Thru).  If None, are provided, will default to 0.
		$altTags: 0,
		
		//	The Elements that will Possess a CLick Tag.  Only Needed if the "$altTags" Option is Greater than 0.
		$ctElms: [],
		
		//	Size ([Width, Height]) of the collapsed state of the unit *If Not Rich, this is consists of the dimensions of the unit*
		$size:	[300, 250],
		
		//	The border color of the unit (If None Given in Options, will Default to Black
		$borderColor: "#000",
		
		//	The font included within the Unit (Especially Needed if Dynamic(Instant) Unit
		$font: "'Arial', sans-serif",
		
		//	Does the Unit have "Replay" Functionality
		$replay: false,
		
		//	If the Unit Has a replay Button, Vars for Button (Array of [{hexcolor}, {size}, {position: "topLeft", "topRight", "bottomLeft", or "bottomRight"}])
		$replayVars: ["#000", "20px", "topRight"],
		
		//	Sets a Logger for When Testing Edits / Updates to Plugin And / Or Unit Code	
		$testing: false
	}
};

(function ($) 
{
	"use strict";
	
	var _platform;
	var _loadGS;	
	var _size;
	var _newSize;
	
	var _borderColor;
	var _font;
	
	var _replay;
	var $replayElm;
	var _replayVars;
	
	
	//FlashTalking Variable
	var _$FT;
	var $panel;
	
	var _data_type;
	
	var _dyn_elms;
	var _dyn_vars;
	
	var _clicktags;
	var _ct_elms;
	
	var _testing;
	
	
    $.fn.extend({
        dispatch: function (params) 
		{
            return this.each(function () 
			{
                var opts = $.extend({}, this.defaults, params);
				
				_platform = opts.$platform;
				_loadGS = opts.$loadGS;
				_size = opts.$size;
				_newSize = [_size[0] - 2, _size[1] - 2];
				
				_font = opts.$font;
				_borderColor = opts.$borderColor;
				
				//	FlashTalking Options Declared in Root of Plugin
				_data_type = opts.$dataType;
				
				_dyn_elms = opts.$dynElms;
				_dyn_vars = opts.$dynVars;
						
				_clicktags = opts.$clickTags;
				_ct_elms = opts.$altTags;
				
				_replay = opts.$replay;
				_replayVars = opts.$replayVars;
				
				_testing = opts.$testing;
				
				//	Modify the Head or Body with the external script needed to create the platform-ready unit	
				$(".extHC").empty();
				
				$(document).ready(function()
				{					
					switch (_platform)
					{
						//	Since DC & Sizmek's platform REQUIRES the external script tag within the main HTML file (NOT Ideal & Very Ugly), here we apply the clicktag hardcode
						case "DC" :											
							$("#EbloadJS").remove();
							
							var $click = "var clicktag = \"\";";
							mod_js("Add", $click, "head", "dcjs");
							
							get_animation_assets();
							
							break;
							
						case "SK" :
							$("#EnablerJS").remove();
							get_animation_assets();
							
							break;
							
						case "FT" :	
							$("#EnablerJS, #EbloadJS").remove();
																										
							var $ftsrc = "https://cdn.flashtalking.com/frameworks/js/api/2/9/html5API.js";
							mod_js("Load", $ftsrc, "body", "ftjs", get_animation_assets, "FtdynJS");
							
							break;
							
						case "" :
							$("#EnablerJS, #EbloadJS").remove();
							get_animation_assets();						
							break;
					}
				});
			});
        }
    });
	
	function get_animation_assets()
	{
		if (_loadGS)
		{
			var $gs_prefix = "https://cdnjs.cloudflare.com/ajax/libs/gsap/latest/"; 
			var $gs_end;
			var $gs_url;
			
			switch (_loadGS)
			{
				case 1 :
					$gs_end = "TweenMax.min.js";
					break;
					
				case 2 :
					$gs_end = "TweenLite.min.js";
					break;
			}
			$gs_url = $gs_prefix + $gs_end;
			mod_js("Load", $gs_url, "head", "anjs", init_platform, "GsJS");
			
		} else {
			init_platform();
		}
	}
	
	function get_replay_position($var)
	{
		var $xCoord = 1;
		var $yCoord = 1;
		
		switch ($var)
		{
			case "topLeft" :
				$replayElm.css({
					"top" : $yCoord + "px",
					"left" : $xCoord + "px"
				});
				break;
				
			case "topRight" :
				$replayElm.css({
					"top" : + $yCoord + "px",
					"right" : $xCoord + "px"
				});
				break;
				
			case "bottomLeft" :
				$replayElm.css({
					"bottom" : $yCoord + "px",
					"left" : $xCoord + "px"
				});
				break;
				
			case "bottomRight" :
				$replayElm.css({
					"bottom" : $yCoord + "px",
					"right" : $xCoord + "px"
				});
				break;
		}
	}
	
	function init_replay_btn()
	{
		$replayElm = $("<div id='replayBtn' class='free'><h3 id='replay_txt'>&#10227;</h3></div>");
		$replayElm = $($replayElm);
		
		get_replay_position(_replayVars[2]);
		
		$replayElm.css({
			"z-index" : "10",
			"transform" : "rotate(-32deg)",
			"color" : _replayVars[0]
		});
		$("#main-panel").prepend($replayElm);
		$replayElm.hide();
		
		$("#replayBtn h3").css({
			"font-family" : "\'Work Sans\', sans-serif",
			"margin" : "0",
			"color" : _replayVars[0],
			"font-size" : _replayVars[1],
			"font-weight" : "900",
			"line-height" : "20px"
		});
	}
	
	$.fn.dispatch.show_replay = function()
	{
		doLog("Showing Replay");
		$replayElm = $("#replayBtn");
		
		$replayElm.fadeIn(800, function()
		{
			$(this).on("click", function(evt)
			{
				$(this).off("click");
				$(this).hide();
				reset_unit();
			});
		});
	};
	
	function style_elements()
	{		
		$("body").css({
			"margin" : "0",
			"padding" : "0",
			"width" : _size[0] + "px",
			"height" : _size[1] + "px"
		});
			
		$("#main-panel").css({
			"width" : _newSize[0] + "px",
			"height" : _newSize[1] + "px",
			"border" : "1px solid ",
			"font-family" : _font,
			"border-color" : _borderColor
		});	
		
		if (_replay)
		{
			doLog("Initing Replay");
			init_replay_btn();
		}
	}
	
	var init_platform = function()
	{		
		doLog("Initializing Platform...");
		style_elements();
		
		
		//	Per each platform, we have to wait for their external scripts to load before continuing the unit's process
		switch (_platform)
		{
			case "DC" :
				if (Enabler.isInitialized()) 
				{
					init_handle();
				} else {
					Enabler.addEventListener(studio.events.StudioEvent.INIT, init_handle);
				}
				break;
				
			case "SK" :
				if (!EB.isInitialized()) 
				{
					EB.addEventListener(EBG.EventName.EB_INITIALIZED, init_handle);
				} else {
					init_handle();
				}
				break;
			
			case "FT" :				
			case "" :	
				init_handle();
				
				break;
		}
	};
	
	function init_handle()
	{
		// Here we set up the elements that are included in the Unit to be read
		
		if (_platform === "FT")
		{
			//	This is the function that runs to prepare the tags for dynamic input 
			//({ID of Tag (without the "#")}, {FT tag replacement}, {Any Extra Attributes for the Method to Add})
			getSetAttr("main-panel", "ft-default", "clicktag=1");
			
			if (_data_type === "Dynamic")
			{
				$.each(_dyn_elms, function(idx, id) 
				{					
					var $newButes = "name='" + _dyn_vars[idx] + "'";
					doLog("New Attributes " + idx + " : " + $newButes);
					
					getSetAttr(_dyn_elms[idx], "ft-dynamic", $newButes);
				});
			}
		}
		addEventListeners();
		init_strd_setup();
	}
	
	function init_strd_setup()
	{
		//	This tells the unit that it's ready to continue with the animation of the unit.
		//	This method is located within the main "script.js" file.
		init_animation();
	}
	/*		Listeners and Events	*/
	
	//	Controls the "exits" of each platform
	function background_exit()
	{
		switch (_platform)
		{
			case "DC" :
				Enabler.exit("clicktag");
				
				break;
				
			case "SK" :
				EB.clickthrough();
				
				break;
			
			//	The "exit" for FlashTalking is handled through the platform dynamically, so does not require any assignment here.	
			case "FT" :
				
				break;
		}
	}
	function addEventListeners()
	{
		//	If any additional clicktag elements have been added within the options, Flashtalking API applies the coding to them.
		//	Otherwise, the main panel (ususally the standard) will trigger the "background exit"
		$panel = document.getElementById("main-panel");
		if (_platform === "FT")
		{
			if (_clicktags)
			{
				for (var c = 0; c <= _clicktags.length; c++)
				{
					_$FT.applyClickTag($(_ct_elms[c]), c);
				}
			}
		} else {
			$panel.addEventListener("click", function()
			{
				background_exit();
			});
		}
	}
	
	function mod_js($mod, $code, $tgtTag, $class, $callback, $id)
	{
		var $sc = document.createElement("script");
/*>*/	doLog("Code Being Added.........." + $code);
    	$sc.type = "text/javascript";
		switch($mod)
		{
			case "Add" :
				$sc.innerText = $code;
				break;
				
			case "Load" :
				$sc.src = $code;
				if ($callback) { $sc.onload = $callback; }
				break;
		}
		if ($id) { $sc.id = $id; }
		if ($class) { $sc.className = $class; }
		
    	document.getElementsByTagName($tgtTag)[0].appendChild($sc);
	}
	
	
	//	This method handles all of the replacement of tags that will be fed dynamic content. (FlashTalking)
	function getSetAttr($id, $rplceTag, $rplceAttrs)
	{
		doLog("Replacement Attributes: " + $rplceAttrs);
		var $elm = document.getElementById($id);
/*>*/	doLog("Found Element: " + $elm.id);
		
		if ($rplceTag === "ft-default" || $($elm).is("img"))
		{
/*>*/		doLog("Type 1");
			
			if ($elm.attributes)
			{
				var $attrs = [];

				$attrs[0] = [];
				$attrs[1] = [];
				
				$.each($elm.attributes, function() 
				{
					if (this.name !== "id")
					{
/*>*/					doLog("Name: " + this.name);
/*>*/					doLog("Value: " + this.value);
					}
					$attrs[0].push(this.name);
					$attrs[1].push(this.value);
				});
				$($elm).replaceWith($("<" + $rplceTag + " id=" + $id + " " + $rplceAttrs + ">" + $elm.innerHTML + "</" + $rplceTag + ">"));
				
				var $newElm = document.getElementById($id);
/*>*/			doLog("New Elm: " + $newElm.id);
				$.each($attrs, function(idx)
				{
					$($newElm).attr($attrs[0][idx], $attrs[1][idx]);
				});

				$attrs[0].length = 0; $attrs[1].length = 0; $attrs.length = 0;
			} else {
				$($elm).replaceWith($("<" + $rplceTag + ">" + $elm.innerHTML + "</" + $rplceTag + ">"));
			}
		} else {
/*>*/		doLog("Type 2");
			
			var $html = $($elm).innerHTML;
			$($elm).html("<" + $rplceTag + " " + $rplceAttrs + ">" + $html + "</" + $rplceTag + ">");
		}
		
	}
	
	function doLog($string)
	{
		if (_testing)
		{
			console.log(log_date() + " -----> " + $string);
		}
	}
	
	function log_date() 
	{
    	var d = new Date($.now());
    	var time = d.getHours() + " : " + d.getMinutes() + " : " + d.getSeconds() + " . " + d.getMilliseconds();
    	return (time); 
	}
	
})(jQuery);