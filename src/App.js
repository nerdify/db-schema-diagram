import React from 'react'
import ELK from 'elkjs/lib/elk.bundled.js'
import AceEditor from 'react-ace'
import uuid from 'uuid'
import {useDebouncedCallback} from 'use-debounce'
import ApolloClient, { gql } from 'apollo-boost'
import {
    BrowserRouter as Router,
    Switch,
    Route,
    useParams,
    useHistory,
} from 'react-router-dom'

import Canvas from './components/canvas'
import {
  SchemaDBParser,
  DBDefinitionLexer,
  schemeDBVisitor,
} from './grammar/schemeGrammar'
import TableDataContext from './context'

import './assets/tailwind.generated.css'

import 'ace-builds/src-noconflict/theme-monokai'

import aceGrammar from './grammar/aceGrammar'

const schemeParser = new SchemaDBParser()
const customVisitor = schemeDBVisitor(schemeParser)

const client = new ApolloClient({
  uri:
    'https://k4emdgbstjgufjmo75arzjoxti.appsync-api.us-east-1.amazonaws.com/graphql',
  headers: {
    'x-api-key': 'da2-6hkc4wdow5et3hufzeq7nmuuye',
  },
});

const createSchema = async (id) => {
  return client.mutate({
    mutation: gql`
      mutation createSchema($input: CreateSchemaInput!) {
        createSchema(input: $input) {
          id
        }
      }
    `,
    variables: {
      input: {
        id: id,
      },
    },
  });
};

const setRemoteSchema = (id, schema) => {
  return client.mutate({
    mutation: gql`
      mutation updateSchema($input: UpdateSchemaInput!) {
          updateSchema(input: $input) {
          id
        }
      }
    `,
    variables: {
      input: {
        id: id,
        schema: schema
      },
    },
  });
};

const getSchemaData = (id) => {
    return client.query({
        query: gql`
            query getSchema($id: String!) {
                getSchema(id: $id) {
                    id
                    schema
                }
            }
        `,
        variables: {
            id: id,
        },
    });
};

const schemeParser = new SchemaDBParser();
const customVisitor = schemeDBVisitor(schemeParser);

const parseInput = (text) => {
  const lexingResult = DBDefinitionLexer.tokenize(text)
  schemeParser.input = lexingResult.tokens

  const result = schemeParser.elements()
  const parsetOutput = customVisitor.visit(result)

  if (schemeParser.errors.length > 0) {
    throw new Error('sad sad panda, Parsing errors detected')
  }

  return parsetOutput
}

const tableDataEncoded = {
  globalId: null,
  width: 0,
  height: 0,
  tables: [],
  refs: [],
}

const arrangeItems = async (tables, refs) => {
  const elk = new ELK()
  const tableCoords = {}

  const graph = {
    id: 'root',
    layoutOptions: {
      'elk.algorithm': 'layered',
      'elk.direction': 'RIGHT',
      'elk.padding': '[top=25,left=25,bottom=25,right=25]',
      'elk.spacing.componentComponent': 25, // unconnected nodes are individual subgraphs, referred to as named components
      'elk.layered.spacing.nodeNodeBetweenLayers': 25, // this has effect, but only if there are edges.
      'elk.edgeLabels.inline': true,
    },
    children: tables.map(({name, columns}) => {
      return {
        id: `table_${name}`,
        width: 175,
        height: 29.6 + 28.8 * columns.length,
      }
    }),
    edges: refs.map(({foreign, primary}) => {
      const id = `table_${foreign.table}_table_${primary.table}`
      const source = `table_${foreign.table}`
      const target = `table_${primary.table}`
      return {
        id,
        sources: [source],
        targets: [target],
      }
    }),
  }

  const elkResponse = await elk.layout(graph)
  elkResponse.children.forEach((node) => {
    tableCoords[node.id] = {
      x: node.x,
      y: node.y,
    }
  })

  const tablePosData = tables.map((table) => {
    return {
      id: `table_${table.name}`,
      ...table,
      ...tableCoords[`table_${table.name}`],
    }
  })

  return {
    tables: tablePosData,
    width: elkResponse.width,
    height: elkResponse.height,
    refs,
  }
}

const getTableLayout = async (data) => {
  const tables = data.filter((item) => {
    return item.type === "table";
  });

  const refs = data.filter((item) => {
    return item.type === "ref";
  });

  return arrangeItems(tables, refs);
};

const tableDataReducer = (state, action) => {
  switch (action.type) {
    case 'setGlobalId':
      return {
          ...state,
           globalId: action.globalId,
      };

    case 'setLayout':
      return {
        ...state,
        width: action.width,
        height: action.height,
        ...state,
      }

    case 'set':
      return {
        ...state,
        ...action.data,
      }

    case 'update':
      const updatedTables = state.tables.map((table) => {
        if (table.id === action.tableId) {
          table.x = action.data.x
          table.y = action.data.y
        }
        return table
      })

      return {
        ...state,
        tables: updatedTables,
      }

    default:
      return state
  }
}

function Home() {
  const aceComponent = React.useRef(null)
  const editorValue = React.useRef('')
    const { schema_id } = useParams();
    const history = useHistory();

  const [state, dispatch] = React.useReducer(tableDataReducer, tableDataEncoded)

  React.useEffect(() => {
      if (schema_id) {
          dispatch({ type: "setGlobalId", globalId: schema_id });
          getSchemaData(schema_id).then((response) => {
              const schema = response.data.getSchema.schema;
              dispatch({ type: "set", data: {schema: schema}});
              aceComponent.current.editor.getSession().setValue(schema, -1);
          });
    } else {
      const globalId = uuid();

      createSchema(globalId).then(() => {
          dispatch({ type: "setGlobalId", globalId: globalId });
          history.push(`/${globalId}`);
      });
    }
  }, [schema_id, aceComponent]);

  const [debounceFunction] = useDebouncedCallback((e) => {
    try {
        const schema = e.trim() + '\n'';
       const parsedShcheme = parseInput(schema);
       getTableLayout(parsedShcheme).then((response) => {
            dispatch({ type: "set", data: response });
        });

        if (state.globalId) {
          setRemoteSchema(state.globalId, schema)
        }
    } catch (ex) {
      console.log(ex)
    }
  }, 300);

  React.useEffect(() => {
    const customGrammar = new aceGrammar()
    aceComponent.current.editor.getSession().setMode(customGrammar)
    if (aceComponent.current !== null) {
    }
  }, [aceComponent])

  return (
    <div className="flex bg-gray-300 h-screen pt-1 w-screen">
      <div className="pr-1" style={{height: '100%', width: '250px'}}>
        <AceEditor
          ref={aceComponent}
          value={editorValue.current}
          mode="text"
          theme="monokai"
          width="100%"
          height="100%"
          onChange={(e) => {
            editorValue.current = e
            debounceFunction(e)
          }}
          name="UNIQUE_ID_OF_DIV"
          editorProps={{$blockScrolling: true}}
        />
      </div>
      <div className="flex-1 bg-white overflow-scroll shadow-inner">
        <TableDataContext.Provider value={{state, dispatch}}>
          <Canvas />
        </TableDataContext.Provider>
      </div>
    </div>
  )
}

function App() {
  return (
    <Router>
      <Switch>
        <Route exact path="/:schema_id?">
          <Home />
        </Route>
      </Switch>
    </Router>
  );
}

export default App
