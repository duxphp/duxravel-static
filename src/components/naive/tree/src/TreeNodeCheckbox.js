import { h, defineComponent, inject } from 'vue';
import { NCheckbox } from 'naive-ui/es/checkbox';
import { treeInjectionKey } from './interface';
export default defineComponent({
    name: 'NTreeNodeCheckbox',
    props: {
        clsPrefix: {
            type: String,
            required: true
        },
        focusable: Boolean,
        disabled: Boolean,
        checked: Boolean,
        indeterminate: Boolean,
        onCheck: Function
    },
    setup(props) {
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        const NTree = inject(treeInjectionKey);
        function doCheck(value) {
            const { onCheck } = props;
            if (onCheck)
                return onCheck(value);
        }
        function handleUpdateValue(value) {
            if (props.indeterminate) {
                doCheck(false);
            }
            else {
                doCheck(value);
            }
        }
        return {
            handleUpdateValue,
            mergedTheme: NTree.mergedThemeRef
        };
    },
    render() {
        const { clsPrefix, mergedTheme, checked, indeterminate, disabled, focusable, handleUpdateValue } = this;
        return (h("span", { class: `${clsPrefix}-tree-node-checkbox`, "data-checkbox": true },
            h(NCheckbox, { focusable: focusable, disabled: disabled, theme: mergedTheme.peers.Checkbox, themeOverrides: mergedTheme.peerOverrides.Checkbox, checked: checked, indeterminate: indeterminate, onUpdateChecked: handleUpdateValue })));
    }
});
