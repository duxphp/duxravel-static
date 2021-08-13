import {defineComponent, h} from 'vue'
import {searchQuick} from "@/utils/request";
import {NImage} from "naive-ui";

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
        key: item.key,
        render: null
      }
      if (item.type === 'image') {
        column.render = (row) => {
          return h(
            NImage,
            {
              width: 60,
              src: row[item.key]
            },
          )
        }
      }
      columns.push(column)
    })
    columns.push({
      type: 'selection',
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
      width: 'max-w-4xl',
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
    return <n-modal show={this.show} displayDirective="if">
      <n-card class={this.width} content-style="padding: 0;">
        <div className="flex items-center p-4 border-b border-gray-300">
          <div className="flex-grow text-xl">{this.title}</div>
          <div className="cursor-pointer btn-close h-6 w-6 text-gray-600 hover:text-red-900" onClick={this.onCancel}>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
            </svg>
          </div>
        </div>
        <div className="p-4">
          <div className="flex gap-4 mb-3">
            {this.type && <div className="flex-grow">
              <n-radio-group
                value={this.filter.type}
                onUpdate:value={value => this.filter.type = value}
                name="left-size"
              >
                {this.type.map(item => <n-radio-button value={item.key}>{item.name}</n-radio-button>)}
              </n-radio-group>
            </div>}
            {this.search && <div className="flex-none flex gap-4">
              <div>
                <n-input placeholder="请输入搜索内容" value={this.filter.query}
                         onUpdate:value={value => this.filter.query = value}/>
              </div>
            </div>}
          </div>
          <n-data-table remote={true} loading={this.loading} columns={this.columns} data={this.data}
                        rowKey={row => row[this.key]} pagination={this.pagination}
                        onUpdate:checkedRowKeys={value => {
                          this.checked = value
                          if (!this.multiple) {
                            this.onSave()
                          }
                        }
                        }/>
          {this.multiple && <div className="mt-4 flex justify-end gap-2">
            <n-button onClick={this.onCancel}>取消</n-button>
            <n-button type="primary" onClick={this.onSave}>确定</n-button>
          </div>}
        </div>
      </n-card>
    </n-modal>
  }
})
