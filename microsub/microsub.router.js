"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var express = require("express");
var fs = require("fs");
var channels_controller_1 = require("./channels.controller");
// const clientUrl = 'https://influx.abode.pub';
var clientUrl = 'http://localhost:9010';
var storage_path = __dirname + "/../storage";
exports.microsubRouter = express.Router();
exports.microsubRouter.get('/:username/microsub', function (req, res, next) {
    var username = req.params.username;
    var userExists = fs.existsSync(storage_path + "/" + username);
    if (!userExists) {
        res.status(400).send(username + " does not exist on this server");
        return;
    }
    switch (req.query.q) {
        case 'config':
            res.status(200).json(MicrosubController.getMicrosubConfigInfo(username));
            break;
    }
    var action = req.query.action || req.body.action;
    var channel = req.query.channel || req.body.channel;
    var results = undefined;
    switch (action) {
        case 'channels':
            results = channels_controller_1.ChannelController.getAllChannels(username);
            break;
        case 'timeline':
            break;
        case 'follow':
            break;
        case 'unfollow':
            break;
        case 'mute':
            break;
        case 'unmute':
            break;
        case 'block':
            break;
        case 'unblock':
            break;
        case 'preview':
            break;
    }
    if (results === undefined) {
        res.status(400).send('Error');
    }
    else {
        res.status(200).send(results);
    }
});
exports.microsubRouter.post('/:username/microsub', function (req, res, next) {
    var username = req.params.username;
    var userExists = fs.existsSync(storage_path + "/" + username);
    if (!userExists) {
        res.status(400).send(username + " does not exist on this server");
        return;
    }
    var action = req.query.action || req.body.action;
    var channel = req.query.channel || req.body.channel;
    var results = undefined;
    switch (action) {
        case 'channels':
            results = channels_controller_1.ChannelController.createChannel(username, req.body.uid, req.body.name);
            break;
        case 'timeline':
            break;
        case 'follow':
            break;
        case 'unfollow':
            break;
        case 'mute':
            break;
        case 'unmute':
            break;
        case 'block':
            break;
        case 'unblock':
            break;
        case 'preview':
            break;
    }
    if (results === undefined) {
        res.status(400).send('Error');
    }
    else {
        res.status(200).send(results);
    }
});
var MicrosubController = (function () {
    function MicrosubController() {
    }
    MicrosubController.getMicrosubConfigInfo = function (username) {
        var configData = { channels: [] };
        configData.channels = channels_controller_1.ChannelController.getAllChannels(username);
        return configData;
    };
    return MicrosubController;
}());
exports.MicrosubController = MicrosubController;
