const Chat = require("../../models/chat.model")
const User = require("../../models/user.model")
const chatSocket = require("../../sockets/client/chat.socket")

// [GET] /chat/:roomChat
module.exports.index = async (req, res) => {
    const roomChatId = req.params.roomChatId;

    const userId = res.locals.user.id;
    const fullName = res.locals.user.fullName;

    // Socket IO
    chatSocket(req, res);
    // _io.once('connection', (socket) => {
    //     socket.on("CLIENT_SEND_MESSAGE", async (content) => {
    //         //Luu vao DB
    //         const chat = new Chat({
    //             user_id: userId,
    //             content: content
    //         })
    //         await chat.save();

    //         // Trả data về client
    //         _io.emit("SERVER_RETURN_MESSAGE", {
    //             fullName: fullName,
    //             userId: userId,
    //             content: content
    //         })
    //     })
    //     // Typing
    //     socket.on("CLIENT_SEND_TYPING", async (type) => {
    //         socket.broadcast.emit("SERVER_RETURN_TYPING", {
    //             fullName: fullName,
    //             userId: userId,
    //             type: type
    //         })
    //     })
    //     // End Typing
    // })
    // End Socket IO

    // Lấy data từ DB
    const chats = await Chat.find({
        room_chat_id: roomChatId,
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
        chats: chats,
        roomChatId: roomChatId
    })
}