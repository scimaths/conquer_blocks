const socket = io("127.0.0.1:8000");

import { block_list, Block } from "./block.js";
import { Board } from "./board.js";
import { Player } from "./player.js";
import { User } from "./user.js";

var config = {
	type: Phaser.AUTO,
	height: 720,
	width: 960,
	physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 0 },
            debug: true
        }
    },
	scene: {
		preload: preload,
		create: create,
		update: update
	}
};

// Game variable
var game = new Phaser.Game(config);

var lastSetTint;

// Moves for each round, to be sent to server
var thisRoundMoves = {
	'playersCreated': {},
	'playerMovements': {},
	'techInvestment': {}
}

// Own username
var userNameSelf;

// User objects for each player
var selfPlayer, opponentPlayer;

// Sprites in current round
var spritesCurr = [];

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

// Textboxes to show resources
var ironText, diamondText;

// Load assets - FIXED
function preload() {
	for (const [key, value] of Object.entries(block_list)) {
		console.log('value: '+value)
		this.load.image(key, value['image']);
	}
	this.load.image('currplayer', 'assets/Soldiers/Attack (10).png');
	this.load.image('oppplayer', 'assets/Soldiers/Attack (1) Invert.png');
	this.load.image('plus', 'assets/plus.png')
}

socket.on('userDetails', user => {
	userNameSelf = user;
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

function submitMoves() {
	thisRoundMoves['techInvestment'] = {
		'value': Math.min(parseInt(document.getElementById('tech_investment').value), selfPlayer.iron),
	}
	socket.emit('moveSubmission', thisRoundMoves);
	thisRoundMoves = {};
	document.getElementById('tech_investment').value = 0;
}

async function create() {
	scene = this;
	playersGroup = this.physics;
	plusGroup = this.physics;
	blockGroup = this.physics;
	console.log(blockGroup);
	socket.emit('ready', 'XYZ');
	var width = 70;
	
	ironText = this.add.text(900, 16, 'Iron: 0', { fontSize: '32px', fill: '#000' });
	diamondText = this.add.text(900, 40, 'Diamond: 0', { fontSize: '32px', fill: '#000' });

	this.input.on('gameobjectdown', (pointer, gameObject) => {
		if (gameBoardSet) {
			lastSetTint = gameObject;
			if (gameObject.name && gameObject.name.splice(4, 4) == "plus") {
				var xpos = parseInt(gameObject.name.splice(0, 1));
				var ypos = parseInt(gameObject.name.splice(2, 1));

				if (selfPlayer.iron >= selfPlayer.properties['iron_per_soldier']) {
					new_player = new Player(selfPlayer, xpos, ypos);
					thisRoundMoves['playersCreated'][new_player.id] = new_player;
					selfPlayer.iron -= selfPlayer.properties['iron_per_soldier'];
					ironText.setText("Iron: " + String(selfPlayer.iron));
				}
			}
		}
	})
}

socket.on('gameBoardObject', gameBoardObject => {
	gameBoard = gameBoardObject;
	gameBoardSet = true;
	console.log(gameBoard);
	var width = 70;
	for (let i = 0; i < gameBoard.width; i++) {
		for (let j = 0; j < gameBoard.height; j++) {
			let k = blockGroup.add.sprite(50 + width*i, 50 + width*j, gameBoard.map[i][j].name).setScale(width/512).setInteractive();
		}
	}
})


// Updating the frame
async function update() {
// 	this.game_time++

// 	if(this.game_time%(60*15)==0) {
// // const d = new Date();
// 		// let time = d.getTime();
// his.input.on('gameobjectdown
// 	if("player" in gameObject.name ){


// 		if (lastSetTint) {
// 			lastSetTint.clearTint();
// 		}
// 		console.log('OK');
// 		socket.emit('update', 'Alpha')
// 		gameObject.setTint(0xff0000);
// 		lastSetTint = gameObject;	}'
// if		)
// 	}
}
// refreshBoard
socket.on('refreshBoard', (board, selfPlayerReceived) => {
	// first we destroy all the existing sprites on the board
	
	gameBoard = board;
	
	for(sprite in spritesCurr){
		sprite.destroy();
	}
	
	selfPlayer = selfPlayerReceived;
	ironText.setText("Iron: " + String(selfPlayer.iron))
	diamondText.setText("Diamond: " + String(selfPlayer.diamond))

	spritesCurr = []
	
	for (let y = 0; y < board.height; y++) {
		for (let x = 0; x < board.width; x++) {
			// get the blocks
			block = board.map[x][y]
			players = block.playerList
			var plusCreated = false;
			for(player of players){
				if(player.user.name == selfPlayer.name){
					let v = playersGroup.add.sprite(50 + width*x - 10, 50 + width*y, 'currplayer').setScale(0.06).setInteractive();
					v.setName(player.id)
					spritesCurr.push(v);
					if (!plusCreated) {
						let pl = plusGroup.add.sprite(50 + width*x + 10, 50 + width*y - 10, 'plus').setScale(0.05).setInteractive();
						pl.setName(String(x) + " " + String(y) + " plus");
						spritesCurr.push(pl);
					}
				}
				else{
					let v = playersGroup.add.sprite(50 + width*x + 10, 50 + width*y, 'oppplayer').setScale(0.06).setInteractive();
					v.setName("Opponent");	
					spritesCurr.push(v)
				}	
			}	
		}
	}
})

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