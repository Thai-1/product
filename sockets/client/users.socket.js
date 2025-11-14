const User = require("../../models/user.model")

module.exports = (res) => {
    _io.once("connection", (socket) => {
        //Chức năng gửi yêu cầu
        socket.on("CLIENT_ADD_FRIEND", async (userId) => {
            const myUserId = res.locals.user.id; // Id cua A
            // console.log(userId); // Id của B
            // console.log(myUserId);

            //Thêm id của A vào acceptFriends của B 
            const exisId_A_in_B = await User.findOne({
                _id: userId,
                acceptFriends: myUserId
            })
            if (!exisId_A_in_B) {
                await User.updateOne({
                    _id: userId
                }, {
                    $push: { acceptFriends: myUserId }
                })
            }
            //Thêm id của B vào acceptFriends của A
            const exisId_B_in_A = await User.findOne({
                _id: myUserId,
                requestFriends: userId
            })
            if (!exisId_A_in_B) {
                await User.updateOne({
                    _id: myUserId
                }, {
                    $push: { requestFriends: userId }
                })
            }
        })

        //Chức năng hủy gửi yêu cầu
        socket.on("CLIENT_CANCEL_FRIEND", async (userId) => {
            const myUserId = res.locals.user.id; // Id cua A
            // console.log(userId); // Id của B
            // console.log(myUserId);

            //Xóa id của A vào acceptFriends của B 
            const exisId_A_in_B = await User.findOne({
                _id: userId,
                acceptFriends: myUserId
            })
            if (exisId_A_in_B) {
                await User.updateOne({
                    _id: userId
                }, {
                    $pull: { acceptFriends: myUserId }
                })
            }
            //Xóa id của B vào acceptFriends của A
            const exisId_B_in_A = await User.findOne({
                _id: myUserId,
                requestFriends: userId
            })
            if (exisId_A_in_B) {
                await User.updateOne({
                    _id: myUserId
                }, {
                    $pull: { requestFriends: userId }
                })
            }
        })

        // Chức năng từ chối kết bạn 
        socket.on("CLIENT_REFUSE_FRIEND", async (userId) => {
            const myUserId = res.locals.user.id; // Id cua A
            // console.log(userId); // Id của B
            // console.log(myUserId);

            //Xóa id của A vào acceptFriends của B 
            const exisId_A_in_B = await User.findOne({
                _id: myUserId,
                acceptFriends: userId
            })
            if (exisId_A_in_B) {
                await User.updateOne({
                    _id: myUserId
                }, {
                    $pull: { acceptFriends: userId }
                })
            }
            //Xóa id của B vào acceptFriends của A
            const exisId_B_in_A = await User.findOne({
                _id: userId,
                requestFriends: myUserId
            })
            if (exisId_A_in_B) {
                await User.updateOne({
                    _id: userId
                }, {
                    $pull: { requestFriends: myUserId }
                });
            }
        });
    });
}