import { Ref } from 'vue';
import { TreeNode } from 'treemate';
import { Key, TmNode, TreeOption } from './interface';
export declare function useKeyboard({ fNodesRef, mergedExpandedKeysRef, mergedSelectedKeysRef, handleSelect, handleSwitcherClick }: {
    fNodesRef: Ref<Array<TreeNode<TreeOption>>>;
    mergedExpandedKeysRef: Ref<Key[]>;
    mergedSelectedKeysRef: Ref<Key[]>;
    handleSelect: (node: TmNode) => void;
    handleSwitcherClick: (node: TmNode) => void;
}): {
    pendingNodeKeyRef: Ref<null | Key>;
    handleKeyup: (e: KeyboardEvent) => void;
    handleKeydown: (e: KeyboardEvent) => void;
};
