//Modal dialogue box
// const myModal = new bootstrap.Modal(document.getElementById("playerNames"));
// myModal.show();

const playerNames = [];
const closeButton = document.getElementById('closeButton');
const inputValues = document.getElementsByClassName('form-control');

// Listening for player names + checking if all 4 names are inputed
document.getElementById('playerNamesForm').addEventListener('submit', function (e) {
    e.preventDefault();
    if (compareNames()) {
        for (let i = 0; i < inputValues.length; ++i) {
            let playerName = inputValues[i].value;
            if (playerName) {
                playerNames.push(playerName);
                playerName = "";
            }
        }
        if (playerNames.length == 4) {
            myModal.hide();
            startGame();
        }
    }
})


//Listening for players with same names
function compareNames() {
    let check;
    if (inputValues.length > 0) {
        for (let a = 0; a < inputValues.length; a++) {
            let nameToCompare = inputValues[a].value;
            for (let b = a + 1; b < inputValues.length; b++) {
                let namesToCompare = inputValues[b].value;
                if (namesToCompare) {
                    if (nameToCompare.toLowerCase() === namesToCompare.toLowerCase()) {
                        alert("Please enter a different name");
                        check = false;
                    } else {
                        check = true;
                    }
                }
            }
        }
    }
    return check;
}

document.getElementById('playerNamesForm').addEventListener('keyup', compareNames);

let gameID;
let nextPlayer;
let player1;
let player2;
let player3;
let player4;
let topCard;
let allPlayers;

async function startGame() {
    let response = await fetch("http://nowaunoweb.azurewebsites.net/api/Game/Start", {
        method: 'POST',
        body: JSON.stringify(playerNames),
        headers: {
            'Content-type': 'application/json; charset=UTF-8',
        }
    });
    if (response.ok) {
        let result = await response.json();
        console.log(result);
        gameID = result.Id;
        nextPlayer = result.NextPlayer;
        allPlayers = result.Players;
        player1 = result.Players[0];
        player2 = result.Players[1];
        player3 = result.Players[2];
        player4 = result.Players[3];
        topCard = result.TopCard;
    } else {
        alert("HTTP-Error: " + response.status);
    }
}

let playersAndCards = document.getElementById("players-and-cards").children;
console.log(playersAndCards);
playersAndCards = Array.from(playersAndCards);
console.log(playersAndCards);
const player1Position = document.getElementById("player1");
console.log(player1Position);


function placePlayer() {
    allPlayers.forEach(element => {
        
        

        
    });
    

    
}





