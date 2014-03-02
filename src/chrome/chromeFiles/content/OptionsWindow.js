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

var change = false;
 
function loadPrefsToGUI() {

	var pref = Components.classes["@mozilla.org/preferences-service;1"].getService(Components.interfaces.nsIPrefBranch);
	
	document.getElementById("b7bb04d5-37c5-4c2b-9650-0b03ac658bf0_stylesheet").checked = pref.getBoolPref("extensions.b7bb04d5-37c5-4c2b-9650-0b03ac658bf0.stylsheets");
	document.getElementById("b7bb04d5-37c5-4c2b-9650-0b03ac658bf0_globalStylesheet").checked = pref.getBoolPref("extensions.b7bb04d5-37c5-4c2b-9650-0b03ac658bf0.globalstylesheets");
	document.getElementById("b7bb04d5-37c5-4c2b-9650-0b03ac658bf0_HTMLStyleAttribute").checked = pref.getBoolPref("extensions.b7bb04d5-37c5-4c2b-9650-0b03ac658bf0.htmlstyleattributes");
	document.getElementById("b7bb04d5-37c5-4c2b-9650-0b03ac658bf0_HTMLColorAttributes").checked = pref.getBoolPref("extensions.b7bb04d5-37c5-4c2b-9650-0b03ac658bf0.htmlcolorattributes");
	document.getElementById("b7bb04d5-37c5-4c2b-9650-0b03ac658bf0_Images").checked = pref.getBoolPref("extensions.b7bb04d5-37c5-4c2b-9650-0b03ac658bf0.image");
	document.getElementById("b7bb04d5-37c5-4c2b-9650-0b03ac658bf0_CssBackgroundImages").checked = pref.getBoolPref("extensions.b7bb04d5-37c5-4c2b-9650-0b03ac658bf0.cssbackgrounds");
	document.getElementById("b7bb04d5-37c5-4c2b-9650-0b03ac658bf0_HTMLBackgroundImage").checked = pref.getBoolPref("extensions.b7bb04d5-37c5-4c2b-9650-0b03ac658bf0.htmlbackgrounds");
	document.getElementById("b7bb04d5-37c5-4c2b-9650-0b03ac658bf0_Frames").checked = pref.getBoolPref("extensions.b7bb04d5-37c5-4c2b-9650-0b03ac658bf0.frames");
	document.getElementById("b7bb04d5-37c5-4c2b-9650-0b03ac658bf0_showToolbar").checked = pref.getBoolPref("extensions.b7bb04d5-37c5-4c2b-9650-0b03ac658bf0.toolbar");
	document.getElementById("b7bb04d5-37c5-4c2b-9650-0b03ac658bf0_newTab").checked = pref.getBoolPref("extensions.b7bb04d5-37c5-4c2b-9650-0b03ac658bf0.newtab");
	document.getElementById("b7bb04d5-37c5-4c2b-9650-0b03ac658bf0_promptOnEnd").checked = pref.getBoolPref("extensions.b7bb04d5-37c5-4c2b-9650-0b03ac658bf0.promptOnEnd");
}

