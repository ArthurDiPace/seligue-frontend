import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import vuetify from './plugins/vuetify'
import HttpGeneric from '@/services/generic.service'
import endpoints from '@/common/endpoints'
import GenericMixin from '@/mixins/GenericMixin'
import VueToast from 'vue-toast-notification'
import VueTheMask from 'vue-the-mask'
import 'vue-toast-notification/dist/theme-sugar.css'


Vue.config.productionTip = false

Vue.prototype.$endpoints = endpoints
Vue.$api = HttpGeneric
Object.defineProperty(Vue.prototype, '$api', {
  get () { return HttpGeneric }
})

Vue.use(VueToast)
Vue.use(VueTheMask)
Vue.mixin(GenericMixin)

new Vue({
  router,
  store,
  vuetify,
  render: h => h(App)
}).$mount('#app')
