/**
 * Licensed under the new BSD license
 *
 * More information about this license can be found on the world-wide-web at this URL:
 * {@link http://www.openmv.com/license}
 *
 * If you are unable to obtain it through the world-wide-web, please send an email
 * to {@link mailto:legal@gdesolutions.com legal@gdesolutions.com} so we can send you a copy immediately.
 *
 * @category   MV Framework
 * @package    misc.color
 * @copyright  Copyright (c) 2013 Goldeneye Solutions Inc (gdesolutions.com)
 * @license    http://www.openmv.com/license  New BSD License
 * @version    $Id: loader.php 671 2013-05-13 12:45:38Z jbondc $
 * @filesource
 */

module MV {
	export class Color {

		_rgb: color.RGB;

		constructor(r: any = 0, g = null, b = null) {
			if (typeof r === 'string' && r.length && g == null) {
				r = r.trim();

				if (r[0] === '#' || !isNaN(parseInt(r)))
					this._rgb = color.Conversion.hexToRgb(r.substr(0, 7));
				else
					this._rgb = color.Conversion.textToRgb(r, 'en');
			} else {
				if (r instanceof color.RGB)
					this._rgb = r;
				else
					this._rgb = new color.RGB(r, g, b);
			}
		}

		getRGB() {
			return this._rgb;
		}

		red() {
			return this._rgb.red;
		}

		green() {
			return this._rgb.green;
		}

		blue() {
			return this._rgb.blue;
		}

		toRGB() {
			// clone? not reference
			return this._rgb;
		}

		toHSL() {
			return color.Conversion.rgbToHsl(this._rgb);
		}

		toHex() {
			return color.Conversion.rgbToHex(this._rgb);
		}

		toText() {
			return color.Conversion.hexToText(this.toHex());
		}

		toString() {
			return this.toHex();
		}
	}
}

module MV.color {
	export class RGB {

		red: number = 0;
		green: number = 0;
		blue: number = 0;

		constructor(r:any = 0, g = 0, b = 0) {
			if (typeof r === 'array') {
				r = r[0];
				g = r[1];
				b = r[2];
			}

			this.red = Number(r);
			this.green = Number(g);
			this.blue = Number(b);
		}

		validate() {
			var props = ['red', 'green', 'blue'];
			var name, val;
			for(var i in props) {
				name = props[i];
				val = this[name];
				if (val < 0)
					this[name] = 0;
				else if (val > 255)
					this[name] = 255;
			}
		}

		toArray() {
			return [this.red, this.green, this.blue];
		}

		toColor() {
			return new Color(this.red, this.green, this.blue);
		}

		toString() {
			return "RGB(" + this.red + "," + this.green + "," + this.blue + ")";
		}
	}

	export class HSL {

		hue: number = 0;
		saturation: number = 0;
		luminance: number = 0;

		constructor(h:any = 0, s = 0, l = 0) {
			if (typeof h === 'array' && h.length === 3) {
				l = h[2];
				s = h[1];
				h = h[0];
			}

			this.hue = Number(h);
			this.saturation = Number(s);
			this.luminance = Number(l);
		}

		validate() {
			var props = ['hue', 'saturation', 'luminance'];
			var name, val;
			for (var i in props) {
				name = props[i];
				val = this[name];
				if (val < 0)
					this[name] = 0;

				if (name === 'hue') {
					if(val > 360)
						this[name] = 360;
				} else if (val > 100) {
					this[name] = 100;
				}
			}
		}

		getHue(scale = 360) {
			return scale == 360 ? this.hue : Math.ceil(this.hue / 360 * scale);
		}

		setHue(h) {
			if(h < 0)
				this.hue = h + 360;
			else if(h > 360)
				this.hue = h - 360;
			else
				this.hue = h;
		}

		getLuminance(scale = 100) {
			return scale == 100 ? this.luminance : Math.ceil(this.luminance / 100 * scale);
		}

		getSaturation(scale = 100) {
			return scale == 100 ? this.saturation : Math.ceil(this.saturation / 100 * scale);
		}

		toArray() {
			return [this.hue, this.saturation, this.luminance];
		}

		toColor() {
			return Conversion.hslToColor(this);
		}

		toString() {
			return "HSL(" + this.hue + "," + this.saturation + "," + this.luminance + ")";
		}
	}

	export class XYZ {

		x: number = 0;
		y: number = 0;
		z: number = 0;

		constructor(x: any = 0, y = 0, z = 0) {
			if (typeof x === 'array' && x.length === 3) {
				z = x[2];
				y = x[1];
				x = x[0];
			}

			this.x = Number(x);
			this.y = Number(y);
			this.z = Number(z);
		}

		toString() {
			return "XYZ(" + this.x + "," + this.y + "," + this.z + ")";
		}
	}

	export class Conversion {
		static textToRgb(r: string, culture = null) {
			return new RGB(0); // Use CCS3 pallette, import dynamically?
		}
		static hexToText(hex: string) {
			return '';
		}

		static hexToRgb(color) {
			var c = (color && color[0] === '#') ? color.substr(1) : color;
			var arr = [];

			if(c.length === 6)
				arr = [c[0]+c[1], c[2]+c[3], c[4]+c[5]];
			else if(c.length === 3)
				arr = [c[0]+c[0], c[1]+c[1], c[2]+c[2]];
			else
				arr = [0, 0, 0];

			return new RGB(parseInt(arr[0], 16), parseInt(arr[1], 16), parseInt(arr[2], 16));
		}

