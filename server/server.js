// Setting up socket server
const express = require('express');
var Web3 = require('web3');
const app = express();

const socketio = require('socket.io');
const { User } = require('./user.js')
const { Board } = require('./board.js');
const { Player } = require('./player.js');

const http = require('http')
const server = http.createServer(app) 

const io = socketio(server, {
    cors : {
        origin : "http://127.0.0.1:5500",
        methods : ["GET", "POST"],
    }
})


// Dictionary containing users
var users = []
var movesOverRounds = {}
var socketMetamask = {}

var roundNumber = 1;
var gameBoard;

var newUser;
const contractABI = [{ "inputs": [{ "internalType": "string", "name": "_name", "type": "string" }, { "internalType": "string", "name": "_symbol", "type": "string" }, { "internalType": "address", "name": "_proxyRegistryAddress", "type": "address" }, { "internalType": "string", "name": "_templateURI", "type": "string" }, { "internalType": "address", "name": "_migrationAddress", "type": "address" }], "stateMutability": "nonpayable", "type": "constructor" }, { "anonymous": false, "inputs": [{ "indexed": true, "internalType": "address", "name": "account", "type": "address" }, { "indexed": true, "internalType": "address", "name": "operator", "type": "address" }, { "indexed": false, "internalType": "bool", "name": "approved", "type": "bool" }], "name": "ApprovalForAll", "type": "event" }, { "anonymous": false, "inputs": [{ "indexed": true, "internalType": "uint256", "name": "_id", "type": "uint256" }, { "indexed": true, "internalType": "address", "name": "_creator", "type": "address" }], "name": "CreatorChanged", "type": "event" }, { "anonymous": false, "inputs": [{ "indexed": false, "internalType": "address", "name": "userAddress", "type": "address" }, { "indexed": false, "internalType": "address payable", "name": "relayerAddress", "type": "address" }, { "indexed": false, "internalType": "bytes", "name": "functionSignature", "type": "bytes" }], "name": "MetaTransactionExecuted", "type": "event" }, { "anonymous": false, "inputs": [{ "indexed": true, "internalType": "address", "name": "previousOwner", "type": "address" }, { "indexed": true, "internalType": "address", "name": "newOwner", "type": "address" }], "name": "OwnershipTransferred", "type": "event" }, { "anonymous": false, "inputs": [{ "indexed": false, "internalType": "address", "name": "account", "type": "address" }], "name": "Paused", "type": "event" }, { "anonymous": false, "inputs": [{ "indexed": false, "internalType": "string", "name": "_value", "type": "string" }, { "indexed": true, "internalType": "uint256", "name": "_id", "type": "uint256" }], "name": "PermanentURI", "type": "event" }, { "anonymous": false, "inputs": [{ "indexed": true, "internalType": "address", "name": "operator", "type": "address" }, { "indexed": true, "internalType": "address", "name": "from", "type": "address" }, { "indexed": true, "internalType": "address", "name": "to", "type": "address" }, { "indexed": false, "internalType": "uint256[]", "name": "ids", "type": "uint256[]" }, { "indexed": false, "internalType": "uint256[]", "name": "values", "type": "uint256[]" }], "name": "TransferBatch", "type": "event" }, { "anonymous": false, "inputs": [{ "indexed": true, "internalType": "address", "name": "operator", "type": "address" }, { "indexed": true, "internalType": "address", "name": "from", "type": "address" }, { "indexed": true, "internalType": "address", "name": "to", "type": "address" }, { "indexed": false, "internalType": "uint256", "name": "id", "type": "uint256" }, { "indexed": false, "internalType": "uint256", "name": "value", "type": "uint256" }], "name": "TransferSingle", "type": "event" }, { "anonymous": false, "inputs": [{ "indexed": false, "internalType": "string", "name": "value", "type": "string" }, { "indexed": true, "internalType": "uint256", "name": "id", "type": "uint256" }], "name": "URI", "type": "event" }, { "anonymous": false, "inputs": [{ "indexed": false, "internalType": "address", "name": "account", "type": "address" }], "name": "Unpaused", "type": "event" }, { "inputs": [], "name": "ERC712_VERSION", "outputs": [{ "internalType": "string", "name": "", "type": "string" }], "stateMutability": "view", "type": "function" }, { "inputs": [{ "internalType": "address", "name": "_address", "type": "address" }], "name": "addSharedProxyAddress", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [{ "internalType": "address", "name": "_owner", "type": "address" }, { "internalType": "uint256", "name": "_id", "type": "uint256" }], "name": "balanceOf", "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "stateMutability": "view", "type": "function" }, { "inputs": [{ "internalType": "address[]", "name": "accounts", "type": "address[]" }, { "internalType": "uint256[]", "name": "ids", "type": "uint256[]" }], "name": "balanceOfBatch", "outputs": [{ "internalType": "uint256[]", "name": "", "type": "uint256[]" }], "stateMutability": "view", "type": "function" }, { "inputs": [{ "internalType": "address", "name": "_from", "type": "address" }, { "internalType": "uint256[]", "name": "_ids", "type": "uint256[]" }, { "internalType": "uint256[]", "name": "_quantities", "type": "uint256[]" }], "name": "batchBurn", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [{ "internalType": "address", "name": "_to", "type": "address" }, { "internalType": "uint256[]", "name": "_ids", "type": "uint256[]" }, { "internalType": "uint256[]", "name": "_quantities", "type": "uint256[]" }, { "internalType": "bytes", "name": "_data", "type": "bytes" }], "name": "batchMint", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [{ "internalType": "address", "name": "_from", "type": "address" }, { "internalType": "uint256", "name": "_id", "type": "uint256" }, { "internalType": "uint256", "name": "_quantity", "type": "uint256" }], "name": "burn", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [{ "internalType": "uint256", "name": "_id", "type": "uint256" }], "name": "creator", "outputs": [{ "internalType": "address", "name": "", "type": "address" }], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "disableMigrate", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [{ "internalType": "address", "name": "userAddress", "type": "address" }, { "internalType": "bytes", "name": "functionSignature", "type": "bytes" }, { "internalType": "bytes32", "name": "sigR", "type": "bytes32" }, { "internalType": "bytes32", "name": "sigS", "type": "bytes32" }, { "internalType": "uint8", "name": "sigV", "type": "uint8" }], "name": "executeMetaTransaction", "outputs": [{ "internalType": "bytes", "name": "", "type": "bytes" }], "stateMutability": "payable", "type": "function" }, { "inputs": [{ "internalType": "uint256", "name": "_id", "type": "uint256" }], "name": "exists", "outputs": [{ "internalType": "bool", "name": "", "type": "bool" }], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "getChainId", "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "getDomainSeperator", "outputs": [{ "internalType": "bytes32", "name": "", "type": "bytes32" }], "stateMutability": "view", "type": "function" }, { "inputs": [{ "internalType": "address", "name": "user", "type": "address" }], "name": "getNonce", "outputs": [{ "internalType": "uint256", "name": "nonce", "type": "uint256" }], "stateMutability": "view", "type": "function" }, { "inputs": [{ "internalType": "address", "name": "_owner", "type": "address" }, { "internalType": "address", "name": "_operator", "type": "address" }], "name": "isApprovedForAll", "outputs": [{ "internalType": "bool", "name": "isOperator", "type": "bool" }], "stateMutability": "view", "type": "function" }, { "inputs": [{ "internalType": "uint256", "name": "_id", "type": "uint256" }], "name": "isPermanentURI", "outputs": [{ "internalType": "bool", "name": "", "type": "bool" }], "stateMutability": "view", "type": "function" }, { "inputs": [{ "internalType": "uint256", "name": "_id", "type": "uint256" }], "name": "maxSupply", "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "stateMutability": "pure", "type": "function" }, { "inputs": [{ "components": [{ "internalType": "uint256", "name": "id", "type": "uint256" }, { "internalType": "address", "name": "owner", "type": "address" }], "internalType": "struct AssetContractShared.Ownership[]", "name": "_ownerships", "type": "tuple[]" }], "name": "migrate", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [], "name": "migrationTarget", "outputs": [{ "internalType": "contract AssetContractShared", "name": "", "type": "address" }], "stateMutability": "view", "type": "function" }, { "inputs": [{ "internalType": "address", "name": "_to", "type": "address" }, { "internalType": "uint256", "name": "_id", "type": "uint256" }, { "internalType": "uint256", "name": "_quantity", "type": "uint256" }, { "internalType": "bytes", "name": "_data", "type": "bytes" }], "name": "mint", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [], "name": "name", "outputs": [{ "internalType": "string", "name": "", "type": "string" }], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "openSeaVersion", "outputs": [{ "internalType": "string", "name": "", "type": "string" }], "stateMutability": "pure", "type": "function" }, { "inputs": [], "name": "owner", "outputs": [{ "internalType": "address", "name": "", "type": "address" }], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "pause", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [], "name": "paused", "outputs": [{ "internalType": "bool", "name": "", "type": "bool" }], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "proxyRegistryAddress", "outputs": [{ "internalType": "address", "name": "", "type": "address" }], "stateMutability": "view", "type": "function" }, { "inputs": [{ "internalType": "address", "name": "_address", "type": "address" }], "name": "removeSharedProxyAddress", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [], "name": "renounceOwnership", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [{ "internalType": "address", "name": "_from", "type": "address" }, { "internalType": "address", "name": "_to", "type": "address" }, { "internalType": "uint256[]", "name": "_ids", "type": "uint256[]" }, { "internalType": "uint256[]", "name": "_amounts", "type": "uint256[]" }, { "internalType": "bytes", "name": "_data", "type": "bytes" }], "name": "safeBatchTransferFrom", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [{ "internalType": "address", "name": "_from", "type": "address" }, { "internalType": "address", "name": "_to", "type": "address" }, { "internalType": "uint256", "name": "_id", "type": "uint256" }, { "internalType": "uint256", "name": "_amount", "type": "uint256" }, { "internalType": "bytes", "name": "_data", "type": "bytes" }], "name": "safeTransferFrom", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [{ "internalType": "address", "name": "operator", "type": "address" }, { "internalType": "bool", "name": "approved", "type": "bool" }], "name": "setApprovalForAll", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [{ "internalType": "uint256", "name": "_id", "type": "uint256" }, { "internalType": "address", "name": "_to", "type": "address" }], "name": "setCreator", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [{ "internalType": "uint256", "name": "_id", "type": "uint256" }, { "internalType": "string", "name": "_uri", "type": "string" }], "name": "setPermanentURI", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [{ "internalType": "address", "name": "_address", "type": "address" }], "name": "setProxyRegistryAddress", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [{ "internalType": "string", "name": "_uri", "type": "string" }], "name": "setTemplateURI", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [{ "internalType": "uint256", "name": "_id", "type": "uint256" }, { "internalType": "string", "name": "_uri", "type": "string" }], "name": "setURI", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [{ "internalType": "address", "name": "", "type": "address" }], "name": "sharedProxyAddresses", "outputs": [{ "internalType": "bool", "name": "", "type": "bool" }], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "supportsFactoryInterface", "outputs": [{ "internalType": "bool", "name": "", "type": "bool" }], "stateMutability": "pure", "type": "function" }, { "inputs": [{ "internalType": "bytes4", "name": "interfaceId", "type": "bytes4" }], "name": "supportsInterface", "outputs": [{ "internalType": "bool", "name": "", "type": "bool" }], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "symbol", "outputs": [{ "internalType": "string", "name": "", "type": "string" }], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "templateURI", "outputs": [{ "internalType": "string", "name": "", "type": "string" }], "stateMutability": "view", "type": "function" }, { "inputs": [{ "internalType": "uint256", "name": "_id", "type": "uint256" }], "name": "totalSupply", "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "stateMutability": "view", "type": "function" }, { "inputs": [{ "internalType": "address", "name": "newOwner", "type": "address" }], "name": "transferOwnership", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [], "name": "unpause", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [{ "internalType": "uint256", "name": "_id", "type": "uint256" }], "name": "uri", "outputs": [{ "internalType": "string", "name": "", "type": "string" }], "stateMutability": "view", "type": "function" }];//Contract Token ABI

