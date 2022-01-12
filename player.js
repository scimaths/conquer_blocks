export class Player {
    constructor(user) {
        this.user = user;
        this.id = user.playersCreated;
        user.playersCreated += 1;
        user.playerList.append(this);
        
        this.x = 0;
        this.y = 0;
        this.health = 100;
    }

    move_to (x, y, board) {
        this.x = x;
        this.y = y;
        board.getBlock(x, y).playerList.push(this);
    }
}