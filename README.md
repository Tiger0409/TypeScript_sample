#Overview

SimplePicker is a pure HTML5 color picker for any compliant browsers (IE10, Safari, Firefox, Chrome). It also works embed in a WebView (Android, iOS or Windows 8) . No Flash. No external images. No reliance on external frameworks (such as jQuery). No CSS (style to suit yourself). The base classes are written in TypeScript and get compiled to JavaScript. You can simply include the JavaScript in your projects. 

Released under the terms of the BSD License.

Minimal usage requires two HTML5 Canvas elements (one for hue, one for saturation and lightness) and one arbitrary HTML element to show the selected color (the background color of the element will be set to the chosen color). 

Text fields for displaying the chosen color in RGB and HSL format, and HTML5 range controls (sliders) can also be specified if desired.

See a <a href="http://contraterrene.com/snippets/SimplePicker/Example.html">live demo here</a> (use Safari or Chrome).

#Styling

You're free to apply any CSS styling that fits into your application's design (but see the note below about the size of the canvas
elements).

#Caveats

You should set the width and height for the canvas elements explicitly in the HTML code, rather than relying on CSS (otherwise you may
run into scaling issues -- I may have a workaround for this, though. More later.). 

However, CSS positioning, border style, etc. should work fine, and you should be able to put the canvases in an outer HTML container DIV and do any desired CSS magic on that.

#TODO

- It's intended that the text input fields will work both ways (that is, you can type an RGB or HSL value in using the keyboard),  but that isn't implemented yet. Right now they just display the current value as output. The basic issue here is how to handle "wrong" input values -- try to figure out what the user meant, or insist on a specific input format. It would be more robust to have separate text input fields for each of R,G,B and H,S,L, but
that would complicate setting up the picker. Still thinking about this. 

- Generate api docs from TypeScript

#Basic usage:

	<script src="SimplePicker.js"></script>
	<script type="text/javascript">
	// Set up a SimplePicker with no controls other than clicking.
	function setupPicker(){
		var sp = new SimplePicker("slider","picker","preview");
		sp.draw();
	}

	</script>

	<body onload="setupPicker();">
		<canvas id="slider" width="200" height="20">></canvas><p />
		<canvas id="picker" width="400" height="400"></canvas><p />
		<div id="preview" width="50" height="50"> </div>
	</body>

#Usage with HTML5 range ("slider") controls:

	<script src="SimplePicker.js"></script>

	<script type="text/javascript">
    // Set up a SimplePicker with range controls for RGB and HSL.
	function setupPicker(){
		var sp = new SimplePicker("slider","picker","preview");
		sp.control.bindRGB("red","green","blue");
		sp.control.bindHSL("hue","saturation","lightness");
		sp.setRGB(0, 0, ,0);
		sp.draw();
	}

	</script>

	<body onload="setupPicker();">


		<canvas id="slider" width="200" height="20">></canvas><p />
		<canvas id="picker" width="400" height="400"></canvas><p />
		<div id="preview" width="50" height="50"> </div> 

		Red: <input type="range" min = "0" max ="255" step="1" id="red"  /><br />
		Green: <input type="range" min = "0" max ="255" step="1" id="green" /><br />
		Blue: <input type="range" min = "0" max ="255" step="1" id="blue" /><br />
		Hue: <input type="range" min = "0" max ="360" step="1" id="hue"  /><br />
		Saturation: <input type="range" min = "0.0" max ="1.0" step="0.01" id="saturation" /><br />
		Lightness: <input type="range" min = "0.0" max ="1.0" step="0.01" id="lightness" /><br />

	</body>

#Usage with HTML5 range controls and text input fields:


	<script src="SimplePicker.js"></script>

	<script type="text/javascript">
	// SimplePicker with range controls and text input/output fields.
	function setupPicker(){
		var sp = new SimplePicker("picker","slider","preview");
		sp.bindRGB("red","green","blue");
		sp.bindHSL("hue","saturation","lightness");
		sp.bindHSLInput("hslval");
		sp.bindRGBInput("rgbval");
	
	}

	</script>

	<body onload="setupPicker();">


		<canvas id="slider"  width="200" height="20">></canvas><p />
		<canvas id="picker" width="400" height="400"></canvas><p />
		<div id="preview" width="50" height="50"> </div> 

		Red: <input type="range" min = "0" max ="255" step="1" id="red"  /><br />
		Green: <input type="range" min = "0" max ="255" step="1" id="green" /><br />
		Blue: <input type="range" min = "0" max ="255" step="1" id="blue" /><br />
		Hue: <input type="range" min = "0" max ="360" step="1" id="hue"  /><br />
		Saturation: <input type="range" min = "0.0" max ="1.0" step="0.01" id="saturation" /><br />
		Lightness: <input type="range" min = "0.0" max ="1.0" step="0.01" id="lightness" /><br />
	
		RGB: <input type="text" id="rgbval" value = "unknown"/> HSL:<input type="text" id="hslval" value = "unknown"/><br />

	</body>


		
