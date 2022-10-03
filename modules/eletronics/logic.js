/**
 * Logic class
 * @description Boolean logic intrepretion
 * @module logic
 * @see {@link https://en.wikipedia.org/wiki/Digital_Logic Digital Logic on Wikipedia}
 */
export const name = 'logic';

class Logic {
    /**
     * Creates a new logic value
     * @class
     * @constructor
     * @param {boolean} [value=false] - The initial value of the logic value.
     * @returns {Logic} this
     */
    constructor(value=false) {
        this.value = value;
        this.inverted = false;
    }

    /**
     * Sets or get the boolean value.
     * @param {boolean} [value] - The value of the logic value. undefined to return the value.
     * @returns {boolean} boolean
     */
    value(value) {
        if(value === undefined) return this.valueOf();
        this.value = value;
        return this;
    }

    /**
     * Returns the negation of the logic value.
     * @returns {Logic} this
     */
    not() {
        this.value = !this.valueOf();
        return this;
    }

    /**
     * Returns the conjunction of the logic value and other logical values.
     * @param {...Logic} logic - The logical values to be conjuncted.
     * @returns {Logic} this
     * @see {@link https://en.wikipedia.org/wiki/Logical_conjunction Logical conjunction on Wikipedia}
     */
    and(...logic) {
        this.value = logic.reduce((a, b) => a===null?b.valueOf():a && b.valueOf(), this.valueOf());
        return this;
    }

    /**
     * Returns the nand of the logic value and other logical values.
     * @param {...Logic} logic - The logical values to be nanded.
     * @returns {Logic} this
     * @see {@link https://en.wikipedia.org/wiki/NAND_logic NAND logic on Wikipedia}
     */
    nand(...logic) {
        this.value = logic.reduce((a, b) => a===null?b.valueOf():!(a && b.valueOf()), this.valueOf());
        return this;
    }

    /**
     * Returns the disjunction of the logic value and other logical values.
     * @param {...Logic} logic - The logical values to be disjuncted.
     * @returns {Logic} this
     * @see {@link https://en.wikipedia.org/wiki/Logical_disjunction Logical disjunction on Wikipedia}
     */
    or(...logic) {
        this.value = logic.reduce((a, b) => a===null?b.valueOf():a || b.valueOf(), this.valueOf());
        return this;
    }

    /**
     * Returns the nor of the logic value and other logical values.
     * @param {...Logic} logic - The logical values to be nored.
     * @returns {Logic} this
     * @see {@link https://en.wikipedia.org/wiki/NOR_logic NOR logic on Wikipedia}
     */
    nor(...logic) {
        this.value = logic.reduce((a, b) => a===null?b.valueOf():!(a || b.valueOf()), this.valueOf());
        return this;
    }

    /**
     * Returns the exclusive disjunction of the logic value and other logical values.
     * @param {...Logic} logic - The logical values to be exclusive disjuncted.
     * @returns {Logic} this
     * @see {@link https://en.wikipedia.org/wiki/Exclusive_or Exclusive or on Wikipedia}
     */
     xor(...logic) {
        this.value = logic.reduce((a, b) => a===null?b.valueOf():a ^ b.valueOf(), this.valueOf());
        return this;
    }

    /**
     * Returns the xnor of the logic value and other logical values.
     * @param {...Logic} logic - The logical values to be xnored.
     * @returns {Logic} this
     * @see {@link https://en.wikipedia.org/wiki/XNOR_logic XNOR logic on Wikipedia}
     */
    xnor(...logic) {
        this.value = logic.reduce((a, b) => a===null?b.valueOf():!(a ^ b.valueOf()), this.valueOf());
        return this;
    }

    /**
     * Return the string representation of the logic value.
     * @returns {string} string
     * @see {@link https://en.wikipedia.org/wiki/Truth_value Truth value on Wikipedia}
     */
    toString() {
        return this.valueOf() ? 'true' : 'false';
    }

    /**
     * Value
     * @returns {boolean} boolean
     */
    valueOf() {
        return this.inverted ? !this.value : this.value;
    }
}

