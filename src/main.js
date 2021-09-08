import * as Vue from 'vue'
import App from './App.vue'
import naive from 'naive-ui'
import draggable from 'vuedraggable'
import * as heroicons from '@heroicons/vue/outline'
import VueApexCharts from 'vue3-apexcharts'
import './utils/global'
import NodeCreate from './components/Create.js'
import FormSubmit from './components/Form.vue'
import Route from './components/Route.vue'
import RichText from './components/RichText.vue'
import Icon from './components/Icon.vue'
import DataTable from './components/table/DataTable'
import DataTree from './components/table/Tree'
import DataSelect from './components/form/Select'
import DataCascader from './components/form/Cascader'
import DataFile from './components/form/File'
import DataFiles from './components/form/Files'
import DataEditor from './components/form/Editor'
import DataChoice from './components/form/Choice'
import DataColor from './components/form/Color'
import DialogTable from './components/table/DialogTable'
import DataEmpty from './components/common/Empty'

import WidgetHeader from './components/widget/Header'


// 注册到全局
window.Vue = Vue

// 实例注册到全局
const app = window.vueApp = Vue.createApp(App)

app.use(naive)
app.use(VueApexCharts)

// 注册图标
for (const key in heroicons) {
  if (Object.hasOwnProperty.call(heroicons, key)) {
    app.component(key, heroicons[key])
  }
}
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
app.component('app-tree', DataTree)
// 选择器
app.component('app-select', DataSelect)
// 级联选择器
app.component('app-cascader', DataCascader)
// 文件上传
app.component('app-file', DataFile)
app.component('app-files', DataFiles)
// 编辑器
app.component('app-editor', DataEditor)
// 动态选择器
app.component('app-choice', DataChoice)
// 颜色选择器
app.component('app-color', DataColor)
// 列表选择器
app.component('dialog-table', DialogTable)

// 空组件
app.component('app-empty', DataEmpty)

// 头部件
app.component('widget-header', WidgetHeader)

// 拖动排序
app.component('draggable', draggable)

app.mount('#app')

import './common.pcss'
