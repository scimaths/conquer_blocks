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

import { block_list, Block } from "./block.js";
import { Board } from "./board.js";

var config = {
	type: Phaser.AUTO,
	width: 1600,
	height: 1200,
	physics: {
		default: 'arcade',
		arcade: {
			gravity: { y: 300 },
			debug: true
		}
	},
	scene: {
		preload: preload,
		create: create,
		update: update
	}
};

var game = new Phaser.Game(config);
var platforms;
var player;
var lastSetTint;

// Load assets
function preload() {
	for (const [key, value] of Object.entries(block_list)) {
		console.log(value)
		this.load.image(key, value['image']);
	}
	this.load.image('player', 'assets/Soldiers/Attack (10).png');
}

// Setup initial screen
async function create() {
	//platforms = this.physics.add.staticGroup();
	this.game_time =0
	let i = 0;
	var width = 100;

	let board = new Board(10, 10)

	for (let i = 0; i < board.width; i++) {
		for (let j = 0; j < board.height; j++) {

			let k =this.add.sprite(50 + width*i, 50 + width*j, board.getBlock(i, j).name).setScale(width/512).setInteractive();
			k["id"] = "alpha"
			k.setName("board"+50+width*i+" "+50 + width*j)
			//platforms.create(50 + width*i, 50 + width*j, board.getBlock(i, j).name).setScale(width/512).refreshBody();
			let v =this.add.sprite(50 + width*i, 50 + width*j, 'player').setScale(0.1).setInteractive();
			v.setName("player"+50+width*i+" "+50 + width*j)
			// platforms.create(50 + width*i, 50 + width*j, 'player').setScale(0.1).refreshBody();
		}
	}
	this.input.on('gameobjectdown', (pointer, gameObject)=>{
		if (lastSetTint) {
			lastSetTint.clearTint();
		}
		gameObject.setTint(0xff0000);
		lastSetTint = gameObject;
		console.log(gameObject);
		console.log(pointer);
	})
	// this.input.on('gameobjectup', function (pointer, gameObject) {
    //     gameObject.clearTint();
    // });
	//ursors = this.input.keyboard.createCursorKeys();
}

// Updating the frame
async function update() {
	this.game_time++
	if(this.game_time%60==0)
	{
		const d = new Date();
		let time = d.getTime();
		console.log(time)
	}
	
	// console.log(time);
	//let time_lapse = 
	// console.log(game.input.mousePointer.x);
	// console.log(game.input.mousePointer.y);

}

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