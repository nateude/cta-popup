# A/B CTA Pop-Up
an adjustable cta pop up for websites, with built in a/b testing functionality requires jQuery &amp; google analytics. Relies on cookies to track test values and paths.

## Install

to install cta-popup simply download the files and include them in your project folder.

```html
	<script src="cta-popup.js"></script>
```

Include the CSS file for basic styling

```html
	<link rel="stylesheet" href="cta-popup.css">
```

* **cta-popup.htm** includes sample html code for the popup script. However you can add the script to any element by adding the class **.cta-popup** to the element and adjusting the variables using the attarabutes *see below for more info*.
* **cta-popup.css** includes basic css classes for a overlay or slider in popup
* **cta-popup.js** includes unminified javascript functions
* **cta-popup.min.js** includes minified javascript functions

## Requirments

jQuery *only tested with verison 1.11.3 +*

## User Variables

to change the variable you can directly edit in the js file or use the element attrabutes to overwrite the script, this is the perfered method. Variables defined below.

**HTML Attritbutes Sample**

```html
		<div
			class="cta-popup slider"
			data-debug=0
			data-active='active'
			data-cookieName='tester_1013'
			data-hover=1
			data-cookieIn=1000
			data-cookieOut=4000
			data-minWidth=1024
			data-gaEnable=0
			data-pageCount=0
			data-pageDelay=1
			data-abStatus=1
			data-aSel='.testA'
			data-aLabel='Test A'
			data-aGoal=false
			data-bSel='.testB'
			data-bLabel='Test B'
			data-bGoal=false
		>
		<div class="overlay"></div>
		<div class="content">
			<div class="close">x</div>
			<div class="conwrap">
				<div class="test testA">
					<h2>A Test Title</h2>
					<p>Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</p>
					<form method="post" name="form" action="#">
						<input type="text" name="email" value="" placeholder="Enter Your Email">
						<input type="submit" class="abAction" value="Submit" id="Submit" name="Submit">
					</form>
				</div>
				<div class="test testB">
					<h2>B Test Title</h2>
					<p>Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</p>
					<a href="testb.htm" class="button abAction"><span>Subscribe to Our Newsletter</span></a>
				</div>
			</div>
		</div>
	</div>
```
### With JavaScript

You can edit variables directly in the javascript files if you like I don't recommend this.

### Attribute Defintions

| Name 			| Description 																| type 		|
|:--------------|:--------------------------------------------------------------------------|:----------|
| active 		| Class to append to div on active											| string 	|
| cookieName 	| Cookie & Test Name														| string 	|
| hover 		| Toogle pause on hover														| Interger 	|
| cookieIn 		| Delay (after pageload) to show popout (millisecond) 						| Interger 	|
| cookieOut 	| Delay (after cookieIn) to hide popout (millisecond) 						| Interger 	|
| minWidth 		| Minmum page width for pop to show (hides when smaller)					| Interger 	|
| gaEnable 		| Toogle ga events 															| Interger 	|
| pageCount 	| Number of Pages to visit before displaying								| Interger 	|
| pageDelay 	| Cookie Timer for Pages (aka most visit 3 pages in x amount of time)		| Interger 	|
| abStatus 		| Toogle A/B Test function 													| Interger 	|
| aSel 			| Class selector for Test A 												| string 	|
| aLabel 		| GA label for Test A 														| string 	|
| aGoal 		| GA label for Test A 														| string 	|
| bSel 			| Class selector for Test B													| string 	|
| bLabel 		| GA label for Test B														| string 	|
| bGoal 		| GA label for Test B														| string 	|

## Resources
