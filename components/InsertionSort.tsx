import styles from "../styles/Home.module.css";
import { range, shuffle } from "lodash";
import { useState } from "react";
const SIZE = 30;
const getArr = () => {
  return shuffle(range(1, SIZE + 1));
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
interface IPropsBar {
  value: number;
  idx: number;
}
function Bar(props: IPropsBar) {
  const { value, idx } = props;
  const style = {
    height: value * 10,
    transform: `translateX(${idx * 21}px)`,
  };
  return <div style={style} className={styles.bar} />;
}

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
      <div className={styles.board}>
        {arr.map((value, i) => (
          <Bar key={i} value={value} idx={i}></Bar>
        ))}
      </div>

      <div className={styles.buttonBox}>
        <button onClick={handleShuffle}>shuffle</button>
        <button onClick={handleSort}>sort</button>
      </div>
    </>
  );
};