export default class BooleanExpression {
    /**
     * Logical expression builder
     * @description Create complex logical expressions
     * @module logic
     * @class
     * @constructor
     * @example lx.or('not a', 'b').valueOf() // ¬a ∨ b
     * @example lx.and('a', 'b').or('c').valueOf() // (a ∧ b) ∨ c
     * @example lx.and('not b').or('c').not().valueOf() // ¬((a ∧ ¬b) ∨ c)
     * @example lx.and('a', 'b').not().or('not c').valueOf() // ¬(a ∧ b) ∨ ¬c
     * @example lx.and('a', 'not b', 'c', 'd').or('not a', 'not c').valueOf() // (a ∧ ¬b ∧ c ∧ d) ∨ (¬a ∧ ¬c)
     */
    constructor() {
        this.inputs = {};
        this.outputs = {};
        this.expression = [];
        return this;
    }

    /**
     * Handle inputs
     * @param {...string} inputsdata - The input name, if 'not ' is prepended, the input is negated.
     * @returns {[]} parsed input names
     */
    handleInput(...inputsdata) {
        return inputsdata.map((input) => {
            // if input is a BooleanExpression, get its inputs
            if(input instanceof BooleanExpression) Object.assign(this.inputs, input.inputs);
            else this.inputs[input] = this.inputs[input] || new Logic(null);
            return input;
        });
    }

    /**
     * Invert a input
     * @param {...string} input - The input name.
     * @returns {Logic} inverted input
     */
    invert(...inputs) {
        inputs.forEach((i) => this.inputs[i].inverted = !this.inputs[i].inverted);
        // search for the input in names
        Object.keys(this.outputs).forEach((name) => {
            inputs.forEach((i) => {
                let newname = name.replace(i, `${BooleanExpression.bar(i)}`);
                if(newname !== name) {
                    this.outputs[newname] = this.outputs[name];
                    delete this.outputs[name];
                }
            });
        });
        return this;
    }

    /**
     * Add a logic NOT to the expression
     * @returns {BooleanExpression} this
     */
    not(...inputs) {
        if(inputs.length > 0) console.warn('NOT might not be accurate')
        if(inputs.length > 1) throw new Error('NOT can only have one input');
        this.expression.push({ not: inputs });
        return this;
    }

    /**
     * Add a logic AND to the expression
     * @param {...string} [inputs] - The logic to apply the expression to.
     * @returns {BooleanExpression} this
     */
    and(...inputs) {
        inputs = this.handleInput(...inputs);
        this.expression.push({ and: inputs });
        return this;
    }

    /**
     * Add a logic NAND to the expression
     * @param {...string} [inputs] - The logic to apply the expression to.
     * @returns {BooleanExpression} this
     */
     nand(...inputs) {
        if(inputs.length > 2) throw new Error('NAND can only have two inputs');
        inputs = this.handleInput(...inputs);
        this.expression.push({ nand: inputs });
        return this;
    }

    /**
     * Add a logic OR to the expression
     * @param {...string} [inputs] - The logic to apply the expression to.
     * @returns {BooleanExpression} this
     */
    or(...inputs) {
        inputs = this.handleInput(...inputs);
        this.expression.push({ or: inputs });
        return this;
    }

    /**
     * Add a logic NOR to the expression
     * @param {...string} [inputs] - The logic to apply the expression to.
     * @returns {BooleanExpression} this
     */
    nor(...inputs) {
        if(inputs.length > 2) throw new Error('NOR can only have two inputs');
        inputs = this.handleInput(...inputs);
        this.expression.push({ nor: inputs });
        return this;
    }

    /**
     * Add a logic XOR to the expression
     * @param {...string} [inputs] - The logic to apply the expression to.
     * @returns {BooleanExpression} this
     */
    xor(...inputs) {
        if(inputs.length > 2) throw new Error('XOR can only have two inputs');
        inputs = this.handleInput(...inputs);
        this.expression.push({ xor: inputs });
        return this;
    }

    /**
     * Add a logic XNOR to the expression
     * @param {...string} [inputs] - The logic to apply the expression to.
     * @returns {BooleanExpression} this
     */
    xnor(...inputs) {
        if(inputs.length > 2) throw new Error('XNOR can only have two inputs');
        inputs = this.handleInput(...inputs);
        this.expression.push({ xnor: inputs });
        return this;
    }

    /**
     * Not
     * @static
     * @param {...string} [inputs] - The logic to apply the expression to.
     * @returns {BooleanExpression} this
     */
    static not(...inputs) {
        let tmp = new BooleanExpression();
        tmp.handleInput(...inputs);
        tmp.not(...inputs);
        return tmp;
    }

