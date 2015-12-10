$.dispatchPlatform = {
    id: 'Platform Dispatch',
    version: '1.0',
    defaults: {
		$platform:"SK" //	Options are for now "DC" -> DoubleClick & "SK" -> Sizmek
	}
};

(function ($) 
{
	"use strict";
	
	var _platform;
	var adDiv;
	
    $.fn.extend({
        dispatchPlatform: function (params) 
		{
            return this.each(function () 
			{
                var opts = $.extend({}, this.defaults, params);
			
				_platform = opts.$platform;
				
				var $script;			
				
				switch (_platform)
				{
					case "DC" :    					
						$(".skjs").remove();
						
						break;
						
					case "SK" :
						$(".dcjs").remove();
						
						break;
				}
				console.log(_platform);
				window.addEventListener("load", init_platform);
			});
        }
    });
	
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
		adDiv = document.getElementById("ad");
		
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
		document.getElementById("holder").addEventListener("click", function()
		{
			clickThrough();
		});
	}
})(jQuery);