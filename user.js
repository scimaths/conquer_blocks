export let avatar_list = {
    'king': {
        'growth_rate': 3,
        'hardwork': 30,
        'storage': 40000,
        'war_strength': 10,
        'iron_per_soldier': 100,
    }
};

export class User {
    constructor(name, avatar) {
        this.name = name;
        this.avatar = avatar;
        this.properties = avatar_list[avatar];
        this.playerList = [];
        this.playersCreated = 0;
        this.iron = 0;
        this.technology = 0;
        this.diamond = 0;
    }
}