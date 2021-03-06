Moralis.initialize("i4ksO2vybBAOY0kIx85vyi1w9XqHUOBTzHYL9svK");
Moralis.serverURL = "https://5rezrcp5nmxf.usemoralis.com:2053/server";

var game;
var user = Moralis.User.current();
if (!user) {
	user = await Moralis.Web3.authenticate();
}

var userAddress;
var playerChosen;

var loc = window.location.href.split('=');
if (loc.length == 1) {
	playerChosen = "chanakya";
}
else {
	playerChosen = loc[1];
	var valid = false;
	var avatarList = user.get("avatars")
	for (var avatar of avatarList) {
		if (avatar['name'] == playerChosen && avatar['owned']) {
			valid = true;
		}
	}
	if (!valid) {
		playerChosen = "chanakya"
	}
}

const socket = io("127.0.0.1:8000");

socket.emit('userMetamask', [String(user.get("ethAddress")), playerChosen]);
console.log(user.get("ethAddress") + " " + "logged in")
userAddress = user.get("ethAddress")  

let block_list = {
	'magma': {
		image: 'assets/Blocks/Rust.jpg',
        danger: 70,
        iron: 4000,
        diamond: 400
    },
    'grass': {
		image: 'assets/Blocks/Grass.jpg',
        danger: 5,
        iron: 1000,
        diamond: 40
    },
    'medieval': {
		image: 'assets/Blocks/Destroyed.jpg',
        danger: 10,
        iron: 3000,
        diamond: 200
    },
    'stone': {
		image: 'assets/Blocks/Yellow_brick.jpg',
        danger: 10,
        iron: 2000,
        diamond: 100
    }
};

var config = {
	parent: 'mygame',
	autoCenter: Phaser.Scale.CENTER_BOTH,
	type: Phaser.AUTO,
	height: 720,
	width: 960,
	physics: {
		default: 'arcade',
        arcade: {
			gravity: { y: 0 },
            debug: false
        }
    },
	scene: {
		preload: preload,
		create: create,
		update: update
	}
};

game = new Phaser.Game(config);

// Game variable
// var game = new Phaser.Game(config);

var lastSetTint;

// Moves for each round, to be sent to server
var thisRoundMoves = {
	'playersCreated': [],
	'playerMovements': {},
	'techInvestment': {}
}

// Own username
var userNameSelf;

// User objects for each player
var selfPlayer, opponentPlayer;

// Sprites in current round
var spritesCurr = [];
// stores moved pawns
var moved_pieces = [];

// Whether both players are ready
var bothPlayersReady = false;

// To add player sprites and plus sprites
var playersGroup;
var plusGroup;
var blockGroup;
var scene;

// Board object to store blocks and player lists
var gameBoard;
var gameBoardSet = false;
var block_sprites = new Array(10);

// Textboxes to show resources
var ironText, diamondText, techText, roundText;
var healthText;
var currentHealthTextSet;

// Time Variables
var previousTime;
var roundNumber = 0;

var submitted = [];

// Load assets - FIXED
function preload() {
	for (const [key, value] of Object.entries(block_list)) {
		this.load.image(key, value['image']);
	}
	this.load.image('currplayer', 'assets/Soldiers/Attack (10).png');
	this.load.image('oppplayer', 'assets/Soldiers/Attack (1) Invert.png');
	this.load.image('plus', 'assets/plus.png')
	this.load.image(playerChosen, `assets/${playerChosen}.png`)
}

socket.on('userDetails', username => {
	userNameSelf = username;
})

socket.on('bothPlayersInfo', userInfo => {
	for (let user of userInfo) {
		if (user.name == userNameSelf) {
			selfPlayer = user;
		}
		else {
			opponentPlayer = user;
		}
	}
	bothPlayersReady = true;
})

socket.on('gameOver', winner => {
	if (selfPlayer.name == winner) {
		alert('You Won! You got the winner token.')
	}
	else if (winner == "None") {
		alert('Tie! Better luck next time')
	}
	else {
		alert('You lost! Try again :(')
	}
	window.location.href = "index.html"
})

function submitMoves() {
	thisRoundMoves['techInvestment'] = {
		'value': Math.min(parseInt(document.getElementById('tech_investment').value), selfPlayer.iron),
	}
	socket.emit('moveSubmission', thisRoundMoves);
	console.log("Round " + roundNumber + " submitted")
	submitted.push(roundNumber);
}

document.getElementById('submitButton').addEventListener('click', submitMoves);