    /**
     * And
     * @static
     * @param {...string} [inputs] - The logic to apply the expression to.
     * @returns {BooleanExpression} this
     */
    static and(...inputs) {
        return new BooleanExpression().and(...inputs);
    }

    /**
     * Nand
     * @static
     * @param {...string} [inputs] - The logic to apply the expression to.
     * @returns {BooleanExpression} this
     */
    static nand(...inputs) {
        return new BooleanExpression().nand(...inputs);
    }

    /**
     * Or
     * @static
     * @param {...string} [inputs] - The logic to apply the expression to.
     * @returns {BooleanExpression} this
     */
    static or(...inputs) {
        return new BooleanExpression().or(...inputs);
    }

    /**
     * Nor
     * @static
     * @param {...string} [inputs] - The logic to apply the expression to.
     * @returns {BooleanExpression} this
     */
    static nor(...inputs) {
        return new BooleanExpression().nor(...inputs);
    }

    /**
     * Xor
     * @static
     * @param {...string} [inputs] - The logic to apply the expression to.
     * @returns {BooleanExpression} this
     */
    static xor(...inputs) {
        return new BooleanExpression().xor(...inputs);
    }

    /**
     * Xnor
     * @static
     * @param {...string} [inputs] - The logic to apply the expression to.
     * @returns {BooleanExpression} this
     */
    static xnor(...inputs) {
        return new BooleanExpression().xnor(...inputs);
    }

    /**
     * Deep copy and disassociate from the original
     * @returns {BooleanExpression} this
     */
    static copy(bx) {
        const bxn = Object.assign(Object.create(Object.getPrototypeOf(bx)), bx);
        bxn.outputs = Object.assign({}, bx.outputs);
        bxn.expression = Object.assign([], bx.expression);
        return bxn;
    }

    /**
     * Add and output to the expression
     * @param {string?} name - The output name.
     * @param {string} [inverted] - if true, the output is inverted, name will be modified.
     */
    label(name, inverted) {
        if(!name) name = this.toString({});
        if(inverted) {
            if(name.match(/^\w+$/)) name = BooleanExpression.bar(name);
            else name = `¬(${name})`;
            this.outputs[name] = BooleanExpression.copy(this);
            this.outputs[name].push({ not: [null] });
        } else this.outputs[name] = BooleanExpression.copy(this);
        return this;
    }
    
    // unicode symbol for placing a bar over a string
    static bar = (str, firstOnly=false) => {
        if(str.match(/\u0304/)) return str.replace(/\u0304/g, '');
        else if(str.match(/\u0305/)) return str.replace(/\u0305/g, '');
        // if already has a bar, remove it
        else if(str.length === 1 || firstOnly) {
            str = str.split('');
            str.splice(1, 0, '\u0304');
            return str.join('');
        } else return [...str.split(''), ''].join('\u0305');
    }

    // unicode symbol for placing a dot over the middle char of a string
    static dot = (str) => str.split('').map((c, i, a) => i === Math.floor(a.length / 2) ? c + '\u0307' : c).join('');


    /**
     * Evaluate the expression with a function
     * @param {function(logic: Logic, operator: string, variables: object): void} func
     * @returns {Logic} logic
     */
    evaluate(func) {
        const logic = new Logic(null);
        this.expression.forEach((x) => {
            // if expression is a expression, resolve
            if(x instanceof BooleanExpression) {
                Object.assign(x.inputs, this.inputs);
                x.evaluate();
            }
            let operator = Object.keys(x)[0];
            let variables = x[operator];
            func(logic, operator, variables);
            return logic;
        });
        return logic;
    }

    /**
     * Get the value of the expression
     * @param {Object} [inputsdata] - The inputs to use in the expression.
     * @returns {Boolean} the boolean value
     */
    valueOf(inputdata={}) {
        Object.assign(this.inputs, inputdata);
        return this.evaluate((logic, operator, variables) => {
            variables = variables.map((v) => {
                if(v instanceof BooleanExpression) {
                    Object.assign(v.inputs, this.inputs);
                    return v.valueOf(inputdata);
                } else return this.inputs[v]
            });
            logic[operator](...variables);
        }).valueOf();
    }

