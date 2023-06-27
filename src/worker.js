
async function loadPy() {
  importScripts("https://cdn.jsdelivr.net/pyodide/v0.18.1/full/pyodide.js");
  pyodide = await loadPyodide({
    indexURL: "https://cdn.jsdelivr.net/pyodide/v0.18.1/full/",
    stdout: (text) => { postMessage(text) },
    stderr: (text) => { postMessage(text) }
  });
}
//load py
loadPy()
onmessage = (event) => {
  console.log(event.data)
  run(event.data)
}

const run = async (code) => {
  try {

    pyodide.runPython(code);
  } catch (err) {
    postMessage(err.toString());
  }

};

