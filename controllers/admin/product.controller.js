const Product = require("../../models/product.model")

const systemConfig = require("../../config/system")

const filterStatusHelper = require("../../helper/filterStatus")

const searchHelper = require("../../helper/search")

const paginationHelper = require("../../helper/pagination")

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


    const products = await Product.find(find)
        .sort({ position: "asc" })
        .limit(objectPagination.limitItems)
        .skip(objectPagination.skip);


    // console.log(products);
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

    await Product.updateOne({ _id: id }, { status: status });

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
    switch (type) {
        case "active":
            await Product.updateMany({ _id: { $in: ids } },
                { status: "active" }
            )
            req.flash("success", `Cap nhat thanh cong trang thai cua ${ids.length}`)
            break;
        case "inactive":
            await Product.updateMany({ _id: { $in: ids } },
                { status: "inactive" }
            )
            req.flash("success", `Cap nhat thanh cong trang thai cua ${ids.length}`)

            break;
        case "delete-all":
            await Product.updateMany({ _id: { $in: ids } },
                {
                    deleted: true,
                    deletedAt: new Date()
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
                        position: position
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
            deletedAt: new Date()
        }
    );
    req.flash("success", `Xóa thanh cong san pham`)


    res.redirect("/admin/products");
}

//[GET] / admin/products/create
module.exports.createItem = async (req, res) => {
    res.render("admin/pages/products/create", {
        pageTitle: "Them moi san pham"
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
    if (req.file)
        req.body.thumbnail = `/uploads/${req.file.filename}`
    const product = new Product(req.body);
    await product.save();
    res.redirect(`${systemConfig.prefixAdmin}/products`)
}

//[GET] / admin/products/:id
module.exports.edit = async (req, res) => {
    try {
        const find = {
            deleted: false,
            _id: req.params.id
        }

        const product = await Product.findOne(find);
        res.render("admin/pages/products/edit", {
            pageTitle: "Sua san pham",
            product
        })

    } catch (error) {
        res.redirect(`${systemConfig.prefixAdmin}/products`)
    }

}

//[PATCH] / admin/products/:id
module.exports.editPatch = async (req, res) => {
    req.body.price = parseInt(req.body.price)
    req.body.stock = parseInt(req.body.stock)
    req.body.discountPercentage = parseInt(req.body.discountPercentage)
    req.body.position = parseInt(req.body.position)
    if (req.file) {
        req.body.thumbnail = `upload/${req.file.filename}`
    }

    try {
        await Product.updateOne(
            {_id: req.params.id},
            req.body)
        res.flash("success","Cap nhat thanh cong")
    } catch (error) {
        res.flash("error","Cap nhat that bai")

    }

    res.redirect(`/admin/products/edit/${req.params.id}`);
}

//[GET] /admin/product/detail/:id
module.exports.detail = async(req, res) => {
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
