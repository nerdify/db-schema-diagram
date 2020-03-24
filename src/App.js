import React from "react";
import "./App.css";
import Table from "./components/table";
import Canvas from "./components/canvas";

function App() {
  const dataInfo = [
    {
      name: "users",
      rows: [
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
      rows: [
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
    }
  ];

  return (
    <div className="App">
      <Canvas tables={dataInfo} />
    </div>
  );
}

export default App;
