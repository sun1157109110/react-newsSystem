import React from "react";
import ReactDOM from 'react-dom';
import { useEffect } from "react";
import "./index.css";

let instance = null;
export default function Position(props) {
  let { onNotVisibleArea, targetRef, getContainer, children } = props;
  const container = getContainer&&getContainer();
   //如果下拉框容器不存在 就创建一个
   if (!instance) {
    instance = document.createElement("div");
    instance.className = "ll-position";
    document.body.appendChild(instance);
  };
  //更新下拉框位置的方法
  const setInstance = () => {
    const { left, top, height } = targetRef.current.getBoundingClientRect();
    const style = {
      top: document.documentElement.scrollTop + top + height + "px",
      left: document.documentElement.scrollLeft + left + "px",
    };
    instance.style.top = style.top;
    instance.style.left = style.left;
    return {top,left,height}
  };
  const handleScroll = ()=>{
    let {top,height} = setInstance();
    if(container.offsetTop-top>0||top+height-container.offsetTop>container.offsetHeight){
      onNotVisibleArea()
    }
}
  useEffect(() => {
    instance && setInstance();
    if(container){
      container.addEventListener('scroll',handleScroll,false)
    };
    return ()=>{
      if(container){
        container.removeEventListener('scroll',handleScroll,false)
      };
    }
  }, [container,handleScroll,setInstance]);
 
  //将选择项添加到instance的最后面,渲染成react元素 之后render
  return  instance&&ReactDOM.createPortal(children,instance);
}
