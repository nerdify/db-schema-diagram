import React from "react";
import nearley from "nearley";
import { useDebouncedCallback } from "use-debounce";
import "./App.css";
import Canvas from "./components/canvas";
import dbGrammar from "./grammar/dbgrammar";

function App() {
  const [dbData, setDbData] = React.useState([]);

  const [debounceFunction] = useDebouncedCallback((e) => {
    //console.log(dbParser.results);
    try {
      const dbParser = new nearley.Parser(
        nearley.Grammar.fromCompiled(dbGrammar)
      );

      dbParser.feed(e);
      setDbData(dbParser.results[0]);
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
      <Canvas data={dbData} />
    </div>
  );
}

export default App;
