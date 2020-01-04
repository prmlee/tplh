import * as THREE from 'three';
import { easeOutBack } from 'easing-js';
import MathEx from 'js-util/MathEx';

import vs from '@/webgl/glsl/SkullAura.vs';
import fs from '@/webgl/glsl/SkullAura.fs';

const DURATION_SHOW = 0.8;
const DELAY_SHOW = 3.5;

export default class SkullAura extends THREE.Mesh {
  constructor() {
    // Define Geometry
    const geometry = new THREE.PlaneBufferGeometry(25, 25);

    // Define Material
    const material = new THREE.RawShaderMaterial({
      uniforms: {
        time: {
          type: 'f',
          value: 0
        },
        postEffectTex: {
          type: 't',
          value: null
        },
        noiseTex: {
          type: 't',
          value: null
        },
        alpha: {
          type: 'f',
          value: 0
        },
      },
      vertexShader: vs,
      fragmentShader: fs,
      transparent: true,
    });

    // Create Object3D
    super(geometry, material);
    this.name = 'SkullAura';
    this.timeShow = 0;
    this.isActive = false;
    this.isShown = false;
  }
  start(postEffectTex, noiseTex) {
    this.isActive = true;
    this.material.uniforms.postEffectTex.value = postEffectTex;
    this.material.uniforms.noiseTex.value = noiseTex;
  }
  show() {
    this.isShown = true;
    if (this.timeShow > 0) {
      this.timeShow = DURATION_SHOW + DELAY_SHOW;
    }
  }
  update(time, camera) {
    if (this.isActive === false) return;
    this.rotation.copy(camera.rotation);
    this.material.uniforms.time.value += time;

    if (this.isShown === true) {
      this.timeShow += time;
      this.material.uniforms.alpha.value = easeOutBack(MathEx.clamp((this.timeShow - DELAY_SHOW) / DURATION_SHOW, 0.0, 1.0));
    }
  }
}
