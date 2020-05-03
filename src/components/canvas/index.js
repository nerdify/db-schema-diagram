import React, { useEffect, useRef, useContext } from "react";
import { keyBy } from "lodash";
import Draggable, { DraggableCore } from "react-draggable"; // Both at the same time
import TableDataContext from "../../context";
import Graph from "node-dijkstra";

import { SVG } from "@svgdotjs/svg.js";

import Table from "../table/";

import styles from "./styles.module.css";

const isPointInsideTable = ([x, y], tableId, containerId, draw) => {
  const parentRect = document
    .getElementById(containerId)
    .getBoundingClientRect();

  const tableRect = document.getElementById(tableId).getBoundingClientRect();

  const tableRelX = tableRect.x - parentRect.x - 10;
  const tableRelY = tableRect.y - parentRect.y;

  const width = tableRect.width + 20;
  const height = tableRect.height;

  const isIn =
    x >= tableRelX &&
    x <= tableRelX + width &&
    y >= tableRelY &&
    y <= tableRelY + height;

  //draw.current.rect(width, height).fill("#afa").move(tableRelX, tableRelY);

  return isIn;
};

const getPath = (from, to, canvasId, tableAId, tableBId, draw = null) => {
  const genGrid = (from, to, columns, rows) => {
    const points = {};
    const deltaX = (to.x - from.x) / columns;
    const deltaY = (to.y - from.y) / rows;

    for (let i = 0; i <= rows; i++) {
      for (let j = 0; j <= columns; j++) {
        const node = {
          x: from.x + deltaX * j,
          y: from.y + deltaY * i,
          connections: {},
        };

        if (j < columns) {
          node.connections[`p${i}${j + 1}`] = 10;
        }

        if (i < rows) {
          node.connections[`p${i + 1}${j}`] = 10;
        }

        points[`p${i}${j}`] = node;
      }
    }

    return points;
  };

  const cols = 4;
  const rows = 4;
  const points = genGrid(from, to, cols, rows);

  points[`p${0}${0}`].connections[
    `p${0}${2}`
  ] = 1; /*TODO. look for non hardcoded way */
  points[`p${0}${2}`].connections[`p${4}${2}`] = 1;
  points[`p${4}${2}`].connections[`p${4}${4}`] = 1;
  points[`p${0}${2}`].connections[`p${4}${2}`] = 1;

  points[`p${0}${0}`].connections[`p${0}${4}`] = 5;
  points[`p${0}${4}`].connections[`p${4}${4}`] = 5;

  points[`p${0}${0}`].connections[`p${4}${0}`] = 5;
  points[`p${4}${0}`].connections[`p${4}${4}`] = 5;

  const route = new Graph();

  Object.entries(points).forEach(([key, p]) => {
    //draw.current.circle(4).move(p.x, p.y).fill("#a00");
    if (key !== "to") {
      route.addNode(key, p.connections);
    }
  });

  Object.entries(points).forEach(([key, p]) => {
    if (key !== "to") {
      if (
        isPointInsideTable([p.x, p.y], tableAId, canvasId, draw) ||
        isPointInsideTable([p.x, p.y], tableBId, canvasId, draw)
      ) {
        route.removeNode(key);
      }
    }
  });

  const sPath = route.path(`p${0}${0}`, `p${cols}${rows}`);

  if (!sPath) {
    return [
      ["M", from.x, from.y],
      ["L", to.x, to.y],
    ];
  }

  return sPath.map((p, i) => {
    if (i === 0) return ["M", points[p].x, points[p].y];
    return ["L", points[p].x, points[p].y];
  });
};

const ArrToSvgPath = (arr) => {
  return arr.flat().join(" ");
};

const distance = ([pointA, pointB]) => {
  const a = pointA.x - pointB.x;
  const b = pointA.y - pointB.y;

  return Math.sqrt(a * a + b * b);
};

