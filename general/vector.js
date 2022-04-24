// class that implemants a vector with magnitude and angle and mave a point
class Vector extends Grid {
    constructor(magnitude, angle) {
        super(0, 0);
        this.magnitude = magnitude;
        this.angle = angle;
    }
    // Returns a string representation of the Vector
    toString() {
        return `${this.magnitude} ∠${this.angle}° @ ${super.toString}`;
    }
    // Return the magnitude
    getMagnitude() {
        return Math.abs(this.magnitude); // Negative value should not appere, but just in case
    }
    // Return the angle
    getAngle() {
        return this.angle;
    }
    // get the cordinates this vector points to
    getPoint() {
        return this.size(0).move(
            this.magnitude * Math.cos(this.angle) + this.x,
            this.magnitude * Math.sin(this.angle) + this.y);
    }
    // Point this vector to a point
    point(point) {
        const {x, y} = point.getCordinate();
        // calculate new angle
        this.angle = Math.atan2(y - this.y, x - this.x);
        this.angle %= 2 * Math.PI;
        while(this.angle < 0) this.angle += 2 * Math.PI;
        // calculate new magnitude
        this.magnitude = Math.sqrt(Math.pow(x - this.x, 2) + Math.pow(y - this.y, 2));
    }
    // set magnitude and angle
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
    // add to the length of this vector
    length(length) {
        if (this.magnitude + length < 0) this.angle += Math.PI;
        else this.magnitude += length;
        return this;
    }
    // Scale magnitude by a factor
    scale(factor) {
        if (factor < 0) this.angle += Math.PI;
        else this.magnitude *= factor;
        return this;
    }
    // Set the magnitude to a new value
    // if new magnitude is 0 the Grid equvilant will be returned and vector unchanged
    size(magnitude) {
        if(magnitude === 0) return super.copy(); // to set size to 0 use scale(0)
        else if(magnitude < 0) {
            this.angle += Math.PI;
            this.angle %= 2 * Math.PI;
            magnitude = -magnitude;
        } else this.magnitude = magnitude;
        return this;
    }
    // Rotate vector by an angle and ensure it stays between 0 and 2π
    rotate(angle) {
        this.angle += angle;
        this.angle %= 2 * Math.PI;
        while(this.angle < 0) this.angle += 2 * Math.PI;
        return this;
    }
    // Direct the vector to a new angle
    direct(angle) {
        this.angle = angle;
        this.angle %= 2 * Math.PI;
        while(this.angle < 0) this.angle += 2 * Math.PI;
        return this;
    }
    // Add a vector to this vector
    add(vector) {
        this.magnitude += vector.magnitude;
        this.magnitude = Math.abs(this.magnitude);
        this.angle += vector.angle;
        this.angle %= 2 * Math.PI;
        return this;
    }
    // Subtract a vector from this vector
    subtract(vector) {
        this.magnitude -= vector.magnitude;
        this.magnitude = Math.abs(this.magnitude);
        this.angle -= vector.angle;
        while(this.angle < 0) this.angle += 2 * Math.PI;
        return this;
    }
    // multiply a vector to this vector
    multiply(vector) {
        this.magnitude *= vector.magnitude;
        this.angle *= vector.angle;
        this.angle %= 2 * Math.PI;
        while(this.angle < 0) this.angle += 2 * Math.PI;
        return this;
    }
    // devide a vector to this vector
    devide(vector) {
        this.magnitude /= vector.magnitude;
        this.angle /= vector.angle;
        this.angle %= 2 * Math.PI;
        while(this.angle < 0) this.angle += 2 * Math.PI;
        return this;
    }
    // get the dot product of this vector and another vector
    dot(vector) {
        return this.magnitude * vector.magnitude * Math.cos(this.angle - vector.angle);
    }
    // get the cross product of this vector and another vector
    cross(vector) {
        return this.magnitude * vector.magnitude * Math.sin(this.angle - vector.angle);
    }
    // get the angle between this vector and another vector
    angleBetween(vector) {
        return Math.acos(this.dot(vector) / (this.magnitude * vector.magnitude));
    }
    // get the distance between this vector and another vector
    distance(vector) {
        return Math.sqrt(Math.pow(this.magnitude - vector.magnitude, 2) + Math.pow(this.angle - vector.angle, 2));
    }
    // get the unit vector of this vector
    unit() {
        return new Vector(1, this.angle);
    }
    // Normalize this vector
    normalize() {
        this.magnitude = 1;
        return this;
    }
    // get the normalized vector of this vector
    normalized() {
        return this.unit();
    }
    // get the perpendicular vector of this vector
    perpendicular() {
        return new Vector(this.magnitude, this.angle + Math.PI / 2);
    }
    // get spacial cordinates of this vector
    spacial() {
        return {
            x1: this.x,
            y1: this.y,
            x2: this.magnitude * Math.cos(this.angle) + this.x,
            y2: this.magnitude * Math.sin(this.angle) + this.y
        };
    }
    // inverte the vector
    invert() {
        this.angle += Math.PI;
        this.angle %= 2 * Math.PI;
        return this;
    }
    // copy vector
    copy() {
        return new Vector(this.magnitude, this.angle);
    }
    // check if to vectors are equal
    equals(vector) {
        return this.magnitude === vector.magnitude && this.angle === vector.angle;
    }
    // check if this vector is zero
    isZero() {
        return this.magnitude === 0;
    }
    // check is vectors are parallel
    isParallel(vector) {
        return Math.abs(this.angle) === Math.abs(vector.angle);
    }
    // check if vectors are perpendicular
    isPerpendicular(vector) {
        return this.dot(vector) === 0;
    }
    // Move this to which vector points to
    pathify(vector) {
        this.cordinate(vector.getPoint());
        return this;
    }
}