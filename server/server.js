const { client_id, client_secret } = require('./CONSTANT')

const express = require('express');
const cors = require('cors');
const SpotifyWebApi = require('spotify-web-api-node');
const bodyParser = require('body-parser');
const app = express();

app.use(cors());
app.use(bodyParser.json())
bodyParser.urlencoded({extended:true});

//create new access token every 1 hour
app.post('/refresh', (req, res) => {
    const refreshToken = req.body.refreshToken;
    const spotifyApi = new SpotifyWebApi({
        redirectUri: 'http://localhost:3000',
        clientId: client_id,
        clientSecret: client_secret,
        refreshToken,
    });
    
    spotifyApi.refreshAccessToken()
        .then(
            (data) => {
                res.json({
                    accessToken: data.body.access_token,
                    expiresIn: data.body.expires_in
                })
                //spotifyApi.setAccessToken(data.body['access_token']);
            }
        )
        .catch((err) => {
            res.sendStatus(400);
        })
})

app.post('/login', (req, res) => {
    const code = req.body.code;
    const spotifyApi = new SpotifyWebApi({
        redirectUri: 'http://localhost:3000',
        clientId: client_id,
        clientSecret: client_secret
    })
    
    spotifyApi.authorizationCodeGrant(code)
        .then(data => {
            res.json({
                accessToken: data.body.access_token,
                refresh_token: data.body.refresh_token,
                expires_in: data.body.expires_in
            })
        })
        .catch((err) => {
            console.error(err);
            res.sendStatus(400);
        })
})   
app.listen(3001)
