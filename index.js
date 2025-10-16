const express = require('express');
const path = require ("path");
const methodOveride = require("method-override");
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const flash = require("connect-flash");

require("dotenv").config();

const database = require("./config/database")

const systemConfig = require("./config/system")

const route = require("./routes/clients/index.route")
const routeAdmin = require("./routes/admin/index.route")


database.connect();

const app = express();

app.use(methodOveride('_method'));

app.use(bodyParser.urlencoded({ extended: false }))

const port = process.env.PORT;

app.set('views', `${__dirname}/views`);
app.set('view engine', 'pug');


//flash
// app.use(session({
//     secret: "keyMySet",       // chuỗi bí mật
//     resave: false,
//     saveUninitialized: true,
//     cookie: { maxAge: 60000 } // 1 phút
// }));
app.use(cookieParser("keyMySet")); // cookieParser riêng
app.use(session({
    secret: "keyMySet",       
    resave: false,
    saveUninitialized: true,
    cookie: { maxAge: 60000 } 
}));

app.use(flash());
// Truyền flash message tới view
app.use((req, res, next) => {
    res.locals.messages = {
        success: req.flash('success'),
        error: req.flash('error')
    };
    next();
});



app.use('/tinymce', express.static(path.join(__dirname, 'node_modules', 'tinymce')));


//File pug nào cũng dùng được biến prefixAdmin
app.locals.prefixAdmin = systemConfig.prefixAdmin;

app.use(express.static(`${__dirname}/public`));

route(app);
routeAdmin(app);
//chạy khi khởi động lại file index.js
app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
}) 
