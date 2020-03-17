import React from "react";
import "./App.css";
import Table from "./components/table";

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

  return (
    <div className="App">
      <Table {...dataInfo} />
    </div>
  );
}

export default App;
