Moralis.initialize("1pEceBLaCdAkvuVU95UJyjxe4zSaM86efw7vNiFI");
Moralis.serverURL = "https://uziynvgk9swe.usemoralis.com:2053/server";

const user = await Moralis.Web3.authenticate();

const socket = io("127.0.0.1:8000");
const moneyHTML = document.getElementById("money")
const usernameHTML = document.getElementById("username")
const navigateHTML = document.getElementById("navigate_game")

var chosen = "chanakya"

socket.emit("landingPage", String(user.get("ethAddress")))

usernameHTML.innerHTML = "User: " + String(user.get("ethAddress"))

socket.on('moneyAvailable', money => {
    console.log(money);
    moneyHTML.innerHTML = "Tokens: " + money;
})

function redirect() {
    window.location.href = "game.html?play=" + chosen;
}

navigateHTML.onclick = redirect

const UserData = Moralis.Object.extend("UserData");
const query = new Moralis.Query(UserData);
query.equalTo("username", user.get("ethAddress"));
const results = await query.find();
for (let i = 0; i < results.length; i++) {
    const object = results[i];
    alert(object.id + ' - ' + object.get('ownerName'));
}

// https://docs.moralis.io/moralis-server/database/objects