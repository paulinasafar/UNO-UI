'use strict';

/********************************************************** MODAL BOXES *********************************************************************/
//Modal dialogue box
const namesModal = new bootstrap.Modal(document.getElementById("playerNames"));
namesModal.show();

const colorModal = new bootstrap.Modal(document.getElementById("choose-color"));

const resultModal = new bootstrap.Modal(document.getElementById("result"));


const playerNames = [];
const inputValues = document.getElementsByClassName('form-control');
const unoAPI = "http://nowaunoweb.azurewebsites.net/api/game/start";
const cardsLocal = "cards/";
const playersSection = { nameDiv: HTMLElement, pointsDiv: HTMLElement, cardsDiv: HTMLElement };
let gameID;
let topCard;
let nextPlayer;
let allPlayers = [];
let card;
let wildCard;
let lastWild;
let colorModalEvent;
let wobble;
let currentPlayersHand = [];

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
        if (playerNames.length === 4) {
            namesModal.hide();
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
//Gives cards to players
async function startGame() {
    let response = await fetch(unoAPI, {
        method: 'POST',
        body: JSON.stringify(playerNames),
        headers: {
            'Content-type': 'application/json; charset=UTF-8',
        }
    });
    if (response.ok) {
        let startingJson = await response.json();
        console.log(startingJson);
        gameID = startingJson.Id;
        nextPlayer = startingJson.NextPlayer;
        allPlayers = startingJson.Players;
        console.log(allPlayers);
        topCard = startingJson.TopCard;
        placePlayersAndCards(allPlayers);

    } else {
        alert("HTTP-Error: " + response.status);
    }
}
document.getElementById("closeButton").addEventListener('keyup', startGame);


/****************************************** SETTING PLAYERS, DECKS, HANDS ******************************************************************/

//Setting up Players, dealing Cards and allocating Score to each Player
//--------------------------------------------------------
function placePlayersAndCards(players) {

    document.getElementById("player1-name").innerHTML = players[0].Player;
    document.getElementById("player1-points").innerHTML = players[0].Score;
    players[0].Cards.forEach(element => {
        card = createCards(element);
        document.querySelector("#player1-allCards").appendChild(card).classList.add("mycard");
    });

    document.getElementById("player2-name").innerHTML = players[1].Player;
    document.getElementById("player2-points").innerHTML = players[1].Score;
    players[1].Cards.forEach(element => {
        card = createCards(element);
        document.querySelector("#player2-allCards").appendChild(card).classList.add("mycard");
    });

    document.getElementById("player3-name").innerHTML = players[2].Player;
    document.getElementById("player3-points").innerHTML = players[2].Score;
    players[2].Cards.forEach(element => {
        card = createCards(element);
        document.querySelector("#player3-allCards").appendChild(card).classList.add("mycard");
    });

    document.getElementById("player4-name").innerHTML = players[3].Player;
    document.getElementById("player4-points").innerHTML = players[3].Score;
    players[3].Cards.forEach(element => {
        card = createCards(element);
        document.querySelector("#player4-allCards").appendChild(card).classList.add("mycard");
    });

    document.getElementById("discard-deck").appendChild(createCards(topCard)).classList.add("mytopcard");
    document.getElementById("circle-dot").style.background = topCard.Color;

    showActivePlayer();
    getPlayersCards(players);
}

function getPlayersCards(players) {
    return players;
}


//Getting Cards for a Player's hand
//---------------------------------
function createCards(card) {
    const img = document.createElement("img");
    const color = card.Color;
    const value = card.Value;
    img.dataset.color = color;
    img.dataset.value = value;
    img.src = `${cardsLocal}${color}_${value}.png`;
    return img;
}

//Showing draw deck
//----------------------------------------
function showCardBack() {
    const img = document.createElement("img");
    img.src = `${cardsLocal}back.png`;
    return img;
}

//Choose a color with Wild Card
//----------------------------------
let colorButtonClicked = document.getElementById("color-buttons");
colorButtonClicked.addEventListener("click", function (event) {
    wildCard = event.target.id;
    console.log(wildCard);
    playCard(colorModalEvent.dataset.value, colorModalEvent.dataset.color, wildCard);
});

//Shows currently active Player
//-----------------------------------------
function showActivePlayer() {
    playerNames.forEach(player => {
        let playersHandDiv = getEachPlayersSection(player).cardsDiv;
        if (player === nextPlayer) {
            playersHandDiv.classList.add("active-player");
            // deletePreviousCards(playersHandDiv);
            // getCards(player);
        } else {
            const playersHandLength = Array.from(playersHandDiv.children).length;
            playersHandDiv.classList.remove("active-player");
            deletePreviousCards(playersHandDiv);
            for (let i = 0; i < playersHandLength; i++) {
                let img = showCardBack();
                playersHandDiv.appendChild(img).classList.add("mycard");   
            }
        }
    });
}

// get elements(div for name, points, cards) for wanted player
function getEachPlayersSection(player) {
    const playerIndex = playerNames.indexOf(player);
    let allPlayerDivs = document.getElementsByClassName("player");
    allPlayerDivs = Array.from(allPlayerDivs);
    for (let i = 0; i < allPlayerDivs.length; i++) {
        if (playerIndex === i) {
            playersSection.nameDiv = document.getElementById("player" + String(i + 1) + "-name");
            playersSection.pointsDiv = document.getElementById("player" + String(i + 1) + "-points");
            playersSection.cardsDiv = document.getElementById("player" + String(i + 1) + "-allCards");
        }
    }
    return playersSection;
}

// only needed for getCurrentPlayerForGetCards
function check(index) {
    if (index === 0) {
        index = 3;
    } else {
        index--;
    }
    return index;
}

// not working with hiding cards (showing back card)
function getCurrentPlayerForGetCards(result, value) {
    let player;
    let positionCurrentPlayer;
    let positionNextPlayer;
    if (value && result) {
        player = result.Player;
        positionNextPlayer = playerNames.indexOf(player);
        positionCurrentPlayer = check(positionNextPlayer);
        if (value === "10" || value === "13") {
            let positionSkippedPlayer = check(positionCurrentPlayer);
            getCards(playerNames[positionSkippedPlayer]);
            getCards(playerNames[positionCurrentPlayer]);
        } else {
            getCards(playerNames[positionCurrentPlayer]);
            console.log("Test");
        }
    } else {
        player = result.Player;
        positionCurrentPlayer = playerNames.indexOf(player);
        getCards(playerNames[positionCurrentPlayer]);
    }
    // showActivePlayer();
}

/****************************************** PLAYERS PLAY CARD ******************************************************************/

//Finding a card that Player wants to play
//-----------------------------------------
let onlyCards = document.getElementsByClassName("onlycards");
for (let i = 0; i < 4; i++) {
    onlyCards[i].addEventListener("click", function (event) {

        if (event.target.parentElement.classList.contains("active-player")) {
            wobble = event.target;
            event.target.id = "selected-card";
            if (event.target.dataset.color === "Black") {
                colorModalEvent = event.target;
                colorModal.show();
            } else {
                wildCard = "";
                playCard(event.target.dataset.value, event.target.dataset.color, wildCard);
                console.log(event.target.parentElement);
            }
        }
        else {
            setWobble(event.target);
        }
    });
}

//When incorrect Player tries to play, the card wobbles
function setWobble(element) {
    let cardWobble = document.querySelector("#wrong-player");
    if (cardWobble) {
        cardWobble.removeAttribute('id');
    }
    element.id = "wrong-player";
}

//Playing the chosen Card
//-----------------------
async function playCard(value, color, wildCard) {

    let response = await fetch("http://nowaunoweb.azurewebsites.net/api/game/playCard/" + gameID + "?value=" + value + "&color=" + color + "&wildColor=" + wildCard, {
        method: 'PUT',
        headers: { 'Content-type': 'application/json; charset=UTF-8', }
    });
    if (response.ok) {
        let result = await response.json();

        if (result.error === "WrongColor" || result.error === "Draw4NotAllowed") {
            console.log(result.error);
            removeSelectedCardAttribute();
            setWobble(wobble);
        } else {
            console.log(result);
            nextPlayer = result.Player;
            responseForPlayCard(result);
            // getCurrentPlayerForGetCards(result, value);
            playerNames.forEach(element => {
                getCards(element);
            });
            // showActivePlayer();

        }

    } else {
        alert("HTTP-Error: " + response.status);
        return false;
    }
}
//Putting it on the Discard Deck 
function responseForPlayCard(result) {
    let chosenCardImg = document.getElementById("selected-card");
    chosenCardImg.remove();
    removeOldTopCard();
    getNewTopCard();
    // showActivePlayer();
}

async function removeOldTopCard() {
    let topCardToRemove = document.getElementsByClassName("mytopcard")[0];
    topCardToRemove.remove();
}

function removeSelectedCardAttribute() {
    let removeSelectedCard = document.getElementById("selected-card");
    removeSelectedCard.removeAttribute("id");
}

/********************************************** GET CARDS FOR PLAYER ******************************************************************/

//Getting Cards from API  --> to be used later
async function getCards(player) {

    let response = await fetch("http://nowaunoweb.azurewebsites.net/api/Game/GetCards/" + gameID + "?playerName=" + player, {
        method: 'GET',
        headers: { 'Content-type': 'application/json; charset=UTF-8' }
    });
    if (response.ok) {
        const result = await response.json();
        let currentPlayersHand = getEachPlayersSection(player).cardsDiv;
        deletePreviousCards(currentPlayersHand);
        result.Cards.forEach(card => {
            let img = createCards(card);
            currentPlayersHand.appendChild(img).classList.add("mycard");
        });
        getEachPlayersSection(player).pointsDiv.innerHTML = result.Score;
        showActivePlayer();
        if (result.Cards.length === 1) {
            document.getElementById("circle-dot").innerText = "UNO!";
        }
        if(result.Cards.length === 0){
            fillResultModal();
        }
        return true;
    } else {
        alert("HTTP-Error: " + response.status);
    }
}

function deletePreviousCards(activePlayer) {
    while (activePlayer.firstChild) {
        activePlayer.removeChild(activePlayer.firstChild);
    }

}

/****************************************** DRAW CARD FROM DECK ******************************************************************/
//Player gets drawn card
//-----------------------
async function drawACardFromDeck() {
    let response = await fetch("http://nowaunoweb.azurewebsites.net/api/Game/DrawCard/" + gameID, {
        method: 'PUT',
        headers: { 'Content-type': 'application/json; charset=UTF-8', }
    });
    if (response.ok) {
        let result = await response.json();
        console.log(result);
        nextPlayer = result.NextPlayer;

        let img = createCards(result.Card);
        document.getElementsByClassName("active-player")[0].appendChild(img).classList.add("mycard");

        playerNames.forEach(element => {
            getCards(element);
        });
        // getCurrentPlayerForGetCards(result);
        // showActivePlayer();

    } else {
        alert("HTTP-Error: " + response.status);
    }
}

//Player draws a card
//---------------------
document.getElementById("draw-deck").addEventListener("click", function (event) {
    setTurnAround(event.target);
    drawACardFromDeck();
    showActivePlayer();
})

function setTurnAround(element) {
    element.classList.remove("draw-card");
    element.offsetWidth;
    element.classList.add("draw-card");
}

/****************************************** SHOW TOP CARD ON DISCARD DECK ****************************************************************/

async function getNewTopCard() {

    let response = await fetch("http://nowaunoweb.azurewebsites.net/api/Game/TopCard/" + gameID,
        {
            method: 'GET',
            headers: {
                'Content-type': 'application/json; charset=UTF-8',
            }
        });
    if (response.ok) {
        let result = await response.json();
        console.log(result);
        appendTopCard(result);
        if (result.Color === "Black") {
            document.getElementById("circle-dot").style.background = wildCard;
        } else {
            document.getElementById("circle-dot").style.background = result.Color;
        }
        return true;
    } else {
        console.log("HTTP-Error: " + response.status);
        return false;
    }
}

function appendTopCard(response) {
    let img = createCards(response);
    let myElem = document.getElementById("discard-deck");
    myElem.appendChild(img).classList.add("mytopcard");
}



function fillResultModal() {
    // todo -> fill div's
    resultModal.show();
}