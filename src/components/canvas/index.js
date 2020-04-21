import React, { useEffect, useRef, useContext } from "react";
import { keyBy } from "lodash";
import Draggable, { DraggableCore } from "react-draggable"; // Both at the same time
import TableDataContext from "../../context";
import Graph from "node-dijkstra";

import { SVG } from "@svgdotjs/svg.js";

import Table from "../table/";

import styles from "./styles.module.css";

const isPointInsideTable = ([x, y], tableId, containerId) => {
  const parentRect = document
    .getElementById(containerId)
    .getBoundingClientRect();

  const tableRect = document.getElementById(tableId).getBoundingClientRect();

  const tableRelX = tableRect.x - parentRect.x - 10;
  const tableRelY = tableRect.y - parentRect.y - 10;

  const width = tableRect.width + 20;
  const height = tableRect.height + 20;

  const isIn =
    x >= tableRelX &&
    x <= tableRelX + width &&
    y >= tableRelY &&
    y <= tableRelY + height;

  return isIn;
};

const getPath = (from, to, canvasId, tableAId, tableBId, draw = null) => {
  const middleX = Math.ceil((from.x + to.x) / 2);
  const middleY = Math.ceil((from.y + to.y) / 2);

  const points = {
    from: {
      ...from,
      connections: {
        topCenter: 10,
        leftMiddle: 10,
      },
    },
    topCenter: {
      x: middleX,
      y: from.y,
      connections: {
        topRight: 10,
        centerMiddle: 5,
        middleBottom: 3,
      },
    },
    topRight: {
      x: to.x,
      y: from.y,
      connections: {
        rightMiddle: 10,
      },
    },
    leftMiddle: {
      x: from.x,
      y: middleY,
      connections: {
        leftBottom: 10,
        centerMiddle: 5,
      },
    },
    centerMiddle: {
      x: middleX,
      y: middleY,
      connections: {
        rightMiddle: 10,
        middleBottom: 10,
      },
    },
    rightMiddle: {
      x: to.x,
      y: middleY,
      connections: {
        to: 1,
      },
    },
    leftBottom: {
      x: from.x,
      y: to.y,
      connections: {
        middleBottom: 1,
      },
    },
    middleBottom: {
      x: middleX,
      y: to.y,
      connections: {
        to: 1,
      },
    },
    to: to,
  };

  const route = new Graph();

  Object.entries(points).forEach(([key, p]) => {
    if (key !== "to") {
      route.addNode(key, p.connections);
    }
  });

  Object.entries(points).forEach(([key, p]) => {
    if (key !== "to") {
      if (
        isPointInsideTable([p.x, p.y], tableAId, canvasId, key) ||
        isPointInsideTable([p.x, p.y], tableBId, canvasId, key)
      ) {
        route.removeNode(key);
      }
    }
  });

  const sPath = route.path("from", "to");

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
    <div id="canvas" className={styles.canvas}>
      <div id="svg-layer" className={styles.layer} style={{}}></div>
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
