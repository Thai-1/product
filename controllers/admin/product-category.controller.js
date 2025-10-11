const ProductCategory = require("../../models/product-category.model")

const systemConfig = require("../../config/system");
const { ConnectionStates } = require("mongoose");

const createTreeHelper = require("../../helper/createTree")

//[GET] / admin/products-category
module.exports.index = async (req, res) => {

    let find = {
        deleted: false
    };

    const records = await ProductCategory.find(find);

    const newRecords = createTreeHelper.tree(records)

    res.render("admin/pages/products-category/index", {
        pageTitle: "Danh muc san pham",
        records: newRecords
    })
}

//[GET] / admin/products-category/create
module.exports.create = async (req, res) => {
    let find = {
        deleted: false
    }

    const records = await ProductCategory.find(find);

    const newRecords = createTreeHelper.tree(records);
    res.render("admin/pages/products-category/create", {
        pageTitle: "Tao danh muc san pham",
        records: newRecords
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

//[GET] / admin/products-category/edit/:id

module.exports.edit = async (req, res) => {
    try {
        const id = req.params.id;

        const data = await ProductCategory.findOne({
            _id: id,
            deleted: false
        })

        const records = await ProductCategory.find({
            deleted: false
        });

        const newRecords = createTreeHelper.tree(records);
        res.render("admin/pages/products-category/edit", {
            pageTitle: "Chinh sua danh muc san pham",
            data: data,
            records: newRecords
        })

    } catch (error) {
        res.redirect(`${systemConfig.prefixAdmin}/products-category`)
    }

}

//[PATCH] / admin/products-category/edit/:id
module.exports.editPatch = async (req, res) => {
    const id = req.params.id;

    req.body.position = parseInt(req.body.position);
    try {

    } catch (error) {

    }
    await ProductCategory.updateOne({
        _id: id
    }, req.body);

    res.redirect(`${systemConfig.prefixAdmin}/products-category/edit/${id}`);
}

