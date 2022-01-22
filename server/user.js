let avatar_list = {
    'chanakya': {
        'hardwork_iron': 400,
        'hardwork_diamond': 20,
        'war-strength': 10,
        'iron_per_soldier': 600,
        'image': 'assets/chanakya.png'
    },
    'ashoka': {
        'hardwork_iron': 500,
        'hardwork_diamond': 30,
        'war-strength': 20,
        'iron_per_soldier': 800,
        'image': 'assets/ashoka.png'
    },
    'akbar': {
        'hardwork_iron': 550,
        'hardwork_diamond': 40,
        'war-strength': 40,
        'iron_per_soldier': 900,
        'image': 'assets/akbar.png'
    },
    'rana_pratap': {
        'hardwork_iron': 600,
        'hardwork_diamond': 40,
        'war-strength': 30,
        'iron_per_soldier': 1000,
        'image': 'assets/rana_pratap.png'
    },
    'laxmibai': {
        'hardwork_iron': 700,
        'hardwork_diamond': 40,
        'war-strength': 50,
        'iron_per_soldier': 1100,
        'image': 'assets/laxmibai.png'
    },
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