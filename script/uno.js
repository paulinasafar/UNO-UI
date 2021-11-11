//Modal dialogue box
const myModal = new bootstrap.Modal(document.getElementById("playerNames"));
myModal.show();

const playerNames = [];
const closeButton = document.getElementById('closeButton');
const inputValues = document.getElementsByClassName('form-control');

// Listening for player names + checking if all 4 names are inputed
document.getElementById('playerNamesForm').addEventListener('submit', function(e) {
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
        gameID = result.id;
    } else {
        alert("HTTP-Error: " + response.status);
    }
}

