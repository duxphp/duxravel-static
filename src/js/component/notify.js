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
        let $html = $(`<div id="app-loading" class="fixed z-50 inset-0 overflow-y-auto"><div class="flex items-center justify-center min-h-screen text-center">
                    <div class="bg-black bg-opacity-60 rounded p-3">
                        <svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                          <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                    </div>
                    <div class="text-white">${config.msg}</div></div></div>`);
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

        let typeClass, typeIcon
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

        let positionClass, positionId;
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