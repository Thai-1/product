const Cart = require("../../models/cart.model");
const Product = require("../../models/product.model")

//[POST] /cart/add/:productID
module.exports.addPost = async (req, res) => {
    const productId = req.params.productId;
    const quantity = req.body.quantity;
    const cartId = req.cookies.cartId;

    const cart = await Cart.findOne({
        _id: cartId
    })

    const existProduct = cart.products.find(item => item.product_id == productId)
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