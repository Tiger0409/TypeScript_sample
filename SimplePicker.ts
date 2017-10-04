/*
* @copyright 2013 Goldeneye Solutions
* Released under the terms of the BSD License
*
* @copyright 2012 by Contraterrene eLearning Group, LLC
*/

/// <reference path="classes/misc/color.ts" />

class SimplePicker {
	picker: any;
	slider: any;
	preview: HTMLElement;

	rgb: MV.color.RGB;
	hsl: MV.color.HSL;
	hex = '';
	_oldHex = '';

	verticalHue: bool;
	pointer: any;
	control: SimplePickerControls;

	// todo array options to configure properties
	constructor(sliderId, pickerId, previewId) {
		this.slider = document.getElementById(sliderId);   // canvas
		this.picker = document.getElementById(pickerId);   // canvas
		this.preview = document.getElementById(previewId); // html element

		if (this.slider.offsetHeight > this.slider.offsetWidth) {
			this.verticalHue = true;
		} else {
			this.verticalHue = false;
		}

		this.rgb = new MV.color.RGB;
		this.hsl = new MV.color.HSL;
		this.pointer = { type: null, adjust: {prop: false, lum: 0} };

		this._createContainer(this.picker, "P");
		this._createContainer(this.slider, "S");
		this.control = new SimplePickerControls(this);
	}

	_createContainer(canvas, type) {
		var className = (type === 'P') ? 'spColor' : 'spSlider';
		var elm = document.createElement('div');
		elm.className = 'spContainer ' + className;
		canvas.parentNode.replaceChild(elm, canvas);
		elm.appendChild(canvas);

		var touchMove = function (evt) => {
			if (this.pointer.type !== type)
				return;

			if (type === 'P')
				var pos = dom.event.getRelativeCoords(evt, this.picker);
			else
				var pos = dom.event.getRelativeCoords(evt, this.slider);

			this.updateFromPointer(pos.x, pos.y);
			this._updatePointer(type, pos.x, pos.y)
		};

		var touchend = function (evt) => {
			window.removeEventListener('mousemove', touchMove);
			window.removeEventListener('touchend', touchend);
			window.removeEventListener('mouseup', touchend);

			if (this.pointer.type !== type) {
				this.pointer.type = null;
				return;
			}

			if (type === 'P')
				var pos = dom.event.getRelativeCoords(evt, this.picker);
			else
				var pos = dom.event.getRelativeCoords(evt, this.slider);

			this.updateFromPointer(pos.x, pos.y);
			this.pointer.type = null;

			this.updatePreview();
			this.control.update();
			this._updatePointer(type, pos.x, pos.y);

			if (type === 'S')
				this.drawColorPicker();

			evt.preventDefault();
		};

		var touchStart = function (evt) => {
			this.pointer.type = type;

			window.addEventListener('touchend', touchend);
			window.addEventListener('mouseup', touchend);
			window.addEventListener('mousemove', touchMove);
			evt.preventDefault();
		};

		elm.addEventListener('touchstart', touchStart);
		elm.addEventListener('mousedown', touchStart);
		elm.addEventListener('touchmove', touchMove);

		var p = document.createElement('div'), gcs, bg;
		p.className = 'pointer';
		elm.appendChild(p);

		if (type == 'P') {
			gcs = getComputedStyle(p, null);
			bg = gcs.getPropertyValue("background-color");

			// Update background-color or border, unless forced transparency
			// TODO: be smarter about this? Other options? Both?
			this.pointer.adjust.prop = 'bg';
			if (bg === "transparent" || bg.substr(0, 4) == 'rgba') {
				bg = gcs.getPropertyValue("border-color");
				this.pointer.adjust.prop = 'br';
				p.style.borderColor = bg;
			} else {
				p.style.backgroundColor = bg;
			}

			this.pointer.hsl = MV.color.Conversion.hexToHsl(bg);
			this.pointer.adjust.lum = this.pointer.hsl.luminance;

		} else {
			elm.className += this.verticalHue ? ' vertical' : ' horizontal';
			gcs = getComputedStyle(p, null);
		}

		p.style.width = gcs.getPropertyValue("width");
		p.style.height = gcs.getPropertyValue("height");

		this.pointer[type +'-w'] = parseInt(p.style.width) / 2;
		this.pointer[type + '-h'] = parseInt(p.style.height) / 2;

		gcs = getComputedStyle(canvas, null);

		// Set container dimensions to match canvas
		elm.style.width = gcs.getPropertyValue("width");
		elm.style.height = gcs.getPropertyValue("height");

		this.pointer[type + '-wmax'] = parseInt(elm.style.width);
		this.pointer[type + '-hmax'] = parseInt(elm.style.height);

		this.pointer[type] = p;
	}

	updateFromPointer(x, y) {
		//console.log('Position: ' + x + ',' + y);

		if (this.pointer.type === 'S') {
			if (this.verticalHue === true) {
				this.hsl.hue = (y / this.slider.offsetHeight) * 360;
			} else {
				this.hsl.hue = (x / this.slider.offsetWidth) * 360;
			}
		} else {
			this.hsl.saturation = (x / this.picker.offsetWidth) * 100;
			this.hsl.luminance = (y / this.picker.offsetHeight) * 100;
		}

		this.updateHSL();
		this.updatePreview();
	}

