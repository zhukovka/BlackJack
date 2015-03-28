var Deck = {
	deal: function () {
		var c1 = Math.round(Math.random()*this.cards.length);
		return this.cards.splice(c1, 1)[0];
	},
	_cards: (function() {
		var names = fillNames();
		var shapes = ['hearts', 'clubs', 'spades', 'diamonds'];
		var cards = [];
		for (var i = 0; i < shapes.length; i++) {
			for (var j = 0; j < names.length; j++) {
				cards.push({shape: shapes[i],name: names[j]});
			};
		};

		function fillNames () {
			var arr = [];
			for (var i=2; i<=14; i++){
				arr.push(i);
			}
			return arr;
		}
		return cards;
	})(),
	get cards(){
		return this._cards;
	},
	set cards(val){
		this._cards = val;
	}
};



var Game = {
	start: function() {
		this.players = [Player];
		this.dealer = Dealer;
		this.dealer.deal(this.dealer);
		for (var i = 0; i < this.players.length; i++) {
			this.dealer.deal(this.players[i]);
			this.dealer.deal(this.players[i]);
		};
	}
}


/*Дилер раздаёт карты по две карты каждому игроку,
 себе раздаёт одну карту. 
 Все карты открываются сразу (видны и дилеру, и 
 	игроку).*/
var Dealer = {
	deal: function (player) {
		player.cards.push(Deck.deal());
	},
	players: [],
	cards: []
};

var Player = {
	name: "Vasia",
	getCard: function(){

	},
	getCardsValue: function () {
		// body...
	},
	cards: []
}



// Game.start();
// console.log(Game.players);
// console.log(Game.dealer);

function fib (x) {
	var arr = [];
	recur(x-1);
	return arr; 
	function recur(x) {
		if(x<0){
			return;
		}
		if(x==0){
			return arr[0] = 0;
		}
		if(x==1){
			return arr[1] = 1;
		}

		var f = recur(x-1)+recur(x-2);

		return arr[x] = f;
	}
}


