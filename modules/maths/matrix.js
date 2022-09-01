/**
 * A matrix is a two-dimensional array of numbers.
 * @see {@link https://en.wikipedia.org/wiki/Matrix_%28mathematics%29 Matrix on Wikipedia}
 * @class Matrix
 */
export default class Matrix {
	/**
	 * Create a matrix with a finite number of rows and columns.
	 * @constructor
	 * @param {number} rows - the number of rows
	 * @param {number} cols - the number of columns
	 * @returns {Matrix} this
	 */
	constructor(rows, cols) {
		this.rows = rows;
		this.cols = cols;
		this.data = [];
		this.pure = true;
		for (let i = 0; i < rows; i++) {
			this.data[i] = [];
			for (let j = 0; j < cols; j++) this.data[i][j] = 0;
		}
		return this;
	}

	/**
	 * Check (and update) the purity of the matrix.
	 * @description A matrix is pure if all of its elements are numbers.
	 * @returns {boolean} boolean
	 */
	checkPurity() {
		for (let i = 0; i < this.rows; i++) {
			for (let j = 0; j < this.cols; j++) {
				if (typeof this.data[i][j] !== "number") {
					this.pure = false;
					return false;
				}
			}
		}
		this.pure = true;
		return true;
	}

	/**
	 * Set the value of a matrix element.
	 * @param {number} row - the row index
	 * @param {number} column - the column index
	 * @param {number|any} value - the value to set
	 * @returns {Matrix} this
	 */
	set(row, column, value) {
		// if value is not a number, the matrix is not pure
		if (typeof value !== "number") this.pure = false;
		else if (!this.pure) this.checkPurity(); // if the matrix is not pure, check if the value replaces the unpure value
		this.data[row][column] = value;
		return this;
	}

	/**
	 * Set the matrix using an array.
	 * @description Ignores any excess elements or missing elements.
	 * @param {number[][]|any[][]|number[]|any[]} array - the array to set the matrix to
	 * @param {number} [list] - if the array should be treated as a list
	 * @returns {Matrix} this
	 */
	fromArray(array, list = flase) {
		for (let row = 0; row < array.length; row++) {
			for (let col = 0; col < array[row].length; col++) {
				if (list === true) {
					//map 2d array indexs to 1d array indexes
					let i = row * this.cols + col;
					if (i > array.length) break;
					this.set(tr, tc, array[i]);
				} else this.set(row, col, array[row][col]);
			}
		}
		return this;
	}

	/**
	 * Get the value of a matrix element.
	 * @param {number} row - the row index
	 * @param {number} col - the column index
	 * @returns {number} number
	 */
	get(row, col) {
		return this.data[row][col];
	}

	/**
	 * Get the matrix as an array.
	 * @description The array is in; 1D: row-major order, 2D: column-major order.
	 * @param {1|2} [dim] - the dimension of the array
	 * @returns {number[]|number[][]} number[]|number[][]
	 */
	toArray2D(dim) {
		if (dim === 1) {
			let array = [];
			for (let i = 0; i < this.rows; i++)
				for (let j = 0; j < this.cols; j++)
					array.push(this.data[i][j]);
			return array;
		} else if (dim === 2) return this.data;
		else throw new Error("Invalid dimension");
	}

	/**
	 * Get the matrix as a iterable object.
	 * @iterable
	 * @returns {Iterable} Iterable
	 */
	[Symbol.iterator]() {
		return this.data[Symbol.iterator]();
	}

	/**
	 * Get the matric as an generator.
	 * @description The generator is column-major order, and yields done when the matrix is exhausted.
	 * @generator
	 * @yields {{value: number|any, done: boolean}}
	 * @returns {Generator} Generator
	 */
	*[Symbol.iterator]() {
		for (let i = 0; i < this.rows; i++) {
			for (let j = 0; j < this.cols; j++) {
				yield {value: this.data[i][j], done: false};
			}
		}
		//yield done
		yield { value: null, done: true };
	}

