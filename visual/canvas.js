/**
 * Create a canvas with functions to better control the canvas
 * @class Canvas
 * @property {HTMLElement<Canvas>} canvas - the canvas element
 * @property {CanvasRenderingContext2D} context - the context of the canvas
 * @see {@link https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API Canvas API on MDN}
 */
class Canvas {
    /**
     * Creates a canvas element with a given size
     * @param  {number} width - negative number are summed to the width of the window
     * @param  {number} height - negative number are summed to the height of the window
     * @returns {Canvas} the canvas element
     */
    constructor() {
        this.canvas = document.createElement('CANVAS');
        this.canvas.id = increment.next().value;
        
        /** @type {CanvasRenderingContext2D?} */
        this.context = null;
        /** @type {"origo"|"center"|"corner"} */
        this.refposition = "origo";
        this.origoX = 0;
        this.origoY = 0;
        this.width = 0;
        this.height = 0;
        this.axis = {
            x: {
                unit: "",
                scale: 1
            },
            y: {
                unit: "",
                scale: -1
            }
        };
        return this;
    }

    /**
     * Sets canvas and context
     * @param {number} [width=window.innerWidth] - the width of the canvas
     * @param {number} [height=window.innerHeight] - the height of the canvas
     * @param {number} [origoX=0] - the x coordinate of the origo
     * @param {number} [origoY=0] - the y coordinate of the origo
     * @returns {Canvas} this
     */
    update(width=window.innerWidth, height=window.innerHeight, origoX=0, origoY=0) {
        this.canvas = document.getElementById(`${this.canvas.id}`);
        this.context = this.canvas.getContext("2d");
        const ref = this.reference("cornor");
        this.origo(origoX, origoY);
        this.resize(width, height, true);
        this.reference(ref);
        return this;
    }

    /**
     * Scale the canvas
     * @param  {number} x - the amount of canvas-pixels per screen-pixels for the x-axis
     * @param  {number} y - the amount of canvas-pixels per screen-pixels for the y-axis
     * @returns {Canvas} this
     * @example canvas.scale(2/1, 2/1); // 'Zoom in' by 50%
     * @example canvas.scale(1/2, 1/2); // 'Zoom out' by 50%
     * @example canvas.scale(-1, -1); // Inverse x and y axis
     */
    setScale(x, y) {
        this.axis.x.scale = x;
        this.axis.y.scale = -y; 
        return this;
    }

    /**
     * Set the unit of the axis
     * @param {string?} x - the unit of the x-axis
     * @param {string?} y - the unit of the y-axis
     * @returns {Canvas} this
     */
    setUnit(x, y) {
        this.axis.x.unit = x??"";
        this.axis.y.unit = y??"";
        return this;
    }

    /**
     * Get the limits of the canvas
     * @param  {boolean} [scaling=true] - if false, the scaling not incluede
     * @returns {Object} the edges of the canvas
     */
    getLimits(scaling=true) {
        const {x, y} = scaling ? this.getAxis() : {x: 1, y: 1};
        return {
            left: this.origoX * x,
            right: (this.origoX + this.width) * x,
            top: this.origoY * y,
            bottom: (this.origoY + this.height) * y
        };
    }

    /**
     * get axis
     * @param  {boolean} [asPositive=false] - if true, the negative scales are returned as positive
     * @returns {Object} the axis
     */
    getAxis(asPositive=false) {
        if(asPositive===true) return {x: Math.abs(this.axis.x.scale), y: Math.abs(this.axis.y.scale)};
        return {x: this.axis.x.scale, y: this.axis.y.scale};
    }
    
