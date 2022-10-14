import * as Vue from 'vue'
import App from './App.vue'
import ArcoVue from '@arco-design/web-vue'
import NProgress from 'nprogress'
import CScrollbar from 'c-scrollbar'

import '@arco-design/web-vue/dist/arco.css'
import 'nprogress/nprogress.css'
import './common.css'

import draggable from 'vuedraggable'
import JsonViewer from 'vue-json-viewer'
import ArcoVueIcon from '@arco-design/web-vue/es/icon'
import VueApexCharts from 'vue3-apexcharts'
import './utils/global'
// 路由
import NodeCreate from './components/route/Create.js'
import Route from './components/route/Route.vue'
import DataLayout from './components/route/Layout'
import DataDialog from './components/route/Dialog'
// 公用
import RichText from './components/common/RichText.vue'
import Icon from './components/common/Icon.vue'
import ImagePreview from './components/common/ImagePreview'
// 列表
import DataTable from './components/table/DataTable'
import Tree from './components/table/Tree'
// 表单
import FormSubmit from './components/form/Form.vue'
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
import DataMap from './components/form/Map'

import './utils/window'

import { setup } from 'twind/shim'

import color from '../color'
import Spec from "./components/form/Spec";

const colors = Object.fromEntries(Object.keys(color.light).map(key => {
  return [key, Object.fromEntries(color.light[key].map((val, index) => {
    return [index === 0 ? 50 : index * 100, val]
  }))]
}))

setup({
  darkMode: 'class',
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
// 地图选择器
app.component('app-map', DataMap)

// 动态数据
app.component('app-dynamic-data', DynamicData)
app.component('app-layout', DataLayout)
app.component('app-dialog', DataDialog)
app.component('app-image-preview', ImagePreview)

// 规格
app.component('app-spec', Spec)

// 拖动排序
app.component('draggable', draggable)

// json 查看器
app.component('json-viewer', JsonViewer)


app.mount('#duxravel-static')

