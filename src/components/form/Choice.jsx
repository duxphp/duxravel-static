import {defineComponent} from 'vue'
import {request} from '../../utils/request'
import {renderNodeList} from '../Create'

export default defineComponent({
  props: {
    'key': {
      type: String,
      default: 'id'
    },
    'ajaxColumn': {
      type: Array,
    },
    'ajaxType': {
      type: Array
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
      loading: true,
      columns: [],
      data: [],
      dataTable: [],
    }
  },
  watch: {
    /*data: {
      handler(val){
        this.$emit('update:value', val)
      },
      deep:true
    }*/
  },
  created() {
    // 数据表格
    let columns = []

    this.column.map(item => {
      const column = {
        title: item.name,
        dataIndex: item.key,
        render: null
      }
      if (item.type === 'text') {
        column.render = (row, index) => renderNodeList.call({}, {
          nodeName: 'a-input',
          'onUpdate:model-value': value => {
            row.record[item.key] = value
          },
          modelValue: row.record[item.key]
        }).default()
      }
      if (item.type === 'image') {
        column.render = (row, index) => renderNodeList.call({}, {
          nodeName: 'app-file',
          'onUpdate:value': value => {
            row.record[item.key] = value
          },
          value: row.record[item.key],
          image: true,
          mini: true,
          size: 8,
          link: false
        }).default()
      }
      columns.push(column)
    })

    this.option && columns.push({
      title: <div class="flex">
        <div class="flex-grow">操作</div>
        {(!this.number || this.data.length < this.number) && <a-link class="flex-none">
          <icon-plus onClick={this.onOpen}/>
        </a-link>}
      </div>,
      width: 110,
      render: (row) => <div class="flex gap-2">
        <a-link onClick={() => {
          let index = this.data.findIndex((item) => {
            return row.record[this.key] === item[this.key]
          })
          if (index === 0) {
            return false;
          }
          this.data.splice(index - 1, 0, this.data.splice(index, 1)[0])
          this.$emit('update:value', this.data)
        }
        }>
          <icon-arrow-up/>
        </a-link>
        <a-link onClick={() => {
          let index = this.data.findIndex((item) => {
            return row.record[this.key] === item[this.key]
          })
          if (index + 1 === this.data.length) {
            return false;
          }
          this.data.splice(index + 1, 0, this.data.splice(index, 1)[0])
          this.$emit('update:value', this.data)
        }
        }>
          <icon-arrow-down/>
        </a-link>

        <a-link onClick={() => {
          let index = this.data.findIndex((item) => {
            return row.record[this.key] === item[this.key]
          })
          this.data.splice(index, 1)
          this.$emit('update:value', this.data)
        }
        }>
          <icon-close/>
        </a-link>
      </div>,
    })
    this.columns = columns

    // 初始数据
    this.init()

  },
  methods: {
    init() {
      // 获主键
      const ids = this.value.map(item => item[this.key]).join(',')
      let params = {}
      params[this.key] = ids;
      if (ids) {
        request({
          url: this.url,
          data: params
        }).then(res => {
          // 合并数据
          let tmp = {}
          res.data.map(item => {
            tmp[item[this.key]] = item
          })
          const list = this.value.map(item => {
            return {...item, ...tmp[item[this.key]] || {}}
          })

          this.setData(list, true)
          this.loading = false
        })
      } else {
        this.loading = false
      }
    },
    setData(data, init) {
      const ids = this.data.map(item => item[this.key])
      let dataArray = []
      let number = this.data.length
      data.map(item => {
        if (~ids.indexOf(item[this.key])) {
          return false
        }
        const data = {}
        data[this.key] = item[this.key]
        this.column.map(column => {
          data[column.key] = item[column.key] || ""
        })
        dataArray.push(data)
        number++
      })
      if (!init && this.number && this.number < number) {
        window.message.warning('最多可选择 ' + this.number + ' 条数据')
        return false;
      }
      this.data.push(...dataArray)
      this.$emit('update:value', this.data)
    },
    onSave(data) {
      this.setData(data)
    },
    onSearch() {
      this.pagination.page = 1
      this.getList(this.filter)
    },
    onOpen() {
      window.appDialogTable({
        url: this.url,
        column: this.ajaxColumn,
        key: this.key,
        type: this.ajaxType
      }).then(ids => {
        this.onSave(ids)
      })
    },
  },
  render() {
    return <div class="w-full">
      <div class="overflow-x-auto w-full mb-2">
        <a-table stripe={true} loading={this.loading} columns={this.columns} data={this.data} pagination={false} class="whitespace-nowrap">

        </a-table>
      </div>
    </div>
  }
})
