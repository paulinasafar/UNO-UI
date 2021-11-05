//***************************UNO PLAYER NAMES****************************************************

const myModal = new bootstrap.Modal(document.getElementById("playerNames"));
myModal.show();


//***************************UNO VARIABLES****************************************************
let listOfPlayers=[];
const playerNamesForm = document.getElementById('playerNamesForm');
const closeButton = document.getElementById('closeButton');
const inputValues = document.getElementsByClassName('form-control');
const playerName1 = document.getElementById('playername1');
const playerName2 = document.getElementById('playername2');
const playerName3 = document.getElementById('playername3');
const playerName4 = document.getElementById('playername4');
let gameID = ""; // ID of the game returned by the API
const gameStart = "http://nowaunoweb.azurewebsites.net/api/Game/Start";


//***************************UNO MODAL BOX****************************************************

playerNamesForm.addEventListener('submit', function () {
    for (let i = 0; i < inputValues.length; ++i) {
        let playerName = inputValues[i].value;
        if (!playerName) {
            alert("Please enter a name for every Player!");
            EventTarget.preventDefault();
            break;
        } else {
            listOfPlayers.push(playerName);
            myModal.hide();
        }
    }
    console.log(listOfPlayers);
    return listOfPlayers;
})




//***************************UNO GAME START****************************************************


async function startGame() {
    let response = await fetch(gameStart, {
        method: 'POST',
        body: JSON.stringify(playerNames),
        headers: {
            'Content-type': 'application/json; charset=UTF-8',
        }
    });
    console.log(playerNames);

    if (response.ok) {
        let result = await response.json();
        console.log(result);
        gameID = result.id;
    } else {
        alert("HTTP-Error: " + response.status);
    }
}
if (playerNames.length == 3) {
    startGame();
}



//***************************UNO CARDS METHODS****************************************************



//***************************UNO ANIMATIONS****************************************************



