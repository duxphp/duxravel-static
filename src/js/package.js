/**
 * 初始化类库
 */
(function (win, doc) {


    /**
     * 解析标识
     */
    var jsSelf = (function () {
        var files = doc.getElementsByTagName('script');
        return files[files.length - 1];
    })();
    window.appManage = jsSelf.getAttribute('data-manage');

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
     * 拖动排序
     */
    Do.add('sortable', {
        path: 'https://lib.baomitu.com/Sortable/1.14.0/Sortable.min.js',
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
     * 提醒
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

    /**
     * tree
     */
    Do.add('tree', {
        path: 'https://lib.baomitu.com/zTree.v3/3.5.42/js/jquery.ztree.all.min.js',
        type: 'js',
    });


})(window, document);
