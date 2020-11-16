import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'

import 'bootstrap/dist/css/bootstrap.css'

import './plugins/element.js'

import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';



// Install BootstrapVue

Vue.use(ElementUI);


Vue.config.productionTip = false

let app = new Vue({
  el: '#app',
  router,
  store,
  render: h => h(App)
}).$mount('#app')

window.app = app