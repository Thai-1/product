const User = require("../../models/user.model");

module.exports.connect = async (req, res, next) => {
    _io.once('connection', (socket) => {
        socket.once("disconnect", () => {
            console.log("user disconect");
        })
    })
    next();
};