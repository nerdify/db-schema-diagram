import React, { useEffect } from "react";
import { jsPlumb } from "jsplumb";

import Table from "../table/";

import styles from "./styles.module.css";

export default function Canvas({ tables }) {
  useEffect(() => {
    jsPlumb.ready(function() {
      var jsPlumbInstance = jsPlumb.getInstance();

      jsPlumbInstance.setContainer("canvas");
      console.log(tables.map(table => `table_${table.name}`));
      jsPlumbInstance.draggable(tables.map(table => `table_${table.name}`));
    });
  }, []);

  return (
    <div id="canvas" className={styles.canvas}>
      {tables.map(table => {
        return (
          <Table
            id={`table_${table.name}`}
            key={`table_${table.name}`}
            {...table}
          />
        );
      })}
    </div>
  );
}
