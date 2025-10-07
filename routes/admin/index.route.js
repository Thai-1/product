const systemConfig = require("../../config/system");

const dashboardRoutes = require("./dashboard.route");

const productRoutes = require("./product.route");

const productCategoryRoutes = require("./product-category.route")


module.exports = (app) => {
    PathAdmin = systemConfig.prefixAdmin;
    app.use(PathAdmin + '/dashboard', dashboardRoutes);

    app.use(PathAdmin + '/products', productRoutes);

    app.use(PathAdmin + '/products-category', productCategoryRoutes);


}
