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
 * Portions created by the Initial Developer are Copyright (C) 2010
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

 /**TODO comment better
  * This method should be called before using the algorithm class.
  *
  * @param algo <ul> <li>p - for setting the class to a protanopic simulation.</li>
  *					<li>d - for setting the class to a deuteranopic simulation</li>
  *					<li>t - for setting the class to a tritanopic simulation</li></ul> 
*/
function AlgorithmDichromatSimulation(_algo) {
 
	var matrix = new Array(3);  	//A [3][3] array
	var i;
	for (i=0; i < 3; i++) {
		matrix[i]=new Array(3);
	}
	var inverse_matrix;

	var simulationF = null;
	var algo = null;

	init(_algo);
	
	/**
	 * This method should be called before using the algorithm class.
	 *
	 * @param algo <ul> <li>p - for setting the class to a protanopic simulation.</li>
	 *					<li>d - for setting the class to a deuteranopic simulation</li>
	 *					<li>t - for setting the class to a tritanopic simulation</li></ul> 
	 */
	function init(cAlgorithm) {

		matrix[0][0] = 0.1992;
		matrix[0][1] = 0.4112;
		matrix[0][2] = 0.0742;
		matrix[1][0] = 0.0353;
		matrix[1][1] = 0.2226;
		matrix[1][2] = 0.0574;
		matrix[2][0] = 0.0185;
		matrix[2][1] = 0.1231;
		matrix[2][2] = 1.3550;

		inverse_matrix = inverseOf3x3M(matrix);
		
		switch(cAlgorithm) {
			case 'p': simulationF = protanopicSimulation; break;
			case 'd': simulationF = deuteranopicSimulation; break;
			case 't': simulationF = tritanopicSimulation; break;
			default: simulationF = protanopicSimulation;
		}
		this.algo = cAlgorithm;
	}



	/**
	 * Use this method to apply simulation to an RGB coded pixel.
	 * 
	 * @param red - Red component as an integer between 0..255
	 * @param green - Green component as an integer between 0..255
	 * @param blue - Blue component as an integer between 0..255
	 *
	 * @return Pixel in RGB after simulation algorithm computed the new value.
	 *
	 */
	this.computeColor = function(red, green, blue) {


		var RGB_in = new Array(red, green, blue);
		var colorLMS = convertRGBtoLMS(RGB_in);

		
		var simulatedLMSColor = simulationF(colorLMS[0], colorLMS[1], colorLMS[2]);
		var computedRGB = convertLMStoRGB(simulatedLMSColor, computedRGB);
		var roundedRGB = roundRGB(computedRGB);

		return roundedRGB;	
	}


	/**
	 * Is  a private member function to compute some Coefficients depending on the choosen simulation type.
	 */
	function computeCoefficients(L_q, M_q, S_q) {
		
		var  L_e = 0.543157894736842105263157894736842;
		var  M_e = 0.230526315789473684210526315789474;;
		var  S_e = 0.7625; 

		var lambda_a = 0;

		switch(this.algo) {
			
			case 'p': lambda_a = (S_q / M_q < S_e / M_e) ? 575 : 475; break;
			case 'd': lambda_a = (S_q / L_q < S_e / L_e) ? 575 : 475; break;
			case 't': lambda_a = (M_q / L_q < M_e / L_e) ? 660 : 485; break;
			default: lambda_a =  (S_q / M_q < S_e / M_e) ? 575 : 475; break;
		} 

		var  L_a = l_coneContributionFunction(lambda_a); 
		var  M_a = m_coneContributionFunction(lambda_a); 
		var  S_a = s_coneContributionFunction(lambda_a);

		var ret = new Array(3);
		
		ret[0] = M_e * S_a - S_e * M_a;
		ret[1] = S_e * L_a - L_e * S_a;
		ret[2] = L_e * M_a - M_e * L_a; 

		return ret;
	}

	/**
	 * This function convert a color from the RGB space to the LMS space.
	 * By Multiply the conversation matrix with the color_lms vector.
	 *
	 * @param color_RGB An array[3] contaning values for R=0, G=1 and B=2
	 */
	function convertRGBtoLMS(color_RGB) {

		var color_LMS = createVector(3); //A vector
		
		//color_LMS = Matrix * color_RGB;
		var z,s;
		for(z = 0;z < 3;z++) {
			for(s = 0;s < 3;s++) {
				color_LMS[z] += matrix[z][s] * color_RGB[s];				
			}
		}
		return color_LMS;
	}

	/**
	 * This function convert a color from the LMS space to the RGB space.
	 * By Multiply the inverse conversation matrix with the color_rgb vector.
	 *
	 * @param color_LMS An array[3] contaning values for L=0, M=1 and S=2
	 */
	function convertLMStoRGB(color_LMS) {

		var color_RGB = createVector(3);  	//A [3][3] array
		
		//color_RGB = Inverse matrix * color_LMS;
		var m, n;
		for(m = 0;m < 3;m++) {
			for(n = 0;n < 3;n++) { 			

				color_RGB[m] += inverse_matrix[m][n] * color_LMS[n];
			}
		} 	

		return color_RGB;
	}

	function roundRGB(color_RGB) {

		var color_round_RGB = new Array(3);
		
		var color_temp_R	= color_RGB[0] - Math.floor(color_RGB[0]) <   0.5 ? Math.floor(color_RGB[0]) : Math.ceil(color_RGB[0]);
		var color_temp_G	= color_RGB[1] - Math.floor(color_RGB[1]) <   0.5 ? Math.floor(color_RGB[1]) : Math.ceil(color_RGB[1]);
		var color_temp_B	= color_RGB[2] - Math.floor(color_RGB[2]) <   0.5 ? Math.floor(color_RGB[2]) : Math.ceil(color_RGB[2]);
		
		if(color_RGB[0] < 0) color_temp_R = 0;
		if(color_RGB[1] < 0) color_temp_G = 0;
		if(color_RGB[2] < 0) color_temp_B = 0;
		
		if(color_RGB[0] > 255) color_temp_R = 255;
		if(color_RGB[1] > 255) color_temp_G = 255;
		if(color_RGB[2] > 255) color_temp_B = 255;
		
		color_round_RGB[0] = color_temp_R; //cast?
		color_round_RGB[1] = color_temp_G; 
		color_round_RGB[2] = color_temp_B; 
		
		return color_round_RGB;
	}

	/**
	 * This actual does compute the inverse of a 3x3 matrix
	 *
	 * @param matrix Should be an [3][3] array.
	 * @return The normalized inverse matrix.
	 */
	function inverseOf3x3M(matrix) {


		var inverse_matrix = new Array(3);
		for (i=0; i <3; i++) {
			inverse_matrix[i]=new Array(3);
		}

		/*
		 *          a b c
		 *  A =    (d e f)
		 *          g h i
		 *
		 *              e*i - f*h     c*h - b*i     b*f - c*e
		 * A^(-1) =	    f*g - d*i     a*i - c*g     c*d - a*f
		 *              d*h - e*g     b*g - a*h     a*e - b*d	
		 *
		 */ 	 
			
		
		inverse_matrix[0][0] = matrix[1][1] * matrix[2][2] - matrix[1][2] * matrix[2][1];
		inverse_matrix[0][1] = matrix[0][2] * matrix[2][1] - matrix[0][1] * matrix[2][2];
		inverse_matrix[0][2] = matrix[0][1] * matrix[1][2] - matrix[0][2] * matrix[1][1];
		
		inverse_matrix[1][0] = matrix[1][2] * matrix[2][0] - matrix[1][0] * matrix[2][2];
		inverse_matrix[1][1] = matrix[0][0] * matrix[2][2] - matrix[0][2] * matrix[2][0];
		inverse_matrix[1][2] = matrix[0][2] * matrix[1][0] - matrix[0][0] * matrix[1][2];
		
		inverse_matrix[2][0] = matrix[1][0] * matrix[2][1] - matrix[1][1] * matrix[2][0];
		inverse_matrix[2][1] = matrix[0][1] * matrix[2][0] - matrix[0][0] * matrix[2][1];
		inverse_matrix[2][2] = matrix[0][0] * matrix[1][1] - matrix[0][1] * matrix[1][0];
		
		/*
		 * If you compute matrix * inverse Matrix you often get something like this:
		 * (whereas is y ~= 0)
		 *
		 *                            0.5   y    y
		 * matrix * inverse_matrix = (y     0.5  y  )
		 *                            y     y    0.5
		 *
		 * This matrix will be extended with the correction factor to E(unit matrix).
		 */
		
		
		var e = multiplyAbyB(matrix,inverse_matrix, e); //compute e = matrix * inverse_matrix
		
		//compute a correction factor (arithmetic average from inverseMatrix[0][0] and inverseMatrix[1][1] and inverseMatrix[2][2])
		//because it should be inverseMatrix[0][0] == inverseMatrix[1][1] == inverseMatrix[2][2]. 
		//this isn't exact due to floating point arithmetic, so we need to correct this.
		var correction_factor = ((1.0 / e[0][0]) + (1.0 / e[1][1]) + (1.0 / e[2][2])) / 3.0; 

		//multiply inverse Matrix with correction factor
		var m, n;
		for(m = 0;m < 3;m++) {
			for(n = 0;n < 3;n++) {
			
				inverse_matrix[m][n] *= correction_factor;
			}
		}
		
		return inverse_matrix;
	}

	/**
	 * Compute A * A^(-1)
	 * A and B are 3x3 matrixes
	 * Caution A != result matrix & B != result matrix else this won't work! You need three matrixes!
	 */ 	
	function multiplyAbyB(matrix_a, matrix_b) {
		
		
		var e = new Array(3);
		var i;
		for (i=0; i <3; i++) {
			e[i]=new Array(3);
		}
		
		e[0][0]=e[0][1]=e[0][2]=e[1][0]=e[1][1]=e[1][2]=e[2][0]=e[2][1]=e[2][2]=0; //Init all fields with 0
		
		var k, l, j;
		
		for(k = 0; k < 3; k++) {
			for(l = 0; l < 3; l++) {
				for(j = 0; j < 3; j++) {
					e[k][l] += matrix_a[k][j] * matrix_b[j][l];
				}
			} 		
		}
		return e;
	}

	/**
	 * This function actually changes the L component to simulate protanopic. 
	 */	
	function protanopicSimulation(L_q, M_q, S_q) {

		var LMS_simu = new Array(3);

		var coeff_array = computeCoefficients(L_q, M_q, S_q);

		var L_q_derivative = -(coeff_array[1]*M_q + coeff_array[2]*S_q)/coeff_array[0];
		var M_q_derivative = M_q;
		var S_q_derivative = S_q;
		
		LMS_simu[0] = L_q_derivative;
		LMS_simu[1] = M_q_derivative;
		LMS_simu[2] = S_q_derivative;
		
		return LMS_simu; 		
	}

	/**
	 * This function actually changes the L component to simulate deuteranopic. 
	 */
	function deuteranopicSimulation(L_q, M_q, S_q) {

		var LMS_simu = new Array(3);

		var coeff_array = computeCoefficients(L_q, M_q, S_q);

		var L_q_derivative = L_q;
		var M_q_derivative = -(coeff_array[0]*L_q + coeff_array[2]*S_q)/coeff_array[1];
		var S_q_derivative = S_q;
		
		LMS_simu[0] = L_q_derivative;
		LMS_simu[1] = M_q_derivative;
		LMS_simu[2] = S_q_derivative;
		
		return LMS_simu;
	}

	/**
	 * This function actually changes the L component to simulate tritanopic. 
	 */
	function tritanopicSimulation(L_q, M_q, S_q) {

		var LMS_simu = new Array(3);

		var coeff_array = computeCoefficients(L_q, M_q, S_q);

		var L_q_derivative = L_q;
		var M_q_derivative = M_q;
		var S_q_derivative = -(coeff_array[0]*L_q + coeff_array[1]*M_q)/coeff_array[2];
		
		LMS_simu[0] = L_q_derivative;
		LMS_simu[1] = M_q_derivative;
		LMS_simu[2] = S_q_derivative;
		
		return LMS_simu;
	}

	//TODO Comment
	function l_coneContributionFunction(lambda) {
		
		var sum = 0;
		
		for(i = 390;i<=730;i+=5) {
			
			sum += compute_l_derivative(i) + compute_m_derivative(i);
		}

		return compute_l_derivative(lambda) / sum;
	}

	//TODO Comment
	function m_coneContributionFunction(lambda) {
		
		var sum = 0;
		
		for(i = 390;i<=730;i+=5) {
			
			sum += compute_l_derivative(i) + compute_m_derivative(i);
		}

		return compute_m_derivative(lambda) / sum;
	}

	//TODO Comment
	function s_coneContributionFunction(lambda) {
		
		var sum = 0;
		
		for(i = 390;i<=730;i+=5) {
			
			sum += compute_s_derivative(i);
		} 

		return compute_s_derivative(lambda) / sum;
	}

	
	
	
	//TODO Comment
	//lambda between 390 - 730nm in 5nm steps
	function compute_l_derivative(lambda) {

		var index = (lambda - 390) / 5;

		return 0.68273 * Math.pow(10,l[index]);
	}

	//TODO Comment
	//lambda between 390 - 730nm in 5nm steps
	function compute_m_derivative(lambda) {

		var index = (lambda - 390) / 5;
		
		return 0.35235 * Math.pow(10,m[index]);
	}

	//TODO Comment
	//lambda between 390 - 730nm in 5nm steps
	function compute_s_derivative(lambda) {

		var index = (lambda - 390) / 5;
						
		return 1.0 * Math.pow(10,s[index]);
	}
	
	function dumpMSG(aMessage) {
  		var consoleService = Components.classes["@mozilla.org/consoleservice;1"].getService(Components.interfaces.nsIConsoleService);
  		consoleService.logStringMessage("My component: " + aMessage);
	}
	
	function createVector(n) {
		
		var vector = new Array(n);
		
		var i = 0;
		for(;i < n; i++) {
			vector[i] = 0;
		}
		return vector;
	}
	
	var l = [
				-3.5037, //390nm
				-3.0445,
				-2.6515,
				-2.3204,
				-2.0576,
				-1.8795,
				-1.7576,
				-1.6575,
				-1.5695,
				-1.4872,
				-1.4161, //440nm
				-1.3620,
				-1.3116,
				-1.2585,
				-1.1860,
				-1.1045,
				-1.0138,
				-0.9238,
				-0.8613,
				-0.7910,
				-0.7267, //490nm
				-0.6342,
				-0.5277,
				-0.4272,
				-0.3380,
				-0.2622,
				-0.1976,
				-0.1484,
				-0.1101,
				-0.0773, 
				-0.0542, //540nm 
				-0.0382,
				-0.0261,
				-0.0142,
				-0.0054,
				-0.0008,
				-0.0005,
				-0.0057,
				-0.0140,
				-0.0219,
				-0.0337, //590nm
				-0.0525,
				-0.0777,
				-0.1092,
				-0.1478,
				-0.1946,
				-0.2491,
				-0.3101,
				-0.3815,
				-0.4688,
				-0.5663, //640nm
				-0.6690,
				-0.7795,
				-0.8992,
				-1.0267,
				-1.1609,
				-1.3016,
				-1.4490,
				-1.6010,
				-1.7556,
				-1.9126, //690nm
				-2.0712,
				-2.2312,
				-2.3925,
				-2.5540,
				-2.7145,
				-2.8744,
				-3.0338,
				-3.1922					
			];
	
	var m = [
				-3.5967, //390nm
				-3.1245,
				-2.7147,
				-2.3631,
				-2.0726,
				-1.8560,
				-1.6883,
				-1.5418,
				-1.4113,
				-1.2951,
				-1.1968, //440nm
				-1.1209,
				-1.0561,
				-0.9962,
				-0.9220,
				-0.8404,
				-0.7533,
				-0.6733,
				-0.6239,
				-0.5674,
				-0.5170, //490nm
				-0.4405,
				-0.3488,
				-0.2633,
				-0.1892,
				-0.1284,
				-0.0793,
				-0.0459,
				-0.0239,
				-0.0069,
				-0.0002, //540nm
				-0.0022,
				-0.0099,
				-0.0205,
				-0.0369,
				-0.0617,
				-0.0952,
				-0.1389,
				-0.1906,
				-0.2469,
				-0.3120, //590nm
				-0.3882,
				-0.4748,
				-0.5711,
				-0.6771,
				-0.7942,
				-0.9139,
				-1.0334,
				-1.1594,
				-1.3073,
				-1.4670, //640nm
				-1.6345,
				-1.8047,
				-1.9615,
				-2.1137,
				-2.2722,
				-2.4327,
				-2.5949,
				-2.7574,
				-2.9185,
				-3.0793, //690nm
				-3.2415,
				-3.4031,
				-3.5636,
				-3.7226,
				-3.8796,
				-4.0350,
				-4.1890,
				-4.3414					
		];
		
		var s = [
				-2.1038, //390nm
				-1.6412,
				-1.2413,
				-0.8994,
				-0.6216,
				-0.4200,
				-0.2777,
				-0.1740,
				-0.0953,
				-0.0370,
				-0.0058, //440nm
				-0.0017,
				-0.0222,
				-0.0535,
				-0.0902,
				-0.1272,
				-0.1863,
				-0.2767,
				-0.4042,
				-0.5402,
				-0.6791, //490nm
				-0.8046,
				-0.9243,
				-1.0485,
				-1.2068,
				-1.3635,
				-1.5313,
				-1.7112,
				-1.8918,
				-2.0710, //540nm
				-2.2510,
				-2.4277,
				-2.6012,
				-2.7716,					
				-2.9389,
				-3.1033,
				-3.2648,
				-3.4235,
				-3.5794,
				-3.7327,
				-3.8834, //590nm
				-4.0316,
				-4.1773,
				-4.3205,
				-4.4615,
				-4.6001,
				-4.7365,
				-4.8707,
				-5.0028,
				-5.1328,
				-5.2608, //640nm
				-5.3868,
				-5.5109,
				-5.6330,
				-5.7533,
				-5.8718,
				-5.9886,
				-6.1036,
				-6.2169,
				-6.3285, //690nm
				-6.4386,
				-6.5470,
				-6.6539,
				-6.7593,
				-6.8632,
				-6.9657,
				-7.0667,
				-7.1664,
				-7.2646				
			];	
}