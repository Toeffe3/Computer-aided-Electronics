/**
 * Create a canvas with functions to better control the canvas
 * @class Canvas
 * @see {@link https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API Canvas API on MDN}
 */
class Canvas {
    /**
     * Creates a canvas element with a given size
     * @param  {number} width - negative number are summed to the width of the window
     * @param  {number} height - negative number are summed to the height of the window
     * @return {Canvas} this
     */
    constructor(width, height) {
        this.orrigoX = 0;
        this.orrigoY = 0;
        this.left = 0;
        this.top = 0;
        if(width <= 0) this.right = window.innerWidth + width;
        if(height <= 0) this.bottom = window.innerHeight + height;
        this.canvas = document.createElement('CANVAS');
        this.canvas.id = nextId();
        this.context = this.canvas.getContext("2d");
        this.canvas.width = this.right;
        this.canvas.height = this.bottom;
        this.getCanvas = () => document.getElementById(this.canvas.id);
        return this;
    }
    
    /**
     * Draws a grid on the canvas
     * @param  {number} spacingX - the interval between the lines in the x axis
     * @param  {number} spacingY - the interval between the lines in the y axis
     * @param  {string} color="#000000FF" - the color of the grid
     * @return {Canvas} this
     */
    drawGrid(spacingX, spacingY, color = "#000000FF") {
        if(typeof spacingY != "number") {
            spacingY = spacingX;
            color = spacingY || 0;
        }
        if(color) this.context.strokeStyle = color;
        this.context.beginPath();
        // lines should go though origo
        for(let i = 0; i <= this.right; i += spacingX) {
            this.context.moveTo(i, this.top);
            this.context.lineTo(i, this.bottom);
            this.context.moveTo(-i, this.top);
            this.context.lineTo(-i, this.bottom);
        }
        for(let i = 0; i <= this.bottom; i += spacingY) {
            this.context.moveTo(this.left, i);
            this.context.lineTo(this.right, i);
            this.context.moveTo(this.left, -i);
            this.context.lineTo(this.right, -i);
        }
        this.context.stroke();
        return this;
    }
    
    /**
     * Draw axis with ticks and numbers
     * @param  {number} interval - the interval between the ticks
     * @param  {string} color="#000000FF" - the color of the axis
     * @return {Canvas} this
     */
    drawAxis(interval, color = "#000000FF") {
        this.context.strokeStyle = color;
        this.context.beginPath();
        this.context.moveTo(this.left, 0);
        this.context.lineTo(this.right, 0);
        this.context.moveTo(0, this.top);
        this.context.lineTo(0, this.bottom);
        this.context.stroke();
        this.context.beginPath();
        for(let i = 0; i <= this.right; i += interval) {
            this.context.moveTo(i, 0);
            this.context.lineTo(i, 5);
            this.context.moveTo(-i, 0);
            this.context.lineTo(-i, 5);
        }
        for(let i = 0; i <= this.bottom; i += interval) {
            this.context.moveTo(0, i);
            this.context.lineTo(-5, i);
            this.context.moveTo(0, -i);
            this.context.lineTo(-5, -i);
        }
        this.context.stroke();
        return this;
    }
    
    /**
     * Draws a rectangle on the canvas
     * @param  {number} x - the x coordinate of the top left corner
     * @param  {number} y - the y coordinate of the top left corner
     * @param  {number} width - the width of the rectangle
     * @param  {number} height - the height of the rectangle
     * @param  {string} color - the color of the rectangle
     * @return {Canvas} this
     */
    drawRect(x, y, width, height, color = "#000000FF") {
        this.context.fillStyle = color;
        this.context.fillRect(x, y, width, height);
        return this;
    }
    
    /**
     * Draws a circle on the canvas
     * @param  {number} x - the x coordinate of the center of the circle
     * @param  {number} y - the y coordinate of the center of the circle
     * @param  {number} radius - the radius of the circle
     * @param  {string} color - the color of the circle
     * @return {Canvas} this
     */
    drawCircle(x, y, radius, color = "#000000FF") {
        this.context.fillStyle = color;
        this.context.beginPath();
        this.context.ellipse(x, y, radius, radius, 0, 0, 2 * Math.PI);
        this.context.fill();
        this.context.closePath();
        return this;
    }

