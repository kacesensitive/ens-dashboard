import React from "react";
import styles from "./BigNumber.module.css";

interface BigNumberProps {
  title: string;
  className?: string;
  number: number | string;
}

const BigNumber: React.FC<BigNumberProps> = ({ title, number, className }) => {
  return (
    <div className={`${styles.container} ${className}`}>
      <h2 className={styles.title}>{title}</h2>
      <p className={styles.number}>{number}</p>
    </div>
  );
};

export default BigNumber;
