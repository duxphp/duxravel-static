import {Processor} from "windicss/lib";
import {HTMLParser} from "windicss/utils/parser";


/**
 * 执行定时时间后的异步任务
 * @param {number} time 毫秒
 */
const asyncTimeOut = time => {
  let resolveFunc
  let rejectFunc
  const pro = new Promise((resolve, reject) => {
    resolveFunc = resolve
    rejectFunc = reject
  })
  const timer = setTimeout(() => resolveFunc({ code: 200, message: '倒计时结束', type: 'timeout' }), time)
  pro.clear = () => {
    clearTimeout(timer)
    rejectFunc({ code: 500, message: '清除倒计时' })
  }
  return pro
}

/**
 * 生成style
 * @param html
 * @returns {string}
 */
const generateStyles = html => {
  // 获取 windi processor
  const processor = new Processor();

  // 解析所有的 classes 并将它们放到一行来简化操作
  const htmlClasses = new HTMLParser(html)
    .parseClasses()
    .map((i) => i.result)
    .join(" ");

  // 基于我们传入的 html 生成预检样式
  const preflightSheet = processor.preflight(html);

  // 将 html classes 处理为一个可解释的样式表
  const interpretedSheet = processor.interpret(htmlClasses).styleSheet;

  // 构建样式
  const APPEND = false;
  const MINIFY = false;
  const styles = interpretedSheet.extend(preflightSheet, APPEND).build(MINIFY);

  return styles;
}

export {
  generateStyles,
  asyncTimeOut
}