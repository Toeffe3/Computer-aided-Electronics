import Layered from './layer.js';
class AppData {
    constructor() {
        this.appData = {
            version: '0.0.1',
            project: 'example',
            visual: {
                theme: 'hacker',
                layout: 'modern',
            },
            user: {
                language: 'en',
                latestProject: 'example',
                saveAsExtension: 'png',
            },
            projects: {
                example: {
                    desktop: {
                        windows: {},
                    },
                }
            }
        };

        // if no appData exists, create it
        if (!localStorage.getItem('appData')) localStorage.setItem('appData', JSON.stringify(this.appData));
        else this.appData = JSON.parse(localStorage.getItem('appData'));
    }

    /**
     * Get or set a visual setting
     * @param {string} setting
     * @param {string} value
     * @returns {string}
     */
    visual(setting, value) {
        if (value) this.appData.visual[setting] = value;
        else return this.appData.visual[setting];
        localStorage.setItem('appData', JSON.stringify(this.appData));
    }

    /**
     * Get or set a user setting
     * @param {string} setting
     * @param {string} value
     * @returns {string}
     */
    user(setting, value) {
        if (value) this.appData.user[setting] = value;
        else return this.appData.user[setting];
        localStorage.setItem('appData', JSON.stringify(this.appData));
    }

    /**
     * Save/update a window
     * @param {Layered} layered
     * @returns {AppData}
     */
    saveWindow(layered) {
        let serilized = {
            options: layered.options,
            htmlhook: `#${layered.htmlhook.parentElement.id}`,
            layers: {}
        };
        for(let layer of Object.keys(layered.layers)) {
            const {...object} = layered.layers[layer];
            serilized.layers[layer] = object;
        };
        this.appData.projects[this.appData.project].desktop.windows[layered.htmlhook.parentElement.children[0].children[0].innerText] = LZString.compressToUTF16(JSON.stringify(serilized));
        localStorage.setItem('appData', JSON.stringify(this.appData));
        return this;
    }

    /**
     * Restore a window
     * @param {string} name
     * @returns {Window}
     */
    restoreWindow(name) {
        let windowData = JSON.parse(LZString.decompressFromUTF16(this.appData.projects[this.appData.project].desktop.windows[name]));
        let window = new Layered(windowData.htmlhook);
        Object.assign(window, windowData);
        window.name = name;
        return window;
    }

    /**
     * Save/update all windows
     * @param {Desktop} desktop
     */
    saveWindows(desktop) {
        desktop.call((layer) => this.saveWindow(layer));
    }

    /**
     * Restore all windows
     * @returns {Window[]}
     */
    restoreWindows() {
        let windows = [];
        for(let window of Object.keys(this.appData.projects[this.appData.project].desktop.windows)) {
            windows.push(this.restoreWindow(window));
        };
        return windows;
    }
}

const store = new AppData();
export default store;