// create a sum expression that makes an array of the results
function sum(callback, start, end) {
    // function should handle +/-Infinity variable
    if(start === -Infinity) start = -Number.MAX_SAFE_INTEGER;
    if(end === Infinity) end = Number.MAX_SAFE_INTEGER;
    let sum = [];
    for (let n = start; n < end; n++) sum.push(callback(n));
    return sum;
}

// generator function that returns a unique id
// format as xxxx-yyyy
function* idGenerator() {
    let id = 0;
    while (true) {
        yield (id++).toString().padStart(4, '0') + '-' + (id++).toString().padStart(4, '0');
    }
}
// create a global id generator
const id = idGenerator();

// global id generator
function nextId() {
    return id.next().value;
}

// function that executes a callback on window resize or load
function onResize(callback) {
    window.addEventListener('resize', callback);
    window.addEventListener('load', callback);
}

// function that executes a callback with a fixed framerate using requestAnimationFrame
// the function should return a start stop and step function
// the callback should be called with the frame number
function loop(callback, fps) {
    let animateId = null;
    let frame = 0;
    let time = performance.now();
    let delta = -1;
    let steps = -1;

    // the looping control function
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
    
    // user can control the loop with these functions
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

// rad to deg
function radToDeg(rad) {
    return rad * 180 / Math.PI;
}
//deg to rad
function degToRad(deg) {
    return deg * Math.PI / 180;
}

// invert a hex color string
function invertColorString(hex) {
    let r = (255 - parseInt(hex.substring(1, 3), 16)).toString(16).padStart(2, '0');
    let g = (255 - parseInt(hex.substring(3, 5), 16)).toString(16).padStart(2, '0');
    let b = (255 - parseInt(hex.substring(5, 7), 16)).toString(16).padStart(2, '0');
    let o = hex.substring(7, 9); // opacity should be the same
    return '#' + r + g + b + o;
}