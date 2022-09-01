/**
 * Fourier series of amplitude and phase
 * @description The fourier series is a series of complex numbers that can be used to represent a function.
 * @see {@link https://en.wikipedia.org/wiki/Fourier_series Fourier series on Wikipedia}
 * @class FourierSeries
 */
export default class FourierSeries {
	/**
	 * Creates a new fourier series.
	 * @constructor
	 * @returns {Fourier} this
	 */
	constructor() {
		this.series = {
			amplitudes: [],
			phases: []
		};
		this.length = 0;
	}

	/**
	 * Sets the nth component of the fourier series.
	 * @param {number} amplitude - The amplitude of the nth component.
	 * @param {number} phase - The phase of the nth component.
	 * @param {number} [n] - The index of the component, default is the end of the series.
	 * @returns {Fourier} this
	 */
	setComponent(amplitude, phase, n) {
		if (n == undefined) {
			this.series.amplitudes.push(amplitude);
			this.series.phases.push(phase);
		} else {
			while (this.series.amplitudes.length < n) {
				this.series.amplitudes.push(0);
				this.series.phases.push(0);
			}
			this.series.amplitudes[n] = amplitude;
			this.series.phases[n] = phase;
		}
		this.length = Math.max(this.length, n);
		return this;
	}
	
	/**
	 * Gets the nth component of the fourier series.
	 * @param {number} n - The index of the component.
	 * @returns {{amplitude, phase}|null} {amplitude, phase}|null
	 */
	getComponent(n) {
		if (n == undefined) return null;
		else return {
			amplitude: this.series.amplitudes[n],
			phase: this.series.phases[n]
		};
	}
	
	/**
	 * Sets the DC component of the fourier series.
	 * @param {number} amplitude - The amplitude of the DC component.
	 * @returns {Fourier} this
	 */
	setDC(amplitude) {
		this.setComponent(amplitude, 0);
		return this;
	}
	
	/**
	 * Get the DC component of the fourier series.
	 * @returns {{amplitude, phase}}
	 */
	getDC() {
		return this.getComponent(0);
	}
	
	/**
	 * Gets the frequency array of the fourier series.
	 * @returns {number[]} number[]
	 */
	getFrequency() {
		let freq = [];
		for (let i = 0; i <= this.length; i++) freq.push(i);
		return freq;
	}
	
	/**
	 * Gets the time array of the fourier series.
	 * @returns {number[]} number[]
	 */
	getTime() {
		let time = [];
		let step = 1 / this.length;
		for (let n = 0; n < this.length; n++) time.push(n * step);
		return time;
	}
	
	/**
	 * Gets the amplitude array of the fourier series.
	 * @returns {number[]} number[]
	 */
	getAmplitude() {
		let amplitude = [];
		for (let n = 0; n <= this.length; n++) amplitude.push(this.series.amplitudes[n]);
		return amplitude;
	}
	/**
	 * Gets the phase array of the fourier series.
	 * @returns {number[]} number[]
	 */
	getPhase() {
		let phase = [];
		for (let n = 0; n <= this.length; n++) phase.push(this.series.phases[n]);
		return phase;
	}

	/**
	 * Gets the magnitude array of the fourier series.
	 * @returns {number[]} number[]
	 */
	getMagnitude() {
		let magnitude = [];
		for (let n = 0; n <= this.length; n++) magnitude.push(this.series.amplitudes[n] * Math.sqrt(2));
		return magnitude;
	}
	
	/**
	 * Gets the imaginary array of the fourier series.
	 * @returns {number[]} number[]
	 */
	getImaginary() {
		let imaginary = [];
		for (let n = 0; n <= this.length; n++) imaginary.push(this.series.amplitudes[n] * Math.sin(this.series.phases[n]));
		return imaginary;
	}
	
	/**
	 * Gets the real array of the fourier series.
	 * @returns {number[]} number[]
	 */
	getReal() {
		let real = [];
		for (let n = 0; n <= this.length; n++) real.push(this.series.amplitudes[n] * Math.cos(this.series.phases[n]));
		return real;
	}
	
	/**
	 * Returns a function that represents the fourier series.
	 * @returns {callback<number>}
	 * @example
	 * let f = fourier.toFunction();
	 * f(0); // 0
	 * f(1); // 0.5
	 */
	getFunction() {
		let series = this.series;
		let length = this.length;
		return function(x) {
			let sum = series.amplitudes[0]/2;
			for (let n = 1; n < length; n++) {
				sum += series.amplitudes[n] * Math.cos(n * x + series.phases[n]);
			}
			return sum;                       
		};
	}

	/**
	 * Converts a function to a fourier series.
	 * @param {callback<number>} f - The function.
	 * @param {number} start - The start of the function, default is 0.
	 * @param {number} end - The end of the function, default is 1.
	 * @param {number} step - The step of the function, default is 0.01.
	 * @returns {Fourier} Fourier
	 */
	static fromFunction(f, start, end, step) {
		let series = new FourierSeries();
		let length = Math.floor((end - start) / step);
		let x = start;
		for (let n = 0; n < length; n++) {
			let amplitude = f(x);
			let phase = 0;
			for (let m = 1; m <= n; m++) phase += m * Math.sin(m * x);
			series.setComponent(amplitude, phase, n);
			x += step;
		}
		return series;
	}
	
