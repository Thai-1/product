const Product = require("../../models/product.model");

const productsHelper = require("../../helper/product")

//[GET] / products

module.exports.index = async (req, res) => {
    const products = await Product.find({
        status: "active",
        deleted: false
    }).sort({ position: "asc" });

    const newProducts = productsHelper.priceNewProducts(products)

    res.render("clients/pages/products/index", {
        pageTitle: "Danh sach san pham",
        products: newProducts
    });
}

module.exports.detail = async (req, res) => {
    try {
        const find = {
            deleted: false,
            slug: req.params.slug,
            status: "active"
        }
        const product = await Product.findOne(find);

        res.render("clients/pages/products/detail", {
            pageTitle: product.title,
            product: product
        })
    } catch (error) {
        res.render("clients/pages/products/detail")
    }
}