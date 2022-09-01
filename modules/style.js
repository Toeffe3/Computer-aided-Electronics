/**
 * Class to control HTML5 canvas context styling
 * @class Style
 * @property {StyleFill} [fill]
 * @property {StyleStroke} [stroke]
 * @property {StyleShadow} [shadow]
 * @property {StyleText} [text]
 * @property {gradientList} [gradientList]
 * @property {number} [globalAlpha=1]
 * @property {"source-over"|"source-in"|"source-out"|"source-atop"|"destination-over"|"destination-in"|"destination-out"|"destination-atop"|"lighter"|"copy"|"xor"} [globalCompositeOperation="source-over"]
 */
 export default class Style {
	/**
	 * Creates a new style object
	 * @returns {Style} this
	 */
	constructor() {
		this.fill = {
			/** @type {string|CanvasGradient|CanvasPattern} */
			color: "#00000000",
		}
		this.stroke = {
			/** @type {string|CanvasGradient|CanvasPattern} */
			color: "#00000000",
			width: 1
		}
		this.shadow = {
			blur: 0,
			color: "#00000000",
			offsetX: 0,
			offsetY: 0
		};
		this.text = {
			/** @type {number} */
			size: 10,
			/** @type {string} */
			family: "Arial",
			/** @type {"center"|"left"|"right"} */
			align: "center",
			/** @type {"middle"|"top"|"bottom"} */
			baseline: "middle",
			/** @type {"left"|"right"|"inherit"} */
			direction: "inherit",
			/** @type {"normal"|"italic"|"oblique"} */
			style: "normal",
			/** @type {"normal"|"bold"|"bolder"|"lighter"|"100"|"200"|"300"|"400"|"500"|"600"|"700"|"800"|"900"} */
			weight: "normal",
		}
		/** @type {gradientList} */
		this.gradients = {
		}
		this.globalAlpha = 1;
		this.globalCompositeOperation = "source-over";

		return this;
	}

	/**
	 * Greate a gradient
	 * @param {string} name - the name of the gradient
	 * @param {"linear"|"conic"|"radial"} type - the type of the gradient
	 * @param {number} x0 - the x coordinate of the start point
	 * @param {number} y0 - the y coordinate of the start point
	 * @param {number} x1 - the x coordinate of the end point
	 * @param {number} y1 - the y coordinate of the end point
	 * @param {...{offset: number, color: string}} stops - the stops of the gradient
	 * @returns {Style} this
	 * @example
	 * style.createGradient("gradient", "linear", 0, 0, 100, 100, [0, "#000000FF"], [1, "#FFFFFFFF"]);
	 */
	createGradient(name, type, x0, y0, x1, y1, ...stops) {
		const ctx = document.createElement("canvas").getContext("2d");
		switch(type) {
			case "linear":
				this.gradients[name] = ctx.createLinearGradient(x0, y0, x1, y1);
				break;
			case "conic":
				this.gradients[name] = ctx.createConicGradient(x0, y0, x1);
				break;
			case "radial":
				this.gradients[name] = ctx.createRadialGradient(x0, y0, x1, y1, x1, y1);
				break;
			default:
				return new Error("invalid gradient type: " + type);
		}
		stops.forEach(stop => this.gradients[name].addColorStop(stop.offset, stop.color));
		return this;
	}

	/**
	 * Set the fill color
	 * @param {string|CanvasGradient} color - the color to set
	 * @param {boolean} [gradientName=false] - if the colorstring is a gradient, the name of the gradient
	 * @returns {Style} this
	 * @example
	 * style.setFill("#000000FF");
	 * style.setFill("rainbow", true); // rainbow is created with style.createGradient()
	 */
	setFill(color, gradientName = false) {
		this.fill.color = gradientName ? this.gradients[color] : color;
		return this;
	}

	/**
	 * Unset fill
	 * @returns {Style} this
	 */
	noFill() {
		this.fill.color = "#00000000";
		return this;
	}

	/**
	 * Set the stroke color
	 * @
	 * @param {string|CanvasGradient} color - the color to set
	 * @param {boolean|number} [gradientName=false] - if the color is a gradient, the name of the gradient
	 * @param {number} [width=1] - the stroke width
	 * @returns {Style} this
	 * @example
	 * style.setStroke("#000000FF");
	 * style.setStroke("rainbow", true); // rainbow is created with style.createGradient()
	 * style.setStroke("#000000FF", 2);
	 * style.setStroke("rainbow", true, 2); // rainbow is created with style.createGradient()
	 */
	setStroke(color, gradientName = false, width = 1) {
		if(typeof gradientName === "number") {
			width = gradientName;
			gradientName = false;
		}
		this.stroke.color = gradientName ? this.gradients[color] : color;
		this.stroke.width = width;
		return this;
	}

	/**
	 * Unset stroke
	 * @returns {Style} this
	 */
	noStroke() {
		this.stroke.color = "#00000000";
		return this;
	}

	/**
	 * Set the shadow
	 * @param {number} blur - the blur of the shadow
	 * @param {string} color - the color of the shadow
	 * @param {number} offsetX - the x offset of the shadow
	 * @param {number} offsetY - the y offset of the shadow
	 * @returns {Style} this
	 */
	setShadow(blur, color, offsetX, offsetY) {
		this.shadow.blur = blur;
		this.shadow.color = color;
		this.shadow.offsetX = offsetX;
		this.shadow.offsetY = offsetY;
		return this;
	}

	/**
	 * Set the global alpha
	 * @param {number} alpha - the alpha value
	 * @returns {Style} this
	 * @example
	 * style.setGlobalAlpha(0.5);
	 */
	setGlobalAlpha(alpha) {
		this.globalAlpha = alpha;
		return this;
	}

	/**
	 * Set the global composite operation
	 * @param {"source-over"|"source-in"|"source-out"|"source-atop"|"destination-over"|"destination-in"|"destination-out"|"destination-atop"|"lighter"|"copy"|"xor"} operation - the operation
	 * @returns {Style} this
	 * @example style.setGlobalCompositeOperation("source-over");
	 */
	setGlobalCompositeOperation(operation) {
		this.globalCompositeOperation = operation;
		return this;
	}

	/**
	 * Apply the style to the context
	 * @param {CanvasRenderingContext2D} ctx - the context to apply the style to
	 * @returns {CanvasRenderingContext2D} the context
	 */
	apply(ctx) {
		ctx.fillStyle = this.fill.color;
		ctx.strokeStyle = this.stroke.color;
		ctx.lineWidth = this.stroke.width;
		ctx.shadowBlur = this.shadow.blur;
		ctx.shadowColor = this.shadow.color;
		ctx.shadowOffsetX = this.shadow.offsetX;
		ctx.shadowOffsetY = this.shadow.offsetY;
		ctx.globalAlpha = this.globalAlpha;
		ctx.globalCompositeOperation = this.globalCompositeOperation;
		ctx.font = this.text.size + "px " + this.text.family;
		ctx.textAlign = this.text.align;
		ctx.textBaseline = this.text.baseline;
		ctx.direction = this.text.direction;
		return ctx;
	}

	/**
	 * Set the text style
	 * @param {number} [size=10] - the text size
	 * @param {string} [family="Arial"] - the text family
	 * @param {string} [align="center"] - the text align
	 * @param {string} [baseline="middle"] - the text baseline
	 * @param {string} [direction="inherit"] - the text direction
	 * @returns {Style} this
	 */
	 setText(size = 10, family = "Arial", align = "center", baseline = "middle", direction = "inherit") {
		this.text.size = size;
		this.text.family = family;
		this.text.align = align;
		this.text.baseline = baseline;
		this.text.direction = direction;
		return this;
	}
}

