const User = require("../../models/user.model");

module.exports.notFriend = async(req, res) => {

    const userId = res.locals.user.id;


    const users = await User.find({
        _id: {$ne: userId}, // not equal: những user có id khác userId
        status: "active",
        deleted: false
    }).select("id avatar fullName");

    console.log(users);

    res.render("clients/pages/users/not-friend", {
        pageTitle: "Danh sach nguoi dung",
        users: users
    })
}