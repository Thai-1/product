const systemConfig = require("../../config/system")
const md5 = require("md5")
const Account = require("../../models/account.model")


// [GET] /admin/my-account/

module.exports.index = async(req, res) => {
    res.render("admin/pages/my-account/index",{
        pageTitle: "Thong tin ca nhan"
    })
}

// [GET] /admin/my-account/edit

module.exports.edit = async(req, res) => {
    res.render("admin/pages/my-account/edit", {
        pageTitle: "Chỉnh sửa thông tin cá nhân"
    })
}

// [Patch] /admin/my-account/edit

module.exports.editPatch = async(req, res) => {
    const id = res.locals.user.id;
    const emailExist = await Account.findOne({
        _id: {$ne: id},
        email: req.body.email,
        deleted: false
    });
    if (emailExist) {
        req.flash("error", `Email ${req.body.email} da ton tai`);
        res.redirect(`${systemConfig.prefixAdmin}/accounts/create`)
    }
    else {

        if (req.body.password) {
            req.body.password = md5(req.body.password);
        }
        else {
            delete req.body.password;
        }
        await Account.updateOne({ _id: id }, req.body);
        req.flash("success", "Cap nhat thanh cong")
    }
    res.redirect(`${systemConfig.prefixAdmin}/accounts/edit/${id}`);

}
