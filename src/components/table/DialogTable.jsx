import {defineComponent, h} from 'vue'
import {searchQuick} from "@/utils/request";

export default defineComponent({
  props: {
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
    this.show = true
    this.getList()
  },
  watch: {
    filter: {
      handler(val) {
        this.pagination.page = 1
        this.getList(val)
      },
      deep: true
    }
  },
  data() {
    return {
      title: '列表数据',
      width: 'max-w-4xl w-auto',
      filter: {
        query: '',
        type: ''
      },
      show: false,
      loading: true,
      columns: [],
      data: [],
      checked: [],
      pagination: {
        page: 1,
        'page-count': 1,
        'onUpdate:page': page => {
          this.pagination.page = page
          this.getList(this.filter)
        }
      }
    }
  },
  methods: {
    onSearch() {
      this.pagination.page = 1
      this.getList(this.filter)
    },
    getList(params) {
      this.loading = true
      searchQuick({
        url: this.url,
        data: {
          ...params,
          page: this.pagination.page
        }
      }, 'data-table').then(res => {
        this.pagination['page-count'] = res.totalPage
        this.data = res.data
        this.loading = false
        console.log(this.loading)
      }).catch(() => {
        this.loading = false
      })
    },
    onCancel() {
      this.show = false
      this.checked = []
      setTimeout(() => {
        this.$emit('update:show', false)
      }, 200)
    },
    onSave() {
      const data = this.data.filter(item => {
        return ~this.checked.indexOf(item[this.key])
      })
      this.show = false
      this.checked = []
      this.$emit('confirm', this.multiple ? data : (data[0] || {}))
      setTimeout(() => {
        this.$emit('update:show', false)
      }, 200)
    },
  },
  render() {
    return <a-modal modalClass={this.width} visible={this.show} title={this.title} onCancel={this.onCancel} onClose={this.onCancel} onOk={this.onSave} footer={this.multiple}>
      <div >
        <div class="flex gap-4 mb-3">
          {console.log(this.type)}
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
              <a-input placeholder="请输入搜索内容" value={this.filter.query}
                       onUpdate:value={value => this.filter.query = value}/>
            </div>
          </div>}
        </div>
        <a-table remote={true} loading={this.loading} columns={this.columns} data={this.data}
                      rowKey={row => row[this.key]} pagination={this.pagination}
                      onUpdate:checkedRowKeys={value => {
                        this.checked = value
                        if (!this.multiple) {
                          this.onSave()
                        }
                      }
                      }/>
        
      </div>
    </a-modal>
  }
})
