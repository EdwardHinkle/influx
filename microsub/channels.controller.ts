import {Channel} from "./channel.model";
import * as fs from 'fs';

const storage_path = `${__dirname}/../storage`;

const reservedChannels: any = [
    { uid: 'global', name: 'Global' },
    { uid: 'default', name: 'Home' },
    { uid: 'notifications', name: 'Notifications' }
];


export class ChannelController {

    static getChannel(username: string, uid: string): Channel | boolean {
        // Look for channel in reserved
        let reservedChannel = reservedChannels.find((channel: Channel) => channel.uid === uid);
        if (reservedChannel !== undefined) {
            return reservedChannel;
        }

        // Look for channel in user channels
        let allChannels = ChannelController.getAllChannels(username);
        let channel = allChannels.find((channel: Channel) => channel.uid === uid);
        if (channel !== undefined) {
            return channel;
        }

        return false;
    }

    static createChannel(username: string, uid: string, name: string): Channel | boolean {
        // First check if the channel is reserved
        if (reservedChannels.find((channel: Channel) => (channel.uid === uid || channel.name === name)) !== undefined) {
            // todo: Add a proper error
            return false;
        }

        // Second check if the channel already exists
        let allChannels = ChannelController.getAllChannels(username);
        if (allChannels.find((channel: Channel) => (channel.uid === uid || channel.name === name)) !== undefined) {
            // todo: Add a proper error
            return false;
        }

        // All good, create the new channel
        let newChannel: Channel = {
            uid: uid,
            name: name
        };

        allChannels.push(newChannel);

        fs.writeFileSync(`${storage_path}/${username}/channels.json`, JSON.stringify(allChannels), { encoding: 'utf8'});

        return newChannel;
    }

    static getAllChannels(username: string) {
        let channelData = fs.readFileSync(`${storage_path}/${username}/channels.json`, { encoding: 'utf8'});
        let jsonData = JSON.parse(channelData);
        return jsonData;
    }
}