import React from "react";
import nearley from "nearley";
import dagre from "dagre";
import { useDebouncedCallback } from "use-debounce";
import "./App.css";
import Canvas from "./components/canvas";
import dbGrammar from "./grammar/dbgrammar";
import TableDataContext from "./context";

const arrangeItems = (tables, refs) => {
  const g = new dagre.graphlib.Graph();
  const tableCoords = {};

  g.setGraph({ directed: true });
  g.setDefaultEdgeLabel(function () {
    return {};
  });

  tables.forEach(({ name, columns }) => {
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
      id: `table_${table.name}`,
      ...table,
      ...tableCoords[`table_${table.name}`],
    };
  });
};

const tableDataEncoded = {
  tables: [],
  refs: [],
};

const tableDataReducer = (state, action) => {
  switch (action.type) {
    case "set":
      const tables = action.data.filter((item) => {
        return item.type === "table";
      });

      const refs = action.data.filter((item) => {
        return item.type === "ref";
      });

      return { tables: arrangeItems(tables, refs), refs: refs };
      break;
    case "update":
      const updatedTables = state.tables.map((table) => {
        if (table.id === action.tableId) {
          table.x = action.data.x;
          table.y = action.data.y;
        }
        return table;
      });

      return {
        tables: updatedTables,
        refs: state.refs,
      };
      break;
    default:
      return state;
      break;
  }
};

function App() {
  const [state, dispatch] = React.useReducer(
    tableDataReducer,
    tableDataEncoded
  );

  const [debounceFunction] = useDebouncedCallback((e) => {
    try {
      const dbParser = new nearley.Parser(
        nearley.Grammar.fromCompiled(dbGrammar)
      );

      dbParser.feed(e.trim());
      if (dbParser.results.length === 0) {
        throw "empty";
      }

      dispatch({ type: "set", data: dbParser.results[0] });
    } catch (ex) {
      console.log(ex);
    }
  }, 1000);

  return (
    <div className="App">
      <div>
        <textarea
          style={{ height: "100%", width: "250px", fontSize: 11 }}
          onChange={(e) => {
            debounceFunction(e.target.value);
          }}
        ></textarea>
      </div>
      <TableDataContext.Provider value={{ state, dispatch }}>
        <Canvas />
      </TableDataContext.Provider>
    </div>
  );
}

export default App;
