const Cart = require("../../models/cart.model");
const Product = require("../../models/product.model")
const productsHelper = require("../../helper/product")

//[POST] /cart/add/:productID
module.exports.addPost = async (req, res) => {
    const productId = req.params.productId;
    const quantity = req.body.quantity;
    const cartId = req.cookies.cartId;

    const cart = await Cart.findOne({
        _id: cartId
    })


    const existProduct = cart.products.find(
        item => item.product_id.toString() === productId
    );

    // Tồn tại sản phẩm trong giỏ hàng rồi, cập nhật lại SL
    if (existProduct) {
        await Cart.updateOne({
            _id: cartId,
            "products.product_id": productId
        },
            {
                $set: {
                    "products.$.quantity": quantity
                }
            }
        )
    }

    //Chưa tồn tại sản phẩm trong giỏ hàng
    else {
        const objectCart = {
            product_id: productId,
            quantity: quantity
        }
        await Cart.updateOne(
            {
                _id: cartId,
            },
            {
                $push: { products: objectCart }
            }
        )
    }
    const product = await Product.findOne({
        _id: productId
    })

    req.flash("success", "Da them san pham vao gio hang");
    res.redirect(`/products/detail/${product.slug}`)
}

//[GET] /cart
module.exports.index = async (req, res) => {
    const cartId = req.cookies.cartId;

    const cart = await Cart.findOne({
        _id: cartId
    })

    if (cart.products.length > 0) {
        for (const item of cart.products) {
            const productId = item.product_id;
            const productInfo = await Product.findOne({
                _id: productId,
            }).select("title thumbnail slug price discountPercentage")

            productInfo.priceNew = productsHelper.priceNewProduct(productInfo)

            item.totalPrice = productInfo.priceNew * item.quantity;

            item.productInfo = productInfo;// sẽ lưu tạm thời vào cart
        }
    }
    cart.totalPrice = cart.products.reduce((sum, item) => (sum + item.totalPrice), 0)

    res.render("clients/pages/cart/index", {
        pageTitle: "Gio hàng",
        cartDetail: cart
    })
}

//[GET] /cart/delete/:productId
module.exports.delete = async (req, res) => {
    const productId = req.params.productId;
    const cartId = req.cookies.cartId;


    await Cart.updateOne({
        _id: cartId
    }, {
        $pull: {
            products: {
                product_id: {
                    _id: productId
                }
            }
        }
    })
    req.flash("success", "Da xoa thanh cong")
    res.redirect(`/cart`);
}

//[GET] /update/:productId/:quantity
module.exports.update = async (req, res) => {
    const productId = req.params.productId;
    const quantity = req.params.quantity
    const cartId = req.cookies.cartId;

    await Cart.updateOne({
        _id: cartId,
        "products.product_id": productId
    }, {
        $set: {"products.$.quantity": quantity}
    })

    req.flash("success","Cap nhat thanh cong")
    res.redirect("/cart")
}