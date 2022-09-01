import Complex from './complex.js';
/**
 * Series are mathimatical collection of arrays
 * @class Series
 */
export default class Series {
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
        if(data instanceof Array) {
            this.data = data;
        } else if(data instanceof Object) {
            // Convert object to array
            // convert keys to numbers, eliminate non-numbers
            // sort keys, offset negative numbers to 0
            // update offset field
            // convert values to array
            let tmp = Object.keys(data)
                .map(x => Number(x))
                .filter(x => !isNaN(x))
                .sort((a, b) => a - b);
            this.offset.leading = tmp[0] < 0 ? -tmp[0] : 0;
            this.data = tmp.map(x => data[x + this.offset.leading]);
        } else {
            throw new Error("Invalid data type");
        }

    }

    /**
     * Get the data of the series
     * @returns {number[]} data
     */
    getSeries() {
        return { data: this.data };
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
     * Cast series to a exended class
     * @param {"TimeDomain" | "FrequencyDomain"} type - type of series
     * @returns {TimeDomain | FrequencyDomain} TimeDomain | FrequencyDomain
     */
    cast(type) {
        let domain;
        switch (type) {
            case "TimeDomain":
                domain = new TimeDomain(this.sampleRate, this.data);
                break;
            case "FrequencyDomain":
                domain = new FrequencyDomain(this.sampleRate, this.data);
                break;
            default:
                throw new Error("Invalid type");
        }
        domain.name = this.name;
        return domain;
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
     * @returns {Series} Series
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

/**
 * @class
 * @extends Series
 */
export class TimeDomain extends Series {
    constructor(sampleRate, data) {
        if (sampleRate instanceof Series) {
            data = sampleRate.data;
            sampleRate = sampleRate.sampleRate;
        }
        super("timeSeries", sampleRate, data);
    }

    /**
     * Get the time of the series
     * @returns {number[]} time
     */
     getTime() {
        return { time: [...Array(this.data.length).keys()].map(x => x / this.sampleRate + this.offset.leading) };
    }

    /**
     * Get the time and data of the series
     * @override
     * @returns {{time: number[], data: number[]}} {time: number[], data: number[]}
     */
    getSeries() {
        return {
            ...this.getTime(),
            ...super.getSeries()
        }
    }

    /**
     * Perform a FFT
     * @todo Make faster
     * @returns {FrequencyDomain} FFT
     */
    fft() {
        const N = this.data.length;
        /** @type {Object.<number, Complex>} */
        const X = new Object();
        for (let k = -Math.floor(N / 2); k < Math.floor(N / 2); k++) {
            const i = k + Math.floor(N / 2);
            X[i] = new Complex(0, 0);
            for (let n = 0; n < N; n++) {
                const theta = -2 * Math.PI * k * n / N;
                const c = new Complex(Math.cos(theta), Math.sin(theta));
                c.multiply(this.data[n]);
                X[i]._add(c);
            }
            X[i] = X[i].abs();
        }
        const fd = new FrequencyDomain(this.sampleRate, X);
        fd.offset.leading = -Math.floor(N / 2);
        return fd;
    }

}

/**
 * @class
 * @extends Series
 */
export class FrequencyDomain extends Series {
    constructor(sampleRate, signal) {
        super("frequencySeries", sampleRate, signal);
    }

    /**
     * Get series of the magnitude of the signal
     * @override
     * @returns {{frequency: number[], amplitude: number[]}} {time: number[], data: number[]}
     */
    getSeries() {
        const N = this.data.length;
        const frequency = new Array(N);
        const amplitude = new Array(N);
        let i = 0;
        for (let k = this.offset.leading; k < N - this.offset.trailing; k++) {
            frequency[i] = k;
            amplitude[i] = this.data[i];
            i++;
        }
        return {frequency, amplitude};
    }

    /**
     * Get the magnitude of sin component of the signal
     * @param {number} sine - the sine index
     * @returns {number} magnitude of the sin component
     */
    getSine(sine) {
        return this.data[sine].abs();
    }

    /**
     * Create a series from sin/cos components
     * @static
     * @param {"sin"| "cos"} type - type of the component
     * @param {...number} amplitudes - amplitudes of the components
     * @returns {FrequencyDomain} FrequencyDomain
     */
    static fromComponents(type, ...amplitudes) {
        const N = amplitudes.length;
        const signal = new Array(N);
        for (let k = 0; k < N; k++) {
            signal[k] = new Complex(amplitudes[k] * (type === "sin" ? Math.sin(k) : Math.cos(k)), 0);
        }
        return new FrequencyDomain(N, signal);
    }

}