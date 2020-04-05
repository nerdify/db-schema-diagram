import React from "react";
import nearley from "nearley";
import { useDebouncedCallback } from "use-debounce";
import "./App.css";
import Canvas from "./components/canvas";
import dbGrammar from "./grammar/dbgrammar";

const dbParser = new nearley.Parser(nearley.Grammar.fromCompiled(dbGrammar));

function App() {
  const [dbString, setdbString] = React.useState();
  const [dbData, setDbData] = React.useState([]);

  const [debounceFunction] = useDebouncedCallback(e => {
    //console.log(dbParser.results);
    try {
      dbParser.feed(e);
      setDbData(dbParser.results[0]);
      console.log(dbParser.results[0]);
    } catch (ex) {
      console.log(ex);
    }
  }, 1000);

  const dataInfo = [
    {
      name: "users",
      x: 5,
      y: 5,
      columns: [
        {
          name: "id",
          type: "integer"
        },
        {
          name: "name",
          type: "varchar",
          size: "50"
        },
        {
          name: "email",
          type: "varchar"
        },
        {
          name: "password",
          type: "text"
        },
        {
          name: "description",
          type: "text"
        },
        {
          name: "signup_date",
          type: "date"
        }
      ]
    },
    {
      name: "posts",
      columns: [
        {
          name: "id",
          type: "integer"
        },
        {
          name: "content",
          type: "text"
        },
        {
          name: "publish_date",
          type: "datetime"
        },
        {
          name: "user_id",
          type: "integer"
        }
      ]
    },
    {
      name: "likes",
      columns: [
        {
          name: "id",
          type: "integer"
        },
        {
          name: "like_date",
          type: "datetime"
        },
        {
          name: "user_id",
          type: "integer"
        },
        {
          name: "post_id",
          type: "integer"
        }
      ]
    },
    {
      name: "comments",
      columns: [
        {
          name: "id",
          type: "integer"
        },
        {
          name: "comment",
          type: "text"
        },
        {
          name: "user_id",
          type: "interger"
        }
      ]
    },
    {
      name: "transactions",
      columns: [
        {
          name: "id",
          type: "integer"
        },
        {
          name: "ref",
          type: "string"
        },
        {
          name: "amount",
          type: "integer"
        },
        {
          name: "date",
          type: "datetime"
        },
        {
          name: "user_id",
          type: "integer"
        }
      ]
    }
  ];

  const refs = [
    [
      {
        table: "posts",
        column: "user_id"
      },
      {
        table: "users",
        column: "id"
      }
    ],
    [
      {
        table: "comments",
        column: "user_id"
      },
      {
        table: "users",
        column: "id"
      }
    ],
    [
      {
        table: "likes",
        column: "user_id"
      },
      {
        table: "users",
        column: "id"
      }
    ],
    [
      {
        table: "likes",
        column: "post_id"
      },
      {
        table: "posts",
        column: "id"
      }
    ],
    [
      {
        table: "transactions",
        column: "user_id"
      },
      {
        table: "users",
        column: "id"
      }
    ]
  ];

  return (
    <div className="App">
      <div>
        <textarea
          style={{ height: "100%", width: "250px", fontSize: 11 }}
          onChange={e => {
            debounceFunction(e.target.value);
          }}
        ></textarea>
      </div>
      <Canvas data={dbData} />
    </div>
  );
}

export default App;
