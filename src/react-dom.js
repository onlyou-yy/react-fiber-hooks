import {TAG_ROOT} from "./constants"
import { scheduleRoot } from "./schedule";
/**
 * 将一个元素渲染到一个容器内部
 * @param {*} element 元素 
 * @param {*} container 容器
 */
function render(element,container){
  // 根fiber
  let rootFiber = {
    tag:TAG_ROOT,//每个fiber会有一个tag标识，此元素表示元素的类型，
    stateNode:container,//一般情况下如果这个元素是一个原生节点的话，stateNode指向真实DOM元素
    props:{//children 是一个数组，里面放的是React元素，虚拟DOM 后面会根据每个React元素创建对应的Fiber
      children:[element],//要渲染的元素
    }
  }
  // 调度
  scheduleRoot(rootFiber)
}

const ReactDom = {
  render
}

export default ReactDom;
