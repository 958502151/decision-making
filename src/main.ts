import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import router from '@/router'
//引入ele样式
import 'element-plus/dist/index.css'
import '@/style/common.css'
import '@/style/style.scss'
import elementPlus from 'element-plus'
import pinia from '@/store/index.ts'

createApp(App).use(router).use(elementPlus).use(pinia).mount('#app')
