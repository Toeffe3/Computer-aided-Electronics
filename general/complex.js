/**
 * Complex number as cathesian coordinates
 * @class Complex
 * @see {@link https://en.wikipedia.org/wiki/Complex_number Complex number on Wikipedia}
 */
class Complex {
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
     * Multiplies the complex number by a scalar.
     * @static
     * @param {number} n - The scalar.
     * @returns {Complex} this
     */
    static multiply(n, complex) {
        return new Complex(n * complex.real, n * complex.imag);
    }
    
    /**
     * Adds the complex number by a scalar.
     * @static
     * @param {number} n - The scalar.
     * @returns {Complex} Complex
     */
    static add(n, complex) {
        return new Complex(n + complex.real, n + complex.imag);
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