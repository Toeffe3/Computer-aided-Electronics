/**
 * Create a coordinate point
 * @class Coordinate
 * @see {@link https://en.wikipedia.org/wiki/Cartesian_coordinate_system Cartesian coordinate system on Wikipedia}
 */
export default class Coordinate {
    /**
     * @constructor
     * @param {number} x - x position
     * @param {number} y - y position
     * @return {Coordinate} this
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
     * Get the coordinate as an object
     * @returns {{x, y}} {x, y}
     */
    getCoordinate() {
        return { x: this.x, y: this.y };
    }

    /**
     * Get the coordinate as a string
     * @override
     * @returns {string} string
     */
    toString() {
        return `${this.x},${this.y}`;
    }

    /**
     * Get the distance between this coordinate and another
     * @param {Coordinate} cord - coordinate to calculate distance to
     * @return {number} number
     */
    distance(cord) {
        return Math.sqrt(
            Math.pow(cord.x - this.x, 2) + 
            Math.pow(cord.y - this.y, 2)
        );
    }

    /**
     * Get the angle between this coordinate and another
     * @param {Coordinate} cord - coordinate to calculate angle to
     * @return {number} number
     */
    angle(cord) {
        return Math.atan2(cord.y - this.y, cord.x - this.x);    
    }

    /**
     * Move this coordinate to another
     * @param {Coordinate} cord - coordinate to move to
     * @return {Coordinate} this
     */
    coordinate(cord) {
        this.x = cord.x;
        this.y = cord.y;
        return this;
    }
    
    /**
     * Move this coordinate to another
     * @param {number} x - x position
     * @param {number} y - y position
     * @return {Coordinate} this
     */
    move(x, y) {
        this.x = x;
        this.y = y;
        return this;
    }
    
    /**
     * Set the point back to the origin
     * @returns {Coordinate} this
     */
    origin() {
        this.x = 0;
        this.y = 0;
        return this;
    }
    
    /**
     * Get a new coordinate that is a copy of this one
     * @return {Coordinate} Coordinate
     */
    copy() {
        return new Coordinate(this.x, this.y);
    }
}