function create() {
	scene = this;
	socket.emit('ready', 'XYZ');
	var width = 70;
	
	ironText = this.add.text(740, 16, 'Iron: 0', { fontSize: '15px', fill: '#FFF' });
	diamondText = this.add.text(740, 40, 'Diamond: 0', { fontSize: '15px', fill: '#FFF' });
	techText = this.add.text(740, 64, 'Technology: 0', { fontSize: '15px', fill: '#FFF' })
	roundText = this.add.text(740, 88, 'Round: 0', { fontSize: '15px', fill: '#FFF' })
	healthText = this.add.text(740, 130, 'Players: 0', { fontSize: '15px', fill: '#FFF' })
	var player_selected = 0
	
	this.input.on('gameobjectdown', (pointer, gameObject) => {
		if (lastSetTint && (String(lastSetTint.name).length <= 3) && !moved_pieces.includes(String(lastSetTint.name))) {
			if (gameObject.name.length == 9) {
				var width = 70;
				if(Math.round(Math.abs((gameObject.x-lastSetTint.x+10)/width))+Math.round(Math.abs((gameObject.y-lastSetTint.y-10)/width))==1){
					lastSetTint.setPosition(gameObject.x-10,gameObject.y+10)
					moved_pieces.push(String(lastSetTint.name))
					// this.physics.moveTo(lastSetTint,gameObject.x,gameObject.y)
					thisRoundMoves['playerMovements'][parseInt(lastSetTint.name)] = [(lastSetTint.x-40)/width, (lastSetTint.y-60)/width];
				}
			}
		}
		
		// lastSetTint.clearTint();
		for(var i=0;i<10;i++)
			for(var j=0;j<10;j++)
				block_sprites[i][j].clearTint()

		if(String(gameObject.name).length <=2){
			player_selected = 1
			lastSetTint = gameObject;
			gameObject.setTint(0xff0000);
			var width = 70;
			var x_index = (gameObject.x-40)/width
			var y_index = (gameObject.y-60)/width
			try{ block_sprites[x_index+1][y_index].setTint(0xffff00) } catch{}
			try{ block_sprites[x_index][y_index+1].setTint(0xffff00) } catch{}
			try{ block_sprites[x_index-1][y_index].setTint(0xffff00) } catch{}
			try{ block_sprites[x_index][y_index-1].setTint(0xffff00) } catch{}
		}

		if (gameBoardSet) {
			if (gameObject.name && gameObject.name.length >= 8 && gameObject.name.substring(4, 8) == "plus") {
				var xpos = parseInt(gameObject.name.substring(0, 1));
				var ypos = parseInt(gameObject.name.substring(2, 3));
				if (selfPlayer.iron >= selfPlayer.properties['iron_per_soldier']) {
					thisRoundMoves['playersCreated'].push([xpos, ypos]);
					selfPlayer.iron -= selfPlayer.properties['iron_per_soldier'];
					ironText.setText("Iron: " + String(selfPlayer.iron));
					techText.setText("Technology: " + String(selfPlayer.technology));
					roundText.setText("Round: " + String(roundNumber));
				}
			}
		}
	})
	this.input.on('gameobjectover', (pointer, gameObject) => {
		if (gameObject.name.length == 9 && gameObject.name.substring(4, 9) == "block") {
			var xpos = (gameObject.x-50)/width;
			var ypos = (gameObject.y-50)/width;
			if (currentHealthTextSet && currentHealthTextSet == [xpos, ypos]) {
				
			}
			else {
				currentHealthTextSet = [xpos, ypos]
				var stringText = "Your players: "
				var stringHealths = ""
				var countOver = 0;
				var blockOver = gameBoard.map[xpos][ypos]
				for (var playerOver of blockOver.playerList) {
					if (playerOver.name == selfPlayer.name) {
						countOver += 1
						if (!stringHealths) {
							stringHealths = String(playerOver.health)
						}
						else {
							stringHealths += ", " + playerOver.health
						}
					}
				}
				if (countOver == 0) {
					stringText += "0"
				}
				else {
					stringText += countOver + "\nHealth: " + stringHealths;
				}
				healthText.setText(stringText)
			}
		}
	})
}

socket.on('gameBoardObject', gameBoardObject => {
	gameBoard = gameBoardObject;
	gameBoardSet = true;
	var width = 70;
	for (let i = 0; i < gameBoard.width; i++) {
		block_sprites[i]=new Array(10)
		for (let j = 0; j < gameBoard.height; j++) {
			let k = scene.physics.add.sprite(50 + width*i, 50 + width*j, gameBoard.map[i][j].name).setScale(width/512).refreshBody().setInteractive();
			k.setName(String(i) + " " + String(j) + " " + "block");
			block_sprites[i][j] = k
		}
	}

	scene.physics.add.sprite(850, 400, selfPlayer.avatar).setScale(0.5).refreshBody();

	refreshBoard(gameBoardObject, selfPlayer);
	
	var d = new Date();
	previousTime = d.getTime();
	
	// Entering round 1
	roundNumber += 1;
})


// Updating the frame
async function update() {
	var d = new Date();
	if (d.getTime() - previousTime >= 15000 && !submitted.includes(roundNumber)) {
		submitMoves();
	}
}

