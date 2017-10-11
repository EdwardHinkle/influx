import * as express from 'express';
import * as bodyParser from 'body-parser';
import * as moment from 'moment';
import * as fs from 'fs';
import * as cron from 'cron';
import * as path from 'path';
import * as session from 'express-session';

import { router } from './routes';

let config = require('./config.json');

const app = express();

app.set("view engine", "pug");
app.set("views", __dirname);

app.listen(config.PORT, function() {
    console.log("Abode API running on " + config.PORT);
});

const sess: any = {
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
app.use('/', router);
