(function ($, owner) {

    owner.prompt = function (config) {
        let defaultConfig = {
            title: '请输入内容',
            content: '',
            callback: null,
        };
        config = $.extend(defaultConfig, config);
        let html = `<div><div class="p-4">
                        <div class="">${config.title}</div>
                        <div class="mt-2 ">
                            <input type="text" class="form-input" value="${config.content}">
                        </div>
                      </div>
                        <div class="flex justify-end space-x-2 bg-gray-50 px-4 py-3">
                            <button type="button" class="btn" modal-close>
                              取消
                            </button>
                            <button type="button" class="btn-blue" modal-confirm>
                              确定
                            </button>
                        </div>
                        </div>
                    `
        owner.modal(html, 'max-w-lg', function (object) {
            object.find('input[type="text"]').focus()
            object.on('click', '[modal-confirm]', function () {
                let value = object.find('input[type="text"]').val()
                base.callback(config.callback, value)
                object.trigger('close')
            })
        })


    }

    /**
     * 提示对话框
     * @param config
     */
    owner.alert = function (config) {
        let defaultConfig = {
            title: '提示',
            content: '',
            callback: null,
            type: 'success'
        };
        config = $.extend(defaultConfig, config);

        let html = `
                <div>
                    <div class="flex items-start p-4">
                        <div class=" flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-green-200 mx-0 h-10 w-10">
                            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-green-900" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                            </svg>
                        </div>
                        <div class="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                          <div class="text-lg leading-6 font-medium text-gray-900" id="modal-title">
                            ${config.title}
                          </div>
                          <div class="mt-2">
                            <p class="text-sm text-gray-500">
                              ${config.content}
                            </p>
                          </div>
                        </div>
                      </div>
                      <div class="flex justify-end space-x-2 bg-gray-50 px-4 py-3">
                            <button type="button" class="btn-blue">
                              确定
                            </button>
                        </div>
                </div>
        `
        let $modal = owner.modal(html, 'max-w-lg')
        $modal.on('click', 'button', function () {
            base.callback(config.callback)
        })
    };
    /**
     * 确认对话框
     * @param config
     */
    owner.confirm = function (config) {
        let defaultConfig = {
            title: '确认操作',
            content: '',
            success: null,
            cancel: null
        };
        config = $.extend(defaultConfig, config);
        let html = `
                <div>
                    <div class="flex items-start p-6 ">
                        <div class=" flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-yellow-200 mx-0 h-10 w-10">
                          <svg class="h-6 w-6 text-yellow-900"  xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path>
                        </svg>
                        </div>
                        <div class="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                          <div class="text-lg leading-6 font-medium text-gray-900" id="modal-title">
                            ${config.title}
                          </div>
                          <div class="mt-2">
                            <p class="text-sm text-gray-500">
                              ${config.content}
                            </p>
                          </div>
                        </div>
                      </div>
                      <div class="flex justify-end space-x-2 px-5 pb-5">
                            <button type="button" class="btn" modal-close>
                              取消
                            </button>
                            <button type="button" class="btn-blue" modal-confirm>
                              确定
                            </button>
                        </div>
                </div>
        `
        let $modal = owner.modal(html, 'max-w-lg')
        $modal.on('click', '[modal-close]', function () {
            base.callback(config.cancel)
        })
        $modal.on('click', '[modal-confirm]', function () {
            base.callback(config.success)
            $modal.trigger('close')
        })
    };

    /*
     * AJAX 询问
     */
    owner.ajax = function ($el, config) {
        let defaultConfig = {};
        config = $.extend(defaultConfig, config);
        let show = function () {
            owner.confirm({
                content: config.title,
                success: function () {
                    app.ajax({
                        url: config.url,
                        type: config.type || 'get',
                        data: config.params,
                        notify: false,
                    }).then(data => {
                        if (!(data.response instanceof Object)) {
                            notify.error(data.message, 3)
                            return;
                        }
                        window.location.reload()
                    }).catch(err => {
                        notify.msg(err.message)
                    });
                }
            });
        }
        if ($el) {
            $($el).on('click', function () {
                show();
            });
        } else {
            show();
        }
    };

    /**
     * 模态窗口
     * @param $el
     * @param config
     */
    owner.open = function ($el, config) {
        let defaultConfig = {
            title: '',
            url: '',
            size: 'default',
            height: '400px',
            type: 'ajax',
            expend: {},
            layout: true,
            callback: null,
            hideCallback: null,
        };
        config = $.extend(defaultConfig, config);

        let show = function (html) {
            if (config.layout) {
                owner.layout({
                    title: config.title,
                    size: config.size,
                    html: html,
                    expend: config.expend,
                    callback: config.callback,
                    hideCallback: config.hideCallback
                });
            } else {
                let size = 'max-w-xl';
                if (config.size == 'small') {
                    size = 'max-w-lg';
                }
                if (config.size == 'medium') {
                    size = 'max-w-2xl';
                }
                if (config.size == 'large') {
                    size = 'max-w-4xl';
                }
                owner.modal($(html), size, config.callback, config.hideCallback, config.expend)
            }
        };

        let open = function () {
            if (config.type == 'iframe') {
                show('<iframe src="' + config.url + '" width="100%" height="' + config.height + '" frameborder="0"></iframe>');
            }
            if (config.type == 'ajax') {
                notify.loading('加载中，请稍等...');
                app.ajax({
                    url: config.url,
                    notify: false,
                }).then((data) => {
                    notify.loading.close();
                    show(data.response);
                }).catch((error) => {
                    app.error(error.message)
                });
            }
        };
        if ($el) {
            $($el).on('click', function () {
                open();
            });
        } else {
            open();
        }
    };

    owner.layout = function (config) {
        let defaultConfig = {
            title: '',
            size: 'default',
            html: '',
            callback: null,
            hideCallback: null,
            expend: {}
        };
        config = $.extend(defaultConfig, config);

        let size = 'max-w-xl';
        if (config.size == 'small') {
            size = 'max-w-lg';
        }
        if (config.size == 'medium') {
            size = 'max-w-2xl';
        }
        if (config.size == 'large') {
            size = 'max-w-4xl';
        }

        let html = `<div>
                <div class="flex items-center p-4 border-b border-gray-300">
                    <div class="flex-grow text-xl">${config.title}</div>
                    <div class="cursor-pointer btn-close h-6 w-6 text-gray-600 hover:text-red-900" modal-close>
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </div>
                </div>
            </div>
        `
        let $html = $(html)
        $html.append(config.html)
        owner.modal($html, size, config.callback, config.hideCallback, config.expend)

    }

    owner.modal = function (html, className, create, dispose, expend) {
        let loadJs = function (data) {
            if (!data) {
                return;
            }
            let regDetectJs = /<script(.|\n)*?>(.|\n|\r\n)*?<\/script>/ig;
            let jsContained = data.match(regDetectJs);
            if (jsContained) {
                let regGetJS = /<script(.|\n)*?>((.|\n|\r\n)*)?<\/script>/im;
                let jsNums = jsContained.length;
                for (let i = 0; i < jsNums; i++) {
                    let jsSection = jsContained[i].match(regGetJS);
                    if (jsSection[2]) {
                        window.eval(jsSection[2]);
                    }
                }
            }
        };
        let layout = `<div modal class="fixed z-50 inset-0 overflow-y-auto ease-in-out duration-300 opacity-0" tabindex="-1" style="display: none">
                <div class="flex items-start lg:items-center justify-center min-h-screen text-center  bg-black bg-opacity-50 ">
                    <div class="inline-block align-bottom bg-white border  rounded-lg text-left overflow-hidden shadow-xl align-middle m-3 w-full ${className}">
                        <div class="modal-content">

                        </div>
                    </div>
                </div>
            </div>`;
        let $modal = $(layout);
        $modal.find('.modal-content').append(html)
        $modal.data('expend', expend)

        // 自定义关闭事件
        $modal.on('close', function () {
            $('body').removeClass('overflow-hidden')
            $modal.removeClass('opacity-100');
            setTimeout(() => {
                $modal.remove()
                base.callback(dispose, $modal)
            }, 300);
        })
        // close
        $modal.on('click', '[modal-close]', function () {
            $modal.trigger('close')
        })

        // show
        $('body').append($modal)
        $modal.show().addClass('opacity-100');
        if (!$('body').hasClass('overflow-hidden')) {
            $('body').addClass('overflow-hidden')
        }
        loadJs($(html).html())
        base.callback(create, $modal)

        if (!window['modal']) {
            window['modal'] = []
            $(document).keyup(function (e) {
                var key = e.which || e.keyCode;
                if (key == 27) {
                    let tmp = window['modal'].pop()
                    tmp.trigger('close')
                }
            })
        }
        window['modal'].push($modal);
        return $modal;
    }

}(jQuery, window.dialog = {}));
