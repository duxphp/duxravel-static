import { h, toRef, defineComponent } from 'vue'
import { NImage } from 'naive-ui'
import classnames from 'classnames'
import { request, searchQuick } from '../../utils/request'
import { renderNodeList } from '../Create'

export default defineComponent({
  props: {
    'only': {
      type: String,
    },
    'ajaxColumn': {
      type: Array,
    },
    'column': {
      type: Array,
    },
    'url': {
      type: String
    },
    'value': {
      type: Array
    },
    'number': {
      type: Number
    },
    'option': {
      type: Boolean
    },
  },
  data() {
    return {
      dialog: null,
      filter: {
        query: ''
      },
      show: false,
      loading: true,
      columns: [],
      data: [],
      dataTable: [],
    }
  },
  watch: {
    data: {
      handler(val){
        this.$emit('update:value', val)
      },
      deep:true
    }
  },
  created() {
    // 数据表格
    let columns = []
    this.column.map(item => {
      const column = {
        title: item.name,
        key: item.key,
        render: null
      }
      if (item.type === 'text') {
        column.render = (row, index) => renderNodeList.call({}, {
          nodeName: 'n-input',
          'onUpdate:value': value => { row[item.key] = value, this.data[index][item.key] = value },
          value: row[item.key]
        }).default()
      }
      if (item.type === 'image') {
        column.render = (row, index) => renderNodeList.call({}, {
          nodeName: 'app-file',
          'onUpdate:value': value => { row[item.key] = value, this.data[index][item.key] = value },
          value: row[item.key],
          image: true,
          size: 9,
          link: false
        }).default()
      }
      columns.push(column)
    })

    this.option && columns.push({
      title: '操作',
      width: 80,
      render: (row, index) => renderNodeList.call({}, {
        nodeName: 'div',
        class: 'flex gap-2',
        child: [
          {
            nodeName: 'n-icon',
            onClick: () => {
              if(index === 0) {
                return false;
              }
              this.dataTable.splice(index - 1, 0, this.dataTable.splice(index, 1)[0])
            },
            class: classnames('cursor-pointer hover:text-blue-600', {'text-gray-300 hover:text-gray-300': index === 0}),
            child: {
              nodeName: 'chevron-up-icon'
            },
          },
          {
            nodeName: 'n-icon',
            onClick: () => {
              if(index + 1 === this.dataTable.length) {
                return false;
              }
              this.dataTable.splice(index + 1, 0, this.dataTable.splice(index, 1)[0])
            },
            class: classnames('cursor-pointer hover:text-blue-600', {'text-gray-300 hover:text-gray-300': index + 1 === this.dataTable.length}),
            child: {
              nodeName: 'chevron-down-icon'
            },
          },
          {
            nodeName: 'n-icon',
            onClick: () => {
              this.data.splice(index, 1)
              this.dataTable.splice(index, 1)
            },
            class: 'cursor-pointer hover:text-red-600',
            child: {
              nodeName: 'x-icon'
            },
          },
        ]
      }).default()
    })
    this.columns = columns

    // 初始数据
    const ids = this.value.map(item => item[this.only]).join(',')
    let params = {}
    params[this.only] = ids;

    if (ids) {
      request({
        url: this.url,
        data: params
      }).then(res => {
        // 合并数据
        let tmp = {}
        res.data.map(item => {
            tmp[item[this.only]] = item
        })
        const list = this.value.map(item => {
            return {...item, ...tmp[item[this.only]] || {}}
        })
        this.setData(list, true)
        this.loading = false
      })
    } else {
      this.loading = false
    }
  },
  methods: {
    setData(data, init) {
      const ids = this.data.map(item => item[this.only])
      let dataTableArray = [], dataArray = []
      let number = this.data.length
      data.map(item => {
        if (~ids.indexOf(item[this.only])) {
          return false
        }
        const data = {}
        const tableData = {}
        data[this.only] = tableData[this.only] = item[this.only]
        this.column.map(column => {
          if (!column.key) {
            return false;
          }
          if (column.type !== 'show') {
            data[column.key] = item[column.key] || ""
          }
          tableData[column.key] = item[column.key]
        })
        dataTableArray.push(tableData)
        dataArray.push(data)
        number++
      })
      if(!init && this.number && this.number < number) {
        window.message.warning('最多可选择 ' + this.number + ' 条数据')
        return false;
      }
      this.dataTable.push(...dataTableArray)
      this.data.push(...dataArray)
    },
    onSave(data) {
      this.setData(data)
    },
    onSearch(){
      this.pagination.page = 1
      this.getList(this.filter)
    },
    onOpen() {
      this.show = true
    },
  },
  render() {
    return <div>
      <div class="overflow-x-auto w-full mb-2">
        <n-data-table single-line={true} loading={this.loading} columns={this.columns} data={this.dataTable} class="whitespace-nowrap">
        {
          {
            empty: () => <div class="flex items-center gap-4">
              <div class="flex-none text-gray-400">
                <n-icon size="38"><svg viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="1341" width="64" height="64"><path d="M831.7 369.4H193.6L64 602v290.3h897.2V602L831.7 369.4zM626.6 604.6c0 62.9-51 113.9-114 113.9s-114-51-114-113.9H117.5l103.8-198h582.5l103.8 198h-281zM502.2 131h39.1v140.6h-39.1zM236.855 200.802l27.647-27.647 99.419 99.418-27.648 27.648zM667.547 272.637l99.418-99.419 27.648 27.648-99.418 99.418z" p-id="1342"></path></svg></n-icon>
              </div>
              <div class="flex-grow">
                <div class="mb-1">暂无数据</div>
                <div class="text-gray-400">暂未选择数据，请选择数据</div>
              </div>
            </div>
          }
        }
        </n-data-table>
      </div>
      {(!this.number || this.data.length < this.number) && <div>
        <n-button class="w-full " onClick={this.onOpen}>增加</n-button>
      </div>}
      {this.show && <dialog-table url={this.url} column={this.ajaxColumn} key={this.only} onUpdate:show={value => this.show = value} onConfirm={this.onSave} />}
    </div>
  }
})
