import React from "react";
import styles from "./styles.module.css";

export default function Table({ name, rows }) {
  return (
    <div className={styles.tableContainer}>
      <table>
        <thead>
          <tr>
            <td>
              <span>{name}</span>
            </td>
          </tr>
        </thead>
        <tbody>
          {rows.map(row => {
            return (
              <tr key={`${name}_${row.name}`}>
                <td>
                  <div className={styles.row}>
                    <span>{row.name}</span>
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
