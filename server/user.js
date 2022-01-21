let avatar_list = {
    'chanakya': {
        'hardwork_iron': 400,
        'hardwork_diamond': 40,
        'war-strength': 10,
        'iron_per_soldier': 1000,
        'image': 'assets/chanakya.png'
    },
    'ashoka': {
        'hardwork_iron': 400,
        'hardwork_diamond': 40,
        'war-strength': 10,
        'iron_per_soldier': 1000,
        'image': 'assets/ashoka.png'
    },
    'laxmibai': {
        'hardwork_iron': 400,
        'hardwork_diamond': 40,
        'war-strength': 10,
        'iron_per_soldier': 1000,
        'image': 'assets/laxmibai.png'
    },
    'rana_pratap': {
        'hardwork_iron': 400,
        'hardwork_diamond': 40,
        'war-strength': 10,
        'iron_per_soldier': 1000,
        'image': 'assets/rana_pratap.png'
    },
    'akbar': {
        'hardwork_iron': 400,
        'hardwork_diamond': 40,
        'war-strength': 10,
        'iron_per_soldier': 1000,
        'image': 'assets/akbar.png'
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