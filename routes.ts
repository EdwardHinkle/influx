import * as express from "express";
import {authenticationRouter} from "./authentication/authentication.router";
import {microsubRouter} from "./microsub/microsub.router";

export let router = express.Router();

router.get('/', (req, res, next) => {
	res.send('influx homepage');
});

router.use('/auth', authenticationRouter);
router.use('/', microsubRouter);
