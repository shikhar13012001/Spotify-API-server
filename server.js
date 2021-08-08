const express = require("express");
const spotifyWebApi = require("spotify-web-api-node");
const lyricsFinder=require('lyrics-finder')
const app = express();
const cors=require("cors");
const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({ extended: true }))

app.post("/refresh",(req,res)=>{
    const refreshToken=req.body.refreshToken;
    const spotifyApi = new spotifyWebApi({
        redirectUri: "http://localhost:3000",
        clientId: "7125cdc23b434d778a1be48a2e3ae701",
        clientSecret: "c2517037d75c42f4ac33de657bb14e31",
         refreshToken    
    });
    spotifyApi
    .refreshAccessToken()
    .then(data => {
      res.json({
        accessToken: data.body.accessToken,
        expiresIn: data.body.expiresIn,
      })
    })
    .catch(err => {
      console.log(err)
      res.sendStatus(400)
    })
})
app.use(cors())
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
app.post("/login", (req, res) => {
  const code = req.body.code;
  const spotifyApi = new spotifyWebApi({
    redirectUri: "http://localhost:3000",
    clientId: "7125cdc23b434d778a1be48a2e3ae701",
    clientSecret: "c2517037d75c42f4ac33de657bb14e31",
  });
  spotifyApi
    .authorizationCodeGrant(code)
    .then((data) =>
      res.json({
        accessToken: data.body.access_token,
        refreshToken: data.body.refresh_token,
        expiresIn: data.body.expires_in,
      })
    )
    .catch(() => {
      res.sendStatus(400);
    });
});
app.get("/lyrics", async (req, res) => {
  const lyrics =
    (await lyricsFinder(req.query.artist, req.query.track)) || "No Lyrics Found"
  res.json({ lyrics })
})
app.listen(3001)