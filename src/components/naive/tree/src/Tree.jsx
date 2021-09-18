/* eslint-disable @typescript-eslint/no-non-null-assertion */
import {
  h,
  ref,
  toRef,
  computed,
  defineComponent,
  provide,
  watch,
  nextTick
} from 'vue'
import {
  createTreeMate,
  flatten,
  createIndexGetter
} from 'treemate'
import { useMergedState } from 'vooks'
import { VVirtualList } from 'vueuc'
import { getPadding } from 'seemly'
import { useConfig, useTheme } from 'naive-ui/es/_mixins'
import { call, createDataKey, warn } from 'naive-ui/es/_utils'
import { NxScrollbar } from 'naive-ui/es/scrollbar'
import { treeLight } from '../styles'
import NTreeNode from './TreeNode'
import { keysWithFilter, emptyImage } from './utils'
import { useKeyboard } from './keyboard'
import {
  treeInjectionKey,
} from './interface'
import MotionWrapper from './MotionWrapper'
import { defaultAllowDrop } from './dnd'
import style from './styles/index.cssr'

import './styles/costom.scss'

// TODO:
// During expanding, some node are mis-applied with :active style
// Async dnd has bug

const ITEM_SIZE = 30 // 24 + 3 + 3

export function createTreeMateOptions(
  keyField,
  childrenField
) {
  return {
    getKey(node) {
      return node[keyField]
    },
    getChildren(node) {
      return node[childrenField]
    },
    getDisabled(node) {
      return !!(node.disabled || node.checkboxDisabled)
    }
  }
}

export const treeSharedProps = {
  filter: Function,
  defaultExpandAll: Boolean,
  expandedKeys: Array,
  keyField: {
    type: String,
    default: 'key'
  },
  labelField: {
    type: String,
    default: 'label'
  },
  childrenField: {
    type: String,
    default: 'children'
  },
  defaultExpandedKeys: {
    type: Array,
    default: () => []
  },
  onUpdateExpandedKeys: [Function, Array],
  'onUpdate:expandedKeys': [Function, Array]
}

export const treeNodeProps = {
  /**
   * 定义所有可用的右键菜单，当没有右键菜单时不会显示右键菜单
   * {
   *    level1New: {
   *      text: '新建1',
   *      event: 'new'
   *    },
   *    level2New: {
   *      text: '新建2',
   *      event: 'new'
   *    },
   *    edit: {
   *      text: '编辑',
   *      event: 'edit'
   *    }
   * }
   */
  contextMenus: {
    type: Object,
    default: () => ({})
  },
  /**
   * 定义每个级别可用的菜单，如果找不到当前级别可用菜单，这表示所有可用
   * {
   *  0: ['level1New', 'edit'],
   *  1: ['level2New', 'edit']
   * }
   */
  contextLevelMenus: {
    type: [Object, Array],
    default: () => ({})
  }
}

const treeLevelMarkProps = {
  /**
   * 组件不同层级的颜色标识
   * 如果数组为空则不显示标识
   */
  levelMarkColor: {
    type: Array,
    default: () => []
  }
}

const treeProps = {
  ...useTheme.props,
  data: {
    type: Array,
    default: () => []
  },
  expandOnDragenter: {
    type: Boolean,
    default: true
  },
  cancelable: {
    type: Boolean,
    default: true
  },
  checkable: Boolean,
  draggable: Boolean,
  blockNode: Boolean,
  blockLine: Boolean,
  disabled: Boolean,
  checkedKeys: Array,
  defaultCheckedKeys: {
    type: Array,
    default: () => []
  },
  selectedKeys: Array,
  defaultSelectedKeys: {
    type: Array,
    default: () => []
  },
  remote: Boolean,
  leafOnly: Boolean,
  multiple: Boolean,
  pattern: {
    type: String,
    default: ''
  },
  onLoad: Function,
  cascade: Boolean,
  selectable: {
    type: Boolean,
    default: true
  },
  indent: {
    type: Number,
    default: 16
  },
  allowDrop: {
    type: Function,
    default: defaultAllowDrop
  },
  animated: {
    type: Boolean,
    default: true
  },
  virtualScroll: Boolean,
  renderLabel: Function,
  renderPrefix: Function,
  renderSuffix: Function,
  onDragenter: [Function, Array],
  onDragleave: [Function, Array],
  onDragend: [Function, Array],
  onDragstart: [Function, Array],
  onDragover: [Function, Array],
  onDrop: [Function, Array],
  onUpdateCheckedKeys: [Function, Array],
  'onUpdate:checkedKeys': [Function, Array],
  onUpdateSelectedKeys: [Function, Array],
  'onUpdate:selectedKeys': [Function, Array],
  ...treeSharedProps,
  // internal props for tree-select
  internalScrollable: Boolean,
  internalScrollablePadding: String,
  // use it to do check
  internalDataTreeMate: Object,
  // use it to display
  internalDisplayTreeMate: Object,
  internalHighlightKeySet: Object,
  internalCheckOnSelect: Boolean,
  internalHideFilteredNode: Boolean,
  internalCheckboxFocusable: {
    type: Boolean,
    default: true
  },
  internalFocusable: {
    // Make tree-select take over keyboard operations
    type: Boolean,
    default: true
  },
  ...treeNodeProps,
  ...treeLevelMarkProps
}