/**
 * Image/filter style
 * @class ImageStyle
 * @extends Style
 * @property {string} [filter="none"] - the filter
 * @property {string} [imageSmoothingEnabled=true] - the image smoothing enabled
 * @property {string} [imageSmoothingQuality="low"] - the image smoothing quality
 * @property {string} [imageSmoothingAlpha=1] - the image smoothing alpha
 * @property {string} [imageSmoothingPixelated=false] - the image smoothing pixelated
 * @property {string} [imageSmoothingBicubic=false] - the image smoothing bicubic
 * @property {string} [imageSmoothingSubpixel=false] - the image smoothing subpixel
 * @property {string} [imageSmoothingAntialiased=false] - the image smoothing antialiased
 */
class ImageStyle extends Style {
	/**
	 * Creates a new image style object
	 * @returns {ImageStyle} this
	 */
	constructor() {
		super();
		/** @type {"none"|"auto"|"default"|"nearest-neighbor"|"bilinear"|"bicubic"|"high"|"medium"|"low"|"pixelated"} */
		this.filter = "none";
		/** @type {boolean} */
		this.imageSmoothingEnabled = true;
		/** @type {"low"|"medium"|"high"} */
		this.imageSmoothingQuality = "low";
		/** @type {number} */
		this.imageSmoothingAlpha = 1;
		/** @type {boolean} */
		this.imageSmoothingPixelated = false;
		/** @type {boolean} */
		this.imageSmoothingBicubic = false;
		/** @type {boolean} */
		this.imageSmoothingSubpixel = false;
		/** @type {boolean} */
		this.imageSmoothingAntialiased = false;
		return this;
	}

