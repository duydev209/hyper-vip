this.config = {
  name: "leave",
  eventType: ["log:unsubscribe"],
  version: "1.0.1",
  credits: "Quất",
  description: "Thông báo các kiểu"
};

this.run = ({ api: { getCurrentUserID: idbot, shareContact: share, sendMessage: send }, event: { logMessageType: type, logMessageBody: body, logMessageData: { addedParticipants: id, leftParticipantFbId: ido }, author, threadID } }) => {
  let [jl, fb, mm] = [this.config.eventType, o => `Fb.com/${o}`, require("moment-timezone").tz("Asia/Ho_Chi_Minh")];
  let h = mm.format("HH");
  let time = `${body}\n➩ Lúc ${(h <= 10 ? "sáng" : h > 10 && h <= 12 ? "trưa" : h > 12 && h <= 18 ? "chiều" : "tối")} ngày ${mm.format("DD/MM/YYYY || HH:mm:ss")}`;

  if (type == jl[0] && ido != idbot()) {
    const reason = ido == author ? "tự động rời nhóm" : "bị quản trị viên kick";
    share(`[ Thành Viên Thoát Nhóm ]\n─────────────────\n👤 Thành viên: ${fb(ido)}\n📝 Profile: ${fb(author)}\n📌 Lý do: ${time}`, ido, threadID);
  }

  // Xóa dữ liệu trong font check tương tác
  if (ido != idbot()) {
    const checkttPath = __dirname + '/../commands/checktt/';
    const { existsSync, readFileSync, writeFileSync } = require('fs-extra');

    if (existsSync(checkttPath + threadID + '.json')) {
      const threadData = JSON.parse(readFileSync(checkttPath + threadID + '.json'));
      const userDataIndex = threadData.week.findIndex(e => e.id == ido);
      if (userDataIndex != -1) {
        threadData.week.splice(userDataIndex, 1);
        writeFileSync(checkttPath + threadID + '.json', JSON.stringify(threadData, null, 4));
      }
    }
  }
};