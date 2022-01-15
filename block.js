export let block_list = {
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
        diamond: 0
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


export class Block {

    // Constructor - Name, Position, Properties, Players
    constructor(name, x, y) {
        this.name = name;
        this.x = x;
        this.y = y;
        this.properties = block_list[name];
        this.playerList = [];
    }

    removePlayer(playerID) {
        cnt = 0
        for (var player of this.playerList) {
            if (player.id == playerID) {
                this.playerList = this.playerList.splice(cnt, 1);
                break;
            }
            cnt += 1
        }
    }

    // Processing event block-by-block
    processEvent() {

        let thisRoundIron = this.properties.iron;
        let thisRoundDiamond = this.properties.diamond;

        // Updated list to be assigned to playerList
        this.updatedPlayerList = [];

        // Users on this block
        let users = [];
        
        // Damage being given to other team
        let damage = {};
        
        
        // Calculating damage
        // For two players A and B, "A can do 60 damage to B" is stored as {A: 60}
        for (const player of this.playerList) {
            
            // Maintain list of users
            let userAdded = false;
            for (user of users) {
                if (player.user.name == user.name) {
                    userAdded = true;
                }
            }
            if (!userAdded) {
                users.push(player.user);
            }
            
            if (!(player.user.name in damage)) {
                damage[player.user.name] = 0;
            }
            damage[player.user.name] += player.user.war_strength;
        }
        
        // If multiple parties on this block
        if (Object.keys(damage).length == 2) {
            
            // Checking players which die
            for (const player of this.playerList) {
                
                // Name of opponent
                let opponentUser = "whichPlayer";
                for (const username of Object.keys(damage)) {
                    if (username != player.user.name) {
                        opponentUser = username;
                    }
                }
                
                // Update health
                player.health -= damage[opponentUser]/player.user.playerList.length;
                
                // If player dies
                if (player.health <= 0) {
                    
                    // Clear user's player list
                    index = 0;
                    for (const player_find of this.playerList) {
                        if (player.id == player_find.id) {
                            break;
                        }
                        index += 1;
                    }
                    player.user.playerList.splice(index, 1);
                }
                else {
                    // Update next timestamp's list
                    this.updatedPlayerList.push(player);
                }
            }
        }
        
        // Update list of alive players
        this.playerList = this.updatedPlayerList;
        this.updatedPlayerList = [];
        
        // Sum of material to be used by live players
        let ironSum = 0;
        let diamondSum = 0;
        
        // Storing needs of each user
        let diamondDivision = {};
        let ironDivision = {};
        
        // Update sums and need for each user
        for (const player of this.playerList) {

            // Update user iron need and sum
            if (!(player.user.name in ironDivision)) {
                ironDivision[player.user.name] = 0;
            }
            ironDivision[player.user.name] += player.user.properties.hardwork;
            ironSum += player.user.properties.hardwork;
            
            // Check user diamond need and sum
            if (player.user.technology > 40000) {
                if (!(player.user.name in diamondDivision)) {
                    diamondDivision[player.user.name] = 0;
                }
                diamondDivision[player.user.name] += player.user.properties.hardwork / 10;
                diamondSum += player.user.properties.hardwork / 10;
            }
        }

        // Iterate through users, update their iron and diamond collections
        for (user of users) {
            if ((user in Object.keys(ironDivision))) {
                let updateValue = (ironDivision[user.name] / ironSum) * Math.min(ironSum, thisRoundIron);
                user.iron += updateValue;
                this.properties.iron -=  updateValue;  
            }
            if ((user in Object.keys(diamondDivision))) {
                let updateValue = (diamondDivision[user.name] / diamondSum) * Math.min(diamondSum, thisRoundDiamond);
                user.diamond += updateValue;
                this.properties.diamond -= updateValue;
            }
        }
    }
};