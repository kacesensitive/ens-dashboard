import React from "react";
import styles from "./Versus.module.css";

interface VersusNumberProps {
  title: string;
  titleOne: string;
  titleTwo: string;
  className?: string;
  numberOne: number | string;
  numberTwo: number | string;
}

const VersusNumber: React.FC<VersusNumberProps> = ({
  title,
  titleOne,
  titleTwo,
  numberOne,
  numberTwo,
  className,
}) => {
  return (
    <div className={`${styles.versusContainer} ${className}`}>
      <h2 className={styles.title}>{title}</h2>
      <div className={styles.tLayout}>
        <div className={styles.numberContainer}>
          <h3 className={styles.title}>{titleOne}</h3>
          <p className={styles.number}>{numberOne}</p>
        </div>
        <div className={styles.numberContainer}>
          <h3 className={styles.title}>{titleTwo}</h3>
          <p className={styles.number}>{numberTwo}</p>
        </div>
      </div>
    </div>
  );
};

export default VersusNumber;
