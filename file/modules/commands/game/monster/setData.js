var dataUser = require("./data/datauser.json");
var game = require('./getData');
var fs = require('fs-extra');
var axios = require('axios');

function createCharecter({ data }) {
    if (typeof data !== 'object') {
        throw new Error('data must be an object');
    }
    dataUser.push(data);
    fs.writeFileSync(__dirname + "/data/datauser.json", JSON.stringify(dataUser, null, 4))
    
    return data
}

function buyItem(playerID, item) {
    if (typeof playerID !== 'string') {
        throw new Error('playerID must be a string');
    }
    var user = game.getDataUser(playerID);
    if(!item || !user) return 404;
    if(user.bag.find(item => item.name == user.weapon)) return 403;
    user.bag.push(item);
    fs.writeFileSync(__dirname + "/data/datauser.json", JSON.stringify(dataUser, null, 4));
    
    return true;
}

function setItem(playerID, data) {
    if (typeof playerID !== 'string') {
        throw new Error('playerID must be a string');
    }
    var user = game.getDataUser(playerID);
    if(!user) return 404;
    switch(data.type) {
        case "weapon":
            user.weapon = null;
            user.weapon = data;
            user.bag.splice(user.bag.findIndex(item => item.name == data.name), 1);
            fs.writeFileSync(__dirname + "/data/datauser.json", JSON.stringify(dataUser, null, 4));
            
            break;
        case "buff":
            user.buffs = null;
            user.buffs = data;
            user.bag.splice(user.bag.findIndex(item => item.name == data.name), 1);
            fs.writeFileSync(__dirname + "/data/datauser.json", JSON.stringify(dataUser, null, 4));                
            break;
        case "food":
            user.the_luc += data.heal;
            user.hp += data.boostHP;
            user.atk += data.boostATK;
            user.def += data.boostDEF;
            user.spd += data.boostSPD;
            user.exp += data.boostEXP;
            user.karma += data.boostKarma;
            user.points += data.boostPoints;
            user.bag.splice(user.bag.findIndex(item => item.name == data.name), 1);
            fs.writeFileSync(__dirname + "/data/datauser.json", JSON.stringify(dataUser, null, 4));
            
            break;
        case "upgrade":
            user.weapon.HP += data.boostHPweapon;
            user.weapon.ATK += data.boostATKweapon;
            user.weapon.DEF += data.boostDEFweapon;
            user.weapon.SPD += data.boostSPDweapon;
            user.weapon.usage += data.usage;
            user.bag.splice(user.bag.findIndex(item => item.name == data.name), 1);
            fs.writeFileSync(__dirname + "/data/datauser.json", JSON.stringify(dataUser, null, 4));
                
            break;
        default:
            return 403;
    }
    return true;
}

function decreaseDurability(playerID) {
    if (typeof playerID !== 'string') {
        throw new Error('playerID must be a string');
    }
    var user = game.getDataUser(playerID);
    if(!user) return 404;
    if(user.weapon == null) return 403;
    user.weapon.durability -= 10;
    if(user.weapon.durability <= 0) {
        user.weapon.durability = 0;
    }
    fs.writeFileSync(__dirname + "/data/datauser.json", JSON.stringify(dataUser, null, 4));
    
    return user.weapon.durability;
}

function decreasePoints(playerID, points) {
    if (typeof playerID !== 'string') {
        throw new Error('playerID must be a string');
    }
    var user = game.getDataUser(playerID);
    if(!user) return 404;
    if(user.points == 0) return 403;
    user.points -= Number(points);
    if(user.points <= 0) {
        user.points = 0;
    }
    fs.writeFileSync(__dirname + "/data/datauser.json", JSON.stringify(dataUser, null, 4));
    
    return user.points;
}

function increaseHP(playerID, hp) {
    if (typeof playerID !== 'string') {
        throw new Error('playerID must be a string');
    }
    var user = game.getDataUser(playerID);
    if(!user) return 404;
    if(user.hp == 0) return 403;
    user.hp += Number(hp);

    fs.writeFileSync(__dirname + "/data/datauser.json", JSON.stringify(dataUser, null, 4));
    
    return user.hp;
}

function increaseDEF(playerID, def) {
    if (typeof playerID !== 'string') {
        throw new Error('playerID must be a string');
    }
    var user = game.getDataUser(playerID);
    if(!user) return 404;
    if(user.def == 0) return 403;
    user.def += Number(def);

    fs.writeFileSync(__dirname + "/data/datauser.json", JSON.stringify(dataUser, null, 4));
    
    return user.def;
}

function increaseATK(playerID, atk) {
    if (typeof playerID !== 'string') {
        throw new Error('playerID must be a string');
    }
    var user = game.getDataUser(playerID);
    if(!user) return 404;
    if(user.atk == 0) return 403;
    user.atk += Number(atk);

    fs.writeFileSync(__dirname + "/data/datauser.json", JSON.stringify(dataUser, null, 4));
    
    return user.atk;
}

