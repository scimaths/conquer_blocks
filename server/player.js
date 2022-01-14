class Player {
    constructor(user,x,y) {
        this.user = user;
        this.id = user.playersCreated;
        user.playersCreated += 1;
        user.playerList.push(this);
        
        this.x = x;
        this.y = y;
        this.health = 100;
    }

    move_to (x, y, board) {
        this.x = x;
        this.y = y;
        board.getBlock(x, y).playerList.push(this);
    }
}

module.exports = { Player };