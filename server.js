const express = require('express')
const mongoose = require('mongoose')
const ShortURL = require('./models/shortUrls')
const app = express()

mongoose.connect('mongodb://127.0.0.1:27017/urlShortener')

app.set('view engine', 'ejs');
app.use(express.urlencoded({extended: false}))

app.get("/", async (req, res) => {
    const shortUrls = await ShortURL.find();
    res.render('index', {shortUrls: shortUrls});
})

app.post("/shortURLs", async (req, res) => {
    await ShortURL.create({full: req.body.fullURL})

    res.redirect('/');
})

app.get("/:shortUrl", async(req, res) => {
    const shortUrl = await ShortURL.findOne({short: req.params.shortUrl});
    if (shortUrl === null) return res.sendStatus(404);

    shortUrl.clicks++;
    shortUrl.save()

    res.redirect(shortUrl.full);
})

app.listen(process.env.PORT || 5000);