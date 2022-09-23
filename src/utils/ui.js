import { event } from "./event"

/**
 * 预览图片
 * @param {*} images 图片列表
 * @param {*} current 当前展示图片
 * @returns 
 */
export const imagePreview = (images, current) => {
  event.emit('image-preview-show', {
    images,
    current
  })
}