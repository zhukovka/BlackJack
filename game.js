function Deck () {
	var _cards = this._cards;
	this.getCards = function (){
		return _cards;
	};
	this.deal = function () {
		var c1 = Math.round(Math.random()*(_cards.length-1));
		return _cards.splice(c1, 1)[0];
	};
}

Object.defineProperty(Deck.prototype, '_cards', {
	get: function() {
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
			}
});
var cardMap = {
	'spades':1,
	'clubs':2,
	'hearts':3,
	'diamonds':4,
	width: 73,
	height: 98
}
// var n = 300;
// var deg = (Math.PI/180);

var Game = {
	start: function(players) {
		this.deck = new Deck();
		this.definePlayers(players);
		/*this.dealer = Dealer;
		this.clearData(this.dealer);*/
		
		
		this.dealer.deal(this.dealer, this.deck);
		// this.dealer.changePlayerValue(this.dealer.deal(this.dealer, this.deck), this.dealer);

		this.players.forEach(function (player, index, array) {
			this.clearData(player);
			var x = Canvas.playerPlaces[index].x,
				y = Canvas.playerPlaces[index].y,
				width = Canvas.playerPlaces[index].width,
				height = Canvas.playerPlaces[index].height,
				font = Math.max(width/player.name.length, 12);
			console.log('font', font);
			player.x = x + (width - cardMap.width);
			player.y = y + height;
			Canvas.drawText(player.name, x+10, y+(height/2), font);
			// console.log('player.x, player.y', Canvas.playerPlaces[index].x, player.y);
			this.dealer.deal(player, this.deck);
			this.dealer.deal(player, this.deck);
			// this.getCardsValue(player);
			if(player.value == 21){
				alert(player.name+', тебе повезло, чувак!')
			}else{
				this.askPlayer(player);
			}
		}, this);
	},
	finishGame: function () {
		this.killPlayers();
		this.dealerGame(this.dealer);
		this.getResults(this.dealer);
	},
	clearData: function (player) {
		player.value = 0;
		player.cards = [];
		if(player instanceof Player){
			player.loser = false;
		}
	},
	definePlayers: function (players) {
		/*first time -> no this.players*/
		if(!this.players && !this.dealer){
			console.log('Start first');
			this.dealer = Dealer;
			this.clearData(this.dealer);
			this.dealer.x = Canvas.dealerPlace.x,
			this.dealer.y = Canvas.dealerPlace.y,
			this.players = [];
			
			// if(!players){
			// 	var name = prompt('Enter your name');
				
			// 	while(name){
			// 		this.players.push(new Player(name)); 
			// 		name = prompt('Enter your name');
			// 	};
			// }
		}else{
			/*filter players who don't want to play*/
			// this.players = this.players.filter(function (player, index) {
			// 	var yes = confirm('Do you want to play again');
			// 	if(yes){
			// 		return player;
			// 	}
			// }, this);
		}
		if(players){
			this.players = this.players.concat(players);
			console.log('GAME.Players', this.players);
		}
	},
	killPlayers: function () {
		this.players.forEach(function(player){
			if(player.value > 21){
				player.loser = true;
			}
		});
	},
	askPlayer: function (player) {
		var el = Canvas.renderDialog(player.name, player.value);/*confirm(player.name+', ваш счет '+player.value+'возьмете еще карту?')*/
		var dialog = el.querySelector('.dialog');
		console.log('el', el);
		var self = this;
		el.querySelector('.choise').addEventListener('click', function (e) {
			var answer = e.target.getAttribute('data-answer');
			if(answer == 'yes'){
				var card = self.dealer.deal(player, self.deck);

				if(player.value>21){
					dialog.innerHTML = 'ты лузер!';
					self.finishGame();
					/*index in array?*/
					// alert('');
				}else if(player.value == 21){
					dialog.innerHTML = player.name+', тебе повезло, чувак!';
				}else{
					self.askPlayer(player);
				}
			}else{
				el.innerHTML = '';
				self.finishGame();
			}
			console.log('e.target', e.target.getAttribute('data-answer'));
		});
		// if(yes){
		// }else{
		// 	alert('Ну и зря!');
		// 	return;
		// }
		// return;
	},
	dealerGame: function (dealer) {
		if (dealer.value < 17 ){
			var card = this.dealer.deal(dealer, this.deck);
			this.dealerGame(dealer);
		}
		return;
	},
	getResults: function (dealer) {
		if(dealer.value > 21){
			dealer.scores -=1;
			this.players.forEach(function (player) {
				if(!player.loser){
					player.scores += 1;
				}else{
					player.scores -= 1;
					dealer.scores +=1;
				}
			});
		}
		else{
			this.players.forEach(function (player) {
				if(!player.loser){
					if(dealer.value > player.value){
						player.scores -= 1;
						player.loser = true;
						dealer.scores +=1;
					}else if(dealer.value < player.value){
						player.scores += 1;
						dealer.scores -=1;
					}
				}else{
					player.scores -= 1;
					dealer.scores +=1;
				}
			});
		}
		
		
	}
}


/*Дилер раздаёт карты по две карты каждому игроку,
 себе раздаёт одну карту. 
 Все карты открываются сразу (видны и дилеру, и 
 	игроку).*/
var Dealer = {
	deal: function (player, deck) {
		var card = deck.deal();
		player.cards.push(card);
		player.changePlayerValue(card);
		return card;
	},
	name: 'Dealer',
	cards: [],
	value: 0,
	scores: 0,
	changePlayerValue: changePlayerValue,
};

function Player (name) {
	this.name = name;
	this.value = 0;
	this.scores = 0;
	this.cards = [];
	this.loser = false;
	this.x = 0;
	this.y = 0;

}
Player.prototype.drawName = function(){
	drawText(this.name, this.x, this.y-10, 20);
}
Player.prototype.changePlayerValue = changePlayerValue;

function changePlayerValue(card) {
	this.value += getCardValue(card);
	var txt = 'Value:'+this.value;
	Canvas.drawText(txt, this.x, this.y+cardMap.height+10, 20);
	Canvas.drawCards(this);
	function getCardValue (card) {
		if(card.name<=10){
			return card.name;
		}else if(card.name==14){
			return 11;
		}else{
			return 10;
		}
	};
};

// var Petia = {
// 	name: "Petia",
// 	value: 0,
// 	scores: 0,
// 	cards: []
// }

// var Masha = {
// 	name: "Masha",
// 	value: 0,
// 	scores: 0,
// 	cards: []
// }
// var Kolia = {
// 	name: "Kolia",
// 	value: 0,
// 	scores: 0,
// 	cards: []
// }



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


