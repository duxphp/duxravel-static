import { PropType } from 'vue';
import { TmNode } from './interface';
declare const _default: import("vue").DefineComponent<{
    clsPrefix: {
        type: StringConstructor;
        required: true;
    };
    height: NumberConstructor;
    nodes: {
        type: PropType<TmNode[]>;
        required: true;
    };
    mode: {
        type: PropType<"collapse" | "expand">;
        required: true;
    };
    onAfterEnter: {
        type: PropType<() => void>;
        required: true;
    };
}, unknown, unknown, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, Record<string, any>, string, import("vue").VNodeProps & import("vue").AllowedComponentProps & import("vue").ComponentCustomProps, Readonly<{
    clsPrefix?: unknown;
    height?: unknown;
    nodes?: unknown;
    mode?: unknown;
    onAfterEnter?: unknown;
} & {
    mode: "collapse" | "expand";
    onAfterEnter: () => void;
    clsPrefix: string;
    nodes: TmNode[];
} & {
    height?: number | undefined;
}> & {}, {}>;
export default _default;
