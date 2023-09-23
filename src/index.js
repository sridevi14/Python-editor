import "./styles.css";
var editor = ace.edit("editor");
editor.setTheme("ace/theme/vibrant_ink");
editor.getSession().setMode("ace/mode/python");
editor.setFontSize(18);
let stdinbuffer = new SharedArrayBuffer(100 * Int32Array.BYTES_PER_ELEMENT)
let stdinbufferInt = new Int32Array(stdinbuffer)
var dark = true;
let interval;
const runButton = document.getElementById("run");
const themeButton = document.getElementById("theme");
const terminal = document.getElementById('terminal');
let worker = null;
window.onload = () => {
  //initialization worker
  initializeWorker();
  //run code
  runButton.addEventListener("click", () => {
    clearInterval(interval)
    console.log('worker', worker)
    terminal.value = '';
    var code = editor.getValue();
    stdinbufferInt[0] = -1
    worker.postMessage({
      type: 'run',
      buffer: stdinbuffer,
      code: code
    })
    interval = setTimeout(() => {
      worker.terminate();
      initializeWorker();
      clearInterval(interval);
      console.log("terminated")
    }, 5000)
  });

  themeButton.addEventListener("click", () => {
    if (dark === true) {
      editor.setTheme("ace/theme/chrome");
      editor.getSession().setMode("ace/mode/python");
      editor.setFontSize(18);
      terminal.style.background = 'white'
      terminal.style.color = 'black';
      dark = false;
    } else {
      editor.setTheme("ace/theme/vibrant_ink");
      editor.getSession().setMode("ace/mode/python");
      editor.setFontSize(18);
      terminal.style.background = 'black'
      terminal.style.color = 'white';
      dark = true;
    }
  })
  runButton.removeAttribute("disabled");

};

function initializeWorker() {
  //need to do:add loading here
  worker = new Worker(new URL('./worker.js', import.meta.url));
  worker.addEventListener('message', (event) => {
    if (event.data.err) {
      worker.terminate();
      terminal.value = '';
      terminal.value = 'Timeout error'
    } else {
      if (event.data.type === 'stdin') {
        clearInterval(interval);
        let input = prompt('Input');
        let startingIndex = 1
        if (stdinbufferInt[0] > 0) {
          startingIndex = stdinbufferInt[0]
        }
        const data = new TextEncoder().encode(input)
        data.forEach((value, index) => {
          stdinbufferInt[startingIndex + index] = value
        })
        stdinbufferInt[0] = startingIndex + data.length - 1
        Atomics.notify(stdinbufferInt, 0, 1)
        interval = setTimeout(() => {
          worker.terminate();
          initializeWorker()
          console.log("terminated")
          clearInterval(interval);
        }, 5000)
      } else if (event.data.type === 'error') {
        clearInterval(interval)
        terminal.value += event.data.text;
      } else {
        terminal.value += event.data.text;
      }
    }
  });
}
