import { useState } from "react";
import { useEffect } from "react";

function App() {
  const[solution, setWord] = useState(null)
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
      <h1>Termo Fake {solution}</h1>
    </div>
  );
}

export default App