	/**
	 * Copy the matrix.
	 * @returns {Matrix} Matrix
	 */
	copy() {
		let newMatrix = new Matrix(this.rows, this.cols);
		for (let i = 0; i < this.rows; i++)
			for (let j = 0; j < this.cols; j++)
				newMatrix.data[i][j] = this.data[i][j];
		return newMatrix;
	}

	/**
	 * Returns a matrix of ones.
	 * @static
	 * @param {number} rows - the number of rows
	 * @param {number} cols - the number of columns
	 * @returns {Matrix} Matrix
	 */
	static ones(rows, cols) {
		let matrix = new Matrix(rows, cols);
		for (let i = 0; i < rows; i++)
			for (let j = 0; j < cols; j++)
				matrix.data[i][j] = 1;
		return matrix;
	}

	/**
	 * Returns a identity matrix.
	 * @static
	 * @param {number} rows - the number of rows
	 * @param {number} cols - the number of columns
	 * @returns {Matrix} Matrix
	 */
	static identity(rows, cols) {
		let matrix = new Matrix(rows, cols);
		for (let i = 0; i < rows; i++)
			for (let j = 0; j < cols; j++)
				matrix.data[i][j] = i === j ? 1 : 0;
		return matrix;
	}

	/**
	 * Returns a shift matrix.
	 * @static
	 * @param {number} rows - the number of rows
	 * @param {number} cols - the number of columns
	 * @param {'horizontal'|'vertical'} direction - the direction of the shift
	 * @returns {Matrix} Matrix
	 */
	static shift(rows, cols, direction) {
		let matrix = new Matrix(rows, cols);
		for (let i = 0; i < rows; i++)
			for (let j = 0; j < cols; j++)
				matrix.data[i][j] = direction === "horizontal" ? j : i;
		return matrix;
	}

	/**
	 * Returns a commutation matrix
	 * @static
	 * @param {number} rows - the number of rows
	 * @param {number} cols - the number of columns
	 * @param {number} row - the row to swap
	 * @param {number} col - the column to swap
	 * @returns {Matrix} Matrix
	 */
	static commutation(rows, cols, row, col) {
		let matrix = new Matrix(rows, cols);
		for (let i = 0; i < rows; i++)
			for (let j = 0; j < cols; j++)
				matrix.data[i][j] = i === row ? j : i === col ? row : i;
		return matrix;
	}

	/**
	 * Returns a random matrix.
	 * @static
	 * @param {number} rows - the number of rows
	 * @param {number} cols - the number of columns
	 * @param {number} [min=0] - the minimum value
	 * @param {number} [max=1] - the maximum value
	 * @returns {Matrix} Matrix
	 */
	static random(rows, cols, min = 0, max = 1) {
		let matrix = new Matrix(rows, cols);
		for (let i = 0; i < rows; i++)
			for (let j = 0; j < cols; j++)
				matrix.data[i][j] = Math.random() * (max - min) + min;
		return matrix;
	}

	/**
	 * Transpose the matrix.
	 * @returns {Matrix} this
	 */
	transpose() {
		let newMatrix = new Matrix(this.cols, this.rows);
		for (let i = 0; i < this.rows; i++)
			for (let j = 0; j < this.cols; j++)
				newMatrix.data[j][i] = this.data[i][j];
		return newMatrix;
	}

	/**
	 * Flip the matrix either horizontally or vertically or both.
	 * @param {boolean} [horizontal=false] - flip horizontally
	 * @param {boolean} [vertical=false] - flip vertically
	 * @returns {Matrix} this
	 */
	flip(horizontal, vertical) {
		if (horizontal) {
			for (let i = 0; i < this.rows; i++) {
				for (let j = 0; j < this.cols / 2; j++) {
					let temp = this.data[i][j];
					this.data[i][j] = this.data[i][this.cols - j - 1];
					this.data[i][this.cols - j - 1] = temp;
				}
			}
		}
		if (vertical) {
			for (let i = 0; i < this.rows / 2; i++) {
				for (let j = 0; j < this.cols; j++) {
					let temp = this.data[i][j];
					this.data[i][j] = this.data[this.rows - i - 1][j];
					this.data[this.rows - i - 1][j] = temp;
				}
			}
		}
		return this;
	}

