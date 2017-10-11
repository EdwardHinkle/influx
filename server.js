"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var express = require("express");
var bodyParser = require("body-parser");
var session = require("express-session");
var routes_1 = require("./routes");
var config = require('./config.json');
var app = express();
app.set("view engine", "pug");
app.set("views", __dirname);
app.listen(config.PORT, function () {
    console.log("Abode API running on " + config.PORT);
});
var sess = {
    secret: 'keyboard cat',
    cookie: {}
};
if (app.get('env') === 'production') {
    app.set('trust proxy', 1); // trust first proxy
    sess.cookie.secure = true; // serve secure cookies
}
app.use(session(sess));
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.json());
// App Routes
app.use('/', routes_1.router);
