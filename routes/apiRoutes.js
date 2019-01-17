//Dependencies
const axios = require("axios");
const cheerio = require("cheerio");

//Require data models
const db = require("../models");

module.exports = function(app) {

  //PUT route to update saved status on "save" button click
  app.put("/api/save/:id", function(req, res) {
    //Find article by id and update saved status
    db.Article.update({ _id : req.params.id }, {$set: {saved: true}})
    .then(function(dbArticle) {
      res.json(dbArticle);
    })
    .catch(function(err) {
      // If an error occurred, send it to the client
      res.json(err);
    });
  })

  //DELETE route to update saved status on "save" button click
  app.delete("/api/delete/:id", function(req, res) {
    //Find article by id and update saved status
    db.Article.remove({ _id : req.params.id })
    .then(function(dbArticle) {
      res.json(dbArticle);
    })
    .catch(function(err) {
      // If an error occurred, send it to the client
      res.json(err);
    });
  })

};