	setColor(color: MV.Color, g = null, b = null) {
		if (!(color instanceof MV.Color))
			color = new MV.Color(color, g, b);

		this.setRGB(color.red(), color.green(), color.blue());
	}

	getColor() {
		return new MV.Color(this.rgb);
	}

	setRGB(red, green, blue) {
		this.rgb.red = red;
		this.rgb.green = green;
		this.rgb.blue = blue;

		this.updateRGB();
	}

	updateRGB() {
		this.rgb.validate();
		this.hsl = MV.color.Conversion.rgbToHsl(this.rgb);
		this._oldHex = this.hex;
		this.hex = this.rgb.toColor().toHex();
	}

	setHSL(hue,saturation,luminance) {
		this.hsl.hue = hue;
		this.hsl.saturation = saturation;
		this.hsl.luminance = luminance;

		this.updateHSL();
	}

	updateHSL() {
		this.hsl.validate();
		this.rgb = MV.color.Conversion.hslToColor(this.hsl).toRGB();
		this._oldHex = this.hex;
		this.hex = this.rgb.toColor().toHex();
	}

	draw() {
		this.drawSlider(); // initialize only? remove draw()?
		this.update();
	}

	update() {
		this.drawColorPicker();

		this.updatePointerFromColor(this.hsl);
		this.updatePreview();
		this.control.update();
	}

	updatePreview() {
		this.preview.style.backgroundColor = '#'+this.hex;
	}

	drawSlider() {
		var hueContext = this.slider.getContext('2d');
		var hueGradient;

		if(this.verticalHue == true){
			hueGradient = hueContext.createLinearGradient(this.slider.offsetWidth / 2, 0, this.slider.offsetWidth / 2, this.slider.offsetHeight);
		} else {
			hueGradient = hueContext.createLinearGradient(0, this.slider.offsetHeight / 2, this.slider.offsetWidth, this.slider.offsetHeight / 2);
		}
		hueGradient.addColorStop(0,"hsl(0, 100%, 50%)");
		hueGradient.addColorStop(0.1,"hsl(36, 100%, 50%)");
		hueGradient.addColorStop(0.2,"hsl(72, 100%, 50%)");
		hueGradient.addColorStop(0.3,"hsl(108, 100%, 50%)");
		hueGradient.addColorStop(0.4,"hsl(144, 100%, 50%)");
		hueGradient.addColorStop(0.5,"hsl(180, 100%, 50%)");
		hueGradient.addColorStop(0.6,"hsl(216, 100%, 50%)");
		hueGradient.addColorStop(0.7,"hsl(252, 100%, 50%)");
		hueGradient.addColorStop(0.8,"hsl(288, 100%, 50%)");
		hueGradient.addColorStop(0.9,"hsl(324, 100%, 50%)");
		hueGradient.addColorStop(1,"hsl(360, 100%, 50%)");
		hueContext.fillStyle = hueGradient;
		hueContext.fillRect(0,0,this.slider.offsetWidth,this.slider.offsetHeight);
	}

	drawColorPicker() {
		var context = this.picker.getContext('2d');  
		var gradient;
		var step = 1/this.picker.offsetHeight;
		for(var strip = 0; strip < 1; strip+= step){
			gradient = context.createLinearGradient(0, this.picker.offsetHeight * strip, this.picker.offsetWidth, this.picker.offsetHeight * (strip + 0.10));
			gradient.addColorStop(0,"hsl(" + this.hsl.hue + ",0%," + (strip * 100) + "%)");
			gradient.addColorStop(0.5,"hsl(" + this.hsl.hue + ",50%," + (strip * 100) + "%)");
			gradient.addColorStop(1,"hsl(" + this.hsl.hue + ",100%," + (strip * 100) + "%)");
			context.fillStyle = gradient;
			context.fillRect(0, this.picker.offsetHeight * strip, this.picker.offsetWidth, this.picker.offsetHeight * step);
		}
	}

	updatePointerFromColor(hsl) {
	   var x, y;

	   x = (hsl.saturation / 100 * this.picker.offsetWidth);
	   y = (hsl.luminance / 100 * this.picker.offsetHeight);
	   this._updatePointer('P', x, y);

	   if (this.verticalHue == true) {
		   x = 0;
		   y = (hsl.hue / 360) * this.slider.offsetHeight;
	   } else {
		   x = (hsl.hue / 360) * this.slider.offsetWidth;
		   y = 0;
	   }
	   this._updatePointer('S', x, y);
	}

