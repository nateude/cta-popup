/*

	===========================================================

		jQuery CTA Popup

	===========================================================

	Plugin Info
	-----------------------------------------------------------
		Version: 			2.1.2
		Plugin URI: 		https://github.com/nateude/cta-popup
		Developer: 			Nate Ude
		Devloper url: 		http://www.NateUde.com/

		License Agreement: 	Attribution-ShareAlike 4.0 International
		License URL: 		http://creativecommons.org/licenses/by-sa/4.0/


	Plugin Requirements
	-----------------------------------------------------------

		jQuery (Only Tested with 1.11.3)

*/


	/*
		========================================================
		Global Variables
		========================================================
	*/


		// Function to test array agains user vars
		function userVars(tar,data){
			if(debug == 1) { console.log("userVars: "+tar); }
			if(debug == 1) { console.log(data); }
			for (var key in data) {
				if (data.hasOwnProperty(key)) {
					if(debug == 1) { console.log(key + ": " + data[key]); }
					t = $(ctaTar).attr('data-'+key);
					if(typeof t !== 'undefined'){ data[key] = t;};
				}
			}

			return data;
		}

	/*
		Define Default Vars
		-------------------------------------------------------
			section defines all the setting defualts and replaces them with any data attr from html
			example: <div class="cta-popup" data-cookieName="testing"> .. </div>

			*exception: over write debug and ctaTar here

	*/

		var debug = 0;					// I/O debug features
		var ctaTar = '.cta-popup';		// target element use definition (#,.)

		var cVars = {
			'active':"active",			// active class to append
			'cookieName':'slideout', 	// enter cookie name
			'hover':false,				// enable/disable hover effect
			'cookieIn':100, 			// delay for popout
			'cookieOut':0, 				// hide if no interaction (0 to disable)
			'minWidth':1024,			// min page width for pop up
			'gaEnable':false,			// enable/disable ga events define below
			'pageCount':3,				// sets page number to display on
			'pageDelay':1,				// sets time for page number cookie

			'abStatus':1,				//toogle ab test
			'aSel':'.testA',			// class selector for test a
			'aLabel':'Test A',			// ga label for test a
			'bSel':'.testB',			// class selector for test b
			'bLabel':'Test B',			// ga label for test b
		}

		if(debug == 1) { console.log(cVars); }
		cVars = userVars(ctaTar,cVars); // merge with user values

		console.log(cVars);


		// GA Event Vars
		// -------------------------------------------------------
		var eOpen    = ['popup','singup','opened'] 	// Popup Open
		var eClose   = ['popup','singup','closed'] 	// Manual Close
		var eClick   = ['popup','singup','click'] 	// Click on link
		var abView   = ['a/b testing','view'] 	    // AB test  (category,action) --> set labels below
		var abAction = ['a/b testing','click'] 	    // AB test  (category,action) --> set labels below

		// Cookie vars in hour intervals
		// -------------------------------------------------------
		var nInter = 0;								// delay interval on no interaction from user
		var yInter = 0;								// delay interval on interaction from user

		// page array to hide popup
		// -------------------------------------------------------
		var pageException = ['/page-url/','/page-url2/'];


/*
	========================================================
	Global Functions
	========================================================
*/


		function gaEvent(category,action,label){
			if(cVars.gaEnable == true){ga('send','event',category,action,label);}
			else{console.log("ga( 'send', 'event', '"+category+"', '"+action+"', '"+label+"')")}
		}

		function abTest(){
			var t = ['0','a','b'];
			var n = Math.floor(Math.random() * 2) + 1;
			return t[n];
		}

		var tAB = abTest();
		var tSel = tAB+'Sel';
		var tLabel = tAB+'Label';

		function cookieDate(inter){
			var d = new Date();
			d.setTime(d.getTime() + (inter*60*60*1000));
			return d.toUTCString();
		}

		function checkWidth(){
			// check page width agains minWidth var
			var w = $(document).width();
			if(w < cVars.minWidth){return true;}
			return false;
		}

		function urlException(){
			var location = window.location.pathname;
			if(pageException.indexOf(location) < 0){return false;}
			return true;
		}

		function setCookie(name,inter,value) {
			if(debug == 1) {console.log(name+'debug' + "=" + value + ";  expires="+cookieDate(inter)); }
			document.cookie = name + "=" + value + ";  expires="+cookieDate(inter);
			return true;
		}

		function testCookie(nm,data) {
			var result = false;
			var cookies = document.cookie.split('; ');
			for (i = 0; i < cookies.length; i++) {
				var cookie = cookies[i].split('=');
				if(cookie[0] == nm){
					if(data == true){result = cookie;}
					else{result = true;}
				}
			}

			return result;
		}

		function pageCounter(){
			var pageCur = 0;
			var cookie = testCookie('cta-Count',true);
			if(cookie != false) {pageCur = parseInt(cookie[1]);}
			pageCur ++;
			setCookie('cta-Count', cVars.pageDelay, pageCur);
		}

		function testCounter(){
			var cookie = testCookie('cta-Count',true);
			if(cookie[1] >= cVars.pageCount) {return true;}
			return false;
		}

		// if pagecounter enable run page count function
		if(cVars.pageCount > 0){pageCounter();}

		function sliderIn(){
			//validation for cookie
			if(checkWidth() == true) {return false;}
			if(urlException() == true) {return false;}
			if(cVars.pageCount > 0 && testCounter()== false) {return false;}
			if(testCookie(cVars.cookieName,false) == true) {return false;}
			$(ctaTar).addClass('active');
			setCookie(cVars.cookieName,nInter, 'activated');
			clearTimeout(cVars.cookieIn);

			gaEvent(eOpen[0],eOpen[1],eOpen[2]);
			if(cVars.abStatus == 1) gaEvent(abView[0],abView[1],cVars[tLabel]);
		}

		function sliderOut(inter,msg){
			if(inter === undefined) inter = nInter;
			if(msg === undefined) msg = 'no interaction';
			$(ctaTar).removeClass('active');
			setCookie(cVars.cookieName,inter, msg);
			clearTimeout(timeOut);
			gaEvent(eClose[0],eClose[1],eClose[2]);
		}


	jQuery(document).ready(function($) {

		//test selector
		$('.test').not(cVars[tSel]).remove();

		var timeIn = setTimeout(sliderIn, cVars.cookieIn);
		if(cVars.cookieOut > 0){var timeOut = setTimeout(sliderOut, cVars.cookieOut);}

		$(ctaTar+' a').not('.wsp-close').click(function(){
			gaEvent(eClick[0],eClick[1],eClick[2]);
			setCookie(cVars.cookieName,yInter, 'clicked');
		});

		$(document).on('click', cVars[tSel]+' .abAction', function(event) {
			gaEvent(abAction[0],abAction[1],cVars[tLabel]);
		});

		$(ctaTar).mouseenter(function(){if(cVars.hover == true){clearTimeout(timeOut);}});
		$(ctaTar).mouseleave(function(){if(cVars.hover == true){var timeOut = setTimeout(sliderOut, cVars.cookieOut);}});
		$(ctaTar+' .wsp-close').click(function() { sliderOut(yInter,'closed'); cVars.hover = false });

	});