import {defineComponent, h} from 'vue'
import {searchQuick} from "@/utils/request";
import {getUrl} from "../../utils/request";

export default defineComponent({
  props: {
    'title': {
      type: String
    },
    'column': {
      type: Array,
    },
    'url': {
      type: String
    },
    'key': {
      type: String,
      default: 'id'
    },
    'type': {
      type: Array
    },
    'search': {
      type: Boolean,
      default: true
    },
    'multiple': {
      type: Boolean,
      default: true
    },
    callback: Function,
    close: Function,
  },
  created() {
    let columns = []
    this.column.map(item => {
      const column = {
        title: item.name,
        dataIndex: item.key,
        render: null
      }
      if (item.type === 'image') {
        column.render = (row) => <a-avatar shape="square" size="30"><img
          src={row.record[item.key]}
        /></a-avatar>
      }
      columns.push(column)
    })
    this.columns = columns
    if (this.type) {
      this.filter.type = this.type[0].key
    }
  },
  mounted() {
    this.getList()
  },
  watch: {
    filter: {
      handler(val) {
        this.pagination.current = 1
        this.getList(val)
      },
      deep: true
    }
  },
  data() {
    return {
      width: 'max-w-4xl w-auto',
      filter: {
        query: '',
        type: ''
      },
      show: true,
      loading: true,
      columns: [],
      data: [],
      checked: [],
      pagination: {
        current: 1,
        total: 0,
        pageSize: 1,
        onChange: page => {
          this.pagination.current = page
          this.getList(this.filter)
        },
        onPageSizeChange: limit => {
          this.pagination.current = 1
          this.pagination.pageSize = limit
          this.getList(this.filter)
        }
      }
    }
  },
  methods: {
    getList(params) {
      this.loading = true
      searchQuick({
        url: getUrl(this.url),
        data: {
          ...params,
          page: this.pagination.current
        }
      }, 'data-table').then(res => {
        this.pagination.total = res.total
        this.pagination.pageSize = res.pageSize
        this.data = res.data
        this.loading = false
      }).catch(() => {
        this.loading = false
      })
    },
    onCancel() {
      this.show = false
      this.checked = []
      this.close()
    },
    onSave() {
      const data = this.data.filter(item => {
        return ~this.checked.indexOf(item[this.key])
      })
      this.show = false
      this.checked = []
      this.callback && this.callback(this.multiple ? data : (data[0] || {}))
      this.close()
    },
  },
  render() {
    return <a-modal modalClass={this.width} visible={this.show} title={this.title || '选择数据'} onCancel={this.onCancel} onClose={this.onCancel} onOk={this.onSave} okButtonProps={{disabled: !this.checked.length}}>
      <div>
        <div class="flex gap-4 mb-3">
          {this.type && <div class="flex-grow">
            <a-radio-group
              type="button"
              vModel={[this.filter.type, 'modelValue']}
            >
              {this.type.map((item, key) => <a-radio value={key}>{item}</a-radio>)}
            </a-radio-group>
          </div>}
          {this.search && <div class="flex-none flex gap-4">
            <div>
              <a-input placeholder="请输入搜索内容" vModel={[this.filter.query, 'modelValue']}/>
            </div>
          </div>}
        </div>
        <a-table loading={this.loading}
                 columns={this.columns}
                 data={this.data}
                 rowKey={this.key}
                 rowSelection={{
                   type: this.multiple ? 'checkbox' : 'radio',
                   showCheckedAll: this.multiple,
                   selectedRowKeys: this.checked
                 }}
                 onSelectionChange={(value) => {
                   this.checked = value
                 }}
                 pagination={this.pagination}
        />

      </div>
    </a-modal>
  }
})
