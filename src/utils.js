/**设置DOM属性 */
export function setProps(dom,oldProps,newProps){
  for(let key in oldProps){
  
  }
  for(let key in newProps){
    if(key !== 'children'){
      setProp(dom,key,newProps[key])
    }
  }
}

function setProp(dom,key,value){
  if(/^on/.test(key)){//事件
    dom[key.toLowerCase()] = value;
  }else if(key === 'style'){//样式
    for(let styleName in value){
      dom.style[styleName] = value[styleName]
    }
  }else {//其他属性 class data-x url 等
    dom.setAttribute(key,value);
  }
}