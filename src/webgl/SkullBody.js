import * as THREE from 'three';
import { easeOutCirc, easeOutQuad } from 'easing-js';
import MathEx from 'js-util/MathEx';

import vs from '@/webgl/glsl/SkullBody.vs';
import fs from '@/webgl/glsl/SkullBody.fs';

const DURATION_SHOW = 4;
const DELAY_SHOW = 1;
const DURATION_HIDE = 2;
const DELAY_HIDE = 0;

export default class SkullBody extends THREE.Group {
  constructor(geometry1, geometry2) {
    // Create Object3D
    super();

    // Define Material
    this.material = new THREE.RawShaderMaterial({
      uniforms: {
        time: {
          type: 'f',
          value: 0
        },
        renderOutline: {
          type: 'f',
          value: 0
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
      flatShading: true,
      transparent: true,
      side: THREE.DoubleSide,
    });

    this.head = new THREE.Mesh(geometry1, this.material);
    this.jaw = new THREE.Mesh(geometry2, this.material);

    this.add(this.head);
    this.add(this.jaw);

    this.name = 'SkullBody';
    this.timeShow = 0;
    this.timeHide = 0;
    this.isActive = false;
    this.isShown = false;
    this.isHidden = false;
  }
  start(noiseTex) {
    this.isActive = true;
    this.material.uniforms.noiseTex.value = noiseTex;
  }
  show() {
    this.timeShow = 0;
    this.timeHide = 0;
    this.isShown = true;
  }
  hide() {
    this.isHidden = true;
  }
  update(time, camera) {
    if (this.isActive === false) return;
    this.material.uniforms.time.value += time;
    this.head.rotation.set(MathEx.radians(-(Math.sin(this.material.uniforms.time.value) * 0.7 + 0.7) * 8), 0, 0);
    this.jaw.rotation.set(MathEx.radians((Math.sin(this.material.uniforms.time.value) * 0.7 + 0.7) * 8), 0, 0);

    // for the showing effect.
    if (this.isShown === true) {
      this.timeShow += time;
      if (this.timeShow >= DURATION_SHOW) {
        this.isShown = false;
      }
    }
    // for the hiding effect.
    if (this.isHidden === true) {
      this.timeHide += time;
      if (this.timeHide >= DURATION_HIDE) {
        this.isHidden = false;
      }
    }

    // calculation the alpha.
    const alphaShow = easeOutCirc(MathEx.clamp((this.timeShow - DELAY_SHOW) / DURATION_SHOW, 0.0, 1.0));
    const alphaHide = easeOutQuad(MathEx.clamp((this.timeHide - DELAY_HIDE) / DURATION_HIDE, 0.0, 1.0));
    this.material.uniforms.alpha.value = alphaShow * (1.0 - alphaHide);

    // calculation the scale.
    const scale = alphaShow * 0.3 + 0.7;
    this.scale.set(scale, scale, scale);
  }
}
