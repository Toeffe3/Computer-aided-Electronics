// Imports
import { loop, defaultWindowOptions } from './modules/functions.js';
import Desktop from './modules/desktop.js';
import Style from './modules/style.js';
import Graph from './modules/graph.js';
import Series from './modules/maths/series.js';
import store from './modules/appdata.js';

/** @typedef {'import ("./modules/typedefs.js")'} Types' */

const checkCSS = (name) => `${name}`.match(/^--/) ? getComputedStyle(document.body).getPropertyValue(name) : name;
const styles = {
	fill: (color) => (new Style())
		.noStroke()
		.setFill(checkCSS(color)),
	stroke: (color, width = 1) => (new Style())
		.noFill()
		.setStroke(checkCSS(color), checkCSS(width)),
	text: () => (new Style())
		.setFill(checkCSS("--tertiary-cf"))
		.setText(null, checkCSS("--tertiary-f"))
		.setTextPosition("left", "middle", "ltr"),
	grid: () => (new Style())
		.noFill()	
		.setStroke(checkCSS("--secondary-cf")+"88", 0.75),
	gridHighlight: () => (new Style())
		.noFill()
		.setStroke(checkCSS("--secondary-cf")+"aa", 1.25),
	axis: () => (new Style())
		.setFill(checkCSS("--secondary-cf"))
		.setText(null, checkCSS("--tertiary-f"))
		.setStroke(checkCSS("--secondary-cf")+"aa", 2),
};
styles.signal = (i) => [
	styles.stroke("#0f8", 2.25),
	styles.stroke("#f80", 2.25),
	styles.stroke("#f08", 2.25),
	styles.stroke("#8f0", 2.25),
	styles.stroke("#08f", 2.25),
	styles.stroke("#80f", 2.25),
][i];


const lowSampleSignal = Series.sineWave(0.053, 4.4, 0.1, 240, 0).cast("TimeDomain");
const highSampleSignal = Series.sineWave(0.053, 4.4, 1, 240, 0).cast("TimeDomain");


const desktop = new Desktop(store.restoreWindows());

// desktop.createWindow("TimeDomain", { ...defaultWindowOptions, origoX: 0, origoY: -200, height: 490, position: { x: 0, y: 0 } });
// desktop.createWindow("FreqencyDomain", { ...defaultWindowOptions, origoX: -335, origoY: -600, height: 600, width: 670, position: { x: 400, y: 0 } });
// desktop.createWindow("Debug window", { ...defaultWindowOptions, height: 80, position: { x: 0, y: 520 } });

desktop.callOn(TimeDomain => {
	TimeDomain.addLayer("background"); // static background
	TimeDomain.addLayer("foreground"); // updateable foreground
	TimeDomain.call(layer => {
		layer.setScale(120 / 400, 1 / 35);
		layer.setUnit("s", "V");
	});
}, "TimeDomain");
desktop.callOn(FreqencyDomain => {
	FreqencyDomain.addLayer("background"); // static background
	FreqencyDomain.addLayer("foreground"); // updateable foreground
	FreqencyDomain.call(layer => {
		layer.setScale(1 / 10, 1 / 2);
		layer.setUnit("Hz", "");
	});
}, "FreqencyDomain");
desktop.callOn(DebugWindow => {
	DebugWindow.addLayer("background"); // static background
	DebugWindow.addLayer("foreground"); // updateable foreground
}, "Debug window");

let pos = 0;

const program = loop(status => {
	const { frame, fps, time } = status;
	const { width, height, windows } = desktop.getInfo();
	desktop.callOn(TimeDomain =>
		TimeDomain.callOn(forground => {
			pos = frame % 120;
			forground.clear();
			forground.setViewport(pos, null, false);
			forground.plot(highSampleSignal, styles.signal(0));
			forground.plot(lowSampleSignal, styles.signal(1));
		}, "foreground"),
		"TimeDomain");

	desktop.callOn(FreqencyDomain =>
		FreqencyDomain.callOn(forground => {
			forground.clear();
			forground.plot(highSampleSignal.fft(), styles.signal(0));
			forground.plot(lowSampleSignal.fft(), styles.signal(1));
		}, "foreground"),
		"FreqencyDomain");

	desktop.callOn(DebugWindow =>
		DebugWindow.callOn(forground => {
			forground.clear();
			forground.drawText(
				`runtime: ${Math.floor(time / 1000 / 60)}:${Math.floor(time / 1000) % 60}:${(time % 1000).toString().padStart(3, "0")}`,
				0, 10,
				styles.text(),
				"cornor",
				false
			);
			forground.drawText(
				`fps: ${fps} | frame: ${frame}`,
				0, 30,
				styles.text(),
				"cornor",
				false
			);
			forground.drawText(
				`open windows: ${windows.length}`,
				0, 50,
				styles.text(),
				"cornor",
				false

			);
		}, "foreground"),
		"Debug window");
});


program.onresize(() => {
	desktop.callOn(TimeDomain => {
		TimeDomain.callOn(background => {
			background.clear();
			background.drawRect(0, 0, background.canvas.width, background.canvas.height, styles.fill("--primary-cb"), "cornor", false);
			background.drawGrid(10, 0.5, styles.grid());
			background.drawAxis(10, 1, styles.axis(), true, styles.gridHighlight());
		}, "background");
	}, "TimeDomain");
	desktop.callOn(FreqencyDomain => {
		FreqencyDomain.callOn(background => {
			background.clear();
			background.drawRect(0, 0, background.canvas.width, background.canvas.height, styles.fill("--primary-cb"), "cornor", false);
			background.drawGrid(5, 25, styles.grid());
			background.drawAxis(10, 50, styles.axis(), true, styles.gridHighlight());
		}, "background");
	}, "FreqencyDomain");
});

program.start();

console.log(styles);

console.log(desktop.windows);
// save all windows
desktop.call(window => {
	store.saveWindow(window)
});