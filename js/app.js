// Swal.fire({
//     type: 'success',
//     text: 'Click OK to start a new game',
//     title: 'Game Over',
//     showCloseButton: true,
//     showCancelButton: true
// }).then((answer) => {
//     if(answer.value) {
//         Swal.fire('sure');
//     } 
    
// });

const timer = document.getElementById('timer');
let secondsCounter = 0;
let timerHandler;

document.getElementById("btnStart").addEventListener("click", function(){

    generateRandomCards();
    startCounter();
});
function clearGrid() {
    let cards = document.querySelectorAll(".card");
    for(card of cards) {
        card.removeEventListener('click', cardClicked);
    }
    document.getElementById("game-board").innerHTML = "";
}

function generateRandomCards() {
    let icons = ["frog","frog",
                 "biking","biking",
                 "bus", "bus",
                 "car", "car",
                 "chess-knight", "chess-knight",
                 "crow", "crow",
                 "dove", "dove",
                 "grin", "grin"];

    let board = document.getElementById("game-board");
    board.innerHTML = "";

    for(let y=0; y<4; y++) {
        for(let x=0; x<4; x++) {
            let card = document.createElement("div");
            let text = document.createElement("span");
            card.appendChild(text);

            card.classList.add("card");
            card.classList.add("closed");
            card.classList.add("fas");
            let index = parseInt(Math.random() * icons.length);
            let icon = icons.splice(index, 1);
            text.classList.add("fa-" + icon);
            card.addEventListener('click', cardClicked);
            //card.innerText = `x:${x}, y:${y}`;
            board.appendChild(card);
        }
    }
}

function cardClicked() {
    
    let flippedCards = document.querySelectorAll(".card.flipped").length;

    // check if current clicked card is already flipped open
    if(this.classList.contains("flipped")) {
        // it is? then just ignore the click, and early-exit this function
        return;

    // if it is not, then make sure we have less than 2 cards flipped open
    } else if(flippedCards<2) {
        
        // we need to make sure that no more than only 2 cards 
        // are flipped open at any time. 

        this.classList.toggle("flipped");
        this.classList.toggle("closed");

        // since the current card has just been manually flipped, 
        // the count should be updated.
        // however, we can't just use querySelectorAll too soon.
        // that's why we will just add 1 to it to do its job.
        flippedCards += 1;
        // if we have 2 cards open, then we are ready to check if they are a match
        if(flippedCards == 2) {
            // wait 1 second for the user to register the card (visual feedback)
            // then call checkMatchingCards function which will do the comparision
            setTimeout(checkMatchingCards, 1000);
        }
        
    }

    
}

function checkMatchingCards() {
    let flippedCards = document.querySelectorAll(".card.flipped");

    if(flippedCards.length === 2) {

        for(card of flippedCards) {
            card.classList.toggle("closed");
            card.classList.toggle("flipped");
        }
    }
}

function startCounter() {
    clearInterval(timerHandler);

    timerHandler = setInterval(function(){
        secondsCounter += 1;
        timer.innerText = secondsToTimeFormat(secondsCounter);    
    },1000);
}


function secondsToTimeFormat(secondsCounter) {
    let hours = parseInt(secondsCounter / (60*60));
    if(hours<10) { hours = "0" + hours;} 
    let minutes = parseInt(secondsCounter / 60) % 60;
    if(minutes<10) { minutes = "0" + minutes; }
    let seconds = secondsCounter % 60;
    if(seconds<10) { seconds = "0" + seconds; }
    return `${hours}:${minutes}:${seconds}`;
}