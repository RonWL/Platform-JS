$.dispatchPlatform = {
    id: 'Platform Dispatch',
    version: '1.0',
    defaults: {
		$platform:"SK", 			//	Options are for now "DC" -> DoubleClick & "SK" -> Sizmek
		$dimensions: [300, 250]		//	Dimensions of the Unit [Width, Height]
	}
};

(function ($) 
{
	"use strict";
	
	var _platform;
	var _dimensions;
	
	var _newWidth;
	var _newHeight;
	
	var _script = document.createElement("script");
	var _head = document.getElementsByTagName("head")[0];
	
	var adDiv;
	
    $.fn.extend({
        dispatchPlatform: function (params) 
		{
            return this.each(function () 
			{
                var opts = $.extend({}, this.defaults, params);
			
				_platform = opts.$platform;
				_dimensions = opts.$dimensions;	
				
				$("head").prepend("<meta name='unit-size' content='width='" + _dimensions[0] + ", height='" + _dimensions[1] + "'>");	

				_script.type = "text/javascript";
				_script.class = "skjs";
				
				switch (_platform)
				{
					case "DC" :    					
						$(".skjs").remove();
						
						break;
						
					case "SK" :
						$(".dcjs").remove();
						_script.src = "https://secure-ds.serving-sys.com/BurstingScript/EBLoader.js";
						
						break;
				}
				//console.log(_platform);
				
				style_elements();
				window.addEventListener("load", init_platform);
			});
        }
    });
	
	function style_elements()
	{
		$("body").css({
			"width" : _dimensions[0] + "px",
			"height" : _dimensions[1] + "px"
		});
		
		_newWidth = _dimensions[0] - 2;
		_newHeight = _dimensions[1] - 2;
		
		$("#main-panel").css({
			"width" : _newWidth + "px",
			"height" : _newHeight + "px",
			"border" : "1px solid #000"
		});
	}
	
	function init_platform()
	{		
		switch (_platform)
		{
			case "DC" :
				if (Enabler.isInitialized()) 
				{
					startAd();
				} else {
					Enabler.addEventListener(studio.events.StudioEvent.INIT, startAd);
				}
				break;
				
			case "SK" :
				if (!EB.isInitialized()) 
				{
					EB.addEventListener(EBG.EventName.EB_INITIALIZED, startAd);
				} else {
					startAd();
				}
				break;
		}
	}
	
	function startAd()
	{
		adDiv = document.getElementById("main-panel");
		
		addEventListeners();
		init_animation();
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