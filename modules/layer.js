/**
 * Class that holds layers of canvasses or graphs
 * @class Layered
 * @property {windowOptions} options - the options for the window
 * @property {Array<Canvas|Graph>} layers - the layers in the layer
 * @property {HTMLElement} htmlhook - the element to which the layer is attached
 */
 export default class Layered {
	/**
	 * Creates a new layered object
	 * @param {HTMLElement} htmlhook - the html element to attach the canvas to
	 * @param {windowOptions} options - the options for the window
	 * @returns {Layered} this
	 */
	constructor(htmlhook, options = {}) {
		this.layers = {};
		/** @type {windowOptions} */
		this.options = options;
		this.htmlhook = htmlhook;
		return this;
	}

	/**
	 * Adds a layer to the layers array
	 * @description Layers are drawn in the order they are added (last added is on top)
	 * @param {Graph} layer - the layer to be added
	 * @param {string} name - the name of the layer
	 * @param {HTMLElement?} appendTo - the html element to append the layer to, default is the body
	 * @returns {Layered} this
	 */
	addLayer(layer, name, appendTo = this.htmlhook) {
		this.layers[name] = layer;
		appendTo.appendChild(layer.canvas);
		layer.update(this.options.width, this.options.height, this.options.origoX, this.options.origoY);
		layer.canvas.id = `${name}-canvas`;
		layer.canvas.classList.add("layer");
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