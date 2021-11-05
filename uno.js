//Modal dialogue box
const myModal = new bootstrap.Modal(document.getElementById("playerNames"));
myModal.show();

const playerNames = [];
const closeButton = document.getElementById('closeButton');
const inputValues = document.getElementsByClassName('form-control');
const playerName1 = document.getElementById('playername1');
const playerName2 = document.getElementById('playername2');
const playerName3 = document.getElementById('playername3');
const playerName4 = document.getElementById('playername4');

//Listening for player names + checking if all 4 names are inputed
document.getElementById('playerNamesForm').addEventListener('submit', function () {
    for (let i = 0; i < inputValues.length; ++i) {
        let playerName = inputValues[i].value;
        if (!playerName) {
            alert("Please enter a name for every Player!");
            EventTarget.preventDefault();
            break;
        } else {
            playerNames.push(playerName);
        }
    }
    console.log(playerNames);
    return playerNames;
})

//Listening for players with same names
document.getElementById('playerNamesForm').addEventListener('keyup', function () {
        for(let i = 0; i < playerName1; ++i)
})

// for (let i = 0; i < playerNames.length; ++i) {
//     let previousName = String(playerNames[i]);
//     for (let j = i + 1; i < playerNames.length; ++i) {
//         let nextName = String(playerNames[j]);
//         if (previousName.localeCompare(nextName) === 0) {
//             alert("Player " + String(playerNames[i]) + " already exists. Please enter a different player.");
//             myModal.show();  //FUNKTIONIERT NICHT!
//         }
//     }
// }