	/**
	 * Set the image style
	 * @param {string} [imageSmoothingEnabled=true] - the image smoothing enabled
	 * @param {string} [imageSmoothingQuality="low"] - the image smoothing quality
	 * @param {string} [imageSmoothingAlpha=1] - the image smoothing alpha
	 * @param {string} [imageSmoothingPixelated=false] - the image smoothing pixelated
	 * @param {string} [imageSmoothingBicubic=false] - the image smoothing bicubic
	 * @param {string} [imageSmoothingSubpixel=false] - the image smoothing subpixel
	 * @param {string} [imageSmoothingAntialiased=false] - the image smoothing antialiased
	 * @returns {Style} this
	 */
	setImage(imageSmoothingEnabled = true, imageSmoothingQuality = "low", imageSmoothingAlpha = 1, imageSmoothingPixelated = false, imageSmoothingBicubic = false, imageSmoothingSubpixel = false, imageSmoothingAntialiased = false) {
		this.imageSmoothingEnabled = imageSmoothingEnabled;
		this.imageSmoothingQuality = imageSmoothingQuality;
		this.imageSmoothingAlpha = imageSmoothingAlpha;
		this.imageSmoothingPixelated = imageSmoothingPixelated;
		this.imageSmoothingBicubic = imageSmoothingBicubic;
		this.imageSmoothingSubpixel = imageSmoothingSubpixel;
		this.imageSmoothingAntialiased = imageSmoothingAntialiased;
		return this;
	}

	/**
	 * Set the filter style
	 * @param {string} [filter="none"] - the filter
	 * @returns {Style} this
	 * @example
	 * style.setFilter("blur(5px)");
	 * style.setFilter("blur(5px) brightness(0.5)");
	 */
	setFilter(filter = "none") {
		this.filter = filter;
		return this;
	}

	/**
	 * Generates a filter style string
	 * @static
	 * @param {ImageFilterArg[]} filters - the filters
	 * @returns {string} the filter style string
	 * @example
	 * ImageStyle.generateFilter("blur", "5px", "brightness", .5);
	 * ImageStyle.generateFilter("blur", "5px", "brightness", .5, "contrast", .5);
	 */
	static generateFilter(...filters) {
		let filter = "";
		for (let i = 0; i < filters.length; i += 2) {
			filter += filters[i] + "(" + filters[i + 1] + ") ";
		}
		return filter;
	}

	/**
	 * Apply the style to the context
	 * @override
	 * @param {CanvasRenderingContext2D} ctx - the context
	 * @returns {CanvasRenderingContext2D} the context
	 */
	apply(ctx) {
		ctx.filter = this.filter;
		ctx.imageSmoothingEnabled = this.imageSmoothingEnabled;
		ctx.imageSmoothingQuality = this.imageSmoothingQuality;
		ctx.imageSmoothingAlpha = this.imageSmoothingAlpha;
		ctx.imageSmoothingPixelated = this.imageSmoothingPixelated;
		ctx.imageSmoothingBicubic = this.imageSmoothingBicubic;
		ctx.imageSmoothingSubpixel = this.imageSmoothingSubpixel;
		ctx.imageSmoothingAntialiased = this.imageSmoothingAntialiased;
		return ctx;
	}
}

/**
 * Line style
 * @class LineStyle
 * @extends Style
 * @property {number} [width=1] - the line width
 * @property {string} [cap="butt"] - the line cap
 * @property {string} [join="miter"] - the line join
 * @property {number} [miterLimit=10] - the line miter limit
 * @property {number} [dashOffset=0] - the line dash offset
 * @property {number[]} [dashArray=[]] - the line dash array
 */
class LineStyle extends Style {
	/**
	 * Creates a new line style object
	 * @returns {LineStyle} this
	 */
	constructor() {
		super();
		/** @type {number} */
		this.width = 1;
		/** @type {"butt"|"round"|"square"} */
		this.cap = "butt";
		/** @type {"miter"|"bevel"|"round"} */
		this.join = "miter";
		/** @type {number} */
		this.miterLimit = 10;
		/** @type {number} */
		this.dashOffset = 0;
		/** @type {number[]} */
		this.dashArray = [];
		return this;
	}

	/**
	 * set the line style
	 * @param {number} [width=1] - the line width
	 * @param {string} [cap="butt"] - the line cap
	 * @param {string} [join="miter"] - the line join
	 * @param {number} [miterLimit=10] - the line miter limit
	 * @param {number} [dashOffset=0] - the line dash offset
	 * @param {number[]} [dashArray=[]] - the line dash array
	 * @returns {Style} this
	 */
	setLine(width = 1, cap = "butt", join = "miter", miterLimit = 10, dashOffset = 0, dashArray = []) {
		this.width = width;
		this.cap = cap;
		this.join = join;
		this.miterLimit = miterLimit;
		this.dashOffset = dashOffset;
		this.dashArray = dashArray;
		return this;
	}

	/**
	 * Apply the style to the context
	 * @override
	 * @param {CanvasRenderingContext2D} ctx - the context to apply the style to
	 * @returns {CanvasRenderingContext2D} the context
	 */
	apply(ctx) {
		ctx = super.apply(ctx);
		ctx.lineWidth = this.width;
		ctx.lineCap = this.cap;
		ctx.lineJoin = this.join;
		ctx.miterLimit = this.miterLimit;
		ctx.lineDashOffset = this.dashOffset;
		ctx.setLineDash(this.dashArray);
		return ctx;
	}
}
