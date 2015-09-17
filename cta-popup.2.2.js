/*

	===========================================================

		jQuery CTA Popup

	===========================================================

	Plugin Info
	-----------------------------------------------------------
		Version: 			2.2.2
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
			for (var key in data) {
				if (data.hasOwnProperty(key)) {
					t = jQuery(ctaTar).attr('data-'+key);
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

		var ctaTar = '.cta-popup';		// target element use definition (#,.)

		var cVars = {
			'debug':0,					// I/O debug features
			'active':"active",			// active class to append
			'cookieName':'abPopUp', 	// enter cookie name
			'hover':1,					// enable/disable hover effect
			'cookieIn':7000, 			// delay for popout in milliseconds
			'cookieOut':21000, 			// hide if no interaction (0 to disable)
			'minWidth':1024,			// min page width for pop up
			'gaEnable':2,				// enable/disable ga events define below
			'pageCount':0,				// sets page number to display on
			'pageDelay':1,				// sets time for page number cookie

			'abStatus':1,				//toogle ab test
			'aSel':'.testA',			// class selector for test a
			'aLabel':'Test A',			// ga label for test a
			'aGoal':false,				// ga label for test a
			'bSel':'.testB',			// class selector for test b
			'bLabel':'Test B',			// ga label for test b
			'bGoal':false,				// ga label for test b
		}

		cVars = userVars(ctaTar,cVars); // merge with user values
		debuger(false,cVars);


		// GA Event Vars
		// -------------------------------------------------------
		var eOpen    = ['popup','singup','opened'] 	// Popup Open
		var eClose   = ['popup','singup','closed'] 	// Manual Close
		var eClick   = ['popup','singup','click'] 	// Click on link
		var abView   = ['a/b testing','view'] 	    // AB test  (category,action)
		var abAction = ['a/b testing','click'] 	    // AB test  (category,action)
		var abGoal   = ['a/b testing','goal'] 	    // AB test  (category,action)

		// Cookie vars in hour intervals
		// -------------------------------------------------------
		var nInter = 1;								// delay interval on no interaction from user
		var yInter = 720;							// delay interval on interaction from user

		// page array to hide popup
		// -------------------------------------------------------
		var pageException = ['/test1','/test'];

		//empty defualt vars
		// -------------------------------------------------------
		var timeIn = "";
		var timeOut = "";
		var TimerTest = false;


/*
	========================================================
	Global Functions
	========================================================
*/
		function debuger(t,msg){
			if(cVars.debug == 1 || t == true) { console.log(msg);}
		}

		function gaEvent(category,action,label){
			if(cVars.gaEnable == 1){ga('send','event',category,action,label);}
			if(cVars.gaEnable == 2){_gaq.push(['_trackEvent', category, action, label]);}
			debuger(false, "ga( 'send', 'event', '"+category+"', '"+action+"', '"+label+"')");
		}

		function abTest(){
			var c = testCookie('abTester',true);
			if(c != false){return c[1]}
			var t = ['0','a','b'];
			var n = Math.floor(Math.random() * 2) + 1;
			setCookie('abTester','60',t[n]);
			debuger(false,'abTest: '+t[n]);
			return t[n];
		}

		//global vars
		var tAB = abTest();
		var tSel = tAB+'Sel';
		var tLabel = tAB+'Label';
		var tGoal = tAB+'Goal';

		debuger(false,'AB Vars tAB: '+tAB+', tSel: '+tSel+', tLabel: '+tLabel+', tGoal: '+tGoal);

		function cookieDate(inter){
			var d = new Date();
			d.setTime(d.getTime() + (inter*60*60*1000));
			return d.toUTCString();
		}

		function testWidth(){
			// check page width agains minWidth var
			var w = jQuery(document).width();
			if(w < cVars.minWidth){
				debuger(false,'testWidth: false');
				return false;
			}

			debuger(false,'testWidth: true');
			return true;
		}

		function testURL(){
			var location = window.location.pathname;
			if(pageException.indexOf(location) > 0){
				debuger(false,'testURL: false');
				return false;
			}

			debuger(false,'testURL: true');
			return true;
		}

		function setCookie(name,inter,value) {
			if(debug == 1) {console.log(name+'debug' + "=" + value + ";  expires="+cookieDate(inter)); }
			document.cookie = name + "=" + value + ";  expires="+cookieDate(inter);

			debuger(false,'setCookie: true');
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
			debuger(false,'testCookie: '+result);
			return result;
		}

		function pageCounter(){
			var pageCur = 0;
			var cookie = testCookie(cVars.cookieName+'-Count',true);
			if(cookie != false) {pageCur = parseInt(cookie[1]);}
			pageCur ++;
			setCookie(cVars.cookieName+'-Count', cVars.pageDelay, pageCur);

			debuger(false,'pageCounter: true');
			return true;
		}

		function testCounter(){
			var cookie = testCookie(cVars.cookieName+'-Count',true);
			if(cookie[1] >= cVars.pageCount) {return true;}
			debuger(false,'testCounter: false');
			return false;
		}

		// if pagecounter enable run page count function
		if(cVars.pageCount > 0){pageCounter();}

		function sliderIn(){
			t = 0; //validation for cookie
			if(testWidth() == false) {t=1;}
			if(testURL() == false) {t=2;}
			if(cVars.pageCount > 0 && testCounter()== false) {t=3;}
			if(testCookie(cVars.cookieName,false) == true) {t=4;}

			if(t==0){
				jQuery(ctaTar).addClass('active');
				setCookie(cVars.cookieName,nInter, 'activated');
				clearTimeout(cVars.cookieIn);
				gaEvent(eOpen[0],eOpen[1],eOpen[2]);
				if(cVars.abStatus == 1) gaEvent(abView[0],abView[1],cVars[tLabel]);
				TimerTest = true;
				debuger(false,'sliderIn: true');
				return true;
			}else{
				debuger(false,'sliderIn: false ('+t+')');
				return false;
			}
		}

		function sliderOut(inter,msg){
			if(TimerTest != true) {
				debuger(false,'sliderOut: false');
				return false
			}

			if(inter === undefined) inter = nInter;
			if(msg === undefined) msg = 'no interaction';
			jQuery(ctaTar).removeClass('active');
			setCookie(cVars.cookieName,inter, msg);
			if(cVars.cookieOut > 0){clearTimeout(timeOut);}
			gaEvent(eClose[0],eClose[1],eClose[2]);

			debuger(false,'sliderOut: true');
			return true;
		}

		function goalComplete(){
			var location = window.location.pathname;
			var c = testCookie(cVars.cookieName,true)
			if( c[1] != 'clicked'){
				debuger(false,'goalComplete: false (cookie)');
				return false;
			}
			debuger(false,location+' | '+cVars[tGoal]);
			if(location != cVars[tGoal]){
				debuger(false,'goalComplete: false (url)');
				return false;
			}
			gaEvent(abGoal[0],abGoal[1],cVars[tLabel])
			debuger(false,'goalComplete: true');
			return true;
		}


	jQuery(document).ready(function(jQuery) {

		//test selector
		jQuery('.test').not(cVars[tSel]).remove();

		timeIn = setTimeout(sliderIn, cVars.cookieIn);
		if(cVars.cookieOut > 0){timeOut = setTimeout(sliderOut, cVars.cookieOut);}

		jQuery(ctaTar+' a').not('.wsp-close').click(function(){
			gaEvent(eClick[0],eClick[1],eClick[2]);
			setCookie(cVars.cookieName,yInter, 'clicked');
		});

		jQuery(document).on('click', cVars[tSel]+' .abAction', function(event) {
			gaEvent(abAction[0],abAction[1],cVars[tLabel]);
		});

		jQuery(ctaTar).mouseenter(function(){if(cVars.hover == 1){clearTimeout(timeOut);}});
		jQuery(ctaTar).mouseleave(function(){if(cVars.hover == 1){var timeOut = setTimeout(sliderOut, cVars.cookieOut);}});
		jQuery(ctaTar+' .close').click(function() { sliderOut(yInter,'closed'); cVars.hover = 0 });

		//check goals
		goalComplete();

	});