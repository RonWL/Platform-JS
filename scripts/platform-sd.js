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

$.dispatchStandard = {
    id: 'Platform Dispatch - Standard',
    version: '1.10',
    defaults: {
		$platform:"DC", 						//	Options are at the moment "DC" -> DoubleClick , "SK" -> Sizmek , "" -> None
		$size:	[300, 250]						//	Size ([Width, Height]) of the collapsed state of the unit *If Not Rich, this is consists of the dimensions of the unit*
	}
};

(function ($) 
{
	"use strict";
	
	var _platform;	
	var _size;
	var _newSize;
	
	var $bg_exit;
	
	var ad_div;
	
    $.fn.extend({
        dispatchStandard: function (params) 
		{
            return this.each(function () 
			{
                var opts = $.extend({}, this.defaults, params);
				
				$(document).ready(function(evt)
				{
					_platform = opts.$platform;
					_size = opts.$size;
					_newSize = [_size[0] - 2, _size[1] - 2];
											
					switch (_platform)
					{
						case "DC" :    					
							$(".skjs").remove();
							
							break;
							
						case "SK" :
							$(".dcjs").remove();
							
							break;
							
						case "" :
							$(".skjs .dcjs").remove();
					}				
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
			"padding" : "0",
			"width" : _size[0] + "px",
			"height" : _size[1] + "px"
		});
				
		
		$("#main-panel").prepend($bg_exit);
			
		$("#main-panel").css({
			"width" : _newSize[0] + "px",
			"height" : _newSize[1] + "px",
			"border" : "1px solid #000"
		});		
		
		$("#bg-exit").css({
			"width" : _size[0] + "px",
			"height" : _size[1] + "px"
		});
	}
	
	function init_platform()
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
				
			case "" :
				init_handle();
				break;
		}
	}
	
	function init_handle()
	{
		ad_div = document.getElementById("main-panel");		
		
		addEventListeners();
		init_strd_setup();
	}
	
	function init_strd_setup()
	{
		init_animation();
	}
	
	/*		Listeners and Events	*/
	
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
				
			case "" :
				window.open(window.clickTag);
				
				break;
		}
	}
	function addEventListeners()
	{
		document.getElementById("main-panel").addEventListener("click", function()
		{
			background_exit();
		});	
	}
	
	function append_script($source, $target, $custom)
	{
		var $tag = document.createElement("script");
		$tag.type = "text/javascript";
		if ($source !== null)
		{
			$tag.src = $source;
		}
		if ($custom !== "" &&  typeof($custom) !== undefined)
		{
			$($tag).append($custom);
		}
		
		(document.getElementsByTagName($target)[0] || document.documentElement).appendChild($tag);
	}
})(jQuery);