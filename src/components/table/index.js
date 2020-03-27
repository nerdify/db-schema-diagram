import React from "react";
import styles from "./styles.module.css";

export default function Table({ name, columns }) {
  const getType = ({ type, size = null }) => {
    const sizeDefinition = size ? `(${size})` : "";
    return `${type} ${sizeDefinition}`;
  };

  return (
    <div id={`table_${name}`} className={styles.tableContainer}>
      <table border="0" cellPadding="0" cellSpacing="0">
        <thead>
          <tr>
            <td>
              <span className={styles.tableName}>{name}</span>
            </td>
          </tr>
        </thead>
        <tbody>
          {columns.map(column => {
            return (
              <tr key={`${name}_${column.name}`}>
                <td>
                  <div
                    id={`column_${name}_${column.name}`}
                    className={styles.column}
                  >
                    <span className={styles.columnName}>{column.name}</span>
                    <small className={styles.columnType}>
                      {getType(column)}
                    </small>
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
