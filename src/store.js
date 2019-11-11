import Vue from 'vue';
import Vuex from 'vuex';
import * as THREE from 'three';

import WebGL from '@/webgl/';

import WORKS from '@/components/_const/WORKS';

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    globalId: 0,
    canvas: document.createElement('canvas'),
    resolution: new THREE.Vector2(),
    webgl: new WebGL(),
    works: WORKS,
    isEnabledDarkColor: false,
    isShownGlobalTitle: false,
  },
  mutations: {
    transit (state, opts) {
      state.globalId = opts.globalId;
    },
    enableDarkColor (state, bool) {
      state.isEnabledDarkColor = bool;
    },
    showGlobalTitle (state, bool) {
      state.isShownGlobalTitle = bool;
    },
  },
  actions: {
    // transit (context, opts) {
    //   context.commit('transit', opts);
    // },
  }
})
