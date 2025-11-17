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
    const friendList = myUser.friendList;
    const friendListId = friendList.map(item => item.user_id)

    const users = await User.find({
        $and: [
            // not equal: những user có id khác userId
            { _id: { $ne: userId } },
            { _id: { $nin: requestFriends } },
            { _id: { $nin: acceptFriends } },
            { _id: { $nin: friendListId } },

        ],
        status: "active",
        deleted: false
    }).select("id avatar fullName");


    res.render("clients/pages/users/not-friend", {
        pageTitle: "Danh sach nguoi dung",
        users: users
    })
}

module.exports.requestFriend = async (req, res) => {
    //SOCKET
    usersSocket(res);
    //END SOCKET

    const userId = res.locals.user.id;

    const myUser = await User.findOne({
        _id: userId
    })

    const requestFriends = myUser.requestFriends;

    const users = await User.find({
        _id: { $in: requestFriends },
        status: "active",
        deleted: false
    }).select("id avatar fullName");
    res.render("clients/pages/users/request", {
        pageTitle: "Loi moi da gui",
        users: users,
    })
}

module.exports.acceptFriend = async (req, res) => {
    //SOCKET
    usersSocket(res);
    //END SOCKET

    const userId = res.locals.user.id;

    const myUser = await User.findOne({
        _id: userId
    })

    const acceptFriends = myUser.acceptFriends;

    const users = await User.find({
        _id: { $in: acceptFriends },
        status: "active",
        deleted: false
    }).select("id avatar fullName");

    res.render("clients/pages/users/accept", {
        pageTitle: "Chap nhan ket ban",
        users: users,
    })
}

module.exports.friends = async (req, res) => {

    //SOCKET
    usersSocket(res);
    //END SOCKET

    const userId = res.locals.user.id;

    const myUser = await User.findOne({
        _id: userId
    })

    const friendList = myUser.friendList;
    const friendListId = friendList.map(item => item.user_id);

    const users = await User.find({
        _id: { $in: friendListId },
        status: "active",
        deleted: false
    }).select("id avatar fullName statusOnline");

    for(const user of users) {
        const infoFriend = friendList.find(friend => friend.user_id == user.id);
        user.infoFriend = infoFriend;
    }

    res.render("clients/pages/users/friends", {
        pageTitle: "Danh sach ban be",
        users: users
    })
}