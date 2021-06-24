(function ($, owner) {

    owner.upload = function ($el, config) {
        let defaultConfig = {
            url: '/admin/upload',
            loading: true,
            params: null,
            image: {
                thumb: false,
                width: 0,
                height: 0,
                water: false,
                alpha: 80,
            },
            callback: null
        }
        config = $.extend(defaultConfig, config)
        let $file = $(`<input class="sr-only" type="file" multiple>`)
        $($el).css('position', 'relative')
        $($el).css('overflow', 'hidden')
        $($el).append($file)

        let $progress = $('<span class="ml-2" progress></span>')
        let lock = function () {
            if (config.loading) {
                $($el).append($progress)
            }
            $file.attr('disabled', true)
            $($el).attr('disabled', true)
        }
        let unlock = function () {
            $progress.remove()
            $file.attr('disabled', false)
            $($el).attr('disabled', false)
            $file.val('')
        }

        $file.on('change', function (event) {
            let files = event.target.files;
            let formFile = new FormData()
            $.each(files, function (i, file) {
                formFile.append('file_' + i, file)
            })
            lock()
            $progress.text('0%')
            let params = typeof config.params === "function" ? config.params() : config.params
            params = $.extend({}, params, config.image)
            app.ajax({
                url: config.url,
                params: params,
                data: formFile,
                type: 'post',
                axios: {
                    onUploadProgress: progressEvent => {
                        let complete = (progressEvent.loaded / progressEvent.total * 100 | 0) + '%'
                        $progress.text(complete)
                    }
                },
                notify: false
            }).then(function (data) {
                unlock()
                base.callback(config.callback, data.result)
            }).catch(function (error) {
                unlock()
                app.error(error.message)
            })
        });
    }

    /**
     * 文件管理
     * @param config
     */
    owner.manage = function (config) {
        let defaultConfig = {
            url: '/admin/fileManage',
            uploadUrl: '/admin/upload',
            multiple: false,
            type: 'all',
            image: {},
            callback: null
        }
        config = $.extend(defaultConfig, config)

        let html = `
                    <div>
                        <div class="flex flex-col lg:flex-row p-4 border-b border-gray-300  gap-2">
                            <div class="flex-grow flex flex-col lg:flex-row gap-2">
                                <div>
                                    <label type="button" class="btn-blue block" file-upload>上传</label>
                                </div>
                                <div>
                                    <button type="button" class="btn-outline-red w-full hidden" file-delete>删除文件</button>
                                </div>
                            </div>
                            <div class="flex-none flex flex-col lg:flex-row gap-2">
                                <div class=" ${config.type != 'all' ? 'hidden' : ''}"">
                                    <select class="form-select filter-type ${config.type != 'all' ? 'disabled' : ''}>
                                        <option value="all">全部类型</option>
                                        <option value="image" ${config.type == 'image' ? 'selected' : ''}>图片</option>
                                        <option value="video" ${config.type == 'video' ? 'selected' : ''}>视频</option>
                                        <option value="audio" ${config.type == 'audio' ? 'selected' : ''}>音频</option>
                                        <option value="document" ${config.type == 'document' ? 'selected' : ''}>文档</option>
                                        <option value="other" ${config.type == 'other' ? 'selected' : ''}>其他</option>
                                    </select>
                                </div>
                                <div>
                                    <input type="text" class="form-input" filter-keyword placeholder="请输入关键词">
                                </div>
                            </div>
                        </div>
                            <div class="flex flex-col lg:flex-row items-stretch border-b border-gray-400" x-data="{fileDir: false}">
                                <div class="lg:hidden">
                                    <div class="p-2 text-center border-b border-gray-400" x-on:click="fileDir = !fileDir" x-text="fileDir ? '关闭目录' : '打开目录'"></div>
                                </div>
                                <div :class="{'hidden' : !fileDir}" class="flex-none filemanage-sidebar border-b bg-gray-100 lg:bg-white lg:w-40 lg:border-b-0 lg:border-r border-gray-400 lg:h-96 lg:overflow-y-auto  lg:block">
                                </div>
                                <div class="flex-grow filemanage-main  lg:h-96 overflow-y-auto">
                                    <ul class="files-list grid lg:grid-cols-4 md:grid-cols-3 grid-cols-2  gap-5 p-4">
                                    </ul>
                                    <ul pagination class="pagination flex justify-center p-3"></ul>
                                        <div class="files-none hidden flex flex-col justify-center items-center text-center h-full">
                                          <div class="w-20 h-20 ">
                                            <svg class="w-full h-full opacity-60" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="31303" width="200" height="200"><path d="M44.002314 921.371007a485.548324 102.374556 0 1 0 971.095648 0 485.548324 102.374556 0 1 0-971.095648 0z" fill="#fbbab7" p-id="31304"></path><path d="M533.937548 453.373321L204.876331 539.659876V731.248259l329.061217-86.287554 329.061216 86.287554V539.659876z" fill="#fb5860" p-id="31305"></path><path d="M716.749113 643.497068c0 16.088002-13.162729 29.24973-29.249731 29.249731s-29.24973-13.161729-29.24973-29.249731S671.410381 614.247338 687.499382 614.247338s29.24973 13.162729 29.249731 29.24973m8.774819-190.123747c8.774819 0 16.088002-7.313182 16.088001-16.088002 0-8.774819-7.313182-16.087002-16.088001-16.087002-8.774819 0-16.087002 7.312183-16.087002 16.087002 1.462636 8.774819 7.312183 16.088002 16.087002 16.088002m-23.400184-58.500461c32.175003 0 58.500461 26.325457 58.50046 58.500461S734.298751 511.872782 702.122748 511.872782s-58.499461-26.324457-58.499461-58.499461 26.325457-58.500461 58.499461-58.500461m-29.249731-21.936548c0-11.700092-10.237456-21.937548-21.937547-21.937548s-21.936548 10.237456-21.936548 21.937548 10.237456 21.936548 21.936548 21.936548 21.937548-10.237456 21.937547-21.936548" fill="#cb302b" p-id="31306"></path><path d="M541.24973 434.361046h-10.237455c27.787094-20.474911 51.187278-48.263005 67.27528-83.362282 49.724642-108.225102 2.924273-236.924116-103.837193-288.111394S260.451519 59.962097 210.724877 168.1872c-30.712367 68.736916-27.787094 162.336654 21.937548 222.298751 27.788094 33.63764 65.812643 58.499461 109.687739 58.49946 65.811643 0 118.461558-49.724642 118.461558-115.537285s-52.649915-119.924195-118.461558-119.924194c-13.162729 0-24.862821 1.462636-36.562913 5.850546 19.012275-10.237456 40.949823-16.088002 64.350007-16.088002 78.974372 0 143.324379 65.812643 143.324379 146.249652 0 10.237456-1.462636 21.937548-2.925273 32.175003-2.925273 14.624365-8.774819 29.24973-16.087002 42.412459-7.313182 11.699092-13.162729 20.474911-23.400184 30.712367-7.312183 8.774819-13.162729 13.161729-19.012275 20.474912-17.549638 20.474911-27.787094 48.262005-27.787094 77.511735 0 65.812643 52.648915 119.924195 116.998922 119.924195S658.249652 618.636247 658.249652 552.822604s-52.649915-118.461558-116.999922-118.461558" fill="#d81e06" p-id="31307"></path><path d="M526.625365 979.870468l-315.899488-81.899645c-11.699092-2.924273-20.474911-14.624365-20.474911-26.324458L204.876331 541.122512l321.749034 87.750191v350.997765z" fill="#d81e06" p-id="31308"></path><path d="M443.263084 804.371086l-276.411303-73.123827c-14.625365-4.387909-23.400184-19.013275-19.012274-33.63764l49.724641-156.487107 329.061217 87.750191-51.187278 157.948744c-4.387909 13.162729-19.013275 20.474911-32.175003 17.549639" fill="#fb7f7a" p-id="31309"></path><path d="M526.625365 979.870468l315.898488-81.899645c11.700092-2.924273 20.474911-14.624365 20.474911-26.324458V541.122512L526.625365 628.873703v350.997764z" fill="#d81e06" p-id="31310"></path><path d="M607.062374 804.371086L886.396949 731.248259c14.625365-4.387909 23.400184-19.013275 19.013275-33.63764l-46.800369-156.487107L526.626365 628.873703l46.799369 156.486107c4.387909 14.625365 19.012275 21.937548 33.637639 19.012275" fill="#fb7f7a" p-id="31311"></path><path d="M751.849389 228.149297H726.986568c-5.849546 0-10.237456-2.925273-10.237455-8.774819 0-5.850546 4.387909-8.775819 10.237455-8.775819h24.862821v-24.861821c0-5.850546 4.38691-10.237456 10.237456-10.237456 5.849546 0 10.237456 4.38691 10.237455 10.237456v24.861821h21.936548c5.850546 0 10.237456 2.925273 10.237456 8.775819 0 5.849546-4.38691 8.774819-10.237456 8.774819H772.3253v21.937548c0 5.849546-4.387909 10.237456-10.237456 10.237455-5.850546 0-10.237456-4.387909-10.237455-10.237455v-21.937548z" fill="#6DD400" p-id="31312"></path><path d="M952.210592 383.173768l-13.162728-13.162729c-4.38691-4.387909-4.38691-10.237456 0-14.625365 4.387909-4.38691 11.700092-4.38691 16.088001 0l13.161729 13.162729 13.162729-13.162729c4.387909-4.38691 11.700092-4.38691 16.088001 0 4.38691 4.387909 4.38691 10.237456 0 14.625365l-13.162728 13.162729 13.162728 13.161729c4.38691 4.387909 4.38691 10.237456 0 14.625365-2.925273 1.462636-4.387909 2.925273-7.313182 2.925273s-5.849546-1.462636-7.312183-2.925273l-13.162729-13.162729-13.161728 13.162729c-1.462636 1.462636-4.387909 2.925273-7.313183 2.925273s-5.849546-1.462636-7.312182-2.925273c-4.387909-4.387909-4.387909-10.237456 0-14.625365l10.237455-13.161729zM26.451676 223.761387L1.589855 200.361203c-1.462636-2.924273-1.462636-5.849546 0-7.312182 2.925273-2.925273 5.849546-2.925273 7.312183 0l24.86282 24.86282c1.462636 1.462636 1.462636 5.849546 0 7.312183s-4.387909 1.462636-7.313182-1.462637z" fill="#F7B500" p-id="31313"></path><path d="M33.764858 200.361203L8.902038 223.761387c-1.462636 1.462636-5.849546 1.462636-7.312183 0s-1.462636-4.38691 0-7.312182l24.861821-24.862821c2.925273-1.462636 5.850546-1.462636 7.313182 1.462637 2.924273 1.462636 2.924273 4.387909 0 7.312182z" fill="#F7B500" p-id="31314"></path><path d="M848.373399 39.487186V4.388909c0-1.462636 2.925273-4.387909 7.312183-4.387909s7.313182 2.925273 7.313182 4.387909v33.63664c0 2.925273-2.925273 5.850546-7.313182 5.850546s-7.312183-2.925273-7.312183-4.387909z" fill="#FA6400" p-id="31315"></path><path d="M873.23622 29.24973H839.59858c-2.925273 0-5.849546-2.925273-5.849546-7.312182s2.924273-7.312183 4.38691-7.312183h33.63764c2.925273 0 5.849546 2.924273 5.849546 7.312183s-2.924273 7.312183-4.38691 7.312182z" fill="#FA6400" p-id="31316"></path><path d="M95.189592 525.03551c-20.474911 0-36.562913-16.088002-36.562913-35.100276 0-20.474911 16.088002-36.561913 36.562913-36.561913s36.561913 16.087002 36.561913 35.099276c0 20.474911-16.087002 36.562913-36.561913 36.562913z m0-51.187278c-8.774819 0-14.625365 5.849546-14.625365 14.624365s5.850546 14.625365 14.625365 14.625365 14.624365-5.850546 14.624365-14.625365-5.849546-14.624365-14.624365-14.624365z" fill="#F7B500" p-id="31317"></path></svg>
                                          </div>
                                          <div class="mt-5 text-xl">没有找到文件</div>
                                          <div class="mt-1 text-gray-500">
                                            该目录下暂时没有找到该类型的文件，您可以进行上传
                                          </div>
                                        </div>
                                </div>
                            </div>
                    <div class="p-4 flex flex-col lg:flex-row">
                        <div class="flex-grow flex gap-2 hidden lg:flex  flex-col lg:flex-row">
                                <button type="button" class="btn" folder-create>创建目录</button>
                                <button type="button" class="btn" folder-delete>删除目录</button>
                        </div>
                        <div class="flex-none flex gap-2  flex-col lg:flex-row">
                           <button type="button" class="btn me-2" modal-close>关闭</button>
                           <button type="button" data-submit class="btn-blue" disabled>确定</button>
                        </div>
                    </div>
                </div>`;
        let $modal = $(html);

        let dirId, pageId = 1, $pagination = false, pageConfig = {
            first: '首页',
            prev: '上一页',
            next: '下一页',
            last: '尾页',
            totalPages: 1,
            visiblePages: 5,
        }, shift = false, fileData = {}, params = {}

        //文件夹处理
        let folder = () => {
            $modal.find('.filemanage-sidebar').on('click', 'li', function () {
                $modal.find('.filemanage-sidebar li').removeClass('active text-blue-900')
                $(this).addClass('active text-blue-900')
                $modal.find('.folder-delete-body').removeClass('hidden')
                dirId = $(this).data('id')
                loadFiles()
            })
            $modal.find('[folder-delete]').click(function () {
                let $el = $modal.find('.filemanage-sidebar li.active'), id = $el.data('id')
                if (!id) {
                    app.error('请选择目录')
                    return false
                }

                dialog.confirm({
                    title: '删除目录',
                    content: '确认删除该上传目录？',
                    success: function () {
                        app.ajax({
                            url: config.url,
                            params: {
                                type: 'folder-delete',
                                id: id,
                            },
                            type: 'get',
                            notify: false
                        }).then(data => {
                            $el.remove()
                            $modal.find('.filemanage-sidebar li:eq(0)').click()
                        }).catch(error => {
                            app.error(error.message)
                        })
                    }
                })
            })
            $modal.find('[folder-create]').click(function () {
                let $ul = $modal.find('.filemanage-sidebar').children('ul')
                dialog.prompt({
                    title: '请输入目录名称',
                    callback: function (value) {
                        if (!value) {
                            app.error('请输入目录名称')
                            return false
                        }
                        app.ajax({
                            url: config.url,
                            params: {
                                type: 'folder-create',
                                name: value
                            },
                            type: 'get',
                            notify: false
                        }).then(data => {
                            $ul.append(`<li class="py-3 px-4 cursor-pointer hover:bg-gray-200" data-id="${data.result.id}">${data.result.name}</li>`)
                        }).catch(error => {
                            app.error(error.message)
                        })
                    }
                });

            })

        }

        // 文件处理
        $(window).keydown(function (e) {
            if (e.shiftKey) {
                shift = true;
            }
        }).keyup(function () {
            shift = false;
        });
        let files = () => {
            $modal.find('.files-list').on('click', '.item', function () {
                if (!config.multiple || !shift) {
                    $modal.find('.files-list .active').removeClass('active bg-gray-200 text-blue-900 ')
                }
                $(this).toggleClass('active  bg-gray-200 text-blue-900 ')
                let num = $modal.find('.files-list .active').length;
                if (num) {
                    $modal.find('[data-submit]').attr('disabled', false)
                } else {
                    $modal.find('[data-submit]').attr('disabled', true)
                }
                if (num >= 1) {
                    $modal.find('[file-delete]').removeClass('hidden')
                }
                if (num <= 0) {
                    $modal.find('[file-delete]').addClass('hidden')
                }
            })
            $modal.on('click', '[data-submit]', function () {
                let data = []
                $modal.find('.files-list .active').each(function () {
                    data.push(fileData[$(this).data('id')])
                })
                base.callback(config.callback, data)
                $modal.trigger('close')
            })
            $modal.on('click', '[file-delete]', function () {
                let ids = []
                $modal.find('.files-list .active').each(function () {
                    ids.push($(this).data('id'))
                })
                if (!ids) {
                    app.error('请选择删除文件')
                    return false
                }
                dialog.confirm({
                    title: '删除文件',
                    content: '确认删除所选上传文件？',
                    success: function () {
                        app.ajax({
                            url: config.url,
                            params: {
                                type: 'files-delete',
                                id: ids.join(','),
                            },
                            type: 'get',
                            notify: false
                        }).then(data => {
                            loadFiles()
                        }).catch(error => {
                            app.error(error.message)
                        })
                    }
                })
            })
        }

        // 筛选处理
        let timeTool;
        let filter = () => {
            $modal.on('change', '[filter-type]', function () {
                config.type = $(this).val()
                pageId = 0
                loadFiles()
            })
            $modal.on('input propertychange', '[filter-keyword]', function () {
                let query = $(this).val()
                if (timeTool) {
                    window.clearTimeout(timeTool);
                }
                timeTool = setTimeout(function () {
                    params.query = query
                    pageId = 0
                    loadFiles()
                }, 1000)
            })
        }

        // 渲染文件
        let renderFiles = function (data) {
            let html = '';
            fileData = {}
            $.each(data, function (key, item) {
                fileData[item.file_id] = item
                html += `<li>
                            <div class="item mb-1 mt-1 rounded p-2 text-gray-800 select-none cursor-pointer" data-id="${item.file_id}">
                                <div class="h-20 rounded bg-cover bg-center bg-no-repeat rounded" style="background-image: url('${item.cover}')"></div>
                                <div class="mt-1">
                                    <div class="truncate ">${item.title}</div>
                                    <div class="text-xs text-gray-500">${item.time}</div>
                                    <div class="text-xs text-gray-500">${item.size}</div>
                                </div>
                            </div>
                        </li>`
            })
            if (data.length) {
                $modal.find('.files-list').html(html)
                $modal.find('.files-list').removeClass('hidden')
                $modal.find('.pagination').removeClass('hidden')
                $modal.find('.files-none').addClass('hidden')
            } else {
                $modal.find('.files-list').html('');
                $modal.find('.files-list').addClass('hidden')
                $modal.find('.pagination').addClass('hidden')
                $modal.find('.files-none').removeClass('hidden')
            }
            $modal.find('[data-submit]').attr('disabled', true)
            $modal.find('[file-delete]').addClass('hidden')
        }

        // 文件加载
        let loadFiles = function () {
            app.ajax({
                url: config.url,
                params: $.extend({}, params, {
                    id: dirId,
                    page: pageId,
                    filter: config.type,
                    type: 'files'
                }),
                type: 'get',
                notify: false
            }).then(data => {
                let currentPage = 1;
                if ($pagination) {
                    currentPage = $modal.find('[pagination]').twbsPagination('getCurrentPage')
                    $modal.find('[pagination]').twbsPagination('destroy')
                }
                $pagination = true
                $modal.find('[pagination]').twbsPagination($.extend({}, pageConfig, {
                    startPage: currentPage,
                    totalPages: data.result.total
                })).on('page', function (evt, page) {
                    pageId = page
                    loadFiles()
                });
                renderFiles(data.result.data)
            }).catch(error => {
                app.error(error.message)
            })
        }

        // 初始数据加载
        let initData = function () {
            app.ajax({
                url: config.url,
                params: {
                    type: 'folder'
                },
                type: 'get',
                notify: false
            }).then(data => {
                let render = function (item) {
                    let html = '';
                    html += `<li class="py-3 px-4 cursor-pointer hover:bg-gray-200" data-id="${item.dir_id}">`;
                    html += item.name;
                    html += `</li>`;
                    return html;
                }
                let html = '<ul>';
                $.each(data.result, (key, item) => {
                    html += render(item)
                })
                html += `</ul>`;
                $modal.find('.filemanage-sidebar').html(html)
                $modal.find('.filemanage-sidebar').find('li:eq(0)').click()
            }).catch(error => {
                app.error(error.message)
            })
        }

        // 弹窗启动
        let start = function () {
            owner.upload($modal.find('[file-upload]'), {
                url: config.uploadUrl,
                image: config.image,
                params: function () {
                    return {
                        id: dirId
                    }
                },
                callback: function (data) {
                    loadFiles()
                }
            })

            folder()
            files()
            filter()
            initData()

            dialog.modal($modal, 'max-w-4xl');
        }

        Do('page', () => {
            start()
        })
    }

}(jQuery, window.file = {}));

