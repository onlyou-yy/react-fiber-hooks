import { ELEMENT_TEXT } from "./constants";

/**
 * 创建元素（虚拟DOM）
 * @param {*} type 元素的类型，div、span
 * @param {*} config 配置对象 属性 key  ref
 * @param  {...any} children 子元素，数组
 */
function createElement(type,config,...children){
  //调试使用
  delete config.__self;
  delete config.__source;//表示这个元素在哪行哪咧哪个文件生成的
  return {
    type,
    props:{
      ...config,
      children:children.map(child => {
        // 如果是一个对象表示这是一个虚拟DOM，否则是一个文本节点
        return typeof child === 'object' ? child : {
          type:ELEMENT_TEXT,
          props:{
            children:{text:child,children:[]}
          }
        }
      })
    }
  }
}

const React = {
  createElement
}
export default React