function savePrefs() {

	var pref = Components.classes["@mozilla.org/preferences-service;1"].getService(Components.interfaces.nsIPrefBranch);
	var checkbox = null;

	pref.setBoolPref("extensions.b7bb04d5-37c5-4c2b-9650-0b03ac658bf0.stylsheets", document.getElementById("b7bb04d5-37c5-4c2b-9650-0b03ac658bf0_stylesheet").checked);
	pref.setBoolPref("extensions.b7bb04d5-37c5-4c2b-9650-0b03ac658bf0.globalstylesheets", document.getElementById("b7bb04d5-37c5-4c2b-9650-0b03ac658bf0_globalStylesheet").checked);
	pref.setBoolPref("extensions.b7bb04d5-37c5-4c2b-9650-0b03ac658bf0.htmlstyleattributes", document.getElementById("b7bb04d5-37c5-4c2b-9650-0b03ac658bf0_HTMLStyleAttribute").checked);
	pref.setBoolPref("extensions.b7bb04d5-37c5-4c2b-9650-0b03ac658bf0.htmlcolorattributes", document.getElementById("b7bb04d5-37c5-4c2b-9650-0b03ac658bf0_HTMLColorAttributes").checked);
	pref.setBoolPref("extensions.b7bb04d5-37c5-4c2b-9650-0b03ac658bf0.image", document.getElementById("b7bb04d5-37c5-4c2b-9650-0b03ac658bf0_Images").checked);
	pref.setBoolPref("extensions.b7bb04d5-37c5-4c2b-9650-0b03ac658bf0.cssbackgrounds", document.getElementById("b7bb04d5-37c5-4c2b-9650-0b03ac658bf0_CssBackgroundImages").checked);
	pref.setBoolPref("extensions.b7bb04d5-37c5-4c2b-9650-0b03ac658bf0.htmlbackgrounds", document.getElementById("b7bb04d5-37c5-4c2b-9650-0b03ac658bf0_HTMLBackgroundImage").checked);
	pref.setBoolPref("extensions.b7bb04d5-37c5-4c2b-9650-0b03ac658bf0.frames", document.getElementById("b7bb04d5-37c5-4c2b-9650-0b03ac658bf0_Frames").checked);
	pref.setBoolPref("extensions.b7bb04d5-37c5-4c2b-9650-0b03ac658bf0.toolbar", document.getElementById("b7bb04d5-37c5-4c2b-9650-0b03ac658bf0_showToolbar").checked);
	pref.setBoolPref("extensions.b7bb04d5-37c5-4c2b-9650-0b03ac658bf0.newtab", document.getElementById("b7bb04d5-37c5-4c2b-9650-0b03ac658bf0_newTab").checked);
	pref.setBoolPref("extensions.b7bb04d5-37c5-4c2b-9650-0b03ac658bf0.promptOnEnd", document.getElementById("b7bb04d5-37c5-4c2b-9650-0b03ac658bf0_promptOnEnd").checked);
}

function noChange() {
	
	document.getElementById("b7bb04d5-37c5-4c2b-9650-0b03ac658bf0_OptionsWinowOption_ApplyButton").disabled = true;
}

function onCheckBoxChange() {
	
	document.getElementById("b7bb04d5-37c5-4c2b-9650-0b03ac658bf0_OptionsWinowOption_ApplyButton").disabled = false;
}

function onClickStylesheetCheckox() {
	
	if(document.getElementById("b7bb04d5-37c5-4c2b-9650-0b03ac658bf0_stylesheet").checked == false) {
		
		
		document.getElementById("b7bb04d5-37c5-4c2b-9650-0b03ac658bf0_globalStylesheet").checked = false;
		document.getElementById("b7bb04d5-37c5-4c2b-9650-0b03ac658bf0_HTMLStyleAttribute").checked = false;
		document.getElementById("b7bb04d5-37c5-4c2b-9650-0b03ac658bf0_globalStylesheet").disabled = true;
		document.getElementById("b7bb04d5-37c5-4c2b-9650-0b03ac658bf0_HTMLStyleAttribute").disabled = true;
	} else {
		
		document.getElementById("b7bb04d5-37c5-4c2b-9650-0b03ac658bf0_globalStylesheet").checked = true;
		document.getElementById("b7bb04d5-37c5-4c2b-9650-0b03ac658bf0_HTMLStyleAttribute").checked = true;
		document.getElementById("b7bb04d5-37c5-4c2b-9650-0b03ac658bf0_globalStylesheet").disabled = false;
		document.getElementById("b7bb04d5-37c5-4c2b-9650-0b03ac658bf0_HTMLStyleAttribute").disabled = false;
	}
}

function onCloseOptionsWindow() {

}