    /** 
     * Draws a line on the canvas
     * @param {number} x1 - the x coordinate of the first point
     * @param {number} y1 - the y coordinate of the first point
     * @param {number} x2 - the x coordinate of the second point
     * @param {number} y2 - the y coordinate of the second point
     * @param {string} color - the color of the line
     * @return {Canvas} this
     */
    drawLine(x1, y1, x2, y2, color = "#000000FF") {
        this.context.strokeStyle = color;
        this.context.beginPath();
        this.context.moveTo(x1, y1);
        this.context.lineTo(x2, y2);
        this.context.stroke();
        return this;
    }
    
    /**
     * Draw text on the canvas
     * @param  {string} text - the text to be drawn
     * @param  {number} x - the x coordinate of the top left corner of the text
     * @param  {number} y - the y coordinate of the top left corner of the text
     * @param  {string} color - the color of the text
     * @return {Canvas} this
     */
    drawText(text, x, y, color = "#000000FF") {
        this.context.fillStyle = color;
        this.context.fillText(text, x, y);
        return this;
    }
    
    /**
     * Clears the canvas
     * @return {Canvas} this
     */
    clear() {
        this.context.clearRect(this.left, this.top, this.canvas.width, this.canvas.height);
        return this;
    }

    /**
     * Draws a point on the canvas
     * @param  {Cordinate} point - the point to be translated
     * @param  {string} color - the color of the point
     * @return {Canvas} this
     */
    drawPoint(point, color = "#000000FF") {
        if(point instanceof Vector) { // Vector should be checked before Cordinate, because vector is extended from Cordinate
            const {x1, y1, x2, y2} = point.spacial();
            this.drawCircle(x1, y1, 3, color);
            this.drawCircle(x2, y2, 3, color);
        } else if (point instanceof Cordinate) {
            const {x, y} = point.getCordinate()
            this.drawCircle(x, y, 3, color);
        } else return new Error("point is not of proper type");
    }

    /**
     * Draws a line representing a vector
     * @param {Vector} vector - the vector to be drawn 
     * @param {string} color - the color of the line
     * @returns {Canvas} this
     */
    drawVector(vector, color = "#000000FF") {
        if(!(vector instanceof Vector)) return new Error("vector is not of proper type");
        const {x1, y1, x2, y2} = vector.spacial();
        this.drawLine(x1, y1, x2, y2, color);
        return this;
    }
    
    /**
     * Sets the origo of the canvas to a given screen position
     * @param {number} x - the x coordinate of the new origo
     * @param {number} y - the y coordinate of the new origo
     * @return {Canvas} this
     */
    origo(x, y) {
        this.origoX = x;
        this.origoY = y;
        this.left = -x;
        this.right = this.canvas.width - x;
        this.top = -y;
        this.bottom = this.canvas.height - y;
        this.context.translate(this.origoX, this.origoY);
        return this;
    }
    
    /**
     * Resizes the canvas to a given width and height
     * @param {number} width - the new width of the canvas
     * @param {number} height - the new height of the canvas
     * @return {Canvas} this
     */
    resize(width=window.innerWidth, height=window.innerHeight) {
        let cv = this.getCanvas();
        // get the relative origo to old with and height (use this.origo)
        let x = this.origoX / this.canvas.width;
        let y = this.origoY / this.canvas.height;
        // set the new width and height
        cv.width = width;
        cv.height = height;
        // set the new origo
        this.origo(x * width, y * height);
        return this;
    }
    
