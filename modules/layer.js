import Graph from './graph.js';
/**
 * Layer class
 * @description This class is used to stack multiple canvases on top of each other
 * @module layer
 */
export const name = 'layer';
export default class Layered {
	/**
	 * Creates a new layered object
	 * @class
	 * @param {HTMLElement} htmlhook - the html element to attach the canvas to
	 * @param {windowOptions} options - the options for the window
	 * @returns {Layered} this
	 */
	constructor(htmlhook, options = {}) {
		/** @type {Object<string, Graph>} */
		this.layers = {};
		/** @type {windowOptions} */
		this.options = options;
		/** @type {HTMLDivElement} */
		this.htmlhook = htmlhook;
		return this;
	}

	/**
	 * Adds a layer to the layers array
	 * @description Layers are drawn in the order they are added (last added is on top)
	 * @param {string} name - the name of the layer
	 * @param {HTMLDivElement?} appendTo - the html element to append the layer to
	 * @returns {Layered} this
	 */
	addLayer(name, appendTo = this.htmlhook) {
		this.layers[name] = new Graph();
		appendTo.appendChild(this.layers[name].canvas);
		this.layers[name].update(this.options.width, this.options.height, this.options.origoX, this.options.origoY);
		this.layers[name].canvas.id = `${name}-canvas`;
		this.layers[name].canvas.classList.add("layer");
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
	 * Get the window the layer is attached to
	 * @returns {HTMLElement} the window
	 */
	getWindow() {
		return this.htmlhook.parentElement;
	}

	/**
	 * Call a function on all layers
	 * @param {layerCallback} func - the function to be called
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
	 * @param {layerCallback} func - the function to be called
	 * @param {string[]} names - the names of the layers to be called
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