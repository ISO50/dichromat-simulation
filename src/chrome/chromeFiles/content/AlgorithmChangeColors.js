/* ***** BEGIN LICENSE BLOCK *****
 * Version: MPL 1.1/GPL 2.0/LGPL 2.1
 *
 * The contents of this file are subject to the Mozilla Public License Version
 * 1.1 (the "License"); you may not use this file except in compliance with
 * the License. You may obtain a copy of the License at
 * http://www.mozilla.org/MPL/
 *
 * Software distributed under the License is distributed on an "AS IS" basis,
 * WITHOUT WARRANTY OF ANY KIND, either express or implied. See the License
 * for the specific language governing rights and limitations under the
 * License.
 *
 * The Original Code is Joerg Dotzki code.
 *
 * The Initial Developer of the Original Code is
 * Joerg Dotzki.
 * Portions created by the Initial Developer are Copyright (C) 2007
 * the Initial Developer. All Rights Reserved.
 *
 * Contributor(s):
 *   Joerg Dotzki
 *
 * Alternatively, the contents of this file may be used under the terms of
 * either the GNU General Public License Version 2 or later (the "GPL"), or
 * the GNU Lesser General Public License Version 2.1 or later (the "LGPL"),
 * in which case the provisions of the GPL or the LGPL are applicable instead
 * of those above. If you wish to allow use of your version of this file only
 * under the terms of either the GPL or the LGPL, and not to allow others to
 * use your version of this file under the terms of the MPL, indicate your
 * decision by deleting the provisions above and replace them with the notice
 * and other provisions required by the GPL or the LGPL. If you do not delete
 * the provisions above, a recipient may use your version of this file under
 * the terms of any one of the MPL, the GPL or the LGPL.
 *
 * ***** END LICENSE BLOCK ***** */

/**
 *  @param	_doc	This is the document on that color simulation should be applied.
 *  @param	s_a_parameterlist	List of parameters for the algorithm. The type of parameters in the array are specific to the used algorithm.
 *  @param	_changeExt_Int_Stylesheets _change_img
 *  @param	_change_style_att
 *  @param	_change_html_color_att 
 *  @param	_change_css_background_img
 *  @param	_html_background
 *  @param	_frames
 *  @param	_newTab
 */ 
 
