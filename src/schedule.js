import { ELEMENT_TEXT, PLACEMENT, TAG_HOST, TAG_ROOT, TAG_TEXT } from "./constants";
import { setProps } from "./utils";

let nextUnitOfWork = null;//下一个工作单元
let workInProgressRoot = null;//RootFiber 的根

/**
 * 从根节点开始渲染和调度
 * 有两个阶段：
 * 1.diff阶段（render阶段），对比新旧的虚拟DOM，进行增量，更新或者创建
 * 这个阶段比较花时间，可以对任务进行拆分，拆分的维度虚拟DOM，这个阶段可以暂停
 * render阶段成果是effect list，知道那些节点更新，那些节点删除了，那些节点增加了
 * 2.commit阶段，进行DOM更新创建阶段，此阶段不能暂停，必须要一气呵成，不然页面会出现UI不连续的问题
 * @param {*} rootFiber 根Fiber
 */
export function scheduleRoot(rootFiber){
  nextUnitOfWork = rootFiber
  workInProgressRoot = rootFiber
}

/**循环执行 */
function workLoop(deadline){
  let shouldYield = false;//是否需要让出控制权
  if(!shouldYield && nextUnitOfWork){
    while(nextUnitOfWork){
      nextUnitOfWork = performUnitOfWork(nextUnitOfWork);
      //没有可用时间，让出控制权
      shouldYield = deadline.timeRemaining() < 1
    }
  }
  if(!nextUnitOfWork){
    console.log("render阶段完成")
  }
  //每帧都执行调度，形成死循环，这样在程序一开始的时候就会一直执行
  requestIdleCallback(workLoop,{timeout:1000})
}

/**处理fiber节点的子节点 */
function performUnitOfWork(currentFiber){
  beginWork(currentFiber)
  if(currentFiber.child){
    return currentFiber.child
  }
  //没有子节点需要处理的时候，该节点处理完成
  while(currentFiber){
    //currentFiber处理完成
    completeUnitWork(currentFiber);
    if(currentFiber.sibling){
      return currentFiber.sibling
    }
    currentFiber = currentFiber.return
  }
}

/**开始对当前fiber进行处理
 * 
 * 通过虚拟DOM创建子fiber
 * 创建真实DOM元素
 */
function beginWork(currentFiber){
  if(currentFiber.tag === TAG_ROOT){
    //根fiber
    updateHostRoot(currentFiber);
  }else if(currentFiber.tag === TAG_TEXT){
    //文本
    updateHostText(currentFiber);
  }else if(currentFiber.tag === TAG_HOST){
    //原生元素
    updateHost(currentFiber)
  }
}

/**处理原生Fiber 生成真实DOM */
function updateHost(currentFiber){
  if(!currentFiber.stateNode){
    currentFiber.stateNode = createDOM(currentFiber);
  }
  const newChildren = currentFiber.props.children;
  reconcileChildren(currentFiber,newChildren);
}

/**处理文本fiber */
function updateHostText(currentFiber){
  if(!currentFiber.stateNode){
    //还没有创建真实DOM
    currentFiber.stateNode = createDOM(currentFiber);
  }
}

/**创建真实DOM */
function createDOM(currentFiber){
  if(currentFiber.tag === TAG_TEXT){
    return document.createTextNode(currentFiber.props.text);
  }else if(currentFiber.tag === TAG_HOST){
    let stateNode = document.createElement(currentFiber.type)
    updateDOM(stateNode,{},currentFiber.props);
    return stateNode
  }
}

/**更新dom属性 */
function updateDOM(stateNode,oldProps,newProps){
  setProps(stateNode,oldProps,newProps)
}

/**处理根fiber
*/
function updateHostRoot(currentFiber){
  let newChildren = currentFiber.props.children;//这里children还是一个 虚拟DOM
  reconcileChildren(currentFiber,newChildren);
}
/**协调子节点，通过虚拟DOM创建子fiber
 */
function reconcileChildren(currentFiber,newChildren){
  let newChildIndex = 0;//新子节点索引
  let pervSibling;//上一个新的子fiber
  while(newChildIndex < newChildren.length){
    let newChild = newChildren[newChildIndex];
    let tag;
    if(newChild.type === ELEMENT_TEXT){
      tag = TAG_TEXT;//文本节点
    }else if(typeof newChild.type === 'string'){
      tag = TAG_HOST;//如果type是一个字符串，type:"div" 那么是一个原生DOM节点
    }
    let newFiber = {
      tag,
      type:newChild.type,//元素的类型，标签名或者 ELEMENT_TEXT
      props:newChild.props,
      stateNode:null,//当前节点的真实DOM
      return:currentFiber,//父Fiber
      effectTag:PLACEMENT,//副作用标记，render阶段收集副作用，作用对该节点做增加、删除、更改等操作
      nextEffect:null,//effect list也是一个单链表，链表的顺序和完成的顺序一致
    }
    if(newFiber){
      if(newChildIndex === 0){
        currentFiber.child = newFiber
      }else{
        pervSibling.sibling = newFiber
      }
      pervSibling = newFiber
    }
    newChildIndex++;
  }
}
/**当前fiber节点处理完成
 * 
 * 收集有副作用的fiber，然后组成effect list
 */
function completeUnitWork(fiber){}

requestIdleCallback(workLoop,{timeout:1000})