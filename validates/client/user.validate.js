module.exports.registerPost = (req, res, next) => {
    if (!req.body.fullName) {
        req.flash("error", "Vui long nhap ho ten!");
        res.redirect("/user/register");
        return;
    }

    if (!req.body.email) {
        req.flash("error", "Vui long nhap email!");
        res.redirect("/user/register");

        return;
    }

    if (!req.body.password) {
        req.flash("error", "Vui long nhap mat khau!");
        res.redirect("/user/register");
        return;
    }

    next();
}

module.exports.forgotPasswordPost = (req, res, next) => {
    if (!req.body.email) {
        req.flash("error", "Vui long nhap email!");
        res.redirect("/user/register");

        return;
    }

    next();
}

module.exports.resetPasswordPost = (req, res, next) => {
    if (!req.body.password) {
        req.flash("error", "Vui long nhap mat khau!");
        res.redirect("/user/password/reset");

        return;
    }

    if (!req.body.confirmPassword) {
        req.flash("error", "Vui long xac nhan mat khau!");
        res.redirect("/user/password/reset");
        return;
    }

    if (req.body.password != req.body.confirmPassword) {
        req.flash("error", "Xac nhan mk sai!");
        res.redirect("/user/password/reset");
        return;
    }


    next();
}