function refreshBoard (board, selfPlayerReceived) {
	// first we destroy all the existing sprites on the board
	
	gameBoard = board;

	selfPlayer = selfPlayerReceived;
	ironText.setText("Iron: " + String(selfPlayer.iron))
	techText.setText("Technology: " + String(selfPlayer.technology))
	diamondText.setText("Diamond: " + String(selfPlayer.diamond))

	for (var sprite of spritesCurr) {
		sprite.disableBody(true, true)
	}

	spritesCurr = []

	var width = 70;
	
	for (let y = 0; y < board.height; y++) {
		for (let x = 0; x < board.width; x++) {
			// get the blocks
			var block = board.map[x][y]

			var players = block.playerList
			var plusCreated = false;
			for(var player of players){
				if(player.name == selfPlayer.name){
					let v = scene.physics.add.sprite(50 + width*x - 10, 50 + width*y + 10, 'currplayer').setScale(0.06).refreshBody().setInteractive();
					v.setName(player.id)
					spritesCurr.push(v);
					if (!plusCreated) {
						let pl = scene.physics.add.sprite(50 + width*x + 20, 50 + width*y - 20, 'plus').setScale(0.05).refreshBody().setInteractive();
						pl.setName(String(x) + " " + String(y) + " plus");
						spritesCurr.push(pl);
					}
				}
				else{
					let v = scene.physics.add.sprite(50 + width*x + 10, 50 + width*y + 10, 'oppplayer').setScale(0.06).refreshBody().setInteractive();
					v.setName("Opponent");	
					spritesCurr.push(v)
				}	
			}	
		}
	}
}

socket.on('refreshBoard', (board, users, roundNumberRec) => {
	console.log("Result for Round " + roundNumber + " received")
	thisRoundMoves = {
		'playersCreated': [],
		'playerMovements': {},
		'techInvestment': {}
	}
	document.getElementById('tech_investment').value = 0;
	var selfPlayerReceived;
	for (var user of users) {
		if (user.name == selfPlayer.name) {
			selfPlayerReceived = user;
		}
	}
	refreshBoard(board, selfPlayerReceived);
	moved_pieces = [];
	roundNumber = roundNumberRec;
	roundText.setText("Round: " + String(roundNumber))
	var d = new Date();
	previousTime = d.getTime();
});

// /** Connect to Moralis server */
// const serverUrl = "https://uziynvgk9swe.usemoralis.com:2053/server";
// const appId = "1pEceBLaCdAkvuVU95UJyjxe4zSaM86efw7vNiFI";
// Moralis.start({ serverUrl, appId });

// /** Add from here down */
// async function login() {
//   let user = Moralis.User.current();
//   if (!user) {
//    try {
//       user = await Moralis.authenticate({ signingMessage: "Hello World!" })
//       console.log(user)
//       console.log(user.get('ethAddress'))
//    } catch(error) {
//      console.log(error)
//    }
//   }
// }
//const {Block} = require('./block.js');

// const io = require("socket.io-client");


// async function logOut() {
	//   await Moralis.User.logOut();
	//   console.log("logged out");
	// }
	
	// document.getElementById("btn-login").onclick = login;
	// document.getElementById("btn-logout").onclick = logOut;
	
	// /** Useful Resources  */
	
	// // https://docs.moralis.io/moralis-server/users/crypto-login
	// // https://docs.moralis.io/moralis-server/getting-started/quick-start#user
	// // https://docs.moralis.io/moralis-server/users/crypto-login#metamask
	
	// /** Moralis Forum */
	
	// // https://forum.moralis.io/



	// // Setup initial screen
	// async function create() {
	// 	//platforms = this.physics.add.staticGroup();
	// 	this.game_time = 0
	// 	let i = 0;
	// 	var width = 100;
	
	// 	let board = new Board(10, 10)
	// 	let user1 = new User("ddd", "king")
	// 	for (let i = 0; i < board.width; i++) {
	// 		for (let j = 0; j < board.height; j++) {
	// 			//  k =this.add.sprite(50 + width*i, 50 + width*j, board.getBlock(i, j).name).setScale(width/512).setInteractive();
	// 			k.setName("board"+50+width*i+" "+50 + width*j)
	// 			//platforms.create(50 + width*i, 50 + width*j, board.getBlock(i, j).name).setScale(width/512).refreshBody();
	// 			let v =this.add.sprite(50 + width*i, 50 + width*j, 'player').setScale(0.1).setInteractive();
	// 			user1.playerList.push(new Player(user1, 50 + width*i, 50 + width*j))
	// 			v.setName(user1.playersCreated)
	// 			spritesCurr.push(v)
	// 			// platforms.create(50 + width*i, 50 + width*j, 'player').setScale(0.1).refreshBody();
	// 		}
	// 	}
	
	// 	this.input.on('gameobjectdown', (pointer, gameObject)=>{
			// if (lastSetTint) {
			// 	lastSetTint.clearTint();
			// }
			// console.log('OK');
			// socket.emit('update', 'Alpha')
			// gameObject.setTint(0xff0000);
			// lastSetTint = gameObject;
	// 		console.log('game object: '+gameObject);
	// 		console.log('pointer: '+pointer);
	// 	})
	// 	// this.input.on('gameobjectup', function (pointer, gameObject) {
	// 	//     gameObject.clearTint();
	// 	// });
	// 	//ursors = this.input.keyboard.createCursorKeys();
	// }