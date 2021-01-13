import styles from "../styles/Home.module.css";

const arr = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

export default () => {
  return (
    <>
      <div className={styles.board}>{arr.join(",")}</div>

      <div className={styles.buttonBox}>
        <button>shuffle</button>
        <button>sort</button>
      </div>
    </>
  );
};
