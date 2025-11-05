const User = require("../../models/user.model")

module.exports.inforUser = async(req, res, next) => {
    tokenUser = req.cookies.tokenUser
    if(tokenUser){
        const user = await User.findOne({
            tokenUser: tokenUser,
            deleted: false,
            status: "active"
        }).select("-password");

        if(user) {
            res.locals.user = user;
        }
    }

    next();
}