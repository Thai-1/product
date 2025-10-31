const Product = require("../../models/product.model")

const productsHelper = require("../../helper/product")

//[GET] /
module.exports.index = async (req, res) => {

    // Lây ra sản phẩm nổi bật
    const productsFeatured = await Product.find({
        featured: 1,
        deleted: false,
        status: "active"
    }).limit(3);

    const newProducts = productsHelper.priceNewProducts(productsFeatured);
    // Hết lấy ra sản phẩm nổi bật

    console.log(newProducts);
    res.render("clients/pages/home/index", {
        pageTitle: "Trang chu",
        productsFeatured: newProducts
    })
}