import React, { useEffect, useRef } from "react";
import { jsPlumb } from "jsplumb";
import dagre from "dagre";

import Table from "../table/";

import styles from "./styles.module.css";

const arrangeItems = (tables, refs) => {
  const g = new dagre.graphlib.Graph();
  const tableCoords = {};

  g.setGraph({ directed: true });
  g.setDefaultEdgeLabel(function () {
    return {};
  });

  tables.forEach(({ name, columns, x, y }) => {
    const node = {
      label: `table_${name}`,
      width: 200,
      height: 25.6 + 24.8 * columns.length,
    };

    g.setNode(`table_${name}`, node);
  });

  refs.forEach(({ foreign, primary }) => {
    g.setEdge(`table_${foreign.table}`, `table_${primary.table}`);
  });

  dagre.layout(g, { rankdir: "LR" });

  g.nodes().forEach((v) => {
    const node = g.node(v);
    tableCoords[node.label] = {
      x: node.x,
      y: node.y,
    };
  });

  return tables.map((table) => {
    return {
      ...table,
      ...tableCoords[`table_${table.name}`],
    };
  });
};

export default function Canvas({ data = [] }) {
  const [tables, setTables] = React.useState([]);
  const [refs, setRefs] = React.useState([]);

  useEffect(() => {
    const tables = data.filter((item) => {
      return item.type === "table";
    });

    const refs = data.filter((item) => {
      return item.type === "ref";
    });

    const sortedTables = arrangeItems(tables, refs);
    setTables(sortedTables);
  }, [data]);

  return (
    <div id="canvas" className={styles.canvas}>
      {tables.map((table) => {
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
