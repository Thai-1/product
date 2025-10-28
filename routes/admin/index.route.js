const systemConfig = require("../../config/system");

const dashboardRoutes = require("./dashboard.route");

const productRoutes = require("./product.route");

const productCategoryRoutes = require("./product-category.route")

const roleRoutes = require("./role.route");

const accountRoutes = require("./account.route");



module.exports = (app) => {
    PathAdmin = systemConfig.prefixAdmin;
    app.use(PathAdmin + '/dashboard', dashboardRoutes);

    app.use(PathAdmin + '/products', productRoutes);

    app.use(PathAdmin + '/products-category', productCategoryRoutes);

    app.use(PathAdmin + '/roles', roleRoutes);

    app.use(PathAdmin + '/accounts', accountRoutes);

}
