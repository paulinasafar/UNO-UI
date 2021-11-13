/********************************************************** MODAL NAMES BOX *******************************************************************/
const myModal = new bootstrap.Modal(document.getElementById("playerNames"));
myModal.show();

const playerNames = [];
const playerNamesHardCoded = ["Karo", "Mimi", "Steffi", "Lu"];
const closeButton = document.getElementById('closeButton');
const inputValues = document.getElementsByClassName('form-control');

let gameID;
let topCard;
let playerCards = [];

// Listening for player names + checking if all 4 names are inputed
//-----------------------------------------------------------------
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
        if (playerNamesHardCoded.length == 4) {
            myModal.hide();
            startGame();
        }
    }
})


//Listening for players with same names
//-------------------------------------
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

/********************************************************** STARTING THE GAME *****************************************************************/

//When "New Game" button is clicked, new game starts
//---------------------------------------------------
document.getElementById("button-newgame").addEventListener("click", function () {
    location.reload();
});


// Starting the Game - obtatining Players, Cards and Score
//--------------------------------------------------------
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
        topCard = result.TopCard;
        getNextPlayer(nextPlayer);
        getAllPlayers(allPlayers);
        placePlayersAndCards(allPlayers);
    } else {
        alert("HTTP-Error: " + response.status);
    }
}
document.getElementById("closeButton").addEventListener('keyup', startGame);

function getNextPlayer(nextPlayer) { return nextPlayer; }
function getAllPlayers(allPlayers) { return allPlayers; }


/****************************************** SETTING PLAYERS, DECKS, HANDS ******************************************************************/

let playersAndCards = document.getElementById("players-and-cards").children;
playersAndCards = Array.from(playersAndCards);
const player1Position = document.getElementById("player1");
let discard = [topCard];

//Setting up Players, dealing Cards and allocating Score to each Player
//--------------------------------------------------------
function placePlayersAndCards(players) {

    document.getElementById("player1-name").innerHTML = players[0].Player;
    document.getElementById("player1-points").innerHTML = players[0].Score;
    players[0].Cards.forEach(element => {
        document.querySelector("#player1-allCards").appendChild(createCards(element)).classList.add("mycard");
    });

    document.getElementById("player2-name").innerHTML = players[1].Player;
    document.getElementById("player2-points").innerHTML = players[1].Score;
    players[1].Cards.forEach(element => {
        document.querySelector("#player2-allCards").appendChild(createCards(element)).classList.add("mycard");
    });

    document.getElementById("player3-name").innerHTML = players[2].Player;
    document.getElementById("player3-points").innerHTML = players[2].Score;
    players[2].Cards.forEach(element => {
        document.querySelector("#player3-allCards").appendChild(createCards(element)).classList.add("mycard");
    });

    document.getElementById("player4-name").innerHTML = players[3].Player;
    document.getElementById("player4-points").innerHTML = players[3].Score;
    players[3].Cards.forEach(element => {
        document.querySelector("#player4-allCards").appendChild(createCards(element)).classList.add("mycard");
    });

    document.getElementById("discard-deck").appendChild(showTopCard(topCard)).classList.add("mytopcard");

    document.getElementById("draw-deck").appendChild(showCardBack()).classList.add("mybackcard");

    showActivePlayer();
    getPlayersCards(players);
    

}

function getPlayersCards(players) {            
    return players;
}

const baseUrlCards = "http://nowaunoweb.azurewebsites.net/Content/Cards/";
const baseUrlBack = "http://nowaunoweb.azurewebsites.net/Content/";

//Getting Cards for a Player's hand
//---------------------------------
function createCards(card) {
    const img = document.createElement("img");
    const color = card.Color.slice(0, 1).toLowerCase();
    const value = card.Value;
    if (value <= 9) {
        img.src = `${baseUrlCards}${color}${value}.png`;
    } else if (value === 10) {
        img.src = `${baseUrlCards}${color}d2.png`;
    } else if (value === 11) {
        img.src = `${baseUrlCards}${color}s.png`;
    } else if (value === 12) {
        img.src = `${baseUrlCards}${color}r.png`;
    } else if (value === 13) {
        img.src = `${baseUrlCards}wd4.png`;
    } else if (value === 14) {
        img.src = `${baseUrlCards}wild.png`;
    }
    //console.log(img);
    return img;
}

