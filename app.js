const express = require("express");
const bodyParser = require("body-parser");
const app = express();

var items = ["Beer", "Soda"];

//using express
app.use(bodyParser.urlencoded({extended: true}));

app.set('view engine', 'ejs');

app.get("/", function(req, res){
  var today  = new Date();
  var options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
  var day = today.toLocaleDateString("en-US", options);

  //EJS render looks for list file in views folder
  //kindOfDay is a variable in our list.EJS
  // day is a variable in our node app.js
  res.render("list", {
    kindOfDay: day,
    newListItems: items
  });

  app.post("/", function(req, res){
    newItem = req.body.item;
    items.push(newItem);
    res.redirect("/");
  });
});

app.listen(3000, function(){
    console.log("listening to port 3000");
});
