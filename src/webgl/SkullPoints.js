import * as THREE from 'three';
import MathEx from 'js-util/MathEx';

import vs from '@/webgl/glsl/SkullPoints.vs';
import fs from '@/webgl/glsl/SkullPoints.fs';

const DURATION = 4;
const NUM = 360;
const DURATION_SHOW = 2;
const DELAY_SHOW = 4;
const DURATION_HIDE = 1;
const DELAY_HIDE = 0;

export default class SkullPoints extends THREE.Points {
  constructor() {
    // Define Geometry
    const geometry = new THREE.BufferGeometry();

    // Define attributes of the geometry
    const baPositions = new THREE.BufferAttribute(new Float32Array(NUM * 3), 3);
    const baDelays = new THREE.BufferAttribute(new Float32Array(NUM), 1);
    const baStartY = new THREE.BufferAttribute(new Float32Array(NUM), 1);
    for (var i = 0, ul = NUM; i < ul; i++) {
      const radian = MathEx.radians(Math.random() * 360);
      const radius = Math.random() * 4 + 1;
      baPositions.setXYZ(
        i,
        Math.cos(radian) * radius,
        0,
        Math.sin(radian) * radius
      );
      baDelays.setX(i, Math.random() * DURATION);
      baStartY.setX(i, Math.random() * 4);
    }
    geometry.addAttribute('position', baPositions);
    geometry.addAttribute('delay', baDelays);
    geometry.addAttribute('startY', baStartY);

    // Define Material
    const material = new THREE.RawShaderMaterial({
      uniforms: {
        time: {
          type: 'f',
          value: 0
        },
        duration: {
          type: 'f',
          value: DURATION
        },
        resolution: {
          type: 'v2',
          value: new THREE.Vector2()
        },
        pixelRatio: {
          type: 'f',
          value: window.devicePixelRatio
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
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });

    // Create Object3D
    super(geometry, material);
    this.name = 'SkullPoints';
    this.timeShow = 0;
    this.timeHide = 0;
    this.isShown = false;
    this.isHidden = false;
  }
  start(noiseTex) {
    this.material.uniforms.noiseTex.value = noiseTex;
  }
  show() {
    if (this.timeShow > 0) this.timeShow = DELAY_SHOW / 2;
    this.timeHide = 0;
    this.isShown = true;
    this.isHidden = false;
  }
  hide() {
    this.isHidden = true;
  }
  update(time) {
    this.material.uniforms.time.value += time;
    this.rotation.set(
      0,
      this.material.uniforms.time.value * 0.2,
      0
    );

    // for the showing effect.
    if (this.isShown === true) {
      this.timeShow += time;
      if (this.timeShow - DELAY_SHOW >= DURATION_SHOW) {
        this.isShown = false;
      }
    }
    // for the hiding effect.
    if (this.isHidden === true) {
      this.timeHide += time;
      if (this.timeHide - DELAY_HIDE >= DURATION_HIDE) {
        this.isHidden = false;
      }
    }

    // calculation the alpha.
    const alphaShow = MathEx.clamp((this.timeShow - DELAY_SHOW) / DURATION_SHOW, 0.0, 1.0);
    const alphaHide = MathEx.clamp((this.timeHide - DELAY_HIDE) / DURATION_HIDE, 0.0, 1.0);
    this.material.uniforms.alpha.value = alphaShow * (1.0 - alphaHide);
  }
  resize(resolution) {
    this.material.uniforms.resolution.value.copy(resolution);
  }
}
