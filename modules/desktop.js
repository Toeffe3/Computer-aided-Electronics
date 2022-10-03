import {defaultWindowOptions, listTrackerGenerator} from './functions.js';
import Layered from './layer.js';
import store from "./appdata.js";
/**
 * Desktop class
 * @description The desktop class is used to create and manage multiple windows for a graphical user interface (GUI).
 * @module desktop
 */
export const name = 'desktop';

export default class Desktop {
	/**
	 * Create a desktop
	 * @class
	 * @property {Object<string, Layered>} windows - windows
	 * @property {HTMLElement} element - desktop element
	 * @property {GeneratorFunction} trackingid - incrementing number generator
	 * @param {[Layered]} restoredWindows - windows to add to the desktop
	 * @param {HTMLElement} hook - element to add the desktop to
	 * @returns {Desktop}
	 */
	constructor(restoredWindows, hook=document.body) {
		this.setupUI(hook);
		/** @type {HTMLElement} */
		this.element = document.getElementById("desktop");
		/** @type {Object<string, Layered>} */
		this.windows = {};
		/** @type {listTrackerGenerator} */
		this.trackingid = listTrackerGenerator();
		// Add the windows to the desktop
		if(restoredWindows) restoredWindows.forEach(w => this.createWindow(w, w.options));
		return this;
	}

	/**
	 * Sets up the UI such as context menu
	 * @private
	 * @param {HTMLElement} hook
	 * @returns {void}
	 */
	setupUI(hook) {
		const desktop = document.createElement("div");
		desktop.id = "desktop";
		const contextMenu = document.createElement("div");
		contextMenu.id = "contextMenu";
		contextMenu.style.display = "none";
		contextMenu.style.position = "fixed";
		contextMenu.style.zIndex = "1000";

		// Create the context menu options
		// Create the context header
		const contextHeader = document.createElement("div");
		contextHeader.classList.add("context-header");
		contextHeader.innerText = "Context Menu";
		contextMenu.appendChild(contextHeader);

		//-------------------- Desktop Menu Options --------------------//

		// Add a window to the desktop
		const addWindow = document.createElement("div");
		addWindow.className = "add-window";
		addWindow.innerHTML = "New Window";
		addWindow.onclick = () => this.createWindow(prompt("Window Name"), defaultWindowOptions);
		contextMenu.appendChild(addWindow);

		// Open project properties
		const openProjectProperties = document.createElement("div");
		openProjectProperties.className = "open-project-properties";
		openProjectProperties.innerHTML = "Project Properties";
		openProjectProperties.onclick = () => {
			// hide properties-window
			document.getElementById("properties-window").style.display = "none";
			// show properties-desktop
			document.getElementById("properties-desktop").style.display = "grid";
		}
		contextMenu.appendChild(openProjectProperties);

		//-------------------- Window Context Menu --------------------//

		// Open window properties
		const openWindowProperties = document.createElement("div");
		openWindowProperties.className = "open-window-properties";
		openWindowProperties.innerHTML = "Window Properties";
		openWindowProperties.onclick = () => {
			// hide properties-desktop
			document.getElementById("properties-desktop").style.display = "none";
			// create properties-window form
			const propertiesWindow = document.getElementById("properties-window");
			propertiesWindow.style.display = "grid";
		}
		contextMenu.appendChild(openWindowProperties);

		// Save as
		const saveAs = document.createElement("div");
		saveAs.className = "save-as";
		saveAs.innerHTML = "Save As";
		saveAs.onclick = () => {
			// Implement on updateWindowContextMenu
		}
		contextMenu.appendChild(saveAs);

		desktop.addEventListener("contextmenu", (e) => {
			e.preventDefault();
			contextMenu.style.left = e.clientX + "px";
			contextMenu.style.top = e.clientY + "px";
			// get all parents until desktop
			if(e.target.id === "desktop") this.updateContextMenu();
			else this.updateWindowContextMenu(e);
			contextMenu.style.display = "block";
		});
		desktop.addEventListener("click", () => contextMenu.style.display = "none");
		desktop.appendChild(contextMenu);
		hook.appendChild(desktop);
	}

	/**
	 * Update and show the context menu for desktop
	 * @returns {void}
	 */
	updateContextMenu() {
		const contextMenu = document.getElementById("contextMenu");
		contextMenu.style.display = "block";
		contextMenu.children[0].innerText = "Desktop";
		// Set the clickable options
		// loop through all context options make first 2 visible
		for(let i = 1; i < contextMenu.children.length; i++)
			if(i < 3) contextMenu.children[i].style.display = "block";
			else contextMenu.children[i].style.display = "none";
	}

	/**
	 * Update and show the context menu for a window
	 * @param {MouseEvent} e
	 * @returns {void}
	 */
	updateWindowContextMenu(e) {
		const contextMenu = document.getElementById("contextMenu");
		contextMenu.style.display = "block";
		contextMenu.children[0].innerText = "Window";
		let w = e.target;
		// Ensure that the window is the target, not sub elements
		while(!w.classList.contains("window")) w = w.parentElement;
		// Set the save as function
		contextMenu.children[4].onclick = () => {
			this.getLayer(w.children[0].children[0].innerHTML).saveAs(`image/${store.user("saveAsExtension")}`).then((image) => {
				console.log(image.type, store.user("saveAsExtension"));
				const link = document.createElement("a");
				link.href = URL.createObjectURL(image);
				link.download = `${w.children[0].children[0].innerHTML}.${store.user("saveAsExtension")}`;
				link.click();
			});
		}
		// loop through all context options make first 2 hidden
		for(let i = 1; i < contextMenu.children.length; i++)
			if(i < 3) contextMenu.children[i].style.display = "none";
			else contextMenu.children[i].style.display = "block";
	}

