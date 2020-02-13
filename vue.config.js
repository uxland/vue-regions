const webpack = require('webpack');
const path = require('path');
const glob = require('glob');

module.exports = {
  configureWebpack: {
    resolve: {
      alias: {
        vue$: 'vue/dist/vue.esm.js'
      }
    }
  }
};
