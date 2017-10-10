"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var express = require("express");
var authentication_router_1 = require("./authentication/authentication.router");
var microsub_router_1 = require("./microsub/microsub.router");
exports.router = express.Router();
exports.router.use('/auth', authentication_router_1.authenticationRouter);
exports.router.use('/', microsub_router_1.microsubRouter);
