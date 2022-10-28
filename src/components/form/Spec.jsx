import {defineComponent} from 'vue'

export default defineComponent({
    props: {
        'value': {
            type: Array,
            default: [],
        },
        'fields': {
            type: Array,
            default: [],
        },
    },
    data() {
        const fields = this.fields || []
        const sku = this.value && this.value["sku"] ? this.value["sku"] : []
        const list = this.value && this.value["data"]  ? this.value["data"] : []

        return {
            fields: fields,
            sku: sku,
            list: list,
            specFilter: [],
            specArray: [],
        }
    },
    created() {
    },
    watch: {
        sku: {
            handler(n, o) {
                this.specFilter = this.sku.map(item => {
                    if (!item.name || !item.spec.length) {
                        return false;
                    }
                    return item;
                }).filter(item => item)

                let array = this.specFilter.map((item) => {
                    return Object.assign([], item.spec)
                }).filter(item => item)
                this.specArray = this.cartesian(...array)

                this.specArray.map((item, index) => {
                    if (!this.list[index]) {
                        this.list[index] = {
                            status: true,
                            id: 0,
                            spec: item.map(value => value).join(':')
                        }
                    }else {
                        let keys = Object.keys(this.list[index])
                        this.list[index].status = keys.includes("status") ? this.list[index].status : 0
                        this.list[index].id = keys.includes("id") ? this.list[index].id : 0
                        this.list[index].spec = item.map(value => value).join(':')

                    }
                    this.fields.map(field => {
                        if (!this.list[index].hasOwnProperty(field.key)) {
                            switch (field.type) {
                                case "price":
                                    this.list[index][field.key] = 0.00
                                    break
                                case "number":
                                    this.list[index][field.key] = 0
                                    break
                                default:
                                    this.list[index][field.key] = ''
                            }
                        }
                    })
                })
                this.$emit('update:value', {
                    sku: this.sku,

                    data: this.list
                })

            },
            immediate: true,
            deep: true
        },
        list: {
            handler(n, o) {
                this.$emit('update:value', {
                    sku: this.sku,
                    data: this.list
                })
            },
            deep: true
        },
    },
    methods: {
        cartesian(...args) {
            return args.reduce(
                (total, current) => {
                    let ret = [];
                    total.forEach(a => {
                        current.forEach(b => {
                            ret.push(a.concat([b]));
                        });
                    });
                    return ret;
                },
                [[]]
            );
        }
    },
    render() {
        return <div className="w-full">
            <a-button type="primary" onClick={() => {

                window.appDialog.prompt({
                    title: '请输入规格名称',
                }).then(value => {
                    this.sku.push({
                        name: value,
                        spec: [],
                    })
                })
            }}>添加规格</a-button>
            {
                this.sku.map((item, index) => <div className="border-1 border-gray-200  p-3 mt-3">
                    <div className="flex flex-wrap flex-col lg:flex-row gap-4 lg:items-center mb-4">
                        <div className="flex-none">规格名</div>
                        <div className="flex-grow flex flex-col lg:flex-row gap-4 lg:items-center">
                            <div>
                                <a-input style="width:160px;" vModel={[item.name, 'model-value']}>
                                    {
                                        {
                                            "append": () => <a href="javascript:;" className="text-red-600"
                                                               onClick={() => {
                                                                   delete this.sku[index]
                                                               }}><icon-close /></a>
                                        }
                                    }
                                </a-input>
                            </div>
                        </div>
                    </div>
                    <div className="flex flex-wrap flex-col lg:flex-row gap-4 lg:items-center">
                        <div className="flex-none">规格值</div>
                        <div className="flex-grow">
                            <div className="flex flex-wrap  flex-col lg:flex-row gap-2 lg:items-center">
                                {
                                    item.spec.length > 0 && item.spec.map((spec, i) => <div data-item>
                                        <a-input style="width:160px;" vModel={[item.spec[i], 'model-value']}>
                                            {
                                                {
                                                    "append": () => <a href="javascript:;" className="text-red-600"
                                                                       onClick={() => {
                                                                           delete item.spec[i]
                                                                       }}>
                                                        <icon-close />
                                                    </a>
                                                }
                                            }
                                        </a-input>
                                    </div>)
                                }
                                <div>
                                    <div className="relative">
                                        <a-button onClick={() => {
                                            window.appDialog.prompt({
                                                title: '请输入规格名称',
                                            }).then(value => {
                                                item.spec.push(value)
                                            })
                                        }}>
                                            {
                                                {
                                                    "icon": <icon-plus />
                                                }
                                            }
                                        </a-button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>)
            }
            <div className="overflow-x-scroll arco-table mt-3">
                <table className="arco-table-element">
                    <thead>
                    <tr className="arco-table-tr">
                        {this.specFilter.map(item => <th class="arco-table-th"><span
                            className="arco-table-cell arco-table-cell-align-left">{item.name}</span>
                        </th>).filter(item => item)}
                        {this.fields.map(item => <th class="arco-table-th">
                            <div class="arco-table-cell arco-table-cell-align-left flex items-center">
                                <div class="flex-grow">{item.name}</div>
                                <a class="flex-none hover:text-blue-900" href="javascript:;" onClick={() => {
                                    let value = this.list[0][item.key]
                                    this.list.map(vo => {
                                        vo[item.key] = value
                                    })
                                }}>
                                    <icon-double-down />
                                </a>
                            </div>
                        </th>)}
                        <th className="arco-table-th" width="70" style="text-align: right"><span
                            className="arco-table-cell arco-table-cell-align-left">上架</span></th>
                    </tr>
                    </thead>
                    <tbody>
                    {
                        this.specArray.map((item, key) => <tr className="arco-table-tr">
                            {item.map(value => <td className="arco-table-td"><span
                                className="arco-table-cell arco-table-cell-align-left">{value}</span></td>)}
                            {this.fields.map(column => <td className="arco-table-td"><span
                                className="arco-table-cell arco-table-cell-align-left">
                                {column.type === 'image' && <app-file image={true} size={100} vModel={[this.list[key][column.key], 'value']} ></app-file>}
                                {column.type === 'price' && <a-input-number precision={2} step={0.01}  model-event="input" vModel={[this.list[key][column.key], 'model-value']} />}
                                {column.type === 'number' && <a-input-number model-event="input" precision={0} step={1} vModel={[this.list[key][column.key], 'model-value']} />}
                                {column.type === 'text' && <a-input vModel={[this.list[key][column.key], 'model-value']} allow-clear/>}
                                    </span></td>)}
                            <td className="arco-table-td" style="text-align: right">
                                <label className="arco-table-cell arco-table-cell-align-left">
                                    <a-checkbox vModel={[this.list[key]['status'], 'model-value']} value="1" />
                                </label>
                            </td>
                        </tr>)
                    }
                    </tbody>
                </table>
            </div>
        </div>
    }
})
