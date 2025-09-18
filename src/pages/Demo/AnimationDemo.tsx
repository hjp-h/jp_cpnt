import { Card } from "antd";
import InfiniteScroll from "../../components/InfiniteScroll";
import styles from "./index.module.scss";
import Barrage from "../../components/Barrage";
import RollingNumber from "../../components/RollingNumber";

import NUM0 from "./img/0.png";
import NUM1 from "./img/1.png";
import NUM2 from "./img/2.png";
import NUM3 from "./img/3.png";
import NUM4 from "./img/4.png";
import NUM5 from "./img/5.png";
import NUM6 from "./img/6.png";
import NUM7 from "./img/7.png";
import NUM8 from "./img/8.png";
import NUM9 from "./img/9.png";
const numImages = [
  NUM0,
  NUM1,
  NUM2,
  NUM3,
  NUM4,
  NUM5,
  NUM6,
  NUM7,
  NUM8,
  NUM9,
  NUM0,
];
export default function AnimationDemo() {
  return (
    <div className={styles.AnimationDemo}>
      <Card title="无限滚动" style={{ width: "100%" }}>
        <InfiniteScroll />
      </Card>
      <Card title="弹幕" style={{ width: "100%" }}>
        <Barrage />
      </Card>
      <Card title="滚动数字" style={{ width: "100%" }}>
        <RollingNumber
          num={8434161}
          numWidth={62}
          numHeight={107}
          numImages={numImages}
          digitLength={8}
          duration={1500}
        />
      </Card>
    </div>
  );
}
