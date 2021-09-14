import { PropType } from 'vue';
declare const _default: import("vue").DefineComponent<{
    clsPrefix: {
        type: StringConstructor;
        required: true;
    };
    expanded: BooleanConstructor;
    hide: BooleanConstructor;
    loading: BooleanConstructor;
    onClick: PropType<(e: MouseEvent) => void>;
}, unknown, unknown, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, Record<string, any>, string, import("vue").VNodeProps & import("vue").AllowedComponentProps & import("vue").ComponentCustomProps, Readonly<{
    clsPrefix?: unknown;
    expanded?: unknown;
    hide?: unknown;
    loading?: unknown;
    onClick?: unknown;
} & {
    hide: boolean;
    expanded: boolean;
    clsPrefix: string;
    loading: boolean;
} & {
    onClick?: ((e: MouseEvent) => void) | undefined;
}> & {}, {
    hide: boolean;
    expanded: boolean;
    loading: boolean;
}>;
export default _default;
