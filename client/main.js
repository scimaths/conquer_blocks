Moralis.initialize("i4ksO2vybBAOY0kIx85vyi1w9XqHUOBTzHYL9svK");
Moralis.serverURL = "https://5rezrcp5nmxf.usemoralis.com:2053/server";

var user;
user = Moralis.User.current();
var userMoney = 0;
if (!user) {
    user = await Moralis.Web3.authenticate();
}
console.log(user.get("ethAddress"));

async function logout() {
    await Moralis.User.logOut();
    location.reload();
}

const socket = io("127.0.0.1:8000");
const moneyHTML = document.getElementById("money")
const usernameHTML = document.getElementById("username")
const navigateHTML = document.getElementById("navigate_game")
const logoutButton = document.getElementById("logout")
logoutButton.onclick = logout

const navigateNFT = document.getElementById("navigate_nft")


function redirect_to_NFT() {
    window.location.href = "nft.html";
}

navigateNFT.onclick = redirect_to_NFT

var chosen = "chanakya"

socket.emit("landingPage", String(user.get("ethAddress")))

usernameHTML.innerHTML = "User: " + String(user.get("ethAddress"))

socket.on('moneyAvailable', money => {
    userMoney = money;
    console.log(money);
    moneyHTML.innerHTML = "Tokens: " + money;
})

function redirect() {
    window.location.href = "game.html?play=" + document.getElementById('navigate_game').innerHTML.split(" ").at(-1).toLowerCase();
}

navigateHTML.onclick = redirect


console.log(user)
console.log(user.get("avatars"))
let avatar_list = [
    {   'name':'chanakya',
        'iron_mining': 400,
        'diamond_mining': 40,
        'damage': 10,
        'iron_per_soldier': 1000,
        'price': 0,
        'owned': true,
    },
    {   'name':'ashoka',
        'iron_mining': 400,
        'diamond_mining': 40,
        'damage': 10,
        'iron_per_soldier': 1000,
        'price': 40,
        'owned': false,
    },
    {   'name':'akbar',
        'iron_mining': 400,
        'diamond_mining': 40,
        'damage': 10,
        'iron_per_soldier': 1000,
        'price': 100,
        'owned': false,
    },
    {   'name':'rana_pratap',
        'iron_mining': 400,
        'diamond_mining': 40,
        'damage': 10,
        'iron_per_soldier': 1000,
        'price': 200,
        'owned': false,
    },
    {   'name':'laxmibai',
        'iron_mining': 400,
        'diamond_mining': 40,
        'damage': 10,
        'iron_per_soldier': 1000,
        'price': 500,
        'owned': false,
    },
];

/*

UserData table

Row
User (ethAddress) - Avatars [{name, iron_mining, diamond_mining, damage, iron_soldier, price, owned}]

*/

if(!user.get("avatars")){
    user.set("avatars", avatar_list)
    await user.save();
}

function component(name, iron_mining, diamond_mining, damage, iron_soldier, bought, price) {
    var value = "";
    if (bought) {
        value = "Choose"
    }
    else {
        value = `Pay ${price} tokens`
    }
    return `<div class="col-md-3 col-lg-3 col-sm-12">
                <div class="card bg-secondary" id="${name}_card">
                    <div class="card-img">
                        <img width="300" height="300" src="assets/${name}.png" class="img-fluid">
                    </div>
                    <div class="card-body">
                        <h4 class="card-title text-center">${name.at(0).toUpperCase() + name.slice(1)}</h4>
                        <center>
                            <p class="card-text">
                                Iron Mining Rate: ${iron_mining} <br>
                                Diamond Mining Rate: ${diamond_mining} <br>
                                Damage dealt: ${damage} <br>
                                Iron for soldier: ${iron_soldier} <br>
                            </p>
                    </center>
                </div>
                <div class="card-footer">
                    <center><button id="${name}_button" class="btn btn-primary" onclick="buyCharacter(${price}, ${bought}, '${name}')">${value}</button></center>
                </div>
            </div>`
}


function create_avatar_dict(){
    var owned_tags= document.getElementById("001");
    var store_tags = document.getElementById("002")
    var userAvatars = user.get("avatars")

    for (let avatarIndex in userAvatars) {
        let avatar = userAvatars[avatarIndex]
        if(avatar['owned']){
            owned_tags.innerHTML =  owned_tags.innerHTML + component(avatar['name'], avatar['iron_mining'], avatar['diamond_mining'], avatar['damage'], avatar['iron_per_soldier'], avatar['owned'], avatar['price'])
            // let button = document.getElementById(`${avatar['name']}_button`)
        }
        else{
            store_tags.innerHTML =  store_tags.innerHTML + component(avatar['name'], avatar['iron_mining'], avatar['diamond_mining'], avatar['damage'], avatar['iron_per_soldier'], avatar['owned'], avatar['price'])
        }
    };
    document.getElementById("chanakya_card").className = "card bg-success"
}

create_avatar_dict()

// https://docs.moralis.io/moralis-server/database/objects