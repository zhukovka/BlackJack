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
		this.players = [Vasia, Petia];
		this.dealer = Dealer;
		this.dealer.deal(this.dealer);

		this.players.forEach(function (player) {
			this.dealer.deal(player);
			this.dealer.deal(player);
			this.getCardsValue(player);
		}, this);
		this.killPlayers();
	},
	getCardsValue: function (player) {
		player.cards.forEach(function(card){
			player.value += this.getCardValue(card);
		}, this);
	},
	getCardValue:function (card) {
		if(card.name<=10){
			return card.name;
		}else if(card.name==14){
			return 11;
		}else{
			return 10;
		}
	},
	killPlayers: function () {
		this.players = 
		this.players.filter(function(player){
			return player.value <= 21;
		});
	},
	askPlayer: function (player) {
		var yes = confirm('Еще карту?');
		if(yes){
			var card = this.dealer.deal(player);
			player.value += this.getCardValue(card);
			if(player.value>21){
				this.players.splice(this.players.indexOf(player), 1);
				alert('ты лузер!');
				return;
			}else{
				this.askPlayer(player);
			}
		}else{
			alert('Ну и зря!');
			return;
		}
	}
}


/*Дилер раздаёт карты по две карты каждому игроку,
 себе раздаёт одну карту. 
 Все карты открываются сразу (видны и дилеру, и 
 	игроку).*/
var Dealer = {
	deal: function (player) {
		var card = Deck.deal();
		player.cards.push(card);
		return card;
	},
	cards: [],
	value: 0,
};

var Vasia = {
	name: "Vasia",
	value: 0,
	cards: []
}

var Petia = {
	name: "Petia",
	value: 0,
	cards: []
}



Game.start();
console.log(Game.players);
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


