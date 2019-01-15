//Dependencies
const express = require("express");
const logger = require("morgan");
const mongoose = require("mongoose");
const axios = require("axios");
const cheerio = require("cheerio");

//Require data models
const db = require("./models");

const PORT = 3013;

//Initialize express
const app = express();

//Handlebars
const exphbs = require("express-handlebars");
app.engine("handlebars", exphbs({ defaultLayout: "main" }));
app.set("view engine", "handlebars");

//Middleware
app.use(logger("dev"));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static("public"));

//Connect to Mongo DB
mongoose.connect("mongodb://localhost/dailyAbyss", { useNewUrlParser: true });

//ROUTES

//GET route for scraping Truthout website
app.get("/", function(req, res) {
  //Grab html body
  axios.get("https://www.truthout.org/latest/").then(function(response) {
    //Load into cheerio
    var $ = cheerio.load(response.data);
    //Grab every h3 within an article tag
    $("div.archive-text").each(function(i, element) {
      //create empty result object
      var result = {};
      //add title, summary, and href of every link to object
      result.title = $(element)
        .find("h3.entry-title")
        .find("a")
        .text();
      result.summary = $(element)
        .children("div.entry-summary")
        .text()
        .slice(2, -2);
      result.link = $(element)
        .find("h3.entry-title")
        .find("a")
        .attr("href");

      //Create new Article using result object
      db.Article.create(result)
        .then(function(dbArticle) {
          console.log(dbArticle);
        })
        .catch(function(err) {
          console.log(err);
        });
    });
    //Send scrape confirmation to client
    res.send("Scrape Complete");
  });
});

//GET route to find and render saved articles
app.get("/saved", function(req, res) {
  //Get all articles and render to index view
  db.Article.find({})
  .then(function(dbArticle) {
    //Make data object for handlebars
    var hbsObject = {
      articles: dbArticle
    };
    //log new data object to server console
    console.log(hbsObject);
    //render view with data
    res.render("index", hbsObject);
  })
  .catch(function(err) {
    // If an error occurred, send it to the client
    res.json(err);
  });
});


//Start server
app.listen(PORT, function() {
  console.log("App listening on port " + PORT);
});





