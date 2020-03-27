import React from "react";
import "./App.css";
import Table from "./components/table";
import Canvas from "./components/canvas";

function App() {
  const dataInfo = [
    {
      name: "users",
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
    }
  ];

  const refs = [
    [
      {
        table: "users",
        column: "id"
      },
      {
        table: "posts",
        column: "user_id"
      }
    ],
    [
      {
        table: "users",
        column: "id"
      },
      {
        table: "comments",
        column: "user_id"
      }
    ],
    [
      {
        table: "users",
        column: "id"
      },
      {
        table: "likes",
        column: "user_id"
      }
    ],
    [
      {
        table: "posts",
        column: "id"
      },
      {
        table: "likes",
        column: "post_id"
      }
    ]
  ];

  return (
    <div className="App">
      <Canvas tables={dataInfo} refs={refs} />
    </div>
  );
}

export default App;
