enum Color {
    Black,
    Yellow,
    Green,
}

type GuessResponse = {
    colors: Color[];
}

const MAXLEN = 5;

function analyze(guess: string, correctWord: string): GuessResponse {
    let response = {colors: new Array(5)}

    for (let i = 0; i < MAXLEN; i++) {
        if (!correctWord.includes(guess[i])){
            response.colors[i] = Color.Black;
        } else if (guess[i] == correctWord[i]) {
            response.colors[i] = Color.Green
        } else {
            response.colors[i] = Color.Yellow
        }
    }
    return response
}