export default function Canvas() {
  const tablesDataContext = useContext(TableDataContext);
  const tables = tablesDataContext.state.tables;
  const refs = tablesDataContext.state.refs;
  const width = tablesDataContext.state.width;
  const height = tablesDataContext.state.height;
  const [columnPoints, setColumnPoints] = React.useState([]);
  const draw = React.useRef(null);

  useEffect(() => {
    draw.current = SVG().addTo("#draggables").size("100%", "100%");
  }, []);

  useEffect(() => {
    const columns = tables.flatMap((table) => {
      return table.columns.map((column) => {
        const key = `column_${table.name}_${column.name}`;
        const el = document.getElementById(key);
        const parent = document.getElementById("canvas");

        const parentX = window.scrollX + parent.getBoundingClientRect().left;
        const parentY = window.scrollY + parent.getBoundingClientRect().top;

        const elX = window.scrollX + el.getBoundingClientRect().left;
        const elY = window.scrollY + el.getBoundingClientRect().top;

        const x = Math.ceil(elX - parentX + 87);
        const y = Math.ceil(elY - parentY + 10);

        /*
        draw.current
          .circle(4)
          .move(x - 100, y)
          .fill("#faa");
        draw.current
          .circle(4)
          .move(x + 100, y)
          .fill("#aaf");
          */

        return {
          name: column.name,
          table: table.name,
          key,
          center: { x, y },
          left: { x: x - 100, y },
          right: {
            x: x + 100,
            y,
          },
        };
      });
    });

    setColumnPoints(columns);

    return () => {
      draw.current.clear();
    };
  }, [tables]);

  useEffect(() => {
    const points = keyBy(columnPoints, "key");

    refs.forEach(({ foreign, primary }) => {
      const colForeign = points[`column_${foreign.table}_${foreign.column}`];
      const colPrimary = points[`column_${primary.table}_${primary.column}`];

      const segments = [
        [colForeign.left, colPrimary.left],
        [colForeign.left, colPrimary.right],
        [colForeign.right, colPrimary.left],
        [colForeign.right, colPrimary.right],
      ].sort((segmentA, segmentB) => {
        return distance(segmentA) - distance(segmentB);
      });

      const shortest = segments[0];
      const from = shortest[0];
      const to = shortest[1];

      const path = getPath(
        from,
        to,
        `canvas`,
        `table_${foreign.table}`,
        `table_${primary.table}`,
        draw
      );

      path.push(["M", from.x, from.y]);
      path.push(["L", colForeign.center.x, colForeign.center.y]);
      path.push(["M", to.x, to.y]);
      path.push(["L", colPrimary.center.x, colPrimary.center.y]);

      const element = draw.current
        .path(ArrToSvgPath(path))
        .stroke({ color: "#f06", width: 1 })
        .fill("none");

      element.on(["mouseover"], (e) => {
        console.log(e);
      });
    });

    //console.log(refs);
  }, [columnPoints]);

  return (
    <div
      id="canvas"
      style={{ minHeight: height, minWidth: width, border: "1px solid red" }}
      className={styles.canvas}
    >
      <div className={styles.layer} style={{}} id="draggables">
        {tables.length > 0 &&
          tables.map((table) => {
            return (
              <Draggable
                bounds="parent"
                key={`table_${table.name}`}
                defaultPosition={{ x: 0, y: 0 }}
                handle=".handle"
                position={{ x: table.x, y: table.y }}
                onStart={(e) => {}}
                onDrag={(e, data) => {
                  tablesDataContext.dispatch({
                    tableId: `table_${table.name}`,
                    type: "update",
                    event: e,
                    data,
                  });
                }}
                onStop={() => {}}
              >
                <div
                  style={{ position: "absolute", top: 0, left: 0 }}
                  className="handle"
                >
                  <Table id={`table_${table.name}`} {...table} />
                </div>
              </Draggable>
            );
          })}
      </div>
    </div>
  );
}
