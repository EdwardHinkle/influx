import * as express from "express";
import {authenticationRouter} from "./authentication/authentication.router";
import {microsubRouter} from "./microsub/microsub.router";

export let router = express.Router();

router.use('/auth', authenticationRouter);
router.use('/', microsubRouter);