export default defineComponent({
  name: 'Tree',
  props: treeProps,
  setup(props, { emit }) {
    function toCamel(str) {
      return str.replace(/([^-])(?:-+([^-]))/g, function ($0, $1, $2) {
        return $1 + $2.toUpperCase();
      });
    }
    // 事件转发
    const nodeEvents = {}
    for (const key in props.contextMenus) {
      if (Object.hasOwnProperty.call(props.contextMenus, key)) {
        const name = props.contextMenus[key].event
        nodeEvents[toCamel('on-' + name)] = event => emit(name, event)
      }
    }
    const { mergedClsPrefixRef } = useConfig(props)
    const themeRef = useTheme(
      'Tree',
      'Tree',
      style,
      treeLight,
      props,
      mergedClsPrefixRef
    )
    const selfElRef = ref(null)
    const scrollbarInstRef = ref(null)
    const virtualListInstRef = ref(null)
    function getScrollContainer() {
      return virtualListInstRef.value?.listElRef
    }
    function getScrollContent() {
      return virtualListInstRef.value?.itemsElRef
    }
    // We don't expect data source to change so we just determine it once
    const displayTreeMateRef = props.internalDisplayTreeMate
      ? toRef(props, 'internalDisplayTreeMate')
      : computed(() =>
        createTreeMate(
          props.data,
          createTreeMateOptions(props.keyField, props.childrenField)
        )
      )
    const dataTreeMateRef = props.internalDataTreeMate
      ? toRef(props, 'internalDataTreeMate')
      : displayTreeMateRef
    const uncontrolledCheckedKeysRef = ref(
      props.defaultCheckedKeys || props.checkedKeys
    )
    const controlledCheckedKeysRef = toRef(props, 'checkedKeys')
    const mergedCheckedKeysRef = useMergedState(
      controlledCheckedKeysRef,
      uncontrolledCheckedKeysRef
    )
    const checkedStatusRef = computed(() => {
      return dataTreeMateRef.value.getCheckedKeys(mergedCheckedKeysRef.value, {
        cascade: props.cascade
      })
    })
    const mergedCheckStrategyRef = computed(() =>
      props.leafOnly ? 'child' : props.checkStrategy
    )
    const displayedCheckedKeysRef = computed(() => {
      return checkedStatusRef.value.checkedKeys
    })
    const displayedIndeterminateKeysRef = computed(() => {
      return checkedStatusRef.value.indeterminateKeys
    })
    const uncontrolledSelectedKeysRef = ref(
      props.defaultSelectedKeys || props.selectedKeys
    )
    const controlledSelectedKeysRef = toRef(props, 'selectedKeys')
    const mergedSelectedKeysRef = useMergedState(
      controlledSelectedKeysRef,
      uncontrolledSelectedKeysRef
    )
    const uncontrolledExpandedKeysRef = ref(
      props.defaultExpandAll
        ? dataTreeMateRef.value.getNonLeafKeys()
        : props.defaultExpandedKeys
    )
    const controlledExpandedKeysRef = toRef(props, 'expandedKeys')
    const mergedExpandedKeysRef = useMergedState(
      controlledExpandedKeysRef,
      uncontrolledExpandedKeysRef
    )

    const fNodesRef = computed(() =>
      displayTreeMateRef.value.getFlattenedNodes(mergedExpandedKeysRef.value)
    )

    const { pendingNodeKeyRef, handleKeyup, handleKeydown } = useKeyboard({
      mergedSelectedKeysRef,
      fNodesRef,
      mergedExpandedKeysRef,
      handleSelect,
      handleSwitcherClick
    })

    let expandTimerId = null
    let nodeKeyToBeExpanded = null
    const uncontrolledHighlightKeySetRef = ref(new Set())
    const controlledHighlightKeySetRef = toRef(props, 'internalHighlightKeySet')
    const mergedHighlightKeySetRef = useMergedState(
      controlledHighlightKeySetRef,
      uncontrolledHighlightKeySetRef
    )
    const loadingKeysRef = ref([])

    let dragStartX = 0
    const draggingNodeRef = ref(null)
    const droppingNodeRef = ref(null)
    const droppingMouseNodeRef = ref(null)
    const droppingPositionRef = ref(null)
    const droppingOffsetLevelRef = ref(0)
    const droppingNodeParentRef = computed(() => {
      const { value: droppingNode } = droppingNodeRef
      if (!droppingNode) return null
      // May avoid overlap between line mark of first child & rect mark of parent
      // if (droppingNode.isFirstChild && droppingPositionRef.value === 'before') {
      //   return null
      // }
      return droppingNode.parent
    })

    const mergedFilterRef = computed(() => {
      const { filter } = props
      if (filter) return filter
      const { labelField } = props
      return (pattern, node) => {
        if (!pattern.length) return true
        return ('' + node[labelField])
          .toLowerCase()
          .includes(pattern.toLowerCase())
      }
    })

    // shallow watch data
    watch(
      toRef(props, 'data'),
      () => {
        loadingKeysRef.value = []
        pendingNodeKeyRef.value = null
        resetDndState()
      },
      {
        deep: false
      }
    )
    watch(toRef(props, 'pattern'), (value) => {
      if (value) {
        const { expandedKeys: expandedKeysAfterChange, highlightKeySet } =
          keysWithFilter(
            props.data,
            props.pattern,
            props.keyField,
            mergedFilterRef.value
          )
        uncontrolledHighlightKeySetRef.value = highlightKeySet
        doUpdateExpandedKeys(expandedKeysAfterChange)
      } else {
        uncontrolledHighlightKeySetRef.value = new Set()
      }
    })

    // animation in progress
    const aipRef = ref(false)
    // animation flattened nodes
    const afNodeRef = ref([])
    // Note: Since the virtual list depends on min height, if there's a node
    // whose height starts from 0, the virtual list will have a wrong height
    // during animation. This will seldom cause wired scrollbar status. It is
    // fixable and need some changes in vueuc, I've no time so I just leave it
    // here. Maybe the bug won't be fixed during the life time of the project.
    watch(mergedExpandedKeysRef, (value, prevValue) => {
      if (!props.animated) {
        void nextTick(syncScrollbar)
        return
      }
      const prevVSet = new Set(prevValue)
      let addedKey = null
      let removedKey = null
      for (const expandedKey of value) {
        if (!prevVSet.has(expandedKey)) {
          if (addedKey !== null) return // multi expand, not triggered by click
          addedKey = expandedKey
        }
      }
      const currentVSet = new Set(value)
      for (const expandedKey of prevValue) {
        if (!currentVSet.has(expandedKey)) {
          if (removedKey !== null) return // multi collapse, not triggered by click
          removedKey = expandedKey
        }
      }
      if (
        (addedKey !== null && removedKey !== null) ||
        (addedKey === null && removedKey === null)
      ) {
        // 1. multi action, not triggered by click
        // 2. no action, don't know what happened
        return
      }
      const { virtualScroll } = props
      const viewportHeight = (
        virtualScroll ? virtualListInstRef.value.listElRef : selfElRef.value
      ).offsetHeight
      const viewportItemCount = Math.ceil(viewportHeight / ITEM_SIZE) + 1
      if (addedKey !== null) {
        // play add animation
        aipRef.value = true
        afNodeRef.value = displayTreeMateRef.value.getFlattenedNodes(prevValue)
        const expandedNodeIndex = afNodeRef.value.findIndex(
          (node) => (node).key === addedKey
        )
        if (~expandedNodeIndex) {
          const expandedChildren = flatten(
            // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
            afNodeRef.value[expandedNodeIndex].children,
            value
          )
          afNodeRef.value.splice(expandedNodeIndex + 1, 0, {
            __motion: true,
            mode: 'expand',
            height: virtualScroll
              ? expandedChildren.length * ITEM_SIZE
              : undefined,
            nodes: virtualScroll
              ? expandedChildren.slice(0, viewportItemCount)
              : expandedChildren
          })
        }
      }
      if (removedKey !== null) {
        // play remove animation
        aipRef.value = true
        afNodeRef.value = displayTreeMateRef.value.getFlattenedNodes(value)
        const collapsedNodeIndex = afNodeRef.value.findIndex(
          (node) => (node).key === removedKey
        )
        if (~collapsedNodeIndex) {
          const collapsedChildren = flatten(
            // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
            afNodeRef.value[collapsedNodeIndex].children,
            value
          )
          afNodeRef.value.splice(collapsedNodeIndex + 1, 0, {
            __motion: true,
            mode: 'collapse',
            height: virtualScroll
              ? collapsedChildren.length * ITEM_SIZE
              : undefined,
            nodes: virtualScroll
              ? collapsedChildren.slice(0, viewportItemCount)
              : collapsedChildren
          })
        }
      }
    })

    const getFIndexRef = computed(() => {
      return createIndexGetter(fNodesRef.value)
    })

    const mergedFNodesRef = computed(() => {
      if (aipRef.value) return afNodeRef.value
      else return fNodesRef.value
    })

    function syncScrollbar() {
      const { value: scrollbarInst } = scrollbarInstRef
      if (scrollbarInst) scrollbarInst.sync()
    }

    function handleAfterEnter() {
      aipRef.value = false
      if (props.virtualScroll) {
        // If virtual scroll, we won't listen to resize during animation, so
        // resize callback of virtual list won't be called and as a result
        // scrollbar won't sync. We need to sync scrollbar manually.
        void nextTick(syncScrollbar)
      }
    }

    function doUpdateExpandedKeys(value) {
      const {
        'onUpdate:expandedKeys': _onUpdateExpandedKeys,
        onUpdateExpandedKeys
      } = props
      uncontrolledExpandedKeysRef.value = value
      if (_onUpdateExpandedKeys) call(_onUpdateExpandedKeys, value)
      if (onUpdateExpandedKeys) call(onUpdateExpandedKeys, value)
    }
    function doUpdateCheckedKeys(value) {
      const {
        'onUpdate:checkedKeys': _onUpdateCheckedKeys,
        onUpdateCheckedKeys
      } = props
      uncontrolledCheckedKeysRef.value = value
      if (onUpdateCheckedKeys) call(onUpdateCheckedKeys, value)
      if (_onUpdateCheckedKeys) call(_onUpdateCheckedKeys, value)
    }
    function doUpdateSelectedKeys(value) {
      const {
        'onUpdate:selectedKeys': _onUpdateSelectedKeys,
        onUpdateSelectedKeys
      } = props
      uncontrolledSelectedKeysRef.value = value
      if (onUpdateSelectedKeys) call(onUpdateSelectedKeys, value)
      if (_onUpdateSelectedKeys) call(_onUpdateSelectedKeys, value)
    }
    // Drag & Drop
    function doDragEnter(info) {
      const { onDragenter } = props
      if (onDragenter) call(onDragenter, info)
    }
    function doDragLeave(info) {
      const { onDragleave } = props
      if (onDragleave) call(onDragleave, info)
    }
    function doDragEnd(info) {
      const { onDragend } = props
      if (onDragend) call(onDragend, info)
    }
    function doDragStart(info) {
      const { onDragstart } = props
      if (onDragstart) call(onDragstart, info)
    }
    function doDragOver(info) {
      const { onDragover } = props
      if (onDragover) call(onDragover, info)
    }
    function doDrop(info) {
      const { onDrop } = props
      if (onDrop) call(onDrop, info)
    }
    function resetDndState() {
      resetDragState()
      resetDropState()
    }
    function resetDragState() {
      draggingNodeRef.value = null
    }
    function resetDropState() {
      droppingOffsetLevelRef.value = 0
      droppingNodeRef.value = null
      droppingMouseNodeRef.value = null
      droppingPositionRef.value = null
      resetDragExpandState()
    }
    function resetDragExpandState() {
      if (expandTimerId) {
        window.clearTimeout(expandTimerId)
        expandTimerId = null
      }
      nodeKeyToBeExpanded = null
    }
    function handleCheck(node, checked) {
      // We don't guard for leaf only since we have done it in view layer
      if (props.disabled || node.disabled) {
        return
      }
      const { checkedKeys } = dataTreeMateRef.value[
        checked ? 'check' : 'uncheck'
      ](node.key, displayedCheckedKeysRef.value, {
        cascade: props.cascade,
        leafOnly: props.leafOnly,
        checkStrategy: mergedCheckStrategyRef.value
      })
      doUpdateCheckedKeys(checkedKeys)
    }
    function toggleExpand(key) {
      if (props.disabled) return
      const { value: mergedExpandedKeys } = mergedExpandedKeysRef
      const index = mergedExpandedKeys.findIndex(
        (expandNodeId) => expandNodeId === key
      )
      if (~index) {
        const expandedKeysAfterChange = Array.from(mergedExpandedKeys)
        expandedKeysAfterChange.splice(index, 1)
        doUpdateExpandedKeys(expandedKeysAfterChange)
      } else {
        const nodeToBeExpanded = displayTreeMateRef.value.getNode(key)
        if (!nodeToBeExpanded || nodeToBeExpanded.isLeaf) {
          return
        }
        doUpdateExpandedKeys(mergedExpandedKeys.concat(key))
      }
    }
    function handleSwitcherClick(node) {
      if (props.disabled || aipRef.value) return
      toggleExpand(node.key)
    }
    function handleSelect(node) {
      if (
        props.disabled ||
        node.disabled ||
        !props.selectable ||
        (props.leafOnly && !node.isLeaf)
      ) {
        return
      }
      pendingNodeKeyRef.value = node.key
      if (props.internalCheckOnSelect) {
        const {
          value: { checkedKeys, indeterminateKeys }
        } = checkedStatusRef
        handleCheck(
          node,
          !(
            checkedKeys.includes(node.key) ||
            indeterminateKeys.includes(node.key)
          )
        )
      }
      if (props.multiple) {
        const selectedKeys = Array.from(mergedSelectedKeysRef.value)
        const index = selectedKeys.findIndex((key) => key === node.key)
        if (~index) {
          if (props.cancelable) {
            selectedKeys.splice(index, 1)
          }
        } else if (!~index) {
          selectedKeys.push(node.key)
        }
        doUpdateSelectedKeys(selectedKeys)
      } else {
        const selectedKeys = mergedSelectedKeysRef.value
        if (selectedKeys.includes(node.key)) {
          if (props.cancelable) {
            doUpdateSelectedKeys([])
          }
        } else {
          doUpdateSelectedKeys([node.key])
        }
      }
    }

    function expandDragEnterNode(node) {
      if (expandTimerId) {
        window.clearTimeout(expandTimerId)
        expandTimerId = null
      }
      // Don't expand leaf node.
      if (node.isLeaf) return
      nodeKeyToBeExpanded = node.key
      const expand = () => {
        if (nodeKeyToBeExpanded !== node.key) return
        const { value: droppingMouseNode } = droppingMouseNodeRef
        if (
          droppingMouseNode &&
          droppingMouseNode.key === node.key &&
          !mergedExpandedKeysRef.value.includes(node.key)
        ) {
          doUpdateExpandedKeys(mergedExpandedKeysRef.value.concat(node.key))
        }
        expandTimerId = null
        nodeKeyToBeExpanded = null
      }
      if (!node.shallowLoaded) {
        expandTimerId = window.setTimeout(() => {
          const { onLoad } = props
          if (onLoad) {
            if (!loadingKeysRef.value.includes(node.key)) {
              loadingKeysRef.value.push(node.key)
              onLoad(node.rawNode)
                .then(() => {
                  loadingKeysRef.value.splice(
                    loadingKeysRef.value.findIndex((key) => key === node.key),
                    1
                  )
                  expand()
                })
                .catch((loadError) => {
                  console.error(loadError)
                  resetDragExpandState()
                })
            }
          } else if (__DEV__) {
            warn(
              'tree',
              'There is unloaded node in data but props.onLoad is not specified.'
            )
          }
        }, 1000)
      } else {
        expandTimerId = window.setTimeout(() => {
          expand()
        }, 1000)
      }
    }

    // Dnd
    function handleDragEnter({ event, node }) {
      // node should be a tmNode
      if (!props.draggable || props.disabled || node.disabled) return
      handleDragOver({ event, node }, false)
      doDragEnter({ event, node: node.rawNode })
    }
    function handleDragLeave({ event, node }) {
      if (!props.draggable || props.disabled || node.disabled) return
      doDragLeave({ event, node: node.rawNode })
    }
    function handleDragLeaveTree(e) {
      if (e.target !== e.currentTarget) return
      resetDropState()
    }
    // Dragend is ok, we don't need to add global listener to reset drag status
    function handleDragEnd({ event, node }) {
      resetDndState()
      if (!props.draggable || props.disabled || node.disabled) return
      doDragEnd({ event, node: node.rawNode })
    }
    function handleDragStart({ event, node }) {
      if (!props.draggable || props.disabled || node.disabled) return
      // Most of time, the image will block user's view
      emptyImage && event.dataTransfer?.setDragImage(emptyImage, 0, 0)
      dragStartX = event.clientX
      draggingNodeRef.value = node
      doDragStart({ event, node: node.rawNode })
    }
    function handleDragOver(
      { event, node },
      emit = true
    ) {
      if (!props.draggable || props.disabled || node.disabled) return
      const { value: draggingNode } = draggingNodeRef
      if (!draggingNode) return
      const { allowDrop, indent } = props
      if (emit) doDragOver({ event, node: node.rawNode })
      // Update dropping node
      const el = event.currentTarget
      const { height: elOffsetHeight, top: elClientTop } =
        el.getBoundingClientRect()
      const eventOffsetY = event.clientY - elClientTop
      let mousePosition

      const allowDropInside = allowDrop({
        node: node.rawNode,
        dropPosition: 'inside',
        phase: 'drag'
      })

      if (allowDropInside) {
        if (eventOffsetY <= 8) {
          mousePosition = 'before'
        } else if (eventOffsetY >= elOffsetHeight - 8) {
          mousePosition = 'after'
        } else {
          mousePosition = 'inside'
        }
      } else {
        if (eventOffsetY <= elOffsetHeight / 2) {
          mousePosition = 'before'
        } else {
          mousePosition = 'after'
        }
      }

      const { value: getFindex } = getFIndexRef

      /** determine the drop position and drop node */
      /** the dropping node needn't to be the mouse hovering node! */
      /**
       * if there is something i've learned from implementing a complex
       * drag & drop. that is never write unit test before you really figure
       * out what behavior is exactly you want.
       */
      let finalDropNode
      let finalDropPosition
      const hoverNodeFIndex = getFindex(node.key)
      if (hoverNodeFIndex === null) {
        resetDropState()
        return
      }

      let mouseAtExpandedNonLeafNode = false
      if (mousePosition === 'inside') {
        finalDropNode = node
        finalDropPosition = 'inside'
      } else {
        if (mousePosition === 'before') {
          if (node.isFirstChild) {
            finalDropNode = node
            finalDropPosition = 'before'
          } else {
            finalDropNode = fNodesRef.value[hoverNodeFIndex - 1]
            finalDropPosition = 'after'
          }
        } else {
          finalDropNode = node
          finalDropPosition = 'after'
        }
      }

      // If the node is non-leaf and it is expanded, we don't allow it to
      // drop after it and change it to drop before its next view sibling
      if (
        !finalDropNode.isLeaf &&
        mergedExpandedKeysRef.value.includes(finalDropNode.key)
      ) {
        mouseAtExpandedNonLeafNode = true
        if (finalDropPosition === 'after') {
          finalDropNode = fNodesRef.value[hoverNodeFIndex + 1]
          if (!finalDropNode) {
            // maybe there is no next view sibling when non-leaf node has no
            // children and it is the last node in the tree
            finalDropNode = node
            finalDropPosition = 'inside'
          } else {
            finalDropPosition = 'before'
          }
        }
      }

      const droppingMouseNode = finalDropNode

      droppingMouseNodeRef.value = droppingMouseNode

      // This is a speacial case, user is dragging a last child itself, so we
      // only view it as they are trying to drop after it.
      // There are some relevant codes in bailout 1's child branch.
      // Also, the expand bailout should have a high priority. If it's non-leaf
      // node and expanded, keep its origin drop position
      if (
        !mouseAtExpandedNonLeafNode &&
        draggingNode.isLastChild &&
        draggingNode.key === finalDropNode.key
      ) {
        finalDropPosition = 'after'
      }

      if (finalDropPosition === 'after') {
        let offset = dragStartX - event.clientX // drag left => > 0
        let offsetLevel = 0
        while (
          offset >= indent / 2 && // divide by 2 to make it easier to trigger
          finalDropNode.parent !== null &&
          finalDropNode.isLastChild &&
          offsetLevel < 1
        ) {
          offset -= indent
          offsetLevel += 1
          finalDropNode = finalDropNode.parent
        }
        droppingOffsetLevelRef.value = offsetLevel
      } else {
        droppingOffsetLevelRef.value = 0
      }

      // Bailout 1
      // Drag self into self
      // Drag it into direct parent
      if (
        draggingNode.contains(finalDropNode) ||
        (finalDropPosition === 'inside' &&
          draggingNode.parent?.key === finalDropNode.key)
      ) {
        if (
          draggingNode.key === droppingMouseNode.key &&
          draggingNode.key === finalDropNode.key
        ) {
          // This is special case that we want ui to show a mark to guide user
          // to start dragging. Nor they will think nothing happens.
          // However this is an invalid drop, we need to guard it inside
          // handleDrop
        } else {
          resetDropState()
          return
        }
      }

      // Bailout 3
      if (
        !allowDrop({
          node: finalDropNode.rawNode,
          dropPosition: finalDropPosition,
          phase: 'drag'
        })
      ) {
        resetDropState()
        return
      }

      if (draggingNode.key === finalDropNode.key) {
        // don't expand when drag on itself
        resetDragExpandState()
      } else {
        if (nodeKeyToBeExpanded !== finalDropNode.key) {
          if (finalDropPosition === 'inside') {
            if (props.expandOnDragenter) {
              expandDragEnterNode(finalDropNode)
              // Bailout 4
              // not try to loading
              if (
                !finalDropNode.shallowLoaded &&
                nodeKeyToBeExpanded !== finalDropNode.key
              ) {
                resetDndState()
                return
              }
            } else {
              // Bailout 5
              // never expands on drag
              if (!finalDropNode.shallowLoaded) {
                resetDndState()
                return
              }
            }
          } else {
            resetDragExpandState()
          }
        } else {
          if (finalDropPosition !== 'inside') {
            resetDragExpandState()
          }
        }
      }
      droppingPositionRef.value = finalDropPosition
      droppingNodeRef.value = finalDropNode
    }
    function handleDrop({ event, node, dropPosition }) {
      if (!props.draggable || props.disabled || node.disabled) {
        return
      }
      const { value: draggingNode } = draggingNodeRef
      const { value: droppingNode } = droppingNodeRef
      const { value: droppingPosition } = droppingPositionRef
      if (!draggingNode || !droppingNode || !droppingPosition) {
        return
      }
      // Bailout 1
      if (
        !props.allowDrop({
          node: droppingNode.rawNode,
          dropPosition: droppingPosition,
          phase: 'drag'
        })
      ) {
        return
      }
      // Bailout 2
      // This is a special case to guard since we want ui to show the status
      // but not to emit a event
      if (draggingNode.key === droppingNode.key) {
        return
      }
      // Bailout 3
      // insert before its next node
      // insert after its prev node
      if (droppingPosition === 'before') {
        const nextNode = draggingNode.getNext({ includeDisabled: true })
        if (nextNode) {
          if (nextNode.key === droppingNode.key) {
            resetDropState()
            return
          }
        }
      }
      if (droppingPosition === 'after') {
        const prevNode = draggingNode.getPrev({ includeDisabled: true })
        if (prevNode) {
          if (prevNode.key === droppingNode.key) {
            resetDropState()
            return
          }
        }
      }

      doDrop({
        event,
        node: droppingNode.rawNode,
        dragNode: draggingNode.rawNode,
        dropPosition
      })
      resetDndState()
    }
    function handleScroll() {
      syncScrollbar()
    }
    function handleResize() {
      syncScrollbar()
    }
    function handleFocusout(e) {
      if (props.virtualScroll || props.internalScrollable) {
        const { value: scrollbarInst } = scrollbarInstRef
        if (scrollbarInst?.containerRef?.contains(e.relatedTarget)) {
          return
        }
        pendingNodeKeyRef.value = null
      } else {
        const { value: selfEl } = selfElRef
        if (selfEl?.contains(e.relatedTarget)) return
        pendingNodeKeyRef.value = null
      }
    }
    watch(pendingNodeKeyRef, (value) => {
      if (value === null) return
      if (props.virtualScroll) {
        virtualListInstRef.value?.scrollTo({ key: value })
      } else if (props.internalScrollable) {
        const { value: scrollbarInst } = scrollbarInstRef
        if (scrollbarInst === null) return
        const targetEl = scrollbarInst.contentRef?.querySelector(
          `[data-key="${createDataKey(value)}"]`
        )
        if (!targetEl) return
        scrollbarInst.scrollTo({
          el: targetEl
        })
      }
    })
    provide(treeInjectionKey, {
      loadingKeysRef,
      highlightKeySetRef: mergedHighlightKeySetRef,
      displayedCheckedKeysRef,
      displayedIndeterminateKeysRef,
      mergedSelectedKeysRef,
      mergedExpandedKeysRef,
      mergedThemeRef: themeRef,
      disabledRef: toRef(props, 'disabled'),
      checkableRef: toRef(props, 'checkable'),
      leafOnlyRef: toRef(props, 'leafOnly'),
      selectableRef: toRef(props, 'selectable'),
      remoteRef: toRef(props, 'remote'),
      onLoadRef: toRef(props, 'onLoad'),
      draggableRef: toRef(props, 'draggable'),
      blockLineRef: toRef(props, 'blockLine'),
      indentRef: toRef(props, 'indent'),
      cascadeRef: toRef(props, 'cascade'),
      droppingMouseNodeRef,
      droppingNodeParentRef,
      draggingNodeRef,
      droppingPositionRef,
      droppingOffsetLevelRef,
      fNodesRef,
      pendingNodeKeyRef,
      internalScrollableRef: toRef(props, 'internalScrollable'),
      internalCheckboxFocusableRef: toRef(props, 'internalCheckboxFocusable'),
      renderLabelRef: toRef(props, 'renderLabel'),
      renderPrefixRef: toRef(props, 'renderPrefix'),
      renderSuffixRef: toRef(props, 'renderSuffix'),
      labelFieldRef: toRef(props, 'labelField'),
      handleSwitcherClick,
      handleDragEnd,
      handleDragEnter,
      handleDragLeave,
      handleDragStart,
      handleDrop,
      handleDragOver,
      handleSelect,
      handleCheck
    })
    const exposedMethods = {
      handleKeydown,
      handleKeyup
    }

    return {
      nodeEvents,
      mergedClsPrefix: mergedClsPrefixRef,
      mergedTheme: themeRef,
      fNodes: mergedFNodesRef,
      aip: aipRef,
      selfElRef,
      virtualListInstRef,
      scrollbarInstRef,
      handleFocusout,
      handleDragLeaveTree,
      handleScroll,
      getScrollContainer,
      getScrollContent,
      handleAfterEnter,
      handleResize,
      cssVars: computed(() => {
        const {
          common: { cubicBezierEaseInOut },
          self: {
            fontSize,
            nodeBorderRadius,
            nodeColorHover,
            nodeColorPressed,
            nodeColorActive,
            arrowColor,
            loadingColor,
            nodeTextColor,
            nodeTextColorDisabled,
            dropMarkColor
          }
        } = themeRef.value
        return {
          '--arrow-color': arrowColor,
          '--loading-color': loadingColor,
          '--bezier': cubicBezierEaseInOut,
          '--font-size': fontSize,
          '--node-border-radius': nodeBorderRadius,
          '--node-color-active': nodeColorActive,
          '--node-color-hover': nodeColorHover,
          '--node-color-pressed': nodeColorPressed,
          '--node-text-color': nodeTextColor,
          '--node-text-color-disabled': nodeTextColorDisabled,
          '--drop-mark-color': dropMarkColor
        }
      }),
      ...exposedMethods
    }
  },
  render() {
    const {
      mergedClsPrefix,
      blockNode,
      blockLine,
      draggable,
      disabled,
      internalFocusable,
      handleKeyup,
      handleKeydown,
      handleFocusout
    } = this
    const mergedFocusable = internalFocusable && !disabled
    const tabindex = mergedFocusable ? '0' : undefined
    const treeClass = [
      `${mergedClsPrefix}-tree-copy`,
      (blockLine || blockNode) && `${mergedClsPrefix}-tree-copy--block-node`,
      blockLine && `${mergedClsPrefix}-tree-copy--block-line`
    ]
    const createNode = tmNode => {
      return '__motion' in tmNode ? (
        <MotionWrapper
          height={tmNode.height}
          nodes={tmNode.nodes}
          clsPrefix={mergedClsPrefix}
          mode={tmNode.mode}
          onAfterEnter={this.handleAfterEnter}
        />
      ) : (
        <NTreeNode
          key={tmNode.key}
          tmNode={tmNode}
          clsPrefix={mergedClsPrefix}
          levelMarkColor={this.levelMarkColor[tmNode.level]}
          contextMenu={
            this.contextLevelMenus[tmNode.level]
              ? this.contextLevelMenus[tmNode.level].map(key => this.contextMenus[key])
              : Object.values(this.contextMenus)
          }
          {...this.nodeEvents}
        />
      )
    }

    if (this.virtualScroll) {
      const { mergedTheme, internalScrollablePadding } = this
      const padding = getPadding(internalScrollablePadding || '0')
      return (
        <NxScrollbar
          ref="scrollbarInstRef"
          onDragleave={draggable ? this.handleDragLeaveTree : undefined}
          container={this.getScrollContainer}
          content={this.getScrollContent}
          class={treeClass}
          theme={mergedTheme.peers.Scrollbar}
          themeOverrides={mergedTheme.peerOverrides.Scrollbar}
          tabindex={tabindex}
          onKeyup={mergedFocusable ? handleKeyup : undefined}
          onKeydown={mergedFocusable ? handleKeydown : undefined}
          onFocusout={mergedFocusable ? handleFocusout : undefined}
        >
          {{
            default: () => (
              <VVirtualList
                ref="virtualListInstRef"
                items={this.fNodes}
                itemSize={ITEM_SIZE}
                ignoreItemResize={this.aip}
                paddingTop={padding.top}
                paddingBottom={padding.bottom}
                style={[
                  this.cssVars,
                  {
                    paddingLeft: padding.left,
                    paddingRight: padding.right
                  }
                ]}
                onScroll={this.handleScroll}
                onResize={this.handleResize}
                showScrollbar={false}
                itemResizable
              >
                {{
                  default: ({ item }) =>
                    createNode(item)
                }}
              </VVirtualList>
            )
          }}
        </NxScrollbar>
      )
    }
    const { internalScrollable } = this
    if (internalScrollable) {
      return (
        <NxScrollbar
          class={treeClass}
          tabindex={tabindex}
          onKeyup={mergedFocusable ? handleKeyup : undefined}
          onKeydown={mergedFocusable ? handleKeydown : undefined}
          onFocusout={mergedFocusable ? handleFocusout : undefined}
          style={this.cssVars}
          contentStyle={{ padding: this.internalScrollablePadding }}
        >
          {{
            default: () => (
              <div
                onDragleave={draggable ? this.handleDragLeaveTree : undefined}
                ref="selfElRef"
              >
                {this.fNodes.map(createNode)}
              </div>
            )
          }}
        </NxScrollbar>
      )
    } else {
      return (
        <div
          class={treeClass}
          tabindex={tabindex}
          ref="selfElRef"
          style={this.cssVars}
          onKeyup={mergedFocusable ? handleKeyup : undefined}
          onKeydown={mergedFocusable ? handleKeydown : undefined}
          onFocusout={mergedFocusable ? handleFocusout : undefined}
          onDragleave={draggable ? this.handleDragLeaveTree : undefined}
        >
          {this.fNodes.map(createNode)}
        </div>
      )
    }
  }
})