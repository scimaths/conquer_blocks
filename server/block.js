const e = require("express");

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

class Block {

    // Constructor - Name, Position, Properties, Players
    constructor(name, x, y) {
        this.name = name;
        this.x = x;
        this.y = y;
        this.properties = Object.create(block_list[name]);
        this.playerList = [];
    }

    // Processing event block-by-block
    processEvent(userOne, userTwo) {

        let thisRoundIron = this.properties.iron;
        let thisRoundDiamond = this.properties.diamond;

        // Updated list to be assigned to playerList
        this.updatedPlayerList = [];

        // Users on this block
        let users = [];
        
        // Damage being given to other team
        let damage = {};
        let userCnt = {};
        
        // Calculating damage
        // For two players A and B, "A can do 60 damage to B" is stored as {A: 60}
        for (const player of this.playerList) {   
            // Maintain list of users
            let userAdded = false;
            for (var user of users) {
                if (player.name == user.name) {
                    userAdded = true;
                    userCnt[player.name] += 1;
                }
            }
            if (!userAdded) {
                users.push(player.name);
                userCnt[player.name] = 1;
            }
            
            if (!(player.name in damage)) {
                damage[player.name] = 0;
            }
            damage[player.name] += player.properties['war-strength'];
        }
        
        // If multiple parties on this block
        if (Object.keys(damage).length == 2) {

            // Checking players which die
            for (const player of this.playerList) {
                
                // Name of opponent
                let opponentUser = "whichPlayer";
                for (const username of Object.keys(damage)) {
                    if (username != player.name) {
                        opponentUser = username;
                    }
                }
                
                player.health -= damage[opponentUser]/userCnt[player.name];

                // If player dies
                if (player.health <= 0) {
                    var newList = []
                    for (const player_find of this.playerList) {
                        if (!(player.id == player_find.id)) {
                            newList.push(player_find);
                        }
                    }
                    if (player.name == userOne.name) {
                        userOne.playerList = newList;
                    }
                    else {
                        userTwo.playerList = newList;
                    }
                }
                else {
                    // Update next timestamp's list
                    this.updatedPlayerList.push(player);
                }
            }
            // Update list of alive players
            this.playerList = this.updatedPlayerList;
            this.updatedPlayerList = [];
        }

        // Sum of material to be used by live players
        let ironSum = 0;
        let diamondSum = 0;
        
        // Storing needs of each user
        let diamondDivision = {};
        let ironDivision = {};
        
        // Update sums and need for each user
        for (const player of this.playerList) {

            var thisPlayerUser;
            if (player.name == userOne.name) {thisPlayerUser = userOne;}
            else {thisPlayerUser = userTwo;} 

            // Update user iron need and sum
            if (!(player.name in ironDivision)) {
                ironDivision[player.name] = 0;
            }
            ironDivision[player.name] += player.properties['hardwork'];
            ironSum += player.properties['hardwork'];
            
            // Check user diamond need and sum
            if (thisPlayerUser.technology > 1000) {
                if (!(player.name in diamondDivision)) {
                    diamondDivision[player.name] = 0;
                }
                diamondDivision[player.name] += player.properties['hardwork'] / 10;
                diamondSum += player.properties['hardwork'] / 10;
            }
        }

        var twoUsers = [userOne, userTwo]

        // Iterate through users, update their iron and diamond collections
        for (var user of twoUsers) {
            if (user) {
                if (ironDivision[user.name] && thisRoundIron > 0) {
                    let updateValue = (Math.round(ironDivision[user.name] / ironSum)) * Math.min(ironSum, thisRoundIron);
                    user.iron += updateValue;
                    this.properties.iron -=  updateValue;
                }
                if (diamondDivision[user.name] && thisRoundDiamond > 0) {
                    let updateValue = (diamondDivision[user.name] / diamondSum) * Math.min(diamondSum, thisRoundDiamond);
                    user.diamond += updateValue;
                    this.properties.diamond -= updateValue;
                }
            }
        }
    }
};

module.exports = { block_list, Block };