//Obtaining first top card for discard pile
//-----------------------------------------
function showTopCard(topCard) {
    const img = document.createElement("img");
    const color = topCard.Color.slice(0, 1).toLowerCase();
    const value = topCard.Value;
    if (value <= 9) {
        img.src = `${baseUrlCards}${color}${value}.png`;
    } else if (value === 10) {
        img.src = `${baseUrlCards}${color}d2.png`;
    } else if (value === 11) {
        img.src = `${baseUrlCards}${color}s.png`;
    } else if (value === 12) {
        img.src = `${baseUrlCards}${color}r.png`;
    } else if (value === 13) {
        img.src = `${baseUrlCards}wd4.png`;
    } else if (value === 14) {
        img.src = `${baseUrlCards}wild.png`;
    }
    //console.log(img);
    return img;
}

//Obtaining back of UNO card for draw pile
//----------------------------------------
function showCardBack() {
    const img = document.createElement("img");
    img.src = `${baseUrlBack}back.png`;
    //console.log(img);
    return img;
}

// //Getting Cards from API  --> to be used later
// async function getCards(player) {
//     let response = await fetch("http://nowaunoweb.azurewebsites.net/api/Game/GetCards/" + gameID + "?playerName=" + player, {
//         method: 'GET',
//         headers: {
//             'Content-type': 'application/json; charset=UTF-8',
//         }
//     });
//     if (response.ok) {
//         let result = await response.json();
//         console.log(result);
//         result.Cards.forEach(element => {
//             let card = createCards(element);
//             playerCards.push(card);
//             console.log(element);
//         });
//     } else {
//         alert("HTTP-Error: " + response.status);
//     }
// }

// // --> to be used later
// async function getTopCardDiscardDeck() {
//     let response = await fetch("http://nowaunoweb.azurewebsites.net/api/Game/TopCard/" + gameID,
//         {
//             method: 'GET',
//             headers: {
//                 'Content-type': 'application/json; charset=UTF-8',
//             }
//         });
//     if (response.ok) {
//         let result = await response.json();
//         console.log(result);
//         responseForTopCard(result);
//         return true;
//     } else {
//         alert("HTTP-Error: " + response.status);
//         return false;
//     }
// }

//Shows currently active Player
//-----------------------------------------

let allNames = document.getElementsByClassName("playername");
let nextPlayer = getNextPlayer();

function showActivePlayer() {
    let isActivePlayer;
    for (let i = 1; i < 5; i++) {
        let cardsElement = document.getElementById("player" + String(i) + "-allCards");
        let inner = allNames[i - 1].innerHTML;
        if (inner === nextPlayer) {
            cardsElement.classList.add("active-player");
            return isActivePlayer = true;
        } else {
            let activeP = cardsElement.querySelector(".active-player");
            if (activeP != null) {
                activeP.remove();
                return isActivePlayer = false;
            }
        }
    }
}


/****************************************** PLAYERS PLAY ******************************************************************/

let cardIsChosen = document.getElementsByClassName("mycards");

// let isClicked = document.getElementsByTagName('img').onclick = function() {
//    return true;
//  }​;​

 
async function playCard(value, color, wildCard) {

    let response = await fetch("http://nowaunoweb.azurewebsites.net/api/game/playCard/" + gameID + "?value=" + value + "&color=" + color + "&wildColor=" + wildCard, {
        method: 'PUT',
        headers: { 'Content-type': 'application/json; charset=UTF-8', }
    });
    if (response.ok) {
        let result = await response.json();
        console.log(result);
        alert(JSON.stringify(result));
        if (result.error == "WrongColor" || result.error == "IncorrectPlayer" || result.error == "Draw4NotAllowed") {
            return false;
        } else {
            responseForPlayCard(result);
            return true;
        }
    } else {
        alert("HTTP-Error: " + response.status);
        return false;
    }
}


function responseForPlayCard(response) {
    //removePlayedCardFromHand();
    //removeOldTopCard();
    //placePlayedCardOnDiscardPile();
    //showUpdatedPlayersScore(); response.Score for player that played;
    //moveToNextPlayer();
}

async function removePlayedCardFromHand() {
    //elementToRemove.remove();
}

async function removeOldTopCard() {
    //element topCard.remove();
}

async function placePlayedCardOnDiscardPile() {
    //showTopCard(playedCard);
}