	_updatePointer(type, x, y) {
		var p = this.pointer[type];
		var left, top, mw, mh;

		if (type === 'S') {
			if (this.verticalHue == true) {
			   left = this.slider.offsetWidth / 2;
			   top = y;
			} else {
			   left = x;
			   top = this.slider.offsetHeight / 2;
			}
		} else {
			left = x;
			top = y;
		}

		/* Clip position around container */ 
		if (left < 0)
			left = 0;
		if (top < 0)
			top = 0;
		if (top > this.pointer[type + '-hmax'])
			top = this.pointer[type + '-hmax'];
		if (left > this.pointer[type + '-wmax'])
			left = this.pointer[type + '-wmax'];

		mw = this.pointer[type + '-w'];
		mh = this.pointer[type + '-h'];

		p.style.top = (top - mh) + 'px';
		p.style.left = (left - mw) + 'px';
		
		if (this.hex === this._oldHex) {
			return;
		}

		if (type === 'P' && this.pointer.adjust.prop) {
			var lum, sat, hue, diff, adjust;

			// Make pointer visible on dark/light background
			diff = this.pointer.hsl.luminance - this.hsl.luminance;
			if (Math.abs(diff) > 35) // difference high enough?
			   return;

			//console.log(this.pointer.adjust);
			if (diff < 0)
				adjust = Math.min(this.pointer.adjust.lum + 70, 100);
			else
				adjust = Math.max(this.pointer.adjust.lum - 70, 0);

			this.pointer.hsl.luminance = adjust;

			//console.log("ADJUST AMOUNT " + adjust);

			adjust = '#' + MV.color.Conversion.hslToHex(this.pointer.hsl);

			//console.log("ADJUST COLOR " + adjust);

			if(this.pointer.adjust.prop === 'bg')
				p.style.backgroundColor = adjust;
			else {
				p.style.borderColor = adjust;
			}	
		}

		return true;
	}
}

class SimplePickerControls {
	range: any;
	input: any;

	sp: SimplePicker;

	constructor(sp: SimplePicker) {
		this.sp = sp;
		this.range = { red: null, blue: null, green: null, hue: null, saturation: null, luminance: null };
		this.input = { rgb: null, hsl: null };
	}

	bindInputRGB(elmId) {
		this.input.rgb = document.getElementById(elmId);
		this.input.rgb.readonly = true;
	}

	bindInputHSL(elmId) {
		this.input.hsl = document.getElementById(elmId);
		this.input.hsl.readonly = true;
	}

	bindRGB(redId, greenId, blueId) {
		var me = this;

		this.range.red = document.getElementById(redId);
		this.range.red.onchange = function () {
			me.onRangeChange('red');
		}
		this.range.green = document.getElementById(greenId);
		this.range.green.onchange = function () {
			me.onRangeChange('green');
		}
		this.range.blue = document.getElementById(blueId);
		this.range.blue.onchange = function () {
			me.onRangeChange('blue');
		}
	}

	bindHSL(hueId, satId, lumId) {
		var me = this;

		this.range.hue = document.getElementById(hueId);
		this.range.hue.onchange = function () {
			me.onRangeChange('hue');
		}
		this.range.saturation = document.getElementById(satId);
		this.range.saturation.onchange = function () {
			me.onRangeChange('saturation');
		}
		this.range.luminance = document.getElementById(lumId);
		this.range.luminance.onchange = function () {
			me.onRangeChange('luminance');
		}
	}

	onRangeChange(name) {
		if (!this.range[name])
			throw new Error("Invalid control name '" + name + "'");

		var value = this.range[name].value;
		if (this._isRGB(name)) {
			this.sp.rgb[name] = value;
			this.sp.updateRGB();
		} else {
			this.sp.hsl[name] = value;
			this.sp.updateHSL();

			// redraw if hue changed
			if (name === 'hue')
				this.sp.drawColorPicker();
		}

		this.sp.updatePointerFromColor(this.sp.hsl);
		this.sp.updatePreview();
	}

	update() {
		this._updateInput();
		this._updateRange();
	}

	_isRGB(name) {
		var rgbNames = ['red', 'green', 'blue'];
		return (rgbNames.indexOf(name) === -1) ? false : true;
	}

	_updateInput() {
		if (this.input.rgb != null) {
			this.input.rgb.value = '#' + this.sp.hex;
		}
		if (this.input.hsl != null) {
			this.input.hsl.value = Math.round(this.sp.hsl.hue) + "," + Math.round(this.sp.hsl.saturation) + "%," + Math.round(this.sp.hsl.luminance) + "%";
		}
	}

	_updateRange() {
		for (var name in this.range) {
			if (this.range[name] !== null) {
				this.range[name].value = this._isRGB(name) ? this.sp.rgb[name] : this.sp.hsl[name]
			}
		}
	}

}

module dom {

	export class event {

		/** Get the coordinates of a touch or click event relative to a containing element */
		static getRelativeCoords(evt, container) {
			var rect = container.getBoundingClientRect(); // optimize this? store coords?
			if (evt.changedTouches) {
				var idx = evt.changedTouches.length - 1;

				return {
					x: evt.changedTouches[idx].clientX - rect.left,
					y: evt.changedTouches[idx].clientY - rect.top
				};
			} else {
				return {
					x: evt.clientX - rect.left,
					y: evt.clientY - rect.top
				};
			}


		}
	}
}