const ProductCategory = require("../../models/product-category.model")

const systemConfig = require("../../config/system")
const { ConnectionStates } = require("mongoose")

//[GET] / admin/products-category
module.exports.index = async (req, res) => {

    let find = {
        deleted: false
    };

    const records = await ProductCategory.find(find);

    res.render("admin/pages/products-category/index", {
        pageTitle: "Danh muc san pham",
        records: records
    })
}

//[GET] / admin/products-category/create
module.exports.create = async (req, res) => {

    res.render("admin/pages/products-category/create", {
        pageTitle: "Tao danh muc san pham",
    })
}

//[POST] / admin/products-category/create
module.exports.createPost = async (req, res) => {

    let find = {
        deleted: false,
    };
    console.log(req.body);
    if (req.body.position == "") {
        const countProducts = await ProductCategory.countDocuments();
        req.body.position = countProducts + 1;
    }
    else {
        req.body.position = parseInt(req.body.position);
    }

    const record = new ProductCategory(req.body);
    await record.save();

    res.redirect(`${systemConfig.prefixAdmin}/products-category`)
}

