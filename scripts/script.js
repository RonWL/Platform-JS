/*	version: "v3.2"	*/

$.noConflict();
var $ = jQuery;


/************************************ Custom JS *****************************************/

function init_animation()
{
	"use strict";
	
	
}


//	This Function is called to show the Replay Button (if applicable).
//	Make sure to include this after the final animations:
$(document).dispatch.show_replay();

//	This function houses all resets and the restart for the unit if Replay is used:
function reset_unit()
{
	console.log("Resetting Unit...");
	TweenMax.delayedCall(1, init_animation);
}

/*********************************************************************************************/
