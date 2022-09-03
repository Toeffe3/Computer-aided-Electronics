const consolelem = document.getElementById("console");
const attachToExample = document.getElementById("output");
const inputText = document.getElementById("input");

const update = (text) => {
    consolelem.innerHTML = "";
    // remove previus script
    const previusScript = document.getElementById("userscript");
    if (previusScript) {
        previusScript.dispatchEvent(new Event("remove"));
        previusScript.remove();
    }
    // create a script element and attach it to the output div
    const script = document.createElement("script");
    script.type = "module";
    script.id = "userscript";
    script.innerHTML = text+"\nwindow.programLoop = program;";
    script.addEventListener("remove", () => window.programLoop.stop());
    document.body.onerror = (e, src, line, col, err) => {
        console.error("#custom", e, ["Input field", line, col]);
        e.preventDefault();
    };
    attachToExample.innerHTML = "";
    document.body.appendChild(script);
    // Trigger a resize event to update the canvas size
    setTimeout(() => window.dispatchEvent(new Event("resize")), 500);
}

inputText.oninput = (e) => update(e.target.value);
update(inputText.value);
console.info("Welcome to the this example!");
console.info("You can try editing the code above, logs and errors will be displayed here.");