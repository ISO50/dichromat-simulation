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
 

function ImageProcessor(simulation_a) {

	var simulationa = simulation_a;

	/**
	 * @param height Height of the block
	 * @param width Width of the block
	 * @param count Length of the array, must be exactly heigt * width
	 * @param inArray Array with a block of pixels. One dimensional.
	 */
	this.processImage = function (height, width, count, inArray) {	
		
		var outArray = new Array(count);

		var red;
		var green;
		var blue;

		var lastRealRed = 0;
		var lastRealGreen = 0;
		var lastRealBlue = 0;

		var y;
		var x;
		var simulated_color = null;
		
		for(y = 0; y < height; y++) {
			
			for(x = 0; x < width; x++) {
			
				// Compute replacement colors
				// if actual pixel != last pixel
				// This saves time if on color occurs very often in an image
				// but it is only a very easy approach, maybe a better algorithm will be used later, to increase performance.
				if( (lastRealRed   != inArray[x*4+(y*width*4)+0]) ||
					(lastRealGreen != inArray[x*4+(y*width*4)+1]) ||
					(lastRealBlue  != inArray[x*4+(y*width*4)+2]) ||
					 simulated_color == null) 
				{			
						simulated_color = simulationa.computeColor(inArray[x*4+(y*width*4)+0], //Red
																	inArray[x*4+(y*width*4)+1],  //Green
																	inArray[x*4+(y*width*4)+2]); //Blue
				}

				//save last orginal pixel
				lastRealRed = inArray[x*4+(y*width*4)+0];
				lastRealGreen = inArray[x*4+(y*width*4)+1];
				lastRealBlue = inArray[x*4+(y*width*4)+2];


				outArray[x*4+(y*width*4)+0] = simulated_color[0]; // red
				outArray[x*4+(y*width*4)+1] = simulated_color[1]; // green
				outArray[x*4+(y*width*4)+2] = simulated_color[2]; // blue
				outArray[x*4+(y*width*4)+3] = inArray[x*4+(y*width*4)+3];
			}
		}
		return outArray; 
	}
}