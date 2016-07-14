FT.manifest({
	"filename":"index.html",
	"width":{width},
	"height":{height},
	
	//	The clickTagCount includes the default clicktag unlike Platform.JS, which just needs any custom elements that have additional clickthrus
	"clickTagCount":1,
	
	//	ONLY needed if the unit is to be set up as a dynamic (Instant) Ad Unit
	"instantAds":[
		/* Each JSON entry must have the following format for each of the dynamic values
		{
			"name" : "Name of Value (Same Name listed in Platform.JS option - $dynVars", 
			"type" : "{text or image}", 
			"default" : "The Default value that will be present if none fed to by FT."
		},*/
	]
});