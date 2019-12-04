import * as THREE from 'three';
import MathEx from 'js-util/MathEx';

import vs from '@/webgl/glsl/Background.vs';
import fs from '@/webgl/glsl/Background.fs';

export default class Background extends THREE.Mesh {
  constructor() {
    // Define Geometry
    const geometry = new THREE.SphereBufferGeometry(100, 12, 12);

    // Define Material
    const material = new THREE.RawShaderMaterial({
      uniforms: {
        time: {
          type: 'f',
          value: 0
        },
        hex: {
          type: 'f',
          value: 0
        },
      },
      vertexShader: vs,
      fragmentShader: fs,
      side: THREE.BackSide,
    });

    // Create Object3D
    super(geometry, material);
    this.name = 'Background';
  }
  start() {
  }
  update() {
  }
}
