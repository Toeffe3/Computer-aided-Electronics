/**
 * (Mathmatical expression Sigma) returns an array of the results of the expression
 * @param {function(n): any} callback - The expression to be evaluated called with n
 * @param {number} start - "Safe" to use -Infinity
 * @param {number} end - "Safe" to use Infinity
 * @param {boolean} [intermitent=false] - Whether to return an imediate array or a number
 * @returns {any[]|number} any[]|number
 */
function sum(callback, start, end, intermitent = false) {
    // function should handle +/-Infinity variable
    if(start === -Infinity) start = -Number.MAX_SAFE_INTEGER;
    if(end === Infinity) end = Number.MAX_SAFE_INTEGER;
    let sum = [];
    for (let n = start; n < end; n++) sum.push(callback(n));
    // if intermitent is false, return the sum as an array
    if(intermitent === true) return sum;
    // else return the sum as a number
    while(sum.length > 0) sum = sum.reduce((a, b) => a + b);
    return sum;
}

/**
 * Generator function that returns a unique id
 * @description format: xxxx-yyyy
 * @generator
 * @yields {string} string
 */
function* idGenerator() {
    let id = 0;
    while (true) {
        yield (id++).toString().padStart(4, '0') + '-' + (id++).toString().padStart(4, '0');
    }
}

// create a global id generator
const id = idGenerator();

/**
 * Generates a id formatted xxxx-yyyy
 * @returns {string} string
 */
function nextId() {
    return id.next().value;
}

/**
 * Function that executes a callback on window resize or load
 * @param {function} callback - The function to be executed
 */
function onResize(callback) {
    window.addEventListener('resize', callback);
    window.addEventListener('load', callback);
}

/**
 * A function that executes a callback with a fixed framerate using requestAnimationFrame
 * @param {function} callback - The function to be executed 
 * @param {number} fps
 * @returns {{step: (number) => {frame, fps, time, delta, animateId, steps}, status: () => {frame, fps, time, delta, animateId, steps}, start: () => {frame, fps, time, delta, animateId, steps}, stop: () => {frame, fps, time, delta, animateId, steps}}} {{step: (number) => {frame, fps, time, delta, animateId, steps}, status: () => {frame, fps, time, delta, animateId, steps}, start: () => {frame, fps, time, delta, animateId, steps}, stop: () => {frame, fps, time, delta, animateId, steps}}}
 */
function loop(callback, fps) {
    let animateId = null;
    let frame = 0;
    let time = performance.now();
    let delta = -1;
    let steps = -1;

    const animate = () => {
        let now = performance.now();
        delta = now - time;
        if (delta > 1000 / fps) {
            if(steps > 0) steps--;
            time = now;
            frame++;
            callback({frame, fps, time, delta, animateId, steps});
        }
        if(steps != 0) animateId = requestAnimationFrame(animate);
        else {
            cancelAnimationFrame(animateId);
            steps = -1;
        }
    };
    
    return {
        start: function () {
            animate();
            return {frame, fps, time, delta, animateId, steps};
        },
        stop: function () {
            steps = 0;
            return {frame, fps, time, delta, animateId, steps};
        },
        step: function (frames) {
            steps = frames;
            return {frame, fps, time, delta, animateId, steps};
        },
        status: function () {
            return {frame, fps, time, delta, animateId, steps};
        }
    };
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