    /**
     * Draws a grid on the canvas
     * @param  {number} spacingX - the interval between the lines in the x axis
     * @param  {number} spacingY - the interval between the lines in the y axis
     * @param  {Style} style - the style
     * @returns {Canvas} this
     */
    drawGrid(spacingX, spacingY, style) {
        const ref = this.reference("origo");
        style.apply(this.context);

        const {left, right, top, bottom} = this.getLimits(false);
        const {x: scaleX, y: scaleY} = this.getAxis(true);

        this.context.beginPath();
        
        // draw lines from 0,0 with spacing between each line until the edge of the canvas
        const x = Math.floor(left/spacingX)*spacingX;
        for(let i=x; i<=right; i+=spacingX) {
            this.context.moveTo(i / scaleX, top);
            this.context.lineTo(i / scaleX, bottom);
        }
        const y = Math.floor(top/spacingY)*spacingY;
        for(let i=y; i<=bottom; i+=spacingY) {
            this.context.moveTo(left, i / scaleY);
            this.context.lineTo(right, i / scaleY);
        }

        this.context.stroke();
        this.reference(ref);
        return this;
    }
    
    /**
     * Draw axis with ticks and numbers
     * @param  {number} intervalX - the interval between the ticks in the x axis
     * @param  {number} intervalY - the interval between the ticks in the y axis
     * @param  {Style} style - the style
     * @param  {Style?} gridStyle - if defined, a grid will be drawn with same interval as the ticks
     * @returns {Canvas} this
     */
    drawAxis(intervalX, intervalY, style, gridStyle) {
        const ref = this.reference("origo");
        if(gridStyle) this.drawGrid(intervalX, intervalY, gridStyle);
        style.apply(this.context);
        const {left, right, top, bottom} = this.getLimits(false);
        const {x: scaleX, y: scaleY} = this.getAxis(true);

        this.context.beginPath();
        this.context.moveTo(0, top);
        this.context.lineTo(0, bottom);
        this.context.moveTo(left, 0);
        this.context.lineTo(right, 0);
        
        for(let i = 0; i <= right; i+=intervalX / scaleX) {
            this.context.moveTo(i, -5);
            this.context.lineTo(i, 5);
        }
        for(let i = 0; i >= left; i-=intervalX / scaleX) {
            this.context.moveTo(i, -5);
            this.context.lineTo(i, 5);
        }
        for(let i = 0; i <= bottom; i+=intervalY / scaleY) {
            this.context.moveTo(-5, i);
            this.context.lineTo(5, i);
        }
        for(let i = 0; i >= top; i-=intervalY / scaleY) {
            this.context.moveTo(-5, i);
            this.context.lineTo(5, i);
        }


        this.context.stroke();
        this.reference(ref);
        return this;
    }

    /**
     * Set the reference point of the context
     * @param {"origo"|"center"|"cornor"?} position - the reference point
     * @param {boolean} [log=false] - Print information log to the console
     * @returns {"origo"|"center"|"cornor"} the previous reference point
     */
    reference(position = "origo", log = false) {
        if(position === null || this.refposition == position) return null;
        if(log) console.info(`Reference point changed: ${this.refposition} -> ${position}`);
        switch(`${this.refposition}-${position}`) {
            case "origo-center":
                throw new Error("Not implemented");
                break;
            case "origo-cornor":
                this.context.translate(this.origoX, this.origoY);
                break;
            case "center-origo":
                throw new Error("Not implemented");
                break;
            case "center-cornor":
                throw new Error("Not implemented");
                break;
            case "cornor-origo":
                this.context.translate(-this.origoX, -this.origoY);
                break;
            case "cornor-center":
                throw new Error("Not implemented");
                break;
            default:
                throw new Error("Invalid reference position");
        }
        const ref = this.refposition;
        this.refposition = position;
        return ref;
    }

    /**
     * Draws a rectangle on the canvas
     * @param  {number} x - the x coordinate of the top left corner
     * @param  {number} y - the y coordinate of the top left corner
     * @param  {number} width - the width of the rectangle
     * @param  {number} height - the height of the rectangle
     * @param  {Style} style - the style
     * @param {"origo"|"center"|"cornor"} ref - the reference point
     * @returns {Canvas} this
     */
    drawRect(x, y, width, height, style, ref = "origo") {
        ref = this.reference(ref);
        style.apply(this.context);
        this.context.fillRect(x, y, width, height);
        this.context.stroke();
        this.reference(ref);
        return this;
    }
    
