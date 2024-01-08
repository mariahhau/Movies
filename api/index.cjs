const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const User = require('./models/User');
const Show = require('./models/Show');
const bcrypt = require('bcryptjs');
const app = express();
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');
require("dotenv").config({ path: "./config.env" })
const axios = require("axios")

const apiKey = process.env.RAPIDAPI_KEY;

const options = {
    method: "GET",
    url: "https://streaming-availability.p.rapidapi.com/search/title",
    params: {
        title: "",
        country: "fi",
        show_type: "all",
        output_language: "en",
    },
    headers: {
        "X-RapidAPI-Key": apiKey,
        "X-RapidAPI-Host": "streaming-availability.p.rapidapi.com",
    },
};


const salt = bcrypt.genSaltSync(10);
const secret = process.env.SECRET;

app.use(cors({ credentials: true, origin: 'http://localhost:5173' }));
app.use(express.json());
app.use(cookieParser());

mongoose.connect(process.env.ATLAS_URI);

app.post('/register', async (req, res) => {
    const { username, password } = req.body;
    try {
        const userDoc = await User.create({
            username,
            password: bcrypt.hashSync(password, salt),
        });
        res.json(userDoc);
    } catch (e) {
        console.log(e)
        res.status(400).json(e);
    }
});


app.post('/login', async (req, res) => {
    const { username, password } = req.body;
    const userDoc = await User.findOne({ username });
    const passOk = bcrypt.compareSync(password, userDoc.password);

    if (passOk) {
        jwt.sign({ username, id: userDoc._id }, secret, {}, (err, token) => {
            if (err) throw err;
            res.cookie('token', token).json({
                id: userDoc._id,
                username,
            });
        })

    } else {
        res.status(400).json('wrong credentials');

    }
})


app.get('/profile', (req, res) => {
    const { token } = req.cookies;

    jwt.verify(token, secret, {}, (err, info) => {
        if (err) throw err;
        res.json(info);

    });
})


app.post('/logout', (req, res) => {
    res.cookie('token', '').json('ok');
});

app.post('/saved', (req, res) => {
    const { token } = req.cookies;
    console.log(token)

    jwt.verify(token, secret, {}, async (err, info) => {
        if (err) console.log(err); //throw err
        const { title, imdbId, startYear, endYear, streamingInfo, type, fetchedAt } = req.body;

        let showInfo;
        if (await Show.exists({ imdbId })) {
            showInfo = await Show.findOneAndUpdate({ imdbId: imdbId },
                { title: title, startYear: startYear, endYear: endYear, streamingInfo: streamingInfo, type: type, fetchedAt: fetchedAt });
        } else {
            showInfo = await Show.create({ title, imdbId, startYear, endYear, streamingInfo, type, fetchedAt });
        }

        const user = await User.findById(info.id);
        let saved = user.savedShows;

        if (!saved.includes(showInfo._id)) {
            saved.push(showInfo._id)
            await user.updateOne({ savedShows: saved })
        }
        res.json(showInfo)

    })

});


app.get('/watchlist', (req, res) => {
    const { token } = req.cookies;

    jwt.verify(token, secret, {}, async (err, info) => {
        if (err) console.log(err); //throw err

        const user = await User.findById(info.id);
        const imdbIds = user.savedShows;
        const data = await Promise.all(imdbIds.map(id => {

            return Show.findById(id);

        }));
        console.log(data)
        res.json(data)
    })
})

app.post('/streamingAPI', async (req, res) => {
    options.params.title = req.body.title;
    const response = await axios.request(options);
    const results = response.data.result;
    res.json(results);
})

app.listen(4000);
