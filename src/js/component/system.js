(function ($, owner) {

    /**
     * 导航菜单
     * @param $el
     * @param config
     */
    owner.nav = function ($el, config) {
        let defaultConfig = {};
        config = $.extend(defaultConfig, config);

        Do('cookie', () => {
            $('[data-menu-switch]').on('click', function () {
                $('.sidebar-main').find('.open').removeClass('open')
                if ($(this).hasClass('active')) {
                    $('.layout-body').addClass('layout-body-sm')
                    $('.layout-main').removeClass('layout-main-sidebar')
                    cookie.set('menu-switch', 1, { path: '/' })
                } else {
                    $('.layout-body').removeClass('layout-body-sm')
                    let $active = $('.sidebar-main').find('[data-parent].active')
                    $active.addClass('open')
                    if ($active.data('parent')) {
                        $('.layout-main').addClass('layout-main-sidebar')
                    }
                    cookie.set('menu-switch', 0, { path: '/' })

                }
            })

            $($el).find('[data-parent]').on('click', function () {
                let status = $('.layout-body').hasClass('layout-body-sm')
                if ($(this).hasClass('open')) {
                    $($el).find('[data-parent]').removeClass('open active')
                    $('.layout-main').removeClass('layout-main-sidebar')
                } else {
                    $($el).find('[data-parent]').removeClass('open active')
                    $(this).addClass('active open')
                    if ($(this).data('parent') && !status) {
                        $('.layout-main').addClass('layout-main-sidebar')
                    } else {
                        $('.layout-main').removeClass('layout-main-sidebar')
                    }
                }
            })

            $($el).find('.nav-sub').on('click', 'a', function () {
                $($el).find('.nav-sub a.active').removeClass('active');
                $(this).addClass('active');
            })
        })
    }

    /**
     * alpine 加载区域
     * @param config
     * @returns {boolean|{select(*=): void, data, el: {"@click"(): void}, active, loadData(*=): void, menu: {"x-show"(): boolean, "@click.outside"(): void}, open: boolean}}
     */
    owner.loadArea = function (config) {

        return {
            open: false,
            active: config.active,
            data: config.data,
            el: {
                ['@click']() {
                    this.open = !this.open
                },
            },
            menu: {
                ['x-show']() {
                    return this.open
                },
                ['@click.outside']() {
                    this.open = false
                },
            },
            select(item) {
                this.open = false
                this.active = item
                this.loadData({ type: item })
            },
            loadData(params) {
                $(config.target).html(page.load())
                setTimeout(function () {
                    app.ajax({
                        url: config.url,
                        type: 'get',
                        notify: false,
                        params: params
                    }).then(data => {
                        $(config.target).html(data.response)
                    }).catch(error => {
                        $(config.target).html(page.empty())
                    })
                }, 500)
            }
        }
    }

    /**
     * 规格选择器
     */
    owner.spec = function ($el, config) {
        let defaultConfig = {
            key: 'spec', // 规格字段
            keysData: [], // 货品字段
            specData: [], // 规格数据
            skuList: [], // 货品数据
        }
        config = $.extend(defaultConfig, config)

        let skuList = config.skuList
        let keysData = config.keysData
        let specData = config.specData
        if (skuList && typeof (skuList) == 'string') {
            skuList = JSON.parse(skuList)
        }
        if (keysData && typeof (keysData) == 'string') {
            keysData = JSON.parse(keysData)
        }
        if (specData && typeof (specData) == 'string') {
            specData = JSON.parse(specData)
        }

        /*skuList = [
            {
                number: 8888
            }
        ]
        keysData = [
            {
                name: '图片',
                key: 'image',
                type: 'image'
            },
            {
                name: '数字',
                key: 'number',
                type: 'number'
            },
            {
                name: '文本',
                key: 'text',
                type: 'text'
            }
        ]
        specData = [
            {
                name: '颜色',
                spec: ['黄色', '黑色']
            },
            {
                name: '大小',
                spec: ['34', '35']
            },
        ]*/
        //<a href="javascript:;" data-add>添加规格</a>\

        skuList = skuList ? skuList : [];
        specData = specData ? specData : [];

        let specSelect = `<div><div class="app-spec"></div></div>`
        let specTable = `<div class="overflow-x-scroll">
                      <table class="table-box">
                      </table>
                    </div>`

        let $specSelect = $(specSelect)
        let $specTable = $(specTable)

        $specSelect.on('click', '[data-add]', function () {
            $($el).trigger('add')
        })

        let render = () => {
            // 渲染规格
            let html = specData.map((item, key) => {
                return `<div class="bg-gray-100 p-3 mb-3" data-spec>
                                    <div class="flex flex-wrap flex-col lg:flex-row gap-4 lg:items-center mb-4">
                                        <div class="flex-none">规格名</div>
                                        <div class="flex-grow flex flex-col lg:flex-row gap-4 lg:items-center">
                                            <div class="lg:w-52"><input type="text" data-spec-name class="form-input" name="${config.key}[spec][${key}][name]" value="${item.name}"></div>
                                            <a href="javascript:;" data-del class="text-red-900 block">删除规格</a>
                                        </div>
                                    </div>
                                    <div class="flex flex-wrap flex-col lg:flex-row gap-4 lg:items-center">
                                        <div class="flex-none">规格值</div>
                                        <div class="flex-grow">
                                            <div class="flex flex-wrap  flex-col lg:flex-row gap-4 lg:items-center">
                                                ${item.spec.map(spec => {
                                                    return `<div data-item>
                                                            <input type="hidden"  name="${config.key}[spec][${key}][spec][]" value="${spec}">
                                                            <span class="btn-outline-blue flex items-center ">
                                                                <div class="flex-grow flex justify-start">${spec}</div>
                                                                <span class="flex-none ml-2 h-4 w-4 " data-item-del>
                                                                    <svg xmlns="http://www.w3.org/2000/svg" class="stroke-current w-full h-full" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                                                                    </svg>
                                                                </span>
                                                            </span>
                                                        </div>`
                                                 }).join('')}
                                                <div>
                                                    <div class="relative" x-data="{open: false}">
                                                        <span class="btn bg-white flex gap-2 justify-center items-center block" @click="open = !open">
                                                            <div class="w-4 h-4">
                                                                <svg class="stroke-current w-full h-full" style="" width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                                    <path d="M12 4V20M20 12L4 12" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path>
                                                                </svg>
                                                            </div>
                                                            添加
                                                        </span>
                                                        <div class="dropdown mt-1 left-0 relative lg:absolute" x-cloak @click.outside="open = false" x-show="open">
                                                            <div class="flex space-x-2 ">
                                                                    <input type="text" style="width: 120px;" class="flex-grow form-input">
                                                                    <button type="button" class="flex-grow-0 btn-blue" data-item-add>确定</button>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                        </div>
                        `
            })
            $specSelect.find('.app-spec').html(html)


            // 渲染SKU
            function cartesian(...args) {
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

            let specFilter = specData.map(item => {
                if (!item.name || !item.spec.length) {
                    return false;
                }
                return item;
            }).filter(item => item)

            let array = specFilter.map((item) => {
                return Object.assign([], item.spec)
            }).filter(item => item)
            let specArray = cartesian(...array)

            let tableHtml = `<thead>
              <tr>
                ${specFilter.map(item => `<th class="">${item.name}</th>`).filter(item => item).join('')}
                ${keysData.map(item => `<th class="" data-key="${item.key}"><div class="flex items-center"><div class="flex-grow">${item.name}</div>
                    <a class="flex-none hover:text-blue-900" href="javascript:;" data-batch>
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 13l-7 7-7-7m14-8l-7 7-7-7" />
                        </svg>
                    </a>
                </div></th>`)}
                <th class="" width="70" style="text-align: right">上架</th>
              </tr>
            </thead>
            <tbody>
                ${specArray.map((item, key) => {
                return `<tr data-row>
                ${item.map(value => `<td>${value}</td>`).join('')}
                ${keysData.map(column => {
                    let value = ''
                    if (skuList[key] && skuList[key][column.key]) {
                        value = skuList[key][column.key]
                    }
                    if (column.type === 'image') {
                        return `<td>
                                <div class="relative w-12 h-12 border-2 border-gray-400 border-dashed rounded bg-cover bg-center bg-no-repeat block hover:border-blue-900" style="background-size:90%; background-image: url('${value || '/service/image/placeholder/80/80/图片'}')" data-js="form-image">
                                    <div class="opacity-0 hover:opacity-100 absolute flex items-center justify-center w-full h-full bg-blue-200 bg-opacity-90 rounded cursor-pointer ">
                                        <div class="text-blue-900 w-6 h-6">
                                            <svg xmlns="http://www.w3.org/2000/svg" class="h-full w-full" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                                            </svg>
                                        </div>
                                        <input name="${config.key}[sku][${key}][${column.key}]" data-key="${column.key}" type="hidden" value="${value}">
                                    </div>
                                </div>
                           </td>`
                    } else if (column.type === 'price') {
                        return `<td><input class="form-input" style="min-width: 80px" data-key="${column.key}" name="${config.key}[sku][${key}][${column.key}]" type="number" min="0"  step="0.01" value="${value}"></td>`
                    } else if (column.type === 'number') {
                        return `<td><input class="form-input" style="min-width: 80px" data-key="${column.key}" name="${config.key}[sku][${key}][${column.key}]" type="number" min="0" step="1" value="${value}"></td>`
                    } else {
                        return `<td><input class="form-input" style="min-width: 80px" data-key="${column.key}" name="${config.key}[sku][${key}][${column.key}]" type="text" value="${value}"></td>`
                    }
                })}
                    <td style="text-align: right">
                        <input type="hidden" name="${config.key}[sku][${key}][id]" data-key="id" value="${skuList[key] && skuList[key]['id'] ? skuList[key]['id'] : ''}">
                        <input type="hidden" name="${config.key}[sku][${key}][spec]" data-key="spec" value="${item.map(value => value).join(':')}">
                        <label>
                            <input class="form-checkbox" name="${config.key}[sku][${key}][status]" data-key="status" type="checkbox" value="1" ${skuList[key] ? (skuList[key]['status'] ? 'checked' : '') : 'checked'}>
                        </label>
                    </td>
                </tr>`
            })}
            </tbody>`
            $specTable.find('table').html(tableHtml)
            resetData()
        }

        // 重建数据
        let resetData = () => {
            let tmpArray = []
            $specTable.find('tbody tr').each(function () {
                let tmpItem = {}
                $(this).find('[data-key]').each(function () {
                    let key = $(this).data('key')
                    if ($(this).attr('type') === 'checkbox') {
                        // 选择
                        tmpItem[key] = $(this).prop('checked') ? 1 : 0
                    } else {
                        // 输入
                        tmpItem[key] = $(this).val() ?? ''
                    }
                })
                tmpArray.push(tmpItem)
            })
            skuList = tmpArray
        }

        // 规格添加事件
        $($el).on('add', function () {
            specData.push({
                name: '',
                spec: []
            })
            render()
        })

        // 规格名称
        $specSelect.on('change', '[data-spec-name]', function () {
            let $spec = $(this).parents('[data-spec]')
            let i = $spec.index()
            specData[i].name = $(this).val()
            render()
        })

        // 规格删除
        $specSelect.on('click', '[data-del]', function () {
            let $spec = $(this).parents('[data-spec]')
            let i = $spec.index()
            specData.splice(i, 1)
            render()
        })

        // 规格值添加
        $specSelect.on('click', '[data-item-add]', function () {
            let value = $(this).prev().val()
            if (!value) {
                app.error('请输入规格值')
                return false
            }
            let i = $(this).parents('[data-spec]').index()
            if ($.inArray(value, specData[i].spec) !== -1) {
                app.error('规格值不能重复')
                return false
            }
            specData[i].spec.push(value)
            render()
            return true
        })

        // 规格值删除
        $specSelect.on('click', '[data-item-del]', function () {
            let index = $(this).parents('[data-spec]').index()
            let i = $(this).parents('[data-item]').index()
            specData[index].spec.splice(i, 1)
            render()
            return true
        })

        // 修改SKU数据
        $specTable.on('change', 'input', function () {
            resetData()
        })

        // 批量设置
        $specTable.on('click', '[data-batch]', function () {
            let key = $(this).parents('th').data('key')
            let value = $specTable.find('tbody tr:eq(0)').find('[data-key="' + key + '"]').val()
            skuList = skuList.map(item => {
                item[key] = value
                return item
            })
            render()
        })

        // 初始化
        render()
        $($el).append($specSelect)
        $($el).append($specTable)
    }

}(jQuery, window.system = {}));
