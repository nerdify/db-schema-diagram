import React, { useEffect, useRef } from "react";
import { jsPlumb } from "jsplumb";
import ELK from "elkjs/lib/elk.bundled";

import Table from "../table/";

import styles from "./styles.module.css";

const setJsPlumb = (tables, refs) => {
  jsPlumb.ready(function() {
    const jsPlumbInstance = jsPlumb.getInstance();
    jsPlumbInstance.setContainer("canvas");

    jsPlumbInstance.registerConnectionTypes({
      basic: { paintStyle: { stroke: "#cbcbcb", strokeWidth: 2 } },
      hover: { paintStyle: { stroke: "#129be9", strokeWidth: 3 } }
    });

    jsPlumbInstance.draggable(tables.map(table => `table_${table.name}`));

    refs.forEach(([primary, foreign]) => {
      const connect = jsPlumbInstance.connect({
        source: `column_${primary.table}_${primary.column}`,
        target: `column_${foreign.table}_${foreign.column}`,
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
      });

      connect.bind("mouseout", () => {
        connect.setType("basic");
      });
    });
  });
};

export default function Canvas({ tables, refs }) {
  const jsPlumbInstance = useRef();

  useEffect(() => {
    const elk = new ELK();

    const graph = {
      id: "root",
      layoutOptions: { "elk.algorithm": "radial" },
      children: tables.map(({ name, x, y }) => {
        const definition = {
          id: `table_${name}`,
          width: 222,
          height: 214
        };

        if (x && y) {
          definition.x = x;
          definition.y = y;
          definition.layoutOptions = {
            "elk.stress.fixed": "true"
          };
        }

        return definition;
      }),
      edges: refs.map(([primary, foreign]) => {
        return {
          id: `e_${primary.table}_${foreign.table}`,
          sources: [`table_${primary.table}`],
          targets: [`table_${foreign.table}`]
        };
      })
    };

    elk
      .layout(graph)
      .then(response => {
        response.children.forEach(child => {
          const el = document.getElementById(child.id);
          el.style.left = `${child.x}px`;
          el.style.top = `${child.y}px`;
        });

        setJsPlumb(tables, refs);
      })
      .catch(console.error);
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
