const systemConfig = require("../../config/system");

const dashboardRoutes = require("./dashboard.route");

const authMiddleware = require("../../middlewares/admin/auth.middleware")

const productRoutes = require("./product.route");

const productCategoryRoutes = require("./product-category.route")

const roleRoutes = require("./role.route");

const accountRoutes = require("./account.route");

const authRoutes = require("./auth.route");




module.exports = (app) => {
    PathAdmin = systemConfig.prefixAdmin;
    app.use(PathAdmin + '/dashboard', authMiddleware.requireAuth, dashboardRoutes);

    app.use(PathAdmin + '/products', authMiddleware.requireAuth, productRoutes);

    app.use(PathAdmin + '/products-category', authMiddleware.requireAuth, productCategoryRoutes);

    app.use(PathAdmin + '/roles', authMiddleware.requireAuth, roleRoutes);

    app.use(PathAdmin + '/accounts', authMiddleware.requireAuth, accountRoutes);

    app.use(PathAdmin + '/auth', authRoutes);

}
