var MV;
(function (MV) {
    var Color = (function () {
        function Color(r, g, b) {
            if (typeof r === "undefined") { r = 0; }
            if (typeof g === "undefined") { g = null; }
            if (typeof b === "undefined") { b = null; }
            if(typeof r === 'string' && r.length && g == null) {
                r = r.trim();
                if(r[0] === '#' || !isNaN(parseInt(r))) {
                    this._rgb = MV.color.Conversion.hexToRgb(r.substr(0, 7));
                } else {
                    this._rgb = MV.color.Conversion.textToRgb(r, 'en');
                }
            } else {
                if(r instanceof MV.color.RGB) {
                    this._rgb = r;
                } else {
                    this._rgb = new MV.color.RGB(r, g, b);
                }
            }
        }
        Color.prototype.getRGB = function () {
            return this._rgb;
        };
        Color.prototype.red = function () {
            return this._rgb.red;
        };
        Color.prototype.green = function () {
            return this._rgb.green;
        };
        Color.prototype.blue = function () {
            return this._rgb.blue;
        };
        Color.prototype.toRGB = function () {
            return this._rgb;
        };
        Color.prototype.toHSL = function () {
            return MV.color.Conversion.rgbToHsl(this._rgb);
        };
        Color.prototype.toHex = function () {
            return MV.color.Conversion.rgbToHex(this._rgb);
        };
        Color.prototype.toText = function () {
            return MV.color.Conversion.hexToText(this.toHex());
        };
        Color.prototype.toString = function () {
            return this.toHex();
        };
        return Color;
    })();
    MV.Color = Color;    
})(MV || (MV = {}));
var MV;
(function (MV) {
    (function (color) {
        var RGB = (function () {
            function RGB(r, g, b) {
                if (typeof r === "undefined") { r = 0; }
                if (typeof g === "undefined") { g = 0; }
                if (typeof b === "undefined") { b = 0; }
                this.red = 0;
                this.green = 0;
                this.blue = 0;
                if(typeof r === 'array') {
                    r = r[0];
                    g = r[1];
                    b = r[2];
                }
                this.red = Number(r);
                this.green = Number(g);
                this.blue = Number(b);
            }
            RGB.prototype.validate = function () {
                var props = [
                    'red', 
                    'green', 
                    'blue'
                ];
                var name, val;
                for(var i in props) {
                    name = props[i];
                    val = this[name];
                    if(val < 0) {
                        this[name] = 0;
                    } else if(val > 255) {
                        this[name] = 255;
                    }
                }
            };
            RGB.prototype.toArray = function () {
                return [
                    this.red, 
                    this.green, 
                    this.blue
                ];
            };
            RGB.prototype.toColor = function () {
                return new MV.Color(this.red, this.green, this.blue);
            };
            RGB.prototype.toString = function () {
                return "RGB(" + this.red + "," + this.green + "," + this.blue + ")";
            };
            return RGB;
        })();
        color.RGB = RGB;        
        var HSL = (function () {
            function HSL(h, s, l) {
                if (typeof h === "undefined") { h = 0; }
                if (typeof s === "undefined") { s = 0; }
                if (typeof l === "undefined") { l = 0; }
                this.hue = 0;
                this.saturation = 0;
                this.luminance = 0;
                if(typeof h === 'array' && h.length === 3) {
                    l = h[2];
                    s = h[1];
                    h = h[0];
                }
                this.hue = Number(h);
                this.saturation = Number(s);
                this.luminance = Number(l);
            }
            HSL.prototype.validate = function () {
                var props = [
                    'hue', 
                    'saturation', 
                    'luminance'
                ];
                var name, val;
                for(var i in props) {
                    name = props[i];
                    val = this[name];
                    if(val < 0) {
                        this[name] = 0;
                    }
                    if(name === 'hue') {
                        if(val > 360) {
                            this[name] = 360;
                        }
                    } else if(val > 100) {
                        this[name] = 100;
                    }
                }
            };
            HSL.prototype.getHue = function (scale) {
                if (typeof scale === "undefined") { scale = 360; }
                return scale == 360 ? this.hue : Math.ceil(this.hue / 360 * scale);
            };
            HSL.prototype.setHue = function (h) {
                if(h < 0) {
                    this.hue = h + 360;
                } else if(h > 360) {
                    this.hue = h - 360;
                } else {
                    this.hue = h;
                }
            };
            HSL.prototype.getLuminance = function (scale) {
                if (typeof scale === "undefined") { scale = 100; }
                return scale == 100 ? this.luminance : Math.ceil(this.luminance / 100 * scale);
            };
            HSL.prototype.getSaturation = function (scale) {
                if (typeof scale === "undefined") { scale = 100; }
                return scale == 100 ? this.saturation : Math.ceil(this.saturation / 100 * scale);
            };
            HSL.prototype.toArray = function () {
                return [
                    this.hue, 
                    this.saturation, 
                    this.luminance
                ];
            };
            HSL.prototype.toColor = function () {
                return Conversion.hslToColor(this);
            };
            HSL.prototype.toString = function () {
                return "HSL(" + this.hue + "," + this.saturation + "," + this.luminance + ")";
            };
            return HSL;
        })();
        color.HSL = HSL;        
        var XYZ = (function () {
            function XYZ(x, y, z) {
                if (typeof x === "undefined") { x = 0; }
                if (typeof y === "undefined") { y = 0; }
                if (typeof z === "undefined") { z = 0; }
                this.x = 0;
                this.y = 0;
                this.z = 0;
                if(typeof x === 'array' && x.length === 3) {
                    z = x[2];
                    y = x[1];
                    x = x[0];
                }
                this.x = Number(x);
                this.y = Number(y);
                this.z = Number(z);
            }
            XYZ.prototype.toString = function () {
                return "XYZ(" + this.x + "," + this.y + "," + this.z + ")";
            };
            return XYZ;
        })();
        color.XYZ = XYZ;        
        var Conversion = (function () {
            function Conversion() { }
            Conversion.textToRgb = function textToRgb(r, culture) {
                if (typeof culture === "undefined") { culture = null; }
                return new RGB(0);
            };
            Conversion.hexToText = function hexToText(hex) {
                return '';
            };
            Conversion.hexToRgb = function hexToRgb(color) {
                var c = (color && color[0] === '#') ? color.substr(1) : color;
                var arr = [];
                if(c.length === 6) {
                    arr = [
                        c[0] + c[1], 
                        c[2] + c[3], 
                        c[4] + c[5]
                    ];
                } else if(c.length === 3) {
                    arr = [
                        c[0] + c[0], 
                        c[1] + c[1], 
                        c[2] + c[2]
                    ];
                } else {
                    arr = [
                        0, 
                        0, 
                        0
                    ];
                }
                return new RGB(parseInt(arr[0], 16), parseInt(arr[1], 16), parseInt(arr[2], 16));
            };
            Conversion.hexToHsl = function hexToHsl(color) {
                return Conversion.rgbToHsl(Conversion.hexToRgb(color));
            };
            Conversion.rgbToHex = function rgbToHex(r, g, b) {
                if (typeof g === "undefined") { g = null; }
                if (typeof b === "undefined") { b = null; }
                if(!(r instanceof color.RGB)) {
                    r = new color.RGB(r, g, b);
                }
                var hex = ((r.red << 16) | (r.green << 8) | r.blue).toString(16);
                while(hex.length < 6) {
                    hex = "0" + hex;
                }
                return hex;
            };
            Conversion.rgbToHsl = function rgbToHsl(r, g, b) {
                if (typeof g === "undefined") { g = null; }
                if (typeof b === "undefined") { b = null; }
                if(!(r instanceof color.RGB)) {
                    r = new color.RGB(r, g, b);
                }
                var R = r.red / 255;
                var G = r.green / 255;
                var B = r.blue / 255;
                var RGB = [
                    R, 
                    G, 
                    B
                ];
                var min, max, delta, H, S, L;
                RGB.sort();
                min = RGB[0];
                max = RGB[2];
                delta = max - min;
                L = (max + min) / 2;
                if(delta == 0) {
                    H = null;
                    S = 0;
                } else {
                    if(L < 0.5) {
                        S = delta / (max + min);
                    } else {
                        S = delta / (2 - max - min);
                    }
                    switch(max) {
                        case R:
                            H = (G - B) / delta;
                            break;
                        case G:
                            H = 2.0 + (B - R) / delta;
                            break;
                        case B:
                            H = 4.0 + (R - G) / delta;
                            break;
                    }
                    H = H * 60.0;
                    if(H < 0) {
                        H = H + 360;
                    }
                }
                return new color.HSL(H, S * 100, L * 100);
            };
            Conversion.hslToColor = function hslToColor(h, s, l) {
                if (typeof s === "undefined") { s = null; }
                if (typeof l === "undefined") { l = null; }
                var arr = Conversion._hslRgb(h, s, l);
                return new MV.Color(arr[0], arr[1], arr[2]);
            };
            Conversion.hslToHex = function hslToHex(h, s, l) {
                if (typeof s === "undefined") { s = null; }
                if (typeof l === "undefined") { l = null; }
                var arr = Conversion._hslRgb(h, s, l);
                return Conversion.rgbToHex(arr[0], arr[1], arr[2]);
            };
            Conversion.rgbToXYZ = function rgbToXYZ(r, g, b) {
                if (typeof g === "undefined") { g = null; }
                if (typeof b === "undefined") { b = null; }
                if(!(r instanceof color.RGB)) {
                    r = new color.RGB(r, g, b);
                }
                var R = (r.red / 255);
                var G = (r.green / 255);
                var B = (r.blue / 255);
                if(R > 0.04045) {
                    R = ((R + 0.055) / 1.055) ^ 2.4;
                } else {
                    R = R / 12.92;
                }
                if(G > 0.04045) {
                    G = ((G + 0.055) / 1.055) ^ 2.4;
                } else {
                    G = G / 12.92;
                }
                if(B > 0.04045) {
                    B = ((B + 0.055) / 1.055) ^ 2.4;
                } else {
                    B = B / 12.92;
                }
                R *= 100;
                G *= 100;
                B *= 100;
                return new color.XYZ(R * 0.4124 + G * 0.3576 + B * 0.1805, R * 0.2126 + G * 0.7152 + B * 0.0722, R * 0.0193 + G * 0.1192 + B * 0.9505);
            };
            Conversion._hslRgb = function _hslRgb(h, s, l) {
                if (typeof s === "undefined") { s = null; }
                if (typeof l === "undefined") { l = null; }
                if(!(h instanceof color.HSL)) {
                    h = new color.HSL(h, s, l);
                }
                var H = h.hue / 360;
                var S = h.saturation / 100;
                var L = h.luminance / 100;
                var R, G, B, t1, t2, t3;
                if(S == 0) {
                    R = L * 255;
                    G = L * 255;
                    B = L * 255;
                } else {
                    if(L < 0.5) {
                        t2 = L * (1 + S);
                    } else {
                        t2 = (L + S) - (S * L);
                    }
                    t1 = (2 * L) - t2;
                    R = 255 * this._hue2RGB(t1, t2, H + (1 / 3));
                    G = 255 * this._hue2RGB(t1, t2, H);
                    B = 255 * this._hue2RGB(t1, t2, H - (1 / 3));
                }
                return [
                    R, 
                    G, 
                    B
                ];
            };
            Conversion._hue2RGB = function _hue2RGB(t1, t2, t3) {
                if(t3 < 0) {
                    t3 += 1;
                } else if(t3 > 1) {
                    t3 -= 1;
                }
                if(6.0 * t3 < 1) {
                    return t1 + (t2 - t1) * 6.0 * t3;
                }
                if(2.0 * t3 < 1) {
                    return t2;
                }
                if(3.0 * t3 < 2) {
                    return t1 + (t2 - t1) * ((2.0 / 3.0) - t3) * 6.0;
                }
                return t1;
            };
            return Conversion;
        })();
        color.Conversion = Conversion;        
    })(MV.color || (MV.color = {}));
    var color = MV.color;
})(MV || (MV = {}));