const contractAddress = '0x2953399124F0cBB46d2CbACD8A89cF0599974963'; //Yor token contract address
const ownerAddress = '0x0aaa0e1924f417cd290868b2187f6d3310c63dc4'
const privateKey = '3cc7e2c40ecff7dd649f1435498c39af05197b78ae18a69e74631be8f013eec6';         //The private key of your contract Owner  
const tokenid = "4823589789184167491873069624913210034397340050026939612645948392196020371956"
const amount = 5
//Creating Web3 Object
const web3js = new Web3(new Web3.providers.HttpProvider("https://speedy-nodes-nyc.moralis.io/84a8c779ccfdca1a1f4d31d7/polygon/mumbai"));

//creating Contract Object
var contract = new web3js.eth.Contract(contractABI, contractAddress, { from: ownerAddress });
const value = 5;

async function getTOKENBalanceOf(address) {
    return await contract.methods.balanceOf(address,tokenid).call();
}

async function sendMoney(winner) {
    
    const toAddress = winner; //The address to transfer the tokens    

    var data = contract.methods.safeTransferFrom(ownerAddress,toAddress, tokenid, amount ,[]).encodeABI(); //Create the data for token transaction.

    var rawTransaction = { "to": contractAddress, "gas": 100000, "data": data };

    web3js.eth.accounts.signTransaction(rawTransaction, privateKey)
        .then(signedTx => web3js.eth.sendSignedTransaction(signedTx.rawTransaction))
        .then(req => {
            /* The trx was done. Write your acctions here. For example getBalance */
            getTOKENBalanceOf(toAddress).then(balance => { console.log(toAddress + " Token Balance: " + balance); });
            return true;
    })
}


