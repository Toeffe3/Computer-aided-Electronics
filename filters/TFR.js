class Series {
    constructor(name, sampleRate, data) {
        this.name = name;
        this.sampleRate = sampleRate;
        this.offset = {
            leading: 0,
            trailing: 0
        };
        this.data = data;
    }
    // Returns the data
    getData() {
        return {data: this.data};
    }
    //Retruns teh time
    getTime() {
        return {time: [...Array(this.data.length).keys()].map(x => x / this.sampleRate + this.offset.leading)};
    }
    // Returns an object with the time/data pairs
    getSeries() {
        return {
            ...this.getTime(),
            ...this.getData()
        }
    }
    // Eliminate the offset by padding data array with leading/trailing zeros
    expand() {
        this.data = [...Array(this.offset.leading).keys()].map(x => 0).concat(this.data) // Pad leading zeros
            .concat([...Array(this.offset.trailing).keys()].map(x => 0)); // Pad trailing zeros
        this.offset = {
            leading: 0,
            trailing: 0
        };
        return this;
    }
    // Remove leading/trailing zeros and set the offset
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
    // Change the sample rate and modify data accordingly
    resample(newSampleRate) {
        this.sampleRate = newSampleRate;
        this.data = this.data.map(x => x * newSampleRate / this.sampleRate);
        return this;
    }

    // static methods

    // Create a series of a cosinus wave
    static cosineWave(frequency, amplitude, sampleRate, duration, yoffset) {
        const time = [...Array(sampleRate * duration).keys()].map(x => x / sampleRate);
        return new Series("cosine", sampleRate, time.map(x => yoffset + (amplitude * Math.cos(2 * Math.PI * frequency * x))));
    }
    // Create a series of a sine wave
    static sineWave(frequency, amplitude, sampleRate, duration, yoffset) {
        const time = [...Array(sampleRate * duration).keys()].map(x => x / sampleRate);
        return new Series("sine", sampleRate, time.map(x => yoffset + (amplitude * Math.sin(2 * Math.PI * frequency * x))));
    }
    // Create a series of a square wave
    static squareWave(frequency, amplitude, sampleRate, duration, yoffset) {
        const time = [...Array(sampleRate * duration).keys()].map(x => x / sampleRate);
        return new Series("square", sampleRate, time.map(x => yoffset + (amplitude * Math.sign(Math.sin(2 * Math.PI * frequency * x)))));
    }
    // Create a series of a triangle wave
    static triangleWave(frequency, amplitude, sampleRate, duration, yoffset) {
        const time = [...Array(sampleRate * duration).keys()].map(x => x / sampleRate);
        return new Series("triangle", sampleRate, time.map(x => yoffset + (amplitude * Math.abs(Math.sin(2 * Math.PI * frequency * x)))));
    }
    // Create a series of a sawtooth wave
    static sawtoothWave(frequency, amplitude, sampleRate, duration, yoffset) {
        const time = [...Array(sampleRate * duration).keys()].map(x => x / sampleRate);
        return new Series("sawtooth", sampleRate, time.map(x => yoffset + (amplitude * (x % (1 / frequency) * frequency))));
    }
    // creates a series of a linear ramp
    static linearRamp(incline, sampleRate, duration, yoffset) {
        const time = [...Array(sampleRate * duration).keys()].map(x => x / sampleRate);
        return new Series("linearRamp", sampleRate, time.map(x => yoffset + (incline * x)));
    }
    // creates a series of a exponential ramp
    static exponentialRamp(incline, sampleRate, duration, yoffset) {
        const time = [...Array(sampleRate * duration).keys()].map(x => x / sampleRate);
        return new Series("exponentialRamp", sampleRate, time.map(x => yoffset + (incline * Math.pow(2, x))));
    }
    // creates a series of a logarithmic ramp
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