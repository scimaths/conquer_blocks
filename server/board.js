const { Block } = require('./block.js')
const { block_list } = require('./block.js')

class Board {
    constructor(height,width) {
        this.height = height;
        this.width = width;
        this.map = new Array(this.height);
        for (let y = 0; y < this.height; y++) {
            this.map[y] = new Array(this.width);
            for (let x = 0; x < this.width; x++) {
                this.map[y][x] = new Block(Object.keys(block_list)[Math.floor(Math.random()*4)], x, y);
            }
        }
    }

    getBlock (x, y) {
        return this.map[x][y];
    }

    movePlayer(player, x, y){

    }
};

module.exports = { Board };