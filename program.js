/** @type {windowOptions} */
const defaultWindowOptions = {
    width: 400,
    height: 400,
    origoX: 0,
    origoY: 0,
    zIndex: 1,
    resizable: true,
    closeable: true,
    dragable: true,
    position: {
        x: null,
        y: null
    }
}

const styles = {
    fill: (color) => (new Style())
        .noStroke()
        .setFill(color),
    stroke: (color, width=1) => (new Style())
        .noFill()
        .setStroke(color, width),
    text: (new TextStyle())
        .setFill("#fff")
        .setText(16, "consolas", "left"),
    grid: (new Style())
        .noFill()
        .setStroke("#aaa8", 0.75),
    gridHighlight: (new Style())
        .noFill()
        .setStroke("#aaaa", 1.25),
    axis: (new TextStyle())
        .setFill("#fffa")
        .setText(12, "consolas")
        .setStroke("#fffa", 2),
};
styles.signal = [
    styles.stroke("#0f8", 2.25),
    styles.stroke("#f80", 2.25),
    styles.stroke("#f08", 2.25),
    styles.stroke("#8f0", 2.25),
    styles.stroke("#08f", 2.25),
    styles.stroke("#80f", 2.25),
];


const lowSampleSignal = Series.sineWave(0.053, 4.4, 0.1, 120, 0).cast("TimeDomain");
const highSampleSignal = Series.sineWave(0.053, 4.4, 1, 120, 0).cast("TimeDomain");


const desktop = new Desktop();

desktop.createWindow("TimeDomain", {...defaultWindowOptions, origoX: 0, origoY: -200, height: 490});
desktop.createWindow("FreqencyDomain", {...defaultWindowOptions, origoX: -335, origoY: -600, height: 600, width: 670});
desktop.createWindow("Debug window", {...defaultWindowOptions, height: 80, position: {y: 490, x: 0}});
desktop.callOn(TimeDomain => {
    TimeDomain.addLayer(new Graph(), "foreground"); // updateable foreground
    TimeDomain.addLayer(new Graph(), "background"); // static background
    TimeDomain.call(layer => {
        layer.setScale(120/400, 1/35);
        layer.setUnit("s", "V")
    });
}, "TimeDomain");
desktop.callOn(FreqencyDomain => {
    FreqencyDomain.addLayer(new Graph(), "foreground"); // updateable foreground
    FreqencyDomain.addLayer(new Graph(), "background"); // static background
    FreqencyDomain.call(layer => {
        layer.setScale(1/10, 1/2);
        layer.setUnit("Hz", "");
    });
}, "FreqencyDomain");
desktop.callOn(DebugWindow => {
    DebugWindow.addLayer(new Canvas(), "foreground"); // updateable foreground
    DebugWindow.addLayer(new Canvas(), "background"); // static background
}, "Debug window");

const program = loop(status => {
    const {frame, fps, target, time, delta, average} = status;
    const {width, height, windows} = desktop.getInfo();
    desktop.callOn(TimeDomain =>
        TimeDomain.callOn(forground => {
            forground.clear();
            forground.drawRect(0, 0, forground.canvas.width, forground.canvas.height, styles.fill("black"), "cornor");
            forground.plot(highSampleSignal, styles.signal[0]);
            forground.plot(lowSampleSignal, styles.signal[1]);
        }, "foreground"),
    "TimeDomain");

    desktop.callOn(FreqencyDomain =>
        FreqencyDomain.callOn(forground => {
            forground.clear();
            forground.drawRect(0, 0, forground.canvas.width, forground.canvas.height, styles.fill("black"), "cornor");
            forground.plot(highSampleSignal.fft(), styles.signal[0]);
            forground.plot(lowSampleSignal.fft(), styles.signal[1]);
        }, "foreground"),
    "FreqencyDomain");

    desktop.callOn(DebugWindow => 
        DebugWindow.callOn(forground => {
            forground.clear();
            forground.drawText(`runtime: ${Math.floor(time/1000/60)}:${Math.floor(time/1000)%60}:${(time%1000).toString().padStart(3,"0")}`, 0, 10, styles.text);
            forground.drawText(`delta: ${delta} | frame: ${frame}`, 0, 30, styles.text);
            forground.drawText(`fps: ${fps} | average: ${average}/${target}`, 0, 50, styles.text);
            forground.drawText(`open windows: ${windows.length}`, 0, 70, styles.text);
        },"foreground"),
    "Debug window");
}, 30);

program.onresize(() => {
    desktop.callOn(TimeDomain => {
        TimeDomain.callOn(background => {
            background.clear();
            background.drawGrid(10, 0.5, styles.grid);
            background.drawAxis(60, 1, styles.axis, true, styles.gridHighlight);
        }, "background");
    }, "TimeDomain");
    desktop.callOn(FreqencyDomain => {
        FreqencyDomain.callOn(background => {
            background.clear();
            background.drawGrid(5, 25, styles.grid);
            background.drawAxis(10, 50, styles.axis, true, styles.gridHighlight);
        },"background");
    },"FreqencyDomain");
});

program.start();