    /**
     * Draws a circle on the canvas
     * @param  {number} x - the x coordinate of the center of the circle
     * @param  {number} y - the y coordinate of the center of the circle
     * @param  {number} radius - the radius of the circle
     * @param  {Style} style - the style
     * @param {"origo"|"center"|"cornor"} ref - the reference point
     * @returns {Canvas} this
     */
    drawCircle(x, y, radius, style, ref = "origo") {
        ref = this.reference(ref);
        style.apply(this.context);
        this.context.beginPath();
        this.context.ellipse(x, y, radius, radius, 0, 0, 2 * Math.PI);
        this.context.fill();
        this.context.stroke();
        this.reference(ref);
        return this;
    }

    /** 
     * Draws a line on the canvas
     * @param {number} x1 - the x coordinate of the first point
     * @param {number} y1 - the y coordinate of the first point
     * @param {number} x2 - the x coordinate of the second point
     * @param {number} y2 - the y coordinate of the second point
     * @param  {Style} style - the style
     * @param {"origo"|"center"|"cornor"} ref - the reference point
     * @returns {Canvas} this
     */
    drawLine(x1, y1, x2, y2, style, ref = "origo") {
        ref = this.reference(ref);
        style.apply(this.context);
        this.context.beginPath();
        this.context.moveTo(x1, y1);
        this.context.lineTo(x2, y2);
        this.context.stroke();
        this.context.closePath();
        this.reference(ref);
        return this;
    }
    
    /**
     * Draw text on the canvas
     * @param  {string} text - the text to be drawn
     * @param  {number} x - the x coordinate of the top left corner of the text
     * @param  {number} y - the y coordinate of the top left corner of the text
     * @param  {Style} style - the style
     * @param {"origo"|"center"|"cornor"} ref - the reference point
     * @returns {Canvas} this
     */
    drawText(text, x, y, style, ref = "origo") {
        ref = this.reference(ref);
        style.apply(this.context);
        this.context.fillText(text, x, y);
        this.reference(ref);
        return this;
    }
    
    /**
     * Clears the canvas
     * @returns {Canvas} this
     */
    clear() {
        const ref = this.reference("cornor");
        this.context.clearRect(0, 0, this.width, this.height);
        this.reference(ref);
        return this;
    }

    /**
     * Draws a point on the canvas
     * @param  {Cordinate} point - the point to be translated
     * @param  {Style} style - the style
     * @returns {Canvas} this
     */
    drawPoint(point, style, ref = "origo") {
        if(!point instanceof Cordinate) return new Error("point is not of proper type");
        ref = this.reference(ref);
        style.apply(this.context);
        if(point instanceof Vector) { // Vector should be checked before Cordinate, because vector is extended from Cordinate
            const {x1, y1, x2, y2} = point.spacial();
            this.drawCircle(x1, y1, 3, color);
            this.drawCircle(x2, y2, 3, color);
        } else if (point instanceof Cordinate) {
            const {x, y} = point.getCordinate()
            this.drawCircle(x, y, 3, color);
        }
        this.reference(ref);
    }

    /**
     * Draws a line representing a vector
     * @param {Vector} vector - the vector to be drawn 
     * @param {Style} style - the style
     * @param {"origo"|"center"|"cornor"} ref - the reference point
     * @returns {Canvas} this
     */
    drawVector(vector, style, ref = "origo") {
        if(!(vector instanceof Vector)) return new Error("vector is not of proper type");
        ref = this.reference(ref);
        const {x1, y1, x2, y2} = vector.spacial();
        this.drawLine(x1, y1, x2, y2, style);
        this.reference(ref);
        return this;
    }
    
    /**
     * Sets the origo of the canvas to a given screen position
     * @param {number} x - the x coordinate of the new origo
     * @param {number} y - the y coordinate of the new origo
     * @returns {Canvas} this
     */
    origo(x, y) {
        const ref = this.reference("cornor");
        this.origoX = x;
        this.origoY = y;
        this.reference(ref);
        return this;
    }
    
