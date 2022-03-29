let hexInput = document.getElementById("hex");
let rgbInput = document.getElementById("rgb");
let cmykInput = document.getElementById("cmyk");
let hsvInput = document.getElementById("hsv");
let hslInput = document.getElementById("hsl");

const pickr = Pickr.create({
    el: '.pickr',
    container: '.body',
    theme: 'classic',

    components: {

        preview: true,
        opacity: false,
        hue: true,

        interaction: {
            hex: false,
            rgba: false,
            hsla: false,
            hsva: false,
            cmyk: false,
            input: false,
            clear: false,
            save: false
        }
    },

    useAsButton: false,
    showAlways: true,
    comparison: true,
    outputPrecision: 0
});

let updateColors = (hex, rgb, cmyk, hsv, hsl) => {
    document.body.style.backgroundColor = hex;
    hexInput.value = hex;
    rgbInput.value = "rgb(" + rgb + ")";
    cmykInput.value = "cmyk(" + cmyk + ")";
    hsvInput.value = "hsv(" + hsv + ")";
    hslInput.value = "hsl(" + hsl + ")";
    pickr.setColor(hex);
    valid(hexInput);
    valid(rgbInput);
    valid(cmykInput);
    valid(hsvInput);
    valid(hslInput);
}

pickr.on('init', instance => {
    let hex = instance._color.toHEXA().toString();;
    let rgb = instance._color.toRGBA().map(t => Math.round(t));
    rgb.pop();
    let cmyk = instance._color.toCMYK().map(t => Math.round(t));
    let hsv = instance._color.toHSVA().map(t => Math.round(t));
    hsv.pop();
    let hsl = instance._color.toHSLA().map(t => Math.round(t));
    hsl.pop();
    updateColors(hex, rgb, cmyk, hsv, hsl);
}).on('change', instance => {
    debugger;
    console.log(instance)
    let hex = instance.toHEXA().toString();;
    let rgb = instance.toRGBA().map(t => Math.round(t));
    rgb.pop();
    let cmyk = instance.toCMYK().map(t => Math.round(t));
    let hsv = instance.toHSVA().map(t => Math.round(t));
    hsv.pop();
    let hsl = instance.toHSLA().map(t => Math.round(t));
    hsl.pop();
    updateColors(hex, rgb, cmyk, hsv, hsl);
});

function valid(element) {
    element.style.color = "#202040";
}

function invalid(element, otherElements) {
    element.style.color = "#f04624";
    otherElements.forEach(elem => elem.value = 0);
}


function fromHex() {
    let hexCode = hexInput.value;
    let rgbArr = [];
    if (/^#?[A-Fa-f0-9]{6}$/.test(hexCode)) {
        valid(hexInput);
        hexCode = hexCode.split("#")[1] || hexCode;
        for (let i = 0; i < hexCode.length; i += 2) {
            rgbArr.push(parseInt(hexCode[i] + hexCode[i + 1], 16));
        }
        updateColors(hexCode);
    } else {
        invalid(hexInput, [rgbInput, cmykInput, hsvInput, hslInput]);
    }
}

function fromRgb() {
    let rgbCode = rgbInput.value;
    let rgbRegex1 = /^rgb\([0-9]{1,3},[0-9]{1,3},[0-9]{1,3}\)$/;
    let rgbRegex2 = /^[0-9]{1,3},[0-9]{1,3},[0-9]{1,3}$/
    let hex = "#";
    if (rgbRegex1.test(rgbCode) || rgbRegex2.test(rgbCode)) {
        rgbCode = rgbCode.replace(/[rgb()]+/g, "") || rgbCode;
        rgbCode = rgbCode.split(",");
        let condition = rgbCode.every((value) => {
            return parseInt(value) <= 255;
        });
        if (condition) {
            valid(rgbInput);
            rgbCode.forEach(value => {
                value = parseInt(value).toString(16);
                hex += value.length == 1 ? "0" + value : value;
            });
            updateColors(hex);
        } else {
            invalid(rgbInput, [hexInput, cmykInput, hsvInput, hslInput]);
        }
    } else {
        invalid(rgbInput, [hexInput, cmykInput, hsvInput, hslInput]);
    }
}

function fromCmyk() {
    let cmykCode = cmykInput.value;
    let cmukRegex1 = /^cmyk\([0-9]{1,3},[0-9]{1,3},[0-9]{1,3},[0-9]{1,3}\)$/;
    let cmykRegex2 = /^[0-9]{1,3},[0-9]{1,3},[0-9]{1,3},[0-9]{1,3}$/
    if (cmukRegex1.test(cmykCode) || cmykRegex2.test(cmykCode)) {
        cmykCode = cmykCode.replace(/[cmyk()]+/g, "") || cmykCode;
        cmykCode = cmykCode.split(",");
        let condition = cmykCode.every((value) => {
            return parseInt(value) <= 255;
        });
        if (condition) {
            valid(cmykInput);
            let hex = cmykToHex(...cmykCode.map(t => Number(t)))
            updateColors(hex);
        } else {
            invalid(cmykInput, [hexInput, rgbkInput, hsvInput, hslInput]);
        }
    } else {
        invalid(cmykInput, [hexInput, rgbInput, hsvInput, hslInput]);
    }
}

