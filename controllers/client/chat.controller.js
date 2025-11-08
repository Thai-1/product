module.exports.index = async (req, res) => {
    //Socket IO
    _io.on('connection', (socket) => {
        console.log('a user connected', socket.id);
    })
    // End Socket IO

    res.render("clients/pages/chat/index", {
        pageTitle: "Chat"
    })
}