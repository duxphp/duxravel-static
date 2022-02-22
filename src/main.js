import * as Vue from 'vue'
import App from './App.vue'
import ArcoVue from '@arco-design/web-vue'
import NProgress from 'nprogress'
import CScrollbar from 'c-scrollbar'

import '@arco-design/web-vue/dist/arco.css'
import 'nprogress/nprogress.css'
import './common.css'

import draggable from 'vuedraggable'
import ArcoVueIcon from '@arco-design/web-vue/es/icon'
import VueApexCharts from 'vue3-apexcharts'
import './utils/global'
import NodeCreate from './components/Create.js'
import FormSubmit from './components/Form.vue'
import Route from './components/Route.vue'
import RichText from './components/RichText.vue'
import Icon from './components/Icon.vue'
import DataTable from './components/table/DataTable'
import Tree from './components/table/Tree'
import DataSelect from './components/form/Select'
import DataTreeSelect from './components/form/TreeSelect'
import DataCascader from './components/form/Cascader'
import DataFile from './components/form/File'
import DataFiles from './components/form/Files'
import DataImages from './components/form/Images'
import DataEditor from './components/form/Editor'
import DataChoice from './components/form/Choice'
import DataColor from './components/form/Color'
import DynamicData from './components/form/DynamicData'
import DataLayout from './components/common/Layout'
import DataDialog from './components/common/Dialog'

import './utils/window'

import { setup } from  'twind/shim'
import color from '../color'

const colors = Object.fromEntries(Object.keys(color.light).map(key => {
  // arco 颜色导入
  return [key, Object.fromEntries(color.light[key].map((val, index) => {
    return [index === 0 ? 50 : index * 100, val]
  }))]
}))

setup({

  darkMode: 'class', // use a different dark mode strategy (default: 'media')
  theme: {
    extend: {
      colors: {
        'blackgray': {
          1: '#373739',
          2: '#313132',
          3: '#2a2a2b',
          4: '#232324',
          5: '#17171a',
        },
        ...colors,
      }
    },
  },
})

// 注册到全局
window.Vue = Vue
window.NProgress = NProgress

// 注册消息服务
window.LaravelEcho = null

// 实例注册到全局
const app = window.vueApp = Vue.createApp(App)

app.use(ArcoVue)
app.use(ArcoVueIcon)
app.use(CScrollbar)

window.NProgress.configure({
  easing: 'ease',
  speed: 500,         // 递增进度条的速度
  showSpinner: false, // 是否显示加载ico
  trickleSpeed: 200,  // 自动递增间隔
  minimum: 0.3        // 初始化时的最小百分比
});

app.use(VueApexCharts)

// 链接组件
app.component('route', Route)
// 富文本显示组件
app.component('rich-text', RichText)
// json节点创建组件
app.component('node-create', NodeCreate)
// 图标组件
app.component('icon', Icon)
// 表单提交组件
app.component('app-form', FormSubmit)
// 表格展示组件
app.component('app-table', DataTable)
// 树形列表
app.component('widget-tree', Tree)
// 选择器
app.component('app-select', DataSelect)
// 树形选择器
app.component('app-tree-select', DataTreeSelect)
// 级联选择器
app.component('app-cascader', DataCascader)
// 文件上传
app.component('app-file', DataFile)
app.component('app-files', DataFiles)
app.component('app-images', DataImages)
// 编辑器
app.component('app-editor', DataEditor)
// 动态选择器
app.component('app-choice', DataChoice)
// 颜色选择器
app.component('app-color', DataColor)

// 动态数据
app.component('app-dynamic-data', DynamicData)
app.component('app-layout', DataLayout)
app.component('app-dialog', DataDialog)

// 拖动排序
app.component('draggable', draggable)

app.mount('#duxravel-static')

