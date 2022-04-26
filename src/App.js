import { useState } from "react";
import { useEffect } from "react";

let porra = [
  'porra',
  'corno',
  'viado',
  'troxa',
  'pinto',
  'penis',
  'putas',
];

let solution
let outOfScopeJson

let currentGuess = ''
let previousGuesses = []

let grid = document.getElementById('grid')
buildGrid()
updateGrid()
window.addEventListener('keydown', handleKeyDown)

const existsInJson = (json, value) => {
  for (let i = 0; i < json.length; i += 1){
    if(json[i].word == value)
      return true;
    }
  return false
}

function handleKeyDown(e) {
  let letter = e.key.toLowerCase()
  if (letter === 'enter') {
    if (currentGuess.length < 5) {
      return
    } else if (!existsInJson(outOfScopeJson,currentGuess)) {
        return
    }
    previousGuesses.push(currentGuess)
    currentGuess = ''
  } else if (letter === 'backspace') {
      currentGuess = currentGuess.slice(0, currentGuess.length - 1)
  } else if (/[a-z]/.test(letter)) {
      if (currentGuess.length < 5)
        currentGuess += letter
  }
  updateGrid()
}

function buildGrid() {
  for (let i = 0; i < 6; i++) {
    let row = document.createElement('div')
    for (let j = 0; j < 5; j++) {
      let cell = document.createElement('div')
      cell.className = 'cell'
      cell.textContent = ''
      row.appendChild(cell)
    }
    grid.appendChild(row)
  }
}

function updateGrid() {
  let row = grid.firstChild
  for (let attempt of previousGuesses) {
    drawAttempt(row, attempt, false)
    row = row.nextSibling
  }
  drawAttempt(row, currentGuess, true)
}

function drawAttempt(row, attempt, isCurrent) {
  for (let i = 0; i < 5; i++) {
    let cell = row.children[i]
    if (attempt[i] !== undefined) {
      cell.textContent = attempt[i]
    } else {
      cell.innerHTML = '<div style="opacity: 0">X</div>'
    }
    if (isCurrent) {
      cell.style.backgroundColor = '#615458'
    } else {
      cell.style.backgroundColor = getColor(attempt, i)
    }
  }
}

function getColor(attempt, i) {
  let correctLetter = solution[i]
  let attemptLetter = attempt[i]
  if (attemptLetter === undefined || solution.indexOf(attemptLetter) === -1) {
    return '#312a2c'
  }
  if (correctLetter === attemptLetter) {
    return '#3aa394'
  }
  return '#d3ad69'
}

// json-server ./data/db.json --port 3001
function App() {
  const[solutionLocal, setSolution] = useState(null)
  useEffect(() => {
    const url = "http://localhost:3001/words"
    const fetchData = async () =>{
      try{
        const resp = await fetch(url)
        const json = await resp.json()
        outOfScopeJson = json
        const random = json[Math.floor(Math.random() * json.length)]
        setSolution(random.word)
        console.log(setSolution)
        
      } catch (err){
        console.log("error", err)
      }
    }
    fetchData();
  }, [setSolution])

  solution = solutionLocal
  return (
    <div className="App">
      <h1>Termo Fake {solutionLocal}</h1>
    </div>
  );
}

export default App