	/**
	 * Create/Update event listeners
	 * @param {string} name - name of the window
	 */
	updateListeners(name) {
		const w = this.getWindow(name);
		const resizeButton = w.querySelector(".window-header-button-resize");
		const dragButton = w.querySelector(".window-header-button-drag");
		const closeButton = w.querySelector(".window-header-button-close");

		if(resizeButton) resizeButton.onmousedown = (e) => {
			e.preventDefault();
			const startX = e.clientX;
			const startY = e.clientY;
			const startWidth = Number(w.style.width.replace("px", ""));
			const startHeight = Number(w.style.height.replace("px", "")) - 30;

			document.onmouseup = (e) => {
				document.onmouseup = null;
				document.onmousemove = null;
			};

			document.onmousemove = (e) => {
				const width = startWidth + e.clientX - startX;
				const height = startHeight + e.clientY - startY;
				w.style.width = width + "px";
				w.style.height = (height + 30) + "px";
				this.windows[name].call(layer => layer.resize(width, height));
				window.dispatchEvent(new Event("resize"));
				this.windows[name].options.width = width;
				this.windows[name].options.height = height;
			}
		};

		if(dragButton) dragButton.onmousedown = (e) => {;
			e.preventDefault();
			const startX = e.clientX - w.offsetLeft;
			const startY = e.clientY - w.offsetTop;

			document.onmouseup = () => {
				document.onmouseup = null;
				document.onmousemove = null;
			};

			document.onmousemove = (e) => {
				e.preventDefault();
				w.style.left = (e.clientX - startX) + "px";
				w.style.top = (e.clientY - startY) + "px";
				this.windows[name].options.position = {
					x: e.clientX - startX,
					y: e.clientY - startY
				};
			};
		};

		if(closeButton) closeButton.onclick = () => this.removeWindow(name);
	}

	/**
	 * Creates a window that can be dragged and resized
	 * @param {string} name
	 * @param {windowOptions} options
	 * @returns {{string: Layered}}
	 */
	createWindow(name, options) {
		let restoredWindow = null;
		if(name instanceof Layered){
			restoredWindow = name;
			name = restoredWindow.name;
			delete restoredWindow.name;
		}
		else if(this.windows[name]) return Error(`Window ${name} already exists`);
		const w = document.createElement("div");
		w.classList.add("window");
		const id = this.trackingid.next().value.number;
		w.id = `did-${id}`;
		w.style.position = "absolute";
		w.style.zIndex = options.zIndex;
		w.style.width = options.width + "px";
		w.style.height = (options.height + 30) + "px";
		
		if(typeof options.position.x === 'number') w.style.left = options.position.x + "px";
		else w.style.left = id*10 + "px";
		if(typeof options.position.y === 'number') w.style.top = options.position.y + "px";
		else w.style.top = id*10 + "px";
		

		const wHeader = document.createElement("div");
		wHeader.classList.add("window-header");
		wHeader.innerHTML = `<h3 class="window-header-title">${name}</h3>`;
		
		if(options.resizable) wHeader.innerHTML += `<div class="window-header-button window-header-button-resize">⇱</div>`;
		if(options.dragable) wHeader.innerHTML += `<div class="window-header-button window-header-button-drag">◌</div>`;
		if(options.closeable) wHeader.innerHTML += `<div class="window-header-button window-header-button-close">✕</div>`;
		
		const wBody = document.createElement("div");
		wBody.classList.add("window-body");

		w.appendChild(wHeader);
		w.appendChild(wBody);
		
		if(restoredWindow) {
			this.windows[name] = restoredWindow;
			this.windows[name].htmlhook = wBody
		}
		else this.windows[name] = new Layered(wBody, options);
		this.element.appendChild(w);

		this.updateListeners(name);
		this.options = options;

		return this;
	}

	/**
	 * Remove a window
	 */
	removeWindow(name) {
		this.element.removeChild(this.windows[name].htmlhook.parentElement);
		delete this.windows[name];
	}

	/**
	 * Get a window by name
	 * @param {string} name
	 * @returns {HTMLElement}
	 */
	getWindow(name) {
		return this.windows[name].htmlhook.parentElement;
	}

	/**
	 * Get a layer by name
	 * @param {string} name
	 * @returns {Layered}
	 */
	getLayer(name) {
		return this.windows[name];
	}

	/**
	 * Get information about the desktop
	 * @returns {Object}
	 */
	getInfo() {
		return {
			windows: Object.keys(this.windows),
			width: this.element.clientWidth,
			height: this.element.clientHeight,
		};
	}

	/**
	 * Run a function on a window
	 * @param {callback<Layered>} func
	 * @param {...string} name
	 */
	callOn(func, ...names) {
		if(typeof func !== "function") throw new Error(`${func} is not a function`);
		names.forEach(name => {
			if(this.windows[name]) func(this.windows[name]);
		});
	}

	/**
	 * Run a function on all windows
	 * @param {callbackVoid<Layered>} func
	 */
	call(func) {
		Object.keys(this.windows).forEach(key => {
			console.log(key);
			func(this.windows[key]);
		});
	}

}