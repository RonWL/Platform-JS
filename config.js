/*
 Manifest Setup for Sizmek Standard Banner Ad -->
*/

define({
	"adFormatId": "42",
	"format": "standardBanner",
	"name": "", /* Name of the creative - usually the Folder housing all assets of the unit - Keep away from spaces as this will throw errors */
	"defaultBanner": "Main_Banner", /* The default asset shown - usually the Folder housing all assets of the unit - Keep away from spaces as this will throw errors */
	"banners": [{
		"name": "Main_Banner", /* Name of the unit - usually the Folder housing all assets of the unit - Keep away from spaces as this will throw errors */
		"width": 320,
		"height": 250,
		"defaultImage": "images/320x250_DFLT.jpg"
	}],
	"clickThrough": {
		"url": "https://www.google.com/",
		"target": "newWindow",
		"showMenuBar": true,
		"showAddressBar": true
	}
});

/***********************************************************************************************************************************************************************/
/* More Documantation on the Sizmek API located here: https://support.sizmek.com/hc/en-us/articles/360055240931-Manifest-Ad-Data#ManifestDataParameters */
/***********************************************************************************************************************************************************************/
