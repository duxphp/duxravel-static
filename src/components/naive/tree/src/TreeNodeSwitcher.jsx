import { h, defineComponent } from 'vue';
import { AddIcon } from 'naive-ui/es/_internal/icons';
import { NIconSwitchTransition, NBaseLoading, NBaseIcon } from 'naive-ui/es/_internal';
import { } from 'naive-ui/es/_internal/icons/'

const Icon = defineComponent({
    name: 'Icon',
    render() {
        return (
            <svg t="1631613868411" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="2456" width="32" height="32"><path d="M474.91 67h74.19v890h-74.19z" p-id="2457"></path></svg>
        )
    }
})

export default defineComponent({
    name: 'NTreeSwitcher',
    components: {
        Icon
    },
    props: {
        clsPrefix: {
            type: String,
            required: true
        },
        expanded: Boolean,
        hide: Boolean,
        loading: Boolean,
        onClick: Function
    },
    render() {
        const { clsPrefix } = this;
        return (h("span", {
            "data-switcher": true, class: [
                `${clsPrefix}-tree-node-switcher`,
                {
                    [`${clsPrefix}-tree-node-switcher--expanded`]: this.expanded,
                    [`${clsPrefix}-tree-node-switcher--hide`]: this.hide
                }
            ], onClick: this.onClick
        },
            h("div", { class: `${clsPrefix}-tree-node-switcher__icon` },
                h(NIconSwitchTransition, null, {
                    default: () => !this.loading ? (h(NBaseIcon, { clsPrefix: clsPrefix, key: "switcher" }, { default: () => h(this.expanded ? Icon : AddIcon, null) })) : (h(NBaseLoading, { clsPrefix: clsPrefix, key: "loading", radius: 85, strokeWidth: 20 }))
                }))));
    }
});
