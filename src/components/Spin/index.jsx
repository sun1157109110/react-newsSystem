import React from "react";
import classNames from "classnames";
import "./index.css";
/**
 * Spin组件
 * @param {isLoading} bool 加载中状态，默认为true
 * @param {loadingText} string 加载状态的文本
 * @param {hiddenText} bool 是否隐藏加载状态的文本
 * @param {type} string spin的类型，ball|line
 * @param {spinColor} string 加载动画颜色
 */

export default function Spin(props) {
  const spinType = { line: "line" };
  const {
    isLoading = true,
    type,
    loadingText = "正在加载中",
    hiddenText = false,
    spinColor = "#06c",
  } = props;

  return isLoading ? (
    <div className="loadingWrap">
      <div className={classNames('loadInner','ballSpinFadeLoad',spinType[type])} style={{backgroundColor:spinColor}}>
          <div></div>
          <div></div>
          <div></div>
          <div></div>
          <div></div>
          <div></div>
          <div></div>
          <div></div>
      </div>
      {!hiddenText&&<p className="loadingText">{loadingText}</p>}
    </div>
  ) : null;
}
