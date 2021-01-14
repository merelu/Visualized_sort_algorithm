import styles from "../styles/Home.module.css";
import { range, shuffle } from "lodash";
import { Dispatch, SetStateAction, useState, memo } from "react";
const SIZE = 10;
const DURATION = 40;
const BAR_WIDTH = 20;
const BAR_MARGIN = 2;
type TSet = Dispatch<SetStateAction<any>>;

const getArr = () => {
  return shuffle(range(1, SIZE + 1));
};

const getX = (idx: number) => idx * (BAR_WIDTH + BAR_MARGIN);

const swap = (arr: number[], a: number, b: number) => {
  const tmp = arr[a];
  arr[a] = arr[b];
  arr[b] = tmp;
};

const delaySet = (value: any, setValue: TSet) =>
  new Promise((resolve) => {
    setValue(value);
    setTimeout(resolve, DURATION);
  });

const sort = async (
  arr: number[],
  setArr: TSet,
  setIdxI: TSet,
  setIdxJ: TSet
) => {
  //https://en.wikipedia.org/wiki/Insertion_sort
  let i = 1;
  while (i < arr.length) {
    let j = i;
    delaySet(j, setIdxJ);
    while (j > 0 && arr[j - 1] > arr[j]) {
      swap(arr, j, j - 1);
      await delaySet([...arr], setArr);
      j = j - 1;
      await delaySet(j, setIdxJ);
    }
    i = i + 1;
    await delaySet(i, setIdxI);
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
    transform: `translateX(${getX(idx)}px)`,
  };
  return <div style={style} className={styles.bar} />;
}
interface IPropsBoard {
  arr: number[];
}
const areArrEqual = (oldProps: IPropsBoard, props: IPropsBoard) => {
  return oldProps.arr === props.arr;
};
function Board(props: IPropsBoard) {
  const { arr } = props;
  return (
    <div className={styles.board}>
      {arr.map((value, i) => {
        console.log("render Bar");
        return <Bar key={i} value={value} idx={i}></Bar>;
      })}
    </div>
  );
}

const MemorizedBoard = memo(Board, areArrEqual);

export default () => {
  const [onOff, setOnOff] = useState("on");
  const [arr, setArr] = useState(getArr());
  const [idxI, setIdxI] = useState(1);
  const [idxJ, setIdxJ] = useState(1);
  const [isRunning, setIsRunning] = useState(false);
  const handleShuffle = () => {
    setIdxI(1);
    setIdxJ(1);
    setArr(getArr());
  };
  const handleSort = async () => {
    setIsRunning(true);
    await sort(arr, setArr, setIdxI, setIdxJ);
    setIsRunning(false);
  };

  const handleOnOff = () => setOnOff(onOff === "on" ? "off" : "on");
  return (
    <>
      <MemorizedBoard arr={arr} />
      <div className={styles.buttonBox}>
        <div
          style={{
            transform: `translateX(${getX(idxI)}px)`,
            backgroundColor: "blue",
            color: "white",
          }}
          className={styles.index}
        >
          i
        </div>
        <div
          style={{
            transform: `translateX(${getX(idxJ)}px)`,
            backgroundColor: "yellow",
            color: "black",
          }}
          className={styles.index}
        >
          j
        </div>
        {<button onClick={handleOnOff}>{onOff}</button>}
        {!isRunning && <button onClick={handleShuffle}>shuffle</button>}
        {!isRunning && <button onClick={handleSort}>sort</button>}
        {isRunning && <div className={styles.running}>Running...</div>}
      </div>
    </>
  );
};
