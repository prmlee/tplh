import * as THREE from 'three';
import sleep from 'js-util/sleep';

import PromiseOBJLoader from '@/webgl/PromiseOBJLoader';
import PromiseTextureLoader from '@/webgl/PromiseTextureLoader';
import Camera from '@/webgl/Camera';
import SkullAuraCamera from '@/webgl/SkullAuraCamera';
import Skull from '@/webgl/Skull';
import Title from '@/webgl/Title';
import CherryRotate from '@/webgl/CherryRotate';
import Image from '@/webgl/Image';
import Background from '@/webgl/Background';

import checkWebpFeature from '@/utils/checkWebpFeature';
import initDatGui from '@/utils/initDatGui';

// ==========
// Define common variables
//
let renderer;
const scene = new THREE.Scene();
const camera = new Camera();
const clock = new THREE.Clock({
  autoStart: false
});
const sceneAura = new THREE.Scene();
const skullAuraCamera = new SkullAuraCamera();

// ==========
// Define unique variables
//
const skull = new Skull();
const title = new Title();
const cherryRotate = new CherryRotate();
const image = new Image();
const bg = new Background();

// ==========
// Define Dat.Gui
//


// ==========
// Define WebGLContent Class.
//
export default class WebGLContent {
  constructor() {
  }
  async start(canvas) {
    // Check whether the webp format is enabled.
    let webpExe = '';
    await checkWebpFeature('lossy')
      .then(() => {
        webpExe = 'webp';
      })
      .catch(() => {
        webpExe = 'jpg';
      });

    // Initialize the WebGL renderer.
    renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: true,
      canvas: canvas,
    });
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setClearColor(0x1b191c, 0.0);

    // Loading all assets for WebGL.
    await Promise.all([
      PromiseOBJLoader(require('@/assets/obj/SkullHead.obj')),
      PromiseOBJLoader(require('@/assets/obj/CherryBlossom.obj')),
      PromiseTextureLoader(require('@/assets/img/webgl/title.jpg')),
      PromiseTextureLoader(require('@/assets/img/webgl/noise.jpg')),
      PromiseTextureLoader(require('@/assets/img/webgl/noise_burn.jpg')),
      PromiseTextureLoader(require('@/assets/img/webgl/thumb_blank.png')),
      PromiseTextureLoader(require(`@/assets/img/webgl/thumb_sketch_threejs.${webpExe}`)),
      PromiseTextureLoader(require(`@/assets/img/webgl/thumb_warpdrive.${webpExe}`)),
      PromiseTextureLoader(require(`@/assets/img/webgl/thumb_hassyadai.${webpExe}`)),
      PromiseTextureLoader(require(`@/assets/img/webgl/thumb_imago.${webpExe}`)),
      PromiseTextureLoader(require(`@/assets/img/webgl/thumb_best_film_2018.${webpExe}`)),
    ]).then((response) => {
      // Initialize all instance on WebGL scene.
      const geometrySkullHead = response[0].children[1].geometry;
      const geometrySkullJaw = response[0].children[0].geometry;
      const geometryPetal1 = response[1].children[0].geometry;
      const geometryPetal2 = response[1].children[1].geometry;
      const titleTex = response[2];
      const noiseTex = response[3];
      const noiseBurnTex = response[4];
      const imgTexes = response.slice(5);

      noiseTex.wrapS = THREE.RepeatWrapping;
      noiseTex.wrapT = THREE.RepeatWrapping;
      noiseBurnTex.wrapS = THREE.RepeatWrapping;
      noiseBurnTex.wrapT = THREE.RepeatWrapping;

      // Add the webgl objects to the scene.
      scene.add(skull);
      scene.add(title);
      // scene.add(cherryRotate);
      scene.add(image);
      scene.add(bg);

      // Start all updating.
      camera.start();
      skullAuraCamera.start();
      skull.start(geometrySkullHead, geometrySkullJaw, noiseTex);
      title.start(titleTex, noiseTex);
      cherryRotate.start(geometryPetal1, geometryPetal2, noiseTex);
      image.start(noiseBurnTex, imgTexes);
      bg.start(noiseTex);

      // show the dat.gui.
      if (process.env.VUE_APP_MODE === 'development') {
        initDatGui(skull);
      }
    });
  }
  play() {
    clock.start();
    this.update();
  }
  pause() {
    clock.stop();
  }
  changeBackground (bool) {
    bg.change(bool);
  }
  showSkull(bool) {
    if (bool === true) {
      skull.show();
      title.show();
      cherryRotate.show();
    } else {
      skull.hide();
      title.hide();
      cherryRotate.hide();
    }
  }
  showWorksImage(index) {
    image.change(index);
  }
  update() {
    // When the clock is stopped, it stops the all rendering too.
    if (clock.running === false) return;

    // Calculate msec for this frame.
    const time = clock.getDelta();

    // Update Camera.
    camera.update(time);
    skullAuraCamera.update(camera);

    // Update each objects.
    skull.update(time, renderer, camera, sceneAura, skullAuraCamera);
    cherryRotate.update(time);
    title.update(time);
    image.update(time);
    bg.update(time);

    // Render the 3D scene.
    renderer.render(scene, camera);
  }
  resize(resolution) {
    camera.resize(resolution);
    skull.resize(resolution);
    image.resize(resolution);
    bg.resize(camera, resolution);
    renderer.setSize(resolution.x, resolution.y);
  }
}
