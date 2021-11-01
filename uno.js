//Modal dialogue box
const myModal = new bootstrap.Modal(document.getElementById("playerNames"));
myModal.show();

const playerNames = [];
const closeButton = document.getElementById('closeButton');
const inputValues = document.getElementsByClassName('form-control');

//Listening for player names + checking if all 4 names are inputed
closeButton.addEventListener('click', addPlayerNames);
function addPlayerNames() {
    for (let i = 0; i < inputValues.length; ++i) {
        let playerName = inputValues[i].value;
        if (!playerName) {
            alert("Please enter a name for every Player!");
            myModal.show();  //FUNKTIONIERT NICHT!
        } else {
            playerNames.push(playerName);
        }
    }
    console.log(playerNames);
    return playerNames;
}

//Listening for players with same names
closeButton.addEventListener('click', function () {
    
    for (let i = 0; i < playerNames.length; ++i) {
        let previousName = String(playerNames[i]);
        for (let j = i + 1; i < playerNames.length; ++i) {
            let nextName = String(playerNames[j]);
            if (previousName.localeCompare(nextName) === 0) {
                alert("Player " + String(playerNames[i]) + " already exists. Please enter a different player.");
                myModal.show();  //FUNKTIONIERT NICHT!
            }
        }
    }
})

// REQUIREMENTS:
// ALL NAMES MUST BE ENTERED -> gemacht
// NAMES MUST BE DIFFERENT -> nicht gemacht
