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
                ['@click.away']() {
                    this.open = false
                },
            },
        }
    }

}(jQuery, window.show = {}));
