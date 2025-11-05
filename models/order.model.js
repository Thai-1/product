const mongoose = require("mongoose");

const oderSchema = new mongoose.Schema(
    {
        // user_id: String,
        cart_id: String,
        userInfo: {
            fullName: String,
            phone: String,
            address: String
        },
        products: [
            {
                product_id: String,
                price: Number,
                discounPercentage: Number,
                quantity: Number
            }
        ],
        deleted: {
            type: Boolean,
            default: false
        },
        deletedAt: Date
    },
    {
        timestamps: true
    }
);

const Order = mongoose.model('Oder', oderSchema, "orders");

module.exports = Order;