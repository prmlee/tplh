import * as THREE from 'three';
import MathEx from 'js-util/MathEx';

import vs from '@/webgl/glsl/Background.vs';
import fs from '@/webgl/glsl/Background.fs';

export default class Background extends THREE.Mesh {
  constructor() {
    // Define Geometry
    const geometry = new THREE.PlaneBufferGeometry(1, 1, 128, 128);

    // Define Material
    const material = new THREE.RawShaderMaterial({
      uniforms: {
        time: {
          type: 'f',
          value: 0
        },
        noiseTex: {
          type: 't',
          value: null
        },
        imgRatio: {
          type: 'v2',
          value: new THREE.Vector2()
        },
      },
      vertexShader: vs,
      fragmentShader: fs,
    });

    // Create Object3D
    super(geometry, material);
    this.name = 'Background';
    this.size = new THREE.Vector3();
    this.isActive = false;
  }
  start(noiseTex) {
    this.isActive = true;
    this.material.uniforms.noiseTex.value = noiseTex;
  }
  update(time) {
    if (this.isActive === false) return;
    this.material.uniforms.time.value += time;
  }
  resize(camera, resolution) {
    const height = Math.abs(
      (camera.position.z - this.position.z) * Math.tan(MathEx.radians(camera.fov) / 2) * 2
    );
    const width = height * camera.aspect;

    this.size.set(width, height, 1);
    this.material.uniforms.imgRatio.value.set(
      Math.min(1, this.size.x / this.size.y),
      Math.min(1, this.size.y / this.size.x)
    );
    this.scale.copy(this.size);
  }
}
