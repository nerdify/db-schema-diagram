import React from "react";
import "./App.css";
import Table from "./components/table";
import Canvas from "./components/canvas";

function App() {
  const dataInfo = {
    name: "TableName",
    rows: [
      {
        name: "id"
      },
      {
        name: "name"
      },
      {
        name: "email"
      },
      {
        name: "password"
      }
    ]
  };

  const tables = [dataInfo];

  return (
    <div className="App">
      <Canvas tables={tables} />
    </div>
  );
}

export default App;
