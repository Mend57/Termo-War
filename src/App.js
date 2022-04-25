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

let random = Math.floor(Math.random() * porra.length)
let solution = porra[random]

let currentGuess = ''
let previousGuesses = []

let grid = document.getElementById('grid')
buildGrid()
updateGrid()
window.addEventListener('keydown', handleKeyDown)

function handleKeyDown(e) {
  let letter = e.key.toLowerCase()
  if (letter === 'enter') {
    if (currentGuess.length < 5) {
      return
    } else if (!porra.includes(currentGuess)) {
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


function App() {
  const[solution, setSolution] = useState(null)
  useEffect(() => {
    fetch("http://localhost:3001/words").then(res => res.json()).then(json => {
        const random = json[Math.floor(Math.random() * json.length)]
        setSolution(random.word)
      })
  }, [setSolution])

  return (
    <div className="App">
      <h1>Termo Fake {solution}</h1>
    </div>
  );
}

export default App