
const timer = document.getElementById('timer');
let secondsCounter = 0;
let timerHandler;
let matchedCounter;
let attempts;

// add an event handler for the Start Game button click
document.getElementById("btnStart").addEventListener("click", startGame);


function startGame() {
    // reset the score, and timer
    matchedCounter = 0;
    secondsCounter = 0;
    attempts = 0;

    // generate a random game
    generateRandomCards();

    // begin the timer counter
    startCounter();

    // fill the stars on the score, prints the number of attempts
    updateScore();
}

function clearGrid() {
    // before we can clear all HTML elements in the game board,
    // we must first un-subscribe to any event listener that we
    // may have added earlier, to avoid causing performance issues
    // with repeated gameplay (yeah right, as if people will want to play this game repeatidly!)

    let cards = document.querySelectorAll(".card");
    for(card of cards) {
        card.removeEventListener('click', cardClicked);
    }

    // now we can safely clear all HTML elements from the game board
    document.getElementById("game-board").innerHTML = "";
}

function generateRandomCards() {
    // we have 8 icons, each icon has a duplicate match
    // I am using frog-biking-bus-car-chess-crow-dove-grin icons
    // 
    let icons = ["frog",            "frog",
                 "biking",          "biking",
                 "bus",             "bus",
                 "car",             "car",
                 "chess-knight",    "chess-knight",
                 "crow",            "crow",
                 "dove",            "dove",
                 "grin",            "grin"];
    // the reason I decided to put all icons with their duplicated match
    // in a row, is to make randomization easier.
    // I can just pick a random index from 0 to the number of elements in
    // the array. Then extract that element from the array and assign it
    // to the current card in the DOM element. The next time this algorithm
    // is executed, a new random element will be picked, and I will not have
    // to worry about picking an odd number of the same icon, or picking the
    // icon more than twice, since each time I am picking an icon, I am also
    // slicing that item from the array. The next time I need a random index
    // the array length will have been updated automatically, so the random
    // index will be in the safe range.
    //
    // tl;dr: randomizing cards.

    let board = document.getElementById("game-board");

    // clear the board first.
    board.innerHTML = "";

    
    for(let x=0; x<16; x++) {
        // create the card element
        let card = document.createElement("div");
        // create the icon holding span
        let text = document.createElement("span");
        card.appendChild(text);

        // add proper classes (by default it is flipped down)
        card.classList.add("card");
        card.classList.add("closed");
        
        // picking a random element from the icons array
        let index = parseInt(Math.random() * icons.length);
        let icon = icons.splice(index, 1);  // and removing the picked element

        text.classList.add("fas");        // font-awesom requirement
        text.classList.add("fa-" + icon);

        // add an event listener to be triggered at each click
        card.addEventListener('click', cardClicked);
        
        // finally, append the card element to the game board
        board.appendChild(card);
    }
    
}

