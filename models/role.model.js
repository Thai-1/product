const mongoose = require("mongoose");

mongoose.plugin(slug);

const roleSchema = new mongoose.Schema(
    {
        title: String,
        description: String,
        permissions: {
            type: Array,
            default: []
        },
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

const Product = mongoose.model('Product', productSchema, "products");

module.exports = Product;