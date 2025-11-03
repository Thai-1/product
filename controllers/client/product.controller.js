const Product = require("../../models/product.model");
const ProductCategory = require("../../models/product-category.model")

const productsHelper = require("../../helper/product")

const productsCategoryHelper = require("../../helper/products-category")


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

//[GET] / products/:slugProduct
module.exports.detail = async (req, res) => {
    try {
        const find = {
            deleted: false,
            slug: req.params.slug,
            status: "active"
        }
        const product = await Product.findOne(find);

        if(product.product_category_id){
            const category = await ProductCategory.findOne({
                _id: product.product_category_id,
                status: "active",
                deleted: false
            });

            product.category = category; 
        }
        product.priceNew = productsHelper.priceNewProduct(product);

        res.render("clients/pages/products/detail", {
            pageTitle: product.title,
            product: product
        })
    } catch (error) {
        res.render("clients/pages/products/detail")
    }
}

//[GET] / products/:slugCategory

module.exports.category = async (req, res) => {

    const category = await ProductCategory.findOne({
        slug: req.params.slugCategory,
        status: "active",
        deleted: false
    })

    const listSubCategory = await productsCategoryHelper.getSubCategory(category.id);
    
    const listSubCategoryId = listSubCategory.map(item => item.id);

    const products = await Product.find({
        product_category_id: {$in:[category.id, ...listSubCategoryId]},
        deleted: false
    }).sort({ position: "desc" });

    const newProducts = productsHelper.priceNewProducts(products)

    res.render("clients/pages/products/index", {
        pageTitle: category.title,
        products: newProducts
    });
}
