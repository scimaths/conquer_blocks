class Player {
    constructor(user, x, y) {
        this.id = user.playersCreated;
        user.playersCreated += 1;
        this.name = user.name;
        this.x = x;
        this.y = y;
        this.health = 100;
        this.properties = user.properties
        user.playerList.push(this);
    }

    move_to(x, y) {
        var pastX = this.x;
        var pastY = this.y;
        this.x = x;
        this.y = y;
        return [pastX, pastY];
    }
}

module.exports = { Player };