// TODO <input src="" > can also have an image
function AlgorithmChangeColors(_doc, _s_a_parameterlist, _changeExt_Int_Stylesheets, _change_style_att, _change_html_color_att, _change_img, _change_css_background_img, _html_background, _frames, _newTab ) {

	//Init
	var	simulation_algorithm = null;
	var	doc = _doc;
	var	changeExt_Int_Stylesheets = _changeExt_Int_Stylesheets;
	var	change_style_att = _change_style_att;
	var	change_html_color_att = _change_html_color_att;
	var	change_img = _change_img;
	var	change_css_background_img = _change_css_background_img;
	var	computeColor = computeColor_js;
	var	simulationa = new AlgorithmDichromatSimulation(_s_a_parameterlist[0]);

	var	html_background = _html_background;
	var	frames = _frames;
	var	openNewTab = _newTab;
	var	neuTab = true;
	var promptAfterProcess = false;
	//Image Processor for processing blocks of pixel.
	var imageProcessor = new ImageProcessor(simulationa);

	//Dummy Elementnode
	var hack_elememt = doc.createElement("non");
	hack_elememt.setAttribute("style", "");
	
	
	function getPrefs() {
		
		var pref = Components.classes["@mozilla.org/preferences-service;1"]
 					.getService(Components.interfaces.nsIPrefBranch);
 					
		promptAfterProcess = pref.getBoolPref("extensions.b7bb04d5-37c5-4c2b-9650-0b03ac658bf0.promptOnEnd");
		
	}
	
	function createURL() {
	
		var url = null;
		
		try {
			url = Components.classes["@mozilla.org/network/standard-url;1"].createInstance(Components.interfaces.nsIURL);
		} catch (err) {
			
			dumpMSG("ERROR: " + err); //TODO
		}
	
		return url;
	}		


	//TODO maybe renname function to "execute"?
	/**
	 * This function starts the simulation on the document.
	 *
	 */
	this.computeAlgorithm = function() {
	
		getPrefs();

		//Open the result in a new tab
		if(openNewTab) {
		
			/*http://developer.mozilla.org/en/docs/Working_with_windows_in_chrome_code#Accessing_elements_which_are_ancestors_of_the_current_content_window*/	
			var twindow = window.QueryInterface(Components.interfaces.nsIInterfaceRequestor)
		                   .getInterface(Components.interfaces.nsIWebNavigation)
		                   .QueryInterface(Components.interfaces.nsIDocShellTreeItem)
		                   .rootTreeItem
		                   .QueryInterface(Components.interfaces.nsIInterfaceRequestor)
		                   .getInterface(Components.interfaces.nsIDOMWindow); 
		
		  	while(true) {
		  	
		  		if(twindow.gBrowser != null && twindow.gBrowser.id == "content") 
		  			break;
		  	
		  		twindow = twindow.opener;
		  	}

		  	var tabBrowser = twindow.gBrowser;
		  	var newTab = tabBrowser.addTab ( "about:blank" ); //Create a new Tab
	  		var browser = tabBrowser.getBrowserForTab(newTab); 	// http://www.xulplanet.com/references/elemref/ref_browser.html

		  	
		  	//This is the listener that fires if document is loaded into a new Tab
		  	//http://developer.mozilla.org/en/docs/nsIWebProgressListener
		  	//http://developer.mozilla.org/en/docs/Code_snippets:Progress_Listeners
			const STATE_START = Components.interfaces.nsIWebProgressListener.STATE_START;
			const STATE_STOP = Components.interfaces.nsIWebProgressListener.STATE_STOP;
			var STATE_COUNT = 0;
			
			var _pgListener =
			{
				
				
				QueryInterface: function(aIID)
				{
					if (aIID.equals(Components.interfaces.nsIWebProgressListener) ||
					aIID.equals(Components.interfaces.nsISupportsWeakReference) ||
					aIID.equals(Components.interfaces.nsISupports))
					return this;
					throw Components.results.NS_NOINTERFACE;
				},
			
				onStateChange: function(aProgress, aRequest, aFlag, aStatus)
				{
					// STOP + WINDOW fires tow times so count it
					if( (aFlag & Components.interfaces.nsIWebProgressListener.STATE_IS_WINDOW) 
					     && (aFlag & Components.interfaces.nsIWebProgressListener.STATE_STOP) ) {
						
						STATE_COUNT++;
					}
					
					// And start simulation first if event is the fired second time
					if( (aFlag & Components.interfaces.nsIWebProgressListener.STATE_IS_WINDOW) 
					     && (aFlag & Components.interfaces.nsIWebProgressListener.STATE_STOP) 
					     && STATE_COUNT == 2)
					{

						doc = browser.contentDocument;
						browser.removeProgressListener(_pgListener);
			  			if(changeExt_Int_Stylesheets == true) changeDocumentStylesheets(doc);
						if(change_style_att == true || change_html_color_att == true || change_img == true) goThroughTree(doc.documentElement);					
						tabBrowser.selectedTab = newTab;
					}					
					return 0;
				},
			
				onLocationChange: function(aProgress, aRequest, aURI) {return 0;},
				onProgressChange: function(	aWebProgress, aRequest, aCurSelfProgress, aMaxSelfProgress, aCurTotalProgress, aMaxTotalProgress) {return 0;},
				onStatusChange: function() {return 0;},
				onSecurityChange: function() {return 0;},
				onLinkIconAvailable: function() {return 0;}
			} //end of _pgListener

		  	browser.addProgressListener(_pgListener, 0);
		  	browser.loadURI(doc.baseURI); // Load document in the new Tab

		} else {		
			//TODO Think about if the document should be changed first, than the stylesheets
			//TODO2 What's with the browser stylesheets, if the browser stylesheets contain colors, that is imho not covered
	
			if(changeExt_Int_Stylesheets == true) changeDocumentStylesheets(doc);
			if(change_style_att == true || change_html_color_att == true || change_img == true) goThroughTree(doc.documentElement);
		}
		if(promptAfterProcess) {
			alert('Simulation process for page completed.');
		}
	}
	
	/**
	 * This function modifies all intern and extern stylesheets.
	 * HTML Documents: External stylesheets(via <link> element) inline stylesheets (via <style> element).
	 * XML Documents: Externalfor tech stylsheets(via XML style sheet processing instructions)
	 * @param	_document	The document which you want to change. 
	 */
	function changeDocumentStylesheets(_document) {
		
		//process all intern and extern stylesheets
		for(var i = 0;i < _document.styleSheets.length;i++) {
		
			var temp = null;
			var uri = null;
		
			if(_document.styleSheets[i].ownerNode.nodeName.toLowerCase() == "link") {
				
				temp = _document.styleSheets[i].ownerNode.href; //absolute reference
								
			} else if (_document.styleSheets[i].ownerNode.nodeName.toLowerCase() == "style") {
				
				temp = _document.location.href;   //absolute reference
			}

			//TODO How to deal with XML processing instructions?
			//cut off filename 
			var url= createURL();
			url.spec = temp;
			url.spec = url.prePath + url.directory;
			changeStylesheet(_document.styleSheets[i],url);
		}
	}
	
	/**
	 * Process all rules of a stylesheet.
	 *
	 * @param stylesheet This parameter has the type CSSStyleSheet see http://www.w3.org/TR/DOM-Level-2-Style/css.html#CSS-CSSStyleSheet
	 * @param url This parameter has the type nsIURL and represents the path for the stylesheet
	 */
	function changeStylesheet(stylesheet, url) {
		
		//Process all rules of this stylesheet
		for(var i = 0;i < stylesheet.cssRules.length;i++) {
		
			var cssRule = stylesheet.cssRules[i];
			
			if(cssRule.type == CSSRule.STYLE_RULE) {
				
				changeStyleRule(cssRule.style, url); //call changeStyleRule if we have a normal style rule
				
			} else if (cssRule.type == CSSRule.IMPORT_RULE ) {
			
				if(cssRule.styleSheet != null) { //Is null if @media Stylesheet has an unsupported MediaTyp
					
					var stylsheetURL = createURL();
					var URIFixup = null;
					
					try {
			
						URIFixup = Components.classes["@mozilla.org/docshell/urifixup;1"].getService(Components.interfaces.nsIURIFixup);
					} catch(error) {}//TODO print Exception or Warning
				
					stylsheetURL.spec = cssRule.href;
					
					//TODO Search for a better way to get the absolute path. 
					if((stylsheetURL.host != "" && stylsheetURL.scheme != "" && stylsheetURL.path != "") || stylsheetURL.schemeIs("file")) { //If the stylsheet path is absolute

						stylsheetURL.spec = cssRule.href;
					} 
					else { //If path for background-image isn't absolute
					
						stylsheetURL = URIFixup.createFixupURI(url.resolve(cssRule.href), 0);				
					}
						
					changeStylesheet(cssRule.styleSheet, stylsheetURL);
				}
			}
		}
	}
	
	/**
	 * Change one single CSS color property in a given CSSStyleRule.
	 *
	 * @param styledeclaration	Is of type CSSStyleDeclaration see http://www.w3.org/TR/DOM-Level-2-Style/css.html#CSS-CSSStyleDeclaration
	 */
	function changeStyleRule(styledeclaration, url) {	
		
		var style_string = "";

		//(1)get colors from style rule
		var color_string = styledeclaration.getPropertyValue("color");
		var bg_color_string = styledeclaration.getPropertyValue("background-color");
		var border_top_string = styledeclaration.getPropertyValue("border-top-color");
		var border_bottom_string = styledeclaration.getPropertyValue("border-bottom-color");
		var border_left_string = styledeclaration.getPropertyValue("border-left-color");
		var border_right_string = styledeclaration.getPropertyValue("border-right-color");
		var background_image_string = styledeclaration.getPropertyValue("background-image");
		
		//(2)Create a string for a dummy style attribute
		if(color_string != "" ) style_string += "color: " + color_string + ";";
		if(bg_color_string != "") style_string += "background-color: " + bg_color_string + ";";
		if(border_top_string != "") style_string += "border-top-color: " + border_top_string + ";";
		if(border_bottom_string != "" ) style_string += "border-bottom-color: " + border_bottom_string + ";";
		if(border_left_string != "" ) style_string += "border-left-color: " + border_left_string + ";";
		if(border_right_string != "" ) style_string += "border-right-color: " + border_right_string + ";";
		//if(background_image_string != "" ) style_string += "background-image:" + background_image_string + ";";

		
		//(3)Temporary use of the hack element
		//We apply the actual style of the styledeclaration to an invisible element
		//and ask for the current apllied style
		hack_elememt.setAttribute("style", style_string);
		var comp_styles = doc.defaultView.getComputedStyle(hack_elememt, null);
		

		//(4)From step 3 we obtain the colors as CSS Values and compute the simulation color
		var bg_color = computeColor(comp_styles.getPropertyCSSValue("background-color"));
		var color = computeColor(comp_styles.getPropertyCSSValue("color")); 
		var border_top = computeColor(comp_styles.getPropertyCSSValue("border-top-color")); 
		var border_bottom = computeColor(comp_styles.getPropertyCSSValue("border-bottom-color")); 
		var border_left = computeColor(comp_styles.getPropertyCSSValue("border-left-color")); 
		var border_right = computeColor(comp_styles.getPropertyCSSValue("border-right-color"));


		//(5)assign new color to the styledeclaration
		if (color_string != "" && color != null) styledeclaration.setProperty("color","rgb("+ color[0] + "," + color[1] + "," + color[2] + ")",null);
		if (bg_color_string != "" && bg_color != null) styledeclaration.setProperty("background-color","rgb("+ bg_color[0] + "," + bg_color[1] + "," + bg_color[2] + ")",null);
		if (border_top_string != "" && border_top != null) styledeclaration.setProperty("border-top-color","rgb("+ border_top[0] + "," + border_top[1] + "," + border_top[2] + ")",null);
		if (border_bottom_string != "" && border_bottom != null) styledeclaration.setProperty("border-bottom-color","rgb("+ border_bottom[0] + "," + border_bottom[1] + "," + border_bottom[2] + ")",null);
		if (border_left_string != "" && border_left != null) styledeclaration.setProperty("border-left-color","rgb("+ border_left[0] + "," + border_left[1] + "," + border_left[2] + ")",null);
		if (border_right_string != "" && border_right != null) styledeclaration.setProperty("border-right-color","rgb("+ border_right[0] + "," + border_right[1] + "," + border_right[2] + ")",null);
			
		//process CSS background Images		
		if(change_css_background_img) {
			
			//Remove url('') and whitespaces from CSS string
			//var background_image_url = background_image_string.replace(/^url\(/, '').replace(/\)$/, ''); //Have a more nice way for this, call me			 
			var background_image_url = parseBackGroundImageString(background_image_string); //Have a more nice way for this, call me			 
			var background_image = null;

			if(background_image_string != "" && background_image_string.toLowerCase() != "none") {

				var imgURL = createURL();
				var URIFixup = null;

				try {
			
					URIFixup = Components.classes["@mozilla.org/docshell/urifixup;1"].getService(Components.interfaces.nsIURIFixup);
				} catch(error) {
					dumpMSG('Error URI fixUP');
				}//TODO print Exception or Warning in console
				
				
				imgURL.spec = background_image_url;
	
				//TODO is there a better way for getting an absolute path?
				if((imgURL.host != "" && imgURL.scheme != "" && imgURL.path != "") || imgURL.schemeIs("file")) { //if the background-image path is absolute
					
					imgURL.spec = background_image_url;
				} 
				else { //if background-image path isn't absolute

					imgURL = URIFixup.createFixupURI(url.resolve(background_image_url), 0);
					//imgURL = URIFixup.createFixupURI(url.spec + background_image_url, 0);
				}
				runSimulationOnImage(imgURL.spec, function(dataUrl) {
														background_image = dataUrl;
														styledeclaration.setProperty("background-image","url("+background_image+")",null);
													}); //compute a new image, with colorblind simulated colors				
			} else if(background_image_string != "" && background_image_string.toLowerCase() == "inherit") {
				
				background_image = "inherit";
			}
			
			//Set the replacement image to the styledeclaration
			if (background_image_string != "" && background_image != null) {
			
				styledeclaration.setProperty("background-image","url("+background_image+")",null);
			}
		}
	}	
	
	/**
	 * This function goes through the document tree.
	 * 
	 * @param	node	Node to process.
	 */	 
	function goThroughTree (node) {
		
		var child_nodes = node.childNodes;

		
		for(var i = 0;i < child_nodes.length;i++) {

			if(child_nodes[i].nodeType == 1) { //if DOM Node is an element			
						
				goThroughTree(child_nodes[i]);
			}
		}

		if(change_style_att == true) applyNewStyleAttributColors(node); //process html style attribute
		if(change_html_color_att == true) processOldHTMLColorAttributes(node);  //process html color attributes
		if( ((node.nodeName).toLowerCase() == "img") && change_img ) {	//process img elements			 

			changeHtmlImageElement(node); 	
		}
		if( ((node.nodeName).toLowerCase() == "input") && change_img ) {	//process input elements			 
			var changedNode = changeHtmlInputElement(node);
			if(changedNode) {
				node.parentNode.replaceChild(changedNode,node);
			}
		}
		if(frames && (node.nodeName).toLowerCase() == "frame") {
			
			(new AlgorithmChangeColors(node.contentDocument, _simulation_algorithm, _s_a_parameterlist, 
										changeExt_Int_Stylesheets, change_style_att, change_html_color_att, 
										change_img, change_css_background_img, frames))
										.computeAlgorithm();
		}
		if(html_background && node.hasAttribute("background") != null) changeHTMLBackground(node);
	}
	
	
	/**
	 * This function changes the HTML background attribute.
	 */
	function changeHTMLBackground(node) {
		
		if(!node.hasAttribute("background")) return; //nothing to do
		
		var baseURI = createURL();
		baseURI.spec = node.getAttribute("background");
		var path = node.getAttribute("background");
						
		var imgURL = createURL();
		var URIFixup = null;
		try {
	
			URIFixup = Components.classes["@mozilla.org/docshell/urifixup;1"].getService(Components.interfaces.nsIURIFixup);
		} catch(error) {
			//TODO print Exception or Warning in the console
		}
		
		imgURL.spec = path;

		//TODO is there a better way for getting an absolute path?
		if((imgURL.host != "" && imgURL.scheme != "" && imgURL.path != "") || imgURL.schemeIs("file")) { //if the background-image path is absolute
			
			imgURL.spec = path;
		} 
		else { //if background-image path isn't absolute then

			imgURL = URIFixup.createFixupURI(baseURI.resolve(path), 0);	
		}	
		
		//Determine background-image property of this element.
		var imgCSSURL = createURL();
		var comp_styles = doc.defaultView.getComputedStyle(node,null);
		imgCSSURL.spec = comp_styles.getPropertyCSSValue("background-image").getStringValue();
		imgCSSURL = URIFixup.createFixupURI(imgCSSURL.spec,0);
		
		//compare both URLs
		if(imgURL.equals(imgCSSURL)) { //if both URLs are pointing to the same file, then change

			runSimulationOnImage(comp_styles.getPropertyCSSValue("background-image").getStringValue(), 
								function(dataUrl) {
									node.setAttribute('background', dataUrl);
								});
		} 
		//else nothing to do, because priority is like this: html-background < global stylesheets < style attribute		
	}
	
	/**
	 * Changes all CSS color properties from one HTML style attribute
	 * @param node Node is a HTML element to change. 
	 */
	function applyNewStyleAttributColors(node) {

		var style_string = "";
	
		//Add colors to style attribute
		if(node.style.color != "" ) style_string += "color: " + node.style.color + ";";
		if(node.style.backgroundColor != "") style_string += "background-color: " + node.style.backgroundColor + ";";
		if(node.style.borderTopColor != "") style_string += "border-top-color: " + node.style.borderTopColor + ";";
		if(node.style.borderBottomColor != "") style_string += "border-bottom-color: " + node.style.borderBottomColor + ";";
		if(node.style.borderLeftColor != "") style_string += "border-left-color: " + node.style.borderLeftColor + ";";
		if(node.style.borderRightColor != "") style_string += "border-right-color: " + node.style.borderRightColor + ";";
		if(node.style.backgroundImage != "") style_string += "background-image: " + node.style.backgroundImage + ";";
		hack_elememt.setAttribute("style", style_string);

		//and ask for the current applied style
		var comp_styles = doc.defaultView.getComputedStyle(hack_elememt,null);

		//compute new colors
		var bg_color = null;
		var color = null;
		var border_top = null; 
		var border_bottom = null;
		var border_left = null; 
		var border_right = null; 
		
		if(node.style.backgroundColor != "") bg_color = computeColor(comp_styles.getPropertyCSSValue("background-color"));
		if(node.style.color != "") color = computeColor(comp_styles.getPropertyCSSValue("color")); 
		if(node.style.borderTopColor != "") border_top = computeColor(comp_styles.getPropertyCSSValue("border-top-color")); 
		if(node.style.borderBottomColor != "") border_bottom = computeColor(comp_styles.getPropertyCSSValue("border-bottom-color")); 
		if(node.style.borderLeftColor != "") border_left = computeColor(comp_styles.getPropertyCSSValue("border-left-color")); 
		if(node.style.borderRightColor != "") border_right = computeColor(comp_styles.getPropertyCSSValue("border-right-color"));
		
		//set colors
		if (node.style.color != "" && color != null) node.style.color = "rgb("+ color[0] + "," + color[1] + "," + color[2] + ")";
		if (node.style.backgroundColor  != "" && bg_color != null) node.style.backgroundColor = "rgb("+ bg_color[0] + "," + bg_color[1] + "," + bg_color[2] + ")";
		if (node.style.borderTopColor != "" && border_top != null) node.style.borderTopColor = "rgb("+ border_top[0] + "," + border_top[1] + "," + border_top[2] + ")";
		if (node.style.borderBottomColor != "" && border_bottom != null) node.style.borderBottomColor = "rgb("+ border_bottom[0] + "," + border_bottom[1] + "," + border_bottom[2] + ")";
		if (node.style.borderLeftColor != "" && border_left != null) node.style.borderLeftColor = "rgb("+ border_left[0] + "," + border_left[1] + "," + border_left[2] + ")";
		if (node.style.borderRightColor != "" && border_right != null) node.style.borderRightColor = "rgb("+ border_right[0] + "," + border_right[1] + "," + border_right[2] + ")";

		if(change_css_background_img) {
		
			var background_image = null;
			var background_url = parseBackGroundImageString(comp_styles.getPropertyCSSValue("background-image").cssText);
			
			if(comp_styles.getPropertyCSSValue("background-image").cssValueType == CSSValue.CSS_VALUE_LIST && background_url !=  "none") {
			
			runSimulationOnImage(background_url, function(dataUrl) {
													background_image  = dataUrl;
													node.style.backgroundImage = "url("+background_image+")"
												});
	
			} else if(comp_styles.getPropertyCSSValue("background-image").cssValueType == CSSValue.CSS_INHERIT) {
			
				background_image = "inherit";
			}
			if (node.style.backgroundImage != "" && background_image != null) node.style.backgroundImage = "url("+background_image+")"; //TODO only proceed if "changeImage" is true
		}
	}
	
	/**
	 * Compute new color value for the given value.
	 *
	 * @param	a_color	The orgininal Color. Type is CSSPrimitiveValue or an array containing RGB.
	 */
	 function computeColor_js(a_color) {
	
		var new_color = null;	
		
		if(a_color instanceof CSSPrimitiveValue && a_color.primitiveType == CSSPrimitiveValue.CSS_RGBCOLOR && a_color.getRGBColorValue() instanceof RGBColor) {

			var red		= a_color.getRGBColorValue().red.getFloatValue(CSSPrimitiveValue.CSS_NUMBER);
			var green	= a_color.getRGBColorValue().green.getFloatValue(CSSPrimitiveValue.CSS_NUMBER);
			var blue	= a_color.getRGBColorValue().blue.getFloatValue(CSSPrimitiveValue.CSS_NUMBER);
			
			new_color = simulationa.computeColor(red, green, blue);
		}
		
		if(a_color instanceof Array) {
			
			new_color = simulationa.computeColor(a_color[0],a_color[1],a_color[2]);
		}

		return new_color;
	}
	
	/**
	 * This function is for the HTML color attributes.
	 */
	function processOldHTMLColorAttributes(node) {
		
		/**
		 *  Change these attributes:
		 *
		 *	<body bgcolor="#XXXXXX" text="#XXXXXX" link="#XXXXXX" vlink="#XXXXXX" alink="#XXXXXX">
		 *	<font color="#XXXXXX"></font>
		 */
		 
		 
		//HTML attribute color		 
		if(node.hasAttribute('color')) {

		    hack_elememt.setAttribute("style", "color: " + node.getAttribute("color") + ";");
		    var comp_styles = window.getComputedStyle(hack_elememt,null); 
		    
		    var color = computeColor(comp_styles.getPropertyCSSValue("color"));
			node.setAttribute('color', "#" + decToHex(color[0]) + decToHex(color[1]) + decToHex(color[2]));
		}
		
		//HTML attribute bgcolor
		if(node.hasAttribute('bgcolor')) {

			hack_elememt.setAttribute("style", "color: " + node.getAttribute("bgcolor") + ";");
		    var comp_styles = window.getComputedStyle(hack_elememt,null); 

		    var color = computeColor(comp_styles.getPropertyCSSValue("color"));
			node.setAttribute('bgcolor', "#" + decToHex(color[0]) + decToHex(color[1]) + decToHex(color[2]));
		}
		
		//HTML attribute text
		if(node.hasAttribute('text')) {

		    hack_elememt.setAttribute("style", "color: " + node.getAttribute("text") + ";");
		    var comp_styles = window.getComputedStyle(hack_elememt,null); 

		    var color = computeColor(comp_styles.getPropertyCSSValue("color"));
			node.setAttribute('text', "#" + decToHex(color[0]) + decToHex(color[1]) + decToHex(color[2]));
		}
		
		// See this as completely deprecated stuff - will not covered in any tests
		// HTML attribute link
		if(node.hasAttribute('link')) {

		    hack_elememt.setAttribute("style", "color: " + node.getAttribute("link") + ";");
		    var comp_styles = window.getComputedStyle(hack_elememt,null); 

		    var color = computeColor(comp_styles.getPropertyCSSValue("color"));
			node.setAttribute('link', "#" + decToHex(color[0]) + decToHex(color[1]) + decToHex(color[2]));
		}
		
		//HTML attribute vlink
		if(node.hasAttribute('vlink')) {

		    hack_elememt.setAttribute("style", "color: " + node.getAttribute("vlink") + ";");
		    var comp_styles = window.getComputedStyle(hack_elememt,null); 

		    var color = computeColor(comp_styles.getPropertyCSSValue("color"));
			node.setAttribute('vlink', "#" + decToHex(color[0]) + decToHex(color[1]) + decToHex(color[2]));
		}
		
		//HTML attribute alink
		if(node.hasAttribute('alink')) {

		    hack_elememt.setAttribute("style", "color: " + node.getAttribute("alink") + ";");
		    var comp_styles = window.getComputedStyle(hack_elememt,null); 

		    var color = computeColor(comp_styles.getPropertyCSSValue("color"));
			node.setAttribute('alink', "#" + decToHex(color[0]) + decToHex(color[1]) + decToHex(color[2]));
		}
		
		/**
		 * Convert from Hex to Dec
		 * @param number Should be an integer between 0 - 255
		 * @return The integer in HEX notation as a string
		 */
		function decToHex(number) {

			var ziff1 = 0;
			var ziff2 = 0;
			
			ziff1 = Math.floor(number / 16);
			ziff2 = number - (ziff1 * 16); //Rest
			
			function toHexZiff(numb) {
				
				var ret = null;
				
				switch (numb) {
					case 0:  ret =   "0";break;
					case 1:  ret =   "1";break;
					case 2:  ret =   "2";break;
					case 3:  ret =   "3";break;
					case 4:  ret =   "4";break;
					case 5:  ret =   "5";break;						
					case 6:  ret =   "6";break;						
					case 7:  ret =   "7";break;						
					case 8:  ret =   "8";break;
					case 9:  ret =   "9";break;						
					case 10: ret =   "A";break;						
					case 11: ret =   "B";break;						
					case 12: ret =   "C";break;						
					case 13: ret =   "D";break;						
					case 14: ret =   "E";break;						
					case 15: ret =   "F";break;
					default: ret =   "";
				}
				
				return ret;
			}
			return "" + toHexZiff(ziff1) + toHexZiff(ziff2);
		} 
	} // end of processOldHTMLColorAttributes(node)
	
	/**
	 * Create a copy of an input element.
	 *
	 * @param node a node that represents the image to copy
	 * @return	Return a copy of the orginial <img> element. 
	 */
	function changeHtmlInputElement(input) {

		if(!input.getAttribute('src')) {
			return null;
		}
		
		var newE = doc.createElementNS("http://www.w3.org/1999/xhtml", "input"); 
		
		for(var i = 0;i < input.attributes.length; i++) {

			newE.setAttribute(input.attributes[i].nodeName, input.attributes[i].value);
		}

		return newE;
	}
	
	/**
	 * Create a copy of an image element.
	 *
	 * @param node a node that represents the image to copy
	 */
	function changeHtmlImageElement(img) {
		
		runSimulationOnImage(img.src, function(dataUrl) {
								img.src = dataUrl;
							});
	}
	
	
	/**
	 * Let's run the simulation over a image.
	 * 1. create a <img> from the URL
	 * 2. Draw <img> to <canvas>
	 * 3. Iterate over all pixels of the <canvas>, get blocks with 50x50px
	 * 4. Compute a simulation color
	 * 5. put simulated colors back in <canvas>
	 * 6. Write the content of the <canvas> to a data:URL
	 *    and return it.
	 *
	 *
	 * @param image_url The URL of the image for simulation.
	 * @param hander Handler function receives the dataUrl as parameter. When the processing was done on the origianl image.
	 * @return	Return the simulated image in a data:url
	 */
	function runSimulationOnImage(image_url, handler) {

		var _handler = handler;

		if(!_handler) {
			dumpMSG("There is a method invocation without _handler set need to be fixed.");
			return;
		}

		if(!image_url) {
			dumpMSG("image_url not set");
			return;
		}

		//(1)
		var img = new Image();
		
		var canvas = null;
		var canvasContext = null; 

		//onload event.
		img.onload = function() { 			

			//I want to use doc instead of document, but how?
			canvas = document.createElementNS("http://www.w3.org/1999/xhtml","canvas");
			canvas.setAttribute("height", img.height);
			canvas.setAttribute("width", img.width);

			canvasContext = canvas.getContext("2d");

			try {
				//(2)
				canvasContext.drawImage(img, 0, 0); // Now draw it into the canvas
			} catch(err) {
				dumpMSG("Error1 when processing image "+image_url+"\n"+err);
			}
			try {
				changeCanvas();
				_handler(canvas.toDataURL("image/png"));
			} catch(err2) {
				dumpMSG("Error2 when processing image "+image_url+"\n"+err2);
			}
		}
		img.src = image_url;

		return;

		/**
		 * This function reads every pixel from the canvas, computes a simulation color,
		 * and set the pixel to the simulation color
		 *
		 */
		function changeCanvas() {

			var blockSize = 50; //50px
			//(3)
			for(var y = 0;y*blockSize < canvas.height; y++) {
				for(var x = 0;x*blockSize < canvas.width; x++) {
					//get pixel from canvas (3)
					var imageDataOriginal = canvasContext.getImageData(x*blockSize,y*blockSize,
																(canvas.width-x*blockSize < blockSize ? canvas.width-x*blockSize : blockSize),
																(canvas.height-y*blockSize < blockSize ? canvas.height-y*blockSize : blockSize)); 
					//(4)
					var simArr = imageProcessor.processImage(imageDataOriginal.height,imageDataOriginal.width,imageDataOriginal.data.length,imageDataOriginal.data);
					var imageData = canvasContext.createImageData(imageDataOriginal.width, imageDataOriginal.height);
   					imageData.data.set(simArr);

  					//draw to canvas (5)
					canvasContext.putImageData(imageData,
												x*blockSize,
												y*blockSize); // write pixel back
				}
			}
		} //End of function changeImage() {
	} //End of function runSimulationOnImage(image_url) {
	
	//CSSValue.CSS_VALUE_LIST
	/**
	 * Since a background-image css property could also contain some mozilla specific extension. This method
	 * will parse the URL from the CssValueList	for 'background-image'
	 * Example: 
	 *          (1) background-image:url('./rgb.png');
	 *          (2) background-image:url('./rgb.png'), -moz-linear-gradient(#D6E9F7, #FFFFFF 600px);;
	 */
	function parseBackGroundImageString(bgImgString) {
		
		// URL so far:  "url ('./rgb.png'), -moz-linear-gradient(#D6E9F7, #FFFFFF 600px)"
		//find index of sub string 'url'
		//var i = 0;
		var index = bgImgString.search('url');
		
		// No Url in CSSValueList
		if(index < 0) {
			return "none";
		}
		var string_afterURL = bgImgString.substr(index + 3);
		
		//URL so far: ' (./rgb.png'), -moz-linear-gradient(#D6E9F7, #FFFFFF 600px)"
		index = findCharPos(string_afterURL, ')');
		var str_before_closing_bracket = string_afterURL.substring(0, index);
		
		//URL so far:  ('./rgb.png'
		index = findCharPos(str_before_closing_bracket, '(');
		var ret = str_before_closing_bracket.substring(index + 1, str_before_closing_bracket.length);

		
		ret = remove(ret, '"');
		ret = remove(ret, "'");
		
		return ret;
	}
	
	// have to write it because search for '(' or ')' even escaped doesn't worked.
	function findCharPos(string, aChar) {
	
		var i = 0;
		for(;i<string.length;i++) {
			
			if(string[i] == aChar) {
				return i;
			}
		}
		return -1;
	}
	
	//since replace('/"/g') not working
	function remove(string, aChar) {

		var index = findCharPos(string, aChar);
		if(index >= 0) {
			
			var new_str1 = string.substring(0, index);
			var new_str2 = "";
			if(index + 1 < string.length) {
				new_str2 = string.substring(index + 1, string.length);
			}				
			
			return remove(new_str1 + new_str2, aChar);
		} else {
			return string;
		}
	}
	
	function dumpMSG(aMessage) {
	
  		var consoleService = Components.classes["@mozilla.org/consoleservice;1"].getService(Components.interfaces.nsIConsoleService);
  		consoleService.logStringMessage("My component: " + aMessage);
	}
	
} //End of AlgorithmChangeColors

//EOF