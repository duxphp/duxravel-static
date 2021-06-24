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
