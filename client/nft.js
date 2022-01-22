Moralis.initialize("i4ksO2vybBAOY0kIx85vyi1w9XqHUOBTzHYL9svK");
Moralis.serverURL = "https://5rezrcp5nmxf.usemoralis.com:2053/server";


var user;
user = Moralis.User.current();
if (!user) {
    user = await Moralis.Web3.authenticate();
}
const moneyHTML = document.getElementById("money")
const usernameHTML = document.getElementById("username")
usernameHTML.innerHTML = "User: " + user.get("ethAddress")
const navigateHTML = document.getElementById("navigate_game")
const logoutButton = document.getElementById("logout")
logoutButton.onclick = logout

async function upload() {

    const fileInput = document.getElementById("file");
    const data = fileInput.files[0];
    const imageFile = new Moralis.File(data.name, data);
    
    await imageFile.saveIPFS();
    
    const imageURI = imageFile.ipfs();
    console.log(imageURI)
    console.log("uploaded")
    transact(imageURI)

}


async function logout() {
    await Moralis.User.logOut();
    location.reload();
}


var button = document.getElementById("upload")
button.onclick = upload

async function transact(imageURI){
    await Moralis.enableWeb3() 
    const options = {type: "native", amount: Moralis.Units.ETH("0.1"), receiver: "0x0AAA0E1924f417cD290868B2187f6d3310C63Dc4"}
    console.log(options)
    let result
    try{
        result = await Moralis.transfer(options)
    }
    catch(err){
        console.log(err)
        alert("Transaction failed")
        return;
    }
    console.log(result)
    console.log(user)
    let avatarList = user.get("avatars")
    console.log(avatarList)
    avatarList.push({
        'name':document.getElementById("name").value,
        'iron_mining': parseInt(document.getElementById("Iron_Mining").value),
        'diamond_mining': parseInt(document.getElementById("Diamond_mining").value),
        'damage': parseInt(document.getElementById("damage").value),
        'iron_per_soldier': parseInt(document.getElementById("Iron_per_soldier").value),
        'price': 0,
        'owned': true,
        'imageuri': imageURI
    })
    user.set("avatars",avatarList)
    await user.save();
    alert("Avatar Minted")
    window.location.href = "index.html";
}