stdlog = console.log;
stdwarn = console.warn;
stderror = console.error;
stdinfo = console.info;

loggerparser = function(type, arguments) {
    if(new Error().stack.match("injectedScript")) {
        const [line, col] = new Error().stack.split(/injectedScript\:|\n/,3)[2].split(":");
        const time = new Date().toLocaleTimeString();
        consolelem.innerHTML += `<div class="${type}"><span class="time">${time}</span> &gt; <span class="message">${Array.from(arguments).join(" ")}</span><span style="float:right">Input field <a href="#input@${line}:${col}" onclick="selectLineInTextArea(${line})">line ${line}:${col}</a><span></div>`;
    } else {
        const args = Array.from(arguments);
        const time = new Date().toLocaleTimeString();
        if(args[0] == "#custom") {
            args.shift();
            const [src, line, col] = args.pop();
            consolelem.innerHTML += `<div class="${type}"><span class="time">${time}</span> &gt; <span class="message">${args.join(" ")}</span><span style="float:right">${src} <a href="#input@${line}:${col}" onclick="selectLineInTextArea(${line})">line ${line}:${col}</a><span></div>`;
        } else consolelem.innerHTML += `<div class="${type}"><span class="time">${time}</span> &gt; <span class="message">${Array.from(arguments).join(" ")}</span><span style="float:right">Terminal<span></div>`;
    }
}
console.log = function() {
    loggerparser("log", arguments);
}
console.warn = function() {
    loggerparser("warn", arguments);
}
console.error = function() {
    loggerparser("error", arguments);
}
console.info = function() {
    loggerparser("info", arguments);
}

function selectLineInTextArea(line) {
    const textarea = document.getElementById("input");
    const lines = textarea.value.split("\n");
    let start = 0;
    for (let i = 0; i < line - 1; i++) start += lines[i].length + 1;
    textarea.focus();
    textarea.setSelectionRange(start, start + lines[line - 1].length);
}