    /**
     * Return the string representation of the expression.
     * @param {Object} [inputdata] - The inputs to use in the expression.
     * @param {boolean} [labels=true] - If false use values not labels.
     * @param {boolean} [parenthesis=false] - If true, add parenthesis around expressions.
     * @returns {string} string
     */
    toString(inputdata={}, labels=true, parenthesis=false) {
        // convert inputdata to logic
        this.handleInput(...Object.keys(inputdata));
        let str = '';
        let len = this.expression.length - 1;
        let parBefore = false;
        this.evaluate((logic, operator, variables) => {
            variables = variables.filter((v) => v !== null).map((v, i) => {
                if(v instanceof BooleanExpression) return v.toString(inputdata, labels, true);
                else return labels ? v : this.inputs[v];
            });
            //console.log(operator, variables);
            if(variables.length === 1 || parBefore) {
                variables.unshift('');
                parBefore = false;
            }
            if(operator === 'not' && variables.length === 0) str = `¬${str}`;
            else switch (operator) {
                case 'and':  str += variables.join(' ∧ '); break;
                case 'or':   str += variables.join(' ∨ '); break;
                case 'xor':  str += variables.join(' ⊕ '); break;
                case 'nand': str += variables.join(' ⊼ '); break;
                case 'nor':  str += variables.join(' ⊽ '); break;
                case 'xnor': str += variables.join(' ⊻ '); break;
                case 'not':  str += labels ? BooleanExpression.bar(variables.toString()) : variables[0].valueOf(); break;
                default:     str += variables.join(' ' + operator + ' ');
            }
            if((parenthesis || len-->0) && operator !== 'not') {
                str = '(' + str + ')';
                parBefore = true;
            }
        });
        return str;
    }

    /**
     * Return the string representation of the expression with mathimatical symbols.
     * @param {"math"|"logic"|"boolean"} [output="logic"] - math (eg. +-*), logic (eg. ∧∨¬), boolean (eg. &&||!)
     * @returns {string} string
     */
    toExpression(output) {
        let str = this.toString();
        if(output == 'math') {
            str = str.replace(/∧/g, '*')
                .replace(/∨/g, '+')
                .replace(/⊕/g, '^')
                .replace(/→/g, '->')
                .replace(/↔/g, '<->')
                .replace(/⊼/g, '*~')
                .replace(/⊽/g, '+~')
                .replace(/⊻/g, '^~')
                .replace(/¬/g, '~')
                .replace(/(.)\u0304/g, '$1\u0307')
                .replace(/ (.)\u0304/g, '$1');
        }
        if(output == 'logic') {
            str = str.replace(/∧/g, '&&')
                .replace(/∨/g, '||')
                .replace(/⊕/g, '^')
                .replace(/→/g, '->')
                .replace(/↔/g, '<->')
                .replace(/⊼/g, 'nand')
                .replace(/⊽/g, 'nor')
                .replace(/⊻/g, 'nxor')
                .replace(/¬/g, '!')
                .replace(/(.)\u0304/g, '!$1')
                .replace(/ (.)\u0305/g, ' !$1')
                .replace(/\u0305/g, '')
        }
        return str;
    }

    /**
     * Print the expression and result.
     * @param {Object} [inputdata] - The inputs to use in the expression.
     * @returns {string} string
     */
    print(inputdata={}) {
        // find the missing inputs
        let missing = Object.keys(this.inputs).filter((x) => inputdata[x] === undefined);
        missing = missing.filter((x) => x !== 'undefined');
        // iterate over all possible combinations of the missing inputs
        let combinations = Math.pow(2, missing.length);
        let str = '';
        if(missing.length > 0) str += `Missing ${missing.length} input${missing.length > 1 ? 's' : ''} (${missing.join(', ')}). `;
        str += `Resolving ${combinations} possible state${combinations>1?'s':''}:\n`;
        for(let i = 0; i < combinations; i++) {
            let fixedinput = {...inputdata};
            for(let j = 0; j < missing.length; j++) fixedinput[missing[missing.length-1-j]] = (i & (1 << j)) > 0;
            // assign the fixedinput to this.inputs
            Object.assign(this.inputs, fixedinput);
            str += `\t${this.toString({}, false)} = ${this.valueOf()}\n`;
        }
        return str.replace(/true/g, 'true ');
    }

    /**
     * Search for labels and add them to the top level expression.
     */
     getLabels() {
        this.evaluate((logic, operator, variables) => {
            variables.forEach((v) => {
                if(v instanceof BooleanExpression) {
                    Object.keys(v.outputs).forEach((n) => this.outputs[n] = v.outputs[n]);
                    v.getLabels();
                }
            });
        });
    }

