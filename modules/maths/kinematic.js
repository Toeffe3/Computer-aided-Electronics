import Coordinate from './coordinate.js';
import PointVector from './pointvector.js';
/**
 * Kinematic class
 * @decsription Kinematics are used to describe the motion of objects. Often for robotics.
 * @see {@link https://en.wikipedia.org/wiki/Kinematics Kinematics on Wikipedia}
 * @module maths/kinematic
 */
export const name = 'kinematic';

export default class Kinematic {
	/**
	 * Creates a new collection of vectors depedant on each other
	 * @class
	 * @constructor
	 * @returns {Kinematic} this
	 */
	constructor() {
		this.ref = new Coordinate(0, 0);
		// an object will be created to store all vectors with a name
		this.vectors = {};
		// store how the vectors are connected
		this.assignments = {
			// parentname: [childname, childname, ...]
			ref: []
		}
		return this;
	}

	/**
	 * Add a point vector to the kinematic
	 * @param {string} name - the name of the point vector
	 * @param {PointVector} vector - the point vector
	 * @param {string} [parent='ref'] - the name of the parent point vector
	 * @returns {Kinematic} this
	 */
	connect(name, vector, parent = 'ref') {
		if(!(name in this.vectors)) this.vectors[name] = vector;
		if(!(parent in this.assignments)) this.assignments[parent] = [];
		this.assignments[parent].push(name);
		this.update();
		return this;
	}

	/**
	 * Delete a point vector from the kinematic
	 * @param {string} name - the name of the point vector
	 * @returns {Kinematic} this
	 */
	delete(name) {
		if(name in this.vectors) delete this.vectors[name];
		for(let parent in this.assignments) {
			let index = this.assignments[parent].indexOf(name);
			if(index > -1) this.assignments[parent].splice(index, 1);
		}
		this.update();
		return this;
	}
	
	/**
	 * Disconnect a point vector from the kinematic
	 * @param {string} name - the name of the point vector
	 * @returns {Kinematic|PointVector} Kinematic|PointVector
	 */
	disconnect(name) {
		// if point vector has children, create a new kinematic from name with the children
		if(this.getChildren(name).length > 0) {
			let k = new Kinematic();
			k.connect(name, this.vectors[name]);
			for(let child of this.getChildren(name))
				k.connect(child, this.vectors[child]);
			// delete the children from the original kinematic
			this.delete(name);
			// move kinematic to point of name
			k.moveTo(this.vectors[name].size(0));
			return k;
		} else {
			// if no children, just splice the parent from the assignments and vectors
			// return the spliced point vector
			let index = this.assignments[name].indexOf(name);
			if(index > -1) {
				this.assignments[name].splice(index, 1);
				const vector = this.vectors[name];
				delete this.vectors[name];
				this.update();
				return vector;
			}
		}
	}
	
	/**
	 * Find the parent of a point vector
	 * @param {string} name - the name of the point vector
	 * @returns {string} string
	 */
	findParent(name) {
		for(let parent in this.assignments) if(this.assignments[parent].indexOf(name) !== -1) return parent;
		return null;
	}
	
	/**
	 * Get the children of a point vector
	 * @param {string} name - the name of the point vector
	 * @returns {string[]} string[]
	 */
	getChildren(name) {
		if(!(name in this.assignments)) return [];
		return this.assignments[name];
	}
	
	/**
	 * Triggles a function call down (its children) with a dynamic argument
	 * @param {string} name - the name of the point vector
	 * @param {callbackVoid<Array>} func - the function to execute
	 * @param {dynamicAgrumentCallback<Kinematic>} argfunc - the arguments to pass to the function
	 * @returns {Kinematic} this
	 */
	execute(name, func, argfunc) {
		// ref is allowed, but should skip execution
		if(name !== "ref") {
			// if the point vector is not in the kinetic
			if(!(name in this.vectors)) return 0;
			// execute the function on the point vector
			this.vectors[name] = this.vectors[name][func](...argfunc(this, name));
		}
		// execute the function on all child vectors
		for(let child of this.getChildren(name)) this.execute(child, func, argfunc);
		return this;
	}
	
