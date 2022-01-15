let avatar_list = {
    'king1': {
        'growth-rate': 3,
        'hardwork': 400,
        'storage': 40000,
        'war-strength': 10,
        'iron_per_soldier': 1000,
        'image': 'assets/King1.png'
    },
    'king2': {
        'growth-rate': 3,
        'hardwork': 400,
        'storage': 40000,
        'war-strength': 10,
        'iron_per_soldier': 1000,
        'image': 'assets/King2.jpg'
    }
};

class User {
    constructor(name, avatar) {
        this.name = name;
        this.avatar = avatar;
        this.properties = avatar_list[avatar];
        this.playerList = [];
        this.playersCreated = 0;
        this.iron = 2000;
        this.technology = 0;
        this.diamond = 0;
    }
}

module.exports = { User, avatar_list };