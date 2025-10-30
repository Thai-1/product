const Product = require("../../models/product.model")

const systemConfig = require("../../config/system")

const filterStatusHelper = require("../../helper/filterStatus")

const searchHelper = require("../../helper/search")

const paginationHelper = require("../../helper/pagination")

const createTreeHelper = require("../../helper/createTree")

const ProductCategory = require("../../models/product-category.model")

const Account = require("../../models/account.model")

//[GET] / admin/products
module.exports.index = async (req, res) => {


    filterStatus = filterStatusHelper(req.query);

    // console.log(req.query.status);

    let find = {
        deleted: false
    };

    if (req.query.status) {
        find.status = req.query.status;
    }

    const objectSearch = searchHelper(req.query);

    let keyword = "";
    if (objectSearch.keyword) {

        find.title = objectSearch.regex;
    }

    //Pagination
    const countProducts = await Product.countDocuments(find);

    let objectPagination = paginationHelper({
        currentPage: 1,
        limitItems: 4
    }, req.query, countProducts);
    // End Pagination

    //Sort
    let sort = {};
    if (req.query.sortKey && req.query.sortValue) {
        sort[req.query.sortKey] = req.query.sortValue;
    }
    else
        sort.position = "asc";
    //End Sort

    const products = await Product.find(find)
        .sort(sort)
        .limit(objectPagination.limitItems)
        .skip(objectPagination.skip);

    for (const product of products) {
        //Lấy ra thông tin người tạo
        const user = await Account.findOne({
            _id: product.createdBy.account_id
        })
        if (user) {
            product.accountFullName = user.fullName
        }

        // Lấy ra thông tin người cập nhật gần nhất
        const updatedBy = product.updatedBy[product.updatedBy.slice(-1)[0]];
        if (updatedBy) {
            const userUpdated = await Account.findOne({
                _id: updatedBy.account_id
            })
            updatedBy.accountFullName = userUpdated.fullName;
        }
    }

    const messages = req.flash("success");

    res.render("admin/pages/products/index", {
        pageTitle: "Danh sach san pham",
        products: products,
        filterStatus: filterStatus,
        keyword: objectSearch.keyword,
        pagination: objectPagination,
        messages
    })
}

//[PATCH] / admin/products/change-status/:status/:id
module.exports.changeStatus = async (req, res) => {
    const status = req.params.status;
    const id = req.params.id;
    const updatedBy = {
        account_id: res.locals.user.id,
        updatedAt: new Date()
    }
    await Product.updateOne({ _id: id },
        {
            status: status,
            $push: { updatedBy: updatedBy }
        });

    req.flash("success", "Cập nhật trạng thái thành công")
    // const messages = req.flash("success");
    // res.render("admin/pages/products/index", { messages });

    res.redirect("/admin/products");
    // res.send();
}

//[PATCH] / admin/products/change-multi
module.exports.changeMulti = async (req, res) => {
    const type = req.body.type;
    const ids = req.body.ids.split(", ");

    const updatedBy = {
        account_id: res.locals.user.id,
        updatedAt: new Date()
    }
    switch (type) {
        case "active":
            await Product.updateMany({ _id: { $in: ids } },
                {
                    status: "active",
                    $push: { updatedBy: updatedBy }
                }
            )
            req.flash("success", `Cap nhat thanh cong trang thai cua ${ids.length}`)
            break;
        case "inactive":
            await Product.updateMany({ _id: { $in: ids } },
                {
                    status: "inactive",
                    $push: { updatedBy: updatedBy }

                }
            )
            req.flash("success", `Cap nhat thanh cong trang thai cua ${ids.length}`)

            break;
        case "delete-all":
            await Product.updateMany({ _id: { $in: ids } },
                {
                    deleted: true,
                    // deletedAt: new Date()
                    deletedBy: {
                        account_id: res.locals.user.id,
                        deletedAt: new Date(),
                    },
                    $push: { updatedBy: updatedBy }
                }
            )
            req.flash("success", `Xóa thanh cong ${ids.length} san pham`)
            break;
        case "change-position":
            console.log(ids);
            for (const item of ids) {
                let [id, position] = item.split("-");
                position = parseInt(position);
                await Product.updateOne({ _id: id },
                    {
                        position: position,
                        $push: { updatedBy: updatedBy }
                    }
                )
            }
            req.flash("success", `Doi thanh cong vi tri cua san pham`)

            break;
        default:
            break;
    }
    res.redirect("/admin/products");
    // res.redirect("back");

}

