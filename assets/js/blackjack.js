$(function(){

// DOM REFERENCES & GLOBALS
// ========================
var suits = ["club", "diamond", "heart", "spade"],
    cardValue = ["a",2,3,4,5,6,7,8,9,10,"j","q","k"],
    loader = document.getElementById('loading'),
    cover = document.getElementById('cover'),
    game = document.getElementById('game'),
    fe_player = document.getElementById('player'),
    fe_dealer = document.getElementById('dealer'),
    fe_msg = document.getElementById('msg'),
    controls = document.getElementById('controls'),
    msg,
    userHand,
    dealerHand,
    hiddenCard,
    i = 0;

// DEAL
// ====

var deal = function(){
    var cardSuit = Math.floor(Math.random()*4);
    var cardNumber = Math.floor(Math.random()*13);

    return new Card(cardSuit, cardNumber);
};
 
// CARD
// ====

var Card = function(cardSuit, cardNumber){
    var suit = cardSuit,
        number = cardNumber,
        color = (suit === 1 || suit === 2) ? 'red' : 'black';

    this.getNumber = function(){
        return number;
    };

    this.getLetter = function(){
        return cardValue[number];
    };

    this.getSuit = function(){ 
        return suit;
    };

    this.getValue = function(){ 
        if (number === 1) { 
            return 11; 
        }
        else if (number > 1 && number < 10) { 
            return number;
        }
        else { 
            return 10;
        }
    };

    this.getCard = function(){
        var card = [];

        card = '<div class="' + "card ";
        card += suits[suit] + " " + color + " card-" + cardValue[number];
        card += '"'+ ' data-number="' + cardValue[number] + '">';
        card += '<div class="cover"></div><div class="deck"></div>';
        card += '</div>';

        return card;
    };
};

// HAND
// ====

var Hand = function(){
    var card1 = deal(), 
        card2 = deal(),
        cards = [card1, card2];

    this.getCard1 = function(){
        return card1;
    };

    this.getCard2 = function(){
        return card2;
    };

    this.getHand = function(){
        return cards;
    };

    this.score = function(){
        var sum = 0,
            aces = 0;

        for (i=0; i<cards.length; i++){
            sum += cards[i].getValue();
            sum += 1;

            if (cards[i].getValue()===11){
                aces+=1;
            }
        }

        while(aces > 0 && sum > 21){
            sum-=10;
            aces--;
        }

        return sum;
    };

    this.hitMe = function(){
        var hitCard = deal();

        cards.push(hitCard);

        return hitCard;
    };
};
 
function dealer(){
    var dealer = new Hand(),
        dealerCards = dealer.getHand(),
        dealerCard = [];

        for(i = 0; i < dealerCards.length; i++){
            if (i === 0) {
                dealerCard = '<div class="card unknown"></div>';

                hiddenCard = dealerCards[i].getCard();
            }
            else {
                dealerCard = dealerCards[i].getCard();
            }

            $(fe_dealer).append(dealerCard);
        }

    return dealer;
}
 
function user(){
    var user = new Hand(),
        userCards = user.getHand();

        for(i = 0; i < userCards.length; i++) {
            $(fe_player).append(userCards[i].getCard());
        }

    updateBar("Your hand is "+ user.score() + ", press Hit or Stand");

    return user;
}

function winner(userHand, dealerHand){
    var yourScore = "You got " + userHand.score(),
        dealerScore = "dealer got " + dealerHand.score(); 

    if (userHand.score() > 21){
        if(dealerHand.score() > 21){
            return yourScore + ", " + dealerScore + ". You tied!";
        }
        else{
            return yourScore + ", " + dealerScore + ". You lose!";
        }
    }

    else if(dealerHand.score() > 21){
        return yourScore + ", " + dealerScore + ". You win!";
    }

    else if(userHand.score() > dealerHand.score()){
        return yourScore + ", " + dealerScore + ". You win!";
    }

    else if(userHand.score() === 21){
        return yourScore + "! Blackjack!";
    }

    else if(userHand.score() === dealerHand.score()){
        return yourScore + ", " + dealerScore + ". You tied!";
    }

    else{
        return yourScore + ", " + dealerScore + ". You lose!";
    }
}

function stopGame() {
    $(controls).find('#hit').addClass('dis').off();
    $(controls).find('#stand').addClass('dis').off();
}

function updateBar(msg) {
    $(fe_msg).text(msg);
}

function scoreGame() {
    stopGame();

    $('#dealer .card:first-child').remove();
    $(hiddenCard).prependTo('#dealer').addClass('rolled');

    updateBar(winner(userHand,dealerHand));
    $(controls).find('#restart').show();
}

function playGame(){
    userHand = user();
    dealerHand = dealer();
}

function startOver(){
    $(controls).find('#hit').removeClass('dis').on();
    $(controls).find('#stand').removeClass('dis').on();

    playGame();

    $(controls).find('#restart').hide();
}

function hitPlayer(){
    var hitPlayer = userHand.hitMe(),
        newCard = hitPlayer.getCard();

    $(newCard).appendTo(fe_player).addClass('placed');
    
}


function hitDealer(){
    var hitDealer = dealerHand.hitMe(),
        newCard = hitDealer.getCard();

    $(newCard).appendTo(fe_dealer).addClass('placed');
}

// ANIMATIONS
// ==========

var coverAnimate = function () {
    cover.style.visibility = 'visible';

    // ELEMENTS IN
    $('#logo')
        .transition({ x: '-50em' }, 0)
        .transition({ x: '0' }, 600, 'in-out' );
    $('#new-game')
        .transition({ x: '-50em' }, 0);

    // ANIMATE ELEMENTS

    $('#new-game')
        .transition({ x: '0' }, 600, 'in-out');
    $('#logo')
        .transition({ perspective: '439px', rotateY: '0deg' })
        .transition({ perspective: '439px', rotateY: '360deg' }, 600);
        
};

var dealAnimate = function() {
    
    $('.hand').each(function() {
        var i = 0,
            currentHand = $(this),
            currentCard = currentHand.find('.card'),
            addCard;

        addCard = setInterval(function() {
            $(currentCard[i]).addClass('placed');

            if(i === currentCard.length) {
                clearInterval(this);
            }

            i++;
        }, 200);
    });
};


// LOADER 
// ======

var loadingPoints = 0;

var loading = setInterval(function() {

    $('#loading .text .dots').append('.');

    if (loadingPoints > 2) {
        $('#loading .text .dots').html('');

        loadingPoints = 0;
    }
    else {
        loadingPoints++;
    }

}, 180);

setTimeout(function() {
    clearInterval(loading);
    $(loader).fadeOut();
    coverAnimate();
},1200);

// START NEW GAME 
// ==============

playGame();

$('#new-game').on('click', function(e) {
    e.preventDefault();

    $(cover).hide();

    game.style.visibility = 'visible';

    dealAnimate();

    var playerCards = $(fe_player).children(),
        dealerCards = $(fe_dealer).children();

    if (userHand.score() >= 21) {
        scoreGame();
    }

    $(controls).on('click', '#hit', function(e) {
        e.preventDefault();

        if (userHand.score() < 21) {
            hitPlayer();

            if(dealerHand.score() < 17) {
                hitDealer();

                if (dealerHand.score() >= 21) {
                    scoreGame();
                }
            }

            if(userHand.score() >= 21) {
                scoreGame();
            } 

            else {
                updateBar("Your hand is " + userHand.score() + ", press Hit or Stand");
            }
        }

        else {
            scoreGame();
        }
    });

    $(controls).on('click', '#stand', function(e) {
        e.preventDefault();

        scoreGame();
    });

    $(controls).on('click', '#restart', function(e) {
        e.preventDefault();

        $('.hand .card').remove();

        startOver();
        dealAnimate();
    });


});

});
