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

$.dispatchPlatform = {
    id: 'Platform Dispatch',
    version: '1.6.36',
    defaults: {
		$platform:"DC", 						//	Options are at the moment "DC" -> DoubleClick & "SK" -> Sizmek
		$isRich: false,							//	If this is set to false, the plugin will bypass functionality setup of a rich media unit
		$loadPolitely: true,					//	Whether or not the unit takes the extra step of using a polite loader *NA if not a RM Unit*
		
		$expandable: true,						//	Whether or not the Unit Expands - If this is set to false, the "$collapsed" parameter will be the units dimensions
		$expandDirection: "down",				//	If "$expandable" parameter is set to true, direction in which the unit expands ["Up", "Down", "Left", "Right"]
		$collapsedSize:	[300, 250],				//	Size ([Width, Height]) of the collapsed state of the unit *If Not Rich, this is consists of the dimensions of the unit*
		$collapseAnimates: true,				// 	If Rich Media Unit and Expandable, determines if the collapsed state has animation 
		$expandedSize:	[550, 250],				//	Size ([Width, Height]) of the expanded state of the unit *NA if not a RM Unit*
		
		$collapseImageOrText: "Collapse",		// If Rich Media Unit, Url of Image or Text contained in Button.  If Blank, will be an invisible div with copy "Collapse" located based on values in "$collapseBtnSizePos"
		$expandImageOrText: "Expand",			// If Rich Media Unit, Url of Image or Text contained in Button.  If Blank, will be an invisible div with copy "Expand" located based on values in "$expandBtnSizePos"
		$collapseBtnSizePos: [0, 0, 0, 0, false],	// Array of [Width, Height, X, Y] of Collapse Button if 0, will be set to default size of [200 - width, 30 - height, lower right corner of expand panel]
		$expandBtnSizePos: [0, 0, 0, 0, true]		// Array of [Width, Height, X, Y] of Expand Button if 0, will be set to default size of [200 - width, 30 - height, lower right corner of collapse panel]
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
	
	var _collapsedAnimates;
	
	var _collapsedSize;
	var _newCollapsedSize;
	var _expandedSize;
	var _newExpandedSize;
	
	var $collapsed_panel;
	var $btnExpandCTA;
	
	var $expanded_panel;
	var $btnCloseCTA;
	
	var _collapseImageOrText;
	var _expandImageOrText;
	var _collapseBtnSizePos;
	var _expandBtnSizePos;

	var _isExpanded;
	
	var $bg_exit;
	var $bg_expanded_exit;	
				
	var $ctas;
	
	var $script = document.createElement("script");
	
	var ad_div;
	var sdk_data;
	
	var bannerDiv;
	var expandButton;

	
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
					
					_collapsedAnimates = opts.$collapsedAnimates;
					
					_collapsedSize = opts.$collapsedSize;
					_newCollapsedSize = [_collapsedSize[0] - 2, _collapsedSize[1] - 2];
					
					if (_isRich)
					{
						_expandable = opts.$expandable;
						_expandDirection = opts.$expandDirection;
						_expandedSize = opts.$expandedSize;
						
						if (_expandable)
						{
							$collapsed_panel = document.getElementById("collapsed-panel");
							$expanded_panel = document.getElementById("expanded-panel");
						
							_collapseImageOrText = opts.$collapseImageOrText;
							_expandImageOrText = opts.$expandImageOrText;
							_collapseBtnSizePos = opts.$collapseBtnSizePos;
							_expandBtnSizePos = opts.$expandBtnSizePos;	
						}	
					}

					$script.type = "text/javascript";
					
					
					switch (_platform)
					{
						case "DC" :    					
							$(".skjs").remove();
							
							break;
							
						case "SK" :
							$(".dcjs").remove();
							
							if (!_isRich)
							{
								
							} else {
								$script.src = "http://ds.serving-sys.com/BurstingScript/adKit/adkit.js";
								
								var $script_2 = document.createElement("script");
								$script_2.append("EBModulesToLoad = ['EBCMD'];");
								$("head").append($script_2);
							}
							break;
					}
					//console.log(_platform);
					$("head").prepend($script);
					
					style_elements();
					window.addEventListener("load", init_platform);
				});
			});
        }
    });
	
	function style_elements()
	{
		$bg_exit = $("<div id='bg-exit' class='exit' />");
		
		$("body").css({
			"margin" : "0",
			"padding" : "0"
		});
				
		if (_isRich && _expandable)
		{
			$("#collapsed-panel").prepend($bg_exit);
			_newExpandedSize = [_expandedSize[0] - 2, _expandedSize[1] - 2];
			
			$("body").css({
				"width" : _expandedSize[0] + "px",
				"height" : _expandedSize[1] + "px"
			});
			
			$("#main-panel").css({
				"width" : _expandedSize[0] + "px",
				"height" : _expandedSize[1] + "px",
				"position" : "absolute",
			});
			
			$("#collapsed-panel").css({
				"width" : _newCollapsedSize[0] + "px",
				"height" : _newCollapsedSize[1] + "px",
				"overflow" : "hidden",
				"position" : "absolute",
				"border" : "1px solid #000"
			});
			$(".col-full").css({
				"width" : _newCollapsedSize[0] + "px",
				"height" : _newCollapsedSize[1] + "px",
			});
			
			$("#expanded-panel").css({
				"width" : _newExpandedSize[0] + "px",
				"height" : _newExpandedSize[1] + "px",
				"overflow" : "hidden",
				"position" : "absolute",
				"display" : "none",
				"border" : "1px solid #000"
			});
			$(".exp-full").css({
				"width" : _newCollapsedSize[0] + "px",
				"height" : _newCollapsedSize[1] + "px",
			});
			
			$bg_expanded_exit = $("<div id='bg-exp-exit' class='exit' />");
			$("#expanded-panel").prepend($bg_expanded_exit);
			
			reset_expandable();
			
			$("#bg-exp-exit").css({
				"width" : _expandedSize[0] + "px",
				"height" : _expandedSize[1] + "px"
			});
		} else {
			$("#main-panel").prepend($bg_exit);
			
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
		$("#bg-exit").css({
			"width" : _collapsedSize[0] + "px",
			"height" : _collapsedSize[1] + "px"
		});
	}
	
	function reset_expandable()
	{
		switch (_expandDirection)
		{
			case "up" :
				$("#expanded-panel").css({
					"top" : _expandedSize[1] + "px"
				});
				
				break;
				
			case "down" :
				$("#expanded-panel").css({
					"top" : -_expandedSize[1] + "px"
				});
				
				break;
				
			case "left" :
				$("#expanded-panel").css({
					"left" : _expandedSize[0] + "px"
				});
				
				break;
				
			case "right" :
				$("#expanded-panel").css({
					"left" : -_expandedSize[0] + "px"
				});
				
				break;
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
		ad_div = document.getElementById("main-panel");		
		if (!_isRich)
		{
			addEventListeners();
			init_strd_setup();
		} else {
			if (_expandable)
			{
				_isExpanded = false;
				init_ctas();
			}
			switch (_platform)
			{
				case "DC" :
					/* Offset of left,top and width height, respectively, of the expanded Masthead. */
					Enabler.setExpandingPixelOffsets(0, 0, _expandedSize[0], _expandedSize[1]);
					
					if (_loadPolitely)
					{
						init_polite_load();
					}
					
					break;
					
				case "SK" :
					
					
					break;
			}
			addEventListeners();
		}
	}
	
	function init_strd_setup()
	{
		init_animation();
	}
	
	/*		Rich Specific Setup		*/
	
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
		$btnExpandCTA = document.createElement("div");
		$btnCloseCTA = document.createElement("div");
		
		$btnCloseCTA = $($btnCloseCTA);
		$btnExpandCTA = $($btnExpandCTA);
		
		//Create Elements
		var $btns = Array([$btnCloseCTA,"ctaClose"], [$btnExpandCTA,"ctaExpand"]);
		
		$.each([_collapseImageOrText, _expandImageOrText], function($idx, $str)
		{
			$btns[$idx][0] = $($btns[$idx][0]);
			if ($str.indexOf(".jpg") !== -1 || $str.indexOf(".jpeg") !== -1 || $str.indexOf(".png") !== -1)
			{
				$btns[$idx][0]
					.attr("data-cta-type", "image")
					.attr("id", $btns[$idx][1])
					.attr("class", "cta")
					.append($("<img src=" + $str + ">"));
			} else if ($str !== "") 
			{
				$btns[$idx][0]
					.attr("data-cta-type", "text")
					.attr("id", $btns[$idx][1])
					.attr("class", "cta")
					.text($str);
			} else {				
				$btns[$idx][0]
					.attr("data-cta-type", "text")
					.attr("id", $btns[$idx][1])
					.attr("class", "cta")
					.css({"opacity":"0"})
					.text("Click To Expand");
			}
		});
		
		//	Assign Variables to Their Respective Panels
		$collapsed_panel = $("#collapsed-panel");
		$collapsed_panel.prepend($btnExpandCTA);
	
		$expanded_panel = $("#expanded-panel");
		$expanded_panel.prepend($btnCloseCTA);
		
		console.log($btnCloseCTA);
		
		$btnCloseCTA.css({
			"width" : _collapseBtnSizePos[0] + "px",
			"height" : _collapseBtnSizePos[1] + "px",
			"transform" : "translate(" + _collapseBtnSizePos[2] + "px ," + _collapseBtnSizePos[3] + "px)"
		});
		
		if (get_cta_type($btnCloseCTA))
		{
			$btnCloseCTA.find("img").css({
				"width" : _collapseBtnSizePos[0] + "px",
				"height" : _collapseBtnSizePos[1] + "px"				
			});
		}
		
		if (!_collapseBtnSizePos[4])
		{
			$btnCloseCTA.css({
				"display" : "none",
				"opacity" : "0"


			});
		}
		
		$btnExpandCTA.css({
			"width" : _expandBtnSizePos[0] + "px",
			"height" : _expandBtnSizePos[1] + "px",
			"transform" : "translate(" + _expandBtnSizePos[2] + "px ," + _expandBtnSizePos[3] + "px)"
		});
		
		if (get_cta_type($btnExpandCTA))
		{
			$btnExpandCTA.find("img").css({
				"width" : _expandBtnSizePos[0] + "px",
				"height" : _expandBtnSizePos[1] + "px"			
			});
		}
		
		if (!_expandBtnSizePos[4])
		{
			$btnCloseCTA.css({
				"display" : "none",
				"opacity" : "0"
			});
		}
		
		switch (_platform)
		{
			case "DC" :
				
				
				break;
				
			case "SK" :
				ad_div = $("#main-panel");	
				sdk_data = EB.getSDKData();
				
				init_sk_close_button();
				
				break;
		}
	}
	
	function init_sk_close_button()
	{
		var enableSDKDefaultCloseButton = EB._adConfig && EB._adConfig.hasOwnProperty("mdEnableSDKDefaultCloseButton") ? EB._adConfig.mdEnableSDKDefaultCloseButton : false;
		if (sdk_data !== null)
		{
			if (sdk_data.SDKType === "MRAID" && !enableSDKDefaultCloseButton)
			{
				// set sdk to use custom close button
				EB.setExpandProperties({useCustomClose: true});
			}
		}
	}
	
	function init_polite_load()
	{
		if (Enabler.isPageLoaded()) 
		{
		  page_loaded_handler();
		} else {
		  Enabler.addEventListener(studio.events.StudioEvent.PAGE_LOADED, page_loaded_handler);
		}
	}
	
	function page_loaded_handler()
	{
		if (Enabler.isVisible()) 
		{
		  ad_visibility_handler();
		} else {
		  Enabler.addEventListener(studio.events.StudioEvent.VISIBLE, ad_visibility_handler);
		}
	}
	
	function ad_visibility_handler() 
	{
		if (_collapsedAnimates)
		{
			init_animation();
		} else {
			addEventListeners();
		}
	}
	
	
	/*		Listeners and Events	*/
	
	function background_exit()
	{
		if (!_isRich)
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
		} else {
			switch (_platform)
			{
				case "DC" :
					Enabler.exit("Background Exit");
					if (_expandable && _isExpanded)
					{
						trigger_unit_collapse();
					}
					
					break;
					
				case "SK" :
					
					
					break;
			}
		}
	}
	function addEventListeners()
	{
		$btnExpandCTA = document.getElementById("ctaExpand");
		$btnCloseCTA = document.getElementById("ctaClose");
		
		$bg_exit = document.getElementById("bg-exit");
		$bg_expanded_exit = document.getElementById("bg-exp-exit");
		
		if (_isRich)
		{ 
			if (_expandable)
			{
				$btnExpandCTA.addEventListener("click", trigger_unit_expand, false);
				$btnCloseCTA.addEventListener("click", trigger_unit_collapse, false);
				
				switch (_platform)
				{
					case "DC" :
						Enabler.addEventListener(studio.events.StudioEvent.EXPAND_START, expand_start);
						Enabler.addEventListener(studio.events.StudioEvent.EXPAND_FINISH, expand_finish);
	
						// Collapse Event Listeners    
						Enabler.addEventListener(studio.events.StudioEvent.COLLAPSE_START, collapse_start);
						Enabler.addEventListener(studio.events.StudioEvent.COLLAPSE_FINISH, collapse_finish);
						
						break;
						
					case "SK" :
						$btnExpandCTA.addEventListener("click", trigger_unit_expand);
						
						break;
				}
				$bg_exit.addEventListener("click", background_exit, false);
				$bg_expanded_exit.addEventListener("click", background_exit, false);
			}
		} else {
			document.getElementById("main-panel").addEventListener("click", function()
			{
				background_exit();
			});	
		}
	}
	
	function trigger_unit_expand()
	{
		switch (_platform)
		{
			case "DC" :
				Enabler.requestExpand();
				
				break;
				
			case "SK" :
				EB.expand({panelName: $expanded_panel});
				
				break;
		}
	}
	
	function trigger_unit_collapse()
	{
		switch (_platform)
		{
			case "DC" :
				Enabler.reportManualClose();
				Enabler.requestCollapse();
				
				break;
				
			case "SK" :
				EB.collapse();
				
				break;
		}
	}
	
	/*		Doubleclick Specific Events Fired by Expansion	*/
	
	function expand_start() 
	{	
		$collapsed_panel.css({
			"display" : "none"
		});
		$expanded_panel.css({
			"display" : "block"
		});	
		
		$expanded_panel.animate({
			top: 0,
			left: 0,
		}, 500, function() 
		{
			Enabler.finishExpand();
		});
	} 
	
	function expand_finish() 
	{ 
		_isExpanded = true;
		init_expanded_animation();
	}
	
	function collapse_start() 
	{		
		Enabler.finishCollapse();
		
		// Create your animation to collapse here.
		$collapsed_panel.css({
			"display" : "block"
		});
		$expanded_panel.css({
			"display" : "none"
		});
		
		reset_expandable();
	}
	
	function collapse_finish()
	{
		_isExpanded = false;
	}
})(jQuery);