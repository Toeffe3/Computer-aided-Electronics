/**
 * Complex number as cathesian coordinates
 * @class Complex
 * @see {@link https://en.wikipedia.org/wiki/Complex_number Complex number on Wikipedia}
 */
export default class Complex {
	/**
	 * Creates a new complex number.
	 * @constructor
	 * @param {number} real - The real part of the complex number.
	 * @param {number} imaginary - The imaginary part of the complex number.
	 * @returns {Complex} this
	 */
	constructor(real, imag) {
		this.real = real;
		this.imag = imag;
	}

	/**
	 * Sets or returns the real part of the complex number.
	 * @param {number} [n] - The real part of the complex number. undefined to return the real part.
	 * @returns {number|Complex} number|Complex
	 */
	real(n) {   
		if(n === undefined) return this.real;
		this.real = n;
		return this;
	}
	
	/**
	 * Sets or returns the imaginary part of the complex number.
	 * @param {number} [n] - The imaginary part of the complex number. undefined to return the imaginary part.
	 * @returns {number|Complex} number|Complex
	 */
	imag(n) {
		if(n === undefined) return this.imag;
		this.imag = n;
		return this;
	}
	
	/**
	 * Returns the magnitude of the complex number.
	 * @returns {number} number
	 */
	magnitude() {
		return Math.sqrt(Math.pow(this.real, 2) + Math.pow(this.imag, 2));
	}
	
	/**
	 * Returns the phase (angle) of the complex number.
	 * @returns {number} number
	 */
	phase() {
		return Math.atan(this.imag / this.real);
	}

	/**
	 * Returns the complex conjugate of the complex number.
	 * @returns {Complex} this
	 */
	conjugate() {
		return new Complex(this.real, -this.imag);
	}

	/**
	 * Absolute value of the complex number.
	 * @returns {number} number
	 */
	abs() {
		return Math.sqrt(Math.pow(this.real, 2) + Math.pow(this.imag, 2));
	}

	/**
	 * Adds the complex number by a constant.
	 * @param {number} n - The constant.
	 * @returns {Complex} this
	 */
	add(n) {
		this.real += n;
		return this;
	}
	
	/**
	 * Adds the complex number by a constant.
	 * @static
	 * @param {number} n - The constant.
	 * @param {Complex} complex - The complex number.
	 * @returns {Complex} Complex
	 */
	static add(n, complex) {
		return new Complex(complex.real + n, complex.imag);
	}

	/**
	 * Adds the complex number by another complex number.
	 * @param {Complex} complex - The complex number.
	 * @returns {Complex} this
	 */
	_add(complex) {
		this.real += complex.real;
		this.imag += complex.imag;
		return this;
	}
	
	/**
	 * Add two complex numbers.
	 * @static
	 * @param {Complex} a - The first complex number.
	 * @param {Complex} b - The second complex number.
	 * @returns {Complex} Complex
	 */
	static _add(a, b) {
		return new Complex(a.real + b.real, a.imag + b.imag);
	}

	/**
	 * Multiplies the complex number by a constant.
	 * @param {number} n - The constant.
	 * @returns {Complex} this
	 */
	multiply(n) {
		this.real *= n;
		this.imag *= n;
		return this;
	}
	
	/**
	 * Multiplies the complex number by a constant.
	 * @static
	 * @param {number} n - The constant.
	 * @returns {Complex} this
	 */
	static multiply(n, complex) {
		return new Complex(n * complex.real, n * complex.imag);
	}

	/**
	 * Multiplies the complex number by another complex number.
	 * @param {Complex} complex - The complex number.
	 * @returns {Complex} this
	 */
	_multiply(complex) {
		this.real = this.real * complex.real - this.imag * complex.imag;
		this.imag = this.real * complex.imag + this.imag * complex.real;
		return this;
	}

	/**
	 * Multiplies two complex numbers.
	 * @static
	 * @param {Complex} a - The first complex number.
	 * @param {Complex} b - The second complex number.
	 * @returns {Complex} Complex
	 */
	static _multiply(a, b) {
		return new Complex(
			a.real * b.real - a.imag * b.imag,
			a.real * b.imag + a.imag * b.real
		);
	}

	/**
	 * Devides the complex number by a constant.
	 * @param {number} n - The constant.
	 * @returns {Complex} this
	 */
	divide(n) {
		this.real /= n;
		this.imag /= n;
		return this;
	}

	/**
	 * Divides the complex number by a constant.
	 * @static
	 * @param {number} n - The constant.
	 * @returns {Complex} this
	 */
	static divide(n, complex) {
		return new Complex(n / complex.real, n / complex.imag);
	}

	/**
	 * Divides the complex number by another complex number.
	 * @param {Complex} complex - The complex number.
	 * @returns {Complex} this
	 */
	_divide(complex) {
		const denom = Math.pow(complex.real, 2) + Math.pow(complex.imag, 2);
		this.real = (this.real * complex.real + this.imag * complex.imag) / denom;
		this.imag = (this.imag * complex.real - this.real * complex.imag) / denom;
		return this;
	}

	/**
	 * Divides two complex numbers.
	 * @static
	 * @param {Complex} a - The first complex number.
	 * @param {Complex} b - The second complex number.
	 * @returns {Complex} Complex
	 */
	static _divide(a, b) {
		const denom = Math.pow(b.real, 2) + Math.pow(b.imag, 2);
		return new Complex(
			(a.real * b.real + a.imag * b.imag) / denom,
			(a.imag * b.real - a.real * b.imag) / denom
		);
	}

	/**
	 * Exponentiates the complex number.
	 * @static
	 * @returns {Complex} Complex
	 */
	static exp(complex) {
		return new Complex(
			Math.exp(complex.real) * Math.cos(complex.imag),
			Math.exp(complex.real) * Math.sin(complex.imag)
		);
	}

	/**
	 * Returns the vector as a function of e
	 * @static
	 * @returns {Complex} Complex
	 */
	static e(complex) {
		return new Complex(
			Math.cos(complex.imag),
			Math.sin(complex.imag)
		);
	}
}