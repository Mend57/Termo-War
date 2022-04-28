import { useState } from "react";
import { useEffect } from "react";

let solution, noAccentSolution
let outOfScopeJson

let currentGuess = ''
let previousGuesses = []

let grid = document.getElementById('grid')

const existsInJson = (json, value) => {
  for (let i = 0; i < json.length; i += 1){
    if(replaceAccent(json[i].word) === replaceAccent(value))
      return json[i].word;
    }
  return false
}

function replaceAccent(str){
    if (!str){
      return 
    }
    str = str.replace(/[àáâãäå]/,"a");
    str = str.replace(/[eéèëê]/, "e");
    str = str.replace(/[iíìïî]/, "i");
    str = str.replace(/[oóòõöô]/, "o");  
    str = str.replace(/[uúùüû]/, "u") 
    str = str.replace(/[ç]/,"c");

    return str.replace(/[^a-z0-9]/gi,''); 
}


async function handleKeyDown(e) {
  let letter = e.key.toLowerCase()
  let word
  let ntry = previousGuesses.length
  let row = document.getElementsByClassName("row")[ntry];
  let cells = row.getElementsByClassName("cell")

  if (letter === 'enter') {
    if (currentGuess.length < 5) {
      row.style.animation = 'shake 1s'
      await new Promise(resolve => setTimeout(resolve, 1000));
      clearAnimation(row)      
      return 
    } else{
        word = existsInJson(outOfScopeJson,currentGuess)
        if (!word) {
          row.style.animation = 'shake 1s'
          await new Promise(resolve => setTimeout(resolve, 1000));
          clearAnimation(row)
          return
        }
        console.log(cells)
        for (let i = 0; i < cells.length; i++){
          cells[i].style.animation = 'flip 0.5s'
          cells[i].style.setProperty('--color', getColor(currentGuess, i))
          await new Promise(resolve => setTimeout(resolve, 500));
          clearAnimation(cells[i])
          cells[i].style.setProperty('background-color', getColor(currentGuess, i))
          cells[i].style.setProperty('border-color', getColor(currentGuess, i))
        }
    }
    previousGuesses.push(word)
    currentGuess = ''
    saveGame()
  } 
  else if (letter === 'backspace') {
      currentGuess = currentGuess.slice(0, currentGuess.length - 1)
  } 
  else if (/^[a-z]$/.test(letter)) {
      if (currentGuess.length < 5)
        currentGuess += letter
  }
  updateGrid()
}


function buildGrid() {
  for (let i = 0; i < 6; i++) {
    let row = document.createElement('div')
    row.className = 'row'
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
  if (previousGuesses.length > 0 && previousGuesses[previousGuesses.length - 1] === solution) {
    alert('ganhou')
    return
  } else if(previousGuesses.length === 6){
    alert('perdeu')
    return
  }
    
  drawAttempt(row, currentGuess, true)
}


function drawAttempt(row, attempt, isCurrent) {
  for (let i = 0; i < 5; i++) {
    let cell = row.children[i]
    clearAnimation(cell)

    if (attempt[i] !== undefined) {
      cell.textContent = attempt[i]
      cell.style.animation = "bounce 0.15s";

    } else {
      cell.innerHTML = '<div style="opacity: 0">X</div>'
    }
    if (isCurrent) {
      cell.style.backgroundColor = '#6e5c62'
      cell.style.borderColor = '#4c4347'
    } else {
      cell.style.backgroundColor = getColor(replaceAccent(attempt), i)
      cell.style.borderColor = '#ff004800'
    }
  }
}


function getColor(attempt, i) {
  let correctLetter = noAccentSolution[i]
  let attemptLetter = attempt[i]
  if (attemptLetter === undefined || noAccentSolution.indexOf(attemptLetter) === -1) {
    return '#312a2c'
  } else if (correctLetter === attemptLetter) {
      return '#3aa394'
  } else{
      return '#d3ad69'
  }
}


function clearAnimation(cell) {
  cell.style.animationName = ''
  cell.style.animationDuration = ''
  cell.style.animationTimingFunction = ''
}


function loadGame(){
  let data
  try {
    data = JSON.parse(localStorage.getItem('data'))
  } catch { }
  if (data != null && data.previousGuesses === previousGuesses){
    previousGuesses = data.previousGuesses
  }
}


function saveGame(){
  let data = JSON.stringify({
    noAccentSolution,
    previousGuesses
  })
  try{
  localStorage.setItem('data', data)
  } catch{ }
}


// json-server ./data/wordBank.json --port 3001
function App() {
  const[solutionLocal, setSolution] = useState(null)
  useEffect(() => {
    const url = "http://localhost:3001/words"
    const fetchData = async () =>{
      try{
        const resp = await fetch(url)
        const json = await resp.json()
        outOfScopeJson = json
        const random = json[Math.floor((Math.random() * (json.length + 1)))]
        setSolution(random.word)
        console.log(setSolution)
        
      } catch (err){
        console.log("error", err)
      }
    }
    fetchData();
  }, [setSolution])
  
  solution = solutionLocal
  noAccentSolution = replaceAccent(solutionLocal)
  return (
    <div className="App">
      <h1>Termo Fake {solutionLocal}</h1>
    </div>
  );
}

loadGame()
buildGrid()
updateGrid()
window.addEventListener('keydown', handleKeyDown)


export default App