function fromHsv() {
    let hsvCode = hsvInput.value;
    let hsvRegex1 = /^hsv\([0-9]{1,3},[0-9]{1,3},[0-9]{1,3}\)$/;
    let hsvRegex2 = /^[0-9]{1,3},[0-9]{1,3},[0-9]{1,3}$/
    if (hsvRegex1.test(hsvCode) || hsvRegex2.test(hsvCode)) {
        hsvCode = hsvCode.replace(/[hsv()]+/g, "") || hsvCode;
        hsvCode = hsvCode.split(",");
        let condition = hsvCode.every((value) => {
            return parseInt(value) <= 360;
        });
        if (condition) {
            valid(hsvInput);
            updateColors(hsvToHex(...hsvCode.map(t => Number(t))));
        } else {
            invalid(hsvInput, [hexInput, cmykInput, rgbInput, hslInput]);
        }
    } else {
        invalid(hsvInput, [hexInput, cmykInput, rgbInput, hslInput]);
    }
}

function fromHsl() {
    let hslCode = hslInput.value;
    let hslRegex1 = /^hsl\([0-9]{1,3},[0-9]{1,3},[0-9]{1,3}\)$/;
    let hslRegex2 = /^[0-9]{1,3},[0-9]{1,3},[0-9]{1,3}$/
    if (hslRegex1.test(hslCode) || hslRegex2.test(hslCode)) {
        hslCode = hslCode.replace(/[hsl()]+/g, "") || hslCode;
        hslCode = hslCode.split(",");
        let condition = hslCode.every((value) => {
            return parseInt(value) <= 360;
        });
        if (condition) {
            valid(hslInput);
            updateColors(hslToHex(...hslCode.map(t => Number(t))));
        } else {
            invalid(hslInput, [hexInput, cmykInput, rgbInput, hsvInput]);
        }
    } else {
        invalid(hslInput, [hexInput, cmykInput, rgbInput, hsvInput]);
    }
}

function cmykToHex(c, m, y, k) {
    var hex,
        rgb;
    rgb = cmyk2rgb(c, m, y, k);
    hex = rgbToHex(rgb.r, rgb.g, rgb.b);
    return hex;
}

var cmyk2rgb = function(c, m, y, k, normalized = false) {
    c = (c / 100);
    m = (m / 100);
    y = (y / 100);
    k = (k / 100);

    c = c * (1 - k) + k;
    m = m * (1 - k) + k;
    y = y * (1 - k) + k;

    var r = 1 - c;
    var g = 1 - m;
    var b = 1 - y;

    if (!normalized) {
        r = Math.round(255 * r);
        g = Math.round(255 * g);
        b = Math.round(255 * b);
    }

    return {
        r: r,
        g: g,
        b: b
    }
}

function rgbToHex(r, g, b) {
    return "#" + componentToHex(r) + componentToHex(g) + componentToHex(b);

    function componentToHex(c) {
        var hex = c.toString(16);
        return hex.length === 1 ? "0" + hex : hex;
    }
}

const hsvToHex = (h, s, v) => {
    const rgb = HSVtoRGB(h / 360, s / 100, v / 100);
    return rgbToHex(rgb.r, rgb.g, rgb.b);
}

const hslToHex = (h, s, l) => {
    debugger;
    const rgb = HSLToRGB(h, s, l);
    return rgbToHex(...rgb);
}

function HSVtoRGB(h, s, v) {
    var r, g, b, i, f, p, q, t;
    if (arguments.length === 1) {
        s = h.s, v = h.v, h = h.h;
    }
    i = Math.floor(h * 6);
    f = h * 6 - i;
    p = v * (1 - s);
    q = v * (1 - f * s);
    t = v * (1 - (1 - f) * s);
    switch (i % 6) {
        case 0:
            r = v, g = t, b = p;
            break;
        case 1:
            r = q, g = v, b = p;
            break;
        case 2:
            r = p, g = v, b = t;
            break;
        case 3:
            r = p, g = q, b = v;
            break;
        case 4:
            r = t, g = p, b = v;
            break;
        case 5:
            r = v, g = p, b = q;
            break;
    }
    return {
        r: Math.round(r * 255),
        g: Math.round(g * 255),
        b: Math.round(b * 255)
    };
}

function HSLToRGB(h, s, l) {
    s /= 100;
    l /= 100;

    let c = (1 - Math.abs(2 * l - 1)) * s,
        x = c * (1 - Math.abs((h / 60) % 2 - 1)),
        m = l - c / 2,
        r = 0,
        g = 0,
        b = 0;

    if (0 <= h && h < 60) {
        r = c;
        g = x;
        b = 0;
    } else if (60 <= h && h < 120) {
        r = x;
        g = c;
        b = 0;
    } else if (120 <= h && h < 180) {
        r = 0;
        g = c;
        b = x;
    } else if (180 <= h && h < 240) {
        r = 0;
        g = x;
        b = c;
    } else if (240 <= h && h < 300) {
        r = x;
        g = 0;
        b = c;
    } else if (300 <= h && h < 360) {
        r = c;
        g = 0;
        b = x;
    }
    r = Math.round((r + m) * 255);
    g = Math.round((g + m) * 255);
    b = Math.round((b + m) * 255);

    return [r, g, b];
}