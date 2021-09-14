import { h, defineComponent, ref, inject } from 'vue';
import { render } from 'naive-ui/es/_utils';
import { treeInjectionKey } from './interface';
export default defineComponent({
    name: 'TreeNodeContent',
    props: {
        clsPrefix: {
            type: String,
            required: true
        },
        disabled: {
            type: Boolean,
            default: false
        },
        checked: Boolean,
        selected: Boolean,
        onClick: Function,
        onDragstart: Function,
        tmNode: {
            type: Object,
            required: true
        }
    },
    setup(props) {
        const { renderLabelRef, renderPrefixRef, renderSuffixRef } = 
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        inject(treeInjectionKey);
        const selfRef = ref(null);
        function doClick(e) {
            const { onClick } = props;
            if (onClick)
                onClick(e);
        }
        function handleClick(e) {
            doClick(e);
        }
        return {
            selfRef,
            renderLabel: renderLabelRef,
            renderPrefix: renderPrefixRef,
            renderSuffix: renderSuffixRef,
            handleClick
        };
    },
    render() {
        const { clsPrefix, checked = false, selected = false, renderLabel, renderPrefix, renderSuffix, handleClick, onDragstart, tmNode: { rawNode, rawNode: { prefix, label, suffix } } } = this;
        return (h("span", { ref: "selfRef", class: [`${clsPrefix}-tree-node-content`], onClick: handleClick, draggable: onDragstart === undefined ? undefined : true, onDragstart: onDragstart },
            renderPrefix || prefix ? (h("div", { class: `${clsPrefix}-tree-node-content__prefix` }, renderPrefix
                ? renderPrefix({
                    option: rawNode,
                    selected,
                    checked
                })
                : render(prefix))) : null,
            h("div", { class: `${clsPrefix}-tree-node-content__text` }, renderLabel
                ? renderLabel({
                    option: rawNode,
                    selected,
                    checked
                })
                : render(label)),
            renderSuffix || suffix ? (h("div", { class: `${clsPrefix}-tree-node-content__suffix` }, renderSuffix
                ? renderSuffix({
                    option: rawNode,
                    selected,
                    checked
                })
                : render(suffix))) : null));
    }
});
