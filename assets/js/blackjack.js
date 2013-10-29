/**
 * JSblackjack 0.2.1 (https://github.com/vctrfrnndz/JSblackjack)
 * (c) 2012-2013 Victor Fernandez <victor@vctrfrnndz.com>
 * MIT Licensed.
 */

// TODO
// - Move away from jquery/transit dependency
// - Replace global variables for options object
// - Make score status updates only after the cards are visually dealed
// - Implement betting

var Card, Game, Hand, UserException, barContainer, cardValue, controlsContainer, dealerContainer, dealerHand, hiddenCard, playerContainer, playerHand, suits;

suits = ["club", "diamond", "heart", "spade"];

cardValue = ["a", 2, 3, 4, 5, 6, 7, 8, 9, 10, "j", "q", "k"];

playerContainer = "#player";

dealerContainer = "#dealer";

controlsContainer = "#controls";

barContainer = "#msg";

Game = {
    deal: function () {
        var cardNumber, cardSuit;

        cardSuit = Math.floor(Math.random() * suits.length);
        cardNumber = Math.floor(Math.random() * cardValue.length);

        return new Card(cardSuit, cardNumber);
    },

    hitUser: function (role) {
        var cardObject, newCard, userContainer;

        if (role === 'player') {
            cardObject = playerHand.hitMe();
            userContainer = playerContainer;
        }
        else if (role === 'dealer') {
            cardObject = dealerHand.hitMe();
            userContainer = dealerContainer;
        }
        else {
            throw new UserException('hitUser function needs a role');
        }

        newCard = cardObject.getCard();

        $(newCard).appendTo(userContainer).addClass('placed');
    },

    createHand: function (role) {
        var card, newHand, userCard, userCards, userContainer, i, len;

        newHand = new Hand();
        userCards = newHand.getHand();
        userContainer = null;

        if (role === 'player') {
            userContainer = playerContainer;
        }
        else if (role === 'dealer') {
            userContainer = dealerContainer;
        }
        else {
            throw new UserException('createHand function needs a role');
        }
        for (i = 0, len = userCards.length; i < len; i++) {
            card = userCards[i];
            userCard = userCards[i].getCard();
            if (role === 'dealer' && i === 0) {
                userCard = userCards[i].getCard('hidden');
                hiddenCard = userCards[i].getCard();
            }
            else {
                userCard = userCards[i].getCard();
            }
            $(userContainer).append(userCard);
        }
        if (role === 'player') {
            Game.helpers.updateBar('Your hand is '+ newHand.score() + ', press Hit or Stand');
        }

        return newHand;
    },

    declareWinner: function (playerHand, delaerHand) {
        var dealerScored, gameScore, playerScored;

        playerScored = 'You got ' + playerHand.score();
        dealerScored = 'dealer got ' + dealerHand.score();
        gameScore = playerScored + ', ' + dealerScored;

        if (playerHand.score() === 21) {
            return playerScored + '! Blackjack!';
        }
        else if (playerHand.score() > 21) {
            if (dealerHand.score() > 21) {
                return gameScore + '. You tied!';
            }
            else {
                return gameScore + '. You lose!';
            }
        }
        else if (dealerHand.score() > 21) {
            return gameScore + '. You win!';
        }
        else if (playerHand.score() > dealerHand.score()) {
            return gameScore + '. You win!';
        }
        else if (playerHand.score() === dealerHand.score()) {
            return gameScore + '. You tied!';
        }
        else {
            return gameScore + '! You lose!';
        }
    },

    helpers: {
        dealAnimate: function () {
            $('.hand').each(function () {
                var counter, currentCard, currentHand, animation;
                counter = 0;
                currentHand = $(this);
                currentCard = currentHand.find(".card");
                animation = setInterval(function () {
                    $(currentCard[counter]).addClass('placed');
                    if (counter === currentCard.length) {
                        clearInterval(this);
                    }
                    counter++;
                }, 200);
            });
        },

        updateBar: function (message) {
            $(barContainer).text(message);
        },

        stopControls: function () {
            $(controlsContainer).find("#hit, #stand").addClass('dis');
        }
    },

    play: {
        finish: function () {
            Game.helpers.stopControls();
            $(dealerContainer).find(".card:first-child").remove();
            $(hiddenCard).prependTo(dealerContainer).addClass('rolled');
            Game.helpers.updateBar(Game.declareWinner(playerHand, dealerHand));
            $(controlsContainer).find("#restart").show();
        },

        evaluate: function () {
            if (playerHand.score() >= 21) {
                Game.play.finish();
            }
            else if (playerHand.score() < 21) {
                Game.hitUser('player');

                if (dealerHand.score() < 17) {
                    Game.hitUser('dealer');

                    if (dealerHand.score() >= 21) {
                        Game.play.finish();
                    }
                }
                if (playerHand.score() >= 21 || dealerHand.score() >= 21) {
                    Game.play.finish();
                }
                else {
                    Game.helpers.updateBar('Your hand is ' + playerHand.score() + ', press Hit or Stand');
                }
            }
            else {
                Game.play.finish();
            }
        }
    },

    startScreen: function() {
        $('#cover').css('visibility', 'visible');

        $('#logo')
            .transition({ x: '-50em' }, 0)
            .transition({ x: '0' }, 600, 'in-out' );
        $('#new-game')
            .transition({ x: '-50em' }, 0);

        $('#new-game')
            .transition({ x: '0' }, 600, 'in-out');
        $('#logo')
            .transition({ perspective: '439px', rotateY: '0deg' })
            .transition({ perspective: '439px', rotateY: '360deg' }, 600);
    },

    startNew: function () {
        playerHand = Game.createHand('player');
        dealerHand = Game.createHand('dealer');

        Game.helpers.dealAnimate();

        if (playerHand.score() >= 21) {
            Game.play.finish();
        }
    },

    init: function () {
        Game.startScreen();

        $("#new-game").on('click', function () {
            Game.startNew();
            $("#cover").hide();
            $('#game').css('visibility', 'visible');
            return false;
        });

        $(controlsContainer).on('click', '#hit:not(.dis)', function () {
            Game.play.evaluate();
            return false;
        });

        $(controlsContainer).on('click', '#stand:not(.dis)', function () {
            Game.play.finish();
            return false;
        });

        $(controlsContainer).on('click', '#restart', function () {
            $(".card").remove();
            $(controlsContainer).find('#hit, #stand').removeClass('dis');
            $(controlsContainer).find('#restart').hide();
            Game.startNew();
            return false;
        });
    }
};

