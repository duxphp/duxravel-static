import {
  baseCompile
} from "@vue/compiler-dom";
import { parse as babelParse } from '@babel/parser'
import { compile } from 'vue/dist/vue.cjs.js'
import { render, hydrate, } from '@vue/runtime-dom'
import { getComp } from '../utils/router'
import { asyncTimeOut } from '../utils/util'

const getCompObj = script => {
  const ast = babelParse(script, {
    sourceType: 'module',
  }).program.body

  let comp
  for (const node of ast) {
    if (
      node.type === 'ExportDefaultDeclaration' &&
      node.declaration.type === 'ObjectExpression'
    ) {
      comp = node.declaration
    }
  }
  if (!comp) {
    return {}
  }
  return (new Function('return ' + script.substr(comp.start, comp.end - comp.start)))()
}

const getXmlByTagName = (xml, name, cursor = 0) => {
  const startIndex = xml.indexOf('<' + name, cursor)
  if (!~startIndex) {
    return
  }
  cursor = startIndex + 1
  let endIndex = -1
  let level = 0
  while (!~endIndex) {
    // 查找下一个开始和结束标签
    const nextEnd = xml.indexOf('</' + name, cursor)
    const nextStart = xml.indexOf('<' + name, cursor)
    if (~nextEnd && ~nextStart) {
      // 下一个开始标签在结束标签之后
      if (nextEnd < nextStart) {
        if (level === 0) {
          endIndex = nextEnd
        } else {
          cursor = nextEnd + 1
          level--
        }
      } else {
        cursor = nextStart + 1
        level++
      }
    } else if (~nextStart) {
      console.error('xml结构错误')
      return
    } else if (~nextEnd) {
      if (level === 0) {
        endIndex = nextEnd
      } else {
        console.error('xml结构错误')
        return
      }
    } else {
      return
    }
  }
  // 获取标签属性
  const attrEnd = pageData.indexOf('>', startIndex)
  const attr = pageData.substr(startIndex + name.length + 2, attrEnd - (startIndex + name.length + 2))
  const data = {
    attr: attr ? Object.fromEntries(attr
      .split(' ')
      .map(item => item
        .split('=')
        .map((name, index) => index === 1 ? name.replace(/[\"\']/g, '') : name)
      )
    ) : {},
    child: pageData.substr(attrEnd + 1, endIndex - startIndex - 1),
    nextStart: attrEnd
  }
  return data
}

const getXmlByTagNames = (xml, name, cursor, arr = []) => {
  const data = getXmlByTagName(xml, name, cursor)
  if (data) {
    arr.push(data)
    return getXmlByTagNames(xml, name, data.nextStart, arr)
  }
  return arr
}

export const getArr = async () => {

  console.time()
  // const comp = getCompObj(arr[1])
  console.log(getXmlByTagNames(pageData, 'template'))
  console.timeEnd()
  // return comp
}



export const pageData = `
<script src="https://unpkg.com/vue@3"></script>
<script src="https://unpkg.com/sortablejs@1"></script>
<script src="https://unpkg.com/vuedraggable@4"></script>
<template>
  <div class="p-5">
    <div class="mb-3">
      <div class="flex items-center">
        <div class="flex-grow">
          <a href="javascript:window.history.back();" class="text-xs items-center text-gray-500 hidden lg:flex">
            <svg xmlns="http://www.w3.org/2000/svg" class="icon w-5 h-5" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round">
              <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
              <line x1="5" y1="12" x2="19" y2="12"></line>
              <line x1="5" y1="12" x2="11" y2="18"></line>
              <line x1="5" y1="12" x2="11" y2="6"></line>
            </svg>
            返回
          </a>
          <div class="text-lg lg:text-xl">
            流程设计
          </div>
        </div>
        <div class="flex-none items-center hidden lg:flex gap-2">
          <button class="btn-blue page-submit" type="submit">
            保存
          </button>
        </div>
      </div>
    </div>

    <div class="w-full py-5 px-4 bg-white shadow" style="height: calc(100vh - 160px)" id="container"></div>
    <n-modal v-model:show="dialogShow">
      <n-card class="max-w-4xl my-4" content-style="padding: 0;">
        <component is="node-edit-form"></component>
      </n-card>
    </n-modal>
  </div>
</template>

<script>
  export default {
    data: () => {
      return {
        dialogShow: false
      }
    },
    mounted() {
      window.showNodeEditForm = (type = true) => {
        this.dialogShow = type
      }
      window.initLogicFlow({
        typeForm: {
          start: {
            ownerList: @json($ownerList),
            superList: @json($superList),
            projectList: @json($projectList)
          }
        }
      })
    }
  }
</script>

<script src="{{asset('static/work/app.js')}}"></script>
<script src="{{asset('static/work/form/design.js')}}"></script>
<script src="{{asset('static/work/form/comp.js')}}"></script>

`