import "./styles.css";
const { initializeWorker, runcode } = require("py-in-browser");
var editor = ace.edit("editor");
// editor.setTheme("ace/theme/vibrant_ink");
editor.getSession().setMode("ace/mode/python");
editor.setFontSize(18);
editor.setValue(`
# This program adds two numbers

num1 = 1.5
num2 = 6.3

# Add two numbers
sum = num1 + num2

# Display the sum
print('The sum of {0} and {1} is {2}'.format(num1, num2, sum))
`);
const runButton = document.getElementById("run");
const terminal = document.getElementById('terminal');
const cleareditor = document.getElementById('cleareditor')
let fullscreen = false;
 window.onload = () => {
   // initialization worker
   initializeWorker(callback);
   //callback function from py-in-browser
   function callback(text)
   {
     terminal.innerHTML += text;
   }
   //run code
   runButton.addEventListener("click", () => {
    terminal.classList.add('terminal-font')
    terminal.innerHTML = '';
    var code = editor.getValue();
     runcode(code);
  });
   //cleareditor
   cleareditor.addEventListener("click", () => {
     editor.setValue('');
   })

   //detect full screen change
   document.addEventListener('fullscreenchange', function(e){
    if(document.fullscreenElement){
      fullscreen = true;
    } else {
      fullscreen = false;
      document.getElementById('editor').classList.remove('editordiv-fullscreen');
      document.getElementById('output-area').classList.remove('editordiv-fullscreen')
    }
   })
   //expand the editor on full screen
   document.getElementById('expand-editor').addEventListener("click", () => {
     if (fullscreen) {
       document.exitFullscreen();
       fullscreen = false;
       document.getElementById('editor').classList.remove('editordiv-fullscreen');
       document.getElementById('output-area').classList.remove('editordiv-fullscreen');
     } else {
      document.getElementById('partition').requestFullscreen();
       fullscreen = true
       document.getElementById('editor').classList.add('editordiv-fullscreen')
       document.getElementById('output-area').classList.add('editordiv-fullscreen')
     }
   })
 };


