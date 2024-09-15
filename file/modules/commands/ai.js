this.config = {
    name: 'ai',
    version: '1.0.0',
    hasPermssion: 0,
    credits: 'DongDev',
    description: 'Chat GPT',
    commandCategory: 'AI',
    cooldowns: 5
};

this.run = async function ({ api, event, args }) {
    try {
        const { messageID, messageReply } = event;
        let t = args.join(' ');       
        if (messageReply && !t) {
            const r = messageReply.body;
            t = r;
        } else {
            if (!t) return api.sendMessage('❎ Vui lòng cung cấp một câu hỏi', event.threadID, messageID);
        }        
        const e = 'http://fi1.bot-hosting.net:6518/gpt?query=' + encodeURIComponent(t) + '&model=gpt-4-32k-0314';
        const n = await require('axios').get(e);
        
        if (n.data && n.data.response) {
            const r = n.data.response;
            const o = `${r}`;
   api.sendMessage(o, event.threadID, messageID);
        } else {
   console.error('API trả về không chứa dữ liệu mong đợi:', n.data);
            api.sendMessage('❎ Lỗi khi phản hồi: ' + JSON.stringify(n.data), event.threadID, messageID);
        }
    } catch (t) {
        console.error('Lỗi:', t);
        api.sendMessage('❎ Lỗi khi phản hồi: ' + t.message, event.threadID, messageID);
    }
};