async function getMoney(purchaser) {
    
    const toAddress = purchaser; //The address to transfer the tokens    

    var data = contract.methods.safeTransferFrom(toAddress, ownerAddress, tokenid, amount ,[]).encodeABI(); //Create the data for token transaction.

    var rawTransaction = { "to": contractAddress, "gas": 100000, "data": data };

    web3js.eth.accounts.signTransaction(rawTransaction, privateKey)
        .then(signedTx => web3js.eth.sendSignedTransaction(signedTx.rawTransaction))
        .then(req => {
            /* The trx was done. Write your acctions here. For example getBalance */
            getTOKENBalanceOf(toAddress).then(balance => { console.log(toAddress + " Token Balance: " + balance); });
            return true;
    })
}

io.on('connection', socket => {
    socket.on('landingPage', ethAddress => {
        getTOKENBalanceOf(ethAddress).then(balance => { io.to(socket.id).emit('moneyAvailable', balance); });
    })

    socket.on('userMetamask', userSent => {
        username = userSent[0]
        userPlayer = userSent[1]
        console.log(String(socket.id) + " has username " + username)
        socketMetamask[String(socket.id)] = username;
        if (users.length == 0) {
            newUser = new User(String(username), userPlayer);
        }
        else {
            newUser = new User(String(username), userPlayer);    
        }
        users.push(newUser);
        io.to(socket.id).emit('userDetails', socketMetamask[String(socket.id)])
    
        if (users.length == 2) {
            gameBoard = new Board(10, 10);
            var player1 = new Player(users[0], 5, 5)
            var player2 = new Player(users[1], 4, 5)
            gameBoard.map[5][5].playerList.push(player1);
            gameBoard.map[4][5].playerList.push(player2);
            io.emit('bothPlayersInfo', users);
            
            console.log('Info sent to both')
        }
    })

    socket.on('ready', value => {
        if (users.length == 2) {
            io.emit('gameBoardObject', gameBoard);
            console.log("Game Board sent")
        }
    })

    socket.on('disconnect', () => {
        console.log(socket.id + " has left the game")
        cnt = 0;
        for (let user of users) {
            if (socketMetamask[String(socket.id)] == user.name) {
                users.splice(cnt, 1);
                break;
            }
            cnt += 1;
        }
    })
    
    socket.on('moveSubmission', movesForRound => {
        console.log(socket.id + " has sent submission for " + roundNumber);
        if (!(roundNumber in movesOverRounds)) {
            movesOverRounds[roundNumber] = {}
        }
        movesOverRounds[roundNumber][socketMetamask[String(socket.id)]] = movesForRound;
        if (Object.keys(movesOverRounds[roundNumber]).length == 2) {
            for (var user of users) {
                var usersMoves = movesOverRounds[roundNumber][user.name]

                if (usersMoves['playersCreated']) {
                    for (var position of usersMoves['playersCreated']) {
                        var x = position[0];
                        var y = position[1]
                        var newUserPlayer = new Player(user, x, y)
                        gameBoard.map[x][y].playerList.push(newUserPlayer)
                    }
                }

                if (usersMoves['playerMovements']) {
                    var movementArray = Object.keys(usersMoves['playerMovements'])
                    movementArray.sort()
                    for (var movementID of movementArray) {
                        var x = usersMoves['playerMovements'][movementID][0]
                        var y = usersMoves['playerMovements'][movementID][1]
                        for (var player of user.playerList) {
                            if (player.id == movementID) {
                                pastPos = player.move_to(x, y)
                                gameBoard.map[x][y].playerList.push(player)
                                var newPastPosList = []
                                for (var oldPlayer of gameBoard.map[pastPos[0]][pastPos[1]].playerList) {
                                    if (!(oldPlayer.id == player.id && oldPlayer.name == player.name)) {
                                        newPastPosList.push(oldPlayer)
                                    }
                                }
                                gameBoard.map[pastPos[0]][pastPos[1]].playerList = newPastPosList;
                            }
                        }
                    }
                }

                user.technology += usersMoves['techInvestment']['value']
                user.iron -= usersMoves['techInvestment']['value']
            }

            for (var y=0; y<10; ++y) {
                for (var x=0; x<10; ++x) {
                    gameBoard.map[y][x].processEvent(users[0], users[1])
                }
            }

            io.emit('refreshBoard', gameBoard, users, roundNumber);
            for (var x = 0; x<10; ++x) {
                for (var y=0; y<10; ++y) {
                    if (gameBoard.map[y][x].playerList.length > 0) {
                        console.log(gameBoard.map[y][x].playerList.length + " players found at " + x + " " + y);
                    }
                }
            }
            console.log("Result sent back for Round " + roundNumber);
            if (roundNumber == 5) {
                var winner;
                if (users[0].diamond > users[1].diamond) {
                    winner = String(users[0].name);
                }
                else if (users[0].diamond < users[1].diamond) {
                    winner = String(users[1].name);
                }
                else {
                    winner = "None";
                }
                sendMoney(winner);
                io.emit('gameOver', winner);
            }
            roundNumber += 1
        }
    })
})

server.listen(8000, ()=> console.log('listening on port 8000: http://localhost:'+8000));
