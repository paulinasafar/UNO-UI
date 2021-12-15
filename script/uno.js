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
const playersPointsAndNames = [];
let check;
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
let unoDiv;

// Listening for player names + checking if all 4 names are inputed
//-----------------------------------------------------------------
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
        if (playerNames.length === 4 && check === true) {
            namesModal.hide();
            startGame();
        }
    }
})

//Listening for players with same names
//-------------------------------------
function compareNames() {
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
document.getElementById("button-newgame").addEventListener("click", function() {
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
        gameID = startingJson.Id;
        nextPlayer = startingJson.NextPlayer;
        allPlayers = startingJson.Players;
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

    let topCardImage = createCards(topCard);
    topCardImage.id = "mytopcard";
    document.getElementById("discard-deck").appendChild(topCardImage);
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
colorButtonClicked.addEventListener("click", function(event) {
    wildCard = event.target.id;
    playCard(colorModalEvent.dataset.value, colorModalEvent.dataset.color, wildCard);
});

//Shows currently active Player
//-----------------------------------------
function showActivePlayer() {
    playerNames.forEach(player => {
        let playersHandDiv = getEachPlayersSection(player).cardsDiv;
        if (player === nextPlayer) {
            playersHandDiv.classList.add("active-player");
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


/****************************************** PLAYERS PLAY CARD ******************************************************************/

//Finding a card that Player wants to play
//-----------------------------------------
let onlyCards = document.getElementsByClassName("onlycards");
for (let i = 0; i < 4; i++) {
    onlyCards[i].addEventListener("click", function(event) {

        if (event.target.parentElement.classList.contains("active-player")) {
            wobble = event.target;
            event.target.id = "selected-card";
            if (event.target.dataset.color === "Black") {
                colorModalEvent = event.target;
                colorModal.show();
            } else {
                wildCard = "";
                playCard(event.target.dataset.value, event.target.dataset.color, wildCard);
            }
        } else {
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
            removeSelectedCardAttribute();
            setWobble(wobble);
        } else {
            nextPlayer = result.Player;
            responseForPlayCard();
            
            playerNames.forEach(element => {
                getCards(element);
            });
        }
    } else {
        alert("HTTP-Error: " + response.status);
        return false;
    }
}

//Putting it on the Discard Deck 
async function responseForPlayCard() {
    let chosenCardImg = document.getElementById("selected-card");
    document.getElementById("discard-deck").appendChild(chosenCardImg).classList.add("playedCard");
    await timeoutForAnimation(500);
    removeOldTopCard();
    chosenCardImg.remove();    
    getNewTopCard();
}

function timeoutForAnimation(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function removeOldTopCard() {
    let topCardToRemove = document.getElementById("mytopcard");
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
        // await sleep(2000);
        let currentPlayersHand = getEachPlayersSection(player).cardsDiv;
        deletePreviousCards(currentPlayersHand);
        result.Cards.forEach(card => {
            let img = createCards(card);
            currentPlayersHand.appendChild(img).classList.add("mycard");
        });

        let playersPointsDiv = getEachPlayersSection(player).pointsDiv;
        playersPointsDiv.innerHTML = result.Score;

        if (result.Cards.length === 1) {
            if (playersPointsDiv.parentElement.children.length !== 3) {
                unoDiv = document.createElement("div");
                unoDiv.id = "uno-div";
                unoDiv.innerHTML = "UNO!";
                playersPointsDiv.parentElement.appendChild(unoDiv);
            }
        }
        if (result.Cards.length > 1) {
            if (playersPointsDiv.parentElement.children.length === 3) {
                playersPointsDiv.parentElement.lastChild.remove();
            }
        }
        if (result.Cards.length === 0) {
            playersPointsDiv.parentElement.lastChild.remove();
            fillResultModal();
        }

        showActivePlayer();
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
        nextPlayer = result.NextPlayer;

        let img = createCards(result.Card);
        document.getElementsByClassName("active-player")[0].appendChild(img).classList.add("mycard");

        playerNames.forEach(element => {
            getCards(element);
        });

    } else {
        alert("HTTP-Error: " + response.status);
    }
}

//Player draws a card
//---------------------
document.getElementById("draw-deck").addEventListener("click", function(event) {
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

    let response = await fetch("http://nowaunoweb.azurewebsites.net/api/Game/TopCard/" + gameID, {
        method: 'GET',
        headers: {
            'Content-type': 'application/json; charset=UTF-8',
        }
    });
    if (response.ok) {
        let result = await response.json();
        appendTopCard(result);
        if (result.Color === "Black") {
            document.getElementById("circle-dot").style.background = wildCard;
        } else {
            document.getElementById("circle-dot").style.background = result.Color;
        }
        return true;
    } else {
        return false;
    }
}

function appendTopCard(response) {
    let img = createCards(response);
    img.id = "mytopcard";
    let myElem = document.getElementById("discard-deck");
    myElem.appendChild(img)
}

/********************************************** GAME OVER ******************************************************************/

//Fills Result Modal
//----------------------------
function fillResultModal() {
    playerNames.forEach(element => {
        let elements = getEachPlayersSection(element);
        playersPointsAndNames.push({ name: elements.nameDiv.innerHTML, points: Number(elements.pointsDiv.innerHTML) })
    });
    playersPointsAndNames.sort((a, b) => a.points - b.points);

    document.getElementById("winner").innerHTML = "Congratulations <strong>" + playersPointsAndNames[0].name + "</strong> - you're the winner!";
    document.getElementById("1st-place").innerHTML = "<strong>1st place: Name: </strong>" + playersPointsAndNames[0].name + " - <strong>Points: </strong>" + playersPointsAndNames[0].points;
    document.getElementById("2nd-place").innerHTML = "<strong>2nd place: Name: </strong>" + playersPointsAndNames[1].name + " - <strong>Points: </strong>" + playersPointsAndNames[1].points;
    document.getElementById("3rd-place").innerHTML = "<strong>3rd place: Name: </strong>" + playersPointsAndNames[2].name + " - <strong>Points: </strong>" + playersPointsAndNames[2].points;
    document.getElementById("4th-place").innerHTML = "<strong>4th place: Name: </strong>" + playersPointsAndNames[3].name + " - <strong>Points: </strong>" + playersPointsAndNames[3].points;
    resultModal.show();
}


//Animation for Game Over
//----------------------------
let wheelOfFortune = document.getElementById("wheel-end");
document.getElementById("result-button").addEventListener("click", function() {
    let img = document.createElement("img");
    img.src = "https://media3.giphy.com/media/nLYQKiKkn7nwzvf7Ru/giphy.gif?cid=ecf05e47dusvvhxty7kjz0n561fq2sc045wg1mig4shefwkk&rid=giphy.gif&ct=g";
    wheelOfFortune.appendChild(img);
    document.getElementById("wheel-end").firstElementChild.id = "wheel";
});