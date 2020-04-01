import React, { useEffect, useRef } from "react";
import { jsPlumb } from "jsplumb";
import dagre from "dagre";

import Table from "../table/";

import styles from "./styles.module.css";

const setJsPlumb = (tables, refs) => {
  jsPlumb.ready(function() {
    const jsPlumbInstance = jsPlumb.getInstance();

    jsPlumbInstance.batch(() => {
      jsPlumbInstance.setContainer("canvas");

      jsPlumbInstance.registerConnectionTypes({
        basic: { paintStyle: { stroke: "#cbcbcb", strokeWidth: 2 } },
        hover: {
          paintStyle: {
            stroke: "#129be9",
            strokeWidth: 3
          }
        }
      });

      jsPlumbInstance.draggable(tables.map(table => `table_${table.name}`));

      refs.forEach(([primary, foreign]) => {
        const sourceId = `column_${primary.table}_${primary.column}`;
        const targetId = `column_${foreign.table}_${foreign.column}`;

        const connect = jsPlumbInstance.connect({
          source: sourceId,
          target: targetId,
          isSource: true,
          isTarget: true,
          anchor: ["Right", "Left"],
          connector: ["Flowchart", { stub: 10, gap: 1 }],
          //connector: ["Flowchart", { stub: 30, gap: 0 }],
          endpoints: ["Blank", "Blank"],
          detachable: false,
          type: "basic"
        });

        connect.bind("mouseover", () => {
          connect.setType("hover");
          document.getElementById(sourceId).classList.add(styles.hoverColumn);
          document.getElementById(targetId).classList.add(styles.hoverColumn);
        });

        connect.bind("mouseout", () => {
          connect.setType("basic");
          document
            .getElementById(sourceId)
            .classList.remove(styles.hoverColumn);
          document
            .getElementById(targetId)
            .classList.remove(styles.hoverColumn);
        });
      });
    });
  });
};

export default function Canvas({ tables, refs }) {
  const jsPlumbInstance = useRef();

  useEffect(() => {
    const g = new dagre.graphlib.Graph();
    g.setGraph({ directed: true });
    g.setDefaultEdgeLabel(function() {
      return {};
    });

    tables.forEach(({ name, x, y }) => {
      const el = document.getElementById(`table_${name}`);
      const node = {
        label: `table_${name}`,
        width: el.offsetWidth,
        height: el.offsetHeight
      };

      if (x && y) {
        node.x = x;
        node.y = y;
      }
      g.setNode(`table_${name}`, node);
    });

    refs.forEach(([foreign, primary]) => {
      g.setEdge(`table_${foreign.table}`, `table_${primary.table}`);
    });

    dagre.layout(g, { rankdir: "LR" });

    g.nodes().forEach(v => {
      const node = g.node(v);
      const el = document.getElementById(node.label);
      el.style.top = `${node.x}px`;
      el.style.left = `${node.y}px`;
    });

    setJsPlumb(tables, refs);
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
