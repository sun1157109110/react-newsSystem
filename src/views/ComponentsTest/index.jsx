import React from "react";
import styles from "./index.module.css";
import Button from "../../components/Button";

export default function ComponentsTest() {
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
    </div>
  );
}
