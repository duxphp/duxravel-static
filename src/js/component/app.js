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

                    if (response.data)

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
