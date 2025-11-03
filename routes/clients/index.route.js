const homeRouters = require("./home.route");

const productRouters = require("./product.route");

const searchRouters = require("./search.route");

const categoryMiddleware = require("../../middlewares/client/category.middleware")

module.exports = (app) => {
    app.use(categoryMiddleware.category)

    app.use('/',homeRouters);

    app.use('/products', categoryMiddleware.category, productRouters);

    app.use('/search',searchRouters);

}
