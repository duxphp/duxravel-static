(function ($, owner) {

    /**
     * 绑定表格
     * @param $el
     * @param config
     */
    owner.bind = function ($el, config) {
        let defaultConfig = {};
        let $table = $($el).find('[data-table]'), $filter = $($el).find('[data-filter]'),
            $batch = $($el).find('[data-batch]');
        config = $.extend(defaultConfig, config);
        // 全选反选
        $($el).on('change', '[data-check-all]', function () {
            if (!$(this).is(':checked')) {
                $table.find('input[data-check-all]').prop("checked", false);
                $table.find('input[type=checkbox]').prop("checked", false);
            } else {
                $table.find('input[data-check-all]').prop("checked", true);
                $table.find('input[type=checkbox]').prop("checked", true);
            }
        });

        // AJAX表单
        let $pagination = false, pageId = 0, pageConfig = {
            first: '首页',
            prev: '上一页',
            next: '下一页',
            last: '尾页',
            totalPages: 1,
            visiblePages: 5,
        };
        let filterData = () => {
            $filter.on('submit', function () {
                pageId = 1;
                loadData()
                return false
            })
        }
        let $pages = $($el).find('[data-pagination]');
        let loadData = () => {
            let currentPage = 1;
            let params = app.serializeObject($filter);
            params = $.extend({}, params, {
                page: pageId
            });
            $table.html(page.load())
            app.ajax({
                url: config.ajax,
                params: params,
                type: 'get',
                notify: false
            }).then(data => {
                setTimeout(() => {
                    currentPage = $pages.twbsPagination('getCurrentPage')
                    $pages.twbsPagination('destroy')
                    $pages.twbsPagination($.extend({}, pageConfig, {
                        startPage: currentPage,
                        totalPages: data.result.totalPage
                    })).on('page', function (evt, page) {
                        pageId = page
                        loadData()
                    });
                    $pagination = true;
                    $table.html(data.result.html)
                }, 500)

            }).catch(error => {
                $table.html(page.empty())
                $table.html('<tbody><tr><td>' + page.empty() + '</td></tr></tbody>')
            })
        }
        if (config.ajax) {
            Do('page', () => {
                $pages.twbsPagination($.extend({}, pageConfig, {
                    startPage: 1,
                    totalPages: 1
                }));
                loadData();
                filterData();
            });
        }

        let getCheckIds = function () {
            let ids = [];
            $table.find('[data-check]:checked').each(function () {
                let id = $(this).val();
                if (id) {
                    ids.push(id);
                }
            });
            if (!ids.length) {
                app.error('请选择操作条目');
                return false;
            }
            return ids;
        }

        // 批量链接
        $batch.on('click', '[data-link]', function (event) {
            event.stopPropagation();
            let ids = getCheckIds();
            if (!ids) {
                return false;
            }
            dialog.ajax('', {
                title: $(this).data('title'),
                url: $(this).attr('href'),
                params: ids
            });
            return false;
        });

        // 批量处理
        $batch.on('submit', 'form', function () {
            let type = $(this).find('select').val()

            if (type === '') {
                app.error('请选择操作类型')
                return false;
            }

            let ids = getCheckIds()
            if (!ids) {
                return false;
            }

            let data = {
                type: type,
                ids: ids
            };
            $batch.find('button').attr('disabled', true)

            app.ajax({
                url: $batch.attr('action'),
                data: data,
                type: 'post',
                notify: false,
            }).then(function (data) {
                $batch.find('button').attr('disabled', false)
                dialog.alert({
                    content: data.message,
                    callback: () => {
                        window.location.reload()
                    }
                });
            }).catch(function (error) {
                $batch.find('button').attr('disabled', false)
                app.error(error.message, error.url)
            })
            return false
        })

        // 表格排序
        if (config.sortable) {
            Do('sortable', function () {
                var nestedSortables = [].slice.call($el.querySelectorAll('.sortable-group'));
                for (var i = 0; i < nestedSortables.length; i++) {
                    new Sortable(nestedSortables[i], {
                        group: 'nested',
                        swap: false,
                        dragClass: 'bg-white',
                        handle: '.drag',
                        fallbackOnBody: true,
                        emptyInsertThreshold: 2,
                        swapThreshold: 0.65,
                        onEnd: function (evt) {
                            let toEl = evt.to
                            toEl.dispatchEvent(new Event('notify'))

                            let formId = $(evt.item).data('tr')
                            let parent = $(toEl).data('parent')

                            var before = evt.newIndex - 1
                            let beforeId = before > -1 ? $(toEl).find(' > [data-tr]').eq(before).data('tr') : 0
                            app.ajax({
                                url: config.sortable,
                                type: 'post',
                                data: {
                                    id: formId,
                                    parent: parent,
                                    before: beforeId
                                }
                            })

                        }
                    });
                }
            })
        }
    }


    /**
     * 弹窗表格
     * @param config
     */
    owner.select = function (config) {
        let defaultConfig = {
            title: '选择内容',
            column: [],
            url: '',
            callback: null
        }
        config = $.extend(defaultConfig, config)

        // 渲染弹窗数据
        let modal = `<div class="p-6">
                <div class="mb-3">
                    <div class="flex items-center space-x-2">
                        <div>
                            <input class="form-input" type="text" data-keyword name="keyword" value="" placeholder="请输入关键词搜索">
                        </div>
                        <div>
                            <button class="btn btn-primary" data-search>搜索</button>
                        </div>
                    </div>
                </div>
                <div table></div>
                </div>
                <div class="flex justify-end p-4 space-x-2">
                    <button type="button" class="btn" modal-close>取消</button>
                    <button type="button" class="btn-blue" data-submit modal-close>添加</button>
                </div>
            `
        let $modal

        // 启动弹窗
        let openDialog = function () {
            $modal = $(modal)
            let $table = owner.ajax({
                column: config.column,
                url: config.url,
                query: function () {
                    return $modal.find('[data-keyword]').val()
                },
                select: true
            })
            $modal.find('[table]').html($table)
            dialog.layout({
                title: config.title,
                size: 'large',
                html: $modal,
                callback: () => {
                    // 搜索
                    $modal.on('click', '[data-search]', function () {
                        $table.trigger('refresh')
                    })
                    // 提交
                    $modal.on('click', '[data-submit]', function () {
                        $table.trigger('select', function (data) {
                            base.callback(config.callback, data)
                        })
                    })
                    // 初始数据
                    $table.trigger('refresh')
                }
            })
        }

        let init = () => {
            openDialog()
        }
        init()
    }

    /**
     * 动态表单
     */
    owner.ajax = function (config) {
        let defaultConfig = {
            column: [],
            select: false,
            url: null,
            query: null,
            params: {},
            type: 'table',
            map: {},
            callback: null
        }
        config = $.extend(defaultConfig, config)

        let column = config.column
        if (column && typeof (column) == 'string') {
            column = JSON.parse(column)
        }

        let layout
        if (config.type === 'table') {
            layout = `<div><table class="table-box border border-gray-300  rounded">
                <thead>
                    <tr>
                        ${column.map(item => {
                return `<th width="${item.width || ''}">${item.name}</th>`
            }).join('')}
                        ${config.select ? `<th width="50"><input data-all type="checkbox" class="form-checkbox"></th>` : ''}
                    </tr>
                </thead>
                <tbody data-list>
                    <tr>
                        <td colspan="${config.select ? column.length + 1 : column.length}">${page.load()}</td>
                    </tr>
                </tbody>
                </table>
                <ul pagination class="pagination mt-5 justify-center"></ul></div>`;
        }
        if (config.type === 'list') {
            layout = `<div><div class="flex flex-col divide-y divide-gray-300 rounded border border-gray-300" data-list>

            </div>
             <ul pagination class="pagination mt-5 justify-center"></ul></div>
            </div>`;
        }


        let $table = $(layout)

        let render = (data) => {
            if (config.type === 'table') {
                let html = data.map((item, key) => {
                    return `<tr>${column.map(column => {
                        let row = ''
                        let value = column.value || item[column.key]
                        if (column.type === 'image') {
                            if (value) {
                                row += `<td><span class="avatar me-2 w-10 h-10 rounded" style="background-image: url(${value});"></span></td>`
                            } else {
                                row += `<td><span class="avatar w-10 h-10 border border-gray-300 flex items-center justify-center text-gray-500 rounded">暂无</span></td>`
                            }
                        } else {
                            row += `<td>${column.url ? `<a class="text-blue-900 hover:underline" href="${item[column.url]}">${value}</a>` : value}</td>`
                        }
                        return row
                    }).join('')}
                        ${config.select ? `<td width="50"><input type="checkbox" class="form-checkbox" value="${key}"></td>` : ''}
                        </tr>`
                }).join('')
                if (!html) {
                    html = `<tr><td colspan="${column.length + 1}">${page.data('未找到数据', '暂未找到可选数据，请添加数据后进行')}</td></tr>`
                }
                $table.find('[data-list]').html(html)
                $table.find('[data-all]').prop('checked', false)
            }
            if (config.type === 'list') {
                let html = data.map((item, key) => {
                    let image = config.map['image'] ? item[config.map['image']] : (item.image || null),
                        title = config.map['title'] ? item[config.map['title']] : (item.title || null),
                        desc = config.map['desc'] ? item[config.map['desc']] : (item.desc || null),
                        url = config.map['url'] ? item[config.map['url']] : (item.url || null)

                    return `<label class="flex p-4 items-center space-x-2 cursor-pointer hover:bg-blue-200 hover:bg-opacity-30" data-url="${url}">
                        ${image ? `<div class="flex-none">
                            <div class="avatar w-10 h-10 border border-gray-300 flex items-center justify-center text-gray-500 rounded" style="background-image: url(${image});"></div>
                        </div>` : ''}
                        <div class="flex-grow">
                            <div>${title}</div>
                            ${desc ? `<div class="text-gray-500">${desc}</div>` : ''}
                        </div>
                        <div class="flex-none">
                            ${config.select ?
                        `<input type="checkbox" class="form-checkbox" value="${key}"></td>` :
                        `<svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
                            </svg>`}
                        </div>
                    </label>`;
                }).join('')
                if (!html) {
                    html = page.data('未找到数据', '暂未找到可选数据，请添加数据后进行')
                }
                $table.find('[data-list]').html(html)
            }
        }

        if (config.type === 'table') {
            $table.on('change', '[data-all]', function () {
                if ($(this).prop('checked')) {
                    $table.find('[data-list]').find('input[type="checkbox"]').prop('checked', true)
                    $table.find('[data-submit]').prop('disabled', false)
                } else {
                    $table.find('tbody').find('input[type="checkbox"]').prop('checked', false)
                    $table.find('[data-submit]').prop('disabled', true)
                }
            })
            $table.on('change', 'tbody input[type="checkbox"]', function () {
                let count = $table.find('[data-list]').find('input[type="checkbox"]').length
                let checked = $table.find('[data-list]').find('input[type="checkbox"]:checked').length
                if (checked === count) {
                    $table.find('[data-all]').prop('checked', true)
                } else {
                    $table.find('[data-all]').prop('checked', false)
                }
                if (checked) {
                    $table.find('[data-submit]').prop('disabled', false)
                } else {
                    $table.find('[data-submit]').prop('disabled', true)
                }
            })
        }

        if (config.type === 'list') {
            if (!config.select) {
                $table.find('[data-list]').on('click', 'label', function () {
                    if (config.callback) {
                        base.callback(config.callback, this)
                    } else {
                        window.location.href = $(this).data('url')
                    }
                })
            }
        }

        // 加载数据
        let pageId = 1, $pagination = false, pageConfig = {
            first: '首页',
            prev: '上一页',
            next: '下一页',
            last: '尾页',
            totalPages: 1,
            visiblePages: 5,
        }, pageData

        let loadData = () => {
            if (config.type === 'table') {
                $table.find('[data-list]').html(`<tr><td colspan="${column.length + 1}">${page.load()}</td> </tr>`)
            }
            if (config.type === 'list') {
                $table.find('[data-list]').html(`${page.load()}`)
            }
            let params = {
                page: pageId,
                query: typeof config.query === 'function' ? base.callback(config.query) : config.query,
            }
            params = $.extend(params, config.params)
            app.ajax({
                url: typeof config.url === 'function' ? base.callback(config.url) : config.url,
                params: params,
                notify: false
            }).then(data => {
                let currentPage = 1;
                if ($pagination) {
                    currentPage = $table.find('[pagination]').twbsPagination('getCurrentPage')
                    $table.find('[pagination]').twbsPagination('destroy')
                }
                $pagination = true
                $table.find('[pagination]').twbsPagination($.extend({}, pageConfig, {
                    startPage: currentPage,
                    totalPages: data.result.page
                })).on('page', function (evt, page) {
                    pageId = page
                    loadData()
                })
                pageData = data.result.data
                setTimeout(function () {
                    render(data.result.data)
                }, 300)

            }).catch(error => {
                render([])
            })
        }

        $table.on('refresh', function () {
            pageId = 1
            Do('page', () => {
                loadData()
            })
        })

        $table.on('config', function (obj, extend) {
            config = $.extend(config, extend)
        })

        $table.on('select', function (obj, callback) {
            let data = []
            $table.find('[data-list]').find('input[type="checkbox"]:checked').each(function () {
                let i = parseInt($(this).val())
                data.push(pageData[i])
            })
            callback = config.callback || callback
            return base.callback(callback, data);
        })

        return $table;
    }


}(jQuery, window.table = {}));
