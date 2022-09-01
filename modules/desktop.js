import {listTrackerGenerator} from './functions.js';
import Layered from './layer.js';

/**
 * Creates a window organizer
 * @class Desktop
 */
 export default class Desktop {
    /**
     * Create a desktop
     * @property {Object<string, Layered>} windows - windows
     * @property {HTMLElement} element - desktop element
     * @property {GeneratorFunction} trackingid - incrementing number generator
     * @returns {Desktop}
     */
    constructor() {
        const desktop = document.createElement("div");
        desktop.id = "desktop";
        document.body.appendChild(desktop);
        /** @type {HTMLElement} */
        this.element = document.getElementById("desktop");
        /** @type {Object<string, Layered>} */
        this.windows = {};
        /** @type {listTrackerGenerator} */
        this.trackingid = listTrackerGenerator();
        /** @type {{x: number, y: number}} */
        this.nextpos = {x: 0, y: 50};
        return this;
    }

    /**
     * Create/Update event listeners
     * @param {string} name - name of the window
     */
    updateListeners(name) {
        const w = document.querySelector(`#${this.windows[name].htmlhook.parentElement.id}`);
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
        if(this.windows[name]) throw new Error(`Window ${name} already exists`);
        const w = document.createElement("div");
        w.classList.add("window");
        w.id = `did-${this.trackingid.next().value.number}`;
        w.style.zIndex = options.zIndex;
        w.style.width = options.width + "px";
        w.style.height = (options.height + 30) + "px";
        
        if(this.nextpos.x + options.width > document.body.clientWidth) {
            this.nextpos.x = 0;
            this.nextpos.y += options.height + 30;
        }
        w.style.left = this.nextpos.x + "px";
        w.style.top = this.nextpos.y + "px";
        this.nextpos.x += options.width;

        if(options.position.x != null) {
            w.style.left = options.position.x + "px";
        }
        if(options.position.y != null) {
            w.style.top = (options.position.y + 50 + 30) + "px";
        }

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
            
        this.windows[name] = new Layered(wBody, options);
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
     * @returns {Layered}
     */
    getWindow(name) {
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
            func(this.windows[key]);
        });
    }

}