import { Key, TreeOption } from './interface';
export declare function keysWithFilter(nodes: TreeOption[], pattern: string, filter: (pattern: string, node: TreeOption) => boolean): {
    expandedKeys: Key[];
    highlightKeySet: Set<Key>;
};
declare const emptyImage: HTMLImageElement | null;
export declare const defaultFilter: (pattern: string, node: TreeOption) => boolean;
export { emptyImage };