function increaseSPD(playerID, spd) {
    if (typeof playerID !== 'string') {
        throw new Error('playerID must be a string');
    }
    var user = game.getDataUser(playerID);
    if(!user) return 404;
    if(user.spd == 0) return 403;
    user.spd += Number(spd);

    fs.writeFileSync(__dirname + "/data/datauser.json", JSON.stringify(dataUser, null, 4));
    
    return user.spd;
}

function increaseDurability(playerID, durability) {
    if (typeof playerID !== 'string') {
        throw new Error('playerID must be a string');
    }
    var user = game.getDataUser(playerID);
    if(!user) return 404;
    if(user.weapon == null) return 403;
    user.weapon.durability += Number(durability);
    if(user.weapon.durability > 10000) {
        user.weapon.durability = 10000;
    }
    fs.writeFileSync(__dirname + "/data/datauser.json", JSON.stringify(dataUser, null, 4));
    
    return user.weapon.durability;
}

function setLocation(playerID, locationID) {
    if (typeof playerID !== 'string') {
        throw new Error('playerID must be a string');
    }
    if (typeof locationID !== 'string') {
        throw new Error('locationID must be a string');
    }
    var user = game.getDataUser(playerID);
    if(!user) return 404;
    user.locationID = locationID;
    fs.writeFileSync(__dirname + "/data/datauser.json", JSON.stringify(dataUser, null, 4));
    
    return true;
}

async function setExp(playerID, exp, api, threadID) {
    if (typeof playerID !== 'string') {
        throw new Error('playerID must be a string');
    }
    if (typeof exp !== 'number') {
        throw new Error('exp must be a number');
    }
    var user = game.getDataUser(playerID);
    if(!user) return 404;
    user.exp += exp;
    var expNeeded = 500 * Math.pow(1.2, user.level - 1)
    if(user.exp <= 0) {
        user.the_luc = 0;
    }
    if(user.exp >= expNeeded) {
        user.level += Math.floor((user.exp / expNeeded) + 1 - (user.exp / expNeeded));
        user.exp = user.exp % expNeeded;
        user.atk += 2 * user.level;
        user.def += 2 * user.level;
        user.hp += 5 * user.level;
        user.spd += 1 * user.level;
        user.points += 500 * user.level;
        var stream = await axios(global.configMonster.levelUp, { responseType: 'stream' });
        api.sendMessage({body: `Chúc mừng ${user.name} đã lên level ${user.level}`, attachment: stream.data}, threadID);
    }
    fs.writeFileSync(__dirname + "/data/datauser.json", JSON.stringify(dataUser, null, 4));
    
    return true;
}

function addMonster(playerID, monster) {
    var user = game.getDataUser(playerID);
    if(!user) return 404;
    user.monster.push(monster);
    fs.writeFileSync(__dirname + "/data/datauser.json", JSON.stringify(dataUser, null, 4));
    
    return true;
}

function addHistory(playerID, history) {
    var user = game.getDataUser(playerID);
    if(!user) return 404;
    user.history.push(history);
    fs.writeFileSync(__dirname + "/data/datauser.json", JSON.stringify(dataUser, null, 4));
    
    return true;
}

function decreaseHealthWeapon(playerID, amount) {
    var user = game.getDataUser(playerID);
    if(!user) return 404;
    if(user.weapon == null) return 403;
    if(amount < 0) amount = user.hp;
    user.weapon.HP = amount - user.hp;
    user.the_luc -= 50;
    if(user.the_luc <= 0) {
        user.the_luc = 0;
    }
   if(user.weapon.HP < 0) {
        user.weapon.HP = 0;
    }
    if(user.weapon.HP <= 0) {
        user.weapon = null;
    }
    fs.writeFileSync(__dirname + "/data/datauser.json", JSON.stringify(dataUser, null, 4));
    
    return true;
}

function karmaUp(playerID) {
    if (typeof playerID !== 'string') {
        throw new Error('playerID must be a string');
    }
    var user = game.getDataUser(playerID);
    if(!user) return 404;
    user.karma += 1;
    if(user.karma < 0) {
        user.karma = 0;
    }
    
    fs.writeFileSync(__dirname + "/data/datauser.json", JSON.stringify(dataUser, null, 4));
    
    return user.karma;
}

module.exports = {
    createCharecter,
    buyItem,
    setItem,
    decreaseDurability,
    increaseDurability,
    setLocation,
    setExp,
    addMonster,
    decreaseHealthWeapon,
    increaseHP,
    increaseDEF,
    increaseATK,
    increaseSPD,
    decreasePoints,
    addHistory,
    karmaUp
};