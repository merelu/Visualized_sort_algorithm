import styles from "../styles/Home.module.css";
import { range, shuffle } from "lodash";
import { useState } from "react";

const getArr = () => {
  return shuffle(range(1, 11));
};
const swap = (arr: number[], a: number, b: number) => {
  const tmp = arr[a];
  arr[a] = arr[b];
  arr[b] = tmp;
};
const sort = (arr: number[]) => {
  //https://en.wikipedia.org/wiki/Insertion_sort
  let i = 1;
  while (i < arr.length) {
    let j = i;
    while (j > 0 && arr[j - 1] > arr[j]) {
      swap(arr, j, j - 1);
      j = j - 1;
    }
    i = i + 1;
  }
};

export default () => {
  const [arr, setArr] = useState(getArr());

  const handleShuffle = () => {
    setArr(getArr());
  };
  const handleSort = () => {
    const sortedArr = [...arr];
    sort(sortedArr);
    setArr(sortedArr);
  };
  return (
    <>
      <div className={styles.board}>{arr.join(",")}</div>

      <div className={styles.buttonBox}>
        <button onClick={handleShuffle}>shuffle</button>
        <button onClick={handleSort}>sort</button>
      </div>
    </>
  );
};
