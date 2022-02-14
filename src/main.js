import Vue from 'vue'
import App from './App.vue'
import store from './store/index'
import router from './router'
import axios from 'axios'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'

Vue.use(ElementUI)

Vue.config.productionTip = false
Vue.config.devtools = true

Vue.prototype.$axios = axios
axios.interceptors.response.use((response) => {
  if(response && response.data) {
    return response.data
  }
})
// window.addEventListener("beforeunload", function (e) {
//   //不是所有浏览器都支持提示信息的修改
//   var confirmationMessage = "请先保存您编辑的内容,否则您修改的信息会丢失。";
//   e.returnValue = confirmationMessage;
//   return confirmationMessage;
// });

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
