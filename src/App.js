import React from "react";
import nearley from "nearley";
import ELK from "elkjs/lib/elk.bundled.js";
import AceEditor from "react-ace";
import { useDebouncedCallback } from "use-debounce";
import "./App.css";
import Canvas from "./components/canvas";
import dbGrammar from "./grammar/dbgrammar";
import { SchemeDBParser, DBDefinitionLexer } from "./grammar/schemeGrammar";
import TableDataContext from "./context";

import "./assets/tailwind.generated.css";

import "ace-builds/src-noconflict/theme-monokai";

import aceGrammar from "./grammar/aceGrammar";

const schemeParser = new SchemeDBParser();

const parseInput = (text) => {
  const lexingResult = DBDefinitionLexer.tokenize(text);
  schemeParser.input = lexingResult.tokens;

  const result = schemeParser.tables();

  const baseSchemeVisitor = schemeParser.getBaseCstVisitorConstructorWithDefaults();
  class customVisitor extends baseSchemeVisitor {
    constructor() {
      super();
      this.validateVisitor();
    }

    tables(ctx) {
      const result = ctx.list.map((table) => {
        return this.visit(table);
      });

      return result;
    }

    table(ctx) {
      const tableName = ctx.open_table[0].children.name[0].image;
      const columns = ctx.columns[0].children.list.map((column) =>
        this.visit(column)
      );
      return {
        type: "table",
        name: tableName,
        columns: columns,
      };
    }

    column(ctx) {
      const name = this.visit(ctx.column_name);
      const type = this.visit(ctx.type);
      const modifiers = this.visit(ctx.modifiers);

      return {
        name: name,
        type: type,
        modifiers: modifiers ?? [],
      };
    }

    column_name(ctx) {
      return ctx.name[0].image;
    }

    type(ctx) {
      return ctx.name[0].image;
    }

    modifiers(ctx) {
      return ctx.list.map((modifier) => this.visit(modifier));
    }

    single_modifier(ctx) {
      if (ctx.primaryKey) {
        return ctx.primaryKey[0].image;
      } else if (ctx.notNull) {
        return ctx.notNull[0].image;
      } else if (ctx.unique) {
        return ctx.unique[0].image;
      }

      return null;
    }
  }

  const customVisitorInstance = new customVisitor();
  const parsetOutput = customVisitorInstance.visit(result);

  console.log("--->");
  console.log(parsetOutput);
  console.log("<---");

  if (schemeParser.errors.length > 0) {
    throw new Error("sad sad panda, Parsing errors detected");
  }

  return parsetOutput;
};

const tableDataEncoded = {
  width: 0,
  height: 0,
  tables: [],
  refs: [],
};

const arrangeItems = async (tables, refs) => {
  const elk = new ELK();
  const tableCoords = {};

  const graph = {
    id: "root",
    layoutOptions: { "elk.algorithm": "layered" },
    children: tables.map(({ name, columns }) => {
      return {
        id: `table_${name}`,
        width: 175,
        height: 29.6 + 28.8 * columns.length,
      };
    }),
    edges: refs.map(({ foreign, primary }) => {
      const id = `table_${foreign.table}_table_${primary.table}`;
      const source = `table_${foreign.table}`;
      const target = `table_${primary.table}`;
      return {
        id,
        sources: [source],
        targets: [target],
      };
    }),
  };

  const elkResponse = await elk.layout(graph);
  elkResponse.children.forEach((node) => {
    tableCoords[node.id] = {
      x: node.x,
      y: node.y,
    };
  });

  const tablePosData = tables.map((table) => {
    return {
      id: `table_${table.name}`,
      ...table,
      ...tableCoords[`table_${table.name}`],
    };
  });

  return {
    tables: tablePosData,
    width: elkResponse.width,
    height: elkResponse.height,
    refs,
  };
};

const tableDataReducer = (state, action) => {
  switch (action.type) {
    case "setLayout":
      return {
        width: action.width,
        height: action.height,
        ...state,
      };
      break;
    case "set":
      return {
        ...state,
        ...action.data,
      };
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
        ...state,
        tables: updatedTables,
      };
      break;
    default:
      return state;
      break;
  }
};

function App() {
  const aceComponent = React.useRef(null);
  const editorValue = React.useRef("");

  const getTableLayout = (data) => {
    const tables = data.filter((item) => {
      return item.type === "table";
    });

    const refs = data.filter((item) => {
      return item.type === "ref";
    });

    arrangeItems(tables, refs).then((response) => {
      dispatch({ type: "set", data: response });
    });
  };

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

      console.log(dbParser.results);
      console.log("===");
      console.log(parseInput(e.trim() + "\n"));

      const parsedShcheme = parseInput(e.trim() + "\n");

      /*if (dbParser.results.length === 0) {
        throw "empty";
      }*/

      console.log("parsed shceme", parsedShcheme);
      getTableLayout(parsedShcheme);
    } catch (ex) {
      console.log(ex);
    }
  }, 1000);

  React.useEffect(() => {
    const customGrammar = new aceGrammar();
    aceComponent.current.editor.getSession().setMode(customGrammar);
    if (aceComponent.current !== null) {
    }
  }, [aceComponent]);

  return (
    <div className="App">
      <div className="flex bg-gray-300 pt-1 w-full">
        <div className="pr-1" style={{ height: "100%", width: "250px" }}>
          <AceEditor
            ref={aceComponent}
            value={editorValue.current}
            mode="text"
            theme="monokai"
            width="100%"
            height="100%"
            onChange={(e) => {
              editorValue.current = e;
              debounceFunction(e);
            }}
            name="UNIQUE_ID_OF_DIV"
            editorProps={{ $blockScrolling: true }}
          />
        </div>
        <div className="flex-1 bg-white overflow-scroll shadow-inner">
          <TableDataContext.Provider value={{ state, dispatch }}>
            <Canvas />
          </TableDataContext.Provider>
        </div>
      </div>
    </div>
  );
}

export default App;
