import * as express from "express";
import * as request from "request";
import * as cheerio from "cheerio";
import * as fs from 'fs';

// const clientUrl = 'https://influx.abode.pub';
const clientUrl = 'http://localhost:9010';
const storage_path = `${__dirname}/../storage`;

export let authenticationRouter = express.Router();

authenticationRouter.get('/login', (req, res, next) => {
    res.render('authentication/login');
});

authenticationRouter.post('/login', (req: any, res, next) => {

    let meUrl = req.body.url;

    request(meUrl, (error: any, response: any, html: any) => {
        let authEndpoint = getAuthorizationEndpoint(response.headers, html);

        // strip off any query strings
        authEndpoint = authEndpoint.split("?").shift();

        req.session.authEndpoint = authEndpoint;
        req.session.meUrl = meUrl;

        res.writeHead(301, {
            Location: `${authEndpoint}?me=${meUrl}&client_id=${clientUrl}&redirect_uri=${clientUrl}/auth/callback&response_type=id`
        });
        res.end();
    });

});

authenticationRouter.get('/callback', (req: any, res, next) => {

    if (req.session.meUrl === undefined || req.session.authEndpoint === undefined) {
        res.status(400).send('No existing auth session found');
        return;
    }

    request.post({
        url: req.session.authEndpoint,
        form: {
            code: req.query.code,
            redirect_uri: `${clientUrl}/auth/callback`,
            client_id: clientUrl
        },
        headers: {
            accept: 'application/json'
        }
    }, (err, httpResponse, body) => {

        let jsonResponse = JSON.parse(body);

        if (req.query.me === jsonResponse.me) {

            // Add logged in to session
            req.session.username = jsonResponse.me.split("//").pop();

            // Verify that user has storage
            if (!fs.existsSync(`${storage_path}/${req.session.username}`)) {
                fs.mkdirSync(`${storage_path}/${req.session.username}`);
            }

            res.send(`Logged in as ${req.session.username}`);

        } else {
            res.status(400).send('Identity URL does not match');
        }

    });

});

function getAuthorizationEndpoint(headers: any, html: any) {

    // First check for the http header link
    if (headers.link !== undefined) {
        // split the links on their commas
        let headerLinks = headers.link.split(", ");

        // find the link that is for the authorization endpoint
        let authorizationLink = headerLinks.find((link: string) => link.indexOf('rel="authorization_endpoint"') > -1);

        if (authorizationLink !== undefined) {
            // return authorization link
            let authEndpoint = authorizationLink.split(";").shift();
            return authEndpoint.slice(1, authEndpoint.length-1);
        }
    }

    // Next, we check for an html auth link
    let $ = cheerio.load(html);

    let authEndpont = $("link[rel=authorization_endpoint]").attr('href');
    if (authEndpont !== undefined) {
        return authEndpont;
    }
}