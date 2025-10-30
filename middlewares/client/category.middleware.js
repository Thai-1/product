const ProductCategory = require("../../models/product-category.model")
const createTreeHelper = require("../../helper/createTree")


module.exports.category = async (req, res, next) => {
    const productsCategory = await ProductCategory.find({
        deleted: false
    });

    const newProductscategory = createTreeHelper.tree(productsCategory)
    res.locals.layoutProductsCategory = newProductscategory

    next();
}