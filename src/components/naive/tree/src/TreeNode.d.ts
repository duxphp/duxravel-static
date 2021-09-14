import { PropType, ComponentPublicInstance } from 'vue';
import { TmNode } from './interface';
declare const TreeNode: import("vue").DefineComponent<{
    clsPrefix: {
        type: StringConstructor;
        required: true;
    };
    tmNode: {
        type: PropType<TmNode>;
        required: true;
    };
}, {
    showDropMark: import("vue").ComputedRef<boolean | undefined>;
    showDropMarkAsParent: import("vue").ComputedRef<boolean>;
    pending: import("vue").ComputedRef<boolean>;
    loading: import("vue").ComputedRef<boolean>;
    highlight: import("vue").ComputedRef<boolean>;
    checked: import("vue").ComputedRef<boolean>;
    indeterminate: import("vue").ComputedRef<boolean>;
    selected: import("vue").ComputedRef<boolean>;
    expanded: import("vue").ComputedRef<boolean>;
    disabled: import("vue").ComputedRef<boolean>;
    checkable: import("vue").ComputedRef<boolean>;
    checkboxDisabled: import("vue").ComputedRef<boolean>;
    selectable: import("vue").ComputedRef<boolean>;
    internalScrollable: import("vue").Ref<boolean>;
    draggable: import("vue").Ref<boolean>;
    blockLine: import("vue").Ref<boolean>;
    checkboxFocusable: import("vue").Ref<boolean>;
    droppingPosition: import("vue").Ref<import("./interface").DropPosition | null>;
    droppingOffsetLevel: import("vue").Ref<number>;
    indent: import("vue").Ref<number>;
    contentInstRef: import("vue").Ref<ComponentPublicInstance<{}, {}, {}, {}, {}, {}, {}, {}, false, import("vue").ComponentOptionsBase<any, any, any, any, any, any, any, any, any, {}>> | null>;
    contentElRef: {
        value: HTMLElement | null;
    };
    handleCheck: (checked: boolean) => void;
    handleDrop: (e: DragEvent) => void;
    handleDragStart: (e: DragEvent) => void;
    handleDragEnter: (e: DragEvent) => void;
    handleDragOver: (e: DragEvent) => void;
    handleDragEnd: (e: DragEvent) => void;
    handleDragLeave: (e: DragEvent) => void;
    handleContentClick: (e: MouseEvent) => void;
    handleSwitcherClick: () => void;
}, unknown, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, Record<string, any>, string, import("vue").VNodeProps & import("vue").AllowedComponentProps & import("vue").ComponentCustomProps, Readonly<{
    clsPrefix?: unknown;
    tmNode?: unknown;
} & {
    clsPrefix: string;
    tmNode: TmNode;
} & {}> & {}, {}>;
export default TreeNode;
