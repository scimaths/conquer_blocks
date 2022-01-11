/** Connect to Moralis server */
const serverUrl = "https://uziynvgk9swe.usemoralis.com:2053/server";
const appId = "1pEceBLaCdAkvuVU95UJyjxe4zSaM86efw7vNiFI";
Moralis.start({ serverUrl, appId });

/** Add from here down */
async function login() {
  let user = Moralis.User.current();
  if (!user) {
   try {
      user = await Moralis.authenticate({ signingMessage: "Hello World!" })
      console.log(user)
      console.log(user.get('ethAddress'))
   } catch(error) {
     console.log(error)
   }
  }
}

var config = {
  type: Phaser.AUTO,
  width: 800,
  height: 600,
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

// Load assets
function preload () {
  this.load.image('bamboo', 'assets/Blocks/Bamboo.jpg');
  this.load.image('beach', 'assets/Blocks/Beach.jpg');
  this.load.image('brick', 'assets/Blocks/Brick.png');
  this.load.image('brown_brick', 'assets/Blocks/Brown_brick.jpg');
  this.load.image('chess', 'assets/Blocks/Chess.png');
  this.load.image('cliff', 'assets/Blocks/Cliff.jpg');
  this.load.image('destroyed', 'assets/Blocks/Destroyed.jpg');
  this.load.image('grass', 'assets/Blocks/Grass.jpg');
  this.load.image('grassy_floor', 'assets/Blocks/Grassy_floor.jpg');
  this.load.image('leaf', 'assets/Blocks/Leaf.jpg');
  this.load.image('mud', 'assets/Blocks/Mud.jpg');
  this.load.image('pine', 'assets/Blocks/Pine.jpg');
  this.load.image('rust', 'assets/Blocks/Rust.jpg');
  this.load.image('yellow_brick', 'assets/Blocks/Yellow_brick.jpg');
  this.load.image('player', 'assets/Soldiers/Attack (1).png');
}

// Setup initial screen
async function create () {
  let user = Moralis.User.current();
  // this.add.image(400, 300, 'grass').setScale(0.4);
  platforms = this.physics.add.staticGroup();
  
  platforms.create(0, 200, 'bamboo').setScale(0.06).refreshBody();
  platforms.create(30, 200, 'beach').setScale(0.06).refreshBody();
  platforms.create(60, 200, 'brick').setScale(0.06).refreshBody();
  platforms.create(90, 200, 'brown_brick').setScale(0.06).refreshBody();
  platforms.create(120, 200, 'chess').setScale(0.06).refreshBody();
  platforms.create(150, 200, 'cliff').setScale(0.06).refreshBody();
  platforms.create(180, 200, 'destroyed').setScale(0.06).refreshBody();
  platforms.create(210, 200, 'grass').setScale(0.06).refreshBody();
  platforms.create(240, 200, 'grassy_floor').setScale(0.06).refreshBody();
  platforms.create(270, 200, 'leaf').setScale(0.06).refreshBody();
  platforms.create(300, 200, 'mud').setScale(0.06).refreshBody();
  platforms.create(330, 200, 'pine').setScale(0.06).refreshBody();
  platforms.create(360, 200, 'rust').setScale(0.06).refreshBody();
  platforms.create(390, 200, 'yellow_brick').setScale(0.06).refreshBody();

  player = this.physics.add.sprite(550, 200, 'player').setScale(0.1).refreshBody();

  this.physics.add.collider(player, platforms);
}

// Updating the frame
async function update () {

}

async function logOut() {
  await Moralis.User.logOut();
  console.log("logged out");
}

document.getElementById("btn-login").onclick = login;
document.getElementById("btn-logout").onclick = logOut;

/** Useful Resources  */

// https://docs.moralis.io/moralis-server/users/crypto-login
// https://docs.moralis.io/moralis-server/getting-started/quick-start#user
// https://docs.moralis.io/moralis-server/users/crypto-login#metamask

/** Moralis Forum */

// https://forum.moralis.io/