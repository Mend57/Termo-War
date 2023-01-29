enum Color {
    Black,
    Yellow,
    Green,
}

type GuessResponse = {
    colors: Color[];
}

const MAXLEN = 5;

function analyse(guess: string, correctWord: string): GuessResponse {
    let response: GuessResponse = {colors: new Array(5)}
    let counter: {[key: string]: number} = {}
    for (let c of correctWord){
        counter[c] = correctWord.split('').filter((x) => x == c).length
    }

    for (let i = 0; i < MAXLEN; i++) {
        if (!correctWord.includes(guess[i])){
            response.colors[i] = Color.Black;
        } else if (guess[i] == correctWord[i]) {
            response.colors[i] = Color.Green
            counter[guess[i]]--;
        } else {
            response.colors[i] = Color.Yellow
            counter[guess[i]]--;
        }
    }
    return response
}