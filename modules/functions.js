/**
 * A function that executes a callback with a fixed framerate using requestAnimationFrame
 * @param {loopCallback} callback - The function to be executed
 * @param {number} [target=60] - The target framerate
 * @returns {loopReturn} loopReturn
 */
export function loop(callback, target = 60) {
	let animateId = null;
	let frame = 0;
	let time = performance.now();
	let delta = -1;
	let steps = -1;
	let fps = -1;
	let cycletime = 0;

	const animate = (now) => {
		delta = Math.floor(now - time);
		if (steps === 0) {
			cancelAnimationFrame(animateId);
			steps = -1;
		} else animateId = requestAnimationFrame(animate);
		if (delta + cycletime > 1000 / target) {
			time = performance.now();
			fps = Math.round(10000 / (delta))/10;
			if (steps > 0) steps--;
			frame++;
			callback({ frame, fps, target, time, delta, animateId, steps, cycletime });
		}
	}

	return {
		start: () => animate(),
		stop: function () {
			steps = 0;
		},
		step: function (frames = 1) {
			steps = frames;
		},
		status: function () {
			return { frame, fps, target, time, delta, animateId, steps, cycletime };
		},
		onresize: function (runonce) {
			window.addEventListener('resize', runonce);
			window.addEventListener('load', runonce);
		},
		performance: function (n = 10) {
			let ct = performance.now();
			for(let i = 0; i < n; i++) callback({ frame: i, fps: target, target, time: performance.now(), delta: 1000/target, animateId: null, steps: i, cycletime });
			cycletime = (performance.now() - ct) / n;
			if(target > 1000 / cycletime) target = 1000 / cycletime;
			return cycletime;
		}

	};
}

/**
 * Inverts a HEX color string
 * @param {string} hex - HEX color string with #
 * @returns {string} string
 */
function invertColorString(hex) {
	let r = (255 - parseInt(hex.substring(1, 3), 16)).toString(16).padStart(2, '0');
	let g = (255 - parseInt(hex.substring(3, 5), 16)).toString(16).padStart(2, '0');
	let b = (255 - parseInt(hex.substring(5, 7), 16)).toString(16).padStart(2, '0');
	let o = hex.substring(7, 9); // opacity should be the same
	return '#' + r + g + b + o;
}

/**
 * Get an css variable in :root
 * @param {string} name - The name of the variable
 * @param {boolean} [number=false] - Whether to return a number
 * @returns {string|number} string|number
 */
function getCSSVariable(name, number = false) {
	let value = getComputedStyle(document.documentElement).getPropertyValue(`--${name}`);
	// remove any css units (last characters of string only)
	value = value.replace(/(px|em|rem|%|vw|vh|em)$/, '');
	if (number === true) return parseFloat(value);
	return value;
}

/**
 * Takes the window element and returns a width or height
 * @param {HTMLElement} elem 
 * @returns {{width: number, height: number}}
 */
const FIT = (elem) => {
	return {
		width: elem.scrollWidth,
		height: elem.scrollHeight
	};
}

/**
 * Generator function that returns an incrementing number
 * @generator
 * @yields {string} string
 */
 function* incrementGenerator(start = 0, padding = 4) {
	while (true) yield `${start++}`.padStart(padding, '0');
}

/**
 * Generator function that returns the lowest awailable number
 * The generator can make a number available again by calling release
 * @generator
 * @param {number} [max=99] - The maximum number to be returned
 * @param {number} [min=1] - The minimum number to be returned
 * @yields {listTrackerYield} listTrackerYield
 */
export function* listTrackerGenerator(max = 99, min = 1) {
	let list = [...Array(max - min + 1).keys()].map(x => x + min);
	while (true) yield {
		number: list.shift(),
		empty: list.length === 0,
		release: (number) => {
			// If the number is not already in the list, add it
			if (list.includes(number)) return false;
			list.push(number);
			list.sort((a, b) => a - b);
			return true;
		}
	};
	
} 

/**
 * Global incrementing number generator
 * 
 */
export const increment = incrementGenerator();

/**
 * (Mathmatical expression Sigma) returns an array of the results of the expression
 * @param {callback<number>} callback - The expression to be evaluated called with n
 * @param {number} start - "Safe" to use -Infinity
 * @param {number} end - "Safe" to use Infinity
 * @param {boolean} [intermitent=false] - Whether to return an imediate array or a number
 * @returns {any[]|number} any[]|number
 */
function sum(callback, start, end, intermitent = false) {
	// function should handle +/-Infinity variable
	if (start === -Infinity) start = -Number.MAX_SAFE_INTEGER;
	if (end === Infinity) end = Number.MAX_SAFE_INTEGER;
	let sum = [];
	for (let n = start; n < end; n++) sum.push(callback(n));
	// if intermitent is false, return the sum as an array
	if (intermitent === true) return sum;
	// else return the sum as a number
	while (sum.length > 0) sum = sum.reduce((a, b) => a + b);
	return sum;
}

/**
 * Converts radians to degrees
 * @param {number} rad - Radian value
 * @returns {number} number
 */
function radToDeg(rad) {
	return rad * 180 / Math.PI;
}

/**
 * Converts degrees to radians
 * @param {number} deg - Degree value
 * @returns {number} number
 */
function degToRad(deg) {
	return deg * Math.PI / 180;
}