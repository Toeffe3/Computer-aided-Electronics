/**
 * Creates a ecluidean vector (magnitude and angle)
 * @description The vector can also be moved in the cartesian plane.
 * @class Vector
 * @extends {Cordinate}
 * @see {@link https://en.wikipedia.org/wiki/Euclidean_vector Euclidean vector on Wikipedia}
 */
class Vector extends Cordinate {
    /**
     * Create a new euclidean vector
     * @constructor
     * @param {number} magnitude - The magnitude of the vector
     * @param {number} angle - The angle of the vector
     * @returns {Vector} this
     */
    constructor(magnitude, angle) {
        super(0, 0);
        this.magnitude = magnitude;
        this.angle = angle;
        return this;
    }
    
    /**
     * Retruns a string detailing the vector
     * @override
     * @returns {string} string
     */
    toString() {
        return `${this.magnitude} ∠${this.angle}° @ ${super.toString}`;
    }
    
    /**
     * Get the magnitude of this vector
     * @returns {number} number
     */
    getMagnitude() {
        return Math.abs(this.magnitude); // Negative value should not appere, but just in case
    }
    
    /**
     * Get the angle of this vector
     * @returns {number} number
     */
    getAngle() {
        return this.angle;
    }
    
    /**
     * Get the cordinates this vector points to
     * @returns {Cordinate} Cordinate
     */
    getPoint() {
        return this.size(0).move(
            this.magnitude * Math.cos(this.angle) + this.x,
            this.magnitude * Math.sin(this.angle) + this.y);
    }

    /**
     * Get the cordinate this vector points to
     * @override
     * @returns {{x, y}} {x, y}
     */
    getCordinate() {
        return this.getPoint().getCordinate();
    }
    
    /**
     * Point this vector to a point
     * @param {Cordinate|Vector} to - Point this vector to cordinate or another vector
     * @returns {Vector} this
     */
    point(to) {
        const {x, y} = to.getCordinate();
        // calculate new angle
        this.angle = Math.atan2(y - this.y, x - this.x);
        this.angle %= 2 * Math.PI;
        while(this.angle < 0) this.angle += 2 * Math.PI;
        // calculate new magnitude
        this.magnitude = Math.sqrt(Math.pow(x - this.x, 2) + Math.pow(y - this.y, 2));
        return this;
    }
    
    /**
     * Set the magnitude and angle of this vector
     * @param {number} magnitude - The magnitude of the vector
     * @param {number} angle - The angle of the vector
     * @returns {Vector} this
     */
    set(magnitude, angle) {
        if(magnitude < 0) {
            angle += Math.PI;
            angle %= 2 * Math.PI;
            magnitude = -magnitude;
        } else {
            this.magnitude = magnitude;
            this.angle = angle;
            this.angle %= 2 * Math.PI;
            while(this.angle < 0) this.angle += 2 * Math.PI;
        }
        return this;
    }
    
    /**
     * Add to the length of this vector
     * @param {number} length - The length to add
     * @returns {Vector} this
     */
    length(length) {
        if (this.magnitude + length < 0) this.angle += Math.PI;
        else this.magnitude += length;
        return this;
    }
    
    /**
     * Scale the magnitude of this vector by a factor
     * @param {number} factor - The factor to scale the magnitude by
     * @returns {Vector} this
     */
    scale(factor) {
        if (factor < 0) this.angle += Math.PI;
        else this.magnitude *= factor;
        return this;
    }
    
    /**
     * Set the magnitude of this vector, if the new magnitude is 0 the Cordinate equvilant will be returned and vector unchanged
     * @param {number} magnitude - The magnitude of the vector
     * @returns {Cordinate|Vector} Cordinate or this
     */
    size(magnitude) {
        if(magnitude === 0) return super.copy(); // to set size to 0 use scale(0)
        else if(magnitude < 0) {
            this.angle += Math.PI;
            this.angle %= 2 * Math.PI;
            magnitude = -magnitude;
        } else this.magnitude = magnitude;
        return this;
    }

    /**
     * Rotate this vector by an angle and ensure it stays between 0 and 2π
     * @param {number} angle - The angle to rotate by
     * @returns {Vector} this
     */
    rotate(angle) {
        this.angle += angle;
        this.angle %= 2 * Math.PI;
        while(this.angle < 0) this.angle += 2 * Math.PI;
        return this;
    }
    
    /**
     * Direct the vector to a new angle
     * @param {number} angle - The angle to direct to
     * @returns {Vector} this
     */
    direct(angle) {
        this.angle = angle;
        this.angle %= 2 * Math.PI;
        while(this.angle < 0) this.angle += 2 * Math.PI;
        return this;
    }
    
    /**
     * Add a vector to this vector
     * @param {Vector} vector - The vector to add
     * @returns {Vector} this
     */
    add(vector) {
        this.magnitude += vector.magnitude;
        this.magnitude = Math.abs(this.magnitude);
        this.angle += vector.angle;
        this.angle %= 2 * Math.PI;
        return this;
    }
    
    /**
     * Subtract a vector from this vector
     * @param {Vector} vector - The vector to subtract
     * @returns {Vector} this
     */
    subtract(vector) {
        this.magnitude -= vector.magnitude;
        this.magnitude = Math.abs(this.magnitude);
        this.angle -= vector.angle;
        while(this.angle < 0) this.angle += 2 * Math.PI;
        return this;
    }
    
