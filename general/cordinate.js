/**
 * Create a cordinate point
 * @class Coordinate
 * @see {@link https://en.wikipedia.org/wiki/Cartesian_coordinate_system Cartesian coordinate system on Wikipedia}
 */
class Cordinate {
    /**
     * @constructor
     * @param {number} x - x position
     * @param {number} y - y position
     * @return {Cordinate} this
     */
    constructor(x, y) {
        this.x = x;
        this.y = y;
        return this;
    }
    
    /**
     * Get the x position
     * @returns {number} number
     */
    getX() {
        return this.x;
    }

    /**
     * Get the y position
     * @returns {number} number
     */
    getY() {
        return this.y;
    }

    /**
     * Get the cordinate as an object
     * @returns {{x, y}} {x, y}
     */
    getCordinate() {
        return { x: this.x, y: this.y };
    }

    /**
     * Get the cordinate as a string
     * @override
     * @returns {string} string
     */
    toString() {
        return `${this.x},${this.y}`;
    }

    /**
     * Get the distance between this cordinate and another
     * @param {Cordinate} cord - cordinate to calculate distance to
     * @return {number} number
     */
    distance(cord) {
        return Math.sqrt(
            Math.pow(cord.x - this.x, 2) + 
            Math.pow(cord.y - this.y, 2)
        );
    }

    /**
     * Get the angle between this cordinate and another
     * @param {Cordinate} cord - cordinate to calculate angle to
     * @return {number} number
     */
    angle(cord) {
        return Math.atan2(cord.y - this.y, cord.x - this.x);    
    }

    /**
     * Move this cordinate to another
     * @param {Cordinate} cord - cordinate to move to
     * @return {Cordinate} this
     */
    cordinate(cord) {
        this.x = cord.x;
        this.y = cord.y;
        return this;
    }
    
    /**
     * Move this cordinate to another
     * @param {number} x - x position
     * @param {number} y - y position
     * @return {Cordinate} this
     */
    move(x, y) {
        this.x = x;
        this.y = y;
        return this;
    }
    
    /**
     * Set the point back to the origin
     * @returns {Cordinate} this
     */
    origin() {
        this.x = 0;
        this.y = 0;
        return this;
    }
    
    /**
     * Get a new cordinate that is a copy of this one
     * @return {Cordinate} Cordinate
     */
    copy() {
        return new Cordinate(this.x, this.y);
    }
}