    /**
     * Draws an interactive button
     * @param {string} text - the text to be drawn
     * @param {number} x - the x coordinate of the top left corner of the button
     * @param {number} y - the y coordinate of the top left corner of the button
     * @param {number} width - the width of the button
     * @param {number} height - the height of the button
     * @param {string} color - the color of the button
     * @param {function} callback - the function to be called when the button is clicked
     * @return {Canvas} this
     */
    drawButton(text, x, y, width, height, color = "#FFFFFFFF", background = "#000000FF", callback = () => {}) {
        // rect with round corners
        this.context.fillStyle = background;
        this.context.beginPath();
        this.context.moveTo(x + width / 2, y);
        this.context.arcTo(x + width, y, x + width, y + height, height / 2);
        this.context.arcTo(x + width, y + height, x, y + height, height / 2);
        this.context.arcTo(x, y + height, x, y, height / 2);
        this.context.arcTo(x, y, x + width, y, height / 2);
        this.context.fill();
        // text, center aligned
        this.context.fillStyle = color;
        this.context.textAlign = "center";
        this.context.textBaseline = "middle";
        this.context.font = "14px Arial";
        this.context.fillText(text, x + width / 2, y + height / 2);
        this.context.closePath();
        // Add event listener to the button
        this.getCanvas().onclick = (e) => {
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
     * @return {Graph} this
     */
    constructor(width, height) {
        super(width, height);
        return this;
    }
    
    /**
     * Draws a graph (plotting)
     * @param {Series} series - the series to be plotted
     * @param {string} color - the color of the graph
     * @return {Canvas} this
     */
    plot(series, color = "#000000FF") {
        const {time, data} = series.getSeries();
        this.context.strokeStyle = color;
        this.context.beginPath();
        this.context.moveTo(time[0], data[0]);
        for(let i = 1; i < time.length; i++) this.context.lineTo(time[i], data[i]);
        this.context.stroke();
        return this;
    }
    
    /**
     * Draws axis with labels and optional numbering
     * @override
     * @param {number} interval - the interval between the marks
     * @param {string} color - the color of the axis
     * @param {boolean} numbering - if true the marks will be numbered
     * @returns {Canvas} this
     */
    drawAxis(interval, color = "#000000FF", numbering = false) {
        super.drawAxis(interval, color);
        if(numbering) {
            this.context.font = "10px Arial";
            this.context.fillStyle = color;
            // Calculate the min and max axis number that would fit in the canvas
            const [xMax, xMin, yMax, yMin] = [
                Math.ceil(this.right / interval) * interval,
                Math.floor(this.left / interval) * interval,
                Math.ceil(this.bottom / interval) * interval,
                Math.floor(this.top / interval) * interval
            ];

            // Draw the x axis numbers
            for(let i = xMin; i <= xMax; i += interval) {
                if (i === 0) continue;
                this.context.save();
                this.context.translate(i, 0);
                this.context.rotate(Math.PI / 2);
                this.context.fillText(i, 6, 2);
                this.context.restore();
            }
            // Draw the y axis numbers but reverse the y axis and right align the numbers
            for(let i = yMin; i <= yMax; i += interval) {
                if (i === 0) continue;
                this.context.save();
                this.context.translate(0, i);
                this.context.textAlign = "right";
                this.context.fillText(-i, -6, 2);
                this.context.restore();
            }

        }
        return this;
    }
}

/**
 * Class that holds layers of canvasses or graphs
 * @class Layer
 */
class Layered {
    /**
     * Creates a new layered object
     * @return {Layered} this
     */
    constructor() {
        this.layers = {};
        return this;
    }

    /**
     * Adds a layer to the layers array
     * @param {Canvas} layer - the layer to be added
     * @param {string} name - the name of the layer
     * @param {HTMLElement} appendTo - the html element to append the layer to, default is the body
     * @returns {Layered} this
     */
    addLayer(layer, name, appendTo = document.body) {
        this.layers[name] = layer;
        appendTo.appendChild(layer.canvas);
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
     * @param {function} func - the function to be called
     * @return {Layered} this
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
     * @param {function} func - the function to be called
     * @param {...string} names - the names of the layers to be called
     * @return {Layered} this
     */
    callOn(func, ...names) {
        if(typeof func != "function") return new Error("not a function: " + func);
        const layers = this.layers;
        names.forEach(name => func(layers[name]));
        return this;
    }
    
}