    /**
     * Resizes the canvas to a given width and height
     * @param {number} width - the new width of the canvas
     * @param {number} height - the new height of the canvas
     * @returns {Canvas} this
     */
    resize(width=window.innerWidth, height=window.innerHeight, keepOrigo = false) {
        // calculate the postion percentage of old origo and apply
        const ref = this.reference("cornor");
        if(keepOrigo===false) {
            const xPercent = this.origoX/this.width || 0;
            const yPercent = this.origoY/this.height || 0;
            this.origo(width*xPercent, height*yPercent);
        }

        this.width = width;
        this.height = height;
        this.canvas.width = this.width;
        this.canvas.height = this.height;
        this.origo(this.origoX, this.origoY);
        this.reference(ref);
        return this;
    }
    
    /**
     * Draws an interactive button
     * @param {string} text - the text to be drawn
     * @param {number} x - the x coordinate of the top left corner of the button
     * @param {number} y - the y coordinate of the top left corner of the button
     * @param {number} width - the width of the button
     * @param {number} height - the height of the button
     * @param {Style} buttonstyle - the style
     * @param {StyleText} textstyle - the style
     * @param {function} callback - the function to be called when the button is clicked
     * @returns {Canvas} this
     */
    drawButton(text, x, y, width, height, buttonstyle, textstyle, callback = () => {}) {
        // rect with round corners
        button.apply(this.context);
        this.context.beginPath();
        this.context.moveTo(x + width / 2, y);
        this.context.arcTo(x + width, y, x + width, y + height, height / 2);
        this.context.arcTo(x + width, y + height, x, y + height, height / 2);
        this.context.arcTo(x, y + height, x, y, height / 2);
        this.context.arcTo(x, y, x + width, y, height / 2);
        this.context.fill();
        textstyle.apply(this.context);
        this.context.fillText(text, x + width / 2, y + height / 2);
        this.context.closePath();
        // Add event listener to the button
        this.canvas().onclick = (e) => {
            if(e.x > x && e.x < x + width && e.y > y && e.y < y + height) callback();
        };
        return this;
    }
}

/**
 * Class that extends Canvas but intended to draw graphs (like ossilisocpe)
 * @extends Canvas
 * @class Graph
 */
class Graph extends Canvas {
    /**
     * Creates a new graph
     * @param {number} width - the width of the graph
     * @param {number} height - the height of the graph
     * @returns {Graph} this
     */
    constructor(width, height) {
        super(width, height);
        return this;
    }
    
    /**
     * Draws a graph (plotting)
     * @param {Series} series - the series to be plotted
     * @param {Style} style - the style
     * @returns {Canvas} this
     */
    plot(series, style) {
        const {x: scaleX, y: scaleY} = this.getAxis();
        style.apply(this.context);

        if(series instanceof FrequencyDomain) {
            const {frequency, amplitude} = series.getSeries();
            // Stick plot
            for(let i = 0; i < frequency.length; i++) {
                this.context.beginPath();
                this.context.moveTo(frequency[i]/scaleX, 0);
                this.context.lineTo(frequency[i]/scaleX, amplitude[i]/scaleY);
                this.context.stroke();
            }
        } else {
            // One continous line
            const {time, data} = series.getSeries();
            this.context.beginPath();
            this.context.moveTo(time[0]/scaleX, data[0]/scaleY);
            for(let i = 1; i < time.length; i++) this.context.lineTo(time[i]/scaleX, data[i]/scaleY);
            this.context.stroke();
        }
        return this;
    }

    /**
     * Plots an array of numbers
     * @param {number[]} data - the array of numbers to be plotted
     * @param {Style} style - the style
     * @param {{x: number, y: number}} [scale] - the scale of the graph
     * @returns {Canvas} this
     */
    plotArray(data, style) {
        style.apply(this.context);
        const {x: scaleX, y: scaleY} = this.getAxis();
        this.context.beginPath();
        this.context.moveTo(0, data[0]/scaleY);
        for(let i = 1; i < data.length; i++) this.context.lineTo(i/scaleX, data[i]/scaleY);
        this.context.stroke();
        return this;
    }
    