function cardClicked() {
    
    let flippedCards = document.querySelectorAll(".card.flipped:not(.matched)").length;

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

    // grab hold of all cards that are flipped but have not been matched yet
    let flippedCards = document.querySelectorAll(".card.flipped:not(.matched)");

    if(flippedCards.length === 2) {
        // increment the number of attempts, regardless of if we have a match
        // or not
        attempts += 1;

        let icon = null;        // placeholder for the icon to be checked in both cards
        let matched = false;    // flag to hold the match status, initialy: false

        // first loop is to find out if they are matched
        for(let card of flippedCards) {
            let text = card.querySelector("span");
            // if this is the first card we iterate through, then
            // the place holder will still be null.
            if (icon==null) {
                // store the classname in the placeholder
                icon = text.classList[1]; 
            } else {
                // placeholder is not null, which means that we are 
                // checking the second card.

                if(icon == text.classList[1]) {
                    // set the flag
                    matched = true;
                    matchedCounter += 1;
                }
            }
        }

        // second loop is to apply css style classes depending on the flag
        // from the first loop
        for(let card of flippedCards) {
            if(matched) {
                // remove any click event listener from the card so that
                // we will ignore any future clicks on this card
                card.removeEventListener("click", cardClicked);

                // add .matched class to the card so that styling rules
                // gets applied (animation transitions, etc)
                card.classList.toggle("matched");
            } else {
                // cards are not matched, so flip them back
                card.classList.toggle("closed");
                card.classList.toggle("flipped");
            }
            
        }

        // update score stars and attempts count
        updateScore();

        // check if the game is over (i.e: we have 8 matches ==> 16 cards)
        if (matchedCounter==8) {
            // stop the timer
            clearInterval(timerHandler);

            // grab the current timer 
            let time = document.querySelector("#timer").innerText;

            // grab the obtained stars score
            let stars = document.querySelector("#stars").innerHTML;

            // display a user-friendly message
            // using SweetAlert2 alert box

            Swal.fire({
                title: 'Game Over',
                html: `You matched all cards. 
                      <br>
                      <br>Time: <strong>${time}</strong>
                          Attempts: <strong>${attempts}</strong>
                      <hr>
                      <br>Score: ${stars}`,
                type: 'success',
                showCloseButton: true,
                showCancelButton: true,
                confirmButtonText: 'Play Again'
            }).then((answer) => {
                // check if the user clicked the 'Play Again' button
                if(answer.value) {
                    startGame();
                } 
            });

        }
        
    }
}

function updateScore() {
    // grab hold of the element that contains the attempts counter
    let span = document.querySelector("#attempts span");
    
    // set its contents to the most up-to-date attempts counter.
    span.innerText = attempts;

    // assuming the user matched all cards in the best possible
    // number of attempts (which is 8 in this case), then he/she
    // would get a full score (3 stars out of 3).
    // but we must allow for some slack. 
    //
    //  less than 10 attempts ==>  3 stars
    //      11 to 13 attempts ==>  2 stars
    //  more than 14 attempts ==>  1 star

    // first: we grab hold of the element that displays the stars
    let stars = document.querySelector("#stars");

    // class .fas.fa-star makes a solid star
    // class .far.fa-star makes an empty star
    // the following line will clear any previous html on the stars element
    stars.innerHTML = "<i class='fas fa-star'></i>";  // lowest score: 1 solid star

    // it is important that we check the number of attempts in this order 
    // (from higher to lower) so that the logic of giving stars works.

    // we give a solid star if the attempts are less than 13
    if(attempts<15) {
        stars.innerHTML +=  "<i class='fas fa-star'></i>";  
    } else {
        // otherwise, we give any empty shell of a star
        stars.innerHTML +=  "<i class='far fa-star'></i>";  
    }

    // we give an additional star if the attempts are less than 11
    if(attempts<11) {
        stars.innerHTML +=  "<i class='fas fa-star'></i>";  
    } else {
        // otherwise, we give an empty star
        stars.innerHTML +=  "<i class='far fa-star'></i>";  
    }
}

function startCounter() {
    // stop any previous timer counter
    clearInterval(timerHandler);

    // create a new interval to count seconds
    timerHandler = setInterval(function(){
        // increment number of sconds that have passed.
        secondsCounter += 1;
        // update the timer on the score board
        timer.innerText = secondsToTimeFormat(secondsCounter);    
    }, 1000); // the timer will be updated once every second
}


function secondsToTimeFormat(secondsCounter) {
    // this function convers the number of passed seconds
    // to the human-readable format: hh:mm:ss

    let hours = parseInt(secondsCounter / (60*60));

    if(hours<10) { 
        // add a leading zero the hours digits if it is less
        // than 10. But who would play this game for more than
        // 2 minutes? seriously!
        hours = "0" + hours; 
    } 


    let minutes = parseInt(secondsCounter / 60) % 60;
    if(minutes<10) { 
        // add a leading zero to the minutes digits if 
        // it takes less than 2 digits.
        minutes = "0" + minutes; 
    }

    let seconds = secondsCounter % 60;

    if(seconds<10) { 
        seconds = "0" + seconds; 
    }

    // we can now construct the time from all of the above components
    return `${hours}:${minutes}:${seconds}`;
}