/*
 Manifest Setup for Dynamic "Instant" Ads -->
*/

FT.manifest({
	"filename":"index.html",
	"width":{/*width*/},
	"height":{/*height*/},
	
	//	The clickTagCount includes the default clicktag unlike Platform.JS, which just needs any custom elements that have additional clickthrus
	"clickTagCount":1,
	
	//	ONLY needed if the unit is to be set up as a dynamic (Instant) Ad Unit
	"instantAds":[
		/* Each JSON entry must have the following format for each of the dynamic values
		{
			"name" : "Name of Value (Same Name listed in Platform.JS option - $dynVars", 
			"type" : "{text or image}", 
			"default" : "The Default value that will be present if none fed to by FT. {path/to/local/image.jpg}"
		},*/
	]
});



/*
 Manifest Setup for FlashTalking Expandable Ads -->
*/

FT.manifest({
    "filename":"index.html",
	
	//  Collapsed Panel Width
    "width":1280,
	
	//  Collapsed Panel Height
    "height":100,
	
	//	The clickTagCount includes the default clicktag unlike Platform.JS, which just needs any custom elements that have additional clickthrus
    "clickTagCount":2,
    "hideBrowsers": ["ie8"],
    "expand":{
        "fullscreen":false,
		
		//  Expanded Panel Width
        "width":1280,
		
		//  Expanded Panel Height
        "height":418,
        "indentAcross":0,
        "indentDown":0
    }
});



/*
 Manifest Setup for FlashTalking Rich Media Ads with Video (Youtube Loaded) -->
*/

FT.manifest({
    "filename":"index.html",
    "width":1280,
    "height":100,
    "clickTagCount":2,
    "hideBrowsers": ["ie8"],
    "expand":{
        "fullscreen":false,
        "width":1280,
        "height":418,
        "indentAcross":0,
        "indentDown":0
    },
	//  The video name (developer given) and the url of video hosted on Youtube
	"videos":[
        {"name":"yt_video", "ref":"https://www.youtube.com/watch?v=CxKhCp4lKWA"}
    ]
});