    /**
     * Draws axis with labels and optional numbering
     * @override
     * @param {number} intervalX - the interval between the marks on the x axis
     * @param {number} intervalY - the interval between the marks on the y axis
     * @param {Style} style - the style
     * @param {boolean} [numbering=true] - if true the marks will be numbered
     * @param {Style?} [gridStyle] - if given the grid will be drawn
     * @returns {Canvas} this
     */
    drawAxis(intervalX, intervalY, style, numbering = false, gridStyle = null) {
        super.drawAxis(intervalX, intervalY, style, gridStyle);

        if(numbering) {
            const ref = super.reference("origo");
            const {left, right, top, bottom} = this.getLimits();
            const {x: scaleX, y: scaleY} = this.getAxis();
            
            const x = Math.ceil(Math.min(left, right)/intervalX)*intervalX;
            for(let i = x; i <= Math.max(left, right); i += intervalX) {
                if (i === 0) continue; // Don't draw 0
                this.context.save();
                this.context.translate(i / scaleX, 0);
                this.context.textAlign = "center";
                this.context.fillText(`${i}${this.axis.x.unit}`, 0, -14);
                this.context.restore();
            }
            const y = Math.ceil(Math.min(top, bottom)/intervalY)*intervalY;
            for(let i = y; i <= Math.max(top, bottom); i += intervalY) {
                if (i === 0) continue; // Don't draw 0
                this.context.save();
                this.context.translate(0, i / scaleY);
                this.context.textAlign = "left";
                this.context.fillText(`${i}${this.axis.y.unit}`, 10, 0);
                this.context.restore();
            }
            super.reference(ref);
        }
        return this;
    }
}

/**
 * Class that holds layers of canvasses or graphs
 * @class Layer
 * @property {windowOptions} options - the options for the window
 * @property {Array<Canvas|Graph>} layers - the layers in the layer
 * @property {HTMLElement} htmlhook - the element to which the layer is attached
 */
class Layered {
    /**
     * Creates a new layered object
     * @param {HTMLElement} htmlhook - the html element to attach the canvas to
     * @param {windowOptions} options - the options for the window
     * @returns {Layered} this
     */
    constructor(htmlhook, options = {}) {
        this.layers = {};
        /** @type {windowOptions} */
        this.options = options;
        this.htmlhook = htmlhook;
        return this;
    }

    /**
     * Adds a layer to the layers array
     * @description Layers are drawn in the order they are added (last added is on top)
     * @param {Canvas} layer - the layer to be added
     * @param {string} name - the name of the layer
     * @param {HTMLElement?} appendTo - the html element to append the layer to, default is the body
     * @returns {Layered} this
     */
    addLayer(layer, name, appendTo = this.htmlhook) {
        this.layers[name] = layer;
        appendTo.appendChild(layer.canvas);
        layer.update(this.options.width, this.options.height, this.options.origoX, this.options.origoY);
        layer.canvas.id = `${name}-canvas`;
        layer.canvas.classList.add("layer");
        return this;
    }
    
    /**
     * Get all the layers
     * @returns {Layered[]} the layers array
     */
    getLayers() {
        return Object.values(this.layers);
    }
    
    /**
     * Get all layers in an array
     * @returns {string[]} an array of all layers
     */
    getLayerNames() {
        return Object.keys(this.layers);
    }

    /**
     * Call a function on all layers
     * @param {function(Canvas|Graph)} func - the function to be called
     * @returns {Layered} this
     */
    call(func) {
        const layers = this.layers;
        this.getLayerNames().forEach(name => 
            func(layers[name])
        );
        return this;
    }
    
    /**
     * Call function on all specified layers (names)
     * @param {function(Canvas|Graph)} func - the function to be called
     * @param {...string} names - the names of the layers to be called
     * @returns {Layered} this
     */
    callOn(func, ...names) {
        if(typeof func != "function") return new Error(`${func} is not a function`);
        names.forEach(name => {
            if(this.layers[name]) func(this.layers[name]);
        });
        return this;
    }
    
}