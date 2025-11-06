const User = require("../../models/user.model")

const ForgotPassword = require("../../models/forgot-passowrd.model")

const md5 = require("md5")

const generateHelper = require("../../helper/generate")

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

//[GET] /user/passowrd/forgot
module.exports.forgotPassword = async(req, res) => {
    res.render("clients/pages/user/forgot-password", {
        pageTitle: "Lay lai mat khau"
    })
}

//[POST] /user/passowrd/forgot
module.exports.forgotPasswordPost = async(req, res) => {
    const email = req.body.email;

    const user = await User.find({
        email: email,
        deleted: false
    })
    
    if(!user) {
        req.flash("error", "Email khong ton tai");
        res.redirect("/user/password/forgot")
        return
    }

    //Lưu thông tin vào DB

    const otp = generateHelper.generateRandomNumber(8);

    const objectForgotPassword = {
        email: email,
        otp: otp,
        expireAt: Date.now()
    }

    const forgotPassword = new ForgotPassword(objectForgotPassword);
    await forgotPassword.save();

    // Nếu tồn tại email thì gửi mã OTP qua email

    res.send("OK");
}

