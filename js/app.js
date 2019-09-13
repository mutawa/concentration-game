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
    clearGrid();
    generateRandomCards();
    startCounter();
});
function clearGrid() {
    let cards = document.querySelectorAll(".card");
    for(card of cards) {
        card.removeEventListender('click', cardClicked);
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
    for(let y=0; y<4; y++) {
        for(let x=0; x<4; x++) {
            let card = document.createElement("div");
            card.classList.add("card");
            card.classList.add("fas");
            let index = parseInt(Math.random() * icons.length);
            let icon = icons.splice(index, 1);
            card.classList.add("fa-" + icon);
            card.addEventListener('click', cardClicked);
            //card.innerText = `x:${x}, y:${y}`;
            board.appendChild(card);
        }
    }
}

function cardClicked() {
    let flippedCards = document.querySelectorAll(".card.flipped");
    

    if(flippedCards.length === 2) {

        for(card of flippedCards) {
            card.classList.toggle("flipped");
        }
    }
    this.classList.toggle("flipped");
    
}

function startCounter() {
    timerHandler = setInterval(function(){
        secondsCounter += 1;
        timer.innerText = secondsToTimeFormat(secondsCounter);    
    },1000);
}

function stopCounter() {
    clearInterval(timerHandler);
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