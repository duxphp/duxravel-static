(function ($, owner) {

    /**
     * 绑定表单
     * @param $el
     * @param config
     */
    owner.bind = function ($el, config) {
        let defaultConfig = {
            notify: true,
            successNotify: true,
            errorNotify: true,
            jump: true,
            success: null,
            error: null,
            window: false,
        }
        config = $.extend(defaultConfig, config)
        $('form').on('submit', function (e) {
            e.preventDefault();
            e.stopPropagation();
            $($el).find("button").attr("disabled", true);
            if ($(this)[0].checkValidity() === false) {
                $(this).addClass("was-validated");
                $($el).find("button").attr("disabled", false);
                return false;
            }
            $(this).removeClass("was-validated");
            let formData = new FormData(this);
            let jumpUrl = (url) => {
                if (config.window) {
                    window.open(url);
                } else {
                    window.location.href = url
                }
            }
            app.ajax({
                url: $(this).attr('action'),
                type: $(this).attr('method'),
                data: formData,
                notify: false,
            }).then(data => {
                $($el).find("button").attr("disabled", false)
                if (!(data.response instanceof Object)) {
                    notify.error(data.message, 3)
                    return;
                }

                if (config.notify) {
                    if (config.successNotify) {
                        notify.success(data.message, 3)
                        if (data.url && config.jump) {
                            setTimeout(function () {
                                jumpUrl(data.url)
                            }, 2000)
                        }
                    } else {
                        if (data.url && config.jump) {
                            jumpUrl(data.url)
                        } else {
                            window.location.reload()
                        }
                    }

                }
                if (config.success) {
                    base.callback(config.success, data.message, data.result, data.url)
                }
            }).catch((error) => {
                $($el).find("button").attr("disabled", false)
                if (config.notify) {
                    if (config.errorNotify) {
                        notify.error(error.message, 3)
                        if (error.url && config.jump) {
                            setTimeout(function () {
                                jumpUrl(error.url)
                            }, 2000)
                        }
                    } else {
                        if (error.url && config.jump) {
                            jumpUrl(error.url)
                        } else {
                            window.location.reload()
                        }
                    }
                }
                if (config.error) {
                    base.callback(config.error, error.msg, error.url, error.code, error.response);
                    return false;
                }
            })
        })
    };

    /**
     * ajax切换组件
     * @param $el
     * @param config
     */
    owner.switch = function ($el, config) {
        let defaultConfig = {
            params: {},
            field: '',
            url: ''
        }
        config = $.extend(defaultConfig, config)
        $($el).on('change', function () {
            let status = 0;
            let cur = $($el).prop('checked');
            if (cur) {
                status = 1;
            }
            $($el).attr("disabled", true);
            config.params.status = status
            config.params.field = config.field
            app.ajax({
                url: config.url,
                type: 'post',
                data: config.params,
                notify: false,
            }).then(data => {
                $($el).attr("disabled", false)
            }).catch(error => {
                $($el).attr("disabled", false)
                app.error(error.message)
            });
        });

    }

    owner.input = function ($el, config) {
        let defaultConfig = {
            params: {},
            field: '',
            url: ''
        }
        config = $.extend(defaultConfig, config)
        $($el).on('blur', function () {
            let value = $(this).val();
            $($el).attr("disabled", true);
            config.params.value = value
            config.params.field = config.field
            app.ajax({
                url: config.url,
                type: 'post',
                data: config.params,
                notify: false,
            }).then(data => {
                notify.success(data.message)
                $($el).attr("disabled", false)
            }).catch(error => {
                app.error(error.message)
                $($el).attr("disabled", false)
            });
        });

    }

    /**
     * 下拉选择
     * @param $el
     * @param config
     */
    owner.select = function ($el, config) {
        let defaultConfig = {
            search: '',
            linkage: '',
        }
        config = $.extend(defaultConfig, config)
        Do('select', function () {
            let selectConfig = {
                language: "zh-CN",
                width: '100%',
                tags: config.tags,
                allowClear: config.clear,
                minimumResultsForSearch: -1,
            };

            // 搜索配置
            if (config.search) {
                selectConfig.minimumResultsForSearch = 0;
                selectConfig.ajax = {
                    url: config.search,
                    dataType: 'json',
                    delay: 250,
                    data: function (params) {
                        return {
                            query: params.term,
                            limit: 20,
                            parent: $($el).data('parent'),
                            level: $($el).data('level'),
                            type: config.level || config.linkage ? 'linkage' : 'search',
                            page: params.page || 1
                        };
                    },
                    processResults: function (data, params) {
                        let results = data.data;
                        params.page = params.page || 1;
                        return {
                            results: results.data,
                            pagination: {
                                more: (params.page * 20) < results.total
                            }
                        };
                    },
                    cache: false
                }
                selectConfig.escapeMarkup = function (markup) {
                    return markup;
                }
                selectConfig.templateResult = function (repo) {
                    if (!repo.id) {
                        return repo.name;
                    }
                    var markup = "<div class='flex items-center'>";
                    if (repo.image) {
                        markup += `<div class="avatar avatar-sm mr-2" style='background-image: url("${repo.image}")'></div>`;
                    }
                    markup += "<div class='flex-grow'><div class=''>" + repo.name + "</div>";
                    if (repo.desc) {
                        markup += "<div class='text-muted'>" + repo.desc + "</div>";
                    }
                    markup += "</div></div>";
                    return $(markup);
                }
                selectConfig.templateSelection = function (repo) {
                    if (repo.id === '') {
                        return config.placeholder;
                    }
                    return repo.name || repo.text;
                }
            }

            let $select = $($el).select2(selectConfig);

            // 默认选项触发
            if (config.search && config.value) {
                selectConfig.minimumResultsForSearch = 0;
                app.ajax({
                    url: config.search,
                    params: {
                        id: config.value,
                        level: $($el).data('level'),
                        type: config.level || config.linkage ? 'linkage' : 'search',
                    },
                    notify: false
                }).then(data => {
                    let results = data.result.data;
                    results.map(item => {
                        let option = new Option(item.name, item.id || item.name, true, true);
                        $select.append(option);
                    })
                    $select.trigger('init')
                }).catch(error => {
                    app.error(error.message)
                })
            }

            // 联动菜单
            if (config.linkage) {
                $($el).on('change', function () {
                    let $linkage = $('select[name="' + config.linkage + '"]')
                    $linkage.data('parent', $($el).val())
                    $linkage.empty()
                    $linkage.trigger('change')
                });
                $($el).on('init', function () {
                    let $linkage = $('select[name="' + config.linkage + '"]')
                    $linkage.data('parent', $($el).val())
                });
            }
        })
    }

    /**
     * 密码显示
     * @param $el
     * @param config
     */
    owner.password = function ($el, config) {
        let defaultConfig = {}
        config = $.extend(defaultConfig, config)
        Do('password', function () {
            $($el).password({
                eyeClass: 'fa',
                eyeOpenClass: 'fa-eye',
                eyeCloseClass: 'fa-eye-slash',
            });
        });
    }

    /**
     * 输入遮罩
     * @param $el
     * @param config
     */
    owner.mask = function ($el, config) {
        let defaultConfig = {}
        config = $.extend(defaultConfig, config)
        Do('inputmask', function () {
            $($el).inputmask({
                'autoUnmask': true
            });
        });
    }

    /**
     * 日期时间
     * @param $el
     * @param config
     */
    owner.date = function ($el, config) {
        Do('date', function () {
            let defaultConfig = {
                type: 'date'
            }
            config = $.extend(defaultConfig, config)

            let flatpickr = {
                locale: 'zh',
                dateFormat: 'Y-m-d',
            }

            if (config.type == 'time') {
                flatpickr.dateFormat = 'H:i:S';
                flatpickr.enableTime = true;
                flatpickr.enableSeconds = true;
                flatpickr.noCalendar = true;
                flatpickr.time_24hr = true;
            }
            if (config.type == 'datetime') {
                flatpickr.dateFormat = 'Y-m-d H:i:S';
                flatpickr.enableTime = true;
                flatpickr.enableSeconds = true;
                flatpickr.time_24hr = true;
            }
            if (config.type == 'range') {
                flatpickr.mode = 'range';
            }
            $($el).flatpickr(flatpickr)
        });

    }

    /**
     * 文件选择
     * @param $el
     * @param config
     */
    owner.file = function ($el, config) {
        let defaultConfig = {
            mode: 'manage',
            target: '',
            callback: function (data) {
                let $text = config.target ? $(config.target) : $($el).parents('.form-input-group').find('input[type="text"]')
                $text.val(data[0].url)
            }
        }
        config = $.extend(defaultConfig, config)
        if (config.mode == 'upload') {
            config.loading = true;
            file.upload($el, config)
        }
        if (config.mode == 'manage') {
            $($el).on('click', function () {
                config.multiple = false
                config.type = 'all'
                file.manage(config)
            })
        }
    }

    /**
     * 图片上传
     * @param $el
     * @param config
     */
    owner.image = function ($el, config) {
        let defaultConfig = {
            mode: 'manage',
            callback: function (data) {
                $($el).find('img').attr('src', data[0].url)
                $($el).css('background-image', `url('${data[0].url}')`)
                $($el).find('input[type="hidden"]').val(data[0].url)
                $($el).find('input[type="hidden"]').change()
            }
        }
        config = $.extend(defaultConfig, config)
        if (config.mode == 'upload') {
            config.loading = false;
            file.upload($el, config)
        }
        if (config.mode == 'manage') {
            $($el).on('click', function () {
                config.multiple = false
                config.type = 'image'
                file.manage(config)
            })
        }
        $($el).on('click', '[data-url]', function (e) {
            e.stopPropagation()
            dialog.prompt({
                title: '请输入图片链接',
                callback: function (url) {
                    $($el).find('img').attr('src', url)
                    $($el).css('background-image', `url('${url}')`)
                    $($el).find('input[type="hidden"]').val(url)
                    $($el).find('input[type="hidden"]').change()
                }
            })
        })
    }

    /**
     * 组图上传
     * @param $el
     * @param config
     */
    owner.images = function ($el, config) {
        let defaultConfig = {
            mode: 'manage'
        }
        config = $.extend(defaultConfig, config)

        config.callback = function (data) {
            let html = ''
            $(data).each((key, value) => {
                html += `<div class="relative w-32 h-32 border-2 border-gray-400 border-dashed rounded bg-cover bg-center bg-no-repeat block hover:border-blue-900" style="background-size:90%; background-image:url('${value.url}')" data-item>
                            <div class="opacity-0 hover:opacity-100 absolute flex items-center justify-center w-full h-full bg-blue-200 bg-opacity-90 rounded cursor-pointer">
                                <button type="button" class="btn-red" data-del>删除</button>
                            </div>
                            <input type="hidden" name="${config.name}[]" value="${value.url}">
                        </div>`;
            })
            $($el).find('[data-plus]').before(html)
        }

        $($el).on('click', '[data-del]', function () {
            $(this).parents('[data-item]').remove()
        });

        if (config.mode == 'upload') {
            config.loading = false;
            file.upload($($el).find('[data-plus]'), config)
        }

        if (config.mode == 'manage') {
            $($el).on('click', '[data-plus]', function () {
                config.multiple = true
                config.type = 'image'
                file.manage(config)
            })
        }

    }

    /**
     * 编辑器
     * @param $el
     * @param config
     */
    owner.editor = function ($el, config) {
        let defaultConfig = {
            uploadUrl: '/admin/upload',
            attrUrl: '/admin/fileManage'
        };
        config = $.extend(defaultConfig, config);

        let configMce = {
            skin: 'dux',
            content_css: 'dux',
            height: 650,
            language: 'zh_CN',
            plugins: 'print preview searchreplace autolink directionality visualblocks visualchars image link media template code codesample table charmap hr pagebreak nonbreaking insertdatetime advlist lists wordcount imagetools textpattern help emoticons',
            toolbar: [
                ' code preview print | formatselect fontsizeselect lineheight | forecolor backcolor bold italic underline strikethrough  subscript superscript  removeformat | ',
                'alignleft aligncenter alignright alignjustify outdent indent | bullist numlist | pagebreak hr link table  |  image media  filemanage  codesample charmap emoticons'
            ],
            menubar: false,
            min_height: 500,
            fontsize_formats: '12px 14px 16px 18px 24px 36px 48px 56px 72px',
            relative_urls: false,
            setup: function (editor) {

                editor.ui.registry.getAll().icons.filemanage || editor.ui.registry.addIcon('filemanage', '<svg t="1620982539724" class="icon" viewBox="0 0 1204 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="2147" width="22" height="22"><path d="M0.002 541.857c0-124.482 85.64-233.86 200.042-266.246C263.379 115.14 420.248 0 603.747 0c184.938 0 337.488 115.143 400.801 275.61 118.024 33.104 200.053 141.048 200.053 266.248 0 153.998-124.495 279.245-282.07 279.245-29.503 0-56.136-26.62-56.136-56.112 0-33.832 26.62-56.136 56.137-56.136 94.979 0 170.573-74.11 170.573-166.939 0-49.653-22.351-95.71-59.007-125.211l-10.07-9.41c-2.882-3.6-7.2-6.47-12.94-10.07-2.894-3.613-9.41-3.613-12.94-6.483h-3.6c-2.882-3.6-6.482-3.6-9.41-6.47h-3.6c-2.883 0-6.482-3.61-10.082-3.61-2.882 0-6.47 0-6.47-2.87h-9.41c-3.6 0-6.47 0-10.082-3.6h-26.562c-2.882-10.788-6.482-18.705-6.482-29.504-2.87 0-2.87-3.588-2.87-6.47-3.588-6.482-3.588-12.94-6.47-19.434 0-3.6-3.612-3.6-3.612-7.188-2.87-6.47-6.47-12.94-10.058-19.421v-6.482c-2.894-6.47-9.41-12.94-12.94-19.434-55.396-92.156-157.609-154.716-272.764-154.716-118.012 0-220.181 62.56-275.587 154.716l-9.41 19.434c0 2.164-1.448 2.164-2.154 4.317l-1.447 2.165-10.081 19.42v7.2l-9.34 19.435v6.446c-3.612 10.8-7.2 18.716-7.2 29.503H259.05c-2.87 3.6-6.47 3.6-9.34 3.6h-6.494c-2.87 2.164-4.306 2.87-5.035 2.87a1.341 1.341 0 0 1-2.153 0c-2.87 0-6.482 3.61-9.41 3.61h-6.47c-3.611 2.883-6.482 2.883-10.082 6.47h-3.587c-2.87 2.87-6.482 2.87-9.411 6.483h-3.6c-2.87 3.6-6.46 6.47-10.07 10.07-6.47 2.87-9.34 6.482-12.94 9.41-36.69 29.504-55.396 75.56-55.396 125.212 0 92.828 75.559 166.94 166.94 166.94 33.83 0 59.018 22.35 59.018 56.136 0 29.503-25.187 56.112-59.02 56.112C128.098 821.103 0.002 695.856 0.002 541.857zM377.792 728.9c0-16.552 6.47-28.786 12.94-39.573L561.293 502.31c10.8-10.788 25.88-16.552 42.467-16.552s29.504 5.764 43.173 16.552l166.938 187.04a54.972 54.972 0 0 1 16.551 39.573c0 29.503-25.186 55.42-59.006 55.42-16.55 0-28.786-8.636-39.585-19.423l-71.947-78.453v282.105c0 33.82-25.185 55.419-56.136 55.419-32.373 0-55.419-21.586-55.419-55.42V686.504l-71.9 78.44c-10.785 10.788-26.62 19.422-43.16 19.422-29.561 0-55.477-25.915-55.477-55.407z" p-id="2148"></path></svg>');

                editor.ui.registry.addButton('filemanage', {
                    icon: 'filemanage',
                    tooltip: '文件管理器',
                    onAction: function () {
                        file.manage({
                            url: config.attrUrl,
                            uploadUrl: config.uploadUrl,
                            //'/admin/uploadRemote'
                            multiple: true,
                            callback: function (list) {
                                list.map(info => {
                                    let node
                                    switch (info.ext) {
                                        case 'png':
                                        case 'jpg':
                                        case 'jpeg':
                                        case 'bmp':
                                        case 'gif':
                                            node = "<div><img src='" + info.url + "' alt='" + info.title + "' /></div>"
                                            break;
                                        case 'mp4':
                                        case 'ogm':
                                        case 'ogv':
                                        case 'webm':
                                            node = "<div><video controls src='" + info.url + "'></video></div>"
                                            break;
                                        case 'mp3':
                                        case 'ogg':
                                        case 'wav':
                                        case 'acc':
                                            node = "<div><audio controls src='" + info.url + "'></audio></div>"
                                            break;
                                        default:
                                            node = "<div><a href='" + info.url + "' target='_blank'>" + info.title + "</a></div>"
                                    }
                                    editor.insertContent(node)
                                })
                            }
                        });
                    }
                });
                editor.on('change', function () {
                    editor.save();
                    $($el).change();
                });
            },
            toolbar_mode: 'wrap',
            images_upload_handler: function (blobInfo, success, failure) {
                var xhr, formData;

                xhr = new XMLHttpRequest();
                xhr.withCredentials = false;
                xhr.open('POST', config.uploadUrl);

                xhr.onload = function () {
                    let json;
                    if (xhr.status !== 200) {
                        failure('HTTP Error: ' + xhr.status);
                        return;
                    }
                    json = JSON.parse(xhr.responseText);
                    if (!json || !json.data.length) {
                        failure('Invalid JSON: ' + xhr.responseText);
                        return;
                    }
                    json.data.map(info => {
                        success(info.url)
                    })
                };
                formData = new FormData();
                formData.append('file', blobInfo.blob(), blobInfo.filename());
                let token = document.head.querySelector('meta[name="csrf-token"]')
                xhr.setRequestHeader('Accept','application/json');
                xhr.setRequestHeader('X-CSRF-TOKEN', token.content);
                xhr.send(formData);
            },

            file_picker_callback: function (callback, value, meta) {
                var type = 'all';
                if (meta.filetype == 'media') {
                    type = 'video,audio';
                }
                if (meta.filetype == 'image') {
                    type = 'image';
                }
                file.manage({
                    url: config.attrUrl,
                    uploadUrl: config.uploadUrl,
                    multiple: false,
                    type: type,
                    callback: function (list) {
                        list.map(info => {
                            callback(info.url)
                        })
                    }
                });
            },
            file_picker_types: 'file image media',

        };

        Do('tinymce', function () {
            $($el).tinymce(configMce);
        });

    };

    /**
     * 选项切换
     * @param $el
     * @param config
     */
    owner.change = function ($el, config) {
        let defaultConfig = {}
        config = $.extend(defaultConfig, config)

        let run = function () {
            let value = $(this).val()
            let group = $(this).data('group')
            let checked = $(this).prop('checked')
            if ($(this).attr('type') === 'checkbox') {
                // 多选处理
                if (checked) {
                    $('[group-' + group + '=' + value + ']').attr('hidden', false)
                } else {
                    $('[group-' + group + '=' + value + ']').attr('hidden', true)
                }
            } else {
                // 单选处理
                $('[group-' + group + ']').attr('hidden', true)
                $('[group-' + group + '=' + value + ']').attr('hidden', false)

            }
        }

        $($el).on('change', function () {
            run.call(this)
        });

        let init = function () {
            obj = $('[data-js="form-change"]:checked')
            obj.each(function () {
                run.call(this)
            })
        }

        init()
    };


    /**
     * 联级选择框
     * @param $el
     * @param config
     */
    owner.cascader = function ($el, config) {
        let defaultConfig = {
            data: [],
            multiple: false,
            placeholder: '请选择数据',
            url: null,
            checked: [],
            separator: ' / ',
            clearable: true
        }
        config = $.extend(defaultConfig, config)

        // 设置DOM
        if ($($el).attr('multiple')) {
            config.multiple = true
        }
        $($el).find('option').each(function () {
            let id = parseInt($(this).val())
            if (!id) {
                return
            }
            let pid = parseInt($(this).data('pid')) || 0
            if ($(this).prop('selected')) {
                config.checked.push(id)
            }
            config.data.push({id: id, pid: pid, name: $(this).text()})
        })


        let $body = $(`<div class="select-none" x-data="{open: false}" @set-close="open = false">
            <div class="form-select items-center" style="display: flex!important;" :class="{'border-blue-900 ring-1 ring-blue-900': open}" cascader-input>
                <div class="flex-grow  pr-4 ${config.multiple ? 'flex flex-col gap-2' : 'truncate'}"  @click="open = true" data-list><span class="text-gray-500">${config.placeholder}</span></div>
                <div class="flex-none w-4 h-4 text-red-900" hidden cascader-clear><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg></div>
            </div>
        <div x-show="open"
        class="mt-1 lg:absolute z-10 "
        @click.outside="open = false" x-cloak><div class="flex items-stretch bg-white overflow-y-auto shadow rounded border border-gray-400 " cascader-layout></div></div></div>`)
        let $input = $body.find('[cascader-input]')
        let $layout = $body.find('[cascader-layout]')
        $($el).hide()
        $($el).after($body)

        let selectData = config.data
        let selectTree = {}
        let selectTreeMaps = []
        let renderData = []
        let checkedIds = config.checked

        // 获取树形
        function getTree(data, root) {
            function getNode(id) {
                let node = []
                for (let i in data) {
                    if (data[i]['pid'] === id) {
                        data[i]['children'] = getNode(data[i]['id'])
                        node.push(data[i])
                    }
                }
                if (node.length == 0) {
                    return []
                } else {
                    return node
                }
            }

            return getNode(root)
        }

        // 获取上级
        function getParent(list, id) {
            let node = [];

            function getNode(id) {
                for (let i in list) {
                    if (list[i].id === id) {
                        node.push(list[i])
                        getNode(list[i].pid)
                    }
                }
            }

            getNode(id)
            return node.reverse();
        }

        // 初始化数据
        let init = function () {

            // 格式化初始数据
            let treeData = getTree(selectData, 0)

            let formatData = function (data) {
                data.map(item => {
                    let parentData = getParent(selectData, item.id)
                    let parentIds = []
                    let parentNames = []
                    parentData.map(vo => {
                        parentIds.push(vo.id)
                        parentNames.push(vo.name)
                    })
                    item.checked = false
                    item.indeterminate = false
                    item.level = parentData.length
                    item.pathId = parentIds
                    item.pathName = parentNames
                    item.hasChildren = false
                    item.numChildren = 0
                    if (item.children && item.children.length) {
                        item.hasChildren = true
                        item.numChildren = item.children.length
                        formatData(item.children)
                    }
                    delete item.children
                    selectTree[item.id] = item
                    selectTreeMaps.push(item.id)
                })
            }
            formatData(treeData, 0)

            // 设置默认值
            checkedIds.map(id => {
                if (!selectTree[id]) {
                    return false;
                }
                selectTree[id].indeterminate = false
                selectTree[id].checked = true;
                setParent(id)
            })
            // 设置当前菜单
            let groupData = []
            for (let i in selectTree) {
                let item = selectTree[i]
                if (item.pid !== 0) {
                    continue
                }
                groupData.push(item)
            }
            renderData.push(groupData)
            // 设置清除选项
            if (checkedIds.length) {
                $body.find('[cascader-clear]').attr('hidden', false)
            }
            // 渲染界面
            renderMenu()
            renderInput()
        }

        // 渲染菜单
        let renderMenu = function () {
            let menuHtml = ''
            let indeterminate = []
            let sort = function (prop) {
                return function (obj1, obj2) {
                    var val1 = obj1[prop]
                    var val2 = obj2[prop]
                    if (!isNaN(Number(val1)) && !isNaN(Number(val2))) {
                        val1 = Number(val1)
                        val2 = Number(val2)
                    }
                    if (val1 < val2) {
                        return -1
                    } else if (val1 > val2) {
                        return 1
                    } else {
                        return 0
                    }
                }
            }
            // 渲染菜单
            renderData.map((column, key) => {
                menuHtml += `<div cascader-column  style="max-height: 300px;"  class="overflow-auto ${key ? 'border-l border-gray-400' : ''}">`
                column.forEach(item => {
                    item.sortId = selectTreeMaps.indexOf(item.id)
                })
                column = column.sort(sort('sortId'))
                column.map(item => {
                    let input = `<input class="mr-2 form-checkbox" value="${item.id}" ${item.checked ? 'checked' : ''} type="checkbox">`
                    menuHtml += `<div cascader-item="${item.id}" class="cursor-pointer flex items-center py-2 px-4 w-44 hover:bg-gray-200 ${!config.multiple && (item.checked || item.indeterminate) ? 'text-blue-900' : ''}">${config.multiple ? input : ''}${item.name}</div>`
                    if (item.indeterminate && !item.checked) {
                        indeterminate.push(item.id)
                    }
                })
                menuHtml += '</div>'
            })
            let $menuHtml = $(menuHtml)
            // 设置半选
            indeterminate.map(id => {
                $menuHtml.find('[cascader-item="' + id + '"]').find('input').prop('indeterminate', true)
            })
            $layout.html($menuHtml)
        }

        // 渲染输入框
        let renderInput = function () {
            let inputHtml = ''
            $($el).find('option:selected').prop('selected', false)
            checkedIds.map(i => {
                let item = selectTree[i]
                inputHtml += `<span class="">${item.pathName.join(' / ')}</span>`
                $($el).find('option[value="' + i + '"]').prop('selected', true)
            })
            $input.find('[data-list]').html(inputHtml ? inputHtml : `<span class="text-gray-500">${config.placeholder}</span>`)

            if (checkedIds.length) {
                $body.find('[cascader-clear]').attr('hidden', false)
            } else {
                $body.find('[cascader-clear]').attr('hidden', true)
            }
        }

        // 设置父级状态
        let setParent = function (id, indeterminate) {
            indeterminate = !!indeterminate
            let info = selectTree[id]
            let pid = info.pid
            if (!pid) {
                // 根分类跳过
                return;
            }
            // 查询同级分类
            let same = 0
            let semi = 0
            for (let i in selectTree) {
                // 选中数量
                if (selectTree[i].pid === pid && selectTree[i].checked) {
                    same++
                }
                // 半选数量
                if (selectTree[i].pid === pid && selectTree[i].indeterminate) {
                    semi++
                }
            }
            // 设置全选
            selectTree[pid].checked = false
            if (selectTree[pid].numChildren === same) {
                selectTree[pid].checked = true
            }
            if (!indeterminate && (same || semi)) {
                indeterminate = true
            }
            // 设置半选
            selectTree[pid].indeterminate = indeterminate
            setParent(pid, indeterminate)
        }

        // 去除所有状态
        let restStatus = function () {
            for (let i in selectTree) {
                let item = selectTree[i]
                if (item.checked) {
                    selectTree[i].checked = false
                }
                if (item.indeterminate) {
                    selectTree[i].indeterminate = false
                }
            }
        }

        // 清除选择
        $body.on('click', '[cascader-clear]', function (e) {
            e.stopPropagation()
            restStatus()
            checkedIds = []
            let groupData = []
            for (let i in selectTree) {
                let item = selectTree[i]
                if (item.pid !== 0) {
                    continue
                }
                groupData.push(item)
            }
            renderData = []
            renderData.push(groupData)
            renderInput()
            renderMenu()
            $body[0].dispatchEvent(new Event('set-close'))
        })

        // 菜单选择
        $layout.on('click', '[cascader-item]', function (e) {
            e.stopPropagation()
            let id = parseInt($(this).attr('cascader-item'))
            let info = selectTree[id]
            let groupData = []
            if (info.hasChildren === true) {
                // 菜单展开
                for (let i in selectTree) {
                    let item = selectTree[i]
                    if (item.pid !== id) {
                        continue
                    }
                    groupData.push(item);
                }
            }
            if (!config.multiple) {
                // 单选
                // 重置数据
                restStatus()
                // 重新设置状态
                checkedIds = [id]
                selectTree[id].checked = true
                setParent(id)
                renderInput()
                // 选择隐藏
                if (info.hasChildren === false) {
                    $body[0].dispatchEvent(new Event('set-close'))
                }
            }
            renderData.splice(info.level)
            if (groupData.length) {
                renderData.push(groupData)
            }
            renderMenu()
        })

        // 多选绑定
        if (config.multiple) {
            $layout.on('click', 'input[type="checkbox"]', function (e) {
                let id = parseInt($(this).val())
                let checked = $(this).prop('checked')
                // 当前状态
                selectTree[id].indeterminate = false
                selectTree[id].checked = checked;
                // 设置子级数据
                for (let i in selectTree) {
                    let item = selectTree[i]
                    if ($.inArray(id, item.pathId) !== -1) {
                        // 设置子状态
                        selectTree[i].indeterminate = false
                        selectTree[i].checked = checked
                        // 获取选中数据
                        if (item.hasChildren === false) {
                            if (checked) {
                                checkedIds.push(item.id)
                            } else {
                                checkedIds.splice($.inArray(item.id, checkedIds), 1)
                            }
                        }
                    }
                }
                checkedIds = Array.from(new Set(checkedIds))
                // 设置父级数据
                setParent(id)
                // 渲染界面
                renderMenu()
                renderInput()
                return true
            })
        }

        if (config.url) {
            $($el).next().find('.placeholder').text('加载选项中...')
            app.ajax({
                url: config.url,
                notify: false
            }).then(info => {
                selectData = info.result.data
                $($el).next().find('.placeholder').text(config.placeholder)
                init()
            }).catch(err => {
                app.error(err.message)
            })
        } else {
            init()
        }

    }

    /**
     * 列表编辑器
     * @param $el
     * @param config
     */
    owner.list = function ($el, config) {
        let defaultConfig = {
            key: 'list',
            only: null,
            column: [],
            data: [],
            option: true,
            num: 0,
            addCallback: null
        }
        config = $.extend(defaultConfig, config)

        let columnData = config.column
        let listData = config.data
        if (listData && typeof (listData) == 'string') {
            listData = JSON.parse(listData)
        }
        let columnCount = 0
        columnData.map(item => {
            if (item.type !== 'hidden') {
                columnCount++
            }
        })

        /*columnData = [
            {
                name: '仅展示',
                key: 'show',
                type: 'show'
            },
            {
                name: '文本框',
                key: 'text',
                type: 'text'
            },
            {
                name: '数字框',
                key: 'number',
                type: 'number'
            },
            {
                name: '图片',
                key: 'image',
                type: 'image'
            },
        ]*/
        /*listData = [
            {
                'show': 'xxxx',
                'text': 'text22',
            }
        ]*/

        let body = `<div class="overflow-hidden">
                      <table class="table-box border border-gray-300">
                        <thead class="bg-gray-50">
                            <tr>
                            ${columnData.map(item => {
            return item.type !== 'hidden' ? `<th width="${item.width || ''}">${item.name}</th>` : ''
        }).join('')}
                            ${config.option ? `<th width="50">
                                <div class="flex items-center space-x-2">
                                <div>操作</div>
                                    <a href="javascript:;" class="flex items-center" data-add>
                                        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                                        </svg>
                                    </a>
                                </div>
</th>` : ''}
                            </tr>
                        </thead>
                        <tbody></tbody>
                      </table>
                    </div>`

        let $body = $(body)

        let render = () => {
            let html = listData.map((item, key) => {
                return `<tr data-column>
                    ${columnData.map(column => {
                    let value = ''
                    if (item && item[column.key]) {
                        value = item[column.key]
                    }
                    if (column.type === 'show') {
                        return `<td class="text-wrap">${value || '无'}</td>`
                    } else if (column.type === 'image') {
                        return `<td>
                                    <div class="relative w-12 h-12 border-2 border-gray-400 border-dashed rounded bg-cover bg-center bg-no-repeat block hover:border-blue-900" style="background-size:90%; background-image: url('${value || '/service/image/placeholder/80/80/图片'}')" data-js="form-image">
                                        <div class="opacity-0 hover:opacity-100 absolute flex items-center justify-center w-full h-full bg-blue-200 bg-opacity-90 rounded cursor-pointer ">
                                            <div class="text-blue-900 w-6 h-6">
                                                <svg xmlns="http://www.w3.org/2000/svg" class="h-full w-full" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                                                </svg>
                                            </div>
                                            <input name="${config.key}[${key}][${column.key}]" data-key="${column.key}" type="hidden" value="${value}">
                                        </div>
                                    </div>
                               </td>`
                    } else if (column.type === 'price') {
                        return `<td><input class="form-input" style="min-width: 80px" data-key="${column.key}" name="${config.key}[${key}][${column.key}]" type="number" min="0"  step="0.01" value="${value}"></td>`
                    } else if (column.type === 'number') {
                        return `<td><input class="form-input" style="min-width: 80px" data-key="${column.key}" name="${config.key}[${key}][${column.key}]" type="number" min="0" step="1" value="${value}"></td>`
                    } else if (column.type === 'hidden') {
                        return `<input name="${config.key}[${key}][${column.key}]" type="hidden" value="${value}">`
                    } else {
                        return `<td><input class="form-input" style="min-width: 80px" data-key="${column.key}" name="${config.key}[${key}][${column.key}]" type="text" value="${value}"></td>`
                    }
                }).join('')}
                ${config.option ? `<td><a href="javascript:;" class="text-red-900" data-del>删除</a></td>` : ''}
            </tr>`
            }).join('')
            if (!listData.length) {
                html = `<tr><td colspan="${columnCount + (config.option ? 1 : 0)}">${page.data()}</td></tr>`
            }
            $body.find('tbody').html(html)
        }

        // 重建数据
        let resetData = () => {
            let tmpArray = []
            $body.find('tbody tr').each(function () {
                let tmpItem = {}
                $(this).find('[data-key]').each(function () {
                    let key = $(this).data('key')
                    tmpItem[key] = $(this).val() ?? ''
                })
                tmpArray.push(tmpItem)
            })
            listData = tmpArray
        }

        // 增加行
        $body.on('click', '[data-add]', () => {
            if (typeof config.addCallback === 'function') {
                config.addCallback();
            } else {
                if (config.num && listData.length >= config.num) {
                    app.error('添加数量超过限制')
                    return
                }
                listData.push({})
                render()
            }
        })

        // 删除数据
        $body.on('click', '[data-del]', function () {
            let i = $(this).parents('[data-column]').index()
            listData.splice(i, 1)
            render()
        })

        // 修改数据
        $body.on('change', 'input', function () {
            resetData()
        })

        // 外部接口
        let $object = {}

        // 获取数据
        $object.getListData = () => {
            return listData
        }
        // 增加数据
        $object.pushListData = (data) => {
            let keys = []
            if (config.only) {
                keys = listData.map(item => item[config.only]);
            }
            let error = false
            data.map(item => {
                if (keys.length && keys.includes(item[config.only])) {
                    return false
                }
                if (config.num && listData.length >= config.num) {
                    error = true
                    return false
                }
                let tmpArr = {}
                columnData.map(column => {
                    tmpArr[column.key] = item[column.key] || ''
                })
                listData.push(tmpArr)
            })
            if (error) {
                app.error('添加数量超过限制')
            }
        }
        $object.render = render

        // 初始化
        function init() {
            render()
            $($el).html($body)
        }

        init()
        return $object;
    }

    /**
     * 数据选择器
     * @param $el
     * @param config
     */
    owner.choice = function ($el, config) {
        let defaultConfig = {
            key: 'list',
            only: null,
            data: [],
            column: [],
            ajaxUrl: '',
            option: true,
            num: 0,
            ajaxColumn: []
        }
        config = $.extend(defaultConfig, config)

        let ajaxColumn = config.ajaxColumn
        let listData = config.data
        let columnData = config.column
        if (listData && typeof (listData) == 'string') {
            listData = JSON.parse(listData)
        }
        if (ajaxColumn && typeof (ajaxColumn) == 'string') {
            ajaxColumn = JSON.parse(ajaxColumn)
        }
        if (columnData && typeof (columnData) == 'string') {
            columnData = JSON.parse(columnData)
        }
        columnData.push({name: '主键', key: config.only, type: 'hidden'})

        // 渲染弹窗数据
        let modal = `<div class=" bg-light">
                <div class="modal-body pb-0">
                <div class="mb-3">
                    <div class="row">
                        <div class="col-auto">
                            <input class="form-input" type="text" data-keyword name="keyword" value="" placeholder="请输入关键词搜索">
                        </div>
                        <div class="col-auto">
                            <button class="btn btn-primary" data-search>搜索</button>
                        </div>
                    </div>
                </div>
                <table class="table-box border border-gray-300 border border-gray-300">
                <thead>
                    <tr>
                        ${ajaxColumn.map(item => {
            return `<th>${item.name}</th>`
        }).join('')}
                        <th width="50"><input data-all type="checkbox" class="form-checkbox"></th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td colspan="${ajaxColumn.length + 1}">${page.load()}</td>
                    </tr>
                </tbody>
                </table>
                <ul pagination="" class="pagination py-2"></ul>
            </div>
            <div class="modal-footer">
                <button type="button" class="btn me-auto" data-bs-dismiss="modal">取消</button>
                <button type="button" class="btn btn-primary" data-submit disabled data-bs-dismiss="modal">添加</button>
            </div>
            </div>`
        let $modal

        // 渲染数据
        let renderData = (data) => {
            let html = data.map((item, key) => {
                return `<tr>${ajaxColumn.map(column => {
                    let row = ''
                    let value = item[column.key]
                    if (column.type === 'image') {
                        if (value) {
                            row += `<td><span class="avatar w-10 h-10 rounded border border-gray-300" style="width: 40px; height: 40px; background-image: url(${value});"></span></td>`
                        } else {
                            row += `<td><span class="avatar w-10 h-10 rounded border border-gray-300 flex items-center justify-center text-gray-500" style="width: 40px; height: 40px;">暂无</span></td>`
                        }
                    } else {
                        row += `<td>${value}</td>`
                    }
                    return row
                }).join('')}
                    <td width="50"><input type="checkbox" class="form-checkbox" value="${key}"></td>
                    </tr>`
            }).join('')
            if (!html) {
                html = `<tr><td colspan="${ajaxColumn.length + 1}">${page.empty('未找到数据', '暂未找到可选数据，请添加数据后进行', false)}</td></tr>`
            }
            $modal.find('tbody').html(html)
            $modal.find('[data-all]').prop('checked', false)
            $modal.find('[data-submit]').prop('disabled', true)
        }

        // 加载弹窗数据
        let pageId = 1, $pagination = false, pageConfig = {
            first: '首页',
            prev: '上一页',
            next: '下一页',
            last: '尾页',
            totalPages: 1,
            visiblePages: 5,
        }, pageData = []

        let loadData = () => {
            $modal.find('tbody').html(`<tr><td colspan="${ajaxColumn.length + 1}">${page.load()}</td> </tr>`)
            app.ajax({
                url: config.ajaxUrl,
                params: {
                    page: pageId,
                    query: $modal.find('[data-keyword]').val()
                },
                notify: false
            }).then(data => {
                let currentPage = 1;
                let totalPage = data.result ? data.result.totalPage : 1
                if ($pagination) {
                    currentPage = $modal.find('[pagination]').twbsPagination('getCurrentPage')
                    $modal.find('[pagination]').twbsPagination('destroy')
                }
                $pagination = true
                $modal.find('[pagination]').twbsPagination($.extend({}, pageConfig, {
                    startPage: currentPage,
                    totalPages: totalPage
                })).on('page', function (evt, page) {
                    pageId = page
                    loadData()
                });
                pageData = data.result.data
                setTimeout(() => {
                    renderData(data.result.data)
                }, 500)
            }).catch(error => {
                renderData([])
            })
        }

        // 启动弹窗
        let openDialog = function () {
            $modal = $(modal)
            Do('page', () => {
                dialog.layout({
                    title: '选择条目',
                    size: 'large',
                    html: $modal,
                    callback: () => {
                        // 全选
                        $modal.on('change', '[data-all]', function () {
                            if ($(this).prop('checked')) {
                                $modal.find('tbody').find('input[type="checkbox"]').prop('checked', true)
                                $modal.find('[data-submit]').prop('disabled', false)
                            } else {
                                $modal.find('tbody').find('input[type="checkbox"]').prop('checked', false)
                                $modal.find('[data-submit]').prop('disabled', true)
                            }
                        })
                        // 单选
                        $modal.on('change', 'tbody input[type="checkbox"]', function () {
                            let count = $modal.find('tbody').find('input[type="checkbox"]').length
                            let checked = $modal.find('tbody').find('input[type="checkbox"]:checked').length
                            if (checked === count) {
                                $modal.find('[data-all]').prop('checked', true)
                            } else {
                                $modal.find('[data-all]').prop('checked', false)
                            }
                            if (checked) {
                                $modal.find('[data-submit]').prop('disabled', false)
                            } else {
                                $modal.find('[data-submit]').prop('disabled', true)
                            }
                        })
                        // 搜索
                        $modal.on('click', '[data-search]', function () {
                            pageId = 1
                            loadData()
                        })
                        // 提交
                        $modal.on('click', '[data-submit]', function () {
                            let data = []
                            $modal.find('tbody').find('input[type="checkbox"]:checked').each(function () {
                                let i = parseInt($(this).val())
                                data.push(pageData[i])
                            })

                            $obj.pushListData(data)
                            $obj.render()
                        })

                        // 初始化
                        loadData()
                    }
                })
            })
        }


        // 初始化
        let $obj
        let init = () => {
            $obj = owner.list($el, {
                key: config.key,
                only: config.only,
                column: columnData,
                addCallback: function () {
                    openDialog()
                }
            })
            // 获取默认数据
            let ids = listData.map(item => item[config.only]).join(',')
            if (ids) {
                app.ajax({
                    url: config.ajaxUrl,
                    params: {
                        [config.only]: ids
                    },
                    notify: false
                }).then(data => {
                    let list = data.result ? data.result.data : []
                    let tmp = {}
                    list.map(item => {
                        tmp[item[config.only]] = item
                    })
                    listData = listData.map(item => {
                        return {...item, ...tmp[item[config.only]] || {}}
                    })
                    $obj.pushListData(listData)
                    $obj.render()
                }).catch(error => {
                })
            }
        }

        init()

    }

    /**
     * 地图选择器
     * @param $el
     * @param config
     */
    owner.map = function ($el, config) {
        let defaultConfig = {
            key: '',
            name: '',
            province: '',
            city: '',
            region: '',
            address: '',
            position: '',
        }
        config = $.extend(defaultConfig, config)
        let callback = 'mapback_' + config.name

        window[callback] = function () {
            let $body = $($el).parents('form')
            let $province = $body.find('select[name="' + config.province + '"]')
            let $city = $body.find('select[name="' + config.city + '"]')
            let $region = $body.find('select[name="' + config.region + '"]')
            let $address = $body.find('input[name="' + config.address + '"]')
            let $position = $body.find('input[name="' + config.position + '"]')

            let position = $position.val()
            position = position.split(',')
            //初始化地图
            let map = new BMap.Map($el, {enableMapClick: false});
            let lat = position[0];
            lat = lat || 39.915;
            let lng = position[1];
            lng = lng || 116.404;
            let point = new BMap.Point(lng, lat);
            map.centerAndZoom(point, 15);
            map.addControl(new BMap.NavigationControl());
            map.enableScrollWheelZoom(true);

            //初始化标注点
            var myIcon = new BMap.Icon("/static/system/img/icon/marker.svg", new BMap.Size(32, 35), {
                anchor: new BMap.Size(16, 35),
            });
            let marker = new BMap.Marker(point, {icon: myIcon});
            map.addOverlay(marker);

            //点击地图处理
            map.addEventListener("click", function (e) {
                notify.loading('搜索地址中...');
                let lng = e.point.lng, lat = e.point.lat;
                let tmpPoint = new BMap.Point(lng, lat);
                marker.setPosition(tmpPoint);
                let myGeo = new BMap.Geocoder();
                myGeo.getLocation(tmpPoint, function (rs) {
                    notify.loading.close();
                    if (rs) {
                        $position.val(lat + ',' + lng);
                    } else {
                        app.error('地址选择错误！');
                    }
                });
            });

            // 输入完成
            let ac = new BMap.Autocomplete(
                {
                    "input": $address[0],
                }
            )
            ac.setInputValue($address.val());

            ac.addEventListener("onconfirm", function (e) {
                let _value = e.item.value;
                myValue = _value.business;
                ac.setInputValue(myValue)
                search()
            });

            $province.on('change', function () {
                search()
            })
            $city.on('change', function () {
                search()
            })
            $region.on('change', function () {
                search()
            })

            let search = function () {
                notify.loading('搜索坐标中...')
                let area = $province.val() + $city.val() + $region.val()
                if (!area) {
                    notify.loading.close();
                    return;
                }
                ac.setLocation($city.val() || $province.val())
                let addr = area + $address.val()

                function myFun() {
                    if (!local.getResults().getPoi(0)) {
                        return;
                    }
                    let point = local.getResults().getPoi(0).point;
                    map.centerAndZoom(point, 16);
                    marker.setPosition(point);
                    $position.val(point.lat + ',' + point.lng);

                }

                let local = new BMap.LocalSearch(map, {
                    onSearchComplete: myFun
                });
                local.search(addr);
                notify.loading.close();
            }

        };

        function loadScript() {
            var script = document.createElement("script");
            script.src = "//api.map.baidu.com/api?v=3.0&ak=" + config.key + "&callback=" + callback;
            document.body.appendChild(script);
        }

        loadScript();
    };

}(jQuery, window.form = {}));
