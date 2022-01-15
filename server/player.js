class Player {
    constructor(user, x, y) {
        this.id = user.playersCreated;
        user.playersCreated += 1;
        this.name = user.name;
        this.x = x;
        this.y = y;
        this.health = 100;
        user.playerList.push(this);
    }

    move_to(x, y, board) {
        board.map[this.x, this.y].removePlayer(this.id);
        this.x = x;
        this.y = y;
        board.map[x, y].playerList.push(this);
    }
}

module.exports = { Player };