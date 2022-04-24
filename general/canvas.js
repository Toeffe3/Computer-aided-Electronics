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
        this.context = this.canvas.getContext("2d");
        this.canvas.width = this.right;
        this.canvas.height = this.bottom;
        return [this, this.canvas];
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
    //resize the canvas
    resize(width, height) {
        this.canvas.width = width;
        this.canvas.height = height;
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
}