import React from "react";
import styles from "./PowerFlame.module.css";

export const PowerFlame = ({ children }) => {
  return (
    <div className={styles.background}>
      <div className={styles.powerFlame}>{children}</div>
    </div>
  );
};
