"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var express = require("express");
var request = require("request");
var cheerio = require("cheerio");
var fs = require("fs");
// const clientUrl = 'https://influx.abode.pub';
var clientUrl = 'http://localhost:9010';
var storage_path = __dirname + "/../storage";
exports.authenticationRouter = express.Router();
exports.authenticationRouter.get('/login', function (req, res, next) {
    res.render('authentication/login');
});
exports.authenticationRouter.post('/login', function (req, res, next) {
    var meUrl = req.body.url;
    request(meUrl, function (error, response, html) {
        var authEndpoint = getAuthorizationEndpoint(response.headers, html);
        // strip off any query strings
        authEndpoint = authEndpoint.split("?").shift();
        req.session.authEndpoint = authEndpoint;
        req.session.meUrl = meUrl;
        res.writeHead(301, {
            Location: authEndpoint + "?me=" + meUrl + "&client_id=" + clientUrl + "&redirect_uri=" + clientUrl + "/auth/callback&response_type=id"
        });
        res.end();
    });
});
exports.authenticationRouter.get('/callback', function (req, res, next) {
    if (req.session.meUrl === undefined || req.session.authEndpoint === undefined) {
        res.status(400).send('No existing auth session found');
        return;
    }
    request.post({
        url: req.session.authEndpoint,
        form: {
            code: req.query.code,
            redirect_uri: clientUrl + "/auth/callback",
            client_id: clientUrl
        },
        headers: {
            accept: 'application/json'
        }
    }, function (err, httpResponse, body) {
        var jsonResponse = JSON.parse(body);
        if (req.query.me === jsonResponse.me) {
            // Add logged in to session
            req.session.username = jsonResponse.me.split("//").pop();
            // Verify that user has storage
            if (!fs.existsSync(storage_path + "/" + req.session.username)) {
                fs.mkdirSync(storage_path + "/" + req.session.username);
            }
            res.send("Logged in as " + req.session.username);
        }
        else {
            res.status(400).send('Identity URL does not match');
        }
    });
});
function getAuthorizationEndpoint(headers, html) {
    // First check for the http header link
    if (headers.link !== undefined) {
        // split the links on their commas
        var headerLinks = headers.link.split(", ");
        // find the link that is for the authorization endpoint
        var authorizationLink = headerLinks.find(function (link) { return link.indexOf('rel="authorization_endpoint"') > -1; });
        if (authorizationLink !== undefined) {
            // return authorization link
            var authEndpoint = authorizationLink.split(";").shift();
            return authEndpoint.slice(1, authEndpoint.length - 1);
        }
    }
    // Next, we check for an html auth link
    var $ = cheerio.load(html);
    var authEndpont = $("link[rel=authorization_endpoint]").attr('href');
    if (authEndpont !== undefined) {
        return authEndpont;
    }
}
