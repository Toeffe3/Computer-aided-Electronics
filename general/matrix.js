class Matrix {
    constructor(rows, cols) {
        this.rows = rows;
        this.cols = cols;
        this.data = [];
        for (let i = 0; i < rows; i++) {
            this.data[i] = [];
            for (let j = 0; j < cols; j++) {
                this.data[i][j] = 0;
            }
        }
    }

    // set matrix element
    set(i, j, value) {
        this.data[i][j] = value;
    }

    // set matrix using an array
    // if array is smaller than matrix, the rest of the matrix is set to 0
    // if array is larger than matrix, the rest of the array is ignored
    fromArray(array) {
        let i = 0;
        let j = 0;
        for (let value of array) {
            this.data[i][j] = value;
            j++;
            if (j === this.cols) {
                j = 0;
                i++;
            }
        }
    }

    // get matrix element
    get(i, j) {
        return this.data[i][j];
    }

    // get matrix as array in either 1 or 2 dimensions
    // if 1D, the array is in row-major order
    // if 2D, the array is in column-major order
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

    // get matrix iterator
    // also return the value of this
    [Symbol.iterator]() {
        let i = 0;
        let j = 0;
        return {
            next: () => {
                if (j === this.cols) {
                    j = 0;
                    i = (i + 1) % this.rows;
                }
                if (i >= this.rows) return {done: true};
                return {
                    value: {
                        matrix: this,
                        i: i,
                        j: j,
                        value: this.data[i][j]
                    },
                    done: false
                };
            }
        };
    }

    // copy a matrix
    copy() {
        let newMatrix = new Matrix(this.rows, this.cols);
        for (let i = 0; i < this.rows; i++)
            for (let j = 0; j < this.cols; j++)
                newMatrix.data[i][j] = this.data[i][j];
        return newMatrix;
    }

    // return a gaussian matrix
    static gaussian(rows, cols) {
        let matrix = new Matrix(rows, cols);
        for (let i = 0; i < rows; i++)
            for (let j = 0; j < cols; j++)
                matrix.data[i][j] = Math.random() * 2 - 1;
        return matrix;
    }

    // return a golden ratio matrix
    static golden(rows, cols) {
        let matrix = new Matrix(rows, cols);
        for (let i = 0; i < rows; i++)
            for (let j = 0; j < cols; j++)
                matrix.data[i][j] = (i + j) % 2 === 0 ? 1 : -1;
        return matrix;
    }

    // transpose matrix
    transpose() {
        let newMatrix = new Matrix(this.cols, this.rows);
        for (let i = 0; i < this.rows; i++)
            for (let j = 0; j < this.cols; j++)
                newMatrix.data[j][i] = this.data[i][j];
        return newMatrix;
    }

    // flip the matrix horizontally/vertically or both
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


    // add a number/constant to each element
    add(value) {
        for (let i = 0; i < this.rows; i++)
            for (let j = 0; j < this.cols; j++)
                this.data[i][j] += value;
        return this;
    }

    // multiply each element by a number/constant
    multiply(value) {
        for (let i = 0; i < this.rows; i++)
            for (let j = 0; j < this.cols; j++)
                this.data[i][j] *= value;
        return this;
    }

    // add a matrix to this matrix
    addMatrix(matrix) {
        if (this.rows !== matrix.rows || this.cols !== matrix.cols)
            throw new Error("Matrix dimensions do not match");
        for (let i = 0; i < this.rows; i++)
            for (let j = 0; j < this.cols; j++)
                this.data[i][j] += matrix.data[i][j];
        return this;
    }

    // multiply this matrix by a matrix
    multiplyMatrix(matrix) {
        if (this.cols !== matrix.rows)
            throw new Error("Matrix dimensions do not match");
        let newMatrix = new Matrix(this.rows, matrix.cols);
        for (let i = 0; i < this.rows; i++)
            for (let j = 0; j < matrix.cols; j++)
                for (let k = 0; k < this.cols; k++)
                    newMatrix.data[i][j] += this.data[i][k] * matrix.data[k][j];
        return newMatrix;
    }

    // solve this matrix for a matrixVector
    solve(matrixVector) {
        // ensure that matrixVector is a matrixVector
        if (!(matrixVector instanceof MatrixVector))
            throw new Error("Invalid matrixVector");
        // ensure that matrixVector is a column vector, if not warn and transpose
        if (matrixVector.rows !== this.rows) {
            console.warn("MatrixVector is not a column vector and will be transposed");
            matrixVector = matrixVector.transpose();
        }
        let newMatrix = this.copy();
        for (let i = 0; i < this.rows; i++)
            newMatrix.data[i][i] -= 1;
        let newMatrixVector = new Matrix(this.rows, 1);
        for (let i = 0; i < this.rows; i++)
            newMatrixVector.data[i][0] = matrixVector.data[i][0];
        let newMatrixVector2 = newMatrix.solve(newMatrixVector);
        let newMatrix2 = new Matrix(this.rows, 1);
        for (let i = 0; i < this.rows; i++)
            newMatrix2.data[i][0] = newMatrixVector2.data[i][0];
        return newMatrix2;
    }

    // gaussian elimination
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
            if (max === 0)
                throw new Error("Matrix is singular");
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

class matrixVector {
    // matrixVector is ALWAYS 1 dimensional
    // construct a matrixVector fron 2 or more number of arguments
    constructor(...args) {
        // ensure that there are at least 2 arguments
        if (args.length < 2) throw new Error("Invalid number of arguments");
        // ensure that all arguments are numbers
        for (let i = 0; i < args.length; i++) if (typeof args[i] !== "number") throw new Error("Invalid argument");
        this.data = args;
        this.rows = args.length;
        this.cols = 1; // always 1
    }

    // set a value at a specific index
    set(index, value) {
        if (index < 0 || index >= this.rows) throw new Error("Invalid index");
        if (typeof value !== "number") throw new Error("Invalid value");
        this.data[index] = value;
        return this;
    }

    // get a value at a specific index
    get(index) {
        if (index < 0 || index >= this.rows) throw new Error("Invalid index");
        return this.data[index];
    }

    // get the magnitude of the vector
    magnitude() {
        let sum = 0;
        for (let i = 0; i < this.rows; i++)
            sum += this.data[i] * this.data[i];
        return Math.sqrt(sum);
    }

    // get the unit vector of the vector
    unitVector() {
        let magnitude = this.magnitude();
        let newMatrixVector = new MatrixVector();
        for (let i = 0; i < this.rows; i++)
            newMatrixVector.data[i] = this.data[i] / magnitude;
        return newMatrixVector;
    }

    // convert this matrixVector to a matrix
    toMatrix() {
        let newMatrix = new Matrix(this.rows, 1);
        for (let i = 0; i < this.rows; i++)
            newMatrix.data[i][0] = this.data[i];
        return newMatrix;
    }

    // convert this matrixVector to a vector (format magnitude, angle)
    toVector() {
        // throw error if magnitude is 0
        if (this.magnitude() === 0) throw new Error("Magnitude is 0");
        // warning if magnitude is 1
        if (this.magnitude() === 1) console.warn("Magnitude is 1");
        // warn if the vector is not a 2D vector
        if (this.rows !== 2) console.warn("Vector is not a 2D vector");
        let magnitude = this.magnitude();
        let angle = Math.atan2(this.data[1], this.data[0]);
        return new Vector(magnitude, angle);
    }
}