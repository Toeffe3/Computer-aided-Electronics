// class that implements a cordinate
class Grid {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }
    //return x
    getX() {
        return this.x;
    }
    // return y
    getY() {
        return this.y;
    }
    // return the position
    getCordinate() {
        return { x: this.x, y: this.y };
    }
    // to string
    toString() {
        return `${this.x},${this.y}`;
    }
    // returns the distance between two cordinates
    distance(cord) {
        return Math.sqrt(
            Math.pow(cord.x - this.x, 2) + 
            Math.pow(cord.y - this.y, 2)
        );
    }
    // returns the angle between two cordinates
    angle(cord) {
        return Math.atan2(cord.y - this.y, cord.x - this.x);    
    }
    // move the cordinate to a new cordinate
    cordinate(cord) {
        this.x = cord.x;
        this.y = cord.y;
        return this;
    }
    // move the cordinate to a new position
    move(x, y) {
        this.x = x;
        this.y = y;
        return this;
    }
    // set point to origin
    origin() {
        this.x = 0;
        this.y = 0;
        return this;
    }
    //copy cordinate
    copy() {
        return new Grid(this.x, this.y);
    }
}

// extend cordinate class to 3d
class Cordinate3d extends Grid {
    constructor(x, y, z) {
        super(x, y);
        this.z = z;
    }
    // returns the distance between two cordinates
    distance(cord) {
        return Math.sqrt(
                Math.pow(cord.x - this.x, 2) + 
                Math.pow(cord.y - this.y, 2) +
                Math.pow(cord.z - this.z, 2)
            );
    }
    // return all the angles between 2 3d cordinates
    angle(cord) {
        return {
            x: Math.atan2(cord.y - this.y, cord.x - this.x),
            y: Math.atan2(cord.z - this.z, cord.x - this.x),
            z: Math.atan2(cord.z - this.z, cord.y - this.y)
        };
    }
    // move the cordinate to a new cordinate
    cordinate(cord) {
        super.cordinate(cord);
        this.z = cord.z;
        return this;
    }
    // move the cordinate to a new position
    move(x, y, z) {
        super.move(x, y);
        this.z = z;
        return this;
    }
    // set point to origin
    origin(keepZ) {
        this.origin();
        if(keepZ) this.z = 0;
        return this;
    }
}