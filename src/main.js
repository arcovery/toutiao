import Vue from 'vue'
import animated from 'animate.css'

import App from './App.vue'
import store from './store'
import router from './router'
import './utils/vant'
// import '@/assets/main.css';
import '@/style/index.less'
import './utils/flexible'

Vue.use(animated)
new Vue({
  router,
  store,
  render: (h) => h(App),
}).$mount('#app')
