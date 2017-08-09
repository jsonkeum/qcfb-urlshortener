var mongo = require('mongodb').MongoClient;
//DB URI path is hidden
var MONGODB_URI = 'mongodb://'+process.env.USER+':'+process.env.PASS+'@'+process.env.HOST+':'+process.env.DB_PORT+'/'+process.env.DB;
var express = require('express');
var app = express();
var answer = require("./answer.js");
var validator = require("./validator.js");
var codegenerator = require("./codegenerator.js");

//Connects to database hosted elsewhere
mongo.connect(MONGODB_URI, function(err, db){
  if(err) throw err;

  //public folder used for serving static pages
  app.use(express.static('public'));
  app.get("/", function (req, res) {
    res.sendFile(__dirname + '/views/index.html');
  });
  //declare main url directory and the other containing the sequence
  var main = db.collection(process.env.COLLECTION);
  var sub = db.collection(process.env.COLLECTIONTWO);

  //handle new url input requests. (*) ensures that app captures the entire string input
  app.get("/new/:url(*)", function (req,res) {
    let url = req.params.url;
    //Validator module ensures that the url has correct/valid format
    if(!validator(url)){
      res.send(answer(true, null, url, null));
      return;
    }

    //Function first searches the db to see whether the url already exists and if so, returns the data. Otherwise it generates the next sequence number as
    //a shortcut code, creates a new record and returns the data as response.
    main.find({originalurl:url}).toArray(function(err, docs){
      if(err) throw err;
      if(docs.length > 0){
        res.send(answer(null,null,docs[0].originalurl, docs[0].shortcut));
      } else {
        sub.findOneAndUpdate(
          {"_id":process.env.COUNTERID},
          {$inc : {"counter":1}},
          function(err, doc){
            var obj = {
              originalurl:url,
              shortcut:codegenerator(doc.value.counter)
            };
            main.insert(obj, function (err, data) {
              if(err) throw err;
              res.send(answer(null,null,obj.originalurl, obj.shortcut))
            });
        });
      }
    });
  });

  //Function takes in four digit shortcut code as a param and searches through the db. If it exists, response redirects to the corresponding original url. Else, returns an error obj.
  app.get("/:id", function(req, res){
    let shortcut = req.params.id;
    main.find({shortcut:shortcut}).toArray(function(err, docs){
      if(err) throw err;
      if(docs.length > 0){
        res.redirect(docs[0].originalurl);
      } else {
        res.send(answer(null, true, null, shortcut));
      };
    });
  });

  //Express server listener
  var listener = app.listen(process.env.PORT, function () {
    console.log('Your app is listening on port ' + listener.address().port);
  });
});
