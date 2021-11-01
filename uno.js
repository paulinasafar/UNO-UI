const myModal = new bootstrap.Modal(document.getElementById("playerNames"));
myModal.show();

const playerNames = [];
let closeButton = document.getElementById('closeButton');
let elements = document.getElementsByClassName('form-control');

closeButton.addEventListener('click', function () {
    for (let i = 0; i < elements.length; ++i) {
        let playerName = elements[i].value;
        if (!playerName) {
            alert("Please enter a name for every Player!");
                myModal.show();
        } else {
            playerNames.push(playerName);
        }
    }
    console.log(playerNames);
    return playerNames;
});

// REQUIREMENTS:
// ALL NAMES MUST BE ENTERED -> done
// NAMES MUST BE DIFFERENT -> not done

