let executionTimeout = null;
let stdinbufferInt = null
const replaceStdioCode = `
import sys
import fakeprint

sys.stdout = fakeprint.stdout
sys.stderr = fakeprint.stderr
sys.stdin = fakeprint.stdin`

async function loadPy() {
  importScripts("https://cdn.jsdelivr.net/pyodide/v0.18.1/full/pyodide.js");
  pyodide = await loadPyodide({
    fullStdLib: false,
    indexURL: "https://cdn.jsdelivr.net/pyodide/v0.18.1/full/",
  });
  pyodide.registerJsModule('fakeprint', {
    stdout: stdout,
    stderr: stderr,
    stdin: stdin,
  })
  pyodide.runPython(replaceStdioCode)

}
//output from pyodide
const stdout = {
  write: (s) => {
    postMessage(
      { err: false, text: s, type: "stdout" }
    )
  },
  flush: () => { },
}
//for error msg from pyodide
const stderr = {
  write: (s) => {
    postMessage(
      { err: false, text: s, type: "error" }
    )
  },
  flush: () => { },
}
//to get input from main thred
const stdin = {
  readline: () => {
    // Send message to activate stdin mode
    postMessage({
      type: 'stdin',
      err: false,
      text: ''
    })
    let text = ''
    Atomics.wait(stdinbufferInt, 0, -1)
    const numberOfElements = stdinbufferInt[0]
    stdinbufferInt[0] = -1
    const newStdinData = new Uint8Array(numberOfElements)
    for (let i = 0; i < numberOfElements; i++) {
      newStdinData[i] = stdinbufferInt[1 + i]
    }
    const responseStdin = new TextDecoder('utf-8').decode(newStdinData)
    text += responseStdin
    return text;
  },
}
//load py
loadPy()
onmessage = (event) => {
  stdinbufferInt = new Int32Array(event.data.buffer)
  run(event.data.code)
}
//to run python in pyodide
const run = async (code) => {
  try {
    pyodide.runPython(code);
  } catch (err) {
    postMessage(
      { err: false, text: err.toString(), type: 'error' }
    )
  }

};