	/**
	 * Add a number/constant to each element or add a matrix to this matrix.
	 * @param {number|Matrix} element - the element to add
	 * @returns {Matrix} this
	 */
	add(element) {
		if (typeof element === "number") {
			for (let i = 0; i < this.rows; i++)
				for (let j = 0; j < this.cols; j++)
					this.data[i][j] += element;
		} else if (element instanceof Matrix) {
			if (element.rows !== this.rows || element.cols !== this.cols)
				throw new Error("Matrices must be of the same size");
			for (let i = 0; i < this.rows; i++)
				for (let j = 0; j < this.cols; j++)
					this.data[i][j] += element.data[i][j];
		} else
			throw new Error("Invalid element");
		return this;
	}

	/**
	 * Multiply each element by a number/constant or multiply this matrix by a matrix.
	 * @param {number|Matrix} element - the element to multiply
	 * @returns {Matrix} this
	 */
	multiply(value) {
		if (typeof value === "number") {
			for (let i = 0; i < this.rows; i++)
				for (let j = 0; j < this.cols; j++)
					this.data[i][j] *= value;
		} else if (value instanceof Matrix) {
			if (value.rows !== this.rows || value.cols !== this.cols)
				throw new Error("Matrices must be of the same size");
			for (let i = 0; i < this.rows; i++)
				for (let j = 0; j < this.cols; j++)
					this.data[i][j] *= value.data[i][j];
		} else
			throw new Error("Invalid element");
		return this;
	}

	/**
	 * Solve this matrix for a matrix of constants.
	 * @param {Matrix} constants - the matrix of constants
	 * @returns {Matrix} Matrix
	 * @throws {Error} if the matrix is not square
	 */
	solve(constants) {
		if (this.rows !== this.cols) throw new Error("Matrix must be square");
		if (constants.rows !== this.rows || constants.cols !== 1) throw new Error("Matrix must be of the same size");
		let matrix = new Matrix(this.rows, this.cols);
		for (let i = 0; i < this.rows; i++) {
			let row = [];
			for (let j = 0; j < this.cols; j++) row.push(this.data[i][j]);
			let solution = gauss(row, constants.data[i]);
			for (let j = 0; j < this.cols; j++) matrix.data[i][j] = solution[j];
		}
		return matrix;
	}

	/**
	 * Gaussian elimination.
	 * @returns {Matrix} Matrix
	 * @throws {Error} if the matrix is a singular matrix
	 */
	gaussianElimination() {
		let newMatrix = this.copy();
		for (let i = 0; i < this.rows; i++) {
			let max = Math.abs(newMatrix.data[i][i]);
			let maxRow = i;
			for (let j = i + 1; j < this.rows; j++) {
				if (Math.abs(newMatrix.data[j][i]) > max) {
					max = Math.abs(newMatrix.data[j][i]);
					maxRow = j;
				}
			}
			if (max === 0) throw new Error("Matrix is singular");
			if (maxRow !== i) {
				let temp = newMatrix.data[i];
				newMatrix.data[i] = newMatrix.data[maxRow];
				newMatrix.data[maxRow] = temp;
			}
			for (let j = i + 1; j < this.rows; j++) {
				let factor = newMatrix.data[j][i] / newMatrix.data[i][i];
				for (let k = i; k < this.cols; k++)
					newMatrix.data[j][k] -= factor * newMatrix.data[i][k];
			}
		}
		return newMatrix;
	}
}