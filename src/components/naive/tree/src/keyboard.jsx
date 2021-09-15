import { inject, ref } from 'vue'
import { treeSelectInjectionKey } from 'naive-ui/es/tree-select/src/interface'

export function useKeyboard ({
  fNodesRef,
  mergedExpandedKeysRef,
  mergedSelectedKeysRef,
  handleSelect,
  handleSwitcherClick
}){
  const { value: mergedSelectedKeys } = mergedSelectedKeysRef

  // If it's used in tree-select, make it take over pending state
  const treeSelectInjection = inject(treeSelectInjectionKey, null)
  const pendingNodeKeyRef = treeSelectInjection
    ? treeSelectInjection.pendingNodeKeyRef
    : ref(
      mergedSelectedKeys.length
        ? mergedSelectedKeys[mergedSelectedKeys.length - 1]
        : null
    )
  function handleKeyup (e) {
    const { value: pendingNodeKey } = pendingNodeKeyRef
    if (pendingNodeKey === null) {
      if (
        ['ArrowDown', 'ArrowUp', 'ArrowLeft', 'ArrowRight'].includes(e.code)
      ) {
        if (pendingNodeKey === null) {
          const { value: fNodes } = fNodesRef
          let fIndex = 0
          while (fIndex < fNodes.length) {
            if (!fNodes[fIndex].disabled) {
              pendingNodeKeyRef.value = fNodes[fIndex].key
              break
            }
            fIndex += 1
          }
        }
      }
    } else {
      const { value: fNodes } = fNodesRef
      let fIndex = fNodes.findIndex((tmNode) => tmNode.key === pendingNodeKey)
      if (!~fIndex) return
      if (e.code === 'Enter' || e.code === 'NumpadEnter') {
        handleSelect(fNodes[fIndex])
      } else if (e.code === 'ArrowDown') {
        fIndex += 1
        while (fIndex < fNodes.length) {
          if (!fNodes[fIndex].disabled) {
            pendingNodeKeyRef.value = fNodes[fIndex].key
            break
          }
          fIndex += 1
        }
      } else if (e.code === 'ArrowUp') {
        fIndex -= 1
        while (fIndex >= 0) {
          if (!fNodes[fIndex].disabled) {
            pendingNodeKeyRef.value = fNodes[fIndex].key
            break
          }
          fIndex -= 1
        }
      } else if (e.code === 'ArrowLeft') {
        const pendingNode = fNodes[fIndex]
        if (
          pendingNode.isLeaf ||
          !mergedExpandedKeysRef.value.includes(pendingNodeKey)
        ) {
          const parentTmNode = pendingNode.getParent()
          if (parentTmNode) {
            pendingNodeKeyRef.value = parentTmNode.key
          }
        } else {
          handleSwitcherClick(pendingNode)
        }
      } else if (e.code === 'ArrowRight') {
        const pendingNode = fNodes[fIndex]
        if (pendingNode.isLeaf) return
        if (!mergedExpandedKeysRef.value.includes(pendingNodeKey)) {
          handleSwitcherClick(pendingNode)
        } else {
          // Tha same as ArrowDown
          fIndex += 1
          while (fIndex < fNodes.length) {
            if (!fNodes[fIndex].disabled) {
              pendingNodeKeyRef.value = fNodes[fIndex].key
              break
            }
            fIndex += 1
          }
        }
      }
    }
  }
  function handleKeydown (e) {
    switch (e.code) {
      case 'ArrowUp':
      case 'ArrowDown':
        e.preventDefault()
    }
  }
  return {
    pendingNodeKeyRef,
    handleKeyup,
    handleKeydown
  }
}
