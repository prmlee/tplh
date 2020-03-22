const THREE = require("three");

require("@/webgl/OBJLoader.js");

const objLoader = new THREE.OBJLoader();

export default function(src) {
  return new Promise((resolve, reject) => {
    objLoader.load(src, resolve, null, reject);
  });
}
