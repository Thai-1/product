const User = require("../../models/user.model")

const md5 = require("md5")

//[GET] /user/register
module.exports.register = async (req, res) => {
    res.render("clients/pages/user/register", {
        pageTitle: "Dang ky"
    })
}

//[POST] /user/register

module.exports.registerPost = async (req, res) => {
    const userInfo = req.body;
    const existEmail = await User.findOne({
        email: req.body.email
    })

    if (existEmail) {
        req.flash("error", "Email đã tồn tại");
        res.redirect("/user/register")
    }

    req.body.password = md5(req.body.password);

    const user = new User(req.body);

    await user.save();

    res.cookie("tokenUser", user.tokenUser);

    res.redirect("/");
}

//[GET] /user/login
module.exports.login = async (req, res) => {
    res.render("clients/pages/user/login", {
        pageTitle: "Dang nhap"
    })
}

//[POST] /user/loginPost
module.exports.loginPost = async (req, res) => {
    const email = req.body.email;
    const password = req.body.password;
    const user = await User.findOne({
        email: email,
        deleted: false
    })
    if (!user) {
        req.flash("error", "Email hoac password sai")
        res.redirect("/user/login");
        return;
    }
    if (md5(password) !== user.password) {
        req.flash("error", "Email hoac password sai")
        res.redirect("/user/login");
        return;
    }

    if (user.status == "inactive") {
        req.flash("error", "Tai khoan da bi khoa")
        res.redirect("/user/login");
        return;
    }
    res.cookie("tokenUser", user.tokenUser)
    res.redirect("/")

}

//[GET] /user/logout
module.exports.logout = async(req, res) => {
    res.clearCookie("tokenUser");
    res.redirect("/user/login");
}
