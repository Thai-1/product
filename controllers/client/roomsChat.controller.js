module.exports.index = async(req, res) => {
    res.render("clients/pages/rooms-chat/index", {
        pageTitle: "RoomsChat"
    }) 
}