//[PATCH] / admin/products/delete/:id
module.exports.deleteItem = async (req, res) => {
    const id = req.params.id;
    await Product.updateOne(
        { _id: id },
        {
            deleted: true,
            // deletedAt: new Date()
            deletedBy: {
                account_id: res.locals.user.id,
                deletedAt: new Date()
            }
        }
    );
    req.flash("success", `Xóa thanh cong san pham`)


    res.redirect("/admin/products");
}

//[GET] / admin/products/create
module.exports.createItem = async (req, res) => {
    let find = {
        deleted: false
    }

    const category = await ProductCategory.find(find);

    const newCategory = createTreeHelper.tree(category);
    res.render("admin/pages/products/create", {
        pageTitle: "Them moi san pham",
        category: newCategory

    })
}

//[POST] / admin/products/createPost
module.exports.createPost = async (req, res) => {
    if (!req.body.title) {
        req.flash("error", " Vui long nhap tiêu đề ");
        res.redirect("/admin/products/create");
        return;
    }
    req.body.price = parseInt(req.body.price);
    req.body.discountPercentage = parseInt(req.body.discountPercentage)
    req.body.stock = parseInt(req.body.stock);
    if (req.body.position == "") {
        const countProducts = await Product.countDocuments();
        req.body.position = countProducts + 1;
    }
    else {
        req.body.position = parseInt(req.body.position);
    }

    req.body.createdBy = {
        account_id: res.locals.user.id
    }

    const product = new Product(req.body);
    await product.save();
    res.redirect(`${systemConfig.prefixAdmin}/products`)
}

//[GET] / admin/products/edit/:id
module.exports.edit = async (req, res) => {
    try {
        const find = {
            deleted: false,
            _id: req.params.id
        }
        const category = await ProductCategory.find({
            deleted: false
        });

        const newCategory = createTreeHelper.tree(category);
        const product = await Product.findOne(find);
        res.render("admin/pages/products/edit", {
            pageTitle: "Sua san pham",
            product: product,
            category: newCategory
        })

    }
    catch (error) {
        console.log(error);
        res.redirect(`${systemConfig.prefixAdmin}/products`)
    }

}

//[PATCH] / admin/products/edit:id
module.exports.editPatch = async (req, res) => {
    req.body.price = parseInt(req.body.price)
    req.body.stock = parseInt(req.body.stock)
    req.body.discountPercentage = parseInt(req.body.discountPercentage)
    req.body.position = parseInt(req.body.position)
    if (req.file) {
        req.body.thumbnail = `upload/${req.file.filename}`
    }

    try {
        const updatedBy = {
            account_id: res.locals.user.id,
            updatedAt: new Date()
        }
        await Product.updateOne(
            { _id: req.params.id },
            {
                $set: { ...req.body },
                $push: { updatedBy: updatedBy }
            }
        );
        req.flash("success", "Cap nhat thanh cong")
    } catch (error) {
        req.flash("error", "Cap nhat that bai")

    }

    res.redirect(`/admin/products/edit/${req.params.id}`);
}

//[GET] /admin/product/detail/:id
module.exports.detail = async (req, res) => {
    try {
        const find = {
            deleted: false,
            _id: req.params.id
        }
        const product = await Product.findOne(find);
        console.log(product);
        res.render("admin/pages/products/detail", {
            pageTitle: product.title,
            product: product
        })
    } catch (error) {
        res.render(`${systemConfig.prefixAdmin}/products`)
    }
}
