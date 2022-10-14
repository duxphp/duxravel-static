import {defineComponent} from 'vue'

export default defineComponent({
    props: {
        'value': {
            type: Array,
        },
        'fields': {
            type: Array
        },
        'sku': {
            type: Array
        }
    },

    data() {
        const list = this.value || []
        const sku = this.sku || []
        const fields = this.fields || []



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
            handler(n,o) {
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
            },
            immediate: true,
            deep: true
        }
    },
    methods: {
        onSelect(value) {
            this.$emit('update:value', value)
        },
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
                {
                    this.sku.map((item, index) => <div className="border-1 border-gray-200  p-3 mb-3">
                        <div className="flex flex-wrap flex-col lg:flex-row gap-4 lg:items-center mb-4">
                            <div className="flex-none">规格名</div>
                            <div className="flex-grow flex flex-col lg:flex-row gap-4 lg:items-center">
                                <div>
                                    <a-input style="width:160px;" vModel={[item.name, 'model-value']}>
                                        {
                                            {
                                                "append": () => <a href="javascript:;" className="text-red-600">删除</a>
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
                                            <a-input style="width:160px;"  vModel={[item.spec[i], 'model-value']}>
                                                {
                                                    {
                                                        "append": () => <a href="javascript:;" className="text-red-600">删除</a>
                                                    }
                                                }
                                            </a-input>
                                        </div>)
                                    }
                                    <div>
                                        <div className="relative">
                                            <a-button >添加</a-button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>)
                }
            <div className="overflow-x-scroll arco-table">
                <table className="arco-table-element">
                    <thead>
                    <tr className="arco-table-tr">
                        {this.specFilter.map(item => <th class="arco-table-th"><span className="arco-table-cell arco-table-cell-align-left">{item.name}</span></th>).filter(item => item)}
                        {this.fields.map(item => <th class="arco-table-th">
                            <div class="arco-table-cell arco-table-cell-align-left flex items-center">
                                <div class="flex-grow">{item.name}</div>
                                <a class="flex-none hover:text-blue-900" href="javascript:;">
                                    <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 13l-7 7-7-7m14-8l-7 7-7-7"/></svg>
                                </a>
                            </div>
                        </th>)}
                        <th className="arco-table-th" width="70" style="text-align: right"><span className="arco-table-cell arco-table-cell-align-left">上架</span></th>
                    </tr>
                    </thead>
                    <tbody>
                    {
                        this.specArray.map((item, key) => <tr className="arco-table-tr">
                            {item.map(value => <td className="arco-table-td"><span className="arco-table-cell arco-table-cell-align-left">{value}</span></td>)}
                                {this.fields.map(column => <td className="arco-table-td"><span className="arco-table-cell arco-table-cell-align-left">
                                    {column.type === 'image' && <app-file image={true} size={100}></app-file>}
                                    {column.type === 'price' && <a-input-number precision={2} />}
                                    {column.type === 'number' && <a-input-number />}
                                    {column.type === 'text' && <a-input  allow-clear />}
                                    </span></td>)}
                            <td className="arco-table-td" style="text-align: right">
                                <label className="arco-table-cell arco-table-cell-align-left">
                                    <a-checkbox value="1" />
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
