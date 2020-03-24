import React from "react";
import styles from "./styles.module.css";

export default function Table({ name, rows }) {
  const getType = ({ type, size = null }) => {
    const sizeDefinition = size ? `(${size})` : "";
    return `${type} ${sizeDefinition}`;
  };

  return (
    <div id={`table_${name}`} className={styles.tableContainer}>
      <table>
        <thead>
          <tr>
            <td>
              <span className={styles.tableName}>{name}</span>
            </td>
          </tr>
        </thead>
        <tbody>
          {rows.map(row => {
            return (
              <tr key={`${name}_${row.name}`}>
                <td>
                  <div id={`row_${name}_${row.name}`} className={styles.row}>
                    <span className={styles.rowName}>{row.name}</span>
                    <small className={styles.rowType}>{getType(row)}</small>
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
