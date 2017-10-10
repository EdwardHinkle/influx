import * as express from "express";
import * as request from "request";
import * as cheerio from "cheerio";
import * as fs from 'fs';
import {ChannelController} from "./channels.controller";

// const clientUrl = 'https://influx.abode.pub';
const clientUrl = 'http://localhost:9010';
const storage_path = `${__dirname}/../storage`;

export let microsubRouter = express.Router();

microsubRouter.get('/:username/microsub', (req, res, next) => {
   let username = req.params.username;
   let userExists = fs.existsSync(`${storage_path}/${username}`);

   if (!userExists) {
       res.status(400).send(`${username} does not exist on this server`);
       return;
   }

   switch(req.query.q) {
       case 'config':
           res.status(200).json(MicrosubController.getMicrosubConfigInfo(username));
           break;
   }

   let action = req.query.action || req.body.action;
   let channel = req.query.channel || req.body.channel;
   let results = undefined;

   switch(action) {
       case 'channels':
           results = ChannelController.getAllChannels(username);
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
   } else {
       res.status(200).send(results);
   }


});

microsubRouter.post('/:username/microsub', (req, res, next) => {
    let username = req.params.username;
    let userExists = fs.existsSync(`${storage_path}/${username}`);

    if (!userExists) {
        res.status(400).send(`${username} does not exist on this server`);
        return;
    }

    let action = req.query.action || req.body.action;
    let channel = req.query.channel || req.body.channel;
    let results = undefined;

    switch(action) {
        case 'channels':
            results = ChannelController.createChannel(username, req.body.uid, req.body.name);
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
    } else {
        res.status(200).send(results);
    }

});

export class MicrosubController {
    static getMicrosubConfigInfo(username: string) {

        let configData = { channels: [] };
        configData.channels = ChannelController.getAllChannels(username);
        return configData;
    }
}
