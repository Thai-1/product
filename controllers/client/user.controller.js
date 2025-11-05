const User = require("../../models/user.model")

const md5 = require("md5")

//[GET] /user/register
module.exports.register = async(req, res) => {
    res.render("clients/pages/user/register",{
        pageTitle: "Dang ky"
    })
}

//[POST] /user/register

module.exports.registerPost = async(req, res) => {
    const userInfo = req.body;
    const existEmail = await User.findOne({
        email: req.body.email
    })

    if(existEmail) {
        req.flash("error", "Email đã tồn tại");
        res.redirect("user/register")
    }

    req.body.password = md5(req.body.password);

    const user = new User(req.body);

    await user.save();

    res.cookie("tokenUser", user.tokenUser);

    res.redirect("/");
}
