//Modal dialogue box
// const myModal = new bootstrap.Modal(document.getElementById("playerNames"));
// myModal.show();

const playerNames = [];
const playerNamesHardCoded = ["Karo", "Mimi", "Steffi", "Lu"];
const closeButton = document.getElementById('closeButton');
const inputValues = document.getElementsByClassName('form-control');

let gameID;
let nextPlayer;
let topCard;
let allPlayers;

// Listening for player names + checking if all 4 names are inputed
// document.getElementById('playerNamesForm').addEventListener('submit', function (e) {
//     e.preventDefault();
//     if (compareNames()) {
//         for (let i = 0; i < inputValues.length; ++i) {
//             let playerName = inputValues[i].value;
//             if (playerName) {
//                 playerNames.push(playerName);
//                 playerName = "";
//             }
//         }
//         if (playerNamesHardCoded.length == 4) {
//             myModal.hide();
//             startGame();
//         }
//     }
// })


// //Listening for players with same names
// function compareNames() {
//     let check;
//     if (inputValues.length > 0) {
//         for (let a = 0; a < inputValues.length; a++) {
//             let nameToCompare = inputValues[a].value;
//             for (let b = a + 1; b < inputValues.length; b++) {
//                 let namesToCompare = inputValues[b].value;
//                 if (namesToCompare) {
//                     if (nameToCompare.toLowerCase() === namesToCompare.toLowerCase()) {
//                         alert("Please enter a different name");
//                         check = false;
//                     } else {
//                         check = true;
//                     }
//                 }
//             }
//         }
//     }
//     return check;
// }

// document.getElementById('playerNamesForm').addEventListener('keyup', compareNames);



async function startGame() {
    let response = await fetch("http://nowaunoweb.azurewebsites.net/api/Game/Start", {
        method: 'POST',
        body: JSON.stringify(playerNamesHardCoded),
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
        topCard = result.TopCard;
        placePlayersAndCards(allPlayers);

    } else {
        alert("HTTP-Error: " + response.status);
    }
}

startGame();

let playersAndCards = document.getElementById("players-and-cards").children;
playersAndCards = Array.from(playersAndCards);
const player1Position = document.getElementById("player1");


function placePlayersAndCards(players) {


    document.getElementById("player1-name").innerHTML = players[0].Player;
    document.getElementById("player1-points").innerHTML = players[0].Score;
    document.querySelector("#player1-allCards ul").append(getCards(players[0].Player));

    document.getElementById("player2-name").innerHTML = players[1].Player;
    document.getElementById("player2-points").innerHTML = players[1].Score;
    document.getElementById("player2-allCards").innerHTML = players[1].Cards;

    document.getElementById("player3-name").innerHTML = players[2].Player;
    document.getElementById("player3-points").innerHTML = players[2].Score;
    document.getElementById("player3-allCards").innerHTML = players[2].Cards;

    document.getElementById("player4-name").innerHTML = players[3].Player;
    document.getElementById("player4-points").innerHTML = players[3].Score;
    document.getElementById("player4-allCards").innerHTML = players[3].Cards;
}

const baseUrl = "http://nowaunoweb.azurewebsites.net/Content/Cards/";

function createCards(card) {
    const li = document.createElement("li");
    const img = document.createElement("img");
    const color = card.Color.slice(0, 1).toLowerCase();
    const value = card.Value;
    img.src = `${baseUrl}${color}${value}.png`;
    return li;
}

async function getCards(player) {
    let response = await fetch("http://nowaunoweb.azurewebsites.net/api/Game/GetCards/" + gameID + "?playerName=" + player, {
        method: 'GET',
        headers: {
            'Content-type': 'application/json; charset=UTF-8',
        }
    });
    if (response.ok) {
        let result = await response.json();
        console.log(result);
        createCards(result.Cards);
    } else {
        alert("HTTP-Error: " + response.status);
    }
}