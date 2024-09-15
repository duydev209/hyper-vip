const axios = require('axios');
const moment = require("moment-timezone");

module.exports.config = {
    name: "taixiu",
    version: "0.0.1",
    hasPermssion: 0,
    credits: "WhoisHakira mod by Shadow dz Nguyễn Thanh Mài",
    description: "Chơi tài xỉu",
    commandCategory: "Trò Chơi",
    usages: "taixiu [tài/xỉu] [số tiền]",
    cooldowns: 0
};

const tilethang = 3;
const timedelay = 2;

function replace(int) {
    return int.toString().replace(/(.)(?=(\d{3})+$)/g, '$1,');
}

function getRandomKho() {
    return Math.floor(Math.random() * 2) + 1;
}

async function getImage(number, kho) {
    const images = {
        1: ["https://i.imgur.com/H8w634y.jpg", "https://i.imgur.com/511OOjT.jpeg"],
        2: ["https://i.imgur.com/vc9r4q4.jpg", "https://imgur.com/wSqLUl6.jpeg"],
        3: ["https://i.imgur.com/SmOzlNt.jpg", "https://imgur.com/E7mLNo9.jpeg"],
        4: ["https://i.imgur.com/680wTWp.jpg", "https://imgur.com/a4zsWnG.jpeg"],
        5: ["https://i.imgur.com/X3KzAc4.jpg", "https://imgur.com/Tni5oNK.jpeg"],
        6: ["https://i.imgur.com/KAOjcW0.jpg", "https://imgur.com/9gYsZdZ.jpeg"]
    };

    return (await axios.get(encodeURI(images[number][kho - 1]), { responseType: 'stream' })).data;
}

module.exports.run = async function ({ event, api, Currencies, Users, args }) {
    try {
        const { increaseMoney, decreaseMoney } = Currencies;
        const { threadID, messageID, senderID } = event;
        const { sendMessage: send, unsendMessage } = api;
        const name = await Users.getNameUser(senderID);
        const money = (await Currencies.getData(senderID)).money;
        const bet = (args[1] === "all" || args[1] === "allin") ? money : parseInt(args[1]);
        const input = args[0];

        if (!input || !['tài', 'Tài', '-t', 'xỉu', 'Xỉu', '-x'].includes(input)) return send("sai lệnh . bạn hãy chọn tài hoặc xỉu", threadID, messageID);
        if (!bet || isNaN(bet) || bet < 1000) return send("Co Dau Buoi", threadID, messageID);
        if (bet > money) return HakiraSEND("Bạn không đủ tiền để đặt cược", threadID, messageID);

        const kho = getRandomKho();
        const number = Array.from({ length: 3 }, () => Math.floor(Math.random() * 6 + 1));
        const total = number.reduce((acc, cur) => acc + cur, 0);
        const choose = (input === 'tài' || input === 'Tài' || input === '-t') ? 'tài' : 'xỉu';
        const ans = (total >= 11 && total <= 18) ? "tài" : "xỉu";
        const result = (ans === choose) ? 'win' : 'lose';
        const mn = (result === 'win') ? bet * tilethang : bet;
        const mne = (result === 'win') ? mn + money : money - mn;

        if (result === 'lose') decreaseMoney(senderID, mn);
        else if (result === 'win') increaseMoney(senderID, mn);

        api.sendMessage({ body: "Đang lắc..." }, event.threadID, async (error, info) => {
            await new Promise(resolve => setTimeout(resolve, 5 * 1));
            unsendMessage(info.messageID);
            await new Promise(resolve => setTimeout(resolve, 1));

            const img = await Promise.all(number.map(n => getImage(n, kho)));

            const msg = `===== TÀI XỈU =====\n[ x ] - Người Chơi: ${name} Đã Lựa Chọn: ${choose}\n[ x ] - Tổng ba xúc xắc: ${total}\n[ x ] - Kết Quả: ${ans}\n[ x ] - Bạn cược ${choose} với số tiền ${replace(bet)} và ${(result === 'win' ? 'Thắng' : 'Thua')}: ${replace(Math.floor(mn))}$\n[ x ] - Số Tiền Hiện Tại: ${replace(mne)}$\n===== TÀI XỈU =====`;

            send({ body: msg, attachment: img }, threadID, messageID);

            if (bdsd === true) {
                const format_day = moment.tz("Asia/Ho_Chi_Minh").format("DD-MM-YYYY");
                const msg = `MiraiPay, Ngày ${format_day}\n${(result === 'win') ? 'nhận tiền' : 'trừ tiền'} dịch vụ game tài xỉu\nsố tiền ${replace(mn)}\nSố dư khả dụng: ${replace(mne)}$\nCảm ơn đã tin dùng dịch vụ của MiraiPay`;

                send({ body: msg }, senderID);
            }
        });
    } catch (e) {
        console.error(e);
    }
}