    /**
     * Multiply this vector by another vector
     * @param {Vector} vector - The vector to multiply by
     * @returns {Vector} this
     */
    multiply(vector) {
        this.magnitude *= vector.magnitude;
        this.angle *= vector.angle;
        this.angle %= 2 * Math.PI;
        while(this.angle < 0) this.angle += 2 * Math.PI;
        return this;
    }
    
    /**
     * Divide this vector by another vector
     * @param {Vector} vector - The vector to divide by
     * @returns {Vector} this
     */
    devide(vector) {
        this.magnitude /= vector.magnitude;
        this.angle /= vector.angle;
        this.angle %= 2 * Math.PI;
        while(this.angle < 0) this.angle += 2 * Math.PI;
        return this;
    }

    /**
     * Get the dot product of this vector and another vector
     * @param {Vector} vector - The vector to get the dot product of
     * @returns {number} number
     */
    dot(vector) {
        return this.magnitude * vector.magnitude * Math.cos(this.angle - vector.angle);
    }

    /**
     * Get the cross product of this vector and another vector
     * @param {Vector} vector - The vector to get the cross product of
     * @returns {number} number
     */
    cross(vector) {
        return this.magnitude * vector.magnitude * Math.sin(this.angle - vector.angle);
    }

    /**
     * Get the angle between this vector and another vector
     * @param {Vector} vector - The vector to get the angle between
     * @returns {number} number between 0 and 2π
     */
    angleBetween(vector) {
        return Math.acos(this.dot(vector) / (this.magnitude * vector.magnitude));
    }

    /** 
     * Get the distance between this vector and another vector
     * @param {Vector} vector - The vector to get the distance between
     * @returns {number} number
     */
    distance(vector) {
        return Math.sqrt(Math.pow(this.magnitude - vector.magnitude, 2) + Math.pow(this.angle - vector.angle, 2));
    }

    /**
     * Get the unit vector of this vector
     * @returns {Vector} Vector
     */
    unit() {
        return new Vector(1, this.angle);
    }

    /**
     * Normalize this vector
     * @returns {Vector} this
     */
    normalize() {
        this.magnitude = 1;
        return this;
    }

    /**
     * Get the perpendicular vector of this vector
     * @returns {Vector} Vector
     */
    perpendicular() {
        return new Vector(this.magnitude, this.angle + Math.PI / 2);
    }
    /**
     * Get spacial cordinates of this vector
     * @returns {Cordinate} Coordinates
     */
    spacial() {
        return {
            x1: this.x,
            y1: this.y,
            x2: this.magnitude * Math.cos(this.angle) + this.x,
            y2: this.magnitude * Math.sin(this.angle) + this.y
        };
    }

    /**
     * Inverte the vector
     * @returns {Vector} this
     */
    invert() {
        this.angle += Math.PI;
        this.angle %= 2 * Math.PI;
        return this;
    }
    
    /**
     * Copy this vector
     * @override
     * @returns {Vector} Vector
     */
    copy() {
        return new Vector(this.magnitude, this.angle);
    }

    /**
     * Check if to vectors are equal
     * @param {Vector} vector - The vector to check against
     * @returns {boolean} boolean
     */
    equals(vector) {
        return this.magnitude === vector.magnitude && this.angle === vector.angle;
    }

    /**
     * Check if this vector is zero
     * @returns {boolean} boolean
     */
    isZero() {
        return this.magnitude === 0;
    }

    /**
     * Check if this vector is parallel to another vector
     * @description return 1 if vectors are parallel or -1 if vectors are antiparallel
     * @param {Vector} vector - The vector to check against
     * @param {number} [tolerance=0.005] - The tolerance to use default 0.005
     * @returns {1|-1|0} -1|0|1
     */
    isParallel(vector, tolerance = 0.005) {
        const angle = this.angleBetween(vector);
        if(angle < tolerance) return 1;
        else if(angle > Math.PI - tolerance) return -1;
        else return 0;
    }

    /**
     * Check if vectors are perpendicular
     * @param {Vector} vector - The vector to check against
     * @returns {boolean} boolean
     */
    isPerpendicular(vector) {
        return this.dot(vector) === 0;
    }

    /** 
     * Move this to which vector points to
     * @param {Vector} vector - The vector to move to
     * @returns {Vector} this
     */
    pathify(from) {
        if(from instanceof Vector) this.cordinate(from.getPoint());
        else if(from instanceof Cordinate) this.cordinate(from.getCordinate());
        return this;
    }

    /**
     * Get the point of intersection of this vector and another vector
     * @see https://en.wikipedia.org/wiki/Line%E2%80%93line_intersection
     * @param {Vector} vector - The vector to get the intersection of
     * @returns {Cordinate} Cordinate
     */
    intersection(vector) {
        const v1 = this.spacial(),
              v2 = vector.spacial(),
              x  = (v2.x2 - v2.x1) / (v1.x2 - v1.x1),
              y  = (v2.y2 - v2.y1) / (v1.y2 - v1.y1);
        if(x >= 0 && x <= 1 && y >= 0 && y <= 1) return new Cordinate(0,0).move(
            v1.x1 + x * (v1.x2 - v1.x1),
            v1.y1 + y * (v1.y2 - v1.y1)
        );
    }
    
    /**
     * Get the projection of this vector on another vector
     * @see {@link https://en.wikipedia.org/wiki/Vector_projection}
     * @param {Vector} vector - The vector to get the projection of
     * @returns {Vector[]} Vector[]
     */
    static project(a, b) {
        if(b.isZero()) return [];
        const angle = a.angleBetween(b);
        a1 = new Vector(a.magnitude * Math.cos(angle), a.angle + angle);
        a2 = a1.copy().add(a);
        return [a1, a2];
    }
}