	/**
	 * Triggles a function call up (its parents) with a dynamic argument
	 * @param {string} name - the name of the point vector
	 * @param {function} func - the function to execute
	 * @param {dynamicAgrumentCallback<Kinematic>} argfunc - the arguments to pass to the function
	 * @returns {Kinematic} this
	 */
	reverseExecute(name, func, argfunc) {
		if(name !== "ref") {
			// if the point vector is not in the kinetic
			if(!(name in this.vectors)) return 0;
			// execute the function on the point vector
			this.vectors[name] = this.vectors[name][func](...argfunc(this, name));
		}
		// execute the function on the parent
		this.reverseExecute(this.findParent(name), func, argfunc);
		return this;
	}
	
	/**
	 * Execute a function on all vectors
	 * @param {function} func - the function to execute
	 * @param {dynamicAgrumentCallback<Kinematic>} argfunc
	 */
	executeAll(func, argfunc) {
		for(let name in this.vectors) this.vectors[name][func](...argfunc(this, name));
		return this;
	}
	
	/**
	 * Find the depth of a point vector relative to a reference
	 * @recursive
	 * @param {string} name - the name of the point vector
	 * @param {string} [ref='ref'] - the name of the reference
	 * @returns {number} number
	 */
	depth(name, ref='ref') {
		if(!(name in this.vectors)) return 0;
		if(this.findParent(name) === ref) return 1;
		return 1 + this.depth(this.findParent(name), ref);
	}
	
	/**
	 * Find the maximum depth of the kinematic
	 * @recursive
	 * @returns {number} number
	 */
	maxDepth() {
		let max = 0;
		for(let name in this.vectors) max = Math.max(max, this.depth(name));
		return max;
	}

	/**
	 * Find all vectors of a certain depth
	 * @param {number} depth - the depth of the vectors
	 * @returns {PointVector[]} PointVector[]
	 */
	getDepth(depth) {
		let vectors = [];
		for(let name in this.vectors) if(this.depth(name) === depth) vectors.push(this.vectors[name]);
		return vectors;
	}
	
	/**
	 * Find the deepest vectors
	 * @description All vectors returned are of the same depth
	 * @returns {PointVector[]} PointVector[]
	 */
	getDeepest() {
		let vectors = [];
		const depth = this.maxDepth();
		for(let name in this.vectors) if(this.depth(name) === depth) vectors.push(this.vectors[name]);
		return vectors;
	}
	
	/**
	 * Get the point of the outermost vectors
	 * @returns {Coordinate[]} Coordinate[]
	 */
	getDeepestPoints() {
		let points = [];
		for(let vector of this.getDeepest()) points.push(vector.getPoint());
		return points;
	}
	
	/**
	 * Get the tips of the kinematic
	 * @description The tips are vectors that do not have any children
	 * @returns {PointVector[]} PointVector[]
	 */
	getTips() {
		let tips = [];
		for(let name in this.vectors) if(this.getChildren(name).length === 0) tips.push(this.vectors[name]);
		return tips;
	}
	
	/**
	 * Get the points of the tips
	 * @returns {Coordinate[]} Coordinate[]
	 */
	getTipsPoint() {
		let points = [];
		for(let vector of this.getTips()) points.push(vector.getPoint());
		return points;
	}
	
	/**
	 * Update the kinematic
	 * @description The update function is called on all vectors in the kinematic
	 * @returns {Kinematic} this
	 */
	update() {
		this.execute('ref', 'pathify', (kinetic, name) => [kinetic.vectors[kinetic.findParent(name)]]);
		return this;
	}
	
	/**
	 * Draw the kinematic
	 * @param {Graph} canvas - the canvas class to draw on
	 * @param {Style} style - the color of the kinematic
	 * @returns {Kinematic} this
	 */
	draw(canvas, style) {
		this.update();
		for(let name in this.vectors) canvas.drawVector(this.vectors[name], style, "origo");
		return this;
	}
	
}
