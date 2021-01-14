import styles from "../styles/Home.module.css";
import { range, shuffle } from "lodash";
import {
  Dispatch,
  SetStateAction,
  useState,
  memo,
  MutableRefObject,
  useRef,
  useEffect,
} from "react";
const SIZE = 30;
const DURATION = 40;
const BAR_WIDTH = 20;
const BAR_MARGIN = 2;
type TSet = Dispatch<SetStateAction<any>>;

const getArr = () => {
  return shuffle(range(1, SIZE + 1));
};
const initArr = range(1, SIZE + 1).map(() => 1);

const getX = (idx: number) => idx * (BAR_WIDTH + BAR_MARGIN);

const swap = (arr: IExtendedBar[], a: number, b: number) => {
  const tmp = arr[a];
  arr[a] = arr[b];
  arr[b] = tmp;
};

const delaySet = (value: number, set: TSet) =>
  new Promise((resolve) => {
    set(value);
    setTimeout(resolve, DURATION);
  });

interface IExtendedBar {
  value: number;
  refSetX: MutableRefObject<TSet>;
}

const sort = async (
  extendedBarArr: IExtendedBar[],
  setArr: TSet,
  setIdxI: TSet,
  setIdxJ: TSet
) => {
  //https://en.wikipedia.org/wiki/Insertion_sort
  let i = 1;
  while (i < extendedBarArr.length) {
    let j = i;
    await delaySet(j, setIdxJ);
    while (j > 0 && extendedBarArr[j - 1].value > extendedBarArr[j].value) {
      await Promise.all([
        delaySet(getX(j - 1), extendedBarArr[j].refSetX.current),
        delaySet(getX(j), extendedBarArr[j - 1].refSetX.current),
      ]);
      swap(extendedBarArr, j, j - 1);

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
  refSetX: MutableRefObject<TSet>;
}
function Bar(props: IPropsBar) {
  const { value, idx, refSetX } = props;
  const [x, setX] = useState(getX(idx));
  const style = {
    height: value * 10,
    transform: `translateX(${x}px)`,
  };
  refSetX.current = setX;
  return <div style={style} className={styles.bar} />;
}
interface IPropsBoard {
  arr: number[];
  refExtendedBarArr: MutableRefObject<IExtendedBar[]>;
}
const areArrEqual = (oldProps: IPropsBoard, props: IPropsBoard) => {
  return oldProps.arr === props.arr;
};
function Board(props: IPropsBoard) {
  const { arr, refExtendedBarArr } = props;
  const extendedBarArr = arr.map((value) => ({
    value,
    refSetX: useRef<TSet>(null),
  }));
  useEffect(() => {
    refExtendedBarArr.current = extendedBarArr;
  }, [arr]);
  return (
    <div className={styles.board}>
      {extendedBarArr.map((item, i) => {
        console.log("render Bar");
        return (
          <Bar key={i} value={item.value} idx={i} refSetX={item.refSetX}></Bar>
        );
      })}
    </div>
  );
}

const MemorizedBoard = memo(Board, areArrEqual);

export default () => {
  const [onOff, setOnOff] = useState("on");
  const [arr, setArr] = useState(initArr);
  const [idxI, setIdxI] = useState(1);
  const [idxJ, setIdxJ] = useState(1);
  const [isRunning, setIsRunning] = useState(false);
  const refExtendedBarArr = useRef<IExtendedBar[]>([]);
  useEffect(() => setArr(getArr()), []);
  const handleShuffle = () => {
    setIdxI(1);
    setIdxJ(1);
    setArr(getArr());
  };
  const handleSort = async () => {
    setIsRunning(true);
    await sort(refExtendedBarArr.current, setArr, setIdxI, setIdxJ);
    setIsRunning(false);
  };

  const handleOnOff = () => setOnOff(onOff === "on" ? "off" : "on");
  return (
    <>
      <MemorizedBoard arr={arr} refExtendedBarArr={refExtendedBarArr} />
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
