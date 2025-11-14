const User = require("../../models/user.model");

const usersSocket = require("../../sockets/client/users.socket")

module.exports.notFriend = async (req, res) => {

    //SOCKET
    usersSocket(res);
    //END SOCKET

    const userId = res.locals.user.id;

    const myUser = await User.findOne({
        _id: userId
    })

    const requestFriends = myUser.requestFriends;
    const acceptFriends = myUser.acceptFriends;

    const users = await User.find({
        $and: [
            // not equal: những user có id khác userId
            { _id: { $ne: userId } },
            { _id: { $nin: requestFriends } },
            { _id: { $nin: acceptFriends } },
        ],
        status: "active",
        deleted: false
    }).select("id avatar fullName");


    res.render("clients/pages/users/not-friend", {
        pageTitle: "Danh sach nguoi dung",
        users: users
    })
}