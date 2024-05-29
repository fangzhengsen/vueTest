import './assets/main.css'
import { createApp,getCurrentInstance  } from 'vue'
import 'element-plus/dist/index.css'
import App from './App.vue'

// global css
import './styles/index.scss'

import ElementPlus from 'element-plus'
// 如果您正在使用CDN引入，请删除下面一行。
import * as ElementPlusIconsVue from '@element-plus/icons-vue'
import lang from 'element-plus/lib/locale/lang/zh-cn'; // 引入 Element Plus 中文语言包
import 'dayjs/locale/zh-cn'; // 引入 dayjs 中文语言包

import router from './router'

const app = createApp(App)
app.use(router) // 注册路由
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component)
}
app.use(ElementPlus, { locale: lang }); // 将中文语言包传递给 Element Plus 全局配置

app.mount('#app')
