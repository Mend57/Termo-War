import { useState } from "react";
import { useEffect } from "react";

function App() {
  const[words, setWord] = useState(null)
  useEffect(() => {
    fetch("http://localhost:3001/words")
      .then(res => res.json())
      .then(json => {
        const random = json[Math.floor(Math.random() * json.length)]
        setWord(random.word)
      })
  }, [setWord])

  return (
    <div className="App">
      <h1>Termo Fake</h1>
      {words && <div>Palavra do dia: {words}</div>}
    </div>
  );
}

export default App