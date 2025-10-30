const Product = require("../../models/product.model");

//[GET] / products

module.exports.index = async (req, res) => {
    const products = await Product.find({
        status: "active",
        deleted: false
    }).sort({ position: "asc" });

    const newProducts = products.map(item => {
        item.priceNew = (item.price * (100 - item.
            discountPercentage) / 100).toFixed();
        return item;
    })


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