    /**
     * Return a truth table for the expression as an 1d array.
     * @returns {Array} truth table
     */
    truthVector() {
        let inputs = Object.keys(this.inputs);
        let table = [];
        if(Object.keys(this.outputs).length == 0) this.label();
        this.getLabels();

        if(Object.keys(this.outputs).length == 0) this.label();
        for(let out in this.outputs) {
            let states = Math.pow(2, inputs.length);
            let vector = [];
            for(let i = 0; i < states; i++) {
                let bin = i.toString(2).padStart(inputs.length, '0');
                let row = {};
                for(let j in bin) row[inputs[j]] = bin[j]==='1';
                let q = this.valueOf(row);
                vector.push(q===0?null:q);
            }
            let col = {};
            col[out] = vector;
            table.push(col);
        }
        return table;
    }

    /**
     * Get the names of the inputs.
     * @returns {{name: String, inverted: boolean}} inputs
     */
    getInputs() {
        let names = [];
        for(let n of Object.keys(this.inputs)) names.push({name: this.inputs[n].inverted ? BooleanExpression.bar(n) : n, inverted: this.inputs[n].inverted});
        return names;
    }

    /**
     * Return a truth table for the expression.
     * @returns {Array} truth table
     */
    truthTable() {
        let inputs = this.getInputs();
        let outputs = this.truthVector();
        let states = Math.pow(2, inputs.length);
        let table = [];
        let hasNull = false;
        for(let i = 0; i < states; i++) {
            let bin = i.toString(2).padStart(inputs.length, '0').split('');
            let row = {};
            for(let j in bin) row[inputs[j].name] = bin[j]===(inputs[j].inverted ? '0' : '1');
            for(let out in outputs) row[Object.keys(outputs[out])[0]] = Object.values(outputs[out])[0][i];
            if(row[Object.keys(row)[Object.keys(row).length-1]] === null) hasNull = true;
            table.push(row);
        }
        if(hasNull) console.warn('   *** NOR, NAND & XNOR are not supported fully ***\nOutput may be null if the expression cannot be resolved.');
        return table;
    }

    /**
     * Return a JS function for the expression.
     * @returns {Function} function
     */
    toFunction() {
        return new Function(...Object.keys(this.inputs), `return ${this.toExpression('logic')}`);
    }

    /**
     * Generate expression from a truth table.
     * @param {Array} table - The truth table.
     * @returns {BooleanExpression} expression
     */
    static fromTruthTable(table) {
    }


    /**
     * Iterate over the expression list to match a pair of operators.
     * @param {string} operator1
     * @param {string} operator2
     * @returns {[number]} index
     */
    findPair(operator1, operator2, last = -1) {
        for(let i = 0; i < this.expression.length-1; i++) {
            if(this.expression[i] instanceof BooleanExpression) return [i, ...this.expression[i].findPair(operator1, operator2, i)];
            const op1 = Object.keys(this.expression[i])[0];
            const op2 = Object.keys(this.expression[i+1])[0];
            if(op1 === operator1 && op2 === operator2) return [i];
        }
        return [-1];
    }

    /**
     * Print the simplifcation step.
     * @param {string} text - The step decsription.
     * @param {boolean} [expression=true] - Print the expression.
     */
    printChange(text, expression = true) {
        let str = `› ${text.padEnd(25)}`
        if(expression===true) str += ` ⇒ ${this.toString()}`;
        else if(expression === null) str += `${this.toString({})}`;
        console.info(str);
        this.lastChange = this.toString();
    }

    /**
     * un nest the expression.
     * @returns {BooleanExpression} expression
     */
    unNest() {
        // find BooleanExpression in the expression list
        this.expression.forEach((e, i) => {
            const op = Object.keys(e)[0];
            e[op].forEach((v, j) => {
                if(i === 0 && v instanceof BooleanExpression) {
                    let opi = Object.keys(v.expression[0])[0];
                    let obj = {};
                    obj[opi] = [...this.expression[i][op].splice(j, 1)[0].expression[0][opi]];
                    this.expression.splice(i, 0, obj);
                }
            });
        });
        
        return this;
    }

