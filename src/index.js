import "./styles.css";

var editor = ace.edit("editor");
editor.setTheme("ace/theme/vibrant_ink");
editor.getSession().setMode("ace/mode/python");
editor.setFontSize(18);
var dark = true;
const runButton = document.getElementById("run");
const themeButton = document.getElementById("theme");
const terminal = document.getElementById('terminal');
window.onload = () => {
  const worker = new Worker(new URL('./worker.js', import.meta.url));
  worker.addEventListener('message', (event) => {
    terminal.value += event.data;

  });

  runButton.addEventListener("click", () => {
    terminal.value = '';
    var code = editor.getValue();
    worker.postMessage(code);
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
