const Chat = require("../../models/chat.model")

const uploadToCloudinary = require("../../helper/uploadToCloudinary")

module.exports = (req, res) => {
    const userId = res.locals.user.id;
    const fullName = res.locals.user.fullName;
    const roomChatId = req.params.roomChatId;

    _io.once('connection', (socket) => {
        socket.join(roomChatId);
        socket.on("CLIENT_SEND_MESSAGE", async (data) => {
            let images = [];

            // for (const imageBuffer of data.images) {
            //     const link = await uploadToCloudinary(imageBuffer);
            //     images.push(link);
            // }

            //Luu vao DB
            const chat = new Chat({
                user_id: userId,
                content: data.content,
                images: images,
                room_chat_id: data.roomChatId
            })
            await chat.save();

            // Trả data về client
            _io.to(roomChatId).emit("SERVER_RETURN_MESSAGE", {
                fullName: fullName,
                userId: userId,
                content: data.content,
                images: images
            })
        })
        // Typing
        socket.on("CLIENT_SEND_TYPING", async (type) => {
            socket.broadcast.emit("SERVER_RETURN_TYPING", {
                fullName: fullName,
                userId: userId,
                type: type
            })
        })
        // End Typing
    })
}