    /**
     * Sort the expression so inputs are alphebetically ordered.
     * @returns {BooleanExpression} expression
     */
    sort() {
        this.unNest();
        // Sort the input list for truth table generation
        this.inputs = Object.keys(this.inputs).sort().reduce((obj, key) => {
            obj[key] = this.inputs[key];
            return obj;
        }, {});

        // Sort each level of the expression so the inputs are ordered alphabetically
        this.expression.forEach((e) => {
            Object.keys(e).forEach((op) => {
                if(e[op] instanceof BooleanExpression) return;
                let newOrder = false;
                e[op].sort((a, b) => {
                    if(a > b) return 1;
                    else if(a < b) {
                        newOrder = [a, b];
                        return -1;
                    } else return 0;
                });
                if(newOrder) this.printChange(`Swap inputs '${newOrder[0]}' ⇆ '${newOrder[1]}'`);
            });
        });

        this.unNest();

        return this;
    }

    /**
     * Clean up the expression for any unnecessary operators.
     * @description Avoid symbols with no pair which can happen after certain simplifications. This generally does not effect calulation but can prohitbit further simplifications.
     * @returns {BooleanExpression} expression
     */
    clean() {
        this.unNest();
        // Remove any unnecessary operators
        this.expression.forEach((e, i) => {
            const op = Object.keys(e)[0];
            if(e[op].length === 0 && op !== 'NOT') this.expression.splice(i, 1);
        });
        return this;
    }

    /**
     * Apply idempotent laws to the expression.
     * @description duplicate inputs are removed, eg. A ∧ A = A, B ∨ B = B
     * @returns {BooleanExpression} expression
     */
    idempotent() {
        ['and', 'or'].forEach((op) => this.expression.filter(valid => valid[op]).forEach((exp) => {
            const removed = exp[op].filter((x, i, a) => a.indexOf(x) !== i);
            if(removed.length > 0) {
                exp[op] = [...new Set(exp[op])];
                this.printChange(`Remove duplicate${removed.length>1?'s':''} '${[...new Set(removed)].join('\', \'')}'`);
            }
        })); 
        return this;
    }

    /**
     * Apply associative laws to the expression.
     * @description inputs are grouped by operator, eg. A ∧ (B ∧ C) = (A ∧ B ∧ C), A ∨ (B ∨ C) = (A ∨ B ∨ C)
     * @returns {BooleanExpression} expression
     */
    associative() {
        ['and', 'or', 'xor'].forEach((op) => {
            const branches = [...this.findPair(op, op), -1];
            if(branches[0] == -1) return;
            if(branches[1] !== -1) this.expression[branches[0]].simplify();
            else {
                this.expression[branches[0]][op] = [...this.expression[branches[0]][op], ...this.expression.splice(branches[0]+1, 1)[0][op]];
                this.printChange(`Combine ${op.toLocaleUpperCase()}'s`);
            }
        });
        return this;
    }

    /**
     * Apply absorption laws to the expression.
     * @description inputs are removed if they are already covered by another operator, eg. A ∧ (A ∨ B) = A, A ∨ (A ∧ B) = A
     * @returns {BooleanExpression} expression
     */
    absorption() {
        this.expression.map((x) => Object.keys(x)[0]).filter(x => x === 'and' || x === 'or').reverse().forEach((op) => {
            const iop = op === 'and' ? 'or' : 'and';
            const branches = [...this.findPair(op, iop), -1];
            //console.log(this.expression[0]['and']);
            if(branches[0] !== -1) {
                let a = this.expression[branches[0]][op];
                let b = this.expression[branches[0]+1][iop];
                const obsolete = a.filter((x) => !b.includes(x));
                const keep = a.filter((x) => b.includes(x));
                if(keep.length === 0) return; // not valid
                // replace a with keep
                this.expression[branches[0]][op] = keep;
                // remove the obsolete operator
                this.expression.splice(branches[0], 1);
                this.printChange(`${op.toLocaleUpperCase()} absorption of ${obsolete.map((x) => x.toString()).join(', ')}`);
                return;
            }
        });
        return this;
    }

