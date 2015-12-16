$.dispatchPlatform = {
    id: 'Platform Dispatch',
    version: '1.4.1',
    defaults: {
		$platform:"DC", 						//	Options are for now "DC" -> DoubleClick & "SK" -> Sizmek
		$isRich: true,							//	If this is set to false, the plugin will bypass functionality setup of a rich media unit
		$loadPolitely: true,					//	Whether or not the unit takes the extra step of using a polite loader *NA if not a RM Unit*
		
		$expandable: true,						//	Whether or not the Unit Expands - If this is set to false, the "$collapsed" parameter will be the units dimensions
		$expandDirection: "down",				//	If "$expandable" parameter is set to true, direction in which the unit expands ["Up", "Down", "Left", "Right"]
		$collapsedSize:	[300, 250],				//	Size ([Width, Height]) of the collapsed state of the unit *If Not Rich, this is consists of the dimensions of the unit*
		$expandedSize:	[550, 250],				//	Size ([Width, Height]) of the expanded state of the unit *NA if not a RM Unit*
		
		$collapseImageOrText: "Collapse",		// If Rich Media Unit, Url of Image or Text contained in Button.  If Blank, will be an invisible div with copy "Collapse" located based on values in "$collapsedBtnSize"
		$expandImageOrText: "Expand",			// If Rich Media Unit, Url of Image or Text contained in Button.  If Blank, will be an invisible div with copy "Expand" located based on values in "$expandedBtnSize"
		$collapseBtnSizePos: [0, 0, 0, 0],		// Array of [Width, Height, X, Y] of Collapse Button if 0, will be set to default size of [200 - width, 30 - height, lower right corner of expand panel]
		$expandBtnSizePos: [0, 0, 0, 0],		// Array of [Width, Height, X, Y] of Expand Button if 0, will be set to default size of [200 - width, 30 - height, lower right corner of collapse panel]
	}
};

