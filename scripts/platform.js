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
    version: 'v4.0.2',
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
		$replayVars: ["#000", 20, "topRight"],
		
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
					$("meta[name=unit-size]").attr("content", "width=" + _size[0] + ",height=" + _size[1]);
				
					var $click;				
					switch (_platform)
					{
						//	Since DC & Sizmek's platform REQUIRES the external script tag within the main HTML file (NOT Ideal & Very Ugly), here we apply the clicktag hardcode
						case "DC" :											
							$("#EbloadJS").remove();
							
							$click = "var clicktag = \"\";";
							mod_js("Add", $click, "head", "dcjs");
							
							var $dcsrc = "https://s0.2mdn.net/ads/studio/Enabler.js";
							mod_js("Load", $dcsrc, "head", "dcjs", get_animation_assets, "EnablerJS");
							
							break;
							
						case "SK" :
							get_animation_assets();
							
							break;
							
						case "FT" :	
							$("#EnablerJS, #EbloadJS").remove();
																										
							var $ftsrc = "http://cdn.flashtalking.com/frameworks/js/api/2/9/html5API.js";
							mod_js("Load", $ftsrc, "body", "ftjs", get_animation_assets, "FtdynJS");
							
							break;
							
						case "" :
							$("#EnablerJS, #EbloadJS").remove();
							
							$click = "var clicktag = \"\";";
							mod_js("Add", $click, "head", "dcjs");
							
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
		var $xCoord = 0;
		var $yCoord = 0;
		
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
		var $svgCode = $("<svg id='_ÎÓÈ_1' data-name='—ÎÓÈ_1' xmlns='http://www.w3.org/2000/svg' viewBox='0 0 320 321.97'><path d='M249,354.63A110.64,110.64,0,1,1,321.6,159l-49.53,41.23L410,229.37,406.14,88.58l-45.36,37.75a160.93,160.93,0,1,0,40.69,174.93l-51.32-8.5A110.69,110.69,0,0,1,249,354.63Z' transform='translate(-90 -83.01)' class='replayGraphic'></svg>");
		
		$replayElm = $("<div id='replayBtn' class='free'></div>");
		$replayElm = $($replayElm);
		$replayElm.append($svgCode);
		
		get_replay_position(_replayVars[2]);
		
		$replayElm.css({
			"z-index" : "10",
			"padding" : "5px",
			"width" : _replayVars[1] + "px",
			"height" : _replayVars[1] + "px",
			
			"transition ": "all 0.3s ease-in-out 0s"
		});
		$("#unit-container").prepend($replayElm);
		$replayElm.hide();
		
		$("#replayBtn .replayGraphic").css({
			"fill" : _replayVars[0]
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
			
			var timer;
			$(this).hover(function() 
			{
				var angle = 0,
					$this = $(this);
			
				timer = setInterval(function() 
				{
					angle += 25;
					$this.css({
						"transform" : "rotate(" + angle + "deg)"
					});
				}, 50);
			},
			function() 
			{
				timer && clearInterval(timer);
				$(this).css({
					"transform" : "rotate(0deg)"
				});
			});
		
		});
	};
	
	function style_elements()
	{		
		$("body").css({
			"width" : _size[0] + "px",
			"height" : _size[1] + "px"
		});
			
		$("#unit-container").css({
			"width" : _newSize[0] + "px",
			"height" : _newSize[1] + "px",
			"font-family" : _font,
			"border" : "1px solid " + _borderColor
		});
			
		$("#main-panel").css({
			"width" : _newSize[0] + "px",
			"height" : _newSize[1] + "px"
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
			_$FT = new FT;
			//	This is the function that runs to prepare the tags for dynamic input 
			//({ID of Tag (without the "#")}, {FT tag replacement}, {Any Extra Attributes for the Method to Add})
			
			if (_data_type === "Dynamic")
			{
				$.each(_dyn_elms, function($idx) 
				{
					var $name = "name";
					var $val = 	_dyn_vars[$idx];				
					doLog("New Attributes " + $idx + " : " + $name + " = " + $val);
					
					var $newAttrs = [];
					$newAttrs.push([$name, $val]);
					
					getSetAttr(_dyn_elms[$idx], "ft-dynamic", $newAttrs);
					$newAttrs.length = 0;
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
				
			case "" :
				window.open(window.clicktag);
				break;
		}
	}
	function addEventListeners()
	{
		//	If any additional clicktag elements have been added within the options, Flashtalking API applies the coding to them.
		//	Otherwise, the main panel (ususally the standard) will trigger the "background exit"
		if (_platform === "FT")
		{
			$panel = _$FT.query("#main-panel");
  			_$FT.applyClickTag($panel, 1);
			
			if (_clicktags)
			{
				for (var c = 0; c <= _clicktags.length; c++)
				{
					_$FT.applyClickTag($(_ct_elms[c]), c);
				}
			} 
		} else {
			$panel = document.getElementById("main-panel");
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
		
		if ($($elm).is("img"))
		{
/*>*/		doLog("Type 1");
			
			if ($elm.attributes)
			{
				var $transAttrs = [];

				$transAttrs[0] = [];
				$transAttrs[1] = [];
				
				$.each($elm.attributes, function() 
				{
					if (this.name !== "id")
					{
/*>*/					doLog("Name: " + this.name);
/*>*/					doLog("Value: " + this.value);
					}
					$transAttrs[0].push(this.name);
					$transAttrs[1].push(this.value);
				});
				var $newElm = $($elm).returnReplaced($("<" + $rplceTag + ">" + $elm.innerHTML + "</" + $rplceTag + ">"));
				$newElm.prop("id", $id);
				replace_attributes($newElm, $id, $rplceAttrs, $transAttrs);				
			} else {
				$($elm).replaceWith($("<" + $rplceTag + ">" + $elm.innerHTML + "</" + $rplceTag + ">"));
			}
		} else {
/*>*/		doLog("Type 2");
			
			var $html = $($elm).innerHTML;
			$($elm).html("<" + $rplceTag + ">" + $html + "</" + $rplceTag + ">");
			
			$($elm).find($rplceTag).after(function()
			{
				replace_attributes($(this), $id, $rplceAttrs);
			});
		}
	}
	
	function replace_attributes($elm, $id, $rplceAttrs, $transAttrs)
	{
		if ($rplceAttrs)
		{
			doLog("Supplying New Attributes to:");
			doLog($elm);
			
			doLog("Attributes being Supplied:");
			doLog($rplceAttrs);
			
			doLog($rplceAttrs.length);
			$.each($rplceAttrs, function($idx) 
			{
				doLog("In Loop, Supplying attribute: ");
				doLog($rplceAttrs[$idx][0]);
				doLog(", of value: ");
				doLog($rplceAttrs[$idx][1]);
				
				$elm.prop($rplceAttrs[$idx][0], $rplceAttrs[$idx][1]);
			});
		} 
		
		if ($transAttrs)
		{
			doLog("Transferring Attributes to: ");
			doLog($elm);
			
			doLog("Attributes being Transferred: ");
			doLog($transAttrs);
			
			$.each($transAttrs, function($idx)
			{
				doLog("In Loop, Transferring attribute: ");
				doLog($transAttrs[0][$idx]);
				doLog(", of value: ");
				doLog($transAttrs[1][$idx]);
				
				$elm.prop($transAttrs[0][$idx], $transAttrs[1][$idx]);
			});
			$transAttrs[0].length = 0; $transAttrs[1].length = 0; $transAttrs.length = 0;
		}
	}
	
	function doLog($string)
	{
		if (_testing)
		{
			doLog($string);
		}
	}
	
	$.fn.returnReplaced = function(a) 
	{
    	var $a = $(a);

    	this.replaceWith($a);
    	return $a;
	};
	
})(jQuery);