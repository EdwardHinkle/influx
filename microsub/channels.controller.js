"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var fs = require("fs");
var storage_path = __dirname + "/../storage";
var reservedChannels = [
    { uid: 'global', name: 'Global' },
    { uid: 'default', name: 'Home' },
    { uid: 'notifications', name: 'Notifications' }
];
var ChannelController = (function () {
    function ChannelController() {
    }
    ChannelController.getChannel = function (username, uid) {
        // Look for channel in reserved
        var reservedChannel = reservedChannels.find(function (channel) { return channel.uid === uid; });
        if (reservedChannel !== undefined) {
            return reservedChannel;
        }
        // Look for channel in user channels
        var allChannels = ChannelController.getAllChannels(username);
        var channel = allChannels.find(function (channel) { return channel.uid === uid; });
        if (channel !== undefined) {
            return channel;
        }
        return false;
    };
    ChannelController.createChannel = function (username, uid, name) {
        // First check if the channel is reserved
        if (reservedChannels.find(function (channel) { return (channel.uid === uid || channel.name === name); }) !== undefined) {
            // todo: Add a proper error
            return false;
        }
        // Second check if the channel already exists
        var allChannels = ChannelController.getAllChannels(username);
        if (allChannels.find(function (channel) { return (channel.uid === uid || channel.name === name); }) !== undefined) {
            // todo: Add a proper error
            return false;
        }
        // All good, create the new channel
        var newChannel = {
            uid: uid,
            name: name
        };
        allChannels.push(newChannel);
        fs.writeFileSync(storage_path + "/" + username + "/channels.json", JSON.stringify(allChannels), { encoding: 'utf8' });
        return newChannel;
    };
    ChannelController.getAllChannels = function (username) {
        var channelData = fs.readFileSync(storage_path + "/" + username + "/channels.json", { encoding: 'utf8' });
        var jsonData = JSON.parse(channelData);
        return jsonData;
    };
    return ChannelController;
}());
exports.ChannelController = ChannelController;