Card = function (cardSuit, cardNumber) {
    var color, number, suit;

    suit = cardSuit;
    number = cardNumber;
    color = suit === 1 || suit === 2 ? 'red' : 'black';

    this.getNumber = function () {
        return number;
    };

    this.getSuit = function () {
        return suit;
    };

    this.getLetter = function () {
        return cardValue[number];
    };

    this.getValue = function () {
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

    this.getCard = function (type) {
        var card;

        if (type === 'hidden') {
            card = '<div class="card unknown"></div>';
        }
        else {
            card = '<div class="' + "card ";
            card += suits[suit] + " " + color + " card-" + cardValue[number];
            card += '"' + ' data-number="' + cardValue[number] + '">';
            card += '<div class="cover"></div><div class="deck"></div>';
        }

        return card;
    };
};

Hand = function () {
    var card1, card2, handCards;

    card1 = Game.deal();
    card2 = Game.deal();
    handCards = [card1, card2];

    this.getFirstCard = function () {
        return card1;
    };

    this.getSecondCard = function () {
        return card2;
    };

    this.getHand = function () {
        return handCards;
    };

    this.score = function () {
        var aces, card, sum, i, len;

        sum = 0;
        aces = 0;

        for (i = 0, len = handCards.length; i < len; i++) {
            card = handCards[i];
            sum += handCards[i].getValue();
            sum += 1;

            if (handCards[i].getValue() === 11) {
                aces += 1;
            }
        }

        while (aces > 0 && sum > 21) {
            sum -= 10;
            aces--;
        }

        return sum;
    };

    this.hitMe = function () {
        var randomCard;

        randomCard = Game.deal();
        handCards.push(randomCard);

        return randomCard;
    };
};

UserException = function (message) {
    this.message = message;
    this.name = 'UserException';
};

$(document).ready(function () {
    Game.init();
});