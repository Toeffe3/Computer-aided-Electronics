// create a mouse object
const mouse = {
    x: 0,
    y: 0,
    clickedX: 0,
    clickedY: 0,
    down: false
};
// create mouse listeners
document.onmousemove = (e) => {
    mouse.x = e.x;
    mouse.y = e.y;
};
document.onmousedown = (e) => {
    mouse.clickedX = e.x;
    mouse.clickedY = e.y;
    mouse.down = true;
};
document.onmouseup   = (e) => {
    mouse.down = false;
};

// create a layered canvas
const windowView = new Layered();
windowView.addLayer(new Graph(-1, -1), "background"); // static background
windowView.addLayer(new Canvas(-1, -1), "foreground"); // updateable foreground
windowView.addLayer(new Canvas(-1, -1), "ui"); // user interface layer

// set origo to the center of the screen
windowView.callOn(layers => layers.origo(window.innerWidth/2, window.innerHeight/2), "background", "foreground");

// Undepended
const opoint = new Cordinate(0, 0);
const arm = new Kinematic();
arm.connect("p1a1", new Vector(100, degToRad(-90)));
arm.connect("p1a2", new Vector(75, degToRad(-45)), "p1a1");
arm.connect("p1a3", new Vector(50, degToRad(0)), "p1a2");

arm.connect("p2a1", new Vector(100, degToRad(90)));
arm.connect("p2a2", new Vector(75, degToRad(135)), "p2a1");
arm.connect("p2a3", new Vector(50, degToRad(180)), "p2a2");

arm.execute("ref", "move", () => [40,10]);

// Depended
const direct = new Vector(0, 0);
const hand = new Cordinate(0, 0);

// Other
let lastStep = -2; // step cannot be -2, it will therefor differ first time

// use loop with a framerate
const program = loop((status) => {
    const {frame, fps, time, delta, animateId, steps} = status;
    // update the ui layer
    // only update the ui layer if the steps has changed
    if(lastStep != steps) windowView.callOn(ui => {
        ui.clear();
        // stop by calling step 1, so that the canvas can update once befor halting (eg. updating text on button)
        if(steps === 0) ui.drawButton("Start", 10, 10, 100, 40, undefined, undefined, () => program.start());
        else ui.drawButton("Stop", 10, 10, 100, 40, undefined, undefined, () => program.step(1));
    }, "ui");
    lastStep = steps;
    
    windowView.callOn(foreground => {
        // draw the arm
        arm.execute("p1a1", "rotate", () => [degToRad( 0.5)]);
        arm.execute("p1a2", "rotate", () => [degToRad( 0.5)]);
        arm.execute("p2a2", "rotate", () => [degToRad(-0.5)]);
        
        foreground.clear();
        arm.draw(foreground);
        
        arm.getDeepestPoints().forEach(point => {
            foreground.drawPoint(point, "red");
            direct.point(point)
            foreground.drawVector(direct, "#00ff00");
        });

    }, "foreground");
}, 24);

// load the program
program.step(1);
program.start();

// the onResize function is called when the window is resized but also when the canvas is loaded
onResize(() => {
    // resize of cavas updates the relative position of origo
    windowView.call(layers => layers.resize());
    windowView.callOn(background => {
        background.clear();
        background.drawGrid(10, 10, "#00000020");
        background.drawAxis(50, "#00000060", true);
    }, "background");
    windowView.callOn(ui => {
        program.stop();
        ui.clear();
        // stop by calling step 1, so that the canvas can update once befor halting (eg. updating text on button)
        ui.drawButton("Start", 10, 10, 100, 40, undefined, undefined, () => {
            program.step(-1);
            program.start();
        });
    }, "ui");
});