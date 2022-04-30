/**
 * Series are mathimatical collection of arrays
 * @class Series
 */
class Series {
    /**
     * @constructor
     * @param {string} name - name of series
     * @param {number} sampleRate - sample rate of series
     * @param {number[]} data - data of series
     * @returns {Series} this
     */
    constructor(name, sampleRate, data) {
        this.name = name;
        this.sampleRate = sampleRate;
        this.offset = {
            leading: 0,
            trailing: 0
        };
        this.data = data;
    }
    
    /**
     * Get the data of the series
     * @returns {number[]} data
     */
    getData() {
        return {data: this.data};
    }

    /**
     * Get the time of the series
     * @returns {number[]} time
     */
    getTime() {
        return {time: [...Array(this.data.length).keys()].map(x => x / this.sampleRate + this.offset.leading)};
    }

    /**
     * Get the time and data of the series
     * @returns {{time: number[], data: number[]}} {time: number[], data: number[]}
     */
    getSeries() {
        return {
            ...this.getTime(),
            ...this.getData()
        }
    }
    
    /**
     * Eliminate the offset by padding data array with leading/trailing zeros
     * @returns {Series} this
     */
    expand() {
        this.data = [...Array(this.offset.leading).keys()].map(x => 0).concat(this.data) // Pad leading zeros
            .concat([...Array(this.offset.trailing).keys()].map(x => 0)); // Pad trailing zeros
        this.offset = {
            leading: 0,
            trailing: 0
        };
        return this;
    }
    
    /**
     * Remove leading/trailing zeros and set the offset
     * @returns {Series} this
     */
    trim() {
        while (this.data[0] === 0) {
            this.offset.leading++;
            this.data.shift();
        }
        while (this.data[this.data.length - 1] === 0) {
            this.offset.trailing++;
            this.data.pop();
        }
        return this;
    }
    
    /**
     * Change the sample rate of the series
     * @param {number} newSampleRate - new sample rate
     * @returns {Series} this
     */
    resample(newSampleRate) {
        this.sampleRate = newSampleRate;
        this.data = this.data.map(x => x * newSampleRate / this.sampleRate);
        return this;
    }

    /**
     * Create a series of a cosinus wave
     * @static
     * @param {number} frequency - frequency of the wave
     * @param {number} amplitude - amplitude of the wave
     * @param {number} sampleRate - sample rate of the wave
     * @param {number} duration - duration of the wave
     * @param {number} yoffset - offset of the wave
     * @returns {Series} Series
     */
    static cosineWave(frequency, amplitude, sampleRate, duration, yoffset) {
        const time = [...Array(sampleRate * duration).keys()].map(x => x / sampleRate);
        return new Series("cosine", sampleRate, time.map(x => yoffset + (amplitude * Math.cos(2 * Math.PI * frequency * x))));
    }
    
    /**
     * Create a series of a sine wave
     * @static
     * @param {number} frequency - frequency of the wave
     * @param {number} amplitude - amplitude of the wave
     * @param {number} sampleRate - sample rate of the wave
     * @param {number} duration - duration of the wave
     * @param {number} yoffset - offset of the wave
     * @returns 
     */
    static sineWave(frequency, amplitude, sampleRate, duration, yoffset) {
        const time = [...Array(sampleRate * duration).keys()].map(x => x / sampleRate);
        return new Series("sine", sampleRate, time.map(x => yoffset + (amplitude * Math.sin(2 * Math.PI * frequency * x))));
    }
    
    /**
     * Create a series of a square wave
     * @static
     * @param {number} frequency - frequency of the wave
     * @param {number} amplitude - amplitude of the wave
     * @param {number} sampleRate - sample rate of the wave
     * @param {number} duration - duration of the wave
     * @param {number} yoffset - offset of the wave
     * @returns {Series} Series
     */
    static squareWave(frequency, amplitude, sampleRate, duration, yoffset) {
        const time = [...Array(sampleRate * duration).keys()].map(x => x / sampleRate);
        return new Series("square", sampleRate, time.map(x => yoffset + (amplitude * Math.sign(Math.sin(2 * Math.PI * frequency * x)))));
    }

    /**
     * Create a series of a triangle wave
     * @static
     * @param {number} frequency - frequency of the wave
     * @param {number} amplitude - amplitude of the wave
     * @param {number} sampleRate - sample rate of the wave
     * @param {number} duration - duration of the wave
     * @param {number} yoffset - offset of the wave
     * @returns {Series} Series
     */
    static triangleWave(frequency, amplitude, sampleRate, duration, yoffset) {
        const time = [...Array(sampleRate * duration).keys()].map(x => x / sampleRate);
        return new Series("triangle", sampleRate, time.map(x => yoffset + (amplitude * Math.abs(Math.sin(2 * Math.PI * frequency * x)))));
    }

    /**
     * Create a series of a sawtooth wave
     * @static
     * @param {number} frequency - frequency of the wave
     * @param {number} amplitude - amplitude of the wave
     * @param {number} sampleRate - sample rate of the wave
     * @param {number} duration - duration of the wave
     * @param {number} yoffset - offset of the wave
     * @returns {Series} Series
     */
    static sawtoothWave(frequency, amplitude, sampleRate, duration, yoffset) {
        const time = [...Array(sampleRate * duration).keys()].map(x => x / sampleRate);
        return new Series("sawtooth", sampleRate, time.map(x => yoffset + (amplitude * (x % (1 / frequency) * frequency))));
    }

    /**
     * Create a series of a linear ramp
     * @static
     * @param {number} amplitude - amplitude of the wave
     * @param {number} sampleRate - sample rate of the wave
     * @param {number} duration - duration of the wave
     * @param {number} yoffset - offset of the wave
     * @returns {Series} Series
     */
    static linearRamp(incline, sampleRate, duration, yoffset) {
        const time = [...Array(sampleRate * duration).keys()].map(x => x / sampleRate);
        return new Series("linearRamp", sampleRate, time.map(x => yoffset + (incline * x)));
    }

    /**
     * Create a series of a exponential ramp
     * @static
     * @param {number} amplitude - amplitude of the wave
     * @param {number} sampleRate - sample rate of the wave
     * @param {number} duration - duration of the wave
     * @param {number} yoffset - offset of the wave
     * @returns {Series} Series
     */
    static exponentialRamp(incline, sampleRate, duration, yoffset) {
        const time = [...Array(sampleRate * duration).keys()].map(x => x / sampleRate);
        return new Series("exponentialRamp", sampleRate, time.map(x => yoffset + (incline * Math.pow(2, x))));
    }

    /**
     * Create a series of a logarithmic ramp
     * @static
     * @param {number} amplitude - amplitude of the wave
     * @param {number} sampleRate - sample rate of the wave
     * @param {number} duration - duration of the wave
     * @param {number} yoffset - offset of the wave
     * @returns {Series} Series
     */
    static logarithmicRamp(incline, sampleRate, duration, yoffset) {
        const time = [...Array(sampleRate * duration).keys()].map(x => x / sampleRate);
        return new Series("logarithmicRamp", sampleRate, time.map(x => yoffset + (incline * Math.log2(x + 1))));
    }
}

class TimeDomain extends Series {
    constructor(sampleRate, signal) {
        super("time", sampleRate, signal);
    }
}

class FrequencyDomain extends Series {
    constructor(sampleRate, signal) {
        super("frequency", sampleRate, signal);
    }
}