import { Card } from "antd";
import InfiniteScroll from "../../components/InfiniteScroll";
import styles from "./index.module.scss";
import Barrage from "../../components/Barrage";
export default function AnimationDemo() {
  return (
    <div className={styles.AnimationDemo}>
      <Card title="无限滚动" style={{ width: "100%" }}>
        <InfiniteScroll />
      </Card>
      <Card title="弹幕" style={{ width: "100%" }}>
        <Barrage />
      </Card>
    </div>
  );
}
