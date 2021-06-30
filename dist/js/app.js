(function(){var e=document,k=window,c=window.__external_files_loaded=window.__external_files_loaded||{},s=window.__external_files_loading=window.__external_files_loading||{},j=function(u){return u.constructor===Array},h={autoLoad:false,coreLib:[],mods:{}},f=e.getElementsByTagName("script"),d=f[f.length-1],b,g,r=[],m=false,n=[],t=function(w,z,B,v,y){var u=f[0];if(!w){return};if(c[w]){s[w]=false;if(v){v(w,y)};return};if(s[w]){setTimeout(function(){t(w,z,B,v,y)},1);return};s[w]=true;var A,x=z||w.toLowerCase().split(/\./).pop().replace(/[\?#].*/,"");if(x==="js"){A=e.createElement("script");A.setAttribute("type","text/javascript");A.setAttribute("src",w);A.setAttribute("async",true)}else{if(x==="css"){A=e.createElement("link");A.setAttribute("type","text/css");A.setAttribute("rel","stylesheet");A.setAttribute("href",w);c[w]=true}};if(!A){return};if(B){A.charset=B};if(x==="css"){u.parentNode.insertBefore(A,u);if(v){v(w,y)};return};A.onload=A.onreadystatechange=function(){if(!this.readyState||this.readyState==="loaded"||this.readyState==="complete"){c[this.getAttribute("src")]=true;if(v){v(this.getAttribute("src"),y)};A.onload=A.onreadystatechange=null}};u.parentNode.insertBefore(A,u)},q=function(B){if(!B||!j(B)){return};var x=0,A,v=[],z=h.mods,u=[],w={},y=function(F){var E=0,C,D;if(w[F]){return u};w[F]=true;if(z[F].requires){D=z[F].requires;for(;typeof(C=D[E++])!=="undefined";){if(z[C]){y(C);u.push(C)}else{u.push(C)}};return u};return u};for(;typeof(A=B[x++])!=="undefined";){if(z[A]&&z[A].requires&&z[A].requires[0]){u=[];w={};v=v.concat(y(A))};v.push(A)};return v},a=function(){m=true;if(r.length>0){g.apply(this,r);r=[]}},p=function(){if(e.addEventListener){e.removeEventListener("DOMContentLoaded",p,false)}else{if(e.attachEvent){e.detachEvent("onreadystatechange",p)}};a()},o=function(){if(m){return};try{e.documentElement.doScroll("left")}catch(u){return k.setTimeout(o,1)};a()},i=function(){if(e.readyState==="complete"){return k.setTimeout(a,1)};var u=false;if(e.addEventListener){e.addEventListener("DOMContentLoaded",p,false);k.addEventListener("load",a,false)}else{if(e.attachEvent){e.attachEvent("onreadystatechange",p);k.attachEvent("onload",a);try{u=(k.frameElement===null)}catch(v){} if(document.documentElement.doScroll&&u){o()}}}},l=function(u){if(!u||!j(u)){return};this.queue=u;this.current=null};l.prototype={_interval:10,start:function(){var u=this;this.current=this.next();if(!this.current){this.end=true;return};this.run()},run:function(){var w=this,u,v=this.current;if(typeof v==="function"){v();this.start();return}else{if(typeof v==="string"){if(h.mods[v]){u=h.mods[v];t(u.path,u.type,u.charset,function(x){w.start()},w)}else{if(/\.js|\.css/i.test(v)){t(v,"","",function(x,y){y.start()},w)}else{this.start()}}}}},next:function(){return this.queue.shift()}};b=d.getAttribute("data-cfg-autoload");if(typeof b==="string"){h.autoLoad=(b.toLowerCase()==="true")?true:false};b=d.getAttribute("data-cfg-corelib");if(typeof b==="string"){h.coreLib=b.split(",")};g=function(){var v=[].slice.call(arguments),u;if(n.length>0){v=n.concat(v)};if(h.autoLoad){v=h.coreLib.concat(v)};u=new l(q(v));u.start()};g.add=function(v,u){if(!v||!u||!u.path){return};h.mods[v]=u};g.delay=function(){var v=[].slice.call(arguments),u=v.shift();k.setTimeout(function(){g.apply(this,v)},u)};g.global=function(){var u=[].slice.call(arguments);n=n.concat(u)};g.ready=function(){var u=[].slice.call(arguments);if(m){return g.apply(this,u)};r=r.concat(u)};g.css=function(v){var u=e.getElementById("do-inline-css");if(!u){u=e.createElement("style");u.type="text/css";u.id="do-inline-css";e.getElementsByTagName("head")[0].appendChild(u)};if(u.styleSheet){u.styleSheet.cssText=u.styleSheet.cssText+v}else{u.appendChild(e.createTextNode(v))}};if(h.autoLoad){g(h.coreLib)};g.define=g.add;g._config=h;g._mods=h.mods;this.Do=g;i()})();
/**
 * 初始化类库
 */
(function (win, doc) {

    /**
     * 设置全局变量
     * @type {string}
     */
    window.commonPath = '/static/system/js/';

    /**
     * 公共类
     */
    Do.add('common', {
        path: commonPath + 'common.js',
        type: 'js'
    });

    /**
     * toast
     */
    Do.add('toastCss', {
        path: commonPath + 'toast/toast.min.css',
        type: 'css'
    });
    Do.add('toast', {
        path: commonPath + 'toast/toast.min.js',
        type: 'js',
        requires: ['toastCss']
    });

    /**
     * prompt
     */
    Do.add('promptCss', {
        path: commonPath + 'prompt/base.css',
        type: 'css'
    });
    Do.add('prompt', {
        path: commonPath + 'prompt/message.js',
        type: 'js',
        requires: ['promptCss']
    });

    /**
     * modal
     */
    Do.add('modal', {
        path: commonPath + 'modal/bootstrap-show-modal.js',
        type: 'js'
    });

    /**
     * axios
     */
    Do.add('axios', {
        path: 'https://lib.baomitu.com/axios/0.21.0/axios.min.js',
        type: 'js'
    });

    /**
     * 选择
     */
    Do.add('selectCss', {
        path: 'https://lib.baomitu.com/select2/4.1.0-rc.0/css/select2.min.css',
        type: 'css'
    });
    Do.add('selectSrc', {
        path: 'https://lib.baomitu.com/select2/4.1.0-rc.0/js/select2.full.min.js'
    });
    Do.add('select', {
        path: 'https://lib.baomitu.com/select2/4.1.0-rc.0/js/i18n/zh-CN.js',
        requires: ['selectSrc']
    });

    /**
     * 密码
     */
    Do.add('password', {
        path: commonPath + 'password/bootstrap-show-password.min.js',
        type: 'js'
    });

    /**
     * 分页
     */
    Do.add('page', {
        path: commonPath + 'pagination/jquery.twbsPagination.min.js',
        type: 'js'
    });

    /**
     * icon
     */
    Do.add('iconpickerCss', {
        path: commonPath + 'iconpicker/css/bootstrap-iconpicker.css',
        type: 'css'
    });
    Do.add('iconpicker', {
        path: commonPath + 'iconpicker/js/bootstrap-iconpicker.bundle.min.js',
        type: 'js',
        requires: ['iconpickerCss']
    });

    /**
     * 输入验证
     */
    Do.add('inputmask', {
        path: commonPath + 'Inputmask/jquery.inputmask.min.js',
        type: 'js'
    });

    /**
     * 日期
     */
    Do.add('dateSrc', {
        path: 'https://lib.baomitu.com/flatpickr/4.6.6/flatpickr.min.js',
        type: 'js'
    });
    Do.add('dateCss', {
        path: 'https://lib.baomitu.com/flatpickr/4.6.6/flatpickr.css',
        type: 'css'
    });
    Do.add('date', {
        path: 'https://lib.baomitu.com/flatpickr/4.6.6/l10n/zh.min.js',
        type: 'js',
        requires: ['dateCss', 'dateSrc']
    });

    /**
     * 拖动
     */
    Do.add('sortable', {
        path: 'https://lib.baomitu.com/jquery-sortable/0.9.13/jquery-sortable-min.js',
        type: 'js'
    });

    /**
     * 图表
     */
    Do.add('chatCss', {
        path: 'https://lib.baomitu.com/apexcharts/3.22.2/apexcharts.min.css',
        type: 'css'
    });
    Do.add('chart', {
        path: 'https://lib.baomitu.com/apexcharts/3.22.2/apexcharts.min.js',
        type: 'js',
        requires: ['chatCss']
    });


    /**
     * 打印
     */
    Do.add('print', {
        path: 'https://lib.baomitu.com/jQuery.print/1.6.0/jQuery.print.min.js'
    });

    /**
     * 二维码
     */
    Do.add('qrcode', {
        path: 'https://lib.baomitu.com/jquery.qrcode/1.0/jquery.qrcode.min.js',
        type: 'js'
    });

    /**
     * 代码高亮
     */
    Do.add('highlightCss', {
        path: 'https://lib.baomitu.com/highlight.js/9.18.5/styles/dracula.min.css',
        type: 'css'
    });
    Do.add('highlight', {
        path: 'https://lib.baomitu.com/highlight.js/9.18.5/highlight.min.js',
        type: 'js',
        requires: ['highlightCss']
    });

    /**
     * 属性表格
     */
    Do.add('treetableCss', {
        path: commonPath + 'treetable/jquery.treetable.css',
        type: 'css'
    });
    Do.add('treetable', {
        path: commonPath + 'treetable/jquery.treetable.js',
        type: 'js',
        requires: ['treetableCss']
    });

    /**
     * 编辑器
     */
    Do.add('tinymceSrc', {
        path: commonPath + 'tinymce/tinymce.min.js',
    });
    Do.add('tinymce', {
        path: commonPath + 'tinymce/jquery.tinymce.min.js',
        requires: ['tinymceSrc']
    });

    /**
     * cookie
     */
    Do.add('cookie', {
        path: 'https://lib.baomitu.com/cookie.js/1.2.3/cookie.min.js',
        type: 'js',
    });


    /**
     * 编辑器
     */
    Do.add('tooltipHas', {
        path: commonPath + 'tippy/popper.min.js',
        type: 'js',
    });
    Do.add('tooltipCss', {
        path: commonPath + 'tippy/tippy.css',
        type: 'css',
    });
    Do.add('tooltip', {
        path: commonPath + 'tippy/tippy.min.js',
        type: 'js',
        requires: ['tooltipHas', 'tooltipCss']
    });


})(window, document);

/**
 * 页面框架
 */
(function (win) {
    'use strict';
    let listeners = [];
    let doc = win.document;
    let MutationObserver = win.MutationObserver || win.WebKitMutationObserver;
    let observer;

    function ready(selector, fn) {
        listeners.push({
            selector: selector,
            fn: fn
        });
        if (!observer) {
            observer = new MutationObserver(check);
            observer.observe(doc.documentElement, {
                childList: true,
                subtree: true
            });
        }
        check();
    }

    function check() {
        for (let i = 0; i < listeners.length; i++) {
            let listener = listeners[i];
            let elements = doc.querySelectorAll(listener.selector);
            for (let j = 0; j < elements.length; j++) {
                let element = elements[j];
                if (!element.ready) {
                    element.ready = true;
                    listener.fn.call(element, element);
                }
            }
        }
    }

    win.jsReady = ready;
})(this);

/**
 * 基础框架方法
 */
(function ($, owner) {

    /**
     * 初始化自动绑定
     */
    owner.init = function () {
        jsReady('[data-js]', function (element) {
            owner.bind(element);
        });
        if (window['jsInitAfter'] != undefined && window['jsInitAfter'] != '') {
            window['jsInitAfter']();
        }
        window.initStats = 1;
    };

    /**
     * 绑定单个组件
     * @param $el
     * @returns {boolean}
     */
    owner.bind = function ($el) {
        let data = $($el).data(),
            name = data['js'];
        if (!name) {
            return false;
        }
        let names = name.split('-');
        if (!window[names[0]]) {
            app.debug(names[0] + '组件不存在');
            return false;
        }
        let action = names.slice(1);
        action = action.join('-');
        action = action.replace(/^\-/, '').replace(/\-(\w)(\w+)/g, function (a, b, c) {
            return b.toUpperCase() + c.toLowerCase();
        });
        if (typeof (window[names[0]][action]) != "function") {
            app.debug(names[0] + '组件中不存在' + action + '方法!');
            return false;
        }
        window[names[0]][action]($el, data);
    };

    /**
     * 公共回调
     * @param call
     * @param arg
     * @returns {*}
     */
    owner.callback = function (call, ...arg) {
        if (!call) {
            return;
        }
        if (typeof call === 'function') {
            return call(...arg);
        }
        if (typeof call === 'string' && call) {
            return window[call](...arg);
        }
    };

}(jQuery, window.base = {}));

(function ($, owner) {

    /**
     * 调试方法
     * @param data
     */
    owner.debug = function (data) {
        if (typeof (console) != 'undefined') {
            if ($.isArray(data) || $.isPlainObject(data)) {
                console.table(data)
            } else {
                console.log(data)
            }
        }
    }

    /**
     * AJAX请求
     * @param config
     */
    owner.ajax = async function (config) {
        let defaultConfig = {
            url: '',
            type: 'GET',
            notify: true,
            data: {},
            params: {},
            axios: {}
        }
        config = $.extend(defaultConfig, config)
        return new Promise(function (resolve, reject) {
            Do('axios', function () {
                let token = document.head.querySelector('meta[name="csrf-token"]')
                window.axios.defaults.headers.common['X-CSRF-TOKEN'] = token.content
                let axiosConfig = {
                    url: config.url,
                    method: config.type,
                    data: config.data,
                    params: config.params,
                }
                axiosConfig = $.extend(axiosConfig, config.axios)
                if (config.method === 'post') {
                    axiosConfig.headers = {
                        'Content-Type': 'multipart/form-data'
                    }
                }
                axios(axiosConfig).then((response) => {
                    let url = response.headers['x-location'];
                    let msg = response.data.message || '系统暂无响应内容';
                    let result = response.data.data;

                    resolve({
                        message: msg,
                        result: result,
                        url: url,
                        response: response.data
                    })
                    if (config.notify) {
                        app.success(msg, url);
                    }
                }).catch((error) => {
                    let url = error.response.headers['x-location'];
                    let data = error.response.data
                    let errors = error.response.error
                    let status = error.response.status
                    let code = error.response.code
                    let msg = data.message
                    if (status === 'error') {
                        msg = errors[Object.keys(errors)[0][0]]
                    }
                    msg = msg || '业务繁忙，请稍后再试'
                    if (code === 401 && url) {
                        dialog.alert({
                            content: msg,
                            callback: function () {
                                window.location.href = url;
                            }
                        });
                    }
                    if (config.notify) {
                        app.error(msg, url);
                    }
                    reject({
                        code: code,
                        message: msg,
                        url: url,
                        response: data
                    });
                })
            })
        })
    }

    /**
     * 成功提示
     * @param msg
     * @param url
     */
    owner.success = function (msg, url) {
        notify.success(msg);
        if (url) {
            setTimeout(function () {
                window.location.href = url
            }, 1000);
        }
    }

    /**
     * 失败提示
     * @param msg
     * @param url
     */
    owner.error = function (msg, url) {
        if (url) {
            dialog.alert({
                content: msg,
                callback: function () {
                    window.location.href = url
                }
            })
        } else {
            notify.error(msg)
        }
    }

    /**
     * 时间格式化
     * @param fmt
     * @param time
     * @returns {void | string}
     */
    owner.date = function (fmt, time = (new Date()).getTime() / 1000 | 0) {
        time = time * 1000
        let date = new Date(time)

        function padLeftZero(str) {
            return ('00' + str).substr(str.length)
        }

        if (/(y+)/.test(fmt)) {
            fmt = fmt.replace(RegExp.$1, (date.getFullYear() + '').substr(4 - RegExp.$1.length))
        }
        let o = {
            'M+': date.getMonth() + 1,
            'd+': date.getDate(),
            'h+': date.getHours(),
            'm+': date.getMinutes(),
            's+': date.getSeconds()
        }
        for (let k in o) {
            if (new RegExp(`(${k})`).test(fmt)) {
                let str = o[k] + ''
                fmt = fmt.replace(RegExp.$1, RegExp.$1.length === 1 ? str : padLeftZero(str))
            }
        }
        return fmt
    }

    /**
     * 表单数据对象
     * @returns {{}}
     */
    owner.serializeObject = function (form) {
        let o = {}
        let a = form.serializeArray()
        $.each(a, function () {
            if (o[this.name] !== undefined) {
                if (!o[this.name].push) {
                    o[this.name] = [o[this.name]]
                }
                o[this.name].push(this.value || '')
            } else {
                o[this.name] = this.value || ''
            }
        })
        return o
    }

    /**
     * 编译URL
     * @param url
     * @param params
     * @returns {*}
     */
    owner.buildUrl = function (url, params) {
        let arr = []
        for (let key in params) {
            arr.push(key + '=' + params[key])
        }
        let str = arr.join('&')
        if (url.indexOf('?') !== -1) {
            url += '&' + str
        } else {
            url += '?' + str
        }
        return url
    }

}(jQuery, window.app = {}));

(function ($, owner) {


    /**
     * 加载遮罩
     * @param msg
     * @returns {boolean}
     */
    owner.loading = function (msg) {
        let defaultConfig = {
            msg: '加载中，请稍等...',
        };
        let config = $.extend(defaultConfig, {
            msg: msg,
        });
        let $obj = $('#app-loading');
        if ($obj.length) {
            $obj.find('.loading-msg').html(config.msg);
            return true;
        }
        let $html = $('<div id="app-loading" class="app-loading"><div class="loading-body"><div class="loading-icon"></div><div class="loading-msg">' + config.msg + '</div></div></div>');
        $('body').append($html);
    };

    /**
     * 关闭加载遮罩
     */
    owner.loading.close = function () {
        $('#app-loading').remove();
    }

    /**
     * 消息提示
     * @param msg
     * @param time
     */
    owner.msg = function (msg, time) {
        msg = msg || '加载中';
        time = time || 3;

        let $obj = $('#app-msg');
        if ($obj.length) {
            $obj.remove();
        }
        owner.loading.close();
        let $html = $('<div id="app-msg" class="app-msg"><div class="msg-body"><div class="text">' + msg + '</div></div></div>');
        $('body').append($html);
        setTimeout(function () {
            $html.remove();
        }, time * 1000);
    };

    /**
     * 消息提醒
     * @param {*} msg 
     * @param {*} time 
     * @param {*} callback 
     */
    owner.info = function (msg, time, callback) {
        owner.toast('info', 'center', msg, time || 3, callback)
    }

    /**
     * 消息提醒
     * @param {*} msg 
     * @param {*} time 
     * @param {*} callback 
     */
    owner.success = function (msg, time, callback) {
        owner.toast('success', 'center', msg, time || 3, callback)
    }

    /**
     * 消息提醒
     * @param {*} msg 
     * @param {*} time 
     * @param {*} callback 
     */    
    owner.error = function (msg, time, callback) {
        owner.toast('error', 'center', msg, time || 3, callback)
    }

    /**
     * 自定义提醒
     * @param {*} type 
     * @param {*} position 
     * @param {*} msg 
     * @param {*} time 
     * @param {*} callback 
     */
    owner.toast = function (type, position, msg, time, callback) {
        type = type || 'info';
        position = position || 'center';
        time = time || 0;
        msg = msg || '消息提醒';

        let typeClass,typeIcon
        switch (type) {
            case 'success':
                typeClass = 'notify-success'
                typeIcon = `<svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>`
                break
            case 'error':
                typeClass = 'notify-error'
                typeIcon = `<svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>`
                break
            case 'info':
            default:
                typeClass = 'notify-info'
                typeIcon = `<svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>`
                break
        }

        let positionClass,positionId;
        switch (position) {
            case 'left':
                positionId = 'app-notify-left'
                positionClass = 'notify-left'
                break
            case 'right':
                positionId = 'app-notify-right'
                positionClass = 'notify-right'
                break
            case 'center':
            default:
                positionId = 'app-notify-center'
                positionClass = 'notify-center'
                break
        }

        let html = `<div id="${positionId}" class="notify ${typeClass} ${positionClass}"></div>`
        let item = `<div class="notify-item duration-300 ease-in-out opacity-0" style="display:none;">
            <div class="flex-none">
                ${typeIcon}
            </div>
            <div class="flex-grow">
                <div>${msg}</div>
            </div>
        `
        let $layout
        let $item = $(item)
        if ($('body').find('#' + positionId).length) {
            $layout = $('body').find('#' + positionId)
        } else {
            $layout = $(html)
        }
        $('body').append($layout)
        $layout.append($item)
        $item.show().addClass('opacity-100')

        $item.on('close', function () {
            $item.removeClass('opacity-100')
            setTimeout(() => {
                $item.remove()
                if (!$layout.find('.notify-item').length) {
                    $layout.remove()
                }
                base.callback(callback)
            }, 300)
        })

        if (time) {
            setTimeout(function () {
                $item.trigger('close')
            }, time * 1000)
        }
    }


}(jQuery, window.notify = {}));
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

        // 表格树
        if (config.tree) {
            Do('treetable', function () {
                $table.treetable({
                    expandable: true,
                    initialState: "expanded",
                    clickableNodeNames: true,
                    stringCollapse: '折叠',
                    stringExpand: '展开'
                });
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
                if (!data.response instanceof Object) {
                    notify.error('数据返回异常，详情请查看调试', 3)
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


        let $body = $(`<div class="select-none" x-data="{open: false}"><div class="form-select items-center" style="display: flex!important;" :class="{'border-blue-900 ring-1 ring-blue-900': open}" cascader-input @click="open = !open">
            <div class="flex-grow  pr-4 ${config.multiple ? 'flex flex-col gap-2' : 'truncate'}" data-list><span class="text-gray-500">${config.placeholder}</span></div>
            <div class="flex-none w-4 h-4 text-red-900" hidden cascader-clear><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg></div></div>
        <div x-show="open"
        @click.outside="open = false"
        x-transition:enter-start="opacity-0 transform duration-100"
        x-transition:enter-end="opacity-100 transform duration-100"
        x-transition:leave-start="opacity-100 transform duration-100"
        x-transition:leave-end="opacity-0 transform duration-100"
        class="mt-1 lg:absolute z-10 " x-cloak><div class="flex items-stretch bg-white overflow-y-auto shadow rounded border border-gray-400 " cascader-layout></div></div></div>`)
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
            $body.find('.form-select').click()
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
                    $body.find('.form-select').click()
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

(function ($, owner) {

    owner.tooltip = function($el, config) {
        let defaultConfig = {
            title: '请输入提示内容'
        }
        config = $.extend(defaultConfig, config)
        Do('tooltip', function() {
            tippy($el, {
                content: config.title,
            });
        });
    }

    owner.menu = function ($el, config) {
        let defaultConfig = {}
        config = $.extend(defaultConfig, config)

        $($el).find('[data-parent]').on('click', function () {
            if ($(this).hasClass('active')) {
                $($el).find('[data-parent]').removeClass('active')
            } else {
                $($el).find('[data-parent]').removeClass('active')
                $(this).addClass('active')
            }
        });
    };

    owner.code = function (config) {
        let defaultConfig = {}
        config = $.extend(defaultConfig, config)
        Do('highlight', function () {
            hljs.initHighlightingOnLoad()
        })
    }

    owner.hidden = function ($el, config) {
        let defaultConfig = {}
        config = $.extend(defaultConfig, config)
        $obj = $el;

        $($el).on('click', function () {
            let $el = $(this).prev();
            if($el.prop('hidden')) {
                $el.prop('hidden', false)
                $($obj).text('隐藏')
            }else {
                $el.prop('hidden', true)
                $($obj).text('显示')
            }
        });

    }

    owner.dropdown = function (config) {
        return {
            open: false,
            dropdown: {
                ['x-show']() {
                    return this.open
                },
                ['@click.outside']() {
                    this.open = false
                },
            },
        }
    }

}(jQuery, window.show = {}));

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
                                    <select class="form-select filter-type ${config.type != 'all' ? 'disabled' : ''}">
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


(function ($, owner) {

    owner.load = function () {
        return `
            <div class="flex items-center justify-center py-6">
                <div class="flex items-center space-x-4">
                  <div class="flex-none">
                    <svg class="animate-spin w-6 h-6 text-blue-900" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                      <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>

                  </div>
                  <div class="flex-grow">
                      <div class="text-base">加载数据中...</div>
                      <div class="text-gray-500">
                        如果长时间未加载，您可以尝试重新加载或刷新
                      </div>
                 </div>
                </div>
            </div>
        `
    }

    owner.empty = function (title, content, reload) {
        return `
            <div class="flex flex-col items-center">
                <div class="w-20 h-20">
                    <svg class="w-full h-full" viewBox="0 0 140 140" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
                        <g id="06.-Design-Variations" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
                            <g id="02-example-products-empty" transform="translate(-776.000000, -284.000000)">
                                <g id="empty-state" transform="translate(290.000000, 164.000000)">
                                    <g id="illustration" transform="translate(486.000000, 120.000000)">
                                        <rect id="illustration-bg" fill="#FFFFFF" opacity="0" x="0" y="0" width="140" height="140"></rect>
                                        <g id="receipt" transform="translate(28.000000, 16.000000)">
                                            <path d="M78,0.979732163 L6,1 L6,61.6706477 C6,62.220134 78,61.9838101 78,61.6706477 L78,0.979732163 Z" id="Path" fill="#D7DBEC"></path>
                                            <polygon id="Path" fill="#336DFF" points="84 9 0 9 0 109 5.5 103 10.5 109 16 103 21 109 26.5 103 31.5 109 37 103 42 109 47.5 103 52.5 109 58 103 63 109 68.5 103 73.5 109 79 103 84 109"></polygon>
                                            <polygon id="Path" fill="#FFFFFF" fill-rule="nonzero" points="21.6465315 28.5275452 24.3534685 31.4724548 15.3588167 39.740266 10.6190485 35.2159419 13.3809515 32.3225197 15.41 34.26"></polygon>
                                            <rect id="Rectangle" fill="#FFFFFF" x="32" y="32" width="38" height="4"></rect>
                                            <polygon id="Path" fill="#FFFFFF" fill-rule="nonzero" points="21.6465315 45.5275452 24.3534685 48.4724548 15.3588167 56.740266 10.6190485 52.2159419 13.3809515 49.3225197 15.41 51.26"></polygon>
                                            <rect id="Rectangle" fill="#FFFFFF" x="32" y="49" width="38" height="4"></rect>
                                            <polygon id="Path" fill="#FFFFFF" fill-rule="nonzero" points="21.6465315 62.5275452 24.3534685 65.4724548 15.3588167 73.740266 10.6190485 69.2159419 13.3809515 66.3225197 15.41 68.26"></polygon>
                                            <rect id="Rectangle" fill="#FFFFFF" x="32" y="66" width="38" height="4"></rect>
                                        </g>
                                    </g>
                                </g>
                            </g>
                        </g>
                    </svg>
                </div>
                <p class="text-lg mb-2 mt-4">${title || '未找到数据'}</p>
                <p class="text-gray-500">
                    ${content || '暂时未找到数据，您可以尝试刷新页面'}
                </p>
                ${reload === false ? '' : `<div class="mt-5">
                    <a href="javascript:location.reload();" class="btn-blue flex items-center space-x-2">
                        <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" width="24" height="24" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M19.95 11a8 8 0 1 0 -.5 4m.5 5v-5h-5" /></svg>
                        <span>刷新页面</span>
                    </a>
                </div>`}
            </div>
        `
    }

    owner.data = function (title, content) {
        return `
            <div class="flex items-center justify-center py-6">
                <div class="flex items-center space-x-4">
                  <div class="flex-none">
                    <svg class="w-10 h-10" viewBox="0 0 1320 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="2514" width="16" height="16"><path d="M835.267497 208.791925V13.472746L309.80188 94.309224l397.467399 127.998218z" fill="#6180F1" p-id="2515"></path><path d="M1219.247894 148.200209L835.253241 13.472746v195.319179z" fill="#AFC0FD" p-id="2516"></path><path d="M612.945799 397.4674l-303.158176-107.78197v424.412892l383.994653 114.525472 13.472747-606.302095z" fill="#6180F1" p-id="2517"></path><path d="M707.255023 222.307442l-13.472747 606.302095 525.465618-80.836477v-417.726419l-370.521907 94.309224z" fill="#AFC0FD" p-id="2518"></path><path d="M1219.247894 148.214466l-383.994653 60.634486-127.998218 13.472747 141.470964 202.10545 370.521907-94.309223 101.052726-26.945493z" fill="#E2E3FE" p-id="2519"></path><path d="M707.269279 222.307442L309.80188 94.309224l-74.135747 168.416456 74.135747 26.945493 303.158176 107.78197z" fill="#AFC0FD" p-id="2520"></path><path d="M444.529342 990.311006c0 18.533937 144.778559 33.688994 323.360167 33.688994s323.360167-15.083773 323.360167-33.688994-144.778559-33.688994-323.360167-33.688994-323.360167 15.083773-323.360167 33.688994z" fill="#6180F1" opacity=".5" p-id="2521"></path></svg>
                  </div>
                  <div class="flex-grow">
                      <div class="text-base">${title || '暂无数据'}</div>
                      <div class="text-gray-500">
                        ${content || '暂无添加数据，您可以进行添加操作'}
                      </div>
                 </div>
                </div>
            </div>
        `
    }

}(jQuery, window.page = {}));
