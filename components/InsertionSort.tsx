import styles from "../styles/Home.module.css";
import { range, shuffle } from "lodash";
import { useState } from "react";

const getArr = () => {
  return shuffle(range(1, 11));
};

export default () => {
  const [arr, setArr] = useState(getArr());

  const handleShuffle = () => {
    setArr(getArr());
  };
  return (
    <>
      <div className={styles.board}>{arr.join(",")}</div>

      <div className={styles.buttonBox}>
        <button onClick={handleShuffle}>shuffle</button>
        <button>sort</button>
      </div>
    </>
  );
};
