// Class for creating a canvas element
class Canvas {
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
    // draw a series of lines horizontally and vertically with a given spacing from origo
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
    }
    // draw axis with marks at given interval
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
    // Draws a rectangle use origoX and origoY as the top left corner
    drawRect(x, y, width, height, color = "#000000FF") {
        this.context.fillStyle = color;
        this.context.fillRect(x, y, width, height);
    }
    // Draws a circle
    drawCircle(x, y, radius, color = "#000000FF") {
        this.context.fillStyle = color;
        this.context.beginPath();
        this.context.ellipse(x, y, radius, radius, 0, 0, 2 * Math.PI);
        this.context.fill();
        this.context.closePath();
    }
    // Draws a line
    drawLine(x1, y1, x2, y2, color = "#000000FF") {
        this.context.strokeStyle = color;
        this.context.beginPath();
        this.context.moveTo(x1, y1);
        this.context.lineTo(x2, y2);
        this.context.stroke();
    }
    // Draws a text
    drawText(text, x, y, color = "#000000FF") {
        this.context.fillStyle = color;
        this.context.fillText(text, x, y);
    }
    // Clears the canvas
    clear() {
        this.context.clearRect(this.left, this.top, this.canvas.width, this.canvas.height);
    }
    // draw a point form class grid or two points from class vector
    drawPoint(point, color = "#000000FF") {
        if(point instanceof Vector) { // Vector should be checked before grid, because vector is extended from grid
            const {x1, y1, x2, y2} = point.spacial();
            this.drawCircle(x1, y1, 3, color);
            this.drawCircle(x2, y2, 3, color);
        } else if (point instanceof Grid) {
            const {x, y} = point.getCordinate()
            this.drawCircle(x, y, 3, color);
        } else return new Error("point is not of proper type");
    }
    //draw a vector form class vector
    drawVector(vector, color = "#000000FF") {
        const {x1, y1, x2, y2} = vector.spacial();
        this.drawLine(x1, y1, x2, y2, color);
    }
    // Set origo of canvas to a given screen position
    origo(x, y) {
        this.origoX = x;
        this.origoY = y;
        this.left = -x;
        this.right = this.canvas.width - x;
        this.top = -y;
        this.bottom = this.canvas.height - y;
        this.context.translate(this.origoX, this.origoY);
    }
    // resize to a width and height
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
    // Draw text in a given position
    drawText(text, x, y, color = "#000000FF") {
        this.context.fillStyle = color;
        this.context.fillText(text, x, y);
    }
    // Draw an interactive button
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
    }
}

// class that extends canvas but intended to draw graphs (like ossilisocpe)
class Graph extends Canvas {
    constructor(width, height) {
        super(width, height);
    }
    // Draw a series of points from a Series class
    plot(series, color = "#000000FF") {
        const {time, data} = series.getSeries();
        this.context.strokeStyle = color;
        this.context.beginPath();
        this.context.moveTo(time[0], data[0]);
        for(let i = 1; i < time.length; i++) this.context.lineTo(time[i], data[i]);
        this.context.stroke();
        return this;
    }
    // Draw axis but add labels to the axis and option for numbering the marks
    drawAxis(interval, color = "#000000FF", number = false) {
        super.drawAxis(interval, color);
        if(number) {
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

// class that holds layers of canvasses or graphs
class Layered {
    constructor() {
        this.layers = {};
    }
    // Add a layer to the layers array
    addLayer(layer, name, appendTo = document.body) {
        this.layers[name] = layer;
        appendTo.appendChild(layer.canvas);
        return this;
    }
    // return all layers in an array
    getLayers() {
        return Object.values(this.layers);
    }
    // get all layers in an array
    getLayerNames() {
        return Object.keys(this.layers);
    }
    // Call a function on all layers
    // the func takes one argument which is the canvas class (layer)
    call(func) {
        const layers = this.layers;
        this.getLayerNames().forEach(name => 
            func(layers[name])
        );
    }
    // Call function on all specified layers (names)
    callOn(func, ...names) {
        if(typeof func != "function") return new Error("not a function: " + func);
        const layers = this.layers;
        names.forEach(name => func(layers[name]));
    }
    
}