/*
"Platform-JS"
This plugin was created in order to streamline the process of building standard compliant digital ads, while giving developers involved the ability to customize the units.
Github link for more Info: https://github.com/DDB-Chicago/Platform-JS/releases
	
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

(function ($) {
	"use strict";

	var _platform;
	var _dcs;

	var _loadGS;
	var _size;
	var _newSize;

	var _borderColor;
	var _font;

	var _replay;
	var $replayHold;
	var $replayContainer;
	var $replayElm;
	var $replayShadow;
	var _replayVars;

	//FlashTalking Variable
	var _$FT;
	var $panel;

	var _data_type;
	var _unit_type;

	//RM Assets
	var $collapsed;
	var $expanded;
	var $expBtn;
	var $exp_mask_direction;
	var $colBtn;
	var $col_timer;
	var _expands;
	var _expSize;
	var _newExpSize;

	var _col_btn_con;
	var _exp_btn_con;

	var _is_expanded;

	var _expandedHasClickTag;
	var _altButtonClickTag;

	var $altClickElm;

	var _isAutoExpand;
	var _video;
	var $vid_delay;
	var $vid_holder;
	var $rm_video;

	var youtubeAPIReady = false;
	var yt_interval;

	var _autoplay;


	var _dyn_elms;
	var _dyn_vars;

	var _clicktags;
	var _ct_elms;
	var $dyn_click;
	var _def_clickTag;

	var _testing;


	$.fn.extend ({
		id: 'Platform JS',
		version: 'v10.1',
		dispatch : function(params) {
			var defaults = {
				//	Options are at the moment "DC" -> DoubleClick , "SK" -> Sizmek , "FT" -> FlashTalking , "" -> None		
				$platform: "DC",

				//	If Platform is Doubleclick, Options are at the moment true -> Unit IS Going through DC Studio, false -> Unit Not DC Studio Unit	
				$isDCS: false,

				//	Option to Load External Animation Library or Not (Greensock {0 - None, 1 - Yes.  If None Chosen, will default to not loading the Tweening Engine.
				//	The loaded URI is the CDN endpoint to the latest version of GS. -- Keep In mind, There is no longer a need to reference TweenLite or TweenMax.  They are all bundled in one "gsap" object.
				$loadGS: 1,

				//	Select If the Unit is Dynamic or Static (Now ONLY Supports FlashTalking)
				$dataType: "Static",

				//	Select If the Unit Standard Display or Rich Media Unit ({ST - Standard, RM - Rich Media}) (Now ONLY Supports FlashTalking)
				$unitType: "ST",

				//	Size ([Width, Height]) of the collapsed state of the unit *If Not Rich, this is consists of the dimensions of the unit*
				$size: [300, 250],

				//	The border color of the unit (If None Given in Options, will Default to Black
				$borderColor: "#000",

				//	The font included within the Unit (Especially Needed if Dynamic(Instant) Unit
				$font: "'Arial', sans-serif",

				//	Does the Unit have "Replay" Functionality
				$replay: false,

				//	If the Unit Has a replay Button, Vars for Button (Array of [{hexcolor}, {size}, {position: "topLeft", "topRight", "bottomLeft", or "bottomRight"}])
				$replayVars: ["#000", 20, "topRight"],

				//	Sets a Logger for When Testing Edits / Updates to Plugin And / Or Unit Code	
				$testing: false,

				//	If the Unit Will be Dynamic, This array will hold the elements to be Registered with the variables in the Manifest.js file (Flash Talking)
				$dynElms: [],

				//	This Array holds the Variable(s) from which the elements in "$dynElms" will be populated with
				$dynVars: [],

				//	How Many Clicktags will be used within the Unit (Other than the Default Click Thru).  If None, are provided, will default to 0.
				$altTags: 0,

				//	The Elements that will Possess a Click Tag.  Only Needed if the "$altTags" Option is Greater than 0.
				$ctElms: [],

				//	This is put in place in the event the developer wants to assign a target for the clicktag.
				$defClickTag: "",

				//	Select If the Unit is an Expandable or Not)
				$expands: false,

				//	Collapse Button Content can be image or text
				$collapseBtnContent: "Click to Collapse",

				//	Expanded Size ([Width, Height]) of the EXPANDED state of the unit
				$expSize: [300, 250],

				//	Collapse Button Content can be image or text
				$expandBtnContent: "Click to Expand",

				//	Toggle Whether or not the Expanded panel has a clicktag
				$expandedHasClickTag: false,

				//	Alternate Element to Assign the Expanded Clicktag to
				$altButtonClickTag: "",

				//	Determine Whether or not the RMU is AutoExpand
				$isAutoExpand: false,

				//	If the Unit is Rich, Does it have video - Array [true/false, container, video name (listed in manifest.js), still image, width, height, autoplay, controls, muted, Closed Captioning, Youtube ID(Only for DC)]
				//	  Ex: $video: [true, "#vid_holder", "yt_video", "still_frame.jpg", 408, 202, [false,1000], false, true, false, Youtube ID]
				$video: [false]
			};
			var opts = $.extend({}, defaults, params);
			
			return this.each(function () {
				_platform = opts.$platform;
				_dcs = opts.$isDCS;
				_loadGS = opts.$loadGS;
				_size = opts.$size;
				_newSize = [_size[0] - 2, _size[1] - 2];

				_font = opts.$font;
				_borderColor = opts.$borderColor;

				//	FlashTalking Options Declared in Root of Plugin
				_data_type = opts.$dataType;
				_unit_type = opts.$unitType;

				if (_unit_type === "RM") {
					_expands = opts.$expands;
					if (_expands) {
						_is_expanded = false;
						_expSize = opts.$expSize;
						_newExpSize = [_expSize[0] - 2, _expSize[1] - 2];

						_col_btn_con = opts.$collapseBtnContent;
						_exp_btn_con = opts.$expandBtnContent;

						_isAutoExpand = opts.$isAutoExpand;
					}

					switch (_platform) {
						case "FT":
						case "DC":
							if (_expands) {
								_expandedHasClickTag = opts.$expandedHasClickTag;
								_altButtonClickTag = opts.$altButtonClickTag;
							}
							_video = opts.$video;
							break;
					}
				}

				_dyn_elms = opts.$dynElms;
				_dyn_vars = opts.$dynVars;

				_clicktags = opts.$clickTags;
				_ct_elms = opts.$altTags;
				_def_clickTag = opts.$defClickTag;

				_replay = opts.$replay;
				_replayVars = opts.$replayVars;

				_testing = opts.$testing;

				//	Modify the Head or Body with the external script needed to create the platform-ready unit	
				$(".extHC").empty();
				
				$(document).ready(function () {
					$("meta[name=unit-size]").attr("content", "width=" + _size[0] + ",height=" + _size[1]);

					var $click;
					switch (_platform) {
						//	Since DC & Sizmek's platform REQUIRES the external script tag within the main HTML file, here we apply the clicktag hardcode
						case "DC":
							get_animation_assets();
							break;

						case "FT":
							var $ftsrc = "https://cdn.flashtalking.com/frameworks/js/api/2/10/html5API.js";
							mod_js("Load", $ftsrc, "body", "ftjs", get_animation_assets, "FtdynJS");

							break;

						case "CV":
							get_animation_assets();

							break;
							
						case "SK":
							var $sksrc = "https://secure-ds.serving-sys.com/BurstingScript/adKit/adkit.js";
							mod_js("Load", $sksrc, "body", "ftjs", get_animation_assets, "SkdynJS");

							break;

						case "":
							$click = "var clicktag = \"\";";
							mod_js("Add", $click, "head", "dcjs");
							get_animation_assets();

							break;
					}
				});
			});
		}
	});
	
	// If GA is enabled, this pulls in the necessary tweening engine.
	function get_animation_assets() {
		if (_loadGS) {
			var $gs_url = "https://cdnjs.cloudflare.com/ajax/libs/gsap/3.6.1/gsap.min.js";
			mod_js("Load", $gs_url, "head", "anjs", init_platform, "GsJS");

		} else {
			init_platform();
		}
	}

	
	// The below handles all position, animation and functionality of the replay button if enabled.
	
	function get_replay_position($var) {
		var $xCoord = 0;
		var $yCoord = 0;

		switch ($var) {
			case "topLeft":
				$replayHold.css({
					"top": $yCoord + "px",
					"left": $xCoord + "px"
				});
				break;

			case "topRight":
				$replayHold.css({
					"top": +$yCoord + "px",
					"right": $xCoord + "px"
				});
				break;

			case "bottomLeft":
				$replayHold.css({
					"bottom": $yCoord + "px",
					"left": $xCoord + "px"
				});
				break;

			case "bottomRight":
				$replayHold.css({
					"bottom": $yCoord + "px",
					"right": $xCoord + "px"
				});
				break;
		}
	}

	function init_replay_btn() {
		var $svgCode = $("<svg id='replaySVG' data-name='replaySVG' xmlns='http://www.w3.org/2000/svg' x='0' y='0' width='100%' height='100%' viewBox='0 0 320 320'><title>replayBtn</title><path d='M159,269.95C98,268.89,49.29,218.7,50.36,158.08S101.92,49,162.92,50.05A110.15,110.15,0,0,1,231.6,75.56l-49.53,41L320,145.46,316.14,5.54,270.78,43.06a160.84,160.84,0,0,0-107-43C74.91-1.52,1.58,68.86,0,157.2S69.27,318.43,158.16,320A161,161,0,0,0,311.48,216.91l-51.32-8.45A110.76,110.76,0,0,1,159,269.95Z' class='replayGraphic' /></svg>");

		$replayHold = $("<div id='replayHolder' class='free'></div>");
		$replayContainer = $("<div id='replay'></div>");
		$replayElm = $("<div id='replayBtn' class='free'></div>");
		$replayElm = $($replayElm);
		$replayContainer = $($replayContainer);
		$replayHold = $($replayHold);
		$replayElm.append($svgCode);
		$replayContainer.append($replayElm);
		$replayHold.append($replayContainer);

		get_replay_position(_replayVars[2]);

		if (_replayVars[1] >= 20) {
			$replayHold.css({
				"width": _replayVars[1] + 10 + "px",
				"height": _replayVars[1] + 10 + "px"
			});
			$replayElm.css({
				"width": _replayVars[1] + "px",
				"height": _replayVars[1] + "px",
				"padding": "5px"
			});
		} else {
			$replayHold.css({
				"width": _replayVars[1] + 10 + "px",
				"height": "25px"
			});
			$replayElm.css({
				"width": _replayVars[1] + "px",
				"height": "25px",
				"padding": "0 5px"
			});
		}
		$replayHold.css({
			"z-index": "10"
		});
		$replayContainer.css({
			"position": "relative"
		});


		$replayElm.css({
			"-webkit-transform-origin": "50% 50%",
			"-moz-transform-origin": "50% 50%",
			"-o-transform-origin": "50% 50%",
			"transform-origin": "50% 50%",

			"transition ": "all 0.3s ease-in-out 0s"
		});

		if (_replayVars[3]) {
			var $shadowCode = $("<svg id='replayShadow' data-name='replayShadow' xmlns='http://www.w3.org/2000/svg' x='0' y='0' width='100%' height='100%' viewBox='0 0 320 320'><title>replayShadow</title><path d='M159,269.95C98,268.89,49.29,218.7,50.36,158.08S101.92,49,162.92,50.05A110.15,110.15,0,0,1,231.6,75.56l-49.53,41L320,145.46,316.14,5.54,270.78,43.06a160.84,160.84,0,0,0-107-43C74.91-1.52,1.58,68.86,0,157.2S69.27,318.43,158.16,320A161,161,0,0,0,311.48,216.91l-51.32-8.45A110.76,110.76,0,0,1,159,269.95Z' class='shadowGraphic' /></svg>");

			$replayShadow = $("<div id='replayShadow' class='free'></div>");
			$replayShadow = $($replayShadow);
			$replayShadow.append($shadowCode);

			if (_replayVars[1] >= 20) {
				$replayShadow.css({
					"width": _replayVars[1] + "px",
					"height": _replayVars[1] + "px",
					"padding": "5px"
				});
			} else {
				$replayShadow.css({
					"width": _replayVars[1] + "px",
					"height": "25px",
					"padding": "0 5px"
				});
			}
			$replayShadow.css({
				"z-index": "-1",
				"opacity": "0.5",
				"-webkit-transform-origin": "50% 50%",
				"-moz-transform-origin": "50% 50%",
				"-o-transform-origin": "50% 50%",
				"transform-origin": "50% 50%",

				"transition ": "all 0.3s ease-in-out 0s"
			});
			$("#replayShadow .shadowGraphic").css({
				"fill": "#000",
			});

			switch (_replayVars[2]) {
				case "topLeft":
					$replayShadow.css({
						"left": "1px",
						"top": "1px",
					});
					break;

				case "topRight":
					$replayShadow.css({
						"left": "-1px",
						"top": "1px",
					});
					break;

				case "bottomLeft":
					$replayShadow.css({
						"left": "1px",
						"top": "-1px",
					});
					break;

				case "bottomRight":
					$replayShadow.css({
						"left": "-1px",
						"top": "-1px",
					});
					break;
			}
		}
		$replayContainer.append($replayShadow);
		$("#unit-container").prepend($replayHold);
		$replayContainer.hide();

		$("#replayBtn .replayGraphic").css({
			"fill": _replayVars[0]
		});
	}

	$.fn.dispatch.show_replay = function () {
		doLog("Showing Replay");
		$replayContainer = $("#replay");

		$replayContainer.fadeIn(800, function () {
			$(this).on("click", function () {
				$(this).off("click");
				$(this).hide();
				unit_reset();
			});
			var timer,
				$replayElm = $("#replayBtn"),
				$replayShadow = $("#replayShadow");

			$(this).hover(function () {
					var angle = 0;

					timer = setInterval(function () {
						angle += 25;
						$replayElm.css({
							"transform": "rotate(" + angle + "deg)"
						});
						$replayShadow.css({
							"transform": "rotate(" + angle + "deg)"
						});
					}, 50);
				},
				function () {
					timer && clearInterval(timer);
					$replayElm.css({
						"transform": "rotate(0deg)"
					});
					$replayShadow.css({
						"transform": "rotate(0deg)"
					});
				});
		});
	};

	function unit_reset() {
		doLog("Resetting Unit...");
		reset_unit();
		setTimeout(function () {
			init_animation();
		}, 1000);
	}

	
	// The styling of the elements regardless of the platform being trafficked through
	
	function style_elements() {
		if (_unit_type === "ST") {
			$("#unit-container").css({
				"width": _newSize[0] + "px",
				"height": _newSize[1] + "px",
				"font-family": _font,
				"border": "1px solid " + _borderColor
			});

			$("#main-panel").css({
				"width": _newSize[0] + "px",
				"height": _newSize[1] + "px"
			});

			if (_replay) {
				doLog("Initing Replay");
				init_replay_btn();
			}
			
			// Handling of Aria Tag
			
			var aria_elm;
			
			if ($aria_label && $aria_label !== '') {
				aria_elm = $('#main-panel');
				aria_elm.attr('aria-label', $aria_label);
			}
			
		} else {
			if (_expands) {
				$("#collapsed-panel").css({
					"z-index": "20",
					"position": "absolute",
					"width": _newSize[0] + "px",
					"height": _newSize[1] + "px",
					"font-family": _font,
					"overflow": "hidden",
					"border": "1px solid " + _borderColor,
					"cursor": "pointer"
				});
				if (_expandedHasClickTag) {
					$("#expanded-panel").css({
						"z-index": "1",
						"position": "absolute",
						"width": _expSize[0] + "px",
						"height": _expSize[1] + "px",
						"display": "none",
						"font-family": _font,
						"background-color": "#fff",
						"cursor": "pointer"
					});
				} else {
					$("#expanded-panel").css({
						"z-index": "1",
						"position": "absolute",
						"width": _expSize[0] + "px",
						"height": _expSize[1] + "px",
						"display": "none",
						"font-family": _font,
						"background-color": "#fff",
						"cursor": "pointer"
					});
				}

				var $exp_border = $("<div id='exp-border' />");
				$("#expanded-panel").prepend($exp_border);

				$exp_border.css({
					"z-index": "19",
					"width": _newExpSize[0] + "px",
					"height": _newExpSize[1] + "px",
					"position": "absolute",
					"border": "1px solid " + _borderColor,
					"pointer-events": "none"
				});

				if (_platform === "DC") {
					$("#main-panel, .full-exp").css({
						"width": _expSize[0] + "px",
						"height": _expSize[1] + "px"
					});
				} else {
					$(".full-exp").css({
						"width": _expSize[0] + "px",
						"height": _expSize[1] + "px"
					});
				}

				if (_exp_btn_con.indexOf(".png") !== -1) {
					$("#collapsed-panel").before("<div id='expand-button' class='free rm-btn'><img src='" + _exp_btn_con + "' alt='Collapse Content' /></div>");
				} else {
					$("#collapsed-panel").before("<div id='expand-button' class='free rm-btn'>" + _exp_btn_con + "</div>");
				}
				if (_col_btn_con.indexOf(".png") !== -1) {
					$("#expanded-panel").before("<div id='exp_mask'></div><div id='collapse-button' class='free rm-btn'><img src='" + _col_btn_con + "' alt='Expand Content' /></div>");
				} else {
					$("#expanded-panel").before("<div id='exp_mask'></div><div id='collapse-button' class='free rm-btn'>" + _col_btn_con + "</div>");
				}

				$("#collapse-button").css({
					"display": "none",
					"z-index": "19"
				});
				$("#expand-button").css({
					"z-index": "39"
				});

				$("#exp_mask").css({
					"z-index": "10",
					"position": "absolute",
					"display": "none"
				});
				if (_expSize[1] === _size[1]) {
					$("#exp_mask").css({
						"left": -1 - (_expSize[0] * 2) + "px",
						"top": "1px",
						"width": _expSize[0] * 3 + "px",
						"height": _expSize[1] + "px"
					}).addClass("gradient-leftRight");
					$exp_mask_direction = "leftRight";
				} else {
					$("#exp_mask").css({
						"left": "1px",
						"top": -1 - (_expSize[1] * 2) + "px",
						"width": _expSize[0] + "px",
						"height": _expSize[1] * 3 + "px"
					}).addClass("gradient-topDown");
					$exp_mask_direction = "topDown";
				}
			} else {
				$("#unit-container").css({
					"width": _newSize[0] + "px",
					"height": _newSize[1] + "px",
					"font-family": _font,
					"border": "1px solid " + _borderColor
				});

				$("#main-panel").css({
					"width": _newSize[0] + "px",
					"height": _newSize[1] + "px"
				});
			}
		}
		$(".full-col").css({
			"width": _newSize[0] + "px",
			"height": _newSize[1] + "px"
		});

		$("body").css({
			"width": _size[0] + "px",
			"height": _size[1] + "px"
		});

		$.each($("img"), function () {
			$(this).prop("draggable", false)
				.css("-moz-user-select", "none");
		});
		$("body").show();
	}

	
	// The main trigger that handles platform specific setup
	
	var init_platform = function () {
		doLog("Initializing Platform...");
		style_elements();


		//	Per each platform, we have to wait for their external scripts to load before continuing the unit's process
		if (_platform === "DC") {
			init_handle();
		} else if (_platform === "SK") {
			adkit.onReady(init_handle);
		} else {
			init_handle();
		}
	};

	
	// Here we set up the elements that are included in the Unit to be read
	
	function init_handle() {
		if (_platform === "FT") {
			_$FT = new FT;
			//	This is the function that runs to prepare the tags for dynamic input 
			//({ID of Tag (without the "#")}, {FT tag replacement}, {Any Extra Attributes for the Method to Add})

			if (_unit_type === "RM") {
				setup_FT_RM();
			} else if (_data_type === "Dynamic") {
				$dyn_click = _$FT.instantAds.clickTag;
				$.each(_dyn_elms, function ($idx) {
					var $name = "name";
					var $val = _dyn_vars[$idx];
					doLog("New Attributes " + $idx + " : " + $name + " = " + $val);

					var $newAttrs = [];
					$newAttrs.push([$name, $val]);

					getSetAttr(_dyn_elms[$idx], "ft-dynamic", $newAttrs);
					$newAttrs.length = 0;
				});
				_$FT.on("instantads", function () {
					setTimeout(function () {
						addEventListeners();
						init_strd_setup();
					}, 1000);
				});
			} else {
				addEventListeners();
				init_strd_setup();
			}
		} else if (_platform === "DC") {
			if (_unit_type === "RM") {
				setup_DC_RM();

			} else {
				addEventListeners();
				init_strd_setup();
			}
		} else {
			addEventListeners();
			init_strd_setup();
		}
	}


	// DoubleClick Rich Media Setup

	function setup_DC_RM() {
		doLog("Initializing DoubleClick Rich Media Setup...");

		doLog("Does this unit Expand: " + _expands);
		if (_expands) {
			$collapsed = $("#collapsed-panel");
			$expanded = $("#expanded-panel");
			$expBtn = $("#expand-button");
			$colBtn = $("#collapse-button");
			if (_altButtonClickTag !== "") {
				$altClickElm = $("#" + _altButtonClickTag);
			}
		}
	}

	
	// This is the Polite Loader in case there is a video loading from Youtube for RM Units
	
	function polite_init() {
		if (_video[0]) {
			var $yt_url = "https://www.youtube.com/iframe_api";
			mod_js("Load", $yt_url, "head", "ytjs", null, "ytJS");

			if (!youtubeAPIReady) {
				yt_interval = setInterval(function onYouTubeIframeAPIReady() {
					if (window.YT) {
						clearInterval(yt_interval);
						youtubeAPIReady = true;
						doLog(youtubeAPIReady);
						init_video();
					}
				}, 500);
			} else {
				clearInterval(yt_interval);
			}
		} else {
			addEventListeners();
		}
	}


	// FlashTalking Rich Media Setup

	function setup_FT_RM() {
		doLog("Initializing FlashTalking Rich Media Setup...");
		doLog("Does this unit Expand: " + _expands);

		if (_expands) {
			$collapsed = _$FT.$("#collapsed-panel");
			$expanded = _$FT.$("#expanded-panel");
			$expBtn = _$FT.$("#expand-button");
			$colBtn = _$FT.$("#collapse-button");
			if (_altButtonClickTag !== "") {
				$altClickElm = _$FT.$("#" + _altButtonClickTag);
			}
		}
		if (_video[0]) {
			doLog("Initializing FlashTalking Rich Media Video Setup");
			init_video();
		} else {
			addEventListeners();
		}
	}


	// Initialize Video Setup

	function init_video() {
		switch (_platform) {
			case "FT":
				$vid_holder = _$FT.$("#" + _video[1]);
				doLog("Video Container: " + _video[1]);
				$vid_holder.append($("<img id='stillFrame' src='" + _video[3] + "' alt='still frame' />"));

				$vid_holder.on("click", function (evt) {
					trigger_video("start");
				});

				if (_video[6][0] === true) {
					_autoplay = true;

					if (_video[6][1] == "undefined" || _video[6][1] === null) {
						$vid_delay = 1000;
					} else {
						$vid_delay = _video[6][1] * 1000;
					}
				}
				addEventListeners();

				break;

			case "DC":
				$vid_holder = $("#" + _video[1]);
				doLog("Video Container: " + _video[1]);
				$vid_holder.append($("<img id='stillFrame' src='" + _video[3] + "' alt='still frame' />"));
				addEventListeners();
				break;
		}
	}

	
	/*		Listeners and Events	*/

	//	Controls the "exits" of each platform
	function background_exit() {
		switch (_platform) {
			case "DC":
				doLog("DC Triggered Exit");
				window.open(window.clickTag);
				
                break;

			case "SK":
				adkit.clickthrough();

				break;

				//	The "exit" for FlashTalking is handled through the platform dynamically, so does not require any assignment here.	
			case "FT":
				if (_is_expanded) {
					$($colBtn).trigger("click");
				}
				break;

			case "CV":
				window.open("<mpvc/>http://<mpck/>");
				break;

			case "":
				window.open(window.clicktag);
				break;
		}
	}
	
	
	function addEventListeners() {
		//	If any additional clicktag elements have been added within the options, Flashtalking API applies the coding to them.
		//	Otherwise, the main panel (ususally the standard) will trigger the "background exit"

		if (_platform === "FT") {
			if (_unit_type === "RM" && _expands === true) {
				_$FT.applyClickTag($collapsed, 1);

				if (_expandedHasClickTag) {

					if (_altButtonClickTag !== "") {
						_$FT.applyClickTag($altClickElm, 2);
					} else {
						_$FT.applyClickTag($expanded, 2);
					}
				}

				$expBtn.on("click", function () {
					expand_init();
					_$FT.expand();
				});

				$colBtn.on("click", function () {
					collapse_init();

					_$FT.contract();
					on_collapse();
				});

				var collapse = function (e) {
					if (e && e.type) {
						_$FT.contract();
					}
				};
				_$FT.on("contract", on_collapse);


				if ($altClickElm) {
					$altClickElm.on("click", background_exit);
				} else {
					$expanded.on("click", background_exit);
				}

				if (_isAutoExpand) {
					doLog("Should be AutoExpanding Now...");
					setup_autoExpand();
				} else {
					init_animation();
				}
			} else {
				if (_video[0]) {
					_isAutoExpand = false;
					trigger_video("expand");
				}
				$panel = _$FT.query("#main-panel");

				if ($dyn_click !== null && $dyn_click !== "undefined" && $dyn_click !== "") {
					_$FT.applyClickTag($panel, 1, $dyn_click);
				} else if (_def_clickTag !== "") {
					_$FT.applyClickTag($panel, 1, _def_clickTag);
				} else {
					_$FT.applyClickTag($panel, 1);
				}

				if (_clicktags) {
					for (var c = 0; c <= _clicktags.length; c++) {
						_$FT.applyClickTag($(_ct_elms[c]), c);
					}
				}
				init_animation();
			}
		} else if (_platform === "DC") {
			if (_unit_type === "RM" && _expands === true) {} else {
				$panel = document.getElementById("main-panel");
				$panel.addEventListener("click", function () {
					background_exit();
				});
				init_animation();
			}
		} else {
			$panel = document.getElementById("main-panel");
			$panel.addEventListener("click", function () {
				background_exit();
			}, false);
		}
	}
	
	
	function init_strd_setup() {
		//	This tells the unit that it's ready to continue with the animation of the unit.
		//	This method is located within the main "script.js" file.
		$("#unit-container").css({
			"opacity": "1"
		});
		init_animation();
	}
	

	function setup_autoExpand() {
		$col_timer = setTimeout(function () {
			$($colBtn).trigger("click");
			_isAutoExpand = false;
		}, 7000);

		if (_video[0] && $vid_holder.length) {
			$vid_holder.on("click", function () {
				_isAutoExpand = false;
				clearTimeout($col_timer);
				doLog("Timer Should be clearing...");
				trigger_video("start");
			});
		}
		setTimeout(function () {
			$($expBtn).trigger("click");
		}, 1000);
	}
	
	
	function expand_init() {
		setTimeout(function () {
			$collapsed.css({
				"display": "none"
			});
			$expBtn.css({
				"display": "none"
			});
		}, 150);

		$("body").css({
			"width": _expSize[0] + "px",
			"height": _expSize[1] + "px"
		});

		$("#exp_mask").css({
			"display": "block"
		});
		$expanded.css({
			"display": "block"
		});
		$colBtn.css({
			"display": "block"
		});

		switch ($exp_mask_direction) {
			case "leftRight":
				$("#exp_mask").animate({
					"left": 1
				}, 600, "linear", function () {
					$("#exp_mask").css({
						"display": "none"
					});
					doLog("Expanded Panel Should Be Visible");
					if (_platform === "DC") {
						doLog("Finishing the DoubleClick Expand");
					} else {
						expand_finish();
					}
				});
				break;

			case "topDown":
				$("#exp_mask").animate({
					"top": 1
				}, 600, "linear", function () {
					$("#exp_mask").css({
						"display": "none"
					});
					doLog("Expanded Panel Should Be Visible");
					if (_platform === "DC") {
						doLog("Finishing the DoubleClick Expand");
					} else {
						expand_finish();
					}
				});
				break;
		}
	}

	
	function expand_finish() {
		_is_expanded = true;
		on_expand();
		if (_autoplay) {
			trigger_video("expand");
		}
	}

	
	function collapse_init() {
		if (_isAutoExpand) {
			_isAutoExpand = false;
			clearTimeout($col_timer);
		}
		trigger_video("collapse");
		$collapsed.css({
			"display": "block"
		});
		$expBtn.css({
			"display": "block"
		});

		$("#exp_mask").css({
			"display": "block",
			"top": -1 - (_newExpSize[1] * 2)
		});
		$expanded.css({
			"display": "none"
		});
		$colBtn.css({
			"display": "none"
		});

		$("#exp_mask").css({
			"display": "none"
		});
		doLog("Collapsed Panel Should Be Visible");

		if (_platform === "DC") {} else {
			collapse_finish();
		}
	}

	
	function collapse_finish() {
		_is_expanded = false;
		on_collapse();
	}

	
	function trigger_video($action) {
		if (_video[0]) {
			switch ($action) {
				case "start":
					insert_video();
					break;
				case "expand":
					if (_autoplay === true && _isAutoExpand === false) {
						doLog("Inserting Video, AutoExpand: " + _isAutoExpand);
						if ($("#stillFrame").length) {
							insert_video();
							if (_platform === "FT") {
								setTimeout(function () {
									play_video();
								}, $vid_delay);
							}
						} else {
							play_video();
						}
					}
					break;

				case "collapse":
					if (!$("#stillFrame").length) {
						pause_video();
					}
					break;
			}
		} else {
			return;
		}
	}

	
	function play_video() {
		switch (_platform) {
			case "DC":
				$rm_video.playVideo();
				break;

			case "FT":
				$rm_video[0].play();
				break;
		}
	}

	
	function pause_video() {
		switch (_platform) {
			case "DC":
				$rm_video.pauseVideo();
				break;

			case "FT":
				$rm_video[0].pause();
				break;
		}
	}

	
	function insert_video() {
		$($vid_holder).empty();
		switch (_platform) {
			case "DC":
				doLog("Inserting DoubleClick Video Now");

				var $controls,
					$muted;

				if (_video[7]) {
					$controls = 1;
				} else {
					$controls = 0;
				}

				if (_video[8]) {
					$muted = 1;
				} else {
					$muted = 0;
				}
				
				if (_video[10]) {
					$rm_video = new YT.Player(_video[1], {
						width: _video[4].toString(),
						height: _video[5].toString(),
						videoId: _video[10],
						playerVars: {
							mute: $muted,
							controls: $controls,
							modestbranding: 1,
							rel: 0,
							showinfo: 0,
							wmode: "transparent",
							cc_load_policy: 1,
							cc_lang_pref: "en"
						},
						events: {
							"onReady": on_player_ready,
							"onStateChange": on_playerState_change,
							"onError": on_player_error
						}
					});
				} else {
					$rm_video = new YT.Player(_video[1], {
						width: _video[4].toString(),
						height: _video[5].toString(),
						videoId: _video[9],
						playerVars: {
							mute: $muted,
							controls: $controls,
							modestbranding: 1,
							rel: 0,
							showinfo: 0,
							wmode: "transparent"
						},
						events: {
							"onReady": on_player_ready,
							"onStateChange": on_playerState_change,
							"onError": on_player_error
						}
					});
				}
				break;

			case "FT":
				_$FT.insertVideo({
					parent: $vid_holder,
					video: _video[2],
					controls: _video[7],
					muted: _video[8],
					width: _video[4],
					height: _video[5]
				});
				$($vid_holder).find("ft-video").attr({
					"id": "rm_video"
				});
				
				if (_video[9]) {
					$("#rm_video").find("iframe").attr({
						"cc_load_policy" : 1,
						"cc_lang_pref" : "en"
					});
				}
				
				$rm_video = _$FT.$("#rm_video");
				setTimeout(function () {
					play_video();
				}, $vid_delay);
				break;
		}
	}

	
	function on_player_ready(event) {
		setTimeout(function () {
			play_video();
		}, $vid_delay);
	}

	
	function on_playerState_change(event) {

	}

	
	function on_player_error(event) {

	}

	
	function mod_js($mod, $code, $tgtTag, $class, $callback, $id) {
		var $sc = document.createElement("script");
		/*>*/
		doLog("Code Being Added.........." + $code);
		$sc.type = "text/javascript";
		switch ($mod) {
			case "Add":
				$sc.innerText = $code;
				break;

			case "Load":

				$sc.src = $code;
				if ($callback) {
					$sc.onload = $callback;
				}
				break;
		}
		if ($id) {
			$sc.id = $id;
		}
		if ($class) {
			$sc.className = $class;
		}

		document.getElementsByTagName($tgtTag)[0].appendChild($sc);
	}


	//	This method handles all of the replacement of tags that will be fed dynamic content. (FlashTalking)
	function getSetAttr($id, $rplceTag, $rplceAttrs) {
		doLog("Replacement Attributes: " + $rplceAttrs);
		var $elm = document.getElementById($id);
		/*>*/
		doLog("Found Element: " + $elm.id);

		if ($($elm).is("img")) {
			/*>*/
			doLog("Type 1");

			if ($elm.attributes) {
				var $transAttrs = [];

				$transAttrs[0] = [];
				$transAttrs[1] = [];

				$.each($elm.attributes, function () {
					if (this.name !== "id") {
						/*>*/
						doLog("Name: " + this.name);
						/*>*/
						doLog("Value: " + this.value);
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
			/*>*/
			doLog("Type 2");

			var $html = $($elm).innerHTML;
			$($elm).html("<" + $rplceTag + ">" + $html + "</" + $rplceTag + ">");

			$($elm).find($rplceTag).after(function () {
				replace_attributes($(this), $id, $rplceAttrs);
			});
		}
	}

	
	function replace_attributes($elm, $id, $rplceAttrs, $transAttrs) {
		if ($rplceAttrs) {
			doLog("Supplying New Attributes to:");
			doLog($elm);

			doLog("Attributes being Supplied:");
			doLog($rplceAttrs);

			doLog($rplceAttrs.length);
			$.each($rplceAttrs, function ($idx) {
				doLog("In Loop, Supplying attribute: ");
				doLog($rplceAttrs[$idx][0]);
				doLog(", of value: ");
				doLog($rplceAttrs[$idx][1]);

				$elm.prop($rplceAttrs[$idx][0], $rplceAttrs[$idx][1]);
			});
		}

		if ($transAttrs) {
			doLog("Transferring Attributes to: ");
			doLog($elm);

			doLog("Attributes being Transferred: ");
			doLog($transAttrs);

			$.each($transAttrs, function ($idx) {
				doLog("In Loop, Transferring attribute: ");
				doLog($transAttrs[0][$idx]);
				doLog(", of value: ");
				doLog($transAttrs[1][$idx]);

				$elm.prop($transAttrs[0][$idx], $transAttrs[1][$idx]);
			});
			$transAttrs[0].length = 0;
			$transAttrs[1].length = 0;
			$transAttrs.length = 0;
		}
	}

	function doLog($string) {
		if (_testing) {
			console.log($string);
		}
	}

	$.fn.returnReplaced = function (a) {
		var $a = $(a);

		this.replaceWith($a);
		return $a;
	};

})(jQuery);