    /**
     * Apply distributive laws to the expression.
     * @description inputs are grouped by operator, eg. A ∧ (B ∨ C) = (A ∧ B) ∨ (A ∧ C), A ∨ (B ∧ C) = (A ∨ B) ∧ (A ∨ C)
     * @returns {BooleanExpression} expression
     */
    distributive() {
        ['or', 'and'].forEach((op) => {
            const iop = op === 'and' ? 'or' : 'and';
            const branches = [...this.findPair(op, iop), -1];
            if(branches[0] !== -1) {
                const a = this.expression[branches[0]][op];
                if(this.expression[branches[0]+1][iop][0] instanceof BooleanExpression) {
                    const b = this.expression[branches[0]+1][iop][0].expression[0][op];
                    const common = a.filter(x => b.includes(x));
                    const rest = [...a, ...b].filter(x => !common.includes(x));
                    let r = (new BooleanExpression()[iop](...rest));
                    this.expression[branches[0]] = (new BooleanExpression()[op](...common, r)).expression[0];
                    this.expression[branches[0]+1][iop].splice(0, 1);
                    this.clean();
                    this.printChange(`Apply distributive law`);
                }
            }
        });
        return this;
    }

    /**
     * Remove unused inputs
     * @returns {BooleanExpression} expression
     */
    removeUnused() {
        // remove unused inputs
        let usedInputs = [];
        // check expression for used inputs
        this.expression.forEach((e) => {
            const op = Object.keys(e)[0];
            e[op].forEach((x) => {
                usedInputs.push(x);
            });
        });
        // if there are more than one output include there inputs
        if(Object.keys(this.outputs).length > 1) Object.keys(this.outputs).forEach((x) => usedInputs = [...usedInputs, ...Object.keys(this.outputs[x].inputs)]);
        // get the unused inputs
        Object.keys(this.inputs).filter((x) => !usedInputs.includes(x)).forEach((x) => {
            delete this.inputs[x];
            this.printChange(`Removed obsolete input '${x}'`, false);
        });
        return this;
    }

    /**
     * Update labels
     * @returns {BooleanExpression} expression
     * @obsolete Only works on the default full expression label
     */
    updateLabels() {
        // update label of the expression
        if(this.outputs[this.original]) {
            this.outputs[this.toString()] = this.outputs[this.original];
            delete this.outputs[this.original];
        }
    }


    /**
     * Simplify the expression.
     * @returns {BooleanExpression} expression
     */
    simplify() {
        this.lastChange = this.toString();
        if(!this.original) {
            this.original = this.lastChange;
            this.printChange(`Simplifying boolean equation:`, null); 
        }
        
        const change = this.lastChange;
        // Orderd carefully to get the best results and avoid infinite loops
        this.sort();        // Dissolve nested expressions and sort if applicable
        this.idempotent();  // Apply idempotent law
        this.associative(); // Apply associative law
        this.absorption();  // Apply absorption law
        this.distributive();// Apply distributive law
        // Rinse and repaet until no changes are made
        if(change !== this.toString()) this.simplify();
        this.updateLabels();
        this.removeUnused();
        delete this.lastChange;
        return this;
    }

    /**
     * Convert a expression from string to a BooleanExpression object.
     * @static
     * @param {String} str - string to convert
     * @returns {BooleanExpression} expression
     */
    static parse(str) {
        const expressions = [];
        str = str.replace(/\s/g, ''); // Remove whitespace
        do {
            const exp = new BooleanExpression();
            const op = str.replace(/^.*?([^\+|\*|\^\(\)]+)(\+|\*|\^)([^\+|\*|\^\(\)]+).*$/, '$2;$1;$3').split(';');
            str = str.replace(`(${op[1]}${op[0]}${op[2]})`, `@${expressions.length}`);
            str = str.replace(`${op[1]}${op[0]}${op[2]}`, `@${expressions.length}`);
            switch(op[0]) {
                case '+': op[0] = 'or'; break;
                case '*': op[0] = 'and'; break;
                case '^': op[0] = 'xor'; break;
            }
            if(op[1].match(/^\@\d+$/)) {
                let i = parseInt(op[1].replace(/^@/, ''));
                op[1] = expressions[i];
                expressions[i] = null;
            }
            if(op[2].match(/^\@\d+$/)) {
                let i = parseInt(op[2].replace(/^@/, ''));
                op[2] = expressions[i];
                expressions[i] = null;
            }
            expressions.push(exp[op[0]](op[1], op[2]));
        } while(!str.match(/^\@\d+$/));
        return expressions.pop();
    }

}

export const booleanOperators = {
    and: BooleanExpression.and,
    nand: BooleanExpression.nand,
    or: BooleanExpression.or,
    nor: BooleanExpression.nor,
    xor: BooleanExpression.xor,
    xnor: BooleanExpression.xnor,
    not: BooleanExpression.not,
}