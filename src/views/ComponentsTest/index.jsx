import React, { useState } from "react";
import styles from "./index.module.css";
import Button from "../../components/Button";
import Drawer from "../../components/Drawer";
import Tag from "../../components/Tag";
import Progress from "../../components/Progress";

export default function ComponentsTest() {
  const [isDrawerVisible, setIsDrawerVisible] = useState(false);
  const handleClick = () => {
    setIsDrawerVisible(true);
  };
  const handleMask = () => {
    setIsDrawerVisible(false);
  };
  return (
    <div className={styles.testWrap}>
      <div className={styles.btnTest}>
        <Button type="primary">primary</Button>
        <Button type="warning">warning</Button>
        <Button type="danger">danger</Button>
        <Button type="default">default</Button>
        <Button type="pure">pure</Button>
        <Button type="primary" shape="circle">
          primary&circle
        </Button>
        <Button type="primary" shape="circle" block className={styles.btn}>
          primary&block&circle
        </Button>
        <Button type="danger" block className={styles.btn}>
          danger&block
        </Button>
      </div>
      <Button
        type="confirm"
        shape="circle"
        block
        className={styles.btn}
        onClick={handleClick}
      >
        点击跳出抽屉
      </Button>
      {/* 抽屉 */}
      <Drawer isVisible={isDrawerVisible} onClose={handleMask}>
        <h4>这是一个抽屉</h4>
      </Drawer>
      <div className="tagContainer">
        <Tag closable={true}>这是个标签</Tag>
        <Tag color="red">哈哈哈哈</Tag>
        <Tag color="deepSkyBlue" closable={true}>
          这是个可关闭的有颜色的标签
        </Tag>
      </div>
      <div className={styles.progressContainer}>
        <Progress
          className="progress"
          percent={30}
          width={725}
          barColor="deepskyblue"
        ></Progress>
      </div>
    </div>
  );
}