	/**
	 * Returns an iterator that iterates over the fourier series amplitudes and phases.
	 * @returns {Iterator} Iterator
	 * @example
	 * let it = fourier.iterator();
	 * for (let {amplitude, phase} of it) print(amplitude, phase); // 0 0, 0.5 0.25, 1 0.5
	 * it.reset();
	 */
	*[Symbol.iterator]() {
		for (let n = 0; n < this.length; n++) {
			// return a reset function, and the current components
			yield {
				component: this.getComponent(n),
				reset: () => {
					this.n = 0;
				},
			};
		}
	}

	/**
	 * Converts a time array and frequency array to a fourier series.
	 * @param {number[]} time - The time array.
	 * @param {number[]} frequency - The frequency array.
	 * @returns {Fourier} Fourier
	 */
	static fromFrequency(time, frequency) {
		let series = new FourierSeries();
		let length = Math.min(time.length, frequency.length);
		let x = 0;
		for (let n = 0; n < length; n++) {
			let amplitude = frequency[n];
			let phase = 0;
			for (let m = 1; m <= n; m++) phase += m * Math.sin(m * x);
			series.setComponent(amplitude, phase, n);
			x += time[n];
		}
		return series;
	}
	
	/**
	 * Converts a time array and amplitude array to a fourier series.
	 * @param {number[]} time - The time array.
	 * @param {number[]} amplitude - The amplitude array.
	 * @returns {Fourier} Fourier
	 */
	static fromAmplitudes(time, amplitude) {
		let series = new FourierSeries();
		let length = Math.min(time.length, amplitude.length);
		let x = 0;
		for (let n = 0; n < length; n++) {
			let phase = 0;
			for (let m = 1; m <= n; m++) phase += m * Math.sin(m * x);
			series.setComponent(amplitude[n], phase, n);
			x += time[n];
		}
		return series;
	}

	/**
	 * Converts a 2d matrix of audio data to a fourier series.
	 * @param {number[][]} data - The 2d matrix of audio data.
	 * @param {number} sampleRate - The sample rate of the audio data.
	 * @returns {Fourier} Fourier
	 */
	static fromAudio(audio, sampleRate) {
		let series = new FourierSeries();
		let length = audio.length;
		let step = sampleRate / length;
		let x = 0;
		for (let n = 0; n < length; n++) {
			let amplitude = audio[n];
			let phase = 0;
			for (let m = 1; m <= n; m++) phase += m * Math.sin(m * x);
			series.setComponent(amplitude, phase, n);
			x += step;
		}
		return series;
	}

	/**
	 * Gets the plot data of the fourier series.
	 * @description The plot data is an array of data, one for each argument.
	 * @param {...string} axisUnit - The unit types of the axes.
	 * @values "frequency", "time", "amplitude", "phase", "magnitude", "imaginary", "real"
	 * @returns {AnyDimensionalArray<number>} AnyDimensionalArray<number>
	 */
	getPlotData(...axisUnit) {
		let data = [];
		let i = axisUnit.length;
		while(i-->0) switch (axisUnit[i]) {
			case "frequency":   data.push(this.getFrequency());break;
			case "time":        data.push(this.getTime());break;
			case "amplitude":   data.push(this.getAmplitude());break;
			case "phase":       data.push(this.getPhase());break;
			case "magnitude":   data.push(this.getMagnitude());break;
			case "imaginary":   data.push(this.getImaginary());break;
			case "real":        data.push(this.getReal());break;
		}
		return data;
	}

	/**
	 * Gets the Laplace transform of the fourier series.
	 * @returns {Fourier} Fourier
	 */
	laplace() {
		let series = new FourierSeries();
		let length = this.length;
		for (let n = 0; n < length; n++) {
			let amplitude = this.series.amplitudes[n] / (n + 1);
			let phase = this.series.phases[n] + Math.PI / (n + 1);
			series.setComponent(amplitude, phase, n);
		}
		return series;
	}

	/**
	 * Gets the discrete fourier transform of the fourier series.
	 * @returns {Fourier} Fourier
	 */
	DFT() {
		let series = new FourierSeries();
		let length = this.length;
		for (let n = 0; n < length; n++) {
			let amplitude = 0;
			let phase = 0;
			for (let m = 0; m < length; m++) {
				amplitude += this.series.amplitudes[m] * Math.cos(m * n * Math.PI / length);
				phase += this.series.phases[m] * Math.sin(m * n * Math.PI / length);
			}
			series.setComponent(amplitude, phase, n);
		}
		return series;
	}

	/**
	 * Gets the discrete time fourier transform of the fourier series.
	 * @returns {Fourier} Fourier
	 */
	static DTFT(array, zero, zeroIsIndex) {
		let series = new FourierSeries();
		// create a discrete time series
		let time = [];
		// zero is the time zero in a sample where zero is not the start of the time series
		// zeroIsIndex is defines if zero is an index else it is an offset
		if(zeroIsIndex) for (let n = zero; n < array.length; n++) time.push(n);
		else for (let n = 0; n < array.length; n++) time.push(zero + n);
		series.length = time.length;
		// match the mathimatical definition of DTFT:
		// X_2pi[omega] = sum(x[n] * e^(i * n * 2pi * omega), n=-infinity, infinity)
		const X_2pi = sum((n) => 
			// use complex class to handle complex numbers
			Complex.multiply(array[n], Complex.exp(new Complex(0, 2 * Math.PI * n * time[n]))),
		-Infinity, Infinity, true);
	}
}