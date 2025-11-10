const Chat = require("../../models/chat.model")
const User = require("../../models/user.model")

const chatSocket = require("../../sockets/client/chat.socket")

// [GET] /chat/
module.exports.index = async (req, res) => {
    
    // Socket IO
    chatSocket(res);
    // End Socket IO


    // Lấy data từ DB
    const chats = await Chat.find({
        deleted: false
    })
    for (const chat of chats) {
        const infoUser = await User.findOne({
            _id: chat.user_id
        }).select("fullName")

        chat.infoUser = infoUser;
    }
    //  Hết lấy data từ DB

    res.render("clients/pages/chat/index", {
        pageTitle: "Chat",
        chats: chats
    })
}