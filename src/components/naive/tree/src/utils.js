function traverse(nodes, callback, callbackAfter) {
    nodes === null || nodes === void 0 ? void 0 : nodes.forEach((node) => {
        callback(node);
        traverse(node.children, callback, callbackAfter);
        callbackAfter(node);
    });
}
export function keysWithFilter(nodes, pattern, filter) {
    const keys = new Set();
    const highlightKeySet = new Set();
    const path = [];
    traverse(nodes, (node) => {
        path.push(node);
        if (filter(pattern, node)) {
            highlightKeySet.add(node.key);
            for (let i = path.length - 2; i >= 0; --i) {
                if (!keys.has(path[i].key)) {
                    keys.add(path[i].key);
                }
                else {
                    return;
                }
            }
        }
    }, () => {
        path.pop();
    });
    return {
        expandedKeys: Array.from(keys),
        highlightKeySet
    };
}
const emptyImage = null;
if (typeof window !== 'undefined') {
    const emptyImage = new Image();
    emptyImage.src =
        'data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==';
}
export const defaultFilter = (pattern, node) => {
    if (!pattern.length)
        return true;
    return node.label.toLowerCase().includes(pattern.toLowerCase());
};
export { emptyImage };
