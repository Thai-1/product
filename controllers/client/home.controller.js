const Product = require("../../models/product.model")

const productsHelper = require("../../helper/product")

//[GET] /
module.exports.index = async (req, res) => {

    // Lây ra sản phẩm nổi bật
    const productsFeatured = await Product.find({
        featured: "1",
        deleted: false,
        status: "active"
    }).limit(6);

    const newProductsFeatured = productsHelper.priceNewProducts(productsFeatured);
    // Hết lấy ra sản phẩm nổi bật

    //Lấy ra sản phẩm mới nhất
    const productsNew = await Product.find({
        deleted: false,
        status: "active"  
    }).sort({position:"desc"}).limit(6);

    const newProductsNew = productsHelper.priceNewProducts(productsNew);

    // Hết lấy ra sản phẩm mới nhất
    res.render("clients/pages/home/index", {
        pageTitle: "Trang chu",
        productsFeatured: newProductsFeatured,
        productsNew: newProductsNew
    })
}