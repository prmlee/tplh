import * as THREE from 'three';

import vs from '@/webgl/glsl/ImagePoints.vs';
import fs from '@/webgl/glsl/ImagePoints.fs';

export default class ImagePoints extends THREE.Points {
  constructor() {
    // Define Geometry
    const gaseGeometry = new THREE.PlaneBufferGeometry(1, 1, 32, 32);
    const geometry = new THREE.BufferGeometry();

    geometry.addAttribute('position', gaseGeometry.attributes.position);
    geometry.addAttribute('uv', gaseGeometry.attributes.uv);

    // Define Material
    const material = new THREE.RawShaderMaterial({
      uniforms: {
        time: {
          type: 'f',
          value: 0
        },
        easeTransition: {
          type: 'f',
          value: 0
        },
        resolution: {
          type: 'v2',
          value: new THREE.Vector2()
        },
        noiseTex: {
          type: 't',
          value: null
        },
        imgRatio: {
          type: 'v2',
          value: new THREE.Vector2()
        },
        pixelRatio: {
          type: 'f',
          value: window.devicePixelRatio
        },
      },
      vertexShader: vs,
      fragmentShader: fs,
      transparent: true,
      blending: THREE.AdditiveBlending,
    });

    // Create Object3D
    super(geometry, material);
    this.name = 'ImagePoints';
  }
  start(noiseTex) {
    this.material.uniforms.noiseTex.value = noiseTex;
  }
  update(time, easeStep) {
    this.material.uniforms.time.value += time;
    this.material.uniforms.easeTransition.value = easeStep;
  }
  resize(size, resolution) {
    this.material.uniforms.resolution.value.copy(resolution);
    this.material.uniforms.imgRatio.value.set(
      Math.min(1, size.x / size.y),
      Math.min(1, size.y / size.x)
    );
    this.scale.copy(size);
  }
}