		static hexToHsl(color: any) {
			return rgbToHsl(hexToRgb(color));
		}

		static rgbToHex(r, g = null, b = null) {
			if (!(r instanceof color.RGB))
				r = new color.RGB(r, g, b);

			var hex = ((r.red << 16) | (r.green << 8) | r.blue).toString(16);
			while (hex.length < 6) hex = "0" + hex;
			return hex;
		}

		static rgbToHsl(r, g = null, b = null) {
			if (!(r instanceof color.RGB))
				r = new color.RGB(r, g, b);

			// Convert the RBG values to the range 0-1
			var R = r.red / 255;
			var G = r.green / 255;
			var B = r.blue / 255;
			var RGB = [R, G, B];

			var min, max, delta, H, S, L;

			// Find min and max values of R, B, G
			RGB.sort();
			min = RGB[0];
			max = RGB[2];
			delta = max - min;
			L = (max + min) / 2;

			if(delta == 0) {
				H = null;
				S = 0;
			} else {
				if (L < 0.5)
					S = delta / (max + min);
				else
					S = delta / (2 - max - min);

				switch (max) {
					case R: H = (G - B) / delta; break;
					case G: H = 2.0 + (B - R) / delta; break;
					case B: H = 4.0 + (R - G) / delta; break;
				}

				H = H * 60.0;
				if(H < 0)
					H = H + 360;
			}

			return new color.HSL(H, S * 100, L * 100);
		}

		static hslToColor(h, s = null, l = null) {
			var arr = _hslRgb(h, s, l);
			return new Color(arr[0], arr[1], arr[2]);
		}

		static hslToHex(h, s = null, l = null) {
			var arr = _hslRgb(h, s, l);
			return rgbToHex(arr[0], arr[1], arr[2]);
		}

		static rgbToXYZ(r, g = null, b = null) {
			if (!(r instanceof color.RGB))
				r = new color.RGB(r, g, b);

			var R = (r.red / 255);
			var G = (r.green / 255);
			var B = (r.blue / 255);

			if (R > 0.04045)
				R = ((R + 0.055) / 1.055) ^ 2.4;
			else
				R = R / 12.92;

			if (G > 0.04045)
				G = ((G + 0.055) / 1.055) ^ 2.4;
			else
				G = G / 12.92;

			if (B > 0.04045)
				B = ((B + 0.055) / 1.055) ^ 2.4;
			else
				B = B / 12.92;

			R *= 100;
			G *= 100;
			B *= 100;

			return new color.XYZ(
				R * 0.4124 + G * 0.3576 + B * 0.1805,
				R * 0.2126 + G * 0.7152 + B * 0.0722,
				R * 0.0193 + G * 0.1192 + B * 0.9505
			);
		}

		/*
		static xyzToCIE(x, y = null, z = null) {
var_X = X / ref_X          //ref_X =  95.047   Observer= 2°, Illuminant= D65
var_Y = Y / ref_Y          //ref_Y = 100.000
var_Z = Z / ref_Z          //ref_Z = 108.883

if ( var_X > 0.008856 ) var_X = var_X ^ ( 1/3 )
else                    var_X = ( 7.787 * var_X ) + ( 16 / 116 )
if ( var_Y > 0.008856 ) var_Y = var_Y ^ ( 1/3 )
else                    var_Y = ( 7.787 * var_Y ) + ( 16 / 116 )
if ( var_Z > 0.008856 ) var_Z = var_Z ^ ( 1/3 )
else                    var_Z = ( 7.787 * var_Z ) + ( 16 / 116 )

CIE-L* = ( 116 * var_Y ) - 16
CIE-a* = 500 * ( var_X - var_Y )
CIE-b* = 200 * ( var_Y - var_Z )
	*/
		static _hslRgb(h, s = null, l = null) {
			if (!(h instanceof color.HSL))
				h = new color.HSL(h, s, l);

			var H = h.hue / 360;
			var S = h.saturation / 100;
			var L = h.luminance / 100;

			var R, G, B, t1, t2, t3;

			if (S == 0) {
				R = L * 255;
				G = L * 255;
				B = L * 255;
			} else {
				if (L < 0.5)
					t2 = L * (1 + S);
				else
					t2 = (L + S) - (S * L);

				t1 = (2 * L) - t2;

				R = 255 * this._hue2RGB(t1, t2, H + (1 / 3));
				G = 255 * this._hue2RGB(t1, t2, H);
				B = 255 * this._hue2RGB(t1, t2, H - (1 / 3));
			}

			return [R, G, B];
		}

		static _hue2RGB(t1, t2, t3) {
			if (t3 < 0)
				t3 += 1;
			else if(t3 > 1)
				t3 -= 1;

			if (6.0 * t3 < 1)
				return t1 + (t2 - t1) * 6.0 * t3;

			if (2.0 * t3 < 1)
				return t2;

			if (3.0 * t3 < 2)
				return t1 + (t2 - t1) * ((2.0 / 3.0) - t3) * 6.0;

			return t1;
		}

	}
}