(function ($) 
{
	"use strict";
	
	var _platform;
	
	var _isRich;
	var _loadPolitely;
	var _expandable;
	var _expandDirection;
	
	var _collapsedSize;
	var _newCollapsedSize;
	var _expandedSize;
	var _newExpandedSize;
	
	var collapsed_panel;
	var btnExpandCTA;
	
	var expanded_panel;
	var btnCloseCTA;
	
	var _collapseImageOrText;
	var _expandImageOrText;
	var _collapseBtnSizePos;
	var _expandBtnSizePos;

	var _isExpanded;
	
	var $bg_exit;
	var $bg_expanded_exit;	
				
	var $ctas;
	
	var _script = document.createElement("script");
	var _head = document.getElementsByTagName("head")[0];
	
	var adDiv;
	
    $.fn.extend({
        dispatchPlatform: function (params) 
		{
            return this.each(function () 
			{
                var opts = $.extend({}, this.defaults, params);
				
				$(document).ready(function(evt)
				{
					_isRich = opts.$isRich;
					_platform = opts.$platform;
					_collapsedSize = opts.$collapsedSize;
					
					_loadPolitely = opts.$loadPolitely;
					
					_collapsedSize = opts.$collapsedSize;
					_newCollapsedSize = [_collapsedSize[0] - 2, _collapsedSize[1] - 2];
					
					if (_isRich)
					{
						_expandable = opts.$expandable;
						_expandDirection = opts.$expandSirection;
						_expandedSize = opts.$expandedSize;
						
						if (_expandable)
						{
							collapsed_panel = document.getElementById("collapsed-panel");
							expanded_panel = document.getElementById("expanded-panel");
						
							_collapseImageOrText = opts.$collapseImageOrText;
							_expandImageOrText = opts.$expandImageOrText;
							_collapseBtnSizePos = opts.$collapseBtnSizePos;
							_expandBtnSizePos = opts.$expandBtnSizePos;	
						}
						var $bg_exit;	
						var $ctas;	
					}
					$("head").prepend("<meta name='unit-size' content='width='" + _collapsedSize[0] + ", height='" + _collapsedSize[1] + "'>");	
	
					_script.type = "text/javascript";
					_script.class = "skjs";
					
					switch (_platform)
					{
						case "DC" :    					
							$(".skjs").remove();
							
							break;
							
						case "SK" :
							$(".dcjs").remove();
							
							if (!_isRich)
							{
								_script.src = "https://secure-ds.serving-sys.com/BurstingScript/EBLoader.js";
							} else {
								_script.src = "http://ds.serving-sys.com/BurstingScript/adKit/adkit.js";
								
								var _script_2 = document.createElement("script");
								_script_2.append("EBModulesToLoad = ['EBCMD'];");
							}
							break;
					}
					//console.log(_platform);
					
					style_elements();
					window.addEventListener("load", init_platform);
				});
			});
        }
    });
	
	function style_elements()
	{		
		if (_isRich && _expandable)
		{
			_newExpandedSize = [_expandedSize[0] - 2, _expandedSize[1] - 2];
			
			$("body").css({
				"width" : _expandedSize[0] + "px",
				"height" : _expandedSize[1] + "px"
			});
			
			$("#main-panel").css({
				"width" : _expandedSize[0] + "px",
				"height" : _expandedSize[1] + "px",
				"border" : "1px solid #000"
			});
			
			$("#collapsed-panel").css({
				"width" : _newCollapsedSize[0] + "px",
				"height" : _newCollapsedSize[1] + "px",
				"border" : "1px solid #000"
			});
			
			$("#expanded-panel").css({
				"width" : _newExpandedSize[0] + "px",
				"height" : _newExpandedSize[1] + "px",
				"border" : "1px solid #000"
			});
		} else {
			$("body").css({
				"width" : _collapsedSize[0] + "px",
				"height" : _collapsedSize[1] + "px"
			});
				
			$("#main-panel").css({
				"width" : _newCollapsedSize[0] + "px",
				"height" : _newCollapsedSize[1] + "px",
				"border" : "1px solid #000"
			});		
		}
	}
	
	function init_platform()
	{
		if (!_isRich)
		{		
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
			}
		} else {
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
					adkit.onReady(init_handle);
					break;
			}
		}
	}
	
	function init_handle()
	{		
		addEventListeners();
		if (!_isRich)
		{
			init_strd_setup();
		} else {
			init_rich_setup();
		}
	}
	
	function init_strd_setup()
	{
		adDiv = document.getElementById("main-panel");
		init_animation();
	}
	
	function init_rich_setup()
	{
		if (_expandable)
		{
			_isExpanded = false;
			
			switch (_platform)
			{
				case "DC" :
					/* Offset of left,top and width height, respectively, of the expanded Masthead. */
					Enabler.setExpandingPixelOffsets(0, 0, _expandedSize[0], _expandedSize[1]);
					
					break;
					
				case "SK" :
					
					
					break;
			}
			init_ctas();
		}
	}
	
	/*	Setup the Call-to-Actions for the RM Units	*/
	function get_cta_type($elm)
	{
		var $img;
		if ($elm.attr("data-cta-type") === "image")
		{
			$img = true;	
		} else {
			$img = false;
		}
		return $img; 
	}
	
	function init_ctas()
	{
		//Create Elements
		var $btns = [[btnCloseCTA,"ctaClose_dc"], [btnExpandCTA,"ctaExpand_dc"]];
		
		$.each([_collapseImageOrText, _expandImageOrText], function($idx, $str)
		{
			if ($str.indexOf(".jpg") !== -1 || $str.indexOf(".jpeg") !== -1 || $str.indexOf(".png") !== -1)
			{
				$btns[$idx][0] = $("<div data-cta-type='image' id='" + $btns[$idx][1] + "' class='cta'><img src=" + $str + "></div>");
			} else if ($str !== "") 
			{
				$btns[$idx][0] = $("<div data-cta-type='text' id='" + $btns[$idx][1] + "' class='cta'>" + $str + "</div>");
			} else {
				$btns[$idx][0] = $("<div data-cta-type='text' id='" + $btns[$idx][1] + "' class='cta'>Click To Expand</div>");
				$btns[$idx][0].css({"opacity":"0"});
			}
		});
		
		//	Assign Variables to Their Respective Panels
		collapsed_panel = $("#collapsed-panel");
		collapsed_panel.prepend(btnExpandCTA);
	
		expanded_panel = $("#expanded-panel");
		expanded_panel.prepend(btnCloseCTA);
		
		btnCloseCTA.css({
			"width" : _collapseBtnSizePos[0] + "px",
			"height" : _collapseBtnSizePos[1] + "px",
			"transform" : "translate(" + _collapseBtnSizePos[2] + "," + _collapseBtnSizePos[3] + ")"
		});
		
		if (get_cta_type(btnCloseCTA))
		{
			btnCloseCTA.find("img").css({
				"width" : _collapseBtnSizePos[0] + "px",
				"height" : _collapseBtnSizePos[1] + "px"				
			});
		}
		
		btnExpandCTA.css({
			"width" : _expandBtnSizePos[0] + "px",
			"height" : _expandBtnSizePos[1] + "px",
			"transform" : "translate(" + _expandBtnSizePos[2] + "," + _expandBtnSizePos[3] + ")"
		});
		
		if (get_cta_type(btnExpandCTA))
		{
			btnExpandCTA.find("img").css({
				"width" : _expandBtnSizePos[0] + "px",
				"height" : _expandBtnSizePos[1] + "px"			
			});
		}
	}
	function clickThrough()
	{
		switch (_platform)
		{
			case "DC" :
				Enabler.exit("clicktag");
				window.open(window.clickTag);
				
				break;
				
			case "SK" :
				EB.clickthrough();
				
				break;
		}
	}
	function addEventListeners()
	{
		document.getElementById("main-panel").addEventListener("click", function()
		{
			clickThrough();
		});
	}
})(jQuery);