require('isomorphic-fetch');
require('./wasm_exec');
const path = require('path');
const fs = require('fs');

//load WASM
let isWASMRunned = false;
let fileName = path.resolve(path.dirname('./privacy.wasm'), 'privacy.wasm');

function loadWASM() {
  return new Promise((resolve) => {
    if (isWASMRunned) {
      console.info('WASM was loaded');
      return resolve();
    }

    const go = new Go();
    let inst;
    const data = fs.readFileSync(fileName);
    
    WebAssembly.instantiate(data, go.importObject).then((result) => {
      inst = result.instance;
      go.run(inst);
      isWASMRunned = true;
      resolve();
    });
  });
}

module.exports = loadWASM;