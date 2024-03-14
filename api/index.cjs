const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const User = require("./models/User");
const Show = require("./models/Show");
const bcrypt = require("bcryptjs");
const app = express();
const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser");
require("dotenv").config({ path: "./config.env" });
const axios = require("axios");
const NodeCache = require("node-cache");
const omdbCache = new NodeCache();
const streamingCache = new NodeCache();

const fetchOMDB = false;
const fetchStreamingApi = true;
const apiKey = process.env.RAPIDAPI_KEY;
let limit = 0;

const optionsStreaming = {
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

const optionsOMDB = {
  method: "GET",
  url: "http://www.omdbapi.com/",
  params: {
    apikey: process.env.OMDB_KEY,
    i: "",
    plot: "full",
  },
};

const salt = bcrypt.genSaltSync(10);
const secret = process.env.SECRET;

app.use(cors({ credentials: true, origin: "http://localhost:5173" }));
app.use(express.json());
app.use(cookieParser());

mongoose.connect(process.env.ATLAS_URI);

app.post("/register", async (req, res) => {
  const { username, password } = req.body;
  try {
    const userDoc = await User.create({
      username,
      password: bcrypt.hashSync(password, salt),
    });
    res.json(userDoc);
  } catch (e) {
    console.log(e);
    res.status(400).json(e);
  }
});

app.post("/login", async (req, res) => {
  const { username, password } = req.body;
  const userDoc = await User.findOne({ username });
  const passOk = bcrypt.compareSync(password, userDoc.password);

  if (passOk) {
    jwt.sign(
      { username: username, id: userDoc._id },
      secret,
      { expiresIn: "1h" },
      (err, token) => {
        if (err) throw err;
        res.cookie("token", token).json({
          id: userDoc._id,
          username,
        });
      }
    );
  } else {
    res.status(400).json("wrong credentials");
  }
});

app.get("/profile", (req, res) => {
  const { token } = req.cookies;

  if (!token) {
    console.log("token is null");
    res.status(200).json("not logged in");
  } else {
    jwt.verify(token, secret, {}, (err, info) => {
      if (err) console.log(err); //throw err;
      res.json(info);
    });
  }
});

app.post("/logout", (req, res) => {
  res.cookie("token", "").json("ok");
});

app.post("/saved", (req, res) => {
  const { token } = req.cookies;
  console.log(token);

  jwt.verify(token, secret, {}, async (err, info) => {
    if (err) console.log(err); //throw err
    const {
      title,
      imdbId,
      startYear,
      endYear,
      streamingInfo,
      type,
      fetchedAt,
    } = req.body;

    let showInfo;
    if (await Show.exists({ imdbId })) {
      showInfo = await Show.findOneAndUpdate(
        { imdbId: imdbId },
        {
          title: title,
          startYear: startYear,
          endYear: endYear,
          streamingInfo: streamingInfo,
          type: type,
          fetchedAt: fetchedAt,
        }
      );
    } else {
      showInfo = await Show.create({
        title,
        imdbId,
        startYear,
        endYear,
        streamingInfo,
        type,
        fetchedAt,
      });
    }

    const user = await User.findById(info.id);
    let saved = user.savedShows;

    if (!saved.includes(showInfo._id)) {
      saved.push(showInfo._id);
      await user.updateOne({ savedShows: saved });
    }
    res.json(showInfo);
  });
});

app.delete("/saved", (req, res) => {
  const { token } = req.cookies;
  console.log(token, " delete");

  jwt.verify(token, secret, {}, async (err, info) => {
    if (err) console.log(err); //throw err
    const { imdbId } = req.body;

    let showInfo;
    if (await Show.exists({ imdbId })) {
      showInfo = await Show.findOne({ imdbId: imdbId });
    }

    const user = await User.findById(info.id);
    let saved = user.savedShows;

    if (saved.includes(showInfo._id)) {
      const i = saved.indexOf(showInfo._id);
      saved.splice(i, 1);
      await user.updateOne({ savedShows: saved });
    }
    res.json(showInfo);
  });
});

app.get("/watchlist", (req, res) => {
  const { token } = req.cookies;

  jwt.verify(token, secret, {}, async (err, info) => {
    if (err) console.log(err); //throw err

    const user = await User.findById(info.id);
    const imdbIds = user.savedShows;
    const data = await Promise.all(
      imdbIds.map((id) => {
        return Show.findById(id);
      })
    );
    res.json(data);
  });
});

app.post("/streamingAPI", async (req, res) => {
  if (!fetchStreamingApi) return;
  const cacheData = streamingCache.get(req.body.title);

  if (cacheData) {
    console.log("using streaming data cache");
    res.json(cacheData);
  } else {
    console.log("Fetch Streaming Availability API");
    optionsStreaming.params.title = req.body.title;
    const response = await axios.request(optionsStreaming);
    const results = response.data.result;
    streamingCache.set(req.body.title, results);
    res.json(results);
  }
});

app.get("/movieAPI/:id", async (req, res) => {
  const imdbId = new URLSearchParams(req.params.id).get("id");
  console.log("/movieAPI/:id ", imdbId);
  optionsOMDB.params.i = imdbId;
  const cacheData = omdbCache.get(imdbId);

  if (!fetchOMDB) {
    res.json({
      Plot: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
    });
  } else {
    if (cacheData) {
      console.log("using omdb cache");
      res.json(cacheData);
    } else {
      if (limit < 50) {
        console.log("Fetch OMDB");
        limit++;
        const response = await axios.request(optionsOMDB);
        const results = response.data;
        console.log(results);
        omdbCache.set(imdbId, results);
        res.json(results);
      }
    }
  }
});

app.listen(4000);
