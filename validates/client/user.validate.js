module.exports.registerPost = (req, res, next) => {
    if (!req.body.fullName) {
        req.flash("error", "Vui long nhap ho ten!");
        res.redirect("user/register");
        return;
    }

    if (!req.body.email) {
        req.flash("error", "Vui long nhap email!");
        res.redirect("user/register");

        return;
    }

    if (!req.body.password) {
        req.flash("error", "Vui long nhap mat khau!");
        res.redirect("user/register");
        return;
    }

    next();
}

module.exports.forgotPasswordPost = (req, res, next) => {
    if (!req.body.email) {
        req.flash("error", "Vui long nhap email!");
        res.redirect("user/register");

        return;
    }
    
    next();
}