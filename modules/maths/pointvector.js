import Coordinate from './coordinate.js';
/** 
 * Vector class
 * @description Ecluidean vector is of magnitude and angle, not a matrix vector
 * @see {@link https://en.wikipedia.org/wiki/Euclidean_vector Euclidean vector on Wikipedia}
 * @module maths/pointvector
 */
export const name = 'pointvector';

export default class PointVector extends Coordinate {
	/**
	 * Create a new euclidean vector
	 * @class
	 * @extends {Coordinate}
	 * @constructor
	 * @param {number} magnitude - The magnitude of the vector
	 * @param {number} angle - The angle of the vector
	 * @returns {PointVector} this
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
	 * Get the coordinates this vector points to
	 * @returns {Coordinate} Coordinate
	 */
	getPoint() {
		return this.size(0).move(
			this.magnitude * Math.cos(this.angle) + this.x,
			this.magnitude * Math.sin(this.angle) + this.y);
	}

	/**
	 * Get the coordinate this vector points to
	 * @override
	 * @returns {{x: number, y: number}}
	 */
	getCoordinate() {
		return this.getPoint().getCoordinate();
	}
	
	/**
	 * Point this vector to a point
	 * @param {Coordinate|PointVector} to - Point this vector to coordinate or another vector
	 * @returns {PointVector} this
	 */
	point(to) {
		const {x, y} = to.getCoordinate();
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
	 * @returns {PointVector} this
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
	 * @returns {PointVector} this
	 */
	length(length) {
		if (this.magnitude + length < 0) this.angle += Math.PI;
		else this.magnitude += length;
		return this;
	}
	
	/**
	 * Scale the magnitude of this vector by a factor
	 * @param {number} factor - The factor to scale the magnitude by
	 * @returns {PointVector} this
	 */
	scale(factor) {
		if (factor < 0) this.angle += Math.PI;
		else this.magnitude *= factor;
		return this;
	}
	
	/**
	 * Set the magnitude of this vector, if the new magnitude is 0 the Coordinate equvilant will be returned and vector unchanged
	 * @param {number} magnitude - The magnitude of the vector
	 * @returns {Coordinate|PointVector} Coordinate or this
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
	 * @returns {PointVector} this
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
	 * @returns {PointVector} this
	 */
	direct(angle) {
		this.angle = angle;
		this.angle %= 2 * Math.PI;
		while(this.angle < 0) this.angle += 2 * Math.PI;
		return this;
	}
	
	/**
	 * Add a vector to this vector
	 * @param {PointVector} vector - The vector to add
	 * @returns {PointVector} this
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
	 * @param {PointVector} vector - The vector to subtract
	 * @returns {PointVector} this
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
	 * @param {PointVector} vector - The vector to multiply by
	 * @returns {PointVector} this
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
	 * @param {PointVector} vector - The vector to divide by
	 * @returns {PointVector} this
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
	 * @param {PointVector} vector - The vector to get the dot product of
	 * @returns {number} number
	 */
	dot(vector) {
		return this.magnitude * vector.magnitude * Math.cos(this.angle - vector.angle);
	}

	/**
	 * Get the cross product of this vector and another vector
	 * @param {PointVector} vector - The vector to get the cross product of
	 * @returns {number} number
	 */
	cross(vector) {
		return this.magnitude * vector.magnitude * Math.sin(this.angle - vector.angle);
	}

	/**
	 * Get the angle between this vector and another vector
	 * @param {PointVector} vector - The vector to get the angle between
	 * @returns {number} number between 0 and 2π
	 */
	angleBetween(vector) {
		return Math.acos(this.dot(vector) / (this.magnitude * vector.magnitude));
	}

	/** 
	 * Get the distance between this vector and another vector
	 * @param {PointVector} vector - The vector to get the distance between
	 * @returns {number} number
	 */
	distance(vector) {
		return Math.sqrt(Math.pow(this.magnitude - vector.magnitude, 2) + Math.pow(this.angle - vector.angle, 2));
	}

	/**
	 * Get the unit vector of this vector
	 * @returns {PointVector} Vector
	 */
	unit() {
		return new PointVector(1, this.angle);
	}

	/**
	 * Normalize this vector
	 * @returns {PointVector} this
	 */
	normalize() {
		this.magnitude = 1;
		return this;
	}

	/**
	 * Get the perpendicular vector of this vector
	 * @returns {PointVector} Vector
	 */
	perpendicular() {
		return new PointVector(this.magnitude, this.angle + Math.PI / 2);
	}
	/**
	 * Get spacial coordinates of this vector
	 * @returns {{x1: number, y1: number, x2: number, y2: number}}
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
	 * @returns {PointVector} this
	 */
	invert() {
		this.angle += Math.PI;
		this.angle %= 2 * Math.PI;
		return this;
	}
	
	/**
	 * Copy this vector
	 * @override
	 * @returns {PointVector} Vector
	 */
	copy() {
		return new PointVector(this.magnitude, this.angle);
	}

	/**
	 * Check if to vectors are equal
	 * @param {PointVector} vector - The vector to check against
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
	 * @param {PointVector} vector - The vector to check against
	 * @param {number} [tolerance=0.005] - The tolerance to use default 0.005
	 * @returns {Tribool}
	 */
	isParallel(vector, tolerance = 0.005) {
		const angle = this.angleBetween(vector);
		if(angle < tolerance) return 1;
		else if(angle > Math.PI - tolerance) return -1;
		else return 0;
	}

	/**
	 * Check if vectors are perpendicular
	 * @param {PointVector} vector - The vector to check against
	 * @returns {boolean} boolean
	 */
	isPerpendicular(vector) {
		return this.dot(vector) === 0;
	}

	/** 
	 * Move this to which vector points to
	 * @param {PointVector} vector - The vector to move to
	 * @returns {PointVector} this
	 */
	pathify(from) {
		if(from instanceof PointVector) this.coordinate(from.getPoint());
		else if(from instanceof Coordinate) this.coordinate(from.getCoordinate());
		return this;
	}

	/**
	 * Get the point of intersection of this vector and another vector
	 * @see https://en.wikipedia.org/wiki/Line%E2%80%93line_intersection
	 * @param {PointVector} vector - The vector to get the intersection of
	 * @returns {Coordinate} Coordinate
	 */
	intersection(vector) {
		const v1 = this.spacial(),
			  v2 = vector.spacial(),
			  x  = (v2.x2 - v2.x1) / (v1.x2 - v1.x1),
			  y  = (v2.y2 - v2.y1) / (v1.y2 - v1.y1);
		if(x >= 0 && x <= 1 && y >= 0 && y <= 1) return new Coordinate(0,0).move(
			v1.x1 + x * (v1.x2 - v1.x1),
			v1.y1 + y * (v1.y2 - v1.y1)
		);
	}
	
	/**
	 * Get the projection of this vector on another vector
	 * @see {@link https://en.wikipedia.org/wiki/Vector_projection}
	 * @param {PointVector} vector - The vector to get the projection of
	 * @returns {PointVector[]} Vector[]
	 */
	static project(a, b) {
		if(b.isZero()) return [];
		const angle = a.angleBetween(b);
		a1 = new PointVector(a.magnitude * Math.cos(angle), a.angle + angle);
		a2